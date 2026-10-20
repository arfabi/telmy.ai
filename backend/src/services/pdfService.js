/**
 * Telmy Backend — Universal PDF Form Explainer Service
 * Powered by Google Gemini Native Multimodal Document Processing (gemini-3.5-flash-lite)
 * 
 * Ingests PDF forms (visas, government applications, power of attorney, permits)
 * and extracts structured section-by-section guidance, realistic input examples,
 * and essential supporting document checklists.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import { getFirestore } from '../config/firebase.js';

/**
 * Build the system prompt instructing Gemini to analyze the PDF or Image form
 */
function buildPdfPrompt(targetLanguage = 'en') {
  return `You are Telmy.ai, an empathetic, expert multilingual AI Form Companion specialized in decoding complex legal, bureaucratic, visa, scholarship, and government application documents (both digital PDFs and physical scanned/photographed forms).

TASK:
Analyze the provided document (PDF or scanned/camera image) thoroughly and produce a structured, human-friendly, step-by-step guidance walkthrough in the target language (${targetLanguage}).

MULTIMODAL CAPABILITIES & GUIDELINES:
1. Support both digital vector PDFs and camera photos/scans of physical paperwork (including angled shots, slight shadows, official stamps, physical checkboxes, or handwritten marks).
2. For each detected field, explain dense bureaucratic/legal requirements in warm, everyday plain language.
3. Provide realistic, properly formatted dummy examples for each input field (e.g. valid date formats, address formats, ID numbers).
4. Warn against common pitfalls and errors that frequently trigger official application rejections.
5. If applicable, provide clear notes for foreign passport holders or non-residents.
6. Handwriting & Scan Ambiguity: If any part of the form contains handwritten text, faint ink, or ambiguous markings, flag it in "uncertaintyNotice" so the applicant is advised to verify.
7. Extract an exact checklist of supporting documents (e.g. photos, bank statements, apostille, transcripts) required.

OUTPUT FORMAT:
You MUST reply strictly with a valid JSON object (no markdown code blocks, no text before or after).
The JSON MUST follow this exact schema:

{
  "documentTitle": "Official name of the form",
  "issuingAuthority": "Name of the ministry, embassy, or institution",
  "estimatedTime": "Estimated time to complete (e.g. 15-20 minutes)",
  "summary": "Warm 2-sentence summary explaining the purpose of this form and who must submit it.",
  "sections": [
    {
      "id": "section_1",
      "title": "Section / Page Title (e.g. Applicant Information)",
      "pageNumber": 1,
      "description": "Brief plain-language overview of this section",
      "fields": [
        {
          "name": "field_identifier",
          "label": "Field Question as printed on the PDF/Form",
          "type": "text | checkbox | radio | select | date",
          "options": ["Option 1", "Option 2"],
          "required": true,
          "meaning": "What this field actually asks for in plain simple terms",
          "example": "A realistic, properly formatted dummy example",
          "pitfall": "Most common mistake that leads to rejection",
          "pageNumber": 1,
          "targetKeywords": "Exact 2-5 words printed on the form near this field to locate it on the page",
          "foreignerNote": "Special instruction if applicant is a foreign citizen or non-resident (or null)",
          "uncertaintyNotice": "Specific note if handwriting, scan skew, or stamp is ambiguous (or null)"
        }
      ]
    }
  ],
  "requiredAttachments": [
    {
      "item": "Document name (e.g. Passport Photograph)",
      "specs": "Specific dimensions, validity, or certified copy rules (e.g. 3.5 x 4.5 cm white background, taken within 6 months)"
    }
  ],
  "helpfulTips": [
    "Practical advice for successfully submitting this specific form (e.g. use black ink if handwritten, do not fold the page)"
  ]
}`;
}

/**
 * Fallback response if AI is temporarily unavailable or limits are reached
 */
function generateFallbackPdfGuidance(fileName = 'Application Form.pdf', targetLanguage = 'en') {
  return {
    documentTitle: fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
    issuingAuthority: 'Official Government / Consular Portal',
    estimatedTime: '15-25 minutes',
    summary: 'This official document requires careful attention to identity verification and valid supporting paperwork. Telmy is here to guide you through every page.',
    sections: [
      {
        id: 'sec_1',
        title: 'Section 1: Applicant Identity & Contact',
        pageNumber: 1,
        description: 'Provide your full legal personal details exactly as they appear on your passport or official national ID card.',
        fields: [
          {
            name: 'full_name',
            label: 'Full Legal Name (Surname, Given Names)',
            required: true,
            meaning: 'Write your complete legal name. Do not use abbreviations or unofficial nicknames.',
            example: 'ALEXANDER SMITH',
            pitfall: 'Do not misspell or swap surname and given name order.',
            foreignerNote: 'Must strictly match the Machine Readable Zone (MRZ) on your passport.'
          },
          {
            name: 'dob_id',
            label: 'Date of Birth & National ID / Passport Number',
            required: true,
            meaning: 'Your birth date and primary official identification number.',
            example: '1995-08-24 | PASSPORT: A12345678',
            pitfall: 'Ensure date format matches the requested standard (YYYY-MM-DD or DD/MM/YYYY).',
            foreignerNote: 'Foreign applicants must enter their international passport number.'
          }
        ]
      },
      {
        id: 'sec_2',
        title: 'Section 2: Purpose & Declarations',
        pageNumber: 2,
        description: 'Detail your purpose of application, duration, and legal declarations.',
        fields: [
          {
            name: 'purpose',
            label: 'Purpose of Visit / Application Scope',
            required: true,
            meaning: 'State clearly why you are applying (e.g. Tourism, Business Meeting, University Study).',
            example: 'Attending academic conference from Oct 12 to Oct 19',
            pitfall: 'Avoid vague one-word answers like "Holiday" if a specific itinerary is asked.',
            foreignerNote: 'Ensure your stated purpose aligns with your visa category.'
          }
        ]
      }
    ],
    requiredAttachments: [
      {
        item: 'Valid Passport / Government ID',
        specs: 'Must be valid for at least 6 months beyond the intended date of stay with 2 blank pages.'
      },
      {
        item: 'Recent Passport-Sized Photographs',
        specs: 'Color photograph with neutral expression and plain white background, taken within 6 months.'
      },
      {
        item: 'Proof of Financial Means / Supporting Letter',
        specs: 'Recent bank statement or official letter of sponsorship.'
      }
    ],
    helpfulTips: [
      'Ensure all handwriting is in neat capital letters using black or dark blue ink if filling physically.',
      'Do not use correction fluid (white-out) on official forms; re-print if a significant error occurs.',
      'Double check that all dates match across your ticket, hotel booking, and passport.'
    ]
  };
}

const templateMemoryCache = new Map();

/**
 * Main function: Explain PDF or Image Form using Gemini Multimodal Document Processing
 * Implements Priority 4.4: Universal Document & PDF Template Cache (Zero-Token Re-Use)
 * 
 * @param {string} base64Payload - Base64 encoded document string
 * @param {string} fileName - Original file name of the document
 * @param {string} targetLanguage - Target language code (e.g. 'en', 'hi', 'id', 'ja')
 * @param {string} mimeType - MIME type ('application/pdf', 'image/jpeg', etc.)
 * @returns {Promise<object>} Structured guidance JSON
 */
export async function explainPdfForm(base64Payload, fileName = 'Document.pdf', targetLanguage = 'en', mimeType = 'application/pdf') {
  if (!base64Payload) {
    throw new Error('Base64 document payload is required');
  }

  // Strip data URL prefix if present (e.g. "data:application/pdf;base64," or "data:image/jpeg;base64,")
  let cleanBase64 = base64Payload;
  let resolvedMime = mimeType || 'application/pdf';

  const dataUriMatch = base64Payload.match(/^data:([^;]+);base64,(.+)$/);
  if (dataUriMatch) {
    resolvedMime = dataUriMatch[1];
    cleanBase64 = dataUriMatch[2].trim();
  } else {
    cleanBase64 = base64Payload.trim();
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'jpg' || ext === 'jpeg') resolvedMime = 'image/jpeg';
    else if (ext === 'png') resolvedMime = 'image/png';
    else if (ext === 'webp') resolvedMime = 'image/webp';
    else if (ext === 'pdf') resolvedMime = 'application/pdf';
  }

  // Priority 4.4: Tingkat 1 (Exact SHA-256 Hash Check)
  const fileHashSha256 = crypto.createHash('sha256').update(cleanBase64).digest('hex');
  const cacheKey = `${fileHashSha256}:${targetLanguage}`;

  if (templateMemoryCache.has(cacheKey)) {
    console.log(`[Document Cache: ZERO-TOKEN] SHA-256 Memory Hit for ${fileName} (${fileHashSha256.slice(0, 12)}...)`);
    return {
      success: true,
      data: templateMemoryCache.get(cacheKey),
      meta: {
        fileName,
        fileHashSha256,
        zeroToken: true,
        cached: true,
        targetLanguage
      }
    };
  }

  const { db, isFirebaseConnected } = getFirestore();
  if (isFirebaseConnected && db) {
    try {
      const docRef = db.collection('document_templates').doc(fileHashSha256);
      const snapshot = await docRef.get();
      if (snapshot.exists) {
        const cachedDoc = snapshot.data();
        if (cachedDoc.guidanceByLanguage?.[targetLanguage]) {
          const cachedGuidance = cachedDoc.guidanceByLanguage[targetLanguage];
          templateMemoryCache.set(cacheKey, cachedGuidance);
          console.log(`[Document Cache: ZERO-TOKEN] Firestore Hit for ${fileName} (${fileHashSha256.slice(0, 12)}...)`);
          return {
            success: true,
            data: cachedGuidance,
            meta: {
              fileName,
              fileHashSha256,
              zeroToken: true,
              cached: true,
              targetLanguage
            }
          };
        }
      }
    } catch (e) {
      console.warn('[Document Cache] Firestore lookup notice:', e.message);
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[PDF Service] GEMINI_API_KEY not configured, returning simulated fallback guidance');
    return generateFallbackPdfGuidance(fileName, targetLanguage);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const promptText = buildPdfPrompt(targetLanguage);
    const documentPart = {
      inlineData: {
        data: cleanBase64,
        mimeType: resolvedMime
      }
    };

    console.log(`[PDF Service] Sending document "${fileName}" (type: ${resolvedMime}, ${Math.round(cleanBase64.length / 1024)} KB base64) to Gemini model "${modelName}"...`);
    const startTime = Date.now();

    const result = await model.generateContent([promptText, documentPart]);
    const responseText = result.response.text();
    const duration = Date.now() - startTime;
    console.log(`[PDF Service] Gemini responded in ${duration}ms`);

    // Parse JSON safely
    const parsed = JSON.parse(responseText.trim());

    // Save to memory cache
    templateMemoryCache.set(cacheKey, parsed);

    // Save to Firestore asynchronously
    if (isFirebaseConnected && db) {
      db.collection('document_templates').doc(fileHashSha256).set({
        fileHashSha256,
        documentTitle: parsed.documentTitle || fileName,
        issuingAuthority: parsed.issuingAuthority || 'Government / Official Portal',
        mimeType: resolvedMime,
        createdAt: new Date().toISOString(),
        guidanceByLanguage: {
          [targetLanguage]: parsed
        }
      }, { merge: true }).catch(() => {});
    }

    return {
      success: true,
      data: parsed,
      meta: {
        fileName,
        fileHashSha256,
        model: modelName,
        durationMs: duration,
        targetLanguage
      }
    };
  } catch (error) {
    console.error('[PDF Service] Error processing document with Gemini:', error.message);
    return {
      success: true,
      data: generateFallbackPdfGuidance(fileName, targetLanguage),
      meta: {
        fileName,
        fallbackMode: true,
        errorNotice: error.message
      }
    };
  }
}

/**
 * Priority 8.2: Extract structured identity entities from uploaded KTP, Passport, or Diploma
 * Zero Document Retention: Buffer is discarded immediately after LLM execution.
 */
export async function extractVaultEntitiesFromDocument(base64Payload, fileName = 'Document.pdf', mimeType = 'application/pdf') {
  if (!base64Payload) {
    throw new Error('Base64 payload required for vault document ingestion');
  }

  let cleanBase64 = base64Payload;
  let resolvedMime = mimeType || 'application/pdf';

  const dataUriMatch = base64Payload.match(/^data:([^;]+);base64,(.+)$/);
  if (dataUriMatch) {
    resolvedMime = dataUriMatch[1];
    cleanBase64 = dataUriMatch[2].trim();
  } else {
    cleanBase64 = base64Payload.trim();
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'jpg' || ext === 'jpeg') resolvedMime = 'image/jpeg';
    else if (ext === 'png') resolvedMime = 'image/png';
    else if (ext === 'webp') resolvedMime = 'image/webp';
    else if (ext === 'pdf') resolvedMime = 'application/pdf';
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1
    }
  });

  const prompt = `You are Telmy.ai Smart Document Ingestion Engine.
Analyze this official identity document (e.g. National ID / KTP / e-KTP, Passport, Academic Diploma, Transcript, Language Certificate, Family Card).
Extract all official personal data and entity values accurately without hallucination.

Return ONLY a valid JSON object following this exact schema:
{
  "documentType": "PASSPORT" | "ID_CARD" | "DIPLOMA" | "TRANSCRIPT" | "CERTIFICATE" | "OTHER",
  "documentName": "e.g. Passport of Indonesia, KTP Republik Indonesia, Ijazah S1",
  "fields": [
    {
      "key": "canonical_key_name (e.g. full_name, passport_number, nik, birth_date, birth_place, nationality, gender, address, issue_date, expiry_date, university, gpa, degree, major, score)",
      "label": "Human readable field label (e.g. Nama Lengkap, Nomor Paspor, IPK)",
      "value": "Exact string extracted from the document",
      "category": "identity" | "travel" | "education" | "contact",
      "aliases": ["array", "of", "likely", "form", "labels", "or", "synonyms"]
    }
  ]
}`;

  const documentPart = {
    inlineData: {
      data: cleanBase64,
      mimeType: resolvedMime
    }
  };

  try {
    const result = await model.generateContent([prompt, documentPart]);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText.trim());

    return {
      success: true,
      documentType: parsed.documentType || 'OTHER',
      documentName: parsed.documentName || fileName,
      fields: Array.isArray(parsed.fields) ? parsed.fields : []
    };
  } catch (err) {
    console.error('[Vault OCR] Error extracting entities with Gemini:', err);
    throw err;
  }
}


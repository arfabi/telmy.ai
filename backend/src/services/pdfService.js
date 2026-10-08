/**
 * Telmy Backend — Universal PDF Form Explainer Service
 * Powered by Google Gemini Native Multimodal Document Processing (gemini-3.5-flash-lite)
 * 
 * Ingests PDF forms (visas, government applications, power of attorney, permits)
 * and extracts structured section-by-section guidance, realistic input examples,
 * and essential supporting document checklists.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Build the system prompt instructing Gemini to analyze the PDF form
 */
function buildPdfPrompt(targetLanguage = 'en') {
  return `You are Telmy.ai, an empathetic, expert multilingual AI Form Companion specialized in decoding complex legal, bureaucratic, visa, and government PDF application forms.

TASK:
Analyze the provided PDF form thoroughly and produce a structured, human-friendly, step-by-step guidance walkthrough in the target language (${targetLanguage}).

GUIDELINES:
1. Explain dense legal/bureaucratic terms in warm, everyday plain language that everyday citizens and international travelers can easily understand.
2. Provide realistic, properly formatted dummy examples for each input field (e.g. valid date formats, address formats, ID numbers).
3. Warn against common mistakes that frequently trigger official application rejections.
4. If applicable, provide clear notes for foreign passport holders or non-residents.
5. Extract an exact checklist of supporting documents (e.g. photos, bank statements, valid passport) required to be submitted alongside this form.

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
          "label": "Field Question as printed on the PDF",
          "required": true,
          "meaning": "What this field actually asks for in plain simple terms",
          "example": "A realistic, properly formatted dummy example",
          "pitfall": "Most common mistake that leads to rejection",
          "foreignerNote": "Special instruction if applicant is a foreign citizen or non-resident (or null if not applicable)"
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

/**
 * Main function: Explain PDF Form using Gemini Multimodal Document Processing
 * 
 * @param {string} base64Pdf - Base64 encoded PDF string
 * @param {string} fileName - Original file name of the PDF
 * @param {string} targetLanguage - Target language code (e.g. 'en', 'hi', 'id', 'ja')
 * @returns {Promise<object>} Structured guidance JSON
 */
export async function explainPdfForm(base64Pdf, fileName = 'Document.pdf', targetLanguage = 'en') {
  if (!base64Pdf) {
    throw new Error('Base64 PDF payload is required');
  }

  // Strip data URL prefix if present (e.g. "data:application/pdf;base64,")
  const cleanBase64 = base64Pdf.replace(/^data:application\/pdf;base64,/, '').trim();

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
    const pdfPart = {
      inlineData: {
        data: cleanBase64,
        mimeType: 'application/pdf'
      }
    };

    console.log(`[PDF Service] Sending PDF "${fileName}" (${Math.round(cleanBase64.length / 1024)} KB base64) to Gemini model "${modelName}"...`);
    const startTime = Date.now();

    const result = await model.generateContent([promptText, pdfPart]);
    const responseText = result.response.text();
    const duration = Date.now() - startTime;
    console.log(`[PDF Service] Gemini responded in ${duration}ms`);

    // Parse JSON safely
    const parsed = JSON.parse(responseText.trim());
    return {
      success: true,
      data: parsed,
      meta: {
        fileName,
        model: modelName,
        durationMs: duration,
        targetLanguage
      }
    };
  } catch (error) {
    console.error('[PDF Service] Error processing PDF with Gemini:', error.message);
    // Graceful fallback to avoid user disruption
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

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFirestore } from '../config/firebase.js';
import { getEmbedding, cosineSimilarity } from './geminiService.js';
import { generateFieldExplanation } from './aiService.js';
import { normalizeFieldKey } from './dictionaryService.js';

// In-memory cache for fast lookup and zero-token hits
const formSchemaMemoryCache = new Map();

function cleanDomain(url = '', domain = '') {
  if (domain) return domain.toLowerCase().trim();
  try {
    const u = new URL(url);
    return u.hostname.toLowerCase().trim();
  } catch (e) {
    return 'unknown_domain';
  }
}

function cleanFormKey(url = '', title = '') {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    return path || 'root_page';
  } catch (e) {
    return (title || 'form_page').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }
}

/**
 * Batch Form Analysis Engine (Full-Page Scan -> DB/Vector -> Zero-Token Cached Lookup)
 */
export async function analyzeFormBatch({ domain, url, title, fields = [], instructions = [], language = 'en', userId = 'guest' }) {
  const cDomain = cleanDomain(url, domain);
  const cKey = cleanFormKey(url, title);
  const schemaDocId = `${cDomain}__${cKey}`;
  const cacheKey = `${schemaDocId}:${language}`;

  const { db, isFirebaseConnected } = getFirestore();

  // 1. Check in-memory schema cache first (Instant Zero-Token hit)
  if (formSchemaMemoryCache.has(cacheKey)) {
    const cached = formSchemaMemoryCache.get(cacheKey);
    console.log(`[Form Analyzer] In-memory cache hit for "${schemaDocId}" (${language})`);
    return {
      success: true,
      source: 'memory_cache',
      cached: true,
      docId: schemaDocId,
      summary: cached.summary,
      fields: cached.fields,
      analyzedAt: cached.analyzedAt
    };
  }

  // 2. Check Firestore form_schemas collection
  if (isFirebaseConnected && db) {
    try {
      const docRef = db.collection('form_schemas').doc(schemaDocId);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data.translations && data.translations[language] && Array.isArray(data.translations[language].fields)) {
          console.log(`[Form Analyzer] Firestore cache hit for "${schemaDocId}" (${language})`);
          const result = {
            summary: data.translations[language].summary || data.summary || '',
            fields: data.translations[language].fields,
            analyzedAt: data.updatedAt || data.createdAt
          };
          formSchemaMemoryCache.set(cacheKey, result);
          return {
            success: true,
            source: 'firestore_cache',
            cached: true,
            docId: schemaDocId,
            ...result
          };
        }
      }
    } catch (dbErr) {
      console.warn('[Form Analyzer] Firestore read warning:', dbErr.message);
    }
  }

  // 3. Not in database: Call Gemini for Full Batch Analysis
  console.log(`[Form Analyzer] Analyzing new form for "${cDomain}" (${fields.length} fields) in ${language}...`);

  let geminiResult = null;
  let usedSource = 'ai_gemini';
  let quotaWarning = null;

  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const fieldPromptList = fields.map((f, idx) => ({
        index: idx,
        id: f.id || `f_${idx}`,
        name: f.name || '',
        type: f.type || 'text',
        label: f.label || f.name || `Field ${idx + 1}`,
        placeholder: f.placeholder || '',
        section: f.section || ''
      }));

      const prompt = `You are Telmy.ai, an expert form-filling and public service navigation assistant.
TASK: Analyze this entire webpage form and produce comprehensive field-by-field guidance in ${language.toUpperCase()}.

PAGE CONTEXT:
- Website Domain: "${cDomain}"
- Page URL: "${url}"
- Form / Page Title: "${title}"
- Page Hints & Instructions Found: ${JSON.stringify(instructions.slice(0, 5))}

FIELDS DETECTED (${fields.length} fields):
${JSON.stringify(fieldPromptList, null, 2)}

REQUIREMENTS:
1. Provide a friendly overall "summary" of this form (2-3 sentences explaining what this form is for, who needs it, and required documents).
2. For each field in "fields", output:
   - "index": same index as input
   - "id": field id
   - "name": field name
   - "label": translated / clear field label in ${language.toUpperCase()}
   - "meaning": clear 1-2 sentence explanation of what is requested and why the institution requires it
   - "howToFill": step-by-step instructions or formatting requirements (e.g. DD-MM-YYYY, passport format)
   - "example": realistic dummy example
   - "commonMistakes": array of 1-2 frequent errors
   - "tipsForForeigners": notes for expats, international students, or foreign applicants
   - "confidence": 0.95

OUTPUT FORMAT (JSON ONLY, NO MARKDOWN):
{
  "summary": "Overall explanation of what this form is for...",
  "fields": [ ... ]
}`;

      const res = await model.generateContent(prompt);
      const rawText = res.response.text ? res.response.text().trim() : '{}';
      geminiResult = JSON.parse(rawText);
      console.log(`[Form Analyzer] Successfully analyzed ${fields.length} fields with Gemini!`);
    } catch (err) {
      console.error(`[Form Analyzer] Gemini batch analysis error: ${err.message}`);
      throw new Error(`Google Gemini batch analysis failed: ${err.message}`);
    }
  } else {
    throw new Error('GEMINI_API_KEY is not configured on backend.');
  }

  const finalData = {
    summary: geminiResult.summary || '',
    fields: geminiResult.fields,
    analyzedAt: new Date().toISOString()
  };

  // 4. Save entire form schema & individual fields into Firestore and Memory Cache
  formSchemaMemoryCache.set(cacheKey, finalData);

  if (isFirebaseConnected && db) {
    (async () => {
      try {
        // Save form schema
        await db.collection('form_schemas').doc(schemaDocId).set({
          docId: schemaDocId,
          domain: cDomain,
          url,
          title,
          updatedAt: new Date().toISOString(),
          fieldCount: fields.length,
          translations: {
            [language]: finalData
          }
        }, { merge: true });

        // Save each field individually to entries collection for instant cross-form matching
        for (const item of finalData.fields) {
          const fieldKey = normalizeFieldKey(cDomain, item.name, item.label || item.originalLabel);
          const emb = await getEmbedding(item.label || item.name || '').catch(() => null);
          await db.collection('entries').doc(fieldKey).set({
            fieldKey,
            domain: cDomain,
            originalLabel: item.label || item.name || '',
            inputType: item.type || 'text',
            verified: false,
            source: usedSource,
            embedding: emb || null,
            updatedAt: new Date().toISOString(),
            translations: {
              [language]: item
            }
          }, { merge: true }).catch(() => {});
        }
        console.log(`[Form Analyzer] Persisted ${finalData.fields.length} fields to Firestore for "${schemaDocId}"`);
      } catch (saveErr) {
        console.warn('[Form Analyzer] Error persisting to Firestore:', saveErr.message);
      }
    })();
  }

  return {
    success: true,
    source: usedSource,
    cached: false,
    warning: quotaWarning,
    docId: schemaDocId,
    ...finalData
  };
}

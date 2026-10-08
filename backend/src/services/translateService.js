/**
 * Telmy Backend — Context-Aware Full Page Translation Service
 * 100% Powered by Google Gemini (Google AI Native)
 * 
 * Implements 4-layer prompt engineering:
 * 1. Domain & Context Awareness (bureaucracy, civil registry, visa, public service)
 * 2. Glossary Rules (Preserve official abbreviations e.g. NIK, KTP, NPWP, KITAS, SKCK)
 * 3. UI/UX Standards (Industry conventions: "Daftar" -> "Sign Up", "Kirim" -> "Submit", etc.)
 * 4. Deterministic Key-Value Structured Output matching DOM extraction tokens.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRelevantGlossaryRules } from './bureaucraticService.js';

// Standard UI/UX conventions mapping
const UI_UX_CONVENTIONS = `
UI/UX INDUSTRY WEB CONVENTIONS (Do NOT translate literally):
- "Daftar" -> "Sign Up" or "Register" (NEVER translate to "List")
- "Masuk" -> "Log In" or "Sign In" (NEVER translate to "Enter")
- "Keluar" -> "Log Out" or "Sign Out"
- "Simpan" -> "Save"
- "Batal" -> "Cancel"
- "Kembali" -> "Back"
- "Lanjut" / "Selanjutnya" -> "Next" or "Continue"
- "Kirim" / "Ajukan" -> "Submit" or "Apply"
- "Unggah" / "Upload Berkas" -> "Upload Document"
- "Unduh" -> "Download"
- "Cari" -> "Search"
- "Ubah" / "Edit" -> "Edit"
- "Hapus" -> "Delete"
- "Pilih" -> "Select"
`;

/**
 * Build the 4-layer system prompt for page translation with Dynamic Glossary RAG
 */
function buildTranslationPrompt(pageContext, targetLanguage, texts) {
  const langUpper = (targetLanguage || 'en').toUpperCase();
  const domain = pageContext.domain || 'Public Service Portal';
  const title = pageContext.title || 'Digital Government Form';

  // Priority 4.3: Dynamic In-Context RAG Injection of Top Relevant Bureaucratic Terms
  const dynamicGlossary = getRelevantGlossaryRules(texts, 5);

  return `You are Telmy.ai, an expert multilingual web localization and UI/UX translation engine specialized in public service, bureaucratic, and legal forms.

TASK:
Translate the provided UI text tokens into ${langUpper}.

CONTEXT STATEMENT:
- Website Domain: "${domain}"
- Page Title: "${title}"
- Target Language: ${langUpper}

${dynamicGlossary}

${UI_UX_CONVENTIONS}

STRICT REQUIREMENTS:
1. Maintain exact JSON keys matching the input tokens.
2. Provide natural, professional UI terminology suitable for modern web applications.
3. Keep concise button labels short (1-3 words) to prevent breaking website layouts.
4. Output ONLY a valid JSON object where every key maps to its translated string. Do not wrap in markdown or add explanations.

INPUT TOKENS JSON:
${JSON.stringify(texts, null, 2)}
`;
}

/**
 * Call Gemini 3.5 Flash-Lite (Google AI Native)
 */
async function callGeminiTranslation(pageContext, targetLanguage, texts) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2
    }
  });

  const prompt = buildTranslationPrompt(pageContext, targetLanguage, texts);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text() ? response.text().trim() : '{}';
  
  const translations = JSON.parse(rawText);
  return {
    translations,
    provider: `gemini (${modelName})`,
    source: 'ai_gemini'
  };
}

/**
 * Smart Local Heuristic Fallback
 * Translates known common Indonesian bureaucratic and UI words if AI endpoints are unreachable.
 */
function createHeuristicTranslation(texts, targetLanguage) {
  const isEn = targetLanguage === 'en';
  const dictionary = {
    'daftar': isEn ? 'Register' : 'Daftar',
    'masuk': isEn ? 'Log In' : 'Masuk',
    'keluar': isEn ? 'Log Out' : 'Keluar',
    'simpan': isEn ? 'Save' : 'Simpan',
    'batal': isEn ? 'Cancel' : 'Batal',
    'kembali': isEn ? 'Back' : 'Kembali',
    'lanjut': isEn ? 'Continue' : 'Lanjut',
    'selanjutnya': isEn ? 'Next' : 'Selanjutnya',
    'kirim': isEn ? 'Submit' : 'Kirim',
    'unggah': isEn ? 'Upload' : 'Unggah',
    'unduh': isEn ? 'Download' : 'Unduh',
    'nama lengkap': isEn ? 'Full Name' : 'Nama Lengkap',
    'tempat lahir': isEn ? 'Place of Birth' : 'Tempat Lahir',
    'tanggal lahir': isEn ? 'Date of Birth' : 'Tanggal Lahir',
    'nomor induk kependudukan': isEn ? 'National ID Number (NIK)' : 'Nomor Induk Kependudukan (NIK)',
    'nik': isEn ? 'NIK (National ID Number)' : 'NIK',
    'ktp': isEn ? 'Identity Card (KTP)' : 'KTP',
    'paspor': isEn ? 'Passport' : 'Paspor',
    'alamat': isEn ? 'Address' : 'Alamat',
    'email': 'Email',
    'nomor telepon': isEn ? 'Phone Number' : 'Nomor Telepon',
    'unggah berkas': isEn ? 'Upload Document' : 'Unggah Berkas',
    'permohonan': isEn ? 'Application / Request' : 'Permohonan'
  };

  const translations = {};
  for (const [key, val] of Object.entries(texts)) {
    const lower = String(val).toLowerCase().trim();
    let replaced = val;
    for (const [dictWord, transWord] of Object.entries(dictionary)) {
      if (lower === dictWord) {
        replaced = transWord;
        break;
      }
    }
    translations[key] = replaced;
  }

  return {
    translations,
    provider: 'local_heuristic_fallback',
    source: 'heuristic'
  };
}

/**
 * Main Translate Page Handler
 * 100% Google Gemini (Google AI Native) with Smart Local Heuristic Fallback
 */
export async function translatePageTexts({ pageContext = {}, targetLanguage = 'en', texts = {} }) {
  const tokenCount = Object.keys(texts).length;
  if (tokenCount === 0) {
    return { translations: {}, count: 0, provider: 'none' };
  }

  console.log(`[Translate Service] Translating ${tokenCount} DOM tokens to ${targetLanguage} for domain "${pageContext.domain || 'N/A'}"...`);

  // 1. Try Gemini (Google AI Native)
  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await callGeminiTranslation(pageContext, targetLanguage, texts);
      console.log(`[Translate Service] Successfully translated with Google Gemini`);
      return {
        ...result,
        count: Object.keys(result.translations).length,
        targetLanguage,
        generatedAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn(`[Translate Service] Gemini translation notice: ${err.message}. Using heuristic fallback...`);
    }
  }

  // 2. Fallback to smart local heuristic dictionary
  console.log(`[Translate Service] Using smart heuristic fallback dictionary`);
  const heuristic = createHeuristicTranslation(texts, targetLanguage);
  return {
    ...heuristic,
    count: Object.keys(heuristic.translations).length,
    targetLanguage,
    generatedAt: new Date().toISOString()
  };
}

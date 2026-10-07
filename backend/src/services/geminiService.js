import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Generate field explanation using Gemini API with structured JSON output.
 * @param {Object} fieldMetadata - { label, name, type, placeholder, section, domain, rules }
 * @param {string} targetLanguage - 'id', 'en', 'zh', 'ja', 'ko'
 * @param {string} pageContext - context of the public form (e.g., 'Layanan Legalisasi Apostille Kemenkumham')
 */
export async function generateFieldExplanation(fieldMetadata, targetLanguage = 'id', pageContext = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY not configured. Returning fallback template.');
    return createStaticFallback(fieldMetadata, targetLanguage);
  }

  const prompt = `
Anda adalah asisten panduan formulir layanan publik dan perizinan pemerintah Indonesia bernama GuideMe.To.
Tugas Anda: Berikan panduan yang sangat jelas, ramah, dan akurat untuk kolom formulir berikut bagi pengguna umum dan WNA.

Informasi Kolom Formulir:
- Label Formulir: "${fieldMetadata.label || fieldMetadata.name || 'Kolom Isian'}"
- Tipe Input: "${fieldMetadata.type || 'text'}"
- Placeholder / Petunjuk: "${fieldMetadata.placeholder || '-'}"
- Bagian / Seksi: "${fieldMetadata.section || 'Informasi Formulir'}"
- Domain Halaman: "${fieldMetadata.domain || 'Layanan Pemerintah'}"
- Aturan Validasi / Mask: "${fieldMetadata.mask || fieldMetadata.validationRules || '-'}"
- Konteks Formulir: "${pageContext || 'Formulir Administrasi dan Pelayanan Publik'}"

Bahasa Target Penjelasan: ${targetLanguage.toUpperCase()} (pilihan: id, en, zh, ja, ko)

Format Keluaran (Wajib format JSON valid saja, tanpa tanda markdown \`\`\`json):
{
  "label": "Nama field yang jelas dalam bahasa target",
  "meaning": "Penjelasan singkat 1-2 kalimat mengenai apa fungsi kolom ini dan mengapa instansi memintanya.",
  "howToFill": "Langkah spesifik cara mengisi, format dokumen yang harus disiapkan, atau aturan khusus.",
  "example": "Contoh isian fiktif yang realistis (JANGAN data pribadi asli).",
  "commonMistakes": [
    "Kesalahan umum pertama yang sering terjadi saat mengisi field ini",
    "Kesalahan umum kedua (misal salah format atau dokumen kedaluwarsa)"
  ],
  "tipsForForeigners": "Catatan khusus jika pemohon adalah WNA atau perwakilan asing (atau panduan dokumen setara).",
  "confidence": 0.95
}
`;

  try {
    const ai = getClient();
    const model = ai.getGenerativeModel({
      model: 'gemini-3.8-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text() ? response.text().trim() : '{}';
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      source: 'ai_draft',
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Gemini] Generation failed, fallback to template:', error.message);
    return createStaticFallback(fieldMetadata, targetLanguage);
  }
}


function createStaticFallback(metadata, lang) {
  const label = metadata.label || metadata.name || 'Kolom Formulir';
  const isEn = lang === 'en';

  return {
    label,
    meaning: isEn 
      ? `This field requires the appropriate details for "${label}".` 
      : `Kolom ini digunakan untuk memasukkan informasi "${label}" sesuai dokumen resmi Anda.`,
    howToFill: isEn
      ? `Enter your data as registered on your official identification or legal document.`
      : `Isikan data sesuai dengan yang tertera pada dokumen resmi identitas atau berkas legal Anda.`,
    example: metadata.placeholder || (isEn ? 'Example Document / Data' : 'Contoh Isian Sesuai Berkas'),
    commonMistakes: isEn
      ? ['Typo in spelling or number mismatch with physical document', 'Uploading wrong page or uncertified scan']
      : ['Salah ketik huruf atau angka tidak sesuai dokumen fisik', 'Mengunggah dokumen yang salah atau belum dilegalisasi'],
    tipsForForeigners: isEn
      ? 'Ensure your passport/KITAS name matches exactly.'
      : 'Bagi WNA, pastikan nama dan nomor sesuai dengan paspor/KITAS aktif.',
    confidence: 0.7,
    source: 'ai_fallback',
    generatedAt: new Date().toISOString()
  };
}

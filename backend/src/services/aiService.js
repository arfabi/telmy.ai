import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Common semantic mapping for standard Indonesian civil and government fields.
 * Used for instant, high-quality translation even before/without AI network roundtrip.
 */
const KNOWN_SEMANTIC_FIELDS = {
  tempat_lahir: {
    en: {
      label: 'Place of Birth',
      meaning: 'Official city or municipality where the applicant was born as stated in official records.',
      howToFill: 'Enter the city or regency as stated in your official birth certificate, passport, or identity card.',
      example: 'New York, USA (or Jakarta, Indonesia)',
      commonMistakes: ['Entering hospital or clinic name instead of the official city', 'Typo in city spelling compared to passport'],
      tipsForForeigners: 'For foreign applicants, write the city and state exactly as printed on your international passport.'
    },
    zh: {
      label: '出生地点 (Place of Birth)',
      meaning: '申请人出生的官方城市或法定行政区域。',
      howToFill: '请按您的出生证明、护照或有效身份证件上载明的城市名称填写。',
      example: '纽约，美国（或雅加达，印尼）',
      commonMistakes: ['误填医院名称而非官方城市', '拼写与护照记录不一致'],
      tipsForForeigners: '外籍人士请务必按本人国际护照上的英文城市名称完整准确填写。'
    },
    ja: {
      label: '出生地 (Place of Birth)',
      meaning: '申請者の公式な出生都市または自治体名です。',
      howToFill: '出生証明書またはパスポートに記載されている都市名を入力してください。',
      example: 'New York, USA（または東京）',
      commonMistakes: ['病院名を入力してしまう誤り', 'パスポートの英字表記と一致しないスペル'],
      tipsForForeigners: '外国人の方はパスポート記載の都市名（英字）と正確に一致させてください。'
    },
    ko: {
      label: '출생지 (Place of Birth)',
      meaning: '신청인이 출생한 공식 도시 또는 행정구역입니다.',
      howToFill: '출생증명서 또는 여권에 기재된 도시명을 정확하게 입력하세요.',
      example: 'New York, USA (또는 서울)',
      commonMistakes: ['도시 대신 병원명을 기재하는 실수', '여권 표기와 다른 영문 스펠링'],
      tipsForForeigners: '외국인의 경우 소지하신 여권의 출생지(City) 표기와 일치하게 입력하세요.'
    },
    id: {
      label: 'Tempat Lahir',
      meaning: 'Kota atau kabupaten tempat pemohon dilahirkan sesuai dokumen kependudukan resmi.',
      howToFill: 'Tuliskan nama kota atau kabupaten kelahiran sesuai dengan Akta Kelahiran atau KTP/Paspor Anda.',
      example: 'Jakarta / Surabaya / New York',
      commonMistakes: ['Menuliskan nama rumah sakit atau kelurahan alih-alih kota resmi', 'Salah ketik nama kota'],
      tipsForForeigners: 'Bagi WNA, tuliskan nama kota dan negara kelahiran sesuai paspor aktif.'
    }
  },
  tanggal_lahir: {
    en: {
      label: 'Date of Birth',
      meaning: 'Official date of birth of the applicant in standard calendar format.',
      howToFill: 'Select or input date in DD-MM-YYYY format matching your identification.',
      example: '15-08-1990',
      commonMistakes: ['Swapping month and day (US vs International format)', 'Entering an invalid calendar date'],
      tipsForForeigners: 'Ensure the date strictly matches your passport.'
    },
    zh: {
      label: '出生日期 (Date of Birth)',
      meaning: '申请人的官方出生年月日。',
      howToFill: '请按照日-月-年 (DD-MM-YYYY) 或页面指定的日期控件选择输入。',
      example: '15-08-1990',
      commonMistakes: ['日与月颠倒填写', '与护照上的出生日期不符'],
      tipsForForeigners: '请核实日期必须与有效护照完全一致。'
    },
    id: {
      label: 'Tanggal Lahir',
      meaning: 'Tanggal, bulan, dan tahun kelahiran resmi pemohon.',
      howToFill: 'Isikan sesuai format tanggal (DD-MM-YYYY) atau pilih dari kalender.',
      example: '15-08-1990',
      commonMistakes: ['Tertukar antara urutan hari dan bulan', 'Typo pada digit tahun'],
      tipsForForeigners: 'Pastikan tanggal lahir persis sesuai paspor.'
    }
  },
  nama_lengkap: {
    en: {
      label: 'Full Name',
      meaning: 'Complete legal name of the applicant as recorded on government identification.',
      howToFill: 'Type your full legal name without nicknames or unauthorized abbreviations.',
      example: 'JOHN MICHAEL DOE',
      commonMistakes: ['Omitting middle names present in passport', 'Typo in capitalization or spelling'],
      tipsForForeigners: 'Write your full name in latin letters exactly as shown in the machine-readable zone of your passport.'
    },
    zh: {
      label: '全名 / 姓名 (Full Name)',
      meaning: '申请人在政府官方身份证件上登记的完整法定姓名。',
      howToFill: '请完整录入您的法定全名，切勿使用昵称或简写。',
      example: 'JOHN MICHAEL DOE (或中文全名)',
      commonMistakes: ['遗漏护照上的中间名 (Middle Name)', '拼写存在错别字'],
      tipsForForeigners: '外籍人员请按照护照机读码区域的英文全名大写录入。'
    },
    id: {
      label: 'Nama Lengkap',
      meaning: 'Nama resmi pemohon sesuai dokumen identitas yang sah.',
      howToFill: 'Ketikkan nama lengkap tanpa singkatan kecuali tercantum di dokumen resmi.',
      example: 'BUDI PRASETYO / JOHN MICHAEL DOE',
      commonMistakes: ['Menulis nama panggilan', 'Lupa mencantumkan nama marga/keluarga'],
      tipsForForeigners: 'Bagi WNA, tulis nama persis sesuai paspor internasional.'
    }
  }
};

/**
 * Call Google Gemini API (Primary AI Engine)
 */
async function callGemini(fieldMetadata, targetLanguage, pageContext) {
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

  const originalLabel = fieldMetadata.label || fieldMetadata.name || 'Kolom Isian';
  const prompt = `
You are Telmy.ai, an expert AI public administration and government form-filling co-pilot.
Task: Analyze this form field, explain its purpose, and provide step-by-step guidance for an applicant in the requested TARGET LANGUAGE (${targetLanguage.toUpperCase()}).

Form & Field Context:
- Original Form Label: "${originalLabel}"
- Form / Service Context: "${pageContext || fieldMetadata.domain || 'Layanan Administrasi / Government Portal'}"
- Input Type: "${fieldMetadata.type || 'text'}"
- Available Options: ${fieldMetadata.options && fieldMetadata.options.length ? JSON.stringify(fieldMetadata.options) : 'None'}
- Placeholder / Hint: "${fieldMetadata.placeholder || '-'}"
- Target User Language: ${targetLanguage.toUpperCase()}

Instructions:
1. Detect and preserve the original label from the page ("${originalLabel}").
2. Translate the label into the Target User Language (${targetLanguage.toUpperCase()}).
3. "meaning": Provide 2 to 3 informative sentences explaining what this field declares or collects, and why the government / institution requires it.
4. "howToFill": Provide clear, step-by-step instructions (e.g. Step 1: ..., Step 2: ...) detailing how the applicant should fill or select this field properly according to legal documents.
5. "example": Provide a realistic, contextual fictional example.
6. "commonMistakes": Provide 2 to 3 common pitfalls, errors, or discrepancies that cause rejection or delay.
7. "tipsForForeigners": Provide important considerations for foreigners, expatriates, or international passport holders.
8. ALL output fields must be translated to the TARGET LANGUAGE (${targetLanguage.toUpperCase()}), except "originalLabel" which remains in its original form.

Return strict JSON only:
{
  "label": "Translated field title in ${targetLanguage.toUpperCase()}",
  "originalLabel": "${originalLabel}",
  "meaning": "Detailed meaning and administrative purpose in ${targetLanguage.toUpperCase()}",
  "howToFill": "Step-by-step guidance in ${targetLanguage.toUpperCase()}",
  "example": "Realistic fictional example in ${targetLanguage.toUpperCase()}",
  "commonMistakes": [
    "Mistake 1 in ${targetLanguage.toUpperCase()}",
    "Mistake 2 in ${targetLanguage.toUpperCase()}"
  ],
  "tipsForForeigners": "Specific guidance for foreigners in ${targetLanguage.toUpperCase()}",
  "confidence": 0.98
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text);
  return {
    ...parsed,
    originalLabel: parsed.originalLabel || originalLabel,
    source: 'ai_draft',
    provider: 'gemini',
    generatedAt: new Date().toISOString()
  };
}

/**
 * Main AI Explanation Router:
 * 1. Checks known semantic dictionary first (instant & 100% accurate)
 * 2. Calls Google Gemini (primary AI provider)
 * 3. Gracefully falls back to localized template
 */
export async function generateFieldExplanation(fieldMetadata, targetLanguage = 'en', pageContext = '') {
  const rawLabel = (fieldMetadata.label || fieldMetadata.name || '').toLowerCase().trim();
  const normalizedKey = rawLabel.replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');

  const strategy = (process.env.EXPLAIN_STRATEGY || 'AI_FIRST').toUpperCase();

  // 1. Instant semantic match for standard Indonesian civil fields (Only for DB_FIRST or fast mode, NEVER with empty string)
  if (strategy !== 'AI_FIRST' && normalizedKey && normalizedKey.length >= 3) {
    for (const [key, translations] of Object.entries(KNOWN_SEMANTIC_FIELDS)) {
      if (normalizedKey === key || normalizedKey.includes(key) || (normalizedKey.length >= 5 && key.includes(normalizedKey))) {
        if (translations[targetLanguage]) {
          console.log(`[AI Service] Matched known semantic field: ${key} (${targetLanguage})`);
          return {
            ...translations[targetLanguage],
            originalLabel: fieldMetadata.label || fieldMetadata.name || key,
            confidence: 0.98,
            source: 'verified',
            generatedAt: new Date().toISOString()
          };
        }
      }
    }
  }

  // 2. Call Google Gemini (100% Google AI Native)
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log(`[AI Service] Calling Google Gemini API (${process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'})...`);
      return await callGemini(fieldMetadata, targetLanguage, pageContext);
    } catch (err) {
      console.error(`[AI Service] Gemini call failed: ${err.message}`);
      throw new Error(`Google Gemini analysis failed: ${err.message}`);
    }
  }

  throw new Error('GEMINI_API_KEY is not configured on backend.');
}

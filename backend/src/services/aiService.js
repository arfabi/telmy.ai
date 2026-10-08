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
 * Call OpenAI-Compatible API (OpenAI, Groq, OpenRouter, DeepSeek, Ollama, etc.)
 */
async function callOpenAiCompatible(fieldMetadata, targetLanguage, pageContext) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  let baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  baseUrl = baseUrl.replace(/\/+$/, ''); // remove trailing slash
  const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const systemPrompt = `You are Telmy.ai, an expert AI form-filling assistant for government, civil, and public online forms.
Your mission is to explain form fields to general citizens and foreign applicants with utmost clarity, empathy, and professional precision.

You MUST translate the Indonesian label to the target language (e.g. "Tempat Lahir" -> "Place of Birth" in English, or "出生地点" in Chinese).
Provide realistic, culturally appropriate fictional examples (e.g. "New York, USA" or "Jakarta, Indonesia", never generic placeholders).

Format: You must output ONLY a valid JSON object matching this schema:
{
  "label": "Translated field name in target language (e.g., 'Place of Birth')",
  "meaning": "Clear 1-2 sentence explanation of what this field is and why government asks for it.",
  "howToFill": "Step-by-step instructions on how to fill it and what document to check.",
  "example": "Realistic fictional example (e.g., 'New York, USA' or '15-08-1990')",
  "commonMistakes": [
    "First common mistake (e.g. hospital name instead of city)",
    "Second common mistake (e.g. spelling mismatch with passport)"
  ],
  "tipsForForeigners": "Special notes for foreign applicants or passport holders.",
  "confidence": 0.95
}`;

  const userPrompt = `Explain this form field:
- Original Label: "${fieldMetadata.label || fieldMetadata.name || 'Kolom Isian'}"
- Input Type: "${fieldMetadata.type || 'text'}"
- Available Options: ${fieldMetadata.options && fieldMetadata.options.length ? JSON.stringify(fieldMetadata.options) : 'None'}
- Placeholder / Hint: "${fieldMetadata.placeholder || '-'}"
- Domain / Page: "${fieldMetadata.domain || 'Layanan Administrasi'}" (${pageContext || ''})
- Target Language: ${targetLanguage.toUpperCase()} (options: en, zh, id, ja, ko)

Output JSON only:`;

  const url = `${baseUrl}/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('Empty response from OpenAI-compatible API');
  }

  const parsed = JSON.parse(content);
  return {
    ...parsed,
    source: 'ai_draft',
    provider: `openai-compat (${modelName})`,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Call Google Gemini API as secondary option
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

  const prompt = `
You are Telmy.ai, an AI form-filling assistant for public and government forms.
Task: Explain this field for foreign applicants and general public.

Field info:
- Original Label: "${fieldMetadata.label || fieldMetadata.name || 'Kolom Isian'}"
- Target Language: ${targetLanguage.toUpperCase()}

Return valid JSON:
{
  "label": "Translated field name in target language (e.g. 'Place of Birth')",
  "meaning": "Meaning in target language",
  "howToFill": "How to fill in target language",
  "example": "Realistic fictional example (e.g. 'New York, USA')",
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "tipsForForeigners": "Notes for foreigners",
  "confidence": 0.95
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text);
  return {
    ...parsed,
    source: 'ai_draft',
    provider: 'gemini',
    generatedAt: new Date().toISOString()
  };
}

/**
 * Main AI Explanation Router:
 * 1. Checks known semantic dictionary first (instant & 100% accurate)
 * 2. Tries OpenAI-compatible API (primary via env)
 * 3. Tries Gemini API (secondary fallback)
 * 4. Gracefully falls back to localized template
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
            confidence: 0.98,
            source: 'verified',
            generatedAt: new Date().toISOString()
          };
        }
      }
    }
  }

  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();

  // 2. Try OpenAI Compatible first (if configured or default)
  if (provider === 'openai' || process.env.OPENAI_API_KEY) {
    try {
      console.log(`[AI Service] Calling OpenAI-compatible API (${process.env.OPENAI_MODEL || 'gpt-4o-mini'})...`);
      return await callOpenAiCompatible(fieldMetadata, targetLanguage, pageContext);
    } catch (err) {
      console.warn(`[AI Service] OpenAI-compatible call failed: ${err.message}. Trying fallback...`);
    }
  }

  // 3. Try Gemini as secondary
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('[AI Service] Calling Gemini API fallback...');
      return await callGemini(fieldMetadata, targetLanguage, pageContext);
    } catch (err) {
      console.warn(`[AI Service] Gemini fallback failed: ${err.message}`);
    }
  }

  // 4. Robust localized template fallback
  console.log(`[AI Service] Using localized template fallback for "${rawLabel}" in ${targetLanguage}`);
  return createSmartFallback(fieldMetadata, targetLanguage);
}

function createSmartFallback(metadata, lang) {
  const raw = metadata.label || metadata.name || 'Kolom Isian';

  // Smart heuristic translations for common words
  let labelEn = raw;
  let exampleEn = 'Sample Official Entry';
  const lower = raw.toLowerCase();

  if (lower.includes('tempat') && lower.includes('lahir')) {
    labelEn = 'Place of Birth';
    exampleEn = 'New York, USA';
  } else if (lower.includes('tanggal') && lower.includes('lahir')) {
    labelEn = 'Date of Birth';
    exampleEn = '15-08-1990';
  } else if (lower.includes('nama')) {
    labelEn = 'Full Name';
    exampleEn = 'JOHN MICHAEL DOE';
  } else if (lower.includes('alamat')) {
    labelEn = 'Address / Domicile';
    exampleEn = '123 Fifth Avenue, New York';
  }

  const templates = {
    en: {
      label: labelEn,
      meaning: `This field requires the official details for "${labelEn}". Please verify against your registered legal documents.`,
      howToFill: `Type details accurately as stated in your physical document or legal identification. Ensure correct spelling.`,
      example: exampleEn,
      commonMistakes: [
        'Typographical error or mismatched spelling with physical document',
        'Entering informal abbreviation or nickname'
      ],
      tipsForForeigners: 'For foreign applicants, ensure the spelling matches your international passport or active KITAS.',
      confidence: 0.85
    },
    zh: {
      label: lower.includes('tempat') && lower.includes('lahir') ? '出生地点' : raw,
      meaning: `该输入栏用于采集“${raw}”的法定信息。请核对官方公证书或身份证件。`,
      howToFill: `请严格按照您的纸质文件或有效身份证件上的原始记录录入，切勿简写。`,
      example: lower.includes('tempat') && lower.includes('lahir') ? '纽约，美国' : '示例数据',
      commonMistakes: ['拼写存在错别字', '与护照上的记录不一致'],
      tipsForForeigners: '外籍人员请核对护照或合法居留签证上的原始拼写与编号。',
      confidence: 0.85
    },
    id: {
      label: raw,
      meaning: `Kolom "${raw}". Periksa lembar dokumen resmi yang Anda miliki.`,
      howToFill: `Ketikkan data persis seperti yang tertera di dokumen fisik atau kartu identitas Anda.`,
      example: lower.includes('tempat') && lower.includes('lahir') ? 'Jakarta / Surabaya / New York' : 'Contoh Isian Sesuai Berkas',
      commonMistakes: ['Salah ketik angka/huruf atau mengosongkan kolom penting ini'],
      tipsForForeigners: 'Bagi WNA, pastikan data yang dimasukkan sesuai dengan paspor atau dokumen resmi yang disahkan.',
      confidence: 0.85
    }
  };

  return {
    ...(templates[lang] || templates['en']),
    source: 'ai_draft',
    generatedAt: new Date().toISOString()
  };
}

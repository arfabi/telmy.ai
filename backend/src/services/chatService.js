/**
 * Telmy Backend — Conversational Copilot Chat Service
 * Orchestrates multi-turn conversation with LLM (GLM-5.3-Flash / Gemini)
 * and extracts actionable form chips (highlight, click, copy, navigate).
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Handle conversational copilot chat
 */
export async function handleCopilotChat({ message, history = [], language = 'en', formContext = {} }) {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();

  // Try OpenAI compatible (GLM-5.3-Flash / Sumopod / OpenAI)
  if (provider === 'openai' || process.env.OPENAI_API_KEY) {
    try {
      return await callChatOpenAi({ message, history, language, formContext });
    } catch (err) {
      console.warn(`[Chat Service] OpenAI compatible failed (${err.message}), trying fallback...`);
    }
  }

  // Try Gemini fallback
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callChatGemini({ message, history, language, formContext });
    } catch (err) {
      console.warn(`[Chat Service] Gemini chat failed: ${err.message}`);
    }
  }

  // Local rule-based fallback
  return createSmartChatFallback({ message, language, formContext });
}

function buildSystemPrompt(language, formContext) {
  const formTitle = formContext.title || 'Public Digital Form';
  const fields = Array.isArray(formContext.fields) ? formContext.fields : [];
  const fieldListPreview = fields.slice(0, 15).map((f, i) => `${i + 1}. ${f.label || f.name || 'Field'} (${f.type || 'text'})`).join('\n');

  return `You are Telmy, a friendly, ultra-helpful, and professional AI Form Explainer and Conversational Co-Pilot for web and government forms.
You speak naturally to the user in their requested language: ${language.toUpperCase()} (options: EN, ID, JA, KO, ZH, ZH-TW, VI, TH, HI, FIL, MS).

CURRENT FORM CONTEXT:
- Page Title: "${formTitle}"
- URL / Domain: "${formContext.url || formContext.domain || 'N/A'}"
- Total Fields Detected: ${fields.length}
- Detected Form Fields:
${fieldListPreview || '(Belum ada kolom terdeteksi)'}

YOUR GOALS:
1. Explain form requirements clearly, concisely, and empathetically.
2. If the user asks how to fill a specific field, explain its purpose, expected format, fictional example, and common mistakes to avoid.
3. Keep conversational answers concise (2-4 sentences or clear bullet points), optimal for speech TTS playback.
4. If appropriate to take an action, attach an actions array at the end inside an <actions>[...]</actions> tag.

Supported Action Types:
- {"type": "HIGHLIGHT_FIELD", "index": 0, "label": "Nama Kolom"}
- {"type": "COPY_EXAMPLE", "text": "Contoh Teks Isian"}
- {"type": "CLICK_ELEMENT", "label": "Lanjut / Simpan", "selector": "button"}

Example response format:
Halo! Untuk kolom NIK, silakan masukkan 16 digit nomor induk kependudukan yang tertera pada KTP-el Anda. Pastikan tidak ada spasi atau tanda baca.
<actions>[{"type": "HIGHLIGHT_FIELD", "index": 0, "label": "NIK"}, {"type": "COPY_EXAMPLE", "text": "3171012304900001"}]</actions>`;
}

async function callChatOpenAi({ message, history, language, formContext }) {
  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'glm-5.3-flash';

  const systemPrompt = buildSystemPrompt(language, formContext);

  // Format messages
  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  // Include recent history (max 6 messages for context)
  if (Array.isArray(history) && history.length > 0) {
    history.slice(-6).forEach(h => {
      if (h.role && h.content) {
        messages.push({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: String(h.content)
        });
      }
    });
  }

  messages.push({ role: 'user', content: message });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
      max_tokens: 600
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`OpenAI-compatible error HTTP ${response.status}: ${errorText}`);
  }

  const json = await response.json();
  const rawContent = json.choices?.[0]?.message?.content || '';
  return parseReplyAndActions(rawContent, language);
}

async function callChatGemini({ message, history, language, formContext }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const model = genAI.getGenerativeModel({ model: modelName });

  const systemPrompt = buildSystemPrompt(language, formContext);
  const prompt = `${systemPrompt}\n\nUser Question: ${message}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawContent = response.text() || '';

  return parseReplyAndActions(rawContent, language);
}

function parseReplyAndActions(rawText, language) {
  let reply = rawText;
  let actions = [];

  const actionsRegex = /<actions>([\s\S]*?)<\/actions>/i;
  const match = rawText.match(actionsRegex);

  if (match) {
    try {
      actions = JSON.parse(match[1].trim());
    } catch (e) {
      console.warn('[Chat Service] Failed to parse actions JSON:', e.message);
    }
    reply = rawText.replace(actionsRegex, '').trim();
  }

  return {
    reply: reply || (language === 'en' ? 'I am here to help you navigate this form.' : 'Saya siap membantu Anda mengisi formulir ini.'),
    actions: Array.isArray(actions) ? actions : []
  };
}

function createSmartChatFallback({ message, language, formContext }) {
  const lower = (message || '').toLowerCase();
  const fields = Array.isArray(formContext.fields) ? formContext.fields : [];

  let reply = '';
  let actions = [];

  if (lower.includes('halo') || lower.includes('hello') || lower.includes('hai')) {
    reply = language === 'en'
      ? `Hello! I'm Telmy, your form co-pilot. I can explain any field on "${formContext.title || 'this form'}", show examples, or guide you through the steps.`
      : `Halo! Saya Telmy, asisten formulir Anda. Anda dapat menanyakan arti kolom apa pun pada formulir ini, meminta contoh isian, atau meminta panduan langkah demi langkah.`;
  } else if (lower.includes('dokumen') || lower.includes('syarat') || lower.includes('siap')) {
    reply = language === 'en'
      ? `For this form, please make sure you have your identity card (KTP/Passport) and supporting documents ready.`
      : `Untuk mengisi formulir ini dengan lancar, pastikan Anda menyiapkan KTP/Paspor, nomor kontak aktif, dan dokumen pendukung terkait.`;
  } else if (fields.length > 0) {
    // Try matching field
    const matchedIdx = fields.findIndex(f => {
      const label = (f.label || f.name || '').toLowerCase();
      return lower.includes(label);
    });

    if (matchedIdx !== -1) {
      const matched = fields[matchedIdx];
      reply = language === 'en'
        ? `Field "${matched.label || matched.name}" requires your official details. Ensure you follow standard formatting.`
        : `Kolom "${matched.label || matched.name}" memerlukan data resmi Anda. Pastikan data diisi sesuai dokumen sah tanpa singkatan tak lazim.`;
      actions.push({
        type: 'HIGHLIGHT_FIELD',
        index: matchedIdx,
        label: matched.label || matched.name
      });
    } else {
      reply = language === 'en'
        ? `I detected ${fields.length} fields on this page. Click on any field or ask me specifically (e.g., "What does NIK mean?") for detailed guidance.`
        : `Saya mendeteksi ${fields.length} kolom pada halaman ini. Anda bisa mengeklik kolom mana saja di formulir atau bertanya langsung kepada saya (misal: "Apa arti kolom NIK?").`;
    }
  } else {
    reply = language === 'en'
      ? `I'm ready to assist you. Ask me anything about filling out digital forms and I'll explain clearly.`
      : `Saya siap memandu Anda. Tanyakan hal apa pun seputar pengisian formulir ini dan saya akan memberikan penjelasan yang jelas.`;
  }

  return { reply, actions };
}

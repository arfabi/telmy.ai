/**
 * Telmy Backend — Conversational Copilot Chat Service
 * 100% Powered by Google Gemini (Google AI Native)
 * Multi-turn conversational co-pilot that extracts actionable form chips.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Handle conversational copilot chat using Google Gemini
 */
export async function handleCopilotChat({ message, history = [], language = 'en', formContext = {} }) {
  // Call Google Gemini directly
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callChatGemini({ message, history, language, formContext });
    } catch (err) {
      console.warn(`[Chat Service] Gemini chat error: ${err.message}. Using smart fallback...`);
    }
  }

  // Local rule-based fallback if offline or API key is not ready
  return createSmartChatFallback({ message, language, formContext });
}

function buildSystemPrompt(language, formContext) {
  const formTitle = formContext.title || 'Public Digital Form';
  const fields = Array.isArray(formContext.fields) ? formContext.fields : [];
  const fieldListPreview = fields.slice(0, 15).map((f, i) => `${i + 1}. ${f.label || f.name || 'Field'} (${f.type || 'text'})`).join('\n');

  return `You are Telmy, a friendly, ultra-helpful, and professional AI Form Explainer and Conversational Co-Pilot for web and official forms.
You speak naturally to the user in their requested language: ${language.toUpperCase()} (options: EN, ID, JA, KO, ZH, ZH-TW, VI, TH, HI, FIL, MS).

CURRENT FORM CONTEXT:
- Page Title: "${formTitle}"
- URL / Domain: "${formContext.url || formContext.domain || 'N/A'}"
- Total Fields Detected: ${fields.length}
- Detected Form Fields:
${fieldListPreview || '(No fields detected yet)'}

YOUR GOALS:
1. Explain form requirements clearly, concisely, and empathetically.
2. If the user asks how to fill a specific field, explain its purpose, expected format, fictional example, and common mistakes to avoid.
3. Keep conversational answers concise (2-4 sentences or clear bullet points), optimal for speech TTS playback.
4. If appropriate to take an action, attach an actions array at the end inside an <actions>[...]</actions> tag.

Supported Action Types:
- {"type": "HIGHLIGHT_FIELD", "index": 0, "label": "Field Label"}
- {"type": "COPY_EXAMPLE", "text": "Sample Text Entry"}
- {"type": "CLICK_ELEMENT", "label": "Next / Continue", "selector": "button"}

Example response format:
For the ID Number field, please enter your 16-digit official national identification number without spaces or punctuation.
<actions>[{"type": "HIGHLIGHT_FIELD", "index": 0, "label": "National ID"}, {"type": "COPY_EXAMPLE", "text": "3171012304900001"}]</actions>`;
}

async function callChatGemini({ message, history, language, formContext }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const model = genAI.getGenerativeModel({ model: modelName });

  const systemPrompt = buildSystemPrompt(language, formContext);

  // Build conversational context
  let conversationText = `${systemPrompt}\n\n`;
  if (Array.isArray(history) && history.length > 0) {
    conversationText += `RECENT CONVERSATION HISTORY:\n`;
    history.slice(-6).forEach(h => {
      if (h.role && h.content) {
        conversationText += `${h.role === 'user' ? 'User' : 'Telmy'}: ${String(h.content)}\n`;
      }
    });
    conversationText += `\n`;
  }
  conversationText += `User Question: ${message}\nTelmy:`;

  const result = await model.generateContent(conversationText);
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

  if (lower.includes('halo') || lower.includes('hello') || lower.includes('hai') || lower.includes('hi')) {
    reply = language === 'en'
      ? `Hello! I'm Telmy, your form co-pilot. I can explain any field on "${formContext.title || 'this form'}", show examples, or guide you through the steps.`
      : `Halo! Saya Telmy, asisten formulir Anda. Anda dapat menanyakan arti kolom apa pun pada formulir ini, meminta contoh isian, atau meminta panduan langkah demi langkah.`;
  } else if (lower.includes('dokumen') || lower.includes('syarat') || lower.includes('doc') || lower.includes('require')) {
    reply = language === 'en'
      ? `For this form, please make sure you have your identity card (Passport/National ID) and supporting documents ready.`
      : `Untuk mengisi formulir ini dengan lancar, pastikan Anda menyiapkan KTP/Paspor, nomor kontak aktif, dan dokumen pendukung terkait.`;
  } else if (fields.length > 0) {
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
        ? `I detected ${fields.length} fields on this page. Click on any field or ask me specifically for detailed guidance.`
        : `Saya mendeteksi ${fields.length} kolom pada halaman ini. Anda bisa mengeklik kolom mana saja di formulir atau bertanya langsung kepada saya.`;
    }
  } else {
    reply = language === 'en'
      ? `I'm ready to assist you. Ask me anything about filling out digital forms and I'll explain clearly.`
      : `Saya siap memandu Anda. Tanyakan hal apa pun seputar pengisian formulir ini dan saya akan memberikan penjelasan yang jelas.`;
  }

  return { reply, actions };
}

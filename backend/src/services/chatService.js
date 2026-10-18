/**
 * Telmy Backend — Conversational Copilot Chat Service
 * 100% Powered by Google Gemini (Google AI Native)
 * Multi-turn conversational co-pilot that extracts actionable form chips.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Handle conversational copilot chat using Google Gemini
 */
export async function handleCopilotChat({ message, history = [], language = 'en', formContext = {}, screenshot = null }) {
  // Call Google Gemini directly
  if (process.env.GEMINI_API_KEY) {
    try {
      return await callChatGemini({ message, history, language, formContext, screenshot });
    } catch (err) {
      console.warn(`[Chat Service] Gemini chat error: ${err.message}. Using smart fallback...`);
    }
  }

  // Local rule-based fallback if offline or API key is not ready
  return createSmartChatFallback({ message, language, formContext });
}

function buildSystemPrompt(language, formContext, hasScreenshot = false) {
  const formTitle = formContext.title || 'Webpage';
  const fields = Array.isArray(formContext.fields) ? formContext.fields : [];
  const fieldListPreview = fields.slice(0, 25).map((f, i) => `${i + 1}. ${f.label || f.name || 'Field'} (${f.type || 'text'})${f.description ? ' - ' + f.description : ''}`).join('\n');
  const buttonsList = Array.isArray(formContext.buttons) && formContext.buttons.length > 0 ? formContext.buttons.join(', ') : '(None detected)';
  const headingsList = Array.isArray(formContext.headings) && formContext.headings.length > 0 ? formContext.headings.join(' | ') : '(None detected)';
  const mainTextSnippet = typeof formContext.mainText === 'string' && formContext.mainText.length > 0
    ? formContext.mainText.slice(0, 2500)
    : '(No raw text available)';

  return `You are Telmy, a friendly, ultra-helpful, and professional AI Form Explainer and Conversational Co-Pilot for web and official forms. You operate directly on the user's active browser tab (like Chrome's native Ask Gemini), with full awareness of the webpage DOM structure, buttons, text, and visual layout.

CRITICAL LANGUAGE POLICY (HIGHEST PRIORITY RULE):
1. MANDATORY TARGET LANGUAGE: The user has selected the interface/assistant language: "${language.toUpperCase()}".
   - You MUST respond 100% in this requested session language: ${language.toUpperCase()}.
   - Even if the webpage, screenshot, article, headline, or quoted snippet is written in English or another foreign language, YOUR EXPLANATION AND ENTIRE REPLY MUST BE IN ${language.toUpperCase()}!
   - Do NOT reply in English when the session language is ${language.toUpperCase()} (e.g. JA, ID, ZH, KO, etc.).
2. NEVER MIRROR QUOTED TEXT LANGUAGE: Quoted snippets or foreign website text are subjects to be explained/translated, NOT instructions on what language to speak! Always answer in ${language.toUpperCase()}.

VISUAL & REAL-TIME DOM AWARENESS:
${hasScreenshot ? `- A live screenshot of the user's active browser viewport is attached as an image.
- You can SEE the visual design, logos, official seals, banners, dialogs, and button positions.` : '- Webpage text context and DOM structure provided.'}
- You know the exact Page Title, Web URL, headings, buttons, and text content of the active tab.
- If user asks "what this form about?" or "ini website apa", explain the purpose of this specific website/form based on the Page Title, Headings, Summary, and Page Text below. NEVER say "this appears to be a general public form" or "no specific fields are detected" when Page Title or Page Text are provided!
- If user asks for login, register, submit, or any action button (e.g. "where i must login?", "dimana login?", "show me the submit button", "where is the register button?", "mana tombol daftarnya?"):
  * Note: On Indonesian government portals (e.g. AHU Online, Imigrasi, Pajak, OSS), the Login button is labeled "Masuk", and Register is labeled "Daftar".
  * Look at the Action Buttons Found list and the visual screenshot: Identify the exact button, explain that it is the "Masuk" (or "Login") button located in the top navigation or page header, and attach a SPOTLIGHT_ACTION action tag:
    <actions>[{"type": "SPOTLIGHT_ACTION", "label": "Masuk"}]</actions>

- If user asks where to enter/upload information (e.g. "where i must upload photo?", "where do I enter passport?", "di mana upload foto?", "mana kolom paspor?"):
  * Identify the relevant field or file upload element from the fields list or visual viewport, explain where it is, and attach a SPOTLIGHT_ACTION action tag:
    <actions>[{"type": "SPOTLIGHT_ACTION", "label": "Photo", "text": "photo"}]</actions>

CURRENT WEBPAGE & FORM CONTEXT:
- Page Title: "${formTitle}"
- Webpage URL: "${formContext.url || formContext.domain || 'N/A'}"
- Headings on Webpage: ${headingsList}
- Action Buttons Found: ${buttonsList}
- Form Summary: ${formContext.summary || '(Not analyzed yet)'}
- Main Webpage Text Content:
"""
${mainTextSnippet}
"""
- Form Fields on Page (${fields.length} fields):
${fieldListPreview || '(No specific fields detected yet)'}

YOUR GOALS:
1. Explain what this form or webpage is about clearly, concisely, and empathetically using the real Page Context.
2. If the user asks for a button or action, explain where it is and attach SPOTLIGHT_ACTION.
3. If the user asks how to fill a specific field, explain its purpose, expected format, fictional example, and common mistakes.
4. Keep conversational answers concise (2-4 sentences or clear bullet points), optimal for speech TTS playback.
5. If appropriate to take an action, attach an actions array at the end inside an <actions>[...]</actions> tag.

Supported Action Types:
- {"type": "SPOTLIGHT_ACTION", "label": "Button Name"}
- {"type": "HIGHLIGHT_FIELD", "index": 0, "label": "Field Label"}
- {"type": "COPY_EXAMPLE", "text": "Sample Text Entry"}

Example response format:
This is the official e-Visa application form for Indonesian immigration. You will need your passport details and photo ready to proceed.
<actions>[{"type": "SPOTLIGHT_ACTION", "label": "Register"}]</actions>`;
}

async function callChatGemini({ message, history, language, formContext, screenshot }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const model = genAI.getGenerativeModel({ model: modelName });

  const hasScreenshot = Boolean(screenshot && typeof screenshot === 'string' && screenshot.length > 50);
  const systemPrompt = buildSystemPrompt(language, formContext, hasScreenshot);

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

  // Multimodal Content Array if screenshot present
  let requestContent = conversationText;
  if (hasScreenshot) {
    const cleanBase64 = screenshot.replace(/^data:image\/\w+;base64,/, '').trim();
    requestContent = [
      conversationText,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      }
    ];
  }

  const result = await model.generateContent(requestContent);
  const response = await result.response;
  const rawContent = response.text() || '';

  return parseReplyAndActions(rawContent, language, message, formContext);
}

/**
 * Intelligent Language Detector for chat responses and voice synthesis
 */
export function detectTextLanguage(text, defaultLanguage = 'en') {
  if (!text || typeof text !== 'string') return defaultLanguage;
  const clean = text.toLowerCase();

  // 1. Indonesian / Malay markers
  const idMarkers = /\b(ini|itu|adalah|formulir|halaman|tombol|anda|kamu|silakan|mohon|klik|bisa|untuk|pada|di|ke|dari|saya|kami|sudah|tidak|belum|kolom|bantuan|data|masuk|daftar)\b/i;
  if (idMarkers.test(clean)) {
    return 'id';
  }

  // 2. CJK Scripts (Japanese, Chinese, Korean)
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja'; // Japanese Hiragana/Katakana
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh'; // Chinese Hanzi
  if (/[\uac00-\ud7af]/.test(text)) return 'ko'; // Korean Hangul

  // 3. Southeast & South Asian scripts
  if (/[\u0e00-\u0e7f]/.test(text)) return 'th'; // Thai
  if (/[\u0900-\u097f]/.test(text)) return 'hi'; // Hindi

  // 4. Vietnamese specific tone marks
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) {
    return 'vi';
  }

  // 5. English common words marker
  const enMarkers = /\b(the|this|that|form|page|button|please|you|your|click|enter|field|fields|login|submit|help|welcome)\b/i;
  if (enMarkers.test(clean)) {
    return 'en';
  }

  return defaultLanguage || 'en';
}

function parseReplyAndActions(rawText, language, message = '', formContext = {}) {
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

  // Automatic Enrichment: If user asks for a button and no action tag was generated by AI, attach SPOTLIGHT_ACTION
  const hasSpotlight = actions.some(a => a && (a.type === 'SPOTLIGHT_ACTION' || a.type === 'CLICK_ACTION_BUTTON'));
  const isAskingForLoginOrRegister = /(where.*(login|sign in|signin|masuk|register|sign up|signup|daftar))/i.test(message) ||
    /(how to.*(login|sign in|masuk|register|daftar))/i.test(message);
  const isAskingForButton = isAskingForLoginOrRegister ||
    /(show|find|where|where's|where is|point|highlight|mana|tunjukkan|dimana|lihat|cari).*(button|submit|register|next|daftar|kirim|tombol|login|masuk)/i.test(message) ||
    /(submit|register|login|next|daftar|kirim|masuk).*button/i.test(message) ||
    /tombol.*(submit|daftar|kirim|lanjut|simpan|masuk|login)/i.test(message);

  if (!hasSpotlight && isAskingForButton) {
    let targetButton = 'Submit';
    const isLogin = /login|sign in|signin|masuk/i.test(message);
    const isRegister = /register|sign up|signup|daftar/i.test(message);

    if (Array.isArray(formContext.buttons) && formContext.buttons.length > 0) {
      if (isLogin) {
        const loginMatch = formContext.buttons.find(b => /masuk|login|sign in|signin/i.test(b));
        targetButton = loginMatch || 'Masuk';
      } else if (isRegister) {
        const regMatch = formContext.buttons.find(b => /daftar|register|sign up|signup/i.test(b));
        targetButton = regMatch || 'Daftar';
      } else {
        const matchBtn = formContext.buttons.find(b => /submit|kirim|daftar|register|next|lanjut|save|simpan|masuk|login/i.test(b));
        targetButton = matchBtn || formContext.buttons[0];
      }
    } else {
      if (isLogin) targetButton = 'Masuk';
      else if (isRegister) targetButton = 'Daftar';
    }

    actions.push({
      type: 'SPOTLIGHT_ACTION',
      label: targetButton
    });
  }

  const finalReply = reply || (language === 'en' ? 'I am here to help you navigate this form.' : 'Saya siap membantu Anda mengisi formulir ini.');
  const detectedLanguage = detectTextLanguage(finalReply, language);

  return {
    reply: finalReply,
    detectedLanguage: detectedLanguage,
    actions: Array.isArray(actions) ? actions : []
  };
}

function createSmartChatFallback({ message, language, formContext }) {
  const lower = (message || '').toLowerCase();
  const fields = Array.isArray(formContext.fields) ? formContext.fields : [];

  let effectiveLang = language || 'en';
  if (language === 'en') {
    effectiveLang = 'en';
  } else {
    const hasNonLatin = /[\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af\u0e00-\u0e7f\u0900-\u097fàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(message);
    if (!hasNonLatin) {
      const isStrictEnglishQuery = /^(what\b|how\b|why\b|can you\b|please explain\b|tell me\b|who is\b|where is\b|what does\b)/i.test((message || '').trim());
      if (isStrictEnglishQuery) effectiveLang = 'en';
    }
  }

  let reply = '';
  let actions = [];

  if (lower.includes('what this form about') || lower.includes('what is this form') || lower.includes('tentang apa') || lower.includes('formulir apa ini') || lower.includes('ini website apa') || lower.includes('what website is this')) {
    const title = formContext.title || 'this form';
    const summary = formContext.summary || 'an online digital application form';
    reply = effectiveLang === 'en'
      ? `This page is "${title}". ${summary}. You can fill out the required details or ask me about any specific field.`
      : `Halaman ini adalah "${title}". ${summary}. Silakan isi data yang diperlukan atau tanyakan panduan kolom tertentu kepada saya.`;
  } else if (lower.includes('login') || lower.includes('masuk') || lower.includes('sign in')) {
    const btn = (Array.isArray(formContext.buttons) && formContext.buttons.length > 0)
      ? formContext.buttons.find(b => /masuk|login|sign in/i.test(b)) || 'Masuk'
      : 'Masuk';
    reply = effectiveLang === 'en'
      ? `To log in to this portal, click the "${btn}" button in the top right navigation bar. I have highlighted it for you on the webpage.`
      : `Untuk masuk (login) ke portal ini, silakan klik tombol "${btn}" yang berada di bagian kanan atas navigasi. Tombol tersebut sudah saya beri sorotan visual di halaman web.`;
    actions.push({ type: 'SPOTLIGHT_ACTION', label: btn });
  } else if (lower.includes('submit button') || lower.includes('tombol submit') || lower.includes('where is the submit') || lower.includes('dimana tombol') || lower.includes('show me the submit') || (lower.includes('show') && lower.includes('button'))) {
    const btn = (Array.isArray(formContext.buttons) && formContext.buttons.length > 0)
      ? formContext.buttons.find(b => /submit|kirim|daftar|register|next|lanjut/i.test(b)) || formContext.buttons[0]
      : 'Submit';
    reply = effectiveLang === 'en'
      ? `The main action button on this page is "${btn}". Let me spotlight it for you on the webpage.`
      : `Tombol aksi utama pada halaman ini adalah "${btn}". Saya berikan sorotan visual di halaman web untuk Anda.`;
    actions.push({ type: 'SPOTLIGHT_ACTION', label: btn });
  } else if (lower.includes('halo') || lower.includes('hello') || lower.includes('hai') || lower.includes('hi')) {
    reply = effectiveLang === 'en'
      ? `Hello! I'm Telmy, your form co-pilot. I can explain any field on "${formContext.title || 'this form'}", show examples, or guide you through the steps.`
      : `Halo! Saya Telmy, asisten formulir Anda. Anda dapat menanyakan arti kolom apa pun pada formulir ini, meminta contoh isian, atau meminta panduan langkah demi langkah.`;
  } else if (lower.includes('dokumen') || lower.includes('syarat') || lower.includes('doc') || lower.includes('require')) {
    reply = effectiveLang === 'en'
      ? `For this form, please make sure you have your identity card (Passport/National ID) and supporting documents ready.`
      : `Untuk mengisi formulir ini dengan lancar, pastikan Anda menyiapkan KTP/Paspor, nomor kontak aktif, dan dokumen pendukung terkait.`;
  } else if (lower.includes('what is this') || lower.includes('i dont know') || lower.includes('apa ini') || lower.includes('maksud')) {
    reply = effectiveLang === 'en'
      ? `This statement is a terms and consent clause. By proceeding, you agree to the event regulations and consent to receive official notifications regarding your application.`
      : `Pernyataan ini adalah klausul persetujuan (consent). Dengan mendaftar, Anda menyetujui ketentuan penyelenggaraan dan bersedia menerima pemberitahuan penting.`;
  } else if (fields.length > 0) {
    const matchedIdx = fields.findIndex(f => {
      const label = (f.label || f.name || '').toLowerCase();
      return lower.includes(label);
    });

    if (matchedIdx !== -1) {
      const matched = fields[matchedIdx];
      reply = effectiveLang === 'en'
        ? `Field "${matched.label || matched.name}" requires your official details. Ensure you follow standard formatting.`
        : `Kolom "${matched.label || matched.name}" memerlukan data resmi Anda. Pastikan data diisi sesuai dokumen sah tanpa singkatan tak lazim.`;
      actions.push({
        type: 'HIGHLIGHT_FIELD',
        index: matchedIdx,
        label: matched.label || matched.name
      });
    } else {
      reply = effectiveLang === 'en'
        ? `I detected ${fields.length} fields on this page. Click on any field or ask me specifically for detailed guidance.`
        : `Saya mendeteksi ${fields.length} kolom pada halaman ini. Anda bisa mengeklik kolom mana saja di formulir atau bertanya langsung kepada saya.`;
    }
  } else {
    reply = effectiveLang === 'en'
      ? `I'm ready to assist you. Ask me anything about filling out digital forms and I'll explain clearly.`
      : `Saya siap memandu Anda. Tanyakan hal apa pun seputar pengisian formulir ini dan saya akan memberikan penjelasan yang jelas.`;
  }

  const detectedLanguage = detectTextLanguage(reply, effectiveLang);
  return { reply, detectedLanguage, actions };
}

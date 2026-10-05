// GMT Service Worker — Multi-provider AI support
// Primary: Sumopod (OpenAI-compatible) | Fallback: Gemini

// ─── Provider Config ───
const PROVIDERS = {
  sumopod: {
    name: 'Sumopod (DeepSeek)',
    baseUrl: 'https://ai.sumopod.com/v1/chat/completions',
    model: 'deepseek-flash',
    type: 'openai',
    keyStorageKey: 'gmt_sumopod_key',
  },
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    models: ['gemini-2.5-flash', 'gemini-1.5-flash'],
    type: 'gemini',
    keyStorageKey: 'gmt_gemini_key',
  },
};

const SYSTEM_PROMPT = `You are GMT (Guide Me To), an intelligent browser co-pilot and automated assistant.
Your job is to guide users step-by-step through tasks on websites, or automate actions when in Help Me / Autopilot mode.

THINKING & JUSTIFICATION PROCESS (Jayu-inspired CoT):
- Silently analyze what the user wants to achieve.
- Internally justify which interactive element and action (click/input) should be chosen.
- Limit element descriptions to 7-9 clear, descriptive words so they can be easily located visually.

RULES:
1. Analyze the DOM summary, page title, headings, and language to understand the current page.
2. FOREIGN LANGUAGE WEBSITES & PAGE EXPLANATION (e.g. Chinese, Japanese, Korean, German, etc.):
   - If user asks "ini halaman apa", "jelaskan halaman ini", or asks for help on a foreign website:
     * Explain clearly in friendly Bahasa Indonesia:
       a) Nama situs dan fungsi utamanya.
       b) Arti dari tombol/menu penting di halaman tersebut.
       c) Opsi tindakan yang bisa dilakukan (misal: pendaftaran, pencarian, login, checkout).
     * If providing steps on a foreign language page:
       Always provide BILINGUAL labels and instructions: Indonesian meaning + original foreign text!
       Example label: "Klik tombol Daftar (立即注册)"
       Example instruction: "Klik tombol berwarna oranye bertuliskan '立即注册' (Daftar Sekarang) di kanan atas."
       Example voice: "Klik tombol Daftar Sekarang bertuliskan Li Ji Zhu Ce di kanan atas."
     * Use resilient selectors (ID, class, aria-label, or text: "button:has-text('注册'), a:has-text('注册'), .btn-register").
3. If navigating to a known web app (such as Gmail, Google, YouTube):
   - For Gmail write/send email:
     navigate_to: "https://mail.google.com"
     Step 1: selector: "div[role='button'][gh='cm'], [aria-label*='Tulis'], [aria-label*='Compose'], .T-I-KE", action: "click", label: "Klik tombol Tulis", instruction: "Klik tombol Tulis (Compose) di sebelah kiri atas untuk membuka form pesan baru.", voice: "Klik tombol Tulis di sebelah kiri atas."
     Step 2: selector: "input[peoplekit-id], textarea[name='to'], input[aria-label*='Kepada'], input[aria-label*='To']", action: "input", input_value: "contoh@email.com", label: "Isi alamat email penerima", instruction: "Ketik alamat email penerima di kolom Kepada (To).", voice: "Ketik alamat email penerima di kolom Kepada."
     Step 3: selector: "input[name='subjectbox'], input[aria-label*='Subjek'], input[aria-label*='Subject']", action: "input", input_value: "Subjek email", label: "Isi subjek email", instruction: "Ketik subjek atau topik email pada baris Subjek.", voice: "Ketik subjek email kamu di baris Subjek."
     Step 4: selector: "div[aria-label*='Isi pesan'], div[aria-label*='Message Body'], div[role='textbox']", action: "input", input_value: "Halo, ini pesan dari GMT.", label: "Tulis isi email", instruction: "Tuliskan isi pesan email yang ingin kamu sampaikan di area teks ini.", voice: "Tuliskan isi pesan email di area teks ini."
     Step 5: selector: "div[role='button'][data-tooltip*='Kirim'], div[role='button'][data-tooltip*='Send'], div[aria-label*='Kirim'], div[aria-label*='Send']", action: "click", is_sensitive: true, label: "Klik tombol Kirim", instruction: "Jika sudah selesai, klik tombol Kirim berwarna biru untuk mengirimkan email kamu.", voice: "Klik tombol Kirim untuk mengirimkan email."

   - For Google search:
     navigate_to: "https://www.google.com"
     Step 1: selector: "textarea[name='q'], input[name='q']", action: "input", label: "Ketik pencarian", instruction: "Ketik kata kunci atau hal yang ingin kamu cari di kolom pencarian Google.", voice: "Ketik apa yang ingin kamu cari di kolom pencarian."
     Step 2: selector: "input[name='btnK'], button[type='submit'], textarea[name='q']", action: "click", label: "Tekan Enter untuk mencari", instruction: "Tekan Enter pada keyboard atau klik Cari untuk melihat hasil.", voice: "Tekan Enter untuk melihat hasil pencarian."

   - For YouTube:
     navigate_to: "https://www.youtube.com"
     Step 1: selector: "input#search, input[name='search_query']", action: "input", label: "Ketik judul video", instruction: "Ketik nama video atau lagu yang ingin kamu tonton di kolom pencarian YouTube.", voice: "Ketik video yang ingin kamu tonton di kolom pencarian."
     Step 2: selector: "button#search-icon-legacy, button[aria-label*='Search']", action: "click", label: "Klik tombol Cari", instruction: "Klik tombol ikon kaca pembesar untuk mulai mencari.", voice: "Klik tombol Cari untuk mencari video."
     Step 3: selector: "ytd-video-renderer a#video-title", action: "click", label: "Pilih video", instruction: "Pilih dan klik salah satu video yang muncul untuk mulai menonton.", voice: "Klik salah satu video untuk menonton."
4. Provide clear, friendly step-by-step instructions.
5. Detect user language from their command (Bahasa Indonesia or English) and respond in the same language.
6. Each step must include: selector, action ("click" or "input"), label, instruction, and voice.
   - If the user provides text to enter, populate "input_value".
   - If the action is irreversible or critical (such as Pay, Delete, Submit final application, Send message), mark "is_sensitive": true.
7. If navigation is needed, provide exact URL in "navigate_to" (e.g. "https://mail.google.com").
8. Working Memory (Jayu Scratchpad): If there is important data to remember across steps (e.g. tracking code, applicant name, search query), return it in "memory_update".

OUTPUT FORMAT - respond ONLY with valid JSON, no markdown, no code fences:
{
  "language": "id",
  "navigate_to": "https://... or null",
  "greeting": "short friendly acknowledgment in user language",
  "memory_update": { "key": "value" },
  "steps": [
    {
      "id": 1,
      "selector": "CSS selector string or null if no specific element",
      "action": "click",
      "input_value": null,
      "is_sensitive": false,
      "label": "step label max 40 chars (7-9 words)",
      "instruction": "detailed instruction for user",
      "voice": "what GMT should say aloud for this step"
    }
  ]
}`;

// ─── State ───
const activeSessions = new Map();

// ─── Message listener ───
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GMT_INIT') {
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'GMT_PROCESS_COMMAND') {
    handleCommand(msg, sender, sendResponse);
    return true;
  }

  if (msg.type === 'GMT_CAPTURE_SCREENSHOT') {
    chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 55 }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ screenshot: dataUrl });
      }
    });
    return true;
  }

  // Jayu Visual Bounding Box Grounding Fallback
  if (msg.type === 'GMT_FIND_ELEMENT_VISION') {
    handleFindElementVision(msg, sender, sendResponse);
    return true;
  }

  // Proactive Watch Mode check
  if (msg.type === 'GMT_PROACTIVE_PAGE_CHECK') {
    handleProactivePageCheck(msg, sender, sendResponse);
    return true;
  }

  if (msg.type === 'GMT_NAVIGATE') {
    chrome.tabs.update(sender.tab.id, { url: msg.url });
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'GMT_SPEAK') {
    chrome.tts.stop();
    chrome.tts.speak(msg.text, {
      lang: msg.lang === 'id' ? 'id-ID' : 'en-US',
      rate: 1.0,
      pitch: 1.0,
    });
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'GMT_STOP_SPEAK') {
    chrome.tts.stop();
    sendResponse({ ok: true });
    return true;
  }
});

// ─── Tab update listener ───
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { type: 'GMT_PAGE_LOADED', url: tab.url }).catch(() => {});
  }
});

// ─── Toolbar icon click listener (Toggles right panel) ───
chrome.action.onClicked.addListener((tab) => {
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'GMT_TOGGLE_PANEL' }).catch(() => {});
  }
});

// ─── Jayu Vision Grounding Handler ───
async function handleFindElementVision(msg, sender, sendResponse) {
  try {
    const stored = await chrome.storage.local.get(['gmt_gemini_key', 'gmt_sumopod_key', 'gmt_provider']);
    const geminiKey = stored.gmt_gemini_key;
    const sumopodKey = stored.gmt_sumopod_key;

    if (!geminiKey && !sumopodKey) {
      sendResponse({ error: 'API key not configured' });
      return;
    }

    // 1. Capture current screenshot
    const screenshotB64 = await new Promise((resolve) => {
      chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 70 }, (dataUrl) => {
        if (chrome.runtime.lastError || !dataUrl) resolve(null);
        else resolve(dataUrl);
      });
    });

    if (!screenshotB64) {
      sendResponse({ error: 'Could not capture screenshot for vision fallback' });
      return;
    }

    const description = (msg.description || msg.label || '').trim();
    console.log(`[GMT Vision] Locating element visually: "${description}"`);

    // 2. Call Gemini Vision with Jayu bounding box prompt
    if (geminiKey) {
      const box = await locateWithGeminiVision(geminiKey, screenshotB64, description);
      if (box) {
        sendResponse({ ok: true, box });
        return;
      }
    }

    // Fallback: if Gemini Vision unavailable, try OpenAI/Sumopod vision
    if (sumopodKey) {
      const box = await locateWithSumopodVision(sumopodKey, screenshotB64, description);
      if (box) {
        sendResponse({ ok: true, box });
        return;
      }
    }

    sendResponse({ error: 'Vision model could not detect bounding box coordinates' });
  } catch (err) {
    console.warn('[GMT Vision] Error:', err);
    sendResponse({ error: err.message });
  }
}

// Locate element via Gemini Vision bounding box (Jayu technique)
async function locateWithGeminiVision(apiKey, screenshotB64, description) {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  const prompt = `This image is a screenshot of a browser page.
Find the interactive element described as: "${description}".
Mentally inspect the image and identify the element's exact location.
Return ONLY the bounding box coordinates for this element in format:
[ymin, xmin, ymax, xmax]
with values strictly normalized between 0 and 1000 (integers).
Do NOT output any markdown, explanations, or quotes. Output strictly: [ymin, xmin, ymax, xmax]`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: screenshotB64.split(',')[1] } }
        ]
      }
    ],
    generationConfig: { temperature: 0.1, maxOutputTokens: 50 }
  };

  for (const model of models) {
    try {
      const res = await fetchWithRetry(`${baseUrl}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }, { skipOn: [404, 400] });

      if (!res.ok) continue;
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const match = rawText.match(/\[\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\]/);
      if (match) {
        const ymin = parseFloat(match[1]);
        const xmin = parseFloat(match[2]);
        const ymax = parseFloat(match[3]);
        const xmax = parseFloat(match[4]);
        return {
          ymin: ymin / 1000,
          xmin: xmin / 1000,
          ymax: ymax / 1000,
          xmax: xmax / 1000,
          cx: ((xmin + xmax) / 2) / 1000,
          cy: ((ymin + ymax) / 2) / 1000,
          source: 'gemini_vision'
        };
      }
    } catch (e) {
      console.warn('[GMT Vision] Gemini attempt failed:', e);
    }
  }
  return null;
}

// Fallback to OpenAI-compatible vision (Sumopod)
async function locateWithSumopodVision(apiKey, screenshotB64, description) {
  const prompt = `This image is a screenshot of a browser page. Locate the element described as: "${description}". Return ONLY the bounding box in format [ymin, xmin, ymax, xmax] with values 0 to 1000. No text.`;
  const body = {
    model: 'deepseek-flash',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: screenshotB64 } }
        ]
      }
    ],
    temperature: 0.1,
    max_tokens: 50
  };

  try {
    const res = await fetchWithRetry(PROVIDERS.sumopod.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    const match = rawText.match(/\[\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\]/);
    if (match) {
      const ymin = parseFloat(match[1]);
      const xmin = parseFloat(match[2]);
      const ymax = parseFloat(match[3]);
      const xmax = parseFloat(match[4]);
      return {
        ymin: ymin / 1000,
        xmin: xmin / 1000,
        ymax: ymax / 1000,
        xmax: xmax / 1000,
        cx: ((xmin + xmax) / 2) / 1000,
        cy: ((ymin + ymax) / 2) / 1000,
        source: 'sumopod_vision'
      };
    }
  } catch (e) {
    console.warn('[GMT Vision] Sumopod vision error:', e);
  }
  return null;
}

// Proactive Watch Mode Page Check
async function handleProactivePageCheck(msg, sender, sendResponse) {
  try {
    const stored = await chrome.storage.local.get(['gmt_sumopod_key', 'gmt_gemini_key', 'gmt_provider']);
    const provider = stored.gmt_provider || 'sumopod';
    const apiKey = provider === 'sumopod' ? stored.gmt_sumopod_key : stored.gmt_gemini_key;

    if (!apiKey) {
      sendResponse({ ok: false, error: 'No API key' });
      return;
    }

    const promptText = `Halaman web baru terdeteksi:
URL: ${msg.url}
Judul: "${msg.title}"
Headings: ${msg.headings || ''}

Tuliskan ringkasan 1-2 kalimat dalam Bahasa Indonesia yang ramah tentang halaman ini dan saran singkat apa langkah yang bisa dilakukan pengguna di sini. Format JSON: {"summary": "...", "suggested_action": "..."}`;

    // Simple fast completion
    let resJson = null;
    if (provider === 'sumopod' && stored.gmt_sumopod_key) {
      const res = await fetchWithRetry(PROVIDERS.sumopod.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${stored.gmt_sumopod_key}`,
        },
        body: JSON.stringify({
          model: PROVIDERS.sumopod.model,
          messages: [{ role: 'user', content: promptText }],
          temperature: 0.3,
          max_tokens: 250,
          response_format: { type: 'json_object' }
        })
      });
      if (res.ok) {
        const data = await res.json();
        resJson = parseJSON(data.choices?.[0]?.message?.content || '{}', 'WatchMode');
      }
    }

    sendResponse({ ok: true, data: resJson });
  } catch (e) {
    sendResponse({ ok: false, error: e.message });
  }
}

// ─── Main command handler ───
async function handleCommand(msg, sender, sendResponse) {
  const tabId = sender.tab?.id;
  if (!tabId) { sendResponse({ error: 'No tab ID' }); return; }

  try {
    // 1. Get all stored keys + provider preference
    const stored = await chrome.storage.local.get([
      'gmt_sumopod_key',
      'gmt_gemini_key',
      'gmt_provider',
    ]);

    // 2. Determine which provider to use
    // Default: sumopod if key exists, else gemini
    const preferredProvider = stored.gmt_provider || 'sumopod';
    const sumopodKey = stored.gmt_sumopod_key;
    const geminiKey = stored.gmt_gemini_key;

    if (!sumopodKey && !geminiKey) {
      sendResponse({ error: 'API key not set. Please configure it in GMT settings (⚙️).' });
      return;
    }

    // 3. Get DOM summary from content script
    let domSummary = '';
    try {
      const domRes = await chrome.tabs.sendMessage(tabId, { type: 'GMT_GET_DOM_SUMMARY' });
      domSummary = domRes || '';
    } catch (e) { /* optional */ }

    // 4. Capture screenshot (for vision models)
    let screenshotB64 = null;
    try {
      screenshotB64 = await new Promise((resolve) => {
        chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 50 }, (dataUrl) => {
          if (chrome.runtime.lastError || !dataUrl) resolve(null);
          else resolve(dataUrl); // keep full data URL for OpenAI vision
        });
      });
    } catch (e) { /* optional */ }

    const payload = {
      command: msg.command,
      currentUrl: msg.currentUrl,
      domSummary,
      screenshotB64,
    };

    // 5. Call AI — try preferred provider first, fallback to other
    let plan;
    const errors = [];

    // Try Sumopod first if key available and preferred (or no preference)
    if (sumopodKey && (preferredProvider === 'sumopod' || !geminiKey)) {
      try {
        plan = await callOpenAICompatible(sumopodKey, PROVIDERS.sumopod, payload);
      } catch (e) {
        errors.push(`Sumopod: ${e.message}`);
        console.warn('[GMT] Sumopod failed:', e.message);
      }
    }

    // Fallback to Gemini if sumopod failed or not preferred
    if (!plan && geminiKey) {
      try {
        plan = await callGemini(geminiKey, payload);
      } catch (e) {
        errors.push(`Gemini: ${e.message}`);
        console.warn('[GMT] Gemini failed:', e.message);
      }
    }

    // Try Sumopod as last resort if gemini was preferred but failed
    if (!plan && sumopodKey && preferredProvider === 'gemini') {
      try {
        plan = await callOpenAICompatible(sumopodKey, PROVIDERS.sumopod, payload);
      } catch (e) {
        errors.push(`Sumopod fallback: ${e.message}`);
      }
    }

    if (!plan) {
      throw new Error(errors.join(' | '));
    }

    // 6. Store session & respond
    activeSessions.set(tabId, { steps: plan.steps, currentStep: 0 });
    sendResponse({ ok: true, plan });

  } catch (err) {
    console.error('[GMT SW] Error:', err);
    sendResponse({ error: err.message });
  }
}

// ─── OpenAI-Compatible API (Sumopod, OpenAI, etc.) ───
async function callOpenAICompatible(apiKey, provider, { command, currentUrl, domSummary, screenshotB64 }) {
  const userContent = [
    {
      type: 'text',
      text: `Current URL: ${currentUrl}\n\nUser command: "${command}"\n\nInteractive DOM elements on page:\n${domSummary}\n\nRespond with JSON only.`
    }
  ];

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent }
  ];

  const body = {
    model: provider.model,
    messages,
    temperature: 0.3,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  };

  console.log(`[GMT] Calling ${provider.name} (${provider.model})...`);

  const res = await fetchWithRetry(provider.baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${provider.name} ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content || '';

  if (!rawText) throw new Error(`Empty response from ${provider.name}`);

  console.log(`[GMT] Success with ${provider.name}`);
  return parseJSON(rawText, provider.name);
}

// ─── Gemini API ───
async function callGemini(apiKey, { command, currentUrl, domSummary, screenshotB64 }) {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  const parts = [
    { text: `Current URL: ${currentUrl}\n\nUser command: "${command}"\n\nDOM elements:\n${domSummary}\n\nRespond with JSON only.` }
  ];

  if (screenshotB64) {
    parts.push({ inline_data: { mime_type: 'image/jpeg', data: screenshotB64.split(',')[1] } });
    parts.push({ text: 'Above image shows the current browser page.' });
  }

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: 'user', parts }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 2048, responseMimeType: 'application/json' }
  };

  let lastErr = '';
  for (const model of models) {
    try {
      const res = await fetchWithRetry(`${baseUrl}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }, { skipOn: [404, 400] });

      if (!res.ok) {
        const txt = await res.text();
        lastErr = `${model} ${res.status}: ${txt.slice(0, 120)}`;
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!rawText) { lastErr = 'Empty Gemini response'; continue; }

      console.log(`[GMT] Success with Gemini model: ${model}`);
      return parseJSON(rawText, `Gemini/${model}`);
    } catch (e) {
      lastErr = e.message;
    }
  }
  throw new Error(`Gemini failed: ${lastErr}`);
}

// ─── Fetch with retry (503/429) ───
async function fetchWithRetry(url, options, { maxRetries = 3, skipOn = [] } = {}) {
  let lastRes;
  for (let i = 1; i <= maxRetries; i++) {
    const res = await fetch(url, options);
    if (skipOn.includes(res.status)) return res; // hard error, return immediately
    if (res.status === 503 || res.status === 429) {
      const wait = i * 2000;
      console.warn(`[GMT] ${res.status} received, retrying in ${wait}ms (${i}/${maxRetries})...`);
      await sleep(wait);
      lastRes = res;
      continue;
    }
    return res;
  }
  return lastRes;
}

// ─── Parse JSON (with fallback extraction) ───
function parseJSON(text, source) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    throw new Error(`Cannot parse ${source} response as JSON`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

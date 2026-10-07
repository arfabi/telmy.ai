// Service Worker for Telmy
const DEFAULT_SETTINGS = {
  language: 'en', // 'en', 'id', 'ja', 'ko', 'zh', 'zh-TW', 'vi', 'th', 'hi', 'fil', 'ms'
  isActive: true,
  theme: 'light',
  highlightColor: '#2563eb',
  apiUrl: 'http://localhost:8080/api'
};

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[Telmy] Extension installed/updated:', details.reason);
  const stored = await chrome.storage.local.get(['settings', 'suggestions_history']);
  if (!stored.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  } else if (!stored.settings.apiUrl) {
    await chrome.storage.local.set({ settings: { ...stored.settings, apiUrl: DEFAULT_SETTINGS.apiUrl } });
  }
  if (!stored.suggestions_history) {
    await chrome.storage.local.set({ suggestions_history: [] });
  }

  // Open side panel automatically on action toolbar click
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
});

// Configure side panel behavior on startup as well
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
}

// Helper: fetch with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.local.get(['settings']).then((res) => {
      sendResponse(res.settings || DEFAULT_SETTINGS);
    });
    return true; // Keep channel open for async response
  }

  if (message.type === 'UPDATE_SETTINGS') {
    chrome.storage.local.get(['settings']).then(async (res) => {
      const updated = { ...(res.settings || DEFAULT_SETTINGS), ...message.payload };
      await chrome.storage.local.set({ settings: updated });
      // Notify active tabs
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_CHANGED', settings: updated }, () => {
            if (chrome.runtime.lastError) { /* ignore disconnected tabs */ }
          });
        }
      }
      sendResponse({ success: true, settings: updated });
    });
    return true;
  }

  if (message.type === 'EXPLAIN_FIELD') {
    chrome.storage.local.get(['settings']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const apiUrl = settings.apiUrl || DEFAULT_SETTINGS.apiUrl;
      const { metadata, language, pageContext } = message.payload;

      try {
        const response = await fetchWithTimeout(`${apiUrl}/explain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metadata, language, pageContext })
        }, 30000);

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            sendResponse({ success: true, fromBackend: true, data: json.data });
            return;
          }
        }
      } catch (err) {
        // Backend offline or timeout
      }

      sendResponse({ success: false, fallback: true });
    });
    return true;
  }

  if (message.type === 'LOAD_MOCK_DICTIONARY') {
    // Read local mock json file
    const url = chrome.runtime.getURL('mock/apostille-ahu.json');
    fetch(url)
      .then((res) => res.json())
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === 'SUBMIT_SUGGESTION') {
    chrome.storage.local.get(['settings', 'suggestions_history']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const apiUrl = settings.apiUrl || DEFAULT_SETTINGS.apiUrl;
      const list = res.suggestions_history || [];

      const newEntry = {
        id: 'sug_' + Date.now(),
        fieldId: message.payload.fieldId,
        fieldLabel: message.payload.fieldLabel,
        type: message.payload.type || 'suggestion',
        text: message.payload.text,
        language: message.payload.language || 'id',
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      list.unshift(newEntry);
      await chrome.storage.local.set({ suggestions_history: list });

      // Forward to backend if online
      fetch(`${apiUrl}/feedback/suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldKey: message.payload.fieldId,
          fieldLabel: message.payload.fieldLabel,
          type: message.payload.type,
          text: message.payload.text,
          language: message.payload.language,
          domain: message.payload.domain || window?.location?.hostname
        })
      }).catch(() => {
        console.log('[GMT] Backend unreachable, suggestion saved locally only.');
      });

      sendResponse({ success: true, entry: newEntry });
    });
    return true;
  }

  if (message.type === 'GET_SUGGESTIONS') {
    chrome.storage.local.get(['suggestions_history']).then((res) => {
      sendResponse(res.suggestions_history || []);
    });
    return true;
  }

  // Pilar 1 & 2: Conversational Copilot Chat
  if (message.type === 'SEND_CHAT_MESSAGE') {
    chrome.storage.local.get(['settings']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const apiUrl = settings.apiUrl || DEFAULT_SETTINGS.apiUrl;
      const { message: chatMsg, history, language, formContext } = message.payload;

      try {
        const response = await fetchWithTimeout(`${apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: chatMsg, history, language, formContext })
        }, 35000);

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            sendResponse({ success: true, data: json.data });
            return;
          }
        }
      } catch (err) {
        console.warn('[Telmy SW] Chat API failed:', err.message);
      }

      // Fallback response if backend is offline
      sendResponse({
        success: true,
        fallback: true,
        data: {
          reply: language === 'en'
            ? 'I am currently operating in offline mode. You can still inspect any detected fields on the form.'
            : 'Saat ini saya beroperasi dalam mode offline. Anda tetap dapat membaca panduan kolom pada formulir ini.',
          actions: []
        }
      });
    });
    return true;
  }

  // Pilar 1: Voice TTS via Backend Gateway
  if (message.type === 'VOICE_TTS') {
    chrome.storage.local.get(['settings']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const apiUrl = settings.apiUrl || DEFAULT_SETTINGS.apiUrl;
      const { text, language, voiceId } = message.payload;

      try {
        const response = await fetchWithTimeout(`${apiUrl}/voice/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language, voiceId })
        }, 20000);

        if (response.ok) {
          const blob = await response.blob();
          // Convert blob to base64 data URL for easy transfer across extension contexts
          const reader = new FileReader();
          reader.onloadend = () => {
            sendResponse({ success: true, audioDataUrl: reader.result });
          };
          reader.readAsDataURL(blob);
          return;
        } else {
          const json = await response.json().catch(() => ({}));
          sendResponse({ success: false, fallback: true, error: json.error || 'TTS failed' });
          return;
        }
      } catch (err) {
        sendResponse({ success: false, fallback: true, error: err.message });
      }
    });
    return true;
  }

  // Check Voice Backend Status
  if (message.type === 'CHECK_VOICE_STATUS') {
    chrome.storage.local.get(['settings']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const apiUrl = settings.apiUrl || DEFAULT_SETTINGS.apiUrl;

      try {
        const response = await fetchWithTimeout(`${apiUrl}/voice/status`, {}, 5000);
        if (response.ok) {
          const json = await response.json();
          sendResponse({ success: true, ...json });
          return;
        }
      } catch (err) {}
      sendResponse({ success: false, configured: false });
    });
    return true;
  }

  // Chat History Storage
  if (message.type === 'GET_CHAT_HISTORY') {
    const key = `telmy_chat_${message.domain || 'global'}`;
    chrome.storage.local.get([key]).then((res) => {
      sendResponse(res[key] || []);
    });
    return true;
  }

  if (message.type === 'SAVE_CHAT_HISTORY') {
    const key = `telmy_chat_${message.domain || 'global'}`;
    chrome.storage.local.set({ [key]: message.history || [] }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

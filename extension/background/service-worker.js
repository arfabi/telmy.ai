// Service Worker for GuideMe.To (GMT)
const DEFAULT_SETTINGS = {
  language: 'id', // 'id', 'en', 'zh', 'ja', 'ko'
  isActive: true,
  theme: 'light',
  highlightColor: '#2563eb',
  apiUrl: 'http://localhost:8080/api'
};

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[GMT] Extension installed/updated:', details.reason);
  const stored = await chrome.storage.local.get(['settings', 'suggestions_history']);
  if (!stored.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  } else if (!stored.settings.apiUrl) {
    await chrome.storage.local.set({ settings: { ...stored.settings, apiUrl: DEFAULT_SETTINGS.apiUrl } });
  }
  if (!stored.suggestions_history) {
    await chrome.storage.local.set({ suggestions_history: [] });
  }
});

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
          chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_CHANGED', settings: updated }).catch(() => {});
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
});

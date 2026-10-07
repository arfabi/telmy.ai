// Service Worker for GuideMe.To (GMT)
const DEFAULT_SETTINGS = {
  language: 'id', // 'id', 'en', 'zh', 'ja', 'ko'
  isActive: true,
  theme: 'light',
  highlightColor: '#2563eb'
};

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[GMT] Extension installed/updated:', details.reason);
  const stored = await chrome.storage.local.get(['settings', 'suggestions_history']);
  if (!stored.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
  if (!stored.suggestions_history) {
    await chrome.storage.local.set({ suggestions_history: [] });
  }
});

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
    chrome.storage.local.get(['suggestions_history']).then(async (res) => {
      const list = res.suggestions_history || [];
      const newEntry = {
        id: 'sug_' + Date.now(),
        fieldId: message.payload.fieldId,
        fieldLabel: message.payload.fieldLabel,
        type: message.payload.type, // 'suggestion' or 'correction'
        text: message.payload.text,
        language: message.payload.language,
        timestamp: new Date().toISOString(),
        status: 'pending' // pending, reviewed
      };
      list.unshift(newEntry);
      await chrome.storage.local.set({ suggestions_history: list });
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

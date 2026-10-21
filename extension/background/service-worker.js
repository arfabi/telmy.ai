// Service Worker for Telmy
const DEFAULT_SETTINGS = {
  language: 'en', // 'en', 'id', 'ja', 'ko', 'zh', 'zh-TW', 'vi', 'th', 'hi', 'fil', 'ms'
  isActive: true,
  theme: 'light',
  highlightColor: '#2563eb',
  apiUrl: 'https://telmy.id/api'
};

// Helper: resolve safe API URL (strips legacy localhost or stale domains)
function getEffectiveApiUrl(settings) {
  const url = settings?.apiUrl;
  if (!url || url.includes('localhost') || url.includes('127.0.0.1') || url.includes('telmy.web.app') || url.includes('cloud.run')) {
    return DEFAULT_SETTINGS.apiUrl;
  }
  return url;
}

// Proactive sanitization to purge any stale localhost or cloud.run URLs from browser storage
async function sanitizeSettings() {
  try {
    const stored = await chrome.storage.local.get(['settings', 'suggestions_history']);
    let needsUpdate = false;
    let settings = stored.settings;

    if (!settings) {
      settings = { ...DEFAULT_SETTINGS };
      needsUpdate = true;
    } else if (
      !settings.apiUrl ||
      settings.apiUrl.includes('localhost') ||
      settings.apiUrl.includes('127.0.0.1') ||
      settings.apiUrl.includes('telmy.web.app') ||
      settings.apiUrl.includes('cloud.run')
    ) {
      settings = { ...settings, apiUrl: DEFAULT_SETTINGS.apiUrl };
      needsUpdate = true;
    }

    if (needsUpdate) {
      await chrome.storage.local.set({ settings });
      console.log('[Telmy] Storage migrated to production API:', settings.apiUrl);
    }
    if (!stored.suggestions_history) {
      await chrome.storage.local.set({ suggestions_history: [] });
    }
    // Purge persistent a11y effects so ordinary browsing starts 100% clean
    await chrome.storage.local.set({
      a11y_hub_active: false,
      a11y_feature_states: {},
      a11y_spotlight_enabled: false,
      a11y_speak_enabled: false,
      a11y_thick_focus: false
    });
    return settings;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

// Run immediately on service worker boot
sanitizeSettings();

// Setup Right-Click Context Menu
function setupContextMenus() {
  if (!chrome.contextMenus) return;
  try {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'telmy_open_assistant',
        title: 'Open Telmy AI Assistant 🤖',
        contexts: ['all']
      });
      chrome.contextMenus.create({
        id: 'telmy_translate_form',
        title: 'Translate This Form 🌐',
        contexts: ['all']
      });
      chrome.contextMenus.create({
        id: 'telmy_analyze_form',
        title: 'Analyze This Form 🔍',
        contexts: ['all']
      });
      chrome.contextMenus.create({
        id: 'telmy_autofill_form',
        title: '1 Click Auto Fill ⚡',
        contexts: ['all']
      });
    });
  } catch (e) {}
}

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[Telmy] Extension installed/updated:', details.reason);
  await sanitizeSettings();
  setupContextMenus();

  // Open side panel automatically on action toolbar click
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }

  // First-time install: open onboarding welcome page with Pin 📌 guidance (Plan v6)
  if (details.reason === 'install') {
    try {
      chrome.tabs.create({
        url: chrome.runtime.getURL('welcome/welcome.html')
      });
    } catch (e) {}
  }
});

chrome.runtime.onStartup?.addListener(async () => {
  await sanitizeSettings();
  setupContextMenus();
});

// Configure side panel behavior on startup as well
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
}

// Sidepanel Life-cycle Monitor: when sidepanel is closed by user or browser, automatically kill all a11y effects
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'telmy-sidepanel-lifecycle') {
    port.onDisconnect.addListener(async () => {
      console.log('[Telmy SW] Sidepanel closed. Resetting all accessibility effects across all tabs...');
      try {
        await chrome.storage.local.set({
          a11y_hub_active: false,
          a11y_feature_states: {},
          a11y_spotlight_enabled: false,
          a11y_speak_enabled: false,
          a11y_thick_focus: false
        });
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          if (tab.id && tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
            chrome.tabs.sendMessage(tab.id, { type: 'A11Y_RESET_ALL' }).catch(() => {});
          }
        }
      } catch (err) {}
    });
  }
});

// Cross-browser helper: Open Chrome/Edge sidePanel or Firefox sidebarAction
async function openSidePanelOrSidebar(tabId) {
  try {
    if (chrome.sidePanel && chrome.sidePanel.open && tabId) {
      await chrome.sidePanel.open({ tabId });
      return;
    }
  } catch (e) {}

  try {
    if (typeof browser !== 'undefined' && browser.sidebarAction && browser.sidebarAction.open) {
      await browser.sidebarAction.open();
      return;
    }
    if (chrome.sidebarAction && chrome.sidebarAction.open) {
      await chrome.sidebarAction.open();
      return;
    }
  } catch (e) {}
}

// Handle Toolbar Action Click (fallback for Firefox / environments without setPanelBehavior)
if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener(async (tab) => {
    await openSidePanelOrSidebar(tab?.id);
  });
}

// Handle Context Menu Clicks: Open Side Panel, Translate This Form, Analyze This Form, 1 Click Auto Fill
if (chrome.contextMenus && chrome.contextMenus.onClicked) {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab || !tab.id) return;

    // Always ensure the sidepanel is open so user sees feedback
    await openSidePanelOrSidebar(tab.id);

    // 0. Open Telmy AI Assistant
    if (info.menuItemId === 'telmy_open_assistant') {
      return;
    }

    // 1. Translate This Form
    if (info.menuItemId === 'telmy_translate_form') {
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: 'CONTEXT_MENU_TRANSLATE_FORM' }).catch(() => {});
      }, 300);
      return;
    }

    // 2. Analyze This Form
    if (info.menuItemId === 'telmy_analyze_form') {
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: 'CONTEXT_MENU_ANALYZE_FORM' }).catch(() => {});
      }, 300);
      return;
    }

    // 3. 1 Click Auto Fill
    if (info.menuItemId === 'telmy_autofill_form') {
      setTimeout(() => {
        chrome.runtime.sendMessage({ type: 'CONTEXT_MENU_AUTOFILL' }).catch(() => {});
      }, 300);
      return;
    }
  });
}

// Helper: fetch with timeout directly to Cloud Run
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
  if (message.type === 'CAPTURE_VISIBLE_TAB') {
    const targetWinId = message.windowId || sender.tab?.windowId || null;
    chrome.tabs.captureVisibleTab(targetWinId, { format: 'png' }, (dataUrl) => {
      const err = chrome.runtime.lastError;
      if (err || !dataUrl) {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (fallbackUrl) => {
          const fallbackErr = chrome.runtime.lastError;
          if (fallbackErr) {
            console.warn('[Telmy SW] captureVisibleTab failed:', fallbackErr.message);
          }
          sendResponse({ success: Boolean(fallbackUrl), dataUrl: fallbackUrl || null });
        });
      } else {
        sendResponse({ success: true, dataUrl });
      }
    });
    return true; // async
  }

  if (message.type === 'OPEN_SIDEPANEL_REQUEST') {
    const tabId = sender.tab?.id;
    if (tabId) {
      openSidePanelOrSidebar(tabId);
    }
    sendResponse({ success: true });
    return false;
  }

  if (message.type === 'AUTOFILL_TRIGGER_REQUEST') {
    const tabId = sender.tab?.id;
    if (tabId) {
      openSidePanelOrSidebar(tabId);
      // Notify sidepanel or tab to initiate autofill
      chrome.tabs.sendMessage(tabId, { type: 'TRIGGER_VAULT_AUTOFILL_PROMPT' }, () => {
        if (chrome.runtime.lastError) {}
      });
    }
    sendResponse({ success: true });
    return false;
  }

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

  if (message.type === 'SET_USER_SESSION') {
    chrome.storage.local.set({ user: message.user, hasCompletedOnboarding: true }).then(async () => {
      // Register device with backend
      try {
        const stored = await chrome.storage.local.get(['settings']);
        const apiUrl = getEffectiveApiUrl(stored.settings || DEFAULT_SETTINGS);
        if (message.user && message.user.uid) {
          await fetchWithTimeout(`${apiUrl}/user/device`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: message.user.uid,
              deviceId: 'chrome_ext_' + (chrome.runtime?.id || 'main'),
              deviceName: 'Telmy Extension (Chrome)',
              browser: 'Google Chrome',
              os: navigator.userAgent.includes('Windows') ? 'Windows' : navigator.userAgent.includes('Mac') ? 'macOS' : 'Linux',
              userAgent: navigator.userAgent
            })
          }, 4000);
        }
      } catch (devErr) {}
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'GET_USER_SESSION') {
    chrome.storage.local.get(['user', 'hasCompletedOnboarding']).then((res) => {
      sendResponse({ user: res.user || null, hasCompletedOnboarding: Boolean(res.hasCompletedOnboarding) });
    });
    return true;
  }

  if (message.type === 'GET_USER_QUOTA') {
    chrome.storage.local.get(['user', 'settings']).then(async (res) => {
      const user = res.user;
      const settings = res.settings || DEFAULT_SETTINGS;
      const apiUrl = getEffectiveApiUrl(settings);

      if (!user || !user.uid) {
        sendResponse({
          success: true,
          data: {
            plan: 'free',
            totalRemaining: 5,
            quota: { freeRemaining: 5, purchasedCreditsRemaining: 0, subscriptionQuotaRemaining: 0 }
          }
        });
        return;
      }

      // Try fetching fresh quota from backend
      try {
        const resp = await fetchWithTimeout(`${apiUrl}/user/quota/${user.uid}`, {}, 5000);
        if (resp.ok) {
          const json = await resp.json();
          if (json.success && json.data) {
            sendResponse({ success: true, data: json.data });
            return;
          }
        }
      } catch (e) {}

      // Fallback to local user credits
      const credits = user.credits !== undefined ? Number(user.credits) : 5;
      sendResponse({
        success: true,
        data: {
          plan: user.plan || 'free',
          totalRemaining: credits,
          quota: {
            freeRemaining: (!user.plan || user.plan === 'free') ? credits : 0,
            purchasedCreditsRemaining: (user.plan && user.plan !== 'free') ? credits : 0
          }
        }
      });
    });
    return true;
  }

  if (message.type === 'LOGOUT_USER') {
    chrome.storage.local.remove(['user']).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'EXPLAIN_FIELD') {
    chrome.storage.local.get(['settings', 'user']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const user = res.user || null;
      const apiUrl = getEffectiveApiUrl(settings);
      const { metadata, language, pageContext, url } = message.payload || {};
      const userId = user?.uid || 'guest_user';

      let formUrl = url || sender.tab?.url;
      if (!formUrl) {
        try {
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (activeTab?.url) formUrl = activeTab.url;
        } catch (e) {}
      }

      try {
        const response = await fetchWithTimeout(`${apiUrl}/explain`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify({ metadata, language, pageContext, userId, url: formUrl })
        }, 30000);

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            sendResponse({ success: true, fromBackend: true, data: json.data, quota: json.quota });
            return;
          }
        } else if (response.status === 402) {
          const errJson = await response.json().catch(() => ({}));
          sendResponse({
            success: false,
            quotaExhausted: true,
            quota: errJson.quota,
            pricingTiers: errJson.pricingTiers,
            error: errJson.message || 'Batas kuota analisis formulir tercapai'
          });
          return;
        } else {
          const errJson = await response.json().catch(() => ({}));
          sendResponse({
            success: false,
            error: errJson.error || `Server error (${response.status})`
          });
          return;
        }
      } catch (err) {
        sendResponse({
          success: false,
          error: err.message || 'Koneksi ke server backend gagal'
        });
        return;
      }

      sendResponse({ success: false, error: 'Respon dari backend tidak valid' });
    });
    return true;
  }

  // Full-Page Form Batch Analysis (Gemini -> Firestore & Vector Cache)
  if (message.type === 'ANALYZE_FORM_PAGE') {
    chrome.storage.local.get(['settings', 'user']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const user = res.user || null;
      if (!user || !user.uid) {
        sendResponse({
          success: false,
          authRequired: true,
          error: 'Silakan login terlebih dahulu dengan Google untuk menganalisis formulir.'
        });
        return;
      }
      const apiUrl = getEffectiveApiUrl(settings);
      const { domain, url, title, fields, instructions, language } = message.payload || {};
      const userId = user.uid;

      try {
        const response = await fetchWithTimeout(`${apiUrl}/forms/analyze`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify({ domain, url, title, fields, instructions, language, userId })
        }, 45000);

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            sendResponse({ success: true, data: json.data, quota: json.quota });
            return;
          }
        } else {
          const errJson = await response.json().catch(() => ({}));
          sendResponse({ success: false, error: errJson.error || `Server error (${response.status})` });
          return;
        }
      } catch (err) {
        console.warn('[Telmy SW] Analyze form API error:', err.message);
        sendResponse({ success: false, error: err.message || 'Form analysis backend unavailable' });
        return;
      }

      sendResponse({ success: false, error: 'Form analysis backend unavailable' });
    });
    return true;
  }


  if (message.type === 'SUBMIT_SUGGESTION') {
    chrome.storage.local.get(['settings', 'suggestions_history']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const apiUrl = getEffectiveApiUrl(settings);
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
      const apiUrl = getEffectiveApiUrl(settings);
      const { message: chatMsg, history, language, formContext, screenshot: customScreenshot } = message.payload;

      // Capture lightweight viewport screenshot for Gemini Multimodal Vision reasoning (or use provided custom snip)
      let screenshot = customScreenshot || null;
      if (!screenshot) {
        try {
          const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
          const targetWindowId = (activeTab && activeTab.windowId) ? activeTab.windowId : null;
          screenshot = await new Promise((resolve) => {
            chrome.tabs.captureVisibleTab(targetWindowId, { format: 'jpeg', quality: 50 }, (dataUrl) => {
              if (chrome.runtime.lastError || !dataUrl) {
                chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 50 }, (dataUrlFallback) => {
                  if (chrome.runtime.lastError || !dataUrlFallback) resolve(null);
                  else resolve(dataUrlFallback);
                });
              } else {
                resolve(dataUrl);
              }
            });
          });
        } catch (err) {
          screenshot = null;
        }
      }

      try {
        const response = await fetchWithTimeout(`${apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: chatMsg, history, language, formContext, screenshot })
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
      const apiUrl = getEffectiveApiUrl(settings);
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
      const apiUrl = getEffectiveApiUrl(settings);

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

  // Context-Aware Full Page Translation (Priority 3)
  if (message.type === 'TRANSLATE_PAGE') {
    chrome.storage.local.get(['settings']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const apiUrl = getEffectiveApiUrl(settings);
      const { pageContext, targetLanguage, texts } = message.payload;

      try {
        const response = await fetchWithTimeout(`${apiUrl}/translate-page`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageContext, targetLanguage, texts })
        }, 40000);

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            sendResponse({ success: true, data: json.data });
            return;
          }
        }
      } catch (err) {
        console.warn('[Telmy SW] Translate API error:', err.message);
      }

      sendResponse({ success: false, error: 'Translation backend unavailable' });
    });
    return true;
  }

  // Multimodal Universal PDF Guidance (Priority 7)
  if (message.type === 'EXPLAIN_PDF') {
    chrome.storage.local.get(['settings', 'user']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const user = res.user || null;
      if (!user || !user.uid) {
        sendResponse({
          success: false,
          authRequired: true,
          error: 'Silakan login terlebih dahulu dengan Google untuk menganalisis dokumen PDF.'
        });
        return;
      }
      const apiUrl = getEffectiveApiUrl(settings);
      const { pdfUrl, pdfBase64, filename, language, mimeType = 'application/pdf' } = message.payload;
      const userId = user.uid;

      try {
        const response = await fetchWithTimeout(`${apiUrl}/explain-pdf`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify({ pdfUrl, pdfBase64, filename, language, mimeType, userId })
        }, 60000);

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            sendResponse({ success: true, data: json.data, quota: json.quota });
            return;
          }
        } else if (response.status === 402) {
          const errJson = await response.json().catch(() => ({}));
          sendResponse({
            success: false,
            quotaExhausted: true,
            quota: errJson.quota,
            pricingTiers: errJson.pricingTiers,
            error: errJson.message || 'Form analysis quota exhausted'
          });
          return;
        } else {
          const errJson = await response.json().catch(() => ({}));
          sendResponse({ success: false, error: errJson.error || 'Server rejected document payload' });
          return;
        }
      } catch (err) {
        console.warn('[Telmy SW] Document Explain API error:', err.message);
      }

      sendResponse({ success: false, error: 'Failed to analyze document form' });
    });
    return true;
  }

  // Stage PDF / Photo Session for Dashboard Studio Hand-off
  if (message.type === 'STAGE_PDF_SESSION') {
    chrome.storage.local.get(['settings', 'user']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const user = res.user || null;
      if (!user || !user.uid) {
        sendResponse({ success: false, authRequired: true, error: 'Silakan login terlebih dahulu dengan Google.' });
        return;
      }
      const apiUrl = getEffectiveApiUrl(settings);
      const { pdfUrl, pdfBase64, filename, mimeType = 'application/pdf' } = message.payload || {};
      const userId = user.uid;

      try {
        const response = await fetchWithTimeout(`${apiUrl}/pdf/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify({ pdfUrl, pdfBase64, filename, mimeType, userId })
        }, 30000);

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.sessionId) {
            const baseUrl = apiUrl.replace(/\/api\/?$/, '');
            sendResponse({
              success: true,
              sessionId: json.sessionId,
              studioUrl: `${baseUrl}/pdf-editor?session=${json.sessionId}`
            });
            return;
          }
        }
        const errJson = await response.json().catch(() => ({}));
        sendResponse({ success: false, error: errJson.error || 'Failed to stage PDF session' });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    });
    return true;
  }

  // Priority 8.5: Send User Feedback / Field Correction to Backend Firestore
  if (message.type === 'SEND_USER_FEEDBACK') {
    chrome.storage.local.get(['settings', 'user']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const user = res.user || null;
      const apiUrl = getEffectiveApiUrl(settings);
      const payload = message.payload || {};
      const bodyData = {
        ...payload,
        uid: user?.uid || payload.uid || 'anonymous',
        userEmail: user?.email || payload.userEmail || ''
      };

      try {
        const response = await fetchWithTimeout(`${apiUrl}/user/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData)
        }, 15000);

        if (response.ok) {
          const json = await response.json();
          sendResponse({ success: true, ...json });
          return;
        }
        const errJson = await response.json().catch(() => ({}));
        sendResponse({ success: false, error: errJson.error || 'Server error' });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    });
    return true;
  }

  // Priority 8: Get User Quota
  if (message.type === 'GET_USER_QUOTA') {
    chrome.storage.local.get(['settings', 'user']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const user = res.user || null;
      const apiUrl = getEffectiveApiUrl(settings);
      const userId = user?.uid || 'guest_user';
      try {
        const response = await fetchWithTimeout(`${apiUrl}/payment/quota/${userId}`, {}, 10000);
        if (response.ok) {
          const json = await response.json();
          sendResponse({ success: true, data: json.data });
          return;
        }
      } catch (e) {
        console.warn('[Telmy SW] Failed to fetch quota:', e.message);
      }
      sendResponse({ success: false, fallback: true });
    });
    return true;
  }

  // Priority 8: Simulate Lemon Squeezy Purchase
  if (message.type === 'SIMULATE_PURCHASE') {
    chrome.storage.local.get(['settings', 'user']).then(async (res) => {
      const settings = res.settings || DEFAULT_SETTINGS;
      const user = res.user || null;
      const apiUrl = getEffectiveApiUrl(settings);
      const userId = user?.uid || 'guest_user';
      const planId = message.planId || 'payg_10';
      try {
        const response = await fetchWithTimeout(`${apiUrl}/payment/simulate-purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: userId, planId })
        }, 15000);
        if (response.ok) {
          const json = await response.json();
          sendResponse({ success: true, ...json });
          return;
        }
      } catch (e) {
        console.warn('[Telmy SW] Failed to simulate purchase:', e.message);
      }
      sendResponse({ success: false, error: 'Simulation purchase failed' });
    });
    return true;
  }

  // Priority 7.5: 1-Click Native Tab Document Ingestion (Direct Buffer & Live URL Support)
  if (message.type === 'FETCH_ACTIVE_TAB_DOCUMENT') {
    (async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs || tabs.length === 0) {
          sendResponse({ success: false, error: 'No active tab found' });
          return;
        }
        const tab = tabs[0];
        const tabUrl = tab.url || '';

        // Check for local file
        if (tabUrl.startsWith('file://')) {
          sendResponse({ success: false, isLocalFile: true, url: tabUrl });
          return;
        }

        const filename = tabUrl.split('/').pop().split('?')[0] || 'document.pdf';

        // Helper: Convert Uint8Array to Base64 safely without stack overflow
        const uint8ToBase64 = (uint8) => {
          let binary = '';
          const len = uint8.byteLength;
          const chunkSize = 8192;
          for (let i = 0; i < len; i += chunkSize) {
            const chunk = uint8.subarray(i, Math.min(i + chunkSize, len));
            binary += String.fromCharCode.apply(null, chunk);
          }
          return btoa(binary);
        };

        // Priority 1: Direct fetch from Service Worker (CORS-free via host_permissions: <all_urls>)
        try {
          const resp = await fetchWithTimeout(tabUrl, {}, 30000);
          if (resp.ok) {
            const mimeType = resp.headers.get('content-type') || 'application/pdf';
            const arrayBuf = await resp.arrayBuffer();
            const uint8 = new Uint8Array(arrayBuf);
            const base64 = uint8ToBase64(uint8);
            const dataUrl = `data:${mimeType};base64,${base64}`;

            sendResponse({
              success: true,
              dataUrl,
              mimeType,
              filename
            });
            return;
          }
        } catch (fetchErr) {
          console.warn('[Telmy SW] Direct background fetch failed, trying in-page fetch fallback:', fetchErr.message);
        }

        // Priority 2: In-page execution fallback (for intranet or session-authenticated portals)
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: async () => {
              try {
                const resp = await fetch(window.location.href);
                if (!resp.ok) return { success: false, status: resp.status };
                const arrayBuf = await resp.arrayBuffer();
                const bytes = new Uint8Array(arrayBuf);
                let binary = '';
                const chunkSize = 8192;
                for (let i = 0; i < bytes.length; i += chunkSize) {
                  binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
                }
                const b64 = btoa(binary);
                const mime = resp.headers.get('content-type') || 'application/pdf';
                return {
                  success: true,
                  dataUrl: `data:${mime};base64,${b64}`,
                  mimeType: mime,
                  size: arrayBuf.byteLength
                };
              } catch (e) {
                return { success: false, error: e.message };
              }
            }
          });

          if (results && results[0] && results[0].result && results[0].result.success) {
            const data = results[0].result;
            sendResponse({
              success: true,
              dataUrl: data.dataUrl,
              mimeType: data.mimeType,
              filename
            });
            return;
          }
        } catch (scriptErr) {
          console.warn('[Telmy SW] In-page script fetch failed:', scriptErr.message);
        }

        sendResponse({ success: false, error: 'Could not download PDF from tab' });
      } catch (err) {
        console.warn('[Telmy SW] Fetch tab document failed:', err.message);
        sendResponse({ success: false, error: err.message });
      }
    })();
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

  // =========================================================================
  // Zero-Knowledge CSE Vault & Smart Document Extraction (Priority 7 & 8)
  // =========================================================================
  if (message.type === 'VAULT_GET') {
    (async () => {
      try {
        const stored = await chrome.storage.local.get(['telmy_vault_envelope', 'user', 'settings']);
        let envelope = stored.telmy_vault_envelope || null;
        const user = stored.user;
        const settings = stored.settings || DEFAULT_SETTINGS;
        const apiUrl = getEffectiveApiUrl(settings);

        // If authenticated, check cloud Firestore for cross-device sync
        if (user && user.uid) {
          try {
            const resp = await fetchWithTimeout(`${apiUrl}/user/vault/${user.uid}`, {}, 6000);
            if (resp.ok) {
              const json = await resp.json();
              if (json.success && json.data) {
                const cloudEnv = json.data;
                const localDate = envelope && envelope.updatedAt ? new Date(envelope.updatedAt).getTime() : 0;
                const cloudDate = cloudEnv.updatedAt ? new Date(cloudEnv.updatedAt).getTime() : 0;
                if (!envelope || cloudDate >= localDate) {
                  envelope = {
                    ciphertext: cloudEnv.ciphertext,
                    iv: cloudEnv.iv,
                    salt: cloudEnv.salt,
                    updatedAt: cloudEnv.updatedAt
                  };
                  await chrome.storage.local.set({ telmy_vault_envelope: envelope });
                }
              }
            }
          } catch (cloudErr) {
            console.warn('[Telmy SW] Cloud vault fetch failed, using local:', cloudErr.message);
          }
        }

        sendResponse({ success: true, envelope });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.type === 'VAULT_SAVE') {
    (async () => {
      try {
        const envelope = message.envelope;
        if (!envelope || !envelope.ciphertext || !envelope.iv || !envelope.salt) {
          sendResponse({ success: false, error: 'Invalid envelope' });
          return;
        }

        // 1. Save locally
        await chrome.storage.local.set({ telmy_vault_envelope: envelope });

        // 2. Sync to cloud Firestore if user is logged in
        const stored = await chrome.storage.local.get(['user', 'settings']);
        const user = stored.user;
        const settings = stored.settings || DEFAULT_SETTINGS;
        const apiUrl = getEffectiveApiUrl(settings);

        if (user && user.uid) {
          try {
            await fetchWithTimeout(`${apiUrl}/user/vault/${user.uid}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ciphertext: envelope.ciphertext,
                iv: envelope.iv,
                salt: envelope.salt,
                updatedAt: envelope.updatedAt || new Date().toISOString()
              })
            }, 8000);
          } catch (cloudErr) {
            console.warn('[Telmy SW] Cloud vault sync failed:', cloudErr.message);
          }
        }

        sendResponse({ success: true, envelope });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.type === 'VAULT_WIPE') {
    (async () => {
      try {
        await chrome.storage.local.remove(['telmy_vault_envelope', 'telmy_vault_session_cache', 'telmy_autofill']);

        const stored = await chrome.storage.local.get(['user', 'settings']);
        const user = stored.user;
        const settings = stored.settings || DEFAULT_SETTINGS;
        const apiUrl = getEffectiveApiUrl(settings);

        if (user && user.uid) {
          try {
            await fetchWithTimeout(`${apiUrl}/user/vault/${user.uid}`, {
              method: 'DELETE'
            }, 6000);
          } catch (cloudErr) {
            console.warn('[Telmy SW] Cloud vault wipe failed:', cloudErr.message);
          }
        }

        sendResponse({ success: true });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.type === 'VAULT_EXTRACT_DOCUMENT') {
    (async () => {
      try {
        const stored = await chrome.storage.local.get(['settings']);
        const settings = stored.settings || DEFAULT_SETTINGS;
        const apiUrl = getEffectiveApiUrl(settings);

        const resp = await fetchWithTimeout(`${apiUrl}/pdf/extract-vault`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: message.fileBase64,
            fileName: message.fileName || 'Document.pdf',
            mimeType: message.mimeType || 'application/pdf'
          })
        }, 60000);

        if (!resp.ok) {
          const errJson = await resp.json().catch(() => ({}));
          throw new Error(errJson.error || `HTTP ${resp.status}`);
        }

        const data = await resp.json();
        sendResponse(data);
      } catch (err) {
        console.error('[Telmy SW] Document extraction failed:', err);
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
});

// External message listener (e.g. from telmy.id web dashboard)
if (chrome.runtime.onMessageExternal) {
  chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.type === 'PING') {
      sendResponse({ status: 'ok', extension: 'Telmy.ai', version: '1.0.0' });
      return false;
    }
    if (message.type === 'CONNECT_USER') {
      chrome.storage.local.set({
        user: message.user,
        hasCompletedOnboarding: true
      }).then(() => {
        sendResponse({ success: true, connected: true });
      });
      return true;
    }
  });
}


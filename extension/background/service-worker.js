// Service Worker for Telmy
const DEFAULT_SETTINGS = {
  language: 'en', // 'en', 'id', 'ja', 'ko', 'zh', 'zh-TW', 'vi', 'th', 'hi', 'fil', 'ms'
  isActive: true,
  theme: 'light',
  highlightColor: '#2563eb',
  apiUrl: 'https://telmy-ai.cloud.run/api'
};

// Helper: resolve safe API URL (strips legacy localhost or stale domains)
function getEffectiveApiUrl(settings) {
  const url = settings?.apiUrl;
  if (!url || url.includes('localhost') || url.includes('127.0.0.1') || url.includes('telmy.web.app') || url.includes('asia-northeast1.run.app')) {
    return DEFAULT_SETTINGS.apiUrl;
  }
  return url;
}

// Proactive sanitization to purge any stale localhost:8080 from browser storage
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
      settings.apiUrl.includes('asia-northeast1.run.app')
    ) {
      settings = { ...settings, apiUrl: DEFAULT_SETTINGS.apiUrl };
      needsUpdate = true;
    }

    if (needsUpdate) {
      await chrome.storage.local.set({ settings });
      console.log('[Telmy] Storage migrated to production Cloud Run API:', settings.apiUrl);
    }
    if (!stored.suggestions_history) {
      await chrome.storage.local.set({ suggestions_history: [] });
    }
    return settings;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

// Run immediately on service worker boot
sanitizeSettings();

// Setup Right-Click Context Menu (Plan v6)
function setupContextMenus() {
  if (!chrome.contextMenus) return;
  try {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'telmy_analyze_page',
        title: 'Analyze This Page with Telmy AI 🤖',
        contexts: ['page', 'frame', 'editable', 'selection']
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

// Handle Context Menu Clicks: Open Side Panel and Analyze Tab (Method 1)
if (chrome.contextMenus && chrome.contextMenus.onClicked) {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab || !tab.id) return;
    if (info.menuItemId === 'telmy_analyze_page') {
      try {
        if (chrome.sidePanel && chrome.sidePanel.open) {
          await chrome.sidePanel.open({ tabId: tab.id });
        }
      } catch (e) {}

      // Enforce Login Gate: If user has not signed in, do not trigger scanner!
      const stored = await chrome.storage.local.get(['user']);
      if (!stored.user || (!stored.user.uid && !stored.user.email)) {
        console.log('[Telmy SW] User not signed in. Opening side panel in login-required mode.');
        return;
      }

      // Trigger instant scanner on the active tab (no refresh needed)
      chrome.tabs.sendMessage(tab.id, { type: 'ACTIVATE_SCANNER' }, () => {
        if (chrome.runtime.lastError) {
          // If content script was not loaded yet, inject into main frame dynamically
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content/scanner.js', 'content/highlighter.js', 'content/translator.js', 'content/content-main.js']
          }).then(() => {
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, { type: 'ACTIVATE_SCANNER' });
            }, 150);
          }).catch(() => {});
        }
      });
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
    chrome.storage.local.set({ user: message.user, hasCompletedOnboarding: true }).then(() => {
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
      const apiUrl = getEffectiveApiUrl(settings);
      const { domain, url, title, fields, instructions, language } = message.payload || {};
      const userId = user?.uid || 'guest_user';

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
      const apiUrl = getEffectiveApiUrl(settings);
      const { pdfBase64, filename, language, mimeType = 'application/pdf' } = message.payload;
      const userId = user?.uid || 'guest_user';

      try {
        const response = await fetchWithTimeout(`${apiUrl}/explain-pdf`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify({ pdfBase64, filename, language, mimeType, userId })
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

  // Priority 7.5: 1-Click Native Tab Document Ingestion
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

        // Try downloading directly via in-page execution (CORS-safe & session-safe)
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: async () => {
              try {
                const resp = await fetch(window.location.href);
                if (!resp.ok) return { success: false, status: resp.status };
                const blob = await resp.blob();
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve({
                    success: true,
                    dataUrl: reader.result,
                    mimeType: blob.type || 'application/pdf',
                    size: blob.size
                  });
                  reader.onerror = () => resolve({ success: false, error: 'FileReader error' });
                  reader.readAsDataURL(blob);
                });
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
              filename: tabUrl.split('/').pop().split('?')[0] || 'document.pdf'
            });
            return;
          }
        } catch (scriptErr) {
          console.warn('[Telmy SW] In-page script fetch failed, attempting direct fetch:', scriptErr.message);
        }

        // Fallback: direct background fetch
        const resp = await fetchWithTimeout(tabUrl, {}, 25000);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          sendResponse({
            success: true,
            dataUrl: reader.result,
            mimeType: blob.type || 'application/pdf',
            filename: tabUrl.split('/').pop().split('?')[0] || 'document.pdf'
          });
        };
        reader.readAsDataURL(blob);
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

// External message listener (e.g. from telmy-ai.cloud.run web dashboard)
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


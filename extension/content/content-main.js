// Telmy — Main Content Script Orchestrator (Optimized for On-Demand Chrome Native Side Panel)
(function () {
  // Strict Exclusion: Never scan Telmy's own internal auth/login or dashboard portals
  const currentPath = (window.location.pathname || '').toLowerCase();
  const pageTitle = (document.title || '').toLowerCase();
  const isAuthOrDashboard = currentPath.includes('connect') ||
                            currentPath.includes('dashboard') ||
                            currentPath.includes('privacy') ||
                            document.querySelector('.connect-card') ||
                            document.getElementById('telmy-app-root') ||
                            (pageTitle.includes('connect') && pageTitle.includes('telmy')) ||
                            (pageTitle.includes('dashboard') && pageTitle.includes('telmy'));
  if (isAuthOrDashboard) {
    return;
  }

  // Ensure any in-page floating panel or launcher pill elements are purged
  function cleanupFloatingDOM() {
    const oldPanel = document.getElementById('gmt-side-panel-container');
    if (oldPanel) oldPanel.remove();
    const oldPill = document.getElementById('gmt-launcher-pill');
    if (oldPill) oldPill.remove();
  }
  cleanupFloatingDOM();

  if (window.__TELMY_INITIALIZED__) {
    if (typeof window.__TELMY_TRIGGER_SCAN__ === 'function') {
      window.__TELMY_TRIGGER_SCAN__();
    }
    return;
  }
  window.__TELMY_INITIALIZED__ = true;

  // Global trigger handle for re-activation
  window.__TELMY_TRIGGER_SCAN__ = () => {
    isScannerActivated = true;
    gmtSettings.isActive = true;
    startScanWorkflow();
  };

  // On initial page load, scanner is in passive STANDBY mode (isActive = false)
  // Badges & DOM observer are only attached when user explicitly activates Telmy
  let gmtSettings = { language: 'en', isActive: false };
  let isScannerActivated = false;
  let dictionaryData = null;
  let scannedItems = [];
  let isScanning = false;
  let cachedPageSummary = null;
  let domObserver = null;
  let debounceTimer = null;

  function safeSendMessage(msg, callback = null) {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        chrome.runtime.sendMessage(msg, (resp) => {
          const err = chrome.runtime.lastError;
          if (!err && callback) callback(resp);
        });
      }
    } catch (e) {
      // Extension context invalidated due to unpacked reload
    }
  }

  function getSerializableFields() {
    return (scannedItems || []).map(item => ({
      metadata: {
        scanIndex: item.metadata.scanIndex,
        id: item.metadata.id,
        name: item.metadata.name,
        type: item.metadata.type,
        options: item.metadata.options,
        placeholder: item.metadata.placeholder,
        label: item.metadata.label,
        isPassword: Boolean(item.metadata.isPassword || item.isPassword)
      },
      dictEntry: item.dictEntry,
      isCustomAi: item.isCustomAi,
      isPassword: Boolean(item.metadata.isPassword || item.isPassword)
    }));
  }

  // 1. Listen for runtime messages from Side Panel & Background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // A. Explicit Activation & Trigger Rescan (both execute full scan and return full fields)
    if (message.type === 'ACTIVATE_SCANNER' || message.type === 'TRIGGER_RESCAN') {
      console.log('[Telmy Content] 🚀 ACTIVATE_SCANNER received on page:', window.location.href);
      isScannerActivated = true;
      gmtSettings.isActive = true;
      startScanWorkflow(() => {
        const fields = getSerializableFields();
        console.log('[Telmy Content] Form scanning complete. Detected fields:', fields.length);

        let actionBtnData = null;
        if (fields.length === 0 && window.GMTScanner && window.GMTScanner.findActionButtons) {
          const actionMatches = window.GMTScanner.findActionButtons();
          console.log('[Telmy Content] 0 fields detected. Action button matches found:', actionMatches.length);
          if (actionMatches.length > 0 && window.GMTHighlighter) {
            const firstMatch = actionMatches[0];
            window.GMTHighlighter.highlightActionButton(firstMatch.element, `Klik disini: ${firstMatch.text}`);
            actionBtnData = {
              text: firstMatch.text,
              keyword: firstMatch.keyword
            };
            console.log('[Telmy Content] 🎯 Highlighted action button on page:', actionBtnData);
          }
        }

        sendResponse({
          success: true,
          count: fields.length,
          fields: fields,
          summary: cachedPageSummary,
          actionButton: actionBtnData,
          isActive: true
        });
      });
      return true; // async sendResponse
    }

    // A2. Explicit Find & Highlight Action Button Intent (e.g. "cara mengajukan permohonan baru dimana ya?")
    if (message.type === 'FIND_AND_HIGHLIGHT_ACTION_BUTTON') {
      console.log('[Telmy Content] 🔍 FIND_AND_HIGHLIGHT_ACTION_BUTTON received.');
      let actionBtnData = null;
      let fieldsCount = (scannedItems || []).length;

      if (fieldsCount === 0 && window.GMTScanner) {
        scannedItems = window.GMTScanner.scanForms(dictionaryData);
        fieldsCount = scannedItems.length;
      }

      if (window.GMTScanner && window.GMTScanner.findActionButtons) {
        const actionMatches = window.GMTScanner.findActionButtons();
        console.log('[Telmy Content] Action matches detected:', actionMatches.length);
        if (actionMatches.length > 0 && window.GMTHighlighter) {
          const firstMatch = actionMatches[0];
          window.GMTHighlighter.highlightActionButton(firstMatch.element, `Klik disini: ${firstMatch.text}`);
          actionBtnData = {
            text: firstMatch.text,
            keyword: firstMatch.keyword
          };
          console.log('[Telmy Content] 🎯 Highlighted action button:', actionBtnData);
        }
      }

      sendResponse({
        success: true,
        fieldsCount: fieldsCount,
        actionButton: actionBtnData
      });
      return false;
    }

    // A3. Click Highlighted Action Button (From Chatbot CTA Chip)
    if (message.type === 'CLICK_ACTION_BUTTON') {
      console.log('[Telmy Content] 👉 CLICK_ACTION_BUTTON invoked.');
      if (window.GMTHighlighter && window.GMTHighlighter.clickHighlightedActionButton) {
        const clicked = window.GMTHighlighter.clickHighlightedActionButton();
        sendResponse({ success: true, clicked });
      } else {
        sendResponse({ success: false });
      }
      return false;
    }

    // A4. Direct Spotlight Element (from Gemini AI Vision / Action)
    if (message.type === 'SPOTLIGHT_ELEMENT') {
      const label = message.label || 'Klik di sini untuk melanjutkan';
      let targetEl = null;

      if (message.selector) {
        try { targetEl = document.querySelector(message.selector); } catch (e) {}
      }

      const queryText = (message.text || message.label || '').toLowerCase().trim();
      if (!targetEl && queryText) {
        // 1. Search buttons and navbar action links with bilingual synonyms (login <-> masuk, register <-> daftar)
        const synonyms = [queryText];
        if (/login|sign in|signin|masuk/i.test(queryText)) synonyms.push('masuk', 'login', 'sign in', 'log in');
        if (/register|sign up|signup|daftar/i.test(queryText)) synonyms.push('daftar', 'register', 'sign up');
        if (/submit|send|kirim/i.test(queryText)) synonyms.push('kirim', 'submit', 'lanjut');

        const candidates = document.querySelectorAll('button, a.btn, [role="button"], input[type="submit"], input[type="button"], .btn, header a, nav a, .navbar a, a[class*="btn"], a[class*="button"]');
        for (const el of candidates) {
          const btnText = (el.innerText || el.value || el.getAttribute('aria-label') || '').toLowerCase().trim();
          if (btnText && synonyms.some(syn => btnText === syn || btnText.includes(syn) || syn.includes(btnText))) {
            targetEl = el;
            break;
          }
        }

        // 1b. Fallback matching by href attribute for login/masuk/daftar
        if (!targetEl && /login|sign in|masuk/i.test(queryText)) {
          targetEl = document.querySelector('a[href*="login"], a[href*="masuk"], a[href*="auth"], button[id*="login"], button[id*="masuk"], a.btn-login, a.btn-masuk');
        }
        if (!targetEl && /register|sign up|daftar/i.test(queryText)) {
          targetEl = document.querySelector('a[href*="register"], a[href*="daftar"], a[href*="signup"], button[id*="register"], button[id*="daftar"]');
        }

        // 2. Search scanned form fields (photo upload, text inputs, etc.)
        if (!targetEl && Array.isArray(scannedItems) && scannedItems.length > 0) {
          for (const item of scannedItems) {
            const meta = item.metadata || {};
            const metaStr = `${meta.label || ''} ${meta.name || ''} ${meta.placeholder || ''} ${meta.type || ''}`.toLowerCase();
            if (metaStr.includes(queryText) || (meta.label && queryText.includes(meta.label.toLowerCase()))) {
              targetEl = meta.element;
              break;
            }
          }
        }

        // 3. Fallback for photo/picture/file upload elements
        if (!targetEl && /photo|picture|foto|image|upload|file|lampiran|berkas|dokumen/i.test(queryText)) {
          targetEl = document.querySelector('input[type="file"], [class*="upload"], [class*="dropzone"], [class*="photo"], [class*="picture"], [id*="upload"], [id*="photo"], [id*="picture"], [id*="file"]');
        }

        // 4. Search all visible form inputs by label / placeholder
        if (!targetEl) {
          const formInputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
          for (const inp of formInputs) {
            const labelStr = `${inp.labels?.[0]?.innerText || ''} ${inp.getAttribute('placeholder') || ''} ${inp.name || ''} ${inp.id || ''}`.toLowerCase();
            if (labelStr && (labelStr.includes(queryText) || queryText.includes(labelStr.trim()))) {
              targetEl = inp;
              break;
            }
          }
        }

        // 5. Fallback to submit button if query implies submit/kirim/send
        if (!targetEl && /submit|kirim|send|daftar|register|simpan|save/i.test(queryText)) {
          targetEl = document.querySelector('button[type="submit"], input[type="submit"], button.btn-primary, button.btn-submit');
        }
      }

      if (!targetEl && window.GMTScanner && window.GMTScanner.findActionButtons) {
        const matches = window.GMTScanner.findActionButtons();
        if (matches.length > 0) targetEl = matches[0].element;
      }

      if (targetEl && window.GMTHighlighter) {
        window.GMTHighlighter.highlightActionButton(targetEl, label);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false });
      }
      return false;
    }

    // B. Explicit Deactivation (User clicked Close / X / toggled off)
    if (message.type === 'DEACTIVATE_SCANNER') {
      console.log('[Telmy Content] 🛑 DEACTIVATE_SCANNER received.');
      isScannerActivated = false;
      gmtSettings.isActive = false;
      stopScanWorkflow();
      sendResponse({ success: true, isActive: false });
      return false;
    }

    // C. Settings changed
    if (message.type === 'SETTINGS_CHANGED') {
      const wasActive = gmtSettings.isActive;
      gmtSettings = message.settings || gmtSettings;

      if (gmtSettings.isActive === false) {
        stopScanWorkflow();
      } else if (!wasActive && gmtSettings.isActive && isScannerActivated) {
        runScanAndHighlight(cachedPageSummary);
      }
      sendResponse({ success: true });
      return false;
    }

    // D. Query Status
    if (message.type === 'QUERY_PAGE_STATUS') {
      sendResponse({
        detectedFieldsCount: scannedItems.length,
        isActive: isScannerActivated && gmtSettings.isActive !== false
      });
      return false;
    }

    // D2. Extract Active Page Context (DOM Structure & Text Content like Chrome Ask Gemini)
    if (message.type === 'GET_ACTIVE_PAGE_CONTEXT') {
      try {
        const title = document.title || '';
        const url = window.location.href;
        const domain = window.location.hostname;

        // Headings
        const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
          .map(h => (h.innerText || h.textContent || '').trim())
          .filter(t => t.length > 2 && t.length < 150)
          .slice(0, 10);

        // Buttons & Action Links (includes navbar Masuk, Daftar, Login, etc.)
        const buttons = Array.from(document.querySelectorAll(
          'button, input[type="submit"], input[type="button"], a.btn, a[role="button"], a[class*="btn"], a[class*="button"], header a, nav a, .navbar a, a[href*="login"], a[href*="masuk"], a[href*="auth"], a[href*="register"], a[href*="daftar"]'
        ))
          .map(b => (b.innerText || b.value || b.getAttribute('aria-label') || '').trim())
          .filter(t => t.length > 1 && t.length < 60)
          .filter((v, i, a) => a.indexOf(v) === i)
          .slice(0, 25);

        // Visible text snippet
        const bodyClone = document.body.cloneNode(true);
        bodyClone.querySelectorAll('script, style, noscript, svg, #telmy-overlay, .gmt-badge, #telmy-page-scan-overlay, .telmy-virtual-pointer').forEach(el => el.remove());
        const cleanText = (bodyClone.innerText || bodyClone.textContent || '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 2500);

        // Quick inputs map if scanner hasn't run yet
        const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'))
          .map((el, idx) => {
            const labelEl = el.labels && el.labels[0] ? el.labels[0].innerText : '';
            const placeholder = el.getAttribute('placeholder') || '';
            const name = el.getAttribute('name') || el.getAttribute('id') || `Field ${idx + 1}`;
            return {
              label: (labelEl || placeholder || name).trim(),
              type: el.type || 'text',
              name: el.name || el.id || ''
            };
          })
          .filter(i => i.label && i.type !== 'submit' && i.type !== 'button')
          .slice(0, 20);

        sendResponse({
          success: true,
          title,
          url,
          domain,
          headings,
          buttons,
          mainText: cleanText,
          inputs
        });
      } catch (err) {
        sendResponse({
          success: false,
          error: err.message,
          title: document.title || '',
          url: window.location.href
        });
      }
      return false;
    }

    // F. Highlight Field by Index
    if (message.type === 'GMT_ACTIVATE_FIELD_BY_INDEX') {
      if (window.GMTHighlighter && scannedItems[message.index]) {
        window.GMTHighlighter.setActiveField(message.index, scannedItems);
      }
      sendResponse({ success: true });
      return false;
    }

    // G. Priority 9.1: Smart Fill Field Value (User-Initiated explicit action)
    if (message.type === 'FILL_FIELD_BY_INDEX') {
      const item = scannedItems[message.index];
      if (item && item.metadata && item.metadata.element) {
        const el = item.metadata.element;
        // Whitelist safety: strictly exclude password and credit card / CVV fields
        const isSafe = el.type !== 'password' &&
                       !(el.name && /card|cvv|cvc|otp|pin|token/i.test(el.name)) &&
                       !(el.id && /card|cvv|cvc|otp|pin|token/i.test(el.id));
        if (isSafe) {
          try {
            el.focus();
            el.value = message.value || '';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            // Add a brief subtle pulse outline to confirm fill
            el.classList.add('gmt-field-smart-filled');
            setTimeout(() => el.classList.remove('gmt-field-smart-filled'), 1500);
            sendResponse({ success: true, filled: true });
            return false;
          } catch (e) {
            sendResponse({ success: false, error: e.message });
            return false;
          }
        }
      }
      sendResponse({ success: false, reason: 'Field not found or sensitive' });
      return false;
    }

    // G2. Priority 9.1: 1-Click AutoFill All Matching Fields from User Vault
    if (message.type === 'AUTOFILL_FORM_FIELDS') {
      const data = message.data || {};
      let filledCount = 0;

      scannedItems.forEach((item) => {
        if (!item || !item.metadata || !item.metadata.element) return;
        const el = item.metadata.element;
        // Strictly exclude passwords, credit cards, CVVs, tokens
        const isSafe = el.type !== 'password' &&
                       !(el.name && /card|cvv|cvc|otp|pin|token/i.test(el.name)) &&
                       !(el.id && /card|cvv|cvc|otp|pin|token/i.test(el.id));
        if (!isSafe) return;

        const label = ((item.metadata.label || '') + ' ' + (item.metadata.name || '') + ' ' + (item.metadata.placeholder || '')).toLowerCase();
        let valToFill = null;

        // 1. Dynamic Vault Fields Matching (Priority 8.4)
        if (Array.isArray(data.fields)) {
          for (const f of data.fields) {
            if (!f || !f.value) continue;
            const matchKeywords = [f.key, ...(f.aliases || []), f.label].filter(Boolean);
            const isMatch = matchKeywords.some(kw => {
              const cleanKw = kw.toLowerCase().trim();
              return cleanKw.length >= 2 && label.includes(cleanKw);
            });
            if (isMatch) {
              valToFill = f.value;
              break;
            }
          }
        }

        // 2. Legacy Key-Value Matching Fallback
        if (!valToFill) {
          if (/(full.*name|applicant.*name|nama.*lengkap|your.*name|nama pemohon)/i.test(label) && (data.full_name || data.name)) {
            valToFill = data.full_name || data.name;
          } else if (/(passport|no.*paspor|nomor.*paspor)/i.test(label) && (data.passport_number || data.passport)) {
            valToFill = data.passport_number || data.passport;
          } else if (/(nik|ktp|national.*id|identity.*number)/i.test(label) && data.nik) {
            valToFill = data.nik;
          } else if (/(birth.*date|date.*of.*birth|tanggal.*lahir|dob)/i.test(label) && (data.birth_date || data.dob)) {
            valToFill = data.birth_date || data.dob;
          } else if (/(nationality|kewarganegaraan|citizenship)/i.test(label) && data.nationality) {
            valToFill = data.nationality;
          } else if (/(phone|telp|nomor.*hp|mobile|telephone|whatsapp)/i.test(label) && data.phone) {
            valToFill = data.phone;
          } else if (/(address|alamat|domisili|residence)/i.test(label) && data.address) {
            valToFill = data.address;
          } else if (/(gpa|ipk|grade point)/i.test(label) && data.gpa) {
            valToFill = data.gpa;
          } else if (/(emergency|kontak.*darurat)/i.test(label) && (data.emergency_contact || data.emergency)) {
            valToFill = data.emergency_contact || data.emergency;
          }
        }

        if (valToFill && !el.value) {
          try {
            el.focus();
            el.value = valToFill;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.classList.add('gmt-field-smart-filled');
            setTimeout(() => el.classList.remove('gmt-field-smart-filled'), 1500);
            filledCount++;
          } catch (e) {}
        }
      });

      sendResponse({ success: true, filledCount });
      return false;
    }

    // H. Priority 9.2: Form Pre-Submission Auditor (Audit current DOM inputs)
    if (message.type === 'AUDIT_FORM_VALUES') {
      const auditPayload = scannedItems.map((item, idx) => {
        const el = item.metadata.element;
        const val = el ? (el.value || el.innerText || '') : '';
        const req = el ? (el.required || el.getAttribute('aria-required') === 'true' || item.dictEntry?.required) : false;
        return {
          index: idx,
          label: item.metadata.label || `Field #${idx + 1}`,
          type: item.metadata.type || 'text',
          name: item.metadata.name || '',
          value: val.trim(),
          required: Boolean(req)
        };
      });
      sendResponse({ success: true, fields: auditPayload });
      return false;
    }

    // I. Plan V7: Accessibility Bridge Runtime Handlers
    if (message.type === 'A11Y_TOGGLE_SPOTLIGHT') {
      const enabled = window.TelmyA11y ? window.TelmyA11y.toggleSpotlight() : false;
      sendResponse({ success: true, enabled });
      return false;
    }

    if (message.type === 'A11Y_SET_SPOTLIGHT') {
      if (window.TelmyA11y) window.TelmyA11y.setSpotlight(message.enabled);
      sendResponse({ success: true, enabled: message.enabled });
      return false;
    }

    if (message.type === 'A11Y_TOGGLE_CLICK_TO_SPEAK') {
      const enabled = window.TelmyA11y ? window.TelmyA11y.toggleClickToSpeak() : false;
      sendResponse({ success: true, enabled });
      return false;
    }

    if (message.type === 'A11Y_SET_CLICK_TO_SPEAK') {
      if (window.TelmyA11y) window.TelmyA11y.setClickToSpeak(message.enabled);
      sendResponse({ success: true, enabled: message.enabled });
      return false;
    }

    if (message.type === 'A11Y_SET_THICK_FOCUS') {
      if (window.TelmyA11y) window.TelmyA11y.setThickFocus(message.enabled);
      sendResponse({ success: true, enabled: message.enabled });
      return false;
    }

    if (message.type === 'A11Y_SET_SPEECH_RATE') {
      if (window.TelmyA11y) window.TelmyA11y.setSpeechRate(message.rate);
      sendResponse({ success: true, rate: message.rate });
      return false;
    }

    if (message.type === 'A11Y_SET_LANGUAGE') {
      if (window.TelmyA11y) window.TelmyA11y.setLanguage(message.lang);
      sendResponse({ success: true, lang: message.lang });
      return false;
    }

    if (message.type === 'A11Y_GET_STATE') {
      const state = window.TelmyA11y ? window.TelmyA11y.getState() : {};
      sendResponse({ success: true, state });
      return false;
    }
  });

  let scanLadderTimers = [];
  let isSPAListenerAttached = false;

  // 2. Stop Scan Workflow (Clean cleanup on close/off)
  function stopScanWorkflow() {
    scanLadderTimers.forEach(clearTimeout);
    scanLadderTimers = [];
    if (domObserver) {
      domObserver.disconnect();
      domObserver = null;
    }
    if (window.GMTHighlighter) {
      window.GMTHighlighter.clearBadges();
    }
    cleanupFloatingDOM();
    scannedItems = [];
    isScanning = false;
  }

  // Intercept Single-Page Application (SPA) client-side navigation (e.g. Next.js router in Apostille)
  function setupSPARouteInterceptor() {
    if (isSPAListenerAttached) return;
    isSPAListenerAttached = true;

    const onRoute = () => {
      if (!isScannerActivated || gmtSettings.isActive === false) return;
      triggerScanLadder();
    };

    window.addEventListener('popstate', onRoute);
    window.addEventListener('hashchange', onRoute);

    try {
      const origPushState = history.pushState;
      if (origPushState) {
        history.pushState = function (...args) {
          const ret = origPushState.apply(this, args);
          onRoute();
          return ret;
        };
      }
      const origReplaceState = history.replaceState;
      if (origReplaceState) {
        history.replaceState = function (...args) {
          const ret = origReplaceState.apply(this, args);
          onRoute();
          return ret;
        };
      }
    } catch (e) {}
  }

  // Progressive Scan Ladder: Crucial for JS-rendered SPAs (React, Next.js, Vue)
  function triggerScanLadder() {
    scanLadderTimers.forEach(clearTimeout);
    scanLadderTimers = [];

    // Scan immediately
    runScanAndHighlight(cachedPageSummary);

    // Retries at progressive intervals as JS bundles hydrate and AJAX forms mount
    const delays = [350, 900, 1800, 3200];
    delays.forEach(delay => {
      const timer = setTimeout(() => {
        if (isScannerActivated && gmtSettings.isActive !== false) {
          runScanAndHighlight(cachedPageSummary, true);
        }
      }, delay);
      scanLadderTimers.push(timer);
    });
  }

  // 3. Start Scan Workflow (On-Demand Activation)
  function startScanWorkflow(onComplete) {
    cleanupFloatingDOM();

    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (settings) => {
      if (!chrome.runtime.lastError && settings) {
        gmtSettings = { ...gmtSettings, ...settings, isActive: true };
      }

      dictionaryData = [];
      cachedPageSummary = null;
      window.__TELMY_DICT__ = dictionaryData;

      triggerScanLadder();
      setupMutationObserver();
      setupSPARouteInterceptor();

      if (onComplete) onComplete();
    });
  }

  // 4. Setup MutationObserver for dynamic SPAs (Monitors DOM additions & visibility toggles)
  function setupMutationObserver() {
    if (domObserver || !window.MutationObserver || !isScannerActivated) return;

    domObserver = new MutationObserver((mutations) => {
      if (!isScannerActivated || gmtSettings.isActive === false) return;
      let shouldRescan = false;
      for (const m of mutations) {
        if (m.target && m.target.closest && (m.target.closest('.gmt-ui-container') || m.target.closest('.gmt-field-badge'))) continue;
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1) {
              if (node.classList && (node.classList.contains('gmt-field-badge') || node.classList.contains('gmt-ui-container'))) continue;
              if (
                (node.matches && node.matches('input, select, textarea, [role="textbox"], [role="radiogroup"], [role="group"], [role="combobox"], [role="listbox"], form, .form-group, .card, [class*="form"], [class*="field"], [class*="step"], [class*="tab"]')) ||
                (node.querySelector && node.querySelector('input, select, textarea, [role="textbox"], [role="combobox"]'))
              ) {
                shouldRescan = true;
                break;
              }
            }
          }
        } else if (m.type === 'attributes') {
          // Ignore Telmy's own highlight and badge class toggles
          if (m.attributeName === 'class' && m.target && m.target.classList) {
            if (m.target.classList.contains('gmt-highlighted-field') || m.target.classList.contains('gmt-badge-active')) {
              continue;
            }
          }
          // Detect visibility change on step wizards, modals, tabs
          if (m.target && m.target.nodeType === 1) {
            const el = m.target;
            if (el.matches && el.matches('input, select, textarea, form, [role="tabpanel"], .tab-pane, .fade, [class*="step"], [class*="modal"], [class*="wizard"], [class*="tab"]')) {
              shouldRescan = true;
            }
          }
        }
        if (shouldRescan) break;
      }

      if (shouldRescan) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (isScannerActivated && gmtSettings.isActive !== false) {
            runScanAndHighlight(cachedPageSummary, true);
          }
        }, 300);
      }
    });

    domObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden', 'aria-hidden']
    });
  }

  // 5. Scan and Highlight
  function runScanAndHighlight(pageSummary = null, isIncremental = false) {
    if (isScanning || !isScannerActivated || gmtSettings.isActive === false) return;
    if (!window.GMTScanner) return;
    isScanning = true;

    try {
      cleanupFloatingDOM();

      const prevCount = scannedItems ? scannedItems.length : 0;
      // Scan page
      scannedItems = window.GMTScanner.scanForms(dictionaryData);

      if (scannedItems.length > 0 && window.GMTHighlighter) {
        // Attach numbered badges on form inputs
        window.GMTHighlighter.attachBadges(scannedItems, (item, index) => {
          safeSendMessage({
            type: 'GMT_FIELD_FOCUSED',
            index: index
          });
        });
      } else if (window.GMTHighlighter && prevCount > 0) {
        window.GMTHighlighter.clearBadges();
      }

      // Broadcast serializable fields to Chrome Native Side Panel
      try {
        const serializableFields = scannedItems.map(item => ({
          metadata: {
            scanIndex: item.metadata.scanIndex,
            id: item.metadata.id,
            name: item.metadata.name,
            type: item.metadata.type,
            options: item.metadata.options,
            placeholder: item.metadata.placeholder,
            label: item.metadata.label
          },
          dictEntry: item.dictEntry,
          isCustomAi: item.isCustomAi
        }));

        safeSendMessage({
          type: 'GMT_PAGE_MAPPED',
          fields: serializableFields,
          summary: pageSummary || cachedPageSummary,
          count: serializableFields.length
        });
      } catch (e) {}
    } finally {
      isScanning = false;
    }
  }

  // Initial standby boot (Purges any leftover floating UI, waits in passive standby)
  cleanupFloatingDOM();
})();

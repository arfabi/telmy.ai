// Telmy — Main Content Script Orchestrator
(function () {
  if (window.__TELMY_INITIALIZED__) {
    // Already loaded, just run a fresh scan
    if (window.GMTScanner && window.GMTPanel) {
      const items = window.GMTScanner.scanForms(window.__TELMY_DICT__ || []);
      if (items.length > 0 && window.GMTHighlighter) {
        window.GMTHighlighter.attachBadges(items, (item, index) => {
          window.GMTPanel.render(item, index, items.length, 'id');
        });
      }
    }
    return;
  }
  window.__TELMY_INITIALIZED__ = true;

  let gmtSettings = { language: 'id', isActive: true };
  let dictionaryData = null;
  let scannedItems = [];
  let isScanning = false;
  let cachedPageSummary = null;
  let domObserver = null;
  let debounceTimer = null;

  // 1. Listen for runtime messages immediately (never delay this)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SETTINGS_CHANGED') {
      const wasActive = gmtSettings.isActive;
      gmtSettings = message.settings || gmtSettings;

      if (gmtSettings.isActive === false) {
        if (window.GMTHighlighter) window.GMTHighlighter.clearBadges();
        if (window.GMTPanel) window.GMTPanel.hide();
      } else if (!wasActive && gmtSettings.isActive) {
        runScanAndHighlight(cachedPageSummary);
      } else if (gmtSettings.language && window.GMTPanel) {
        window.GMTPanel.updateLanguage(gmtSettings.language);
      }
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'QUERY_PAGE_STATUS') {
      // If not yet scanned, do a quick scan right now
      if (scannedItems.length === 0 && window.GMTScanner && gmtSettings.isActive !== false) {
        runScanAndHighlight(cachedPageSummary);
      }
      sendResponse({
        detectedFieldsCount: scannedItems.length,
        isActive: gmtSettings.isActive
      });
      return false;
    }

    if (message.type === 'TRIGGER_RESCAN') {
      runScanAndHighlight(cachedPageSummary);
      sendResponse({ count: scannedItems.length });
      return false;
    }
  });

  // 2. Setup MutationObserver for dynamic SPAs, React, Vue, Google Forms, and wizard steps
  function setupMutationObserver() {
    if (domObserver || !window.MutationObserver) return;

    domObserver = new MutationObserver((mutations) => {
      let shouldRescan = false;
      for (const m of mutations) {
        // Skip mutations inside Telmy UI
        if (m.target && m.target.closest && m.target.closest('.gmt-ui-container')) continue;
        if (m.addedNodes.length > 0) {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1) { // ELEMENT_NODE
              if (
                node.matches && (
                  node.matches('input, select, textarea, [role="textbox"], [role="radiogroup"], [role="group"], [role="combobox"]') ||
                  node.querySelector('input, select, textarea, [role="textbox"]')
                )
              ) {
                shouldRescan = true;
                break;
              }
            }
          }
        }
        if (shouldRescan) break;
      }

      if (shouldRescan && gmtSettings.isActive !== false) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          runScanAndHighlight(cachedPageSummary, true);
        }, 400);
      }
    });

    if (document.body) {
      domObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  async function init() {
    // A. Fetch current settings safely
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (settings) => {
      if (chrome.runtime.lastError) return;
      if (settings) {
        gmtSettings = settings;
      }

      if (gmtSettings.isActive === false) return;

      // B. Load dictionary data
      chrome.runtime.sendMessage({ type: 'LOAD_MOCK_DICTIONARY' }, (res) => {
        if (chrome.runtime.lastError) {
          dictionaryData = [];
          runScanAndHighlight(null);
          return;
        }

        let pageSummary = null;
        const currentHost = (window.location.hostname || '').toLowerCase();

        if (res && res.success && res.data) {
          const pattern = (res.data.domain_pattern || '').toLowerCase();
          const isDomainMatch = pattern && (currentHost.includes(pattern) || currentHost.includes('localhost') || currentHost.includes('127.0.0.1') || currentHost === '');
          if (isDomainMatch) {
            dictionaryData = res.data.fields || [];
            pageSummary = res.data.page_summary || null;
          } else {
            dictionaryData = [];
            pageSummary = null;
          }
          window.__TELMY_DICT__ = dictionaryData;
          cachedPageSummary = pageSummary;
          runScanAndHighlight(pageSummary);
        } else {
          dictionaryData = [];
          runScanAndHighlight(null);
        }

        // Setup observer after initial scan
        setupMutationObserver();

        // Secondary scans for slow-rendering SPAs (e.g. React/Vue forms that render after mock data)
        setTimeout(() => {
          if (scannedItems.length === 0 && gmtSettings.isActive !== false) {
            runScanAndHighlight(cachedPageSummary);
          }
        }, 700);

        setTimeout(() => {
          if (scannedItems.length === 0 && gmtSettings.isActive !== false) {
            runScanAndHighlight(cachedPageSummary);
          }
        }, 1600);
      });
    });

    // C. Keyboard shortcut: Alt+G toggles panel
    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'g' || e.key === 'G')) {
        const panel = document.getElementById('gmt-side-panel-container');
        if (panel && panel.classList.contains('gmt-collapsed')) {
          if (window.GMTPanel) window.GMTPanel.expand();
        } else if (window.GMTPanel) {
          window.GMTPanel.minimize();
        }
      }
    });
  }

  function runScanAndHighlight(pageSummary = null, isIncremental = false) {
    if (isScanning || gmtSettings.isActive === false) return;
    if (!window.GMTScanner) return;
    isScanning = true;

    try {
      // Initialize side panel (only in top-level window, not inside child iframes)
      if (window.self === window.top && window.GMTPanel && !isIncremental) {
        window.GMTPanel.initPanel(
          gmtSettings.language,
          (targetIndex) => {
            if (window.GMTHighlighter) {
              window.GMTHighlighter.setActiveField(targetIndex, scannedItems, (item, index) => {
                window.GMTPanel.render(item, index, scannedItems.length, gmtSettings.language);
              });
            }
          },
          (newLang) => {
            gmtSettings.language = newLang;
          }
        );
      }

      // Scan page
      scannedItems = window.GMTScanner.scanForms(dictionaryData);

      // Provide detected fields to side panel
      if (window.self === window.top && window.GMTPanel) {
        window.GMTPanel.setPageSummary(pageSummary || cachedPageSummary, scannedItems);
      }

      if (scannedItems.length > 0 && window.GMTHighlighter) {
        console.log(`[Telmy] Terdeteksi ${scannedItems.length} kolom formulir.`);

        // Attach numbered badges & focus hooks
        window.GMTHighlighter.attachBadges(scannedItems, (item, index) => {
          if (window.GMTPanel) {
            window.GMTPanel.render(item, index, scannedItems.length, gmtSettings.language);
          }
        });
      }
    } finally {
      isScanning = false;
    }
  }

  // Initial boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

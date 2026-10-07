// Telmy — Main Content Script Orchestrator (Optimized for Chrome Native Side Panel)
(function () {
  // Ensure lingering in-page floating panel DOM elements are cleaned up
  function cleanupFloatingDOM() {
    const oldPanel = document.getElementById('gmt-side-panel-container');
    if (oldPanel) oldPanel.remove();
    const oldPill = document.getElementById('gmt-launcher-pill');
    if (oldPill) oldPill.remove();
  }
  cleanupFloatingDOM();

  if (window.__TELMY_INITIALIZED__) {
    // Already loaded, just run a fresh scan
    if (window.GMTScanner) {
      const items = window.GMTScanner.scanForms(window.__TELMY_DICT__ || []);
      if (items.length > 0 && window.GMTHighlighter) {
        window.GMTHighlighter.attachBadges(items, (item, index) => {
          chrome.runtime.sendMessage({
            type: 'GMT_FIELD_FOCUSED',
            index: index
          }, () => { if (chrome.runtime.lastError) {} });
        });
      }
    }
    return;
  }
  window.__TELMY_INITIALIZED__ = true;

  let gmtSettings = { language: 'en', isActive: true };
  let dictionaryData = null;
  let scannedItems = [];
  let isScanning = false;
  let cachedPageSummary = null;
  let domObserver = null;
  let debounceTimer = null;

  // 1. Listen for runtime messages immediately
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SETTINGS_CHANGED') {
      const wasActive = gmtSettings.isActive;
      gmtSettings = message.settings || gmtSettings;

      if (gmtSettings.isActive === false) {
        if (window.GMTHighlighter) window.GMTHighlighter.clearBadges();
      } else if (!wasActive && gmtSettings.isActive) {
        runScanAndHighlight(cachedPageSummary);
      }
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'QUERY_PAGE_STATUS') {
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

    if (message.type === 'GMT_ACTIVATE_FIELD_BY_INDEX') {
      if (window.GMTHighlighter && scannedItems[message.index]) {
        window.GMTHighlighter.setActiveField(message.index, scannedItems);
      }
      sendResponse({ success: true });
      return false;
    }
  });

  // 2. Setup MutationObserver for dynamic SPAs, React, Vue, Google Forms
  function setupMutationObserver() {
    if (domObserver || !window.MutationObserver) return;

    domObserver = new MutationObserver((mutations) => {
      let shouldRescan = false;
      for (const m of mutations) {
        if (m.target && m.target.closest && m.target.closest('.gmt-ui-container')) continue;
        if (m.addedNodes.length > 0) {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1) {
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

      if (shouldRescan) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (gmtSettings.isActive !== false) {
            runScanAndHighlight(cachedPageSummary, true);
          }
        }, 350);
      }
    });

    domObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 3. Main Init Workflow
  async function init() {
    cleanupFloatingDOM();

    // A. Fetch current settings from extension storage
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (settings) => {
      if (chrome.runtime.lastError) {
        gmtSettings = { language: 'en', isActive: true };
      } else if (settings) {
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

        // Secondary scans for slow-rendering SPAs
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
  }

  function runScanAndHighlight(pageSummary = null, isIncremental = false) {
    if (isScanning || gmtSettings.isActive === false) return;
    if (!window.GMTScanner) return;
    isScanning = true;

    try {
      cleanupFloatingDOM();

      // Scan page
      scannedItems = window.GMTScanner.scanForms(dictionaryData);

      if (scannedItems.length > 0 && window.GMTHighlighter) {
        // Attach numbered badges on form inputs
        window.GMTHighlighter.attachBadges(scannedItems, (item, index) => {
          chrome.runtime.sendMessage({
            type: 'GMT_FIELD_FOCUSED',
            index: index
          }, () => { if (chrome.runtime.lastError) {} });
        });

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
          chrome.runtime.sendMessage({
            type: 'GMT_PAGE_MAPPED',
            fields: serializableFields,
            summary: pageSummary || cachedPageSummary
          }, () => { if (chrome.runtime.lastError) {} });
        } catch (e) {}
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

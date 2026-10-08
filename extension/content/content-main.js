// Telmy — Main Content Script Orchestrator (Optimized for On-Demand Chrome Native Side Panel)
(function () {
  // Ensure any in-page floating panel or launcher pill elements are purged
  function cleanupFloatingDOM() {
    const oldPanel = document.getElementById('gmt-side-panel-container');
    if (oldPanel) oldPanel.remove();
    const oldPill = document.getElementById('gmt-launcher-pill');
    if (oldPill) oldPill.remove();
  }
  cleanupFloatingDOM();

  if (window.__TELMY_INITIALIZED__) {
    return;
  }
  window.__TELMY_INITIALIZED__ = true;

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

  // 1. Listen for runtime messages from Side Panel & Background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // A. Explicit Activation (User opened Side Panel / clicked icon)
    if (message.type === 'ACTIVATE_SCANNER') {
      isScannerActivated = true;
      gmtSettings.isActive = true;
      startScanWorkflow(() => {
        sendResponse({ success: true, count: scannedItems.length, isActive: true });
      });
      return true; // async sendResponse
    }

    // B. Explicit Deactivation (User clicked Close / X / toggled off)
    if (message.type === 'DEACTIVATE_SCANNER') {
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

    // E. Trigger Rescan
    if (message.type === 'TRIGGER_RESCAN') {
      if (!isScannerActivated) {
        isScannerActivated = true;
        gmtSettings.isActive = true;
      }
      startScanWorkflow(() => {
        sendResponse({ count: scannedItems.length, success: true });
      });
      return true;
    }

    // F. Highlight Field by Index
    if (message.type === 'GMT_ACTIVATE_FIELD_BY_INDEX') {
      if (window.GMTHighlighter && scannedItems[message.index]) {
        window.GMTHighlighter.setActiveField(message.index, scannedItems);
      }
      sendResponse({ success: true });
      return false;
    }
  });

  // 2. Stop Scan Workflow (Clean cleanup on close/off)
  function stopScanWorkflow() {
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

  // 3. Start Scan Workflow (On-Demand Activation)
  function startScanWorkflow(onComplete) {
    cleanupFloatingDOM();

    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (settings) => {
      if (!chrome.runtime.lastError && settings) {
        gmtSettings = { ...gmtSettings, ...settings, isActive: true };
      }

      chrome.runtime.sendMessage({ type: 'LOAD_MOCK_DICTIONARY' }, (res) => {
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
        } else {
          dictionaryData = [];
        }

        window.__TELMY_DICT__ = dictionaryData;
        cachedPageSummary = pageSummary;
        runScanAndHighlight(pageSummary);
        setupMutationObserver();

        if (onComplete) onComplete();
      });
    });
  }

  // 4. Setup MutationObserver for dynamic SPAs (Only runs when scanner active)
  function setupMutationObserver() {
    if (domObserver || !window.MutationObserver || !isScannerActivated) return;

    domObserver = new MutationObserver((mutations) => {
      if (!isScannerActivated || gmtSettings.isActive === false) return;
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
          if (isScannerActivated && gmtSettings.isActive !== false) {
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

  // 5. Scan and Highlight
  function runScanAndHighlight(pageSummary = null, isIncremental = false) {
    if (isScanning || !isScannerActivated || gmtSettings.isActive === false) return;
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

  // Initial standby boot (Purges any leftover floating UI, waits in passive standby)
  cleanupFloatingDOM();
})();

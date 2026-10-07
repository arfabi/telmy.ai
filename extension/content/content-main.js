// GuideMe.To (GMT) Main Content Script Orchestrator
(function () {
  let gmtSettings = { language: 'id', isActive: true };
  let dictionaryData = null;
  let scannedItems = [];
  let isScanning = false;

  async function init() {
    // 1. Fetch current settings from background
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, async (settings) => {
      if (settings) {
        gmtSettings = settings;
      }

      // If GMT is turned off by user, do nothing
      if (gmtSettings.isActive === false) {
        return;
      }

      // 2. Load mock dictionary
      chrome.runtime.sendMessage({ type: 'LOAD_MOCK_DICTIONARY' }, (res) => {
        if (res && res.success && res.data) {
          dictionaryData = res.data.fields || [];
          runScanAndHighlight();
        } else if (window.GMT_MOCK_DICTIONARY && window.GMT_MOCK_DICTIONARY.fields) {
          dictionaryData = window.GMT_MOCK_DICTIONARY.fields;
          runScanAndHighlight();
        } else {
          console.warn('[GMT] Unable to load dictionary, scanning with generic fallback.');
          dictionaryData = [];
          runScanAndHighlight();
        }
      });
    });

    // 3. Listen for runtime messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'SETTINGS_CHANGED') {
        const wasActive = gmtSettings.isActive;
        gmtSettings = message.settings;

        if (gmtSettings.isActive === false) {
          window.GMTHighlighter.clearBadges();
          window.GMTPanel.hide();
        } else if (!wasActive && gmtSettings.isActive) {
          runScanAndHighlight();
        } else if (gmtSettings.language) {
          // Re-render active field in new language if panel is currently visible
          window.GMTPanel.updateLanguage(gmtSettings.language);
        }
      }

      if (message.type === 'QUERY_PAGE_STATUS') {
        sendResponse({
          detectedFieldsCount: scannedItems.length,
          isActive: gmtSettings.isActive
        });
        return false;
      }

      if (message.type === 'TRIGGER_RESCAN') {
        runScanAndHighlight();
        sendResponse({ count: scannedItems.length });
        return false;
      }
    });

    // 4. Close panel on escape key or outside click
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.GMTPanel.hide();
      }
    });

    document.addEventListener('click', (e) => {
      // If clicking outside any input, badge, or panel, don't necessarily close unless wanted
      if (!e.target.closest('.gmt-ui-container') &&
          !e.target.closest('.gmt-field-badge') &&
          !e.target.closest('.gmt-highlighted-field')) {
        // Can optionally leave open or close
      }
    });
  }

  function runScanAndHighlight() {
    if (isScanning || gmtSettings.isActive === false) return;
    isScanning = true;

    try {
      // Initialize floating panel
      window.GMTPanel.initPanel(gmtSettings.language, (targetIndex) => {
        // Navigation stepper callback
        window.GMTHighlighter.setActiveField(targetIndex, scannedItems, (item, index) => {
          window.GMTPanel.render(item, index, scannedItems.length, gmtSettings.language);
        });
      });

      // Scan page
      scannedItems = window.GMTScanner.scanForms(dictionaryData);

      if (scannedItems.length > 0) {
        console.log(`[GMT] Successfully mapped ${scannedItems.length} form fields.`);

        // Attach badges & focus hooks
        window.GMTHighlighter.attachBadges(scannedItems, (item, index) => {
          window.GMTPanel.render(item, index, scannedItems.length, gmtSettings.language);
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

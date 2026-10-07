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
        let pageSummary = null;
        if (res && res.success && res.data) {
          dictionaryData = res.data.fields || [];
          pageSummary = res.data.page_summary || null;
          runScanAndHighlight(pageSummary);
        } else if (window.GMT_MOCK_DICTIONARY && window.GMT_MOCK_DICTIONARY.fields) {
          dictionaryData = window.GMT_MOCK_DICTIONARY.fields;
          pageSummary = window.GMT_MOCK_DICTIONARY.page_summary || null;
          runScanAndHighlight(pageSummary);
        } else {
          console.warn('[GMT] Unable to load dictionary, scanning with generic fallback.');
          dictionaryData = [];
          runScanAndHighlight(null);
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

    // 4. Keyboard shortcut: Alt+G toggles panel
    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'g' || e.key === 'G')) {
        const panel = document.getElementById('gmt-side-panel-container');
        if (panel && panel.classList.contains('gmt-collapsed')) {
          window.GMTPanel.expand();
        } else {
          window.GMTPanel.minimize();
        }
      }
    });
  }

  function runScanAndHighlight(pageSummary = null) {
    if (isScanning || gmtSettings.isActive === false) return;
    isScanning = true;

    try {
      // Initialize side panel
      window.GMTPanel.initPanel(
        gmtSettings.language,
        (targetIndex) => {
          // Navigation stepper callback
          window.GMTHighlighter.setActiveField(targetIndex, scannedItems, (item, index) => {
            window.GMTPanel.render(item, index, scannedItems.length, gmtSettings.language);
          });
        },
        (newLang) => {
          gmtSettings.language = newLang;
        }
      );

      // Scan page (skips captcha and bot security inputs automatically)
      scannedItems = window.GMTScanner.scanForms(dictionaryData);

      // Provide detected fields to side panel for overview and quick field list
      window.GMTPanel.setPageSummary(pageSummary, scannedItems);

      if (scannedItems.length > 0) {
        console.log(`[GMT] Successfully mapped ${scannedItems.length} valid form fields.`);

        // Attach numbered badges & focus hooks
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

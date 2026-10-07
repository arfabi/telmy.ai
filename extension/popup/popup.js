// Popup controller for Telmy
document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('gmt-active-toggle');
  const statusCard = document.getElementById('gmt-status-box');
  const statusLabel = document.getElementById('gmt-status-label');
  const detectedCount = document.getElementById('gmt-detected-count');
  const langButtons = document.querySelectorAll('.gmt-lang-btn');
  const rescanBtn = document.getElementById('btn-rescan');
  const statFields = document.getElementById('stat-fields-count');
  const statSuggestions = document.getElementById('stat-suggestions-count');

  // Load current settings safely
  chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (settings) => {
    if (chrome.runtime.lastError) return;
    if (settings) {
      toggle.checked = settings.isActive !== false;
      updateUIStatus(toggle.checked);
      setActiveLangBtn(settings.language || 'en');
    }
  });

  // Load user suggestions count safely
  chrome.runtime.sendMessage({ type: 'GET_SUGGESTIONS' }, (history) => {
    if (chrome.runtime.lastError) return;
    if (history && statSuggestions) {
      statSuggestions.textContent = history.length;
    }
  });

  // Helper to display detection outcome
  function displayDetectionResult(res) {
    if (res && res.detectedFieldsCount > 0) {
      detectedCount.textContent = `${res.detectedFieldsCount} form field(s) detected`;
      if (statFields) statFields.textContent = res.detectedFieldsCount;
    } else {
      detectedCount.textContent = 'No form fields detected on this page';
      if (statFields) statFields.textContent = '0';
    }
  }

  // Ensure content scripts are active, auto-injecting if needed
  async function checkPageStatus(tab) {
    if (!tab || !tab.id) return;
    const url = tab.url || '';

    // 1. Browser internal / restricted pages
    if (
      url.startsWith('chrome://') ||
      url.startsWith('chrome-extension://') ||
      url.startsWith('edge://') ||
      url.startsWith('devtools://') ||
      url.startsWith('about:') ||
      url.includes('chromewebstore.google.com')
    ) {
      detectedCount.textContent = 'Browser system page (cannot be scanned)';
      if (statFields) statFields.textContent = '0';
      return;
    }

    // 2. Check file:// URL permission
    if (url.startsWith('file://')) {
      const isAllowedFile = await new Promise((resolve) => {
        if (chrome.extension && chrome.extension.isAllowedFileSchemeAccess) {
          chrome.extension.isAllowedFileSchemeAccess(resolve);
        } else {
          resolve(false);
        }
      });
      if (!isAllowedFile) {
        detectedCount.textContent = 'Enable "Allow access to file URLs" in chrome://extensions';
        if (statFields) statFields.textContent = '0';
        return;
      }
    }

    // 3. Query content script via message
    chrome.tabs.sendMessage(tab.id, { type: 'QUERY_PAGE_STATUS' }, async (res) => {
      const err = chrome.runtime.lastError;
      if (err || !res) {
        // Content script not yet present in tab (e.g. tab opened before extension loaded)
        try {
          if (chrome.scripting) {
            await chrome.scripting.insertCSS({
              target: { tabId: tab.id },
              files: ['content/overlay.css']
            }).catch(() => {});

            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: [
                'content/scanner.js',
                'content/highlighter.js',
                'content/content-main.js'
              ]
            });

            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, { type: 'QUERY_PAGE_STATUS' }, (res2) => {
                const err2 = chrome.runtime.lastError;
                if (!err2 && res2) {
                  displayDetectionResult(res2);
                } else {
                  detectedCount.textContent = 'Reload tab (F5) to scan';
                  if (statFields) statFields.textContent = '0';
                }
              });
            }, 300);
            return;
          }
        } catch (injectErr) {
          // Injection failed
        }
        detectedCount.textContent = 'Reload tab (F5) to scan';
        if (statFields) statFields.textContent = '0';
      } else {
        displayDetectionResult(res);
      }
    });
  }

  // Initial check on active tab
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab) {
    checkPageStatus(activeTab);
  }

  // Toggle activation
  toggle.addEventListener('change', () => {
    const isActive = toggle.checked;
    updateUIStatus(isActive);
    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: { isActive }
    }, () => {
      if (chrome.runtime.lastError) { /* ignore */ }
    });
  });

  // Language buttons
  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      setActiveLangBtn(selectedLang);
      chrome.runtime.sendMessage({
        type: 'UPDATE_SETTINGS',
        payload: { language: selectedLang }
      }, () => {
        if (chrome.runtime.lastError) { /* ignore */ }
      });
    });
  });

  // Rescan button
  rescanBtn.addEventListener('click', async () => {
    rescanBtn.disabled = true;
    rescanBtn.style.opacity = '0.7';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_RESCAN' }, async (res) => {
        const err = chrome.runtime.lastError;
        if (err || !res) {
          await checkPageStatus(tab);
          setTimeout(() => {
            rescanBtn.disabled = false;
            rescanBtn.style.opacity = '1';
          }, 400);
        } else {
          setTimeout(() => {
            rescanBtn.disabled = false;
            rescanBtn.style.opacity = '1';
            if (res && res.count !== undefined) {
              if (res.count > 0) {
                detectedCount.textContent = `${res.count} field(s) detected`;
              } else {
                detectedCount.textContent = 'No form fields detected on this page';
              }
              if (statFields) statFields.textContent = res.count;
            }
          }, 300);
        }
      });
    } else {
      rescanBtn.disabled = false;
      rescanBtn.style.opacity = '1';
    }
  });

  function updateUIStatus(isActive) {
    if (isActive) {
      statusCard.classList.remove('inactive');
      statusLabel.textContent = 'Telmy Active & Ready';
    } else {
      statusCard.classList.add('inactive');
      statusLabel.textContent = 'Telmy Disabled';
      detectedCount.textContent = 'Telmy is currently disabled';
    }
  }

  function setActiveLangBtn(lang) {
    langButtons.forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }
});

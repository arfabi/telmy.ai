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

  // Load current settings
  chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (settings) => {
    if (settings) {
      toggle.checked = settings.isActive !== false;
      updateUIStatus(toggle.checked);
      setActiveLangBtn(settings.language || 'id');
    }
  });

  // Load user suggestions count
  chrome.runtime.sendMessage({ type: 'GET_SUGGESTIONS' }, (history) => {
    if (history && statSuggestions) {
      statSuggestions.textContent = history.length;
    }
  });

  // Query active tab to check fields count
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab && activeTab.id) {
    chrome.tabs.sendMessage(activeTab.id, { type: 'QUERY_PAGE_STATUS' }, (res) => {
      if (chrome.runtime.lastError || !res) {
        detectedCount.textContent = 'Klik ikon / reload halaman untuk memindai';
        if (statFields) statFields.textContent = '0';
      } else {
        if (res.detectedFieldsCount > 0) {
          detectedCount.textContent = `${res.detectedFieldsCount} field terdeteksi di form ini`;
          if (statFields) statFields.textContent = res.detectedFieldsCount;
        } else {
          detectedCount.textContent = 'Belum mendeteksi form di halaman ini';
          if (statFields) statFields.textContent = '0';
        }
      }
    });
  }

  // Toggle activation
  toggle.addEventListener('change', () => {
    const isActive = toggle.checked;
    updateUIStatus(isActive);
    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      payload: { isActive }
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
      });
    });
  });

  // Rescan button
  rescanBtn.addEventListener('click', async () => {
    rescanBtn.disabled = true;
    rescanBtn.style.opacity = '0.7';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_RESCAN' }, (res) => {
        setTimeout(() => {
          rescanBtn.disabled = false;
          rescanBtn.style.opacity = '1';
          if (res && res.count !== undefined) {
            detectedCount.textContent = `${res.count} field terdeteksi`;
            if (statFields) statFields.textContent = res.count;
          }
        }, 300);
      });
    }
  });

  function updateUIStatus(isActive) {
    if (isActive) {
      statusCard.classList.remove('inactive');
      statusLabel.textContent = 'Telmy Aktif & Siap Memandu';
    } else {
      statusCard.classList.add('inactive');
      statusLabel.textContent = 'Telmy Dinonaktifkan';
      detectedCount.textContent = 'Telmy sedang dinonaktifkan';
    }
  }

  function setActiveLangBtn(lang) {
    langButtons.forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }
});

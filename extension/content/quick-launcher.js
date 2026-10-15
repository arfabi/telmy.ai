// Telmy In-Page Quick Launcher (Plan V14)
// High-performance, isolated Closed Shadow DOM widget
(function () {
  'use strict';

  // Strict Exclusion: Never inject on Telmy internal portals
  const currentPath = (window.location.pathname || '').toLowerCase();
  const pageTitle = (document.title || '').toLowerCase();
  const isAuthOrDashboard = currentPath.includes('connect') ||
                            currentPath.includes('dashboard') ||
                            currentPath.includes('privacy') ||
                            document.querySelector('.connect-card') ||
                            document.getElementById('telmy-app-root') ||
                            (pageTitle.includes('connect') && pageTitle.includes('telmy')) ||
                            (pageTitle.includes('dashboard') && pageTitle.includes('telmy'));
  if (isAuthOrDashboard) return;

  // Avoid multiple injections
  if (window.__TELMY_QUICK_LAUNCHER__) return;
  window.__TELMY_QUICK_LAUNCHER__ = true;

  let launcherHost = null;
  let shadowRoot = null;
  let isDismissedForSession = false;
  let cachedFieldCount = 0;

  // Micro-i18n for 11 JAPAC languages
  const I18N = {
    found: {
      en: 'Forms Found', id: 'Kolom Ditemukan', ja: '入力欄を検出', ko: '입력란 발견',
      zh: '发现表单字段', 'zh-TW': '發現表單欄位', vi: 'Trường biểu mẫu', th: 'พบช่องกรอก',
      hi: 'फ़ॉर्म फ़ील्ड मिले', fil: 'Mga Form Field', ms: 'Borang Dijumpai'
    },
    guide: {
      en: 'Guide ▶', id: 'Panduan ▶', ja: 'ガイド ▶', ko: '안내 ▶',
      zh: '指南 ▶', 'zh-TW': '指南 ▶', vi: 'Hướng dẫn ▶', th: 'แนะนำ ▶',
      hi: 'मार्गदर्शिका ▶', fil: 'Gabay ▶', ms: 'Panduan ▶'
    },
    autofill: {
      en: '⚡ AutoFill', id: '⚡ Isi Otomatis', ja: '⚡ 自動入力', ko: '⚡ 자동 입력',
      zh: '⚡ 自动填充', 'zh-TW': '⚡ 自動填充', vi: '⚡ Tự điền', th: '⚡ เติมอัตโนมัติ',
      hi: '⚡ ऑटोफ़िल', fil: '⚡ Awtomatikong Punan', ms: '⚡ AutoIsi'
    },
    dismiss: {
      en: 'Hide for now', id: 'Sembunyikan', ja: '非表示', ko: '숨기기',
      zh: '隐藏', 'zh-TW': '隱藏', vi: 'Ẩn', th: 'ซ่อน',
      hi: 'छिपाएं', fil: 'Itago', ms: 'Sembunyi'
    }
  };

  function getLang() {
    return (window.__TELMY_LANG__ || 'en').toLowerCase();
  }

  function t(key) {
    const lang = getLang();
    const table = I18N[key] || {};
    return table[lang] || table['en'] || '';
  }

  // Count interactable form fields cleanly
  function countFormInputs() {
    try {
      const inputs = document.querySelectorAll(
        'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="reset"]), select, textarea'
      );
      // Filter visible elements
      let visibleCount = 0;
      for (let i = 0; i < inputs.length; i++) {
        const el = inputs[i];
        if (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0) {
          visibleCount++;
        }
      }
      return visibleCount;
    } catch (e) {
      return 0;
    }
  }

  function createLauncherDOM(fieldCount) {
    if (isDismissedForSession || fieldCount < 2) return;
    cachedFieldCount = fieldCount;

    if (!launcherHost) {
      launcherHost = document.createElement('div');
      launcherHost.id = 'telmy-quick-launcher-host';
      launcherHost.style.all = 'initial';
      launcherHost.style.position = 'fixed';
      launcherHost.style.bottom = '24px';
      launcherHost.style.right = '24px';
      launcherHost.style.zIndex = '2147483645';
      launcherHost.style.pointerEvents = 'auto';

      shadowRoot = launcherHost.attachShadow({ mode: 'closed' });
      document.documentElement.appendChild(launcherHost);
    }

    const html = `
      <style>
        :host {
          all: initial;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .telmy-pill-widget {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08);
          padding: 7px 12px 7px 14px;
          border-radius: 9999px;
          font-size: 13px;
          user-select: none;
          cursor: grab;
          animation: telmySlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.25s ease;
        }
        .telmy-pill-widget:active {
          cursor: grabbing;
        }
        .telmy-pill-widget:hover {
          box-shadow: 0 12px 36px -4px rgba(37, 99, 235, 0.4), 0 0 0 1px rgba(96, 165, 250, 0.3);
          border-color: rgba(96, 165, 250, 0.4);
        }
        @keyframes telmySlideUp {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .brand-section {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: #ffffff;
        }
        .brand-icon {
          font-size: 15px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .badge-count {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 12px;
          letter-spacing: -0.2px;
        }
        .info-text {
          font-size: 12px;
          color: #cbd5e1;
          font-weight: 500;
        }
        .actions-section {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 2px;
        }
        .btn-action {
          border: none;
          outline: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 9999px;
          transition: all 0.18s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .btn-guide {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
        }
        .btn-guide:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        .btn-autofill {
          background: rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-autofill:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transform: translateY(-1px);
        }
        .btn-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 14px;
          padding: 4px 6px;
          border-radius: 50%;
          line-height: 1;
          margin-left: 2px;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .btn-close:hover {
          color: #f1f5f9;
          background: rgba(255, 255, 255, 0.15);
        }
      </style>

      <div class="telmy-pill-widget" id="telmy-drag-pill" title="Telmy Form Assistant • Drag to reposition">
        <div class="brand-section">
          <span class="brand-icon">🤖</span>
          <span class="badge-count">${fieldCount}</span>
          <span class="info-text">${t('found')}</span>
        </div>
        <div class="actions-section">
          <button type="button" class="btn-action btn-autofill" id="btn-quick-autofill" title="Fill form from your vault">
            ${t('autofill')}
          </button>
          <button type="button" class="btn-action btn-guide" id="btn-quick-guide" title="Open Telmy Sidepanel Guide">
            ${t('guide')}
          </button>
          <button type="button" class="btn-close" id="btn-quick-close" title="${t('dismiss')}">
            ✕
          </button>
        </div>
      </div>
    `;

    shadowRoot.innerHTML = html;
    bindLauncherEvents();
  }

  function bindLauncherEvents() {
    if (!shadowRoot) return;

    const pill = shadowRoot.getElementById('telmy-drag-pill');
    const btnGuide = shadowRoot.getElementById('btn-quick-guide');
    const btnAutofill = shadowRoot.getElementById('btn-quick-autofill');
    const btnClose = shadowRoot.getElementById('btn-quick-close');

    // 1. Open Sidepanel Guide
    btnGuide?.addEventListener('click', (e) => {
      e.stopPropagation();
      try {
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ type: 'OPEN_SIDEPANEL_REQUEST' });
        }
      } catch (err) {}
    });

    // 2. Trigger AutoFill
    btnAutofill?.addEventListener('click', (e) => {
      e.stopPropagation();
      try {
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ type: 'AUTOFILL_TRIGGER_REQUEST' });
        }
      } catch (err) {}
    });

    // 3. Dismiss widget for current page session
    btnClose?.addEventListener('click', (e) => {
      e.stopPropagation();
      isDismissedForSession = true;
      if (launcherHost) {
        launcherHost.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        launcherHost.style.opacity = '0';
        launcherHost.style.transform = 'translateY(10px) scale(0.95)';
        setTimeout(() => {
          if (launcherHost) launcherHost.remove();
          launcherHost = null;
        }, 220);
      }
    });

    // 4. Draggable Pill
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialRight = 24, initialBottom = 24;

    pill?.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = launcherHost.getBoundingClientRect();
      initialRight = window.innerWidth - rect.right;
      initialBottom = window.innerHeight - rect.bottom;

      const onMouseMove = (moveEv) => {
        if (!isDragging) return;
        const dx = moveEv.clientX - startX;
        const dy = moveEv.clientY - startY;

        let newRight = initialRight - dx;
        let newBottom = initialBottom - dy;

        // Boundary safety
        newRight = Math.max(12, Math.min(window.innerWidth - 300, newRight));
        newBottom = Math.max(12, Math.min(window.innerHeight - 80, newBottom));

        launcherHost.style.right = `${newRight}px`;
        launcherHost.style.bottom = `${newBottom}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  // Self-initiator on page load with passive delay
  function initDetector() {
    setTimeout(() => {
      const count = countFormInputs();
      if (count >= 2) {
        createLauncherDOM(count);
      }
    }, 1200);

    // Re-check when user interacts or dynamically renders new fields
    let checkTimeout = null;
    const observer = new MutationObserver(() => {
      if (checkTimeout || isDismissedForSession) return;
      checkTimeout = setTimeout(() => {
        checkTimeout = null;
        const count = countFormInputs();
        if (count >= 2 && (!launcherHost || count !== cachedFieldCount)) {
          createLauncherDOM(count);
        }
      }, 1000);
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // Popover Tooltip for "Explain This Field" (Right Click Context Menu)
  let tooltipHost = null;
  let tooltipShadow = null;

  window.TelmyExplainTooltip = {
    show: function (targetText, x, y) {
      if (tooltipHost) tooltipHost.remove();

      tooltipHost = document.createElement('div');
      tooltipHost.id = 'telmy-explain-tooltip-host';
      tooltipHost.style.all = 'initial';
      tooltipHost.style.position = 'fixed';
      tooltipHost.style.zIndex = '2147483647';
      tooltipHost.style.pointerEvents = 'auto';

      // Clamp position to viewport
      const posX = Math.max(16, Math.min(window.innerWidth - 340, x || (window.innerWidth / 2 - 160)));
      const posY = Math.max(16, Math.min(window.innerHeight - 260, y || 100));
      tooltipHost.style.left = `${posX}px`;
      tooltipHost.style.top = `${posY}px`;

      tooltipShadow = tooltipHost.attachShadow({ mode: 'closed' });
      document.documentElement.appendChild(tooltipHost);

      const html = `
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          .explain-card {
            width: 320px;
            background: #ffffff;
            color: #0f172a;
            border-radius: 14px;
            box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            padding: 14px 16px;
            animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .title-wrap {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
          }
          .btn-close {
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 16px;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .btn-close:hover {
            color: #334155;
            background: #f1f5f9;
          }
          .target-quote {
            background: #f8fafc;
            border-left: 3px solid #2563eb;
            padding: 6px 10px;
            border-radius: 0 6px 6px 0;
            font-size: 12px;
            color: #475569;
            font-style: italic;
            margin-bottom: 10px;
            max-height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .body-content {
            font-size: 13px;
            line-height: 1.5;
            color: #1e293b;
            min-height: 48px;
          }
          .loading-text {
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
          }
          .spinner {
            width: 14px;
            height: 14px;
            border: 2px solid #e2e8f0;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid #f1f5f9;
          }
          .btn-speak {
            background: #f1f5f9;
            border: none;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            color: #334155;
          }
          .btn-speak:hover {
            background: #e2e8f0;
          }
        </style>

        <div class="explain-card">
          <div class="card-header">
            <div class="title-wrap">
              <span>💡</span>
              <span>Telmy Explainer</span>
            </div>
            <button type="button" class="btn-close" id="btn-close-tooltip">✕</button>
          </div>
          <div class="target-quote">"${targetText || 'Selected Term'}"</div>
          <div class="body-content" id="tooltip-body">
            <div class="loading-text">
              <div class="spinner"></div>
              <span>Asking Gemini Flash-Lite...</span>
            </div>
          </div>
          <div class="actions">
            <button type="button" class="btn-speak" id="btn-speak-content">🔊 Listen</button>
          </div>
        </div>
      `;

      tooltipShadow.innerHTML = html;

      const btnClose = tooltipShadow.getElementById('btn-close-tooltip');
      btnClose?.addEventListener('click', () => {
        if (tooltipHost) tooltipHost.remove();
        tooltipHost = null;
      });

      // Request explanation via background
      try {
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({
            type: 'EXPLAIN_FIELD',
            payload: {
              metadata: { label: targetText, name: targetText, type: 'text' },
              language: getLang(),
              pageContext: document.title
            }
          }, (res) => {
            const bodyEl = tooltipShadow?.getElementById('tooltip-body');
            if (!bodyEl) return;
            if (res && res.success && res.data) {
              const explanation = res.data.simpleExplanation || res.data.explanation || JSON.stringify(res.data);
              bodyEl.innerHTML = `<p>${explanation}</p>`;

              const btnSpeak = tooltipShadow?.getElementById('btn-speak-content');
              btnSpeak?.addEventListener('click', () => {
                if (window.speechSynthesis) {
                  const utt = new SpeechSynthesisUtterance(explanation);
                  utt.lang = getLang();
                  window.speechSynthesis.speak(utt);
                }
              });
            } else {
              bodyEl.innerHTML = `<p style="color: #64748b; font-size: 12px;">${res?.error || 'Could not explain this item at this time.'}</p>`;
            }
          });
        }
      } catch (err) {}
    }
  };

  // Listen for context menu triggers from background
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'TRIGGER_EXPLAIN_CONTEXT_MENU') {
        const text = msg.payload?.selectionText || '';
        window.TelmyExplainTooltip.show(text, window.innerWidth / 2 - 160, 120);
      }
    });
  }

  // Start detector when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetector);
  } else {
    initDetector();
  }
})();

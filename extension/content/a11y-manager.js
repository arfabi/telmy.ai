// =========================================================
// Telmy.ai: In-Page Accessibility Bridge (Plan V7)
// Standards: WCAG 2.1 & 2.2 AA (SC 1.4.3, 1.4.4, 2.1.1, 2.4.7, 3.3.4)
// Features: Form Spotlight, Click-to-Speak (Audio Wand), Thick Focus & Magnification
// =========================================================

window.TelmyA11y = (function () {
  'use strict';

  // State Management
  const state = {
    spotlightEnabled: false,
    clickToSpeakEnabled: false,
    thickFocusEnabled: false,
    speechRate: 0.9,
    currentLang: 'id-ID',
    activeTargetEl: null
  };

  // DOM Elements
  let overlayEl = null;
  let maskHoleEl = null;
  let borderHoleEl = null;
  let floatingWandBar = null;
  let currentSpeakingEl = null;
  let activeUtterance = null;

  // Initialize from chrome.storage
  function init() {
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([
        'a11y_spotlight_enabled',
        'a11y_speak_enabled',
        'a11y_thick_focus',
        'a11y_speech_rate',
        'preferred_language'
      ], (res) => {
        if (res.a11y_spotlight_enabled) setSpotlight(true);
        if (res.a11y_speak_enabled) setClickToSpeak(true);
        if (res.a11y_thick_focus) setThickFocus(true);
        if (res.a11y_speech_rate) state.speechRate = parseFloat(res.a11y_speech_rate) || 0.9;
        if (res.preferred_language) {
          state.currentLang = mapLangToLocale(res.preferred_language);
        }
      });
    }

    // Global Keyboard Shortcut: Alt+S to toggle Spotlight
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        toggleSpotlight();
      }
    });

    // Auto-track focused form elements when Spotlight is active
    document.addEventListener('focusin', (e) => {
      if (state.spotlightEnabled && isFormInput(e.target)) {
        spotlightElement(e.target);
      }
    }, true);

    // Reposition spotlight on scroll / resize
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Click-to-Speak event delegation
    document.addEventListener('click', onDocumentClickWand, true);
  }

  function isFormInput(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'select' || tag === 'textarea' || el.getAttribute('role') === 'textbox' || el.isContentEditable;
  }

  function mapLangToLocale(code) {
    const map = {
      'en': 'en-US',
      'id': 'id-ID',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'zh-TW': 'zh-TW',
      'vi': 'vi-VN',
      'th': 'th-TH',
      'hi': 'hi-IN',
      'ms': 'ms-MY',
      'fil': 'fil-PH'
    };
    return map[code] || 'id-ID';
  }

  // =========================================================
  // 1. FORM SPOTLIGHT (Dimmer & Active Field Hole)
  // =========================================================
  function ensureSpotlightDOM() {
    if (overlayEl) return;

    overlayEl = document.createElement('div');
    overlayEl.id = 'telmy-spotlight-overlay';
    overlayEl.className = 'telmy-spotlight-overlay';
    overlayEl.setAttribute('aria-hidden', 'true');

    overlayEl.innerHTML = `
      <svg class="telmy-spotlight-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="telmy-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect id="telmy-spotlight-hole" x="-1000" y="-1000" width="0" height="0" rx="10" ry="10" fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(10, 15, 30, 0.72)" mask="url(#telmy-spotlight-mask)" />
        <rect id="telmy-spotlight-border" x="-1000" y="-1000" width="0" height="0" rx="10" ry="10" fill="none" stroke="#3b82f6" stroke-width="3" />
      </svg>
    `;

    document.documentElement.appendChild(overlayEl);
    maskHoleEl = overlayEl.querySelector('#telmy-spotlight-hole');
    borderHoleEl = overlayEl.querySelector('#telmy-spotlight-border');
  }

  function setSpotlight(enable) {
    state.spotlightEnabled = !!enable;
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ a11y_spotlight_enabled: state.spotlightEnabled });
    }

    if (state.spotlightEnabled) {
      ensureSpotlightDOM();
      overlayEl.style.display = 'block';
      document.documentElement.classList.add('telmy-spotlight-active');

      // Find current focused or first highlighted element
      const activeEl = document.activeElement && isFormInput(document.activeElement)
        ? document.activeElement
        : document.querySelector('.gmt-highlighted-field') || document.querySelector('input:not([type="hidden"]), select, textarea');

      if (activeEl) {
        spotlightElement(activeEl);
      }
    } else {
      if (overlayEl) {
        overlayEl.style.display = 'none';
      }
      document.documentElement.classList.remove('telmy-spotlight-active');
      state.activeTargetEl = null;
    }
  }

  function toggleSpotlight() {
    setSpotlight(!state.spotlightEnabled);
    notifySidepanelState();
    return state.spotlightEnabled;
  }

  function spotlightElement(el) {
    if (!el || !state.spotlightEnabled) return;
    state.activeTargetEl = el;
    ensureSpotlightDOM();

    // Check if element is in card/fieldset to illuminate the whole question label + input
    let container = el.closest ? (el.closest('.form-group, .form-row, .form-item, [role="listitem"], fieldset, .Qr7Oae, .geS5n, .m7zDu, .o3Dpx') || el) : el;
    let rect = container.getBoundingClientRect();

    // Safety guard: if container is too huge (>80% of screen height), fallback to el itself
    if (rect.height > window.innerHeight * 0.85) {
      container = el;
      rect = el.getBoundingClientRect();
    }

    if (rect.width === 0 || rect.height === 0) return;

    const pad = 10;
    const x = Math.max(0, rect.left - pad);
    const y = Math.max(0, rect.top - pad);
    const w = rect.width + (pad * 2);
    const h = rect.height + (pad * 2);

    if (maskHoleEl) {
      maskHoleEl.setAttribute('x', x);
      maskHoleEl.setAttribute('y', y);
      maskHoleEl.setAttribute('width', w);
      maskHoleEl.setAttribute('height', h);
    }
    if (borderHoleEl) {
      borderHoleEl.setAttribute('x', x);
      borderHoleEl.setAttribute('y', y);
      borderHoleEl.setAttribute('width', w);
      borderHoleEl.setAttribute('height', h);
    }
  }

  let rafId = null;
  function onScrollOrResize() {
    if (!state.spotlightEnabled || !state.activeTargetEl) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      spotlightElement(state.activeTargetEl);
    });
  }

  // =========================================================
  // 2. CLICK-TO-SPEAK (Audio Wand / Text Reader)
  // =========================================================
  function ensureFloatingWandBar() {
    if (floatingWandBar) return;

    floatingWandBar = document.createElement('div');
    floatingWandBar.id = 'telmy-wand-bar';
    floatingWandBar.className = 'telmy-wand-bar';
    floatingWandBar.innerHTML = `
      <div class="wand-bar-inner">
        <span class="wand-icon">🔊</span>
        <span class="wand-text">Mode Baca Teks Aktif — Klik elemen apa pun untuk mendengar</span>
        <button type="button" class="wand-btn-stop" id="btn-wand-stop-speech" title="Hentikan Suara">⏹️ Stop</button>
        <button type="button" class="wand-btn-close" id="btn-wand-close-mode" title="Keluar dari Mode Baca">✕</button>
      </div>
    `;

    document.documentElement.appendChild(floatingWandBar);

    floatingWandBar.querySelector('#btn-wand-stop-speech').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      stopSpeaking();
    });

    floatingWandBar.querySelector('#btn-wand-close-mode').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setClickToSpeak(false);
      notifySidepanelState();
    });
  }

  function setClickToSpeak(enable) {
    state.clickToSpeakEnabled = !!enable;
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ a11y_speak_enabled: state.clickToSpeakEnabled });
    }

    if (state.clickToSpeakEnabled) {
      document.documentElement.classList.add('telmy-wand-active');
      ensureFloatingWandBar();
      floatingWandBar.style.display = 'block';
    } else {
      document.documentElement.classList.remove('telmy-wand-active');
      if (floatingWandBar) {
        floatingWandBar.style.display = 'none';
      }
      stopSpeaking();
    }
  }

  function toggleClickToSpeak() {
    setClickToSpeak(!state.clickToSpeakEnabled);
    notifySidepanelState();
    return state.clickToSpeakEnabled;
  }

  function onDocumentClickWand(e) {
    if (!state.clickToSpeakEnabled) return;

    // Ignore clicks inside Telmy's internal UI elements
    if (e.target.closest('#telmy-wand-bar, #telmy-spotlight-overlay, .gmt-side-panel, .gmt-field-badge')) {
      return;
    }

    // Prevent navigation / submit if clicking a button or link while in audio wand mode
    e.preventDefault();
    e.stopPropagation();

    speakElementText(e.target);
  }

  function extractCleanText(el) {
    if (!el) return '';

    // If input element, get label and placeholder
    if (isFormInput(el)) {
      let labelText = '';
      if (el.id) {
        const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (lbl) labelText = lbl.innerText;
      }
      if (!labelText) {
        const parentLbl = el.closest('label');
        if (parentLbl) labelText = parentLbl.innerText;
      }
      const ph = el.placeholder || el.getAttribute('aria-label') || el.title || '';
      const val = el.value ? `Isi saat ini: ${el.value}` : 'Belum diisi';
      return [labelText ? `Kolom: ${labelText}` : '', ph ? `Petunjuk: ${ph}` : '', val].filter(Boolean).join('. ');
    }

    // If label element
    if (el.tagName.toLowerCase() === 'label') {
      return `Label: ${el.innerText.trim()}`;
    }

    // General text element (heading, paragraph, span, button)
    let text = el.innerText || el.textContent || el.getAttribute('aria-label') || el.title || '';
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > 500) {
      text = text.substring(0, 500) + '... dan seterusnya.';
    }
    return text;
  }

  function speakElementText(el) {
    const text = extractCleanText(el);
    if (!text) return;

    stopSpeaking();

    if ('speechSynthesis' in window) {
      currentSpeakingEl = el;
      el.classList.add('telmy-speaking-highlight');

      activeUtterance = new SpeechSynthesisUtterance(text);
      activeUtterance.lang = state.currentLang;
      activeUtterance.rate = state.speechRate;

      activeUtterance.onend = () => {
        stopSpeaking();
      };
      activeUtterance.onerror = () => {
        stopSpeaking();
      };

      window.speechSynthesis.speak(activeUtterance);
    }
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentSpeakingEl) {
      currentSpeakingEl.classList.remove('telmy-speaking-highlight');
      currentSpeakingEl = null;
    }
    activeUtterance = null;
  }

  // =========================================================
  // 3. THICK FOCUS RING & ACCESSIBILITY STYLING
  // =========================================================
  function setThickFocus(enable) {
    state.thickFocusEnabled = !!enable;
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ a11y_thick_focus: state.thickFocusEnabled });
    }

    if (state.thickFocusEnabled) {
      document.documentElement.classList.add('telmy-thick-focus-active');
    } else {
      document.documentElement.classList.remove('telmy-thick-focus-active');
    }
  }

  function setSpeechRate(rate) {
    state.speechRate = parseFloat(rate) || 0.9;
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ a11y_speech_rate: state.speechRate });
    }
  }

  function setLanguage(code) {
    state.currentLang = mapLangToLocale(code);
  }

  function notifySidepanelState() {
    try {
      chrome.runtime.sendMessage({
        type: 'A11Y_STATE_CHANGED',
        state: {
          spotlightEnabled: state.spotlightEnabled,
          clickToSpeakEnabled: state.clickToSpeakEnabled,
          thickFocusEnabled: state.thickFocusEnabled,
          speechRate: state.speechRate
        }
      });
    } catch (e) {
      // Sidepanel may not be listening
    }
  }

  // Public Interface
  return {
    init,
    setSpotlight,
    toggleSpotlight,
    spotlightElement,
    setClickToSpeak,
    toggleClickToSpeak,
    speakElementText,
    stopSpeaking,
    setThickFocus,
    setSpeechRate,
    setLanguage,
    getState: () => ({ ...state }),
    onFieldActive: (el) => {
      if (state.spotlightEnabled) {
        spotlightElement(el);
      }
    }
  };
})();

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.TelmyA11y.init());
} else {
  window.TelmyA11y.init();
}

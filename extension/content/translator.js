/**
 * Telmy — Context-Aware DOM Page Translator (Content Script)
 * Efficiently extracts visible UI labels, buttons, headers, and form cues,
 * and swaps text in-place while preserving HTML structure and CSS layouts.
 */

(function () {
  if (window.__TELMY_TRANSLATOR__) return;

  let isPageTranslated = false;
  let translatedLanguage = null;
  let elementCounter = 0;
  const elementsMap = new Map(); // tid -> DOM element or text node info

  // Tags to safely ignore
  const IGNORED_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'CODE', 'PRE', 
    'IFRAME', 'CANVAS', 'AUDIO', 'VIDEO', 'OBJECT', 'EMBED'
  ]);

  /**
   * Check if element is visible and not part of Telmy's own UI
   */
  function isVisibleElement(el) {
    if (!el || el.nodeType !== 1) return false;
    if (IGNORED_TAGS.has(el.tagName)) return false;
    if (el.closest('.gmt-ui-container, .telmy-ignore, #telmy-ui-root')) return false;

    // Check display / visibility
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;

    return true;
  }

  /**
   * Check if text is worth translating (not purely numbers, symbols, or whitespace)
   */
  function isTranslatableText(text) {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    if (trimmed.length < 2) return false;
    // Skip if purely numbers or currency amounts (e.g., "12345", "10.000", "Rp 50.000")
    if (/^[0-9.,\s+\-/$€¥]+$/.test(trimmed)) return false;
    // Skip single punctuation
    if (/^[^\p{L}\p{N}]+$/u.test(trimmed)) return false;
    return true;
  }

  /**
   * Extract candidate texts across the webpage DOM
   * Prioritizes headings, form labels, buttons, helper text, and placeholders.
   */
  function extractPageTexts(maxTokens = 150) {
    const extracted = {};
    elementsMap.clear();

    const pageContext = {
      domain: window.location.hostname || 'localhost',
      title: document.title || 'Web Form',
      url: window.location.href
    };

    // 1. First Pass: Critical UI Elements (Headers, Labels, Buttons, Legends, Table Headers)
    const criticalSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'label', 'legend',
      'button', 'input[type="submit"]', 'input[type="button"]', 'a.btn', '[role="button"]',
      'th', '.form-label', '.gov-title', '.btn'
    ];

    const criticalNodes = document.querySelectorAll(criticalSelectors.join(', '));
    for (const el of criticalNodes) {
      if (Object.keys(extracted).length >= maxTokens) break;
      if (!isVisibleElement(el)) continue;

      const directText = getDirectOrCleanText(el);
      if (isTranslatableText(directText)) {
        registerElementText(el, directText, extracted);
      }
    }

    // 2. Second Pass: Inputs & Textareas with placeholders
    const placeholderInputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    for (const input of placeholderInputs) {
      if (Object.keys(extracted).length >= maxTokens) break;
      if (!isVisibleElement(input)) continue;

      const ph = input.getAttribute('placeholder');
      if (isTranslatableText(ph)) {
        registerPlaceholder(input, ph, extracted);
      }
    }

    // 3. Third Pass: Paragraphs, Spans, and List Items (Helper texts, notes, instructions)
    if (Object.keys(extracted).length < maxTokens) {
      const generalNodes = document.querySelectorAll('p, li, td, span, small');
      for (const el of generalNodes) {
        if (Object.keys(extracted).length >= maxTokens) break;
        if (!isVisibleElement(el)) continue;
        // Skip if already registered
        if (el.dataset.telmyTid) continue;

        // Ensure element doesn't contain block children
        if (el.querySelector('p, h1, h2, h3, h4, div, ul, table')) continue;

        const cleanText = getDirectOrCleanText(el);
        if (isTranslatableText(cleanText) && cleanText.length < 280) {
          registerElementText(el, cleanText, extracted);
        }
      }
    }

    return {
      texts: extracted,
      pageContext,
      tokenCount: Object.keys(extracted).length,
      isTranslated: isPageTranslated,
      translatedLanguage
    };
  }

  /**
   * Helper to retrieve clean text without inner noisy tags
   */
  function getDirectOrCleanText(el) {
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
      return (el.value || '').trim();
    }
    // If element has only 1 text child, get that
    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
      return el.childNodes[0].nodeValue.trim();
    }
    // Otherwise get overall textContent cleaned up
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Register element text node for batch translation
   */
  function registerElementText(el, text, extracted) {
    let tid = el.dataset.telmyTid;
    if (!tid) {
      tid = `t_${++elementCounter}`;
      el.dataset.telmyTid = tid;
    }

    if (!el.dataset.telmyOriginalText) {
      el.dataset.telmyOriginalText = text;
    }

    extracted[tid] = text;
    elementsMap.set(tid, { type: 'text', element: el });
  }

  /**
   * Register placeholder attribute for translation
   */
  function registerPlaceholder(input, placeholderText, extracted) {
    let tid = input.dataset.telmyPhTid;
    if (!tid) {
      tid = `t_ph_${++elementCounter}`;
      input.dataset.telmyPhTid = tid;
    }

    if (!input.dataset.telmyOriginalPlaceholder) {
      input.dataset.telmyOriginalPlaceholder = placeholderText;
    }

    extracted[tid] = placeholderText;
    elementsMap.set(tid, { type: 'placeholder', element: input });
  }

  /**
   * Apply translations in-place to DOM elements
   */
  function applyTranslations(translations, lang = 'en') {
    if (!translations || typeof translations !== 'object') return 0;
    let appliedCount = 0;

    for (const [tid, translatedText] of Object.entries(translations)) {
      if (!translatedText || typeof translatedText !== 'string') continue;

      // Find element either from cache or DOM query
      let entry = elementsMap.get(tid);
      let el = entry?.element;

      if (!el) {
        if (tid.startsWith('t_ph_')) {
          el = document.querySelector(`[data-telmy-ph-tid="${tid}"]`);
          if (el) entry = { type: 'placeholder', element: el };
        } else {
          el = document.querySelector(`[data-telmy-tid="${tid}"]`);
          if (el) entry = { type: 'text', element: el };
        }
      }

      if (!el || !entry) continue;

      if (entry.type === 'placeholder') {
        el.setAttribute('placeholder', translatedText);
        el.classList.add('telmy-translated-field');
        appliedCount++;
      } else {
        if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
          el.value = translatedText;
        } else if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
          el.childNodes[0].nodeValue = translatedText;
        } else {
          // If element contains icons/SVGs, replace first text node or textContent
          let textReplaced = false;
          for (const child of el.childNodes) {
            if (child.nodeType === 3 && child.nodeValue.trim().length > 0) {
              child.nodeValue = ` ${translatedText} `;
              textReplaced = true;
              break;
            }
          }
          if (!textReplaced) {
            el.textContent = translatedText;
          }
        }

        el.classList.add('telmy-translated-field');
        appliedCount++;
      }
    }

    isPageTranslated = true;
    translatedLanguage = lang;
    return appliedCount;
  }

  /**
   * Revert all translated elements back to their original language
   */
  function revertTranslations() {
    let revertedCount = 0;

    // 1. Revert text elements
    const textEls = document.querySelectorAll('[data-telmy-tid]');
    for (const el of textEls) {
      if (el.dataset.telmyOriginalText) {
        if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
          el.value = el.dataset.telmyOriginalText;
        } else if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
          el.childNodes[0].nodeValue = el.dataset.telmyOriginalText;
        } else {
          el.textContent = el.dataset.telmyOriginalText;
        }
        el.classList.remove('telmy-translated-field');
        revertedCount++;
      }
    }

    // 2. Revert placeholders
    const phEls = document.querySelectorAll('[data-telmy-ph-tid]');
    for (const input of phEls) {
      if (input.dataset.telmyOriginalPlaceholder) {
        input.setAttribute('placeholder', input.dataset.telmyOriginalPlaceholder);
        input.classList.remove('telmy-translated-field');
        revertedCount++;
      }
    }

    isPageTranslated = false;
    translatedLanguage = null;
    return revertedCount;
  }

  // Runtime message listener
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TRANSLATOR_EXTRACT_TEXTS') {
      const data = extractPageTexts(message.maxTokens || 140);
      sendResponse({ success: true, ...data });
      return false;
    }

    if (message.type === 'TRANSLATOR_APPLY_TRANSLATIONS') {
      const count = applyTranslations(message.translations, message.targetLanguage);
      sendResponse({
        success: true,
        appliedCount: count,
        isTranslated: true,
        targetLanguage: message.targetLanguage
      });
      return false;
    }

    if (message.type === 'TRANSLATOR_REVERT_TRANSLATIONS') {
      const count = revertTranslations();
      sendResponse({
        success: true,
        revertedCount: count,
        isTranslated: false
      });
      return false;
    }

    if (message.type === 'TRANSLATOR_GET_STATUS') {
      sendResponse({
        isTranslated: isPageTranslated,
        translatedLanguage,
        elementCount: document.querySelectorAll('.telmy-translated-field').length
      });
      return false;
    }
  });

  window.__TELMY_TRANSLATOR__ = {
    extractPageTexts,
    applyTranslations,
    revertTranslations,
    isTranslated: () => isPageTranslated,
    getLanguage: () => translatedLanguage
  };
})();

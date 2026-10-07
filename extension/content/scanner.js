// GMT Scanner: Scans DOM form elements and extracts metadata without reading user inputs
window.GMTScanner = (function () {
  function normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[\n\r\t]+/g, ' ')
      .replace(/[:*()_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findAssociatedLabel(element) {
    // 1. Label with 'for' attribute matching element.id
    if (element.id) {
      const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
      if (label && label.innerText.trim()) return label.innerText.trim();
    }

    // 2. Closest ancestor label
    const parentLabel = element.closest('label');
    if (parentLabel) {
      const clone = parentLabel.cloneNode(true);
      // Remove input itself from cloned text
      const inputs = clone.querySelectorAll('input, select, textarea');
      inputs.forEach(i => i.remove());
      const text = clone.innerText.trim();
      if (text) return text;
    }

    // 3. Preceding sibling label or text element
    let prev = element.previousElementSibling;
    while (prev) {
      if (['LABEL', 'P', 'SPAN', 'DIV', 'H5', 'H6'].includes(prev.tagName) && prev.innerText.trim()) {
        const text = prev.innerText.trim();
        if (text.length < 80) return text;
      }
      prev = prev.previousElementSibling;
    }

    // 4. Parent container title / label
    const formGroup = element.closest('.form-group, .form-row, .form-field, .col, .f, div');
    if (formGroup) {
      const groupLabel = formGroup.querySelector('label, .control-label, .form-label');
      if (groupLabel && groupLabel.innerText.trim()) {
        return groupLabel.innerText.trim();
      }
    }

    // 5. Attributes fallback
    if (element.getAttribute('aria-label')) return element.getAttribute('aria-label').trim();
    if (element.getAttribute('placeholder')) return element.getAttribute('placeholder').trim();
    if (element.getAttribute('title')) return element.getAttribute('title').trim();
    if (element.name) return element.name;

    return '';
  }

  function matchFieldToDictionary(extracted, dictionaryFields) {
    if (!dictionaryFields || !dictionaryFields.length) return null;

    const normalizedLabel = normalizeText(extracted.label);
    const normalizedName = normalizeText(extracted.name);
    const normalizedId = normalizeText(extracted.id);
    const normalizedPlaceholder = normalizeText(extracted.placeholder);
    const maskText = normalizeText(extracted.mask || '');

    // Combine contextual haystack: prioritize label & placeholder & mask
    const fullSearchHaystack = `${normalizedLabel} ${normalizedPlaceholder} ${maskText} ${normalizedName} ${normalizedId}`;

    let bestMatch = null;
    let highestScore = 0;

    for (const item of dictionaryFields) {
      let score = 0;

      // 1. Check pattern keywords against haystack
      for (const pattern of item.patterns) {
        const normalizedPattern = normalizeText(pattern);
        if (fullSearchHaystack.includes(normalizedPattern)) {
          // Weight: if matched in label (+10), in placeholder (+7), in name/id (+5)
          if (normalizedLabel.includes(normalizedPattern)) score += 10;
          else if (normalizedPlaceholder.includes(normalizedPattern)) score += 7;
          else score += 5;
        }
      }

      // 2. Exact ID / key match bonus
      if (normalizedId === item.id || normalizedName === item.id) {
        score += 15;
      } else if (normalizedId.includes(item.id) || normalizedName.includes(item.id)) {
        score += 8;
      }

      // 3. Type compatibility sanity checks
      const isFileField = item.id.includes('upload') || item.id.includes('berkas') || item.id.includes('surat_kuasa') || item.id.includes('file');
      if (extracted.type === 'file') {
        if (isFileField) score += 20;
        else score -= 30; // Strong penalty if file element matches text field
      } else if (isFileField) {
        score -= 20; // Penalty if non-file input matches file field
      }

      // 4. Numeric & Masking compatibility bonus
      if (extracted.isNumeric && (item.id.includes('nik') || item.id.includes('nomor') || item.id.includes('telepon'))) {
        score += 5;
      }

      if (score > highestScore && score >= 5) {
        highestScore = score;
        bestMatch = item;
      }
    }

    return bestMatch;
  }

  // Detect input masking attributes, libraries, and placeholder format patterns
  function detectInputMask(el) {
    // 1. Direct HTML5 / Data attributes commonly used by masking libraries
    const maskAttributes = [
      'data-mask',
      'data-inputmask',
      'data-inputmask-mask',
      'data-inputmask-alias',
      'data-slots',
      'x-mask',
      'mask',
      'data-maska'
    ];

    for (const attr of maskAttributes) {
      const val = el.getAttribute(attr);
      if (val) return val.trim();
    }

    // 2. Common class-based masks (e.g. 'mask-nik', 'date-mask', 'currency-mask')
    if (el.className && typeof el.className === 'string') {
      const classList = el.className.split(/\s+/);
      for (const cls of classList) {
        if (cls.includes('mask') || cls.includes('format-')) {
          return cls;
        }
      }
    }

    // 3. Detect mask pattern from placeholder (e.g. '____-____-____-____' or '00.000.000.0-000.000')
    const placeholder = el.getAttribute('placeholder') || '';
    if (/[_#90]{3,}[.\-/ ]+[_#90]{2,}/.test(placeholder) || placeholder.includes('____') || placeholder.includes('xxxx')) {
      return placeholder.trim();
    }

    // 4. Check for pattern attribute (regex mask)
    const pattern = el.getAttribute('pattern');
    if (pattern) {
      return `Pola: ${pattern}`;
    }

    return null;
  }

  // Detect whether input strictly requires numeric / digits
  function detectNumericNature(el, mask) {
    const type = (el.type || '').toLowerCase();
    const inputMode = (el.getAttribute('inputmode') || '').toLowerCase();
    const pattern = el.getAttribute('pattern') || '';
    const placeholder = (el.getAttribute('placeholder') || '').toLowerCase();

    if (type === 'number' || type === 'tel') return true;
    if (inputMode === 'numeric' || inputMode === 'decimal' || inputMode === 'tel') return true;
    if (pattern && (/^\^?(\d|\[0-9\])/.test(pattern) || pattern.includes('\\d'))) return true;
    if (mask && (mask.includes('9999') || mask.includes('0000') || mask.toLowerCase().includes('digit'))) return true;
    if (placeholder && (placeholder.includes('digit') || placeholder.includes('angka saja') || /^\d{4,}/.test(placeholder))) return true;

    return false;
  }

  function isSecurityOrCaptchaField(el, label) {
    const haystack = [
      el.id || '',
      el.name || '',
      el.getAttribute('placeholder') || '',
      el.getAttribute('aria-label') || '',
      typeof el.className === 'string' ? el.className : '',
      label || ''
    ].join(' ').toLowerCase();

    const captchaPattern = /(captcha|recaptcha|hcaptcha|turnstile|security[_\s-]?code|kode[_\s-]?keamanan|kode[_\s-]?captcha|verifikasi[_\s-]?kode|csrf|xsrf|_token)/i;
    return captchaPattern.test(haystack);
  }

  function scanForms(dictionaryFields) {
    const candidates = document.querySelectorAll('input, select, textarea');
    const matchedList = [];
    let counter = 0;

    candidates.forEach((el) => {
      // Ignore hidden or non-fillable elements
      if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button' || el.type === 'reset') return;
      if (el.offsetWidth === 0 && el.offsetHeight === 0 && !el.getClientRects().length) return;
      if (el.closest('.gmt-ui-container')) return; // Ignore GMT's own elements

      const label = findAssociatedLabel(el);

      // Exclude captcha, security code, bot tokens
      if (isSecurityOrCaptchaField(el, label)) {
        return;
      }

      const rawType = el.tagName.toLowerCase() === 'select' ? 'select' : (el.type || 'text').toLowerCase();
      const placeholder = el.getAttribute('placeholder') || '';
      const mask = detectInputMask(el);
      const isNumeric = detectNumericNature(el, mask);

      const metadata = {
        scanIndex: counter++,
        element: el,
        id: el.id || '',
        name: el.name || '',
        type: rawType,
        isNumeric: isNumeric,
        placeholder: placeholder,
        mask: mask,
        maxLength: el.maxLength > 0 ? el.maxLength : null,
        pattern: el.getAttribute('pattern') || null,
        label: label
      };

      const matchedDict = matchFieldToDictionary(metadata, dictionaryFields);

      matchedList.push({
        metadata,
        dictEntry: matchedDict || null,
        isCustomAi: !matchedDict
      });
    });

    return matchedList;
  }

  return {
    scanForms,
    matchFieldToDictionary,
    findAssociatedLabel
  };
})();

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

  const NOISE_LABELS = [
    'jawaban anda',
    'your answer',
    'pertanyaan ini wajib diisi',
    'this is a required question',
    'wajib',
    'required',
    'opsi',
    'option',
    'opsi 1',
    'option 1',
    'tambahkan file',
    'add file',
    'batal',
    'cancel',
    'kirim',
    'submit',
    'berikutnya',
    'next',
    'kembali',
    'back',
    'hapus pilihan',
    'clear selection'
  ];

  function cleanLabelText(text) {
    if (!text) return '';
    return text
      .replace(/[\n\r\t]+/g, ' ')
      .replace(/\s*\*+\s*$/, '') // remove trailing asterisks
      .replace(/^\s*\*+\s*/, '') // remove leading asterisks
      .replace(/Pertanyaan ini wajib diisi/gi, '')
      .replace(/This is a required question/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isNoiseLabel(text) {
    if (!text) return true;
    const clean = text.toLowerCase().trim();
    if (clean.length < 2) return true;
    if (NOISE_LABELS.includes(clean)) return true;
    if (/^entry\.\d+$/i.test(clean)) return true; // Google Forms internal input names
    return false;
  }

  function findAssociatedLabel(element) {
    // 1. Resolve aria-labelledby attribute (Primary for Google Forms & ARIA widgets)
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const ids = ariaLabelledBy.trim().split(/\s+/);
      for (const id of ids) {
        const target = document.getElementById(id);
        if (target) {
          const clone = target.cloneNode(true);
          clone.querySelectorAll('.v3duvd, input, select, textarea, button').forEach(e => e.remove());
          const text = cleanLabelText(clone.innerText || clone.textContent);
          if (text && !isNoiseLabel(text)) {
            return text;
          }
        }
      }
    }

    // 2. Google Forms & Modern Form Container Cards (Card Heading above input)
    const card = element.closest('[role="listitem"], .Qr7Oae, .geS5n, .m7zDu, .o3Dpx, .freebirdFormviewerViewNumberedItemContainer, .form-group, .form-row, .form-item, fieldset, section');
    if (card) {
      const heading = card.querySelector('[role="heading"], .M7eMe, .c2nTpf, .HoFDJf, legend, label, .form-label, .control-label, h1, h2, h3, h4, h5, h6, [data-title], .field-label');
      if (heading) {
        const clone = heading.cloneNode(true);
        // Remove asterisk spans, badge indicators, or nested inputs
        clone.querySelectorAll('.v3duvd, .gmt-field-badge, input, select, textarea, button').forEach(e => e.remove());
        const text = cleanLabelText(clone.innerText || clone.textContent);
        if (text && !isNoiseLabel(text)) {
          return text;
        }
      }
    }

    // 3. Standard HTML5 label with 'for' attribute matching element.id
    if (element.id) {
      const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
      if (label) {
        const text = cleanLabelText(label.innerText);
        if (text && !isNoiseLabel(text)) return text;
      }
    }

    // 4. Closest ancestor label
    const parentLabel = element.closest('label');
    if (parentLabel) {
      const clone = parentLabel.cloneNode(true);
      clone.querySelectorAll('input, select, textarea, .gmt-field-badge').forEach(i => i.remove());
      const text = cleanLabelText(clone.innerText);
      if (text && !isNoiseLabel(text)) return text;
    }

    // 5. Walk up ancestor tree to find preceding sibling label/heading (Handles label placed above input)
    let current = element;
    let depth = 0;
    while (current && current !== document.body && depth < 5) {
      let prev = current.previousElementSibling;
      while (prev) {
        const headingInPrev = prev.matches('label, [role="heading"], h1, h2, h3, h4, h5, h6, legend')
          ? prev
          : prev.querySelector('label, [role="heading"], h1, h2, h3, h4, h5, h6, legend, .form-label');
        if (headingInPrev) {
          const text = cleanLabelText(headingInPrev.innerText);
          if (text && !isNoiseLabel(text)) return text;
        } else if (['LABEL', 'P', 'SPAN', 'DIV'].includes(prev.tagName)) {
          const text = cleanLabelText(prev.innerText);
          if (text && text.length >= 2 && text.length < 100 && !isNoiseLabel(text)) {
            return text;
          }
        }
        prev = prev.previousElementSibling;
      }
      current = current.parentElement;
      depth++;
    }

    // 6. Attributes fallback (Strictly excluding noise placeholders like 'Jawaban Anda')
    const ariaLabel = cleanLabelText(element.getAttribute('aria-label'));
    if (ariaLabel && !isNoiseLabel(ariaLabel)) return ariaLabel;

    const placeholder = cleanLabelText(element.getAttribute('placeholder'));
    if (placeholder && !isNoiseLabel(placeholder)) return placeholder;

    const title = cleanLabelText(element.getAttribute('title'));
    if (title && !isNoiseLabel(title)) return title;

    if (element.name && !isNoiseLabel(element.name)) return element.name;

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
    const rawCandidates = document.querySelectorAll(`
      input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]),
      select,
      textarea,
      div[role="radiogroup"],
      div[role="group"],
      div[role="listbox"]
    `);

    const matchedList = [];
    const seenRadioGroups = new Set();
    let counter = 0;

    rawCandidates.forEach((el) => {
      // Ignore if element is inside GMT's UI
      if (el.closest('.gmt-ui-container')) return;

      // Filter div[role="group"]: only keep if it contains checkboxes (e.g. Google Forms checkbox groups)
      if (el.tagName === 'DIV' && el.getAttribute('role') === 'group') {
        const hasCheckboxes = el.querySelector('[role="checkbox"], input[type="checkbox"]');
        if (!hasCheckboxes) return;
      }

      // Check visibility
      if (el.offsetWidth === 0 && el.offsetHeight === 0 && !el.getClientRects().length) return;

      // Group native radio buttons by name so a question with multiple radios doesn't appear multiple times
      if (el.tagName === 'INPUT' && el.type === 'radio' && el.name) {
        if (seenRadioGroups.has(el.name)) return;
        seenRadioGroups.add(el.name);
      }

      const label = findAssociatedLabel(el);

      // Exclude captcha, security code, bot tokens
      if (isSecurityOrCaptchaField(el, label)) {
        return;
      }

      let rawType = 'text';
      if (el.tagName === 'SELECT') {
        rawType = 'select';
      } else if (el.tagName === 'TEXTAREA') {
        rawType = 'textarea';
      } else if (el.getAttribute('role') === 'radiogroup' || (el.tagName === 'INPUT' && el.type === 'radio')) {
        rawType = 'radio';
      } else if ((el.getAttribute('role') === 'group') || (el.tagName === 'INPUT' && el.type === 'checkbox')) {
        rawType = 'checkbox';
      } else if (el.getAttribute('role') === 'listbox') {
        rawType = 'select';
      } else if (el.type) {
        rawType = el.type.toLowerCase();
      }

      // Extract options if it's a choice field
      let options = [];
      if (rawType === 'radio' || rawType === 'checkbox' || rawType === 'select') {
        if (el.tagName === 'SELECT') {
          options = Array.from(el.querySelectorAll('option')).map(o => o.text.trim()).filter(Boolean);
        } else {
          const optionEls = el.querySelectorAll('[role="radio"], [role="checkbox"], .docssharedWizToggleLabeledLabelText, label');
          options = Array.from(optionEls).map(o => o.innerText.trim()).filter(Boolean);
        }
      }

      const placeholder = el.getAttribute ? (el.getAttribute('placeholder') || '') : '';
      const mask = detectInputMask(el);
      const isNumeric = detectNumericNature(el, mask);

      const metadata = {
        scanIndex: counter++,
        element: el,
        id: el.id || '',
        name: el.name || '',
        type: rawType,
        options: options.length > 0 ? options : null,
        isNumeric: isNumeric,
        placeholder: placeholder,
        mask: mask,
        maxLength: el.maxLength > 0 ? el.maxLength : null,
        pattern: el.getAttribute ? (el.getAttribute('pattern') || null) : null,
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

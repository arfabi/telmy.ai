// GMT Panel: Floating overlay explanation card positioned next to focused fields
window.GMTPanel = (function () {
  let containerEl = null;
  let currentFieldItem = null;
  let currentIndex = 0;
  let totalFields = 0;
  let currentLanguage = 'id';
  let onNavigateCallback = null;

  function initPanel(lang = 'id', onNavigate) {
    currentLanguage = lang;
    onNavigateCallback = onNavigate;

    if (containerEl) {
      containerEl.remove();
    }

    containerEl = document.createElement('div');
    containerEl.className = 'gmt-ui-container gmt-floating-panel';
    containerEl.style.display = 'none';

    document.body.appendChild(containerEl);
  }

  function render(item, index, total, lang) {
    if (!containerEl) initPanel(lang, onNavigateCallback);

    currentFieldItem = item;
    currentIndex = index;
    totalFields = total;
    if (lang) currentLanguage = lang;

    const metadata = item.metadata;
    const dict = item.dictEntry;

    // Get explanation data based on active language
    let fieldData = null;
    let isAi = !dict || dict.source === 'ai';
    let sourceLabel = isAi ? '🤖 AI' : '👤 User';
    let sourceClass = isAi ? 'gmt-source-ai' : 'gmt-source-user';

    if (dict && dict.translations && dict.translations[currentLanguage]) {
      fieldData = dict.translations[currentLanguage];
    } else if (dict && dict.translations && dict.translations['id']) {
      fieldData = dict.translations['id']; // fallback
    } else {
      // Dynamic AI generated fallback mock
      fieldData = generateDynamicFallback(metadata, currentLanguage);
    }

    const titleText = fieldData.label || metadata.label || metadata.name || 'Kolom Isian';

    containerEl.innerHTML = `
      <div class="gmt-card">
        <!-- Header -->
        <div class="gmt-card-header">
          <div class="gmt-header-left">
            <span class="gmt-brand-badge">GuideMe.To</span>
            <span class="gmt-source-pill ${sourceClass}" title="Sumber penjelasan">${sourceLabel}</span>
          </div>
          <div class="gmt-header-right">
            <!-- Single Suggestion/Correction Button in Top-Right -->
            <button type="button" class="gmt-suggest-top-btn" id="gmt-btn-suggest-top" title="Sarankan perbaikan untuk isian ini">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></svg>
              <span>Sarankan</span>
            </button>
            <button class="gmt-close-btn" id="gmt-panel-close" title="Tutup panduan">&times;</button>
          </div>
        </div>

        <!-- Field Title -->
        <div class="gmt-field-heading">
          <h3 class="gmt-field-title">${escapeHTML(titleText)}</h3>
          ${metadata.label && metadata.label !== titleText ? `<div class="gmt-field-orig-label">${escapeHTML(metadata.label)}</div>` : ''}
          
          <!-- Detected Input Type & Form Mask Rules -->
          ${(() => {
            const formatTags = [];
            if (metadata.isNumeric) formatTags.push('🔢 Format Angka');
            if (metadata.mask) formatTags.push(`🎭 Mask: ${escapeHTML(metadata.mask)}`);
            else if (metadata.placeholder && metadata.placeholder.length < 32) formatTags.push(`Contoh: ${escapeHTML(metadata.placeholder)}`);
            if (metadata.maxLength) formatTags.push(`Maks ${metadata.maxLength} digit`);
            
            if (!formatTags.length) return '';
            return `
              <div class="gmt-format-chips">
                ${formatTags.map(t => `<span class="gmt-chip">${t}</span>`).join('')}
              </div>
            `;
          })()}
        </div>

        <!-- Scrollable Content -->
        <div class="gmt-card-content">
          <!-- Meaning -->
          <div class="gmt-section-block">
            <div class="gmt-block-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              ${getI18nText('meaning_title', currentLanguage)}
            </div>
            <p class="gmt-meaning-text">${escapeHTML(fieldData.meaning)}</p>
          </div>

          <!-- How to fill -->
          <div class="gmt-section-block">
            <div class="gmt-block-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              ${getI18nText('how_title', currentLanguage)}
            </div>
            <p class="gmt-instruction-text">${escapeHTML(fieldData.how_to_fill)}</p>
          </div>

          <!-- Fictional Example -->
          <div class="gmt-section-block">
            <div class="gmt-block-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 12h6M9 8h6M9 16h4"/></svg>
              ${getI18nText('example_title', currentLanguage)}
            </div>
            <div class="gmt-example-box">
              <code>${escapeHTML(fieldData.example)}</code>
            </div>
          </div>

          <!-- Common Mistakes -->
          <div class="gmt-section-block gmt-mistake-box">
            <div class="gmt-block-label text-warning">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>
              ${getI18nText('mistake_title', currentLanguage)}
            </div>
            <p class="gmt-mistake-text">${escapeHTML(fieldData.common_mistakes)}</p>
          </div>

          <!-- Foreigner Note if exists -->
          ${fieldData.foreign_note ? `
          <div class="gmt-section-block gmt-foreign-box">
            <div class="gmt-block-label text-info">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20"/></svg>
              ${getI18nText('foreign_title', currentLanguage)}
            </div>
            <p class="gmt-foreign-text">${escapeHTML(fieldData.foreign_note)}</p>
          </div>` : ''}

          <!-- Suggestions / Feedback Form Drawer (hidden by default) -->
          <div class="gmt-feedback-drawer" id="gmt-feedback-drawer" style="display:none;">
            <div class="gmt-drawer-header">
              <strong id="gmt-drawer-title">Sarankan Perbaikan</strong>
              <button type="button" class="gmt-drawer-close" id="gmt-drawer-close-btn">&times;</button>
            </div>
            <textarea class="gmt-feedback-input" id="gmt-feedback-text" rows="3" placeholder="Tuliskan saran perbaikan penjelasan atau tips untuk kolom ini..."></textarea>
            <div class="gmt-drawer-actions">
              <button type="button" class="gmt-btn-submit" id="gmt-submit-feedback-btn">Kirim Masukan</button>
            </div>
          </div>
        </div>

        <!-- Enlarged Navigation Stepper Footer -->
        <div class="gmt-card-footer">
          <button type="button" class="gmt-nav-btn gmt-prev-btn" id="gmt-prev-btn" ${currentIndex === 0 ? 'disabled' : ''} title="Field Sebelumnya">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
            <span>Sebelumnya</span>
          </button>
          
          <div class="gmt-stepper-counter">
            <span class="gmt-counter-current">${currentIndex + 1}</span>
            <span class="gmt-counter-divider">/</span>
            <span class="gmt-counter-total">${totalFields}</span>
          </div>

          <button type="button" class="gmt-nav-btn gmt-next-btn" id="gmt-next-btn" ${currentIndex >= totalFields - 1 ? 'disabled' : ''} title="Field Berikutnya">
            <span>Berikutnya</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    `;

    // Position panel near the target element
    positionPanelNearElement(metadata.element);
    containerEl.style.display = 'block';

    // Bind event listeners
    bindPanelEvents(titleText);
  }

  function positionPanelNearElement(targetEl) {
    if (!targetEl || !containerEl) return;

    const rect = targetEl.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const panelWidth = 360;
    const margin = 16;
    const windowWidth = window.innerWidth;

    let left = rect.right + scrollLeft + margin;
    let top = rect.top + scrollTop - 10;

    // If placing to the right exceeds window width, place to left or below
    if (rect.right + panelWidth + margin > windowWidth) {
      if (rect.left - panelWidth - margin > 0) {
        left = rect.left + scrollLeft - panelWidth - margin;
      } else {
        // Place below the field
        left = Math.max(margin, rect.left + scrollLeft);
        top = rect.bottom + scrollTop + margin;
      }
    }

    // Keep top inside view bounds
    if (top < scrollTop + margin) {
      top = scrollTop + margin;
    }

    containerEl.style.left = `${Math.round(left)}px`;
    containerEl.style.top = `${Math.round(top)}px`;
  }

  function bindPanelEvents(fieldTitle) {
    const closeBtn = containerEl.querySelector('#gmt-panel-close');
    closeBtn.addEventListener('click', hide);

    // Prev / Next
    const prevBtn = containerEl.querySelector('#gmt-prev-btn');
    const nextBtn = containerEl.querySelector('#gmt-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0 && onNavigateCallback) {
          onNavigateCallback(currentIndex - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < totalFields - 1 && onNavigateCallback) {
          onNavigateCallback(currentIndex + 1);
        }
      });
    }

    // Top-Right Suggest Drawer toggle
    const drawer = containerEl.querySelector('#gmt-feedback-drawer');
    const drawerTitle = containerEl.querySelector('#gmt-drawer-title');
    const drawerClose = containerEl.querySelector('#gmt-drawer-close-btn');
    const suggestTopBtn = containerEl.querySelector('#gmt-btn-suggest-top');
    const submitBtn = containerEl.querySelector('#gmt-submit-feedback-btn');
    const feedbackInput = containerEl.querySelector('#gmt-feedback-text');

    let currentFeedbackType = 'suggestion';

    if (suggestTopBtn) {
      suggestTopBtn.addEventListener('click', () => {
        const isCurrentlyOpen = drawer.style.display === 'block';
        if (isCurrentlyOpen) {
          drawer.style.display = 'none';
        } else {
          currentFeedbackType = 'suggestion';
          drawerTitle.textContent = `💡 Sarankan Perbaikan (${fieldTitle})`;
          feedbackInput.placeholder = 'Tuliskan koreksi atau saran tambahan tips untuk kolom ini...';
          drawer.style.display = 'block';
          feedbackInput.focus();
        }
      });
    }

    drawerClose.addEventListener('click', () => {
      drawer.style.display = 'none';
    });

    submitBtn.addEventListener('click', () => {
      const text = feedbackInput.value.trim();
      if (!text) {
        feedbackInput.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';

      chrome.runtime.sendMessage({
        type: 'SUBMIT_SUGGESTION',
        payload: {
          fieldId: currentFieldItem.metadata.id || currentFieldItem.metadata.name || 'field_' + currentIndex,
          fieldLabel: fieldTitle,
          type: currentFeedbackType,
          text: text,
          language: currentLanguage
        }
      }, (res) => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Masukan';
        feedbackInput.value = '';
        drawer.innerHTML = `
          <div style="padding: 10px; text-align: center; color: #166534; font-size: 12px; font-weight: 600;">
            ✅ Terima kasih! Masukan Anda telah dicatat ke riwayat saran.
          </div>
        `;
        setTimeout(() => {
          drawer.style.display = 'none';
        }, 2200);
      });
    });
  }

  function hide() {
    if (containerEl) {
      containerEl.style.display = 'none';
    }
  }

  function generateDynamicFallback(metadata, lang) {
    let raw = metadata.label || metadata.name || 'Kolom Isian';
    raw = raw.replace(/\*/g, '').trim();

    const lower = raw.toLowerCase();
    let realisticExample = 'Contoh Isian';
    let locationHint = 'Periksa lembar dokumen resmi yang Anda miliki.';

    if (lower.includes('nomor') || lower.includes('no') || lower.includes('seri') || lower.includes('number')) {
      realisticExample = '1234/UN1/FASILKOM/2024 atau 3171-LT-01012023-0001';
      locationHint = 'Nomor seri ini biasanya tercetak di bagian sudut kanan atas dokumen, atau tepat di bawah judul/kop surat resmi.';
    } else if (lower.includes('nama') || lower.includes('name')) {
      realisticExample = 'JOHN MICHAEL DOE';
      locationHint = 'Tuliskan nama lengkap persis sesuai ejaan di identitas resmi.';
    } else if (lower.includes('email') || lower.includes('surel')) {
      realisticExample = 'pemohon.dokumen@example.com';
      locationHint = 'Gunakan email yang aktif untuk menerima tagihan pembayaran.';
    } else if (lower.includes('telepon') || lower.includes('phone') || lower.includes('hp')) {
      realisticExample = '+6281234567890';
      locationHint = 'Gunakan format dengan kode negara (misal +62 untuk Indonesia).';
    } else if (lower.includes('alamat') || lower.includes('address')) {
      realisticExample = 'Jl. Jenderal Sudirman Kav. 10, Jakarta Selatan 12190';
      locationHint = 'Tuliskan nama jalan, kelurahan, kecamatan, kota dan kode pos.';
    } else if (lower.includes('pejabat') || lower.includes('instansi')) {
      realisticExample = 'Prof. Dr. Ir. BAMBANG SOEMARNO / Universitas Indonesia';
      locationHint = 'Periksa stempel dan tanda tangan pada bagian bawah dokumen.';
    }

    const dict = {
      id: {
        label: raw,
        meaning: `Kolom "${raw}". ${locationHint}`,
        how_to_fill: `Ketikkan data persis seperti yang tertera di dokumen fisik atau kartu identitas Anda. Perhatikan ejaan dan karakter khusus.`,
        example: realisticExample,
        common_mistakes: `Salah ketik angka/huruf atau mengosongkan kolom penting ini.`,
        foreign_note: `Bagi WNA, pastikan data yang dimasukkan sesuai dengan paspor atau dokumen resmi yang disahkan.`
      },
      en: {
        label: raw,
        meaning: `Field: "${raw}". ${locationHint}`,
        how_to_fill: `Type details accurately as stated in your physical document or legal identification.`,
        example: realisticExample,
        common_mistakes: `Typographical mistakes or omitting required prefixes.`,
        foreign_note: `Ensure the details match your official passport or legalized certificate.`
      },
      zh: {
        label: raw,
        meaning: `栏目：“${raw}”。${locationHint}`,
        how_to_fill: `请按照您的纸质文件或身份证件上的记录完整准确录入。`,
        example: realisticExample,
        common_mistakes: `输入错误或遗漏必要的代码符号。`,
        foreign_note: `外籍人员请核对护照或公证认证书籍的原始拼写。`
      },
      ja: {
        label: raw,
        meaning: `入力項目：「${raw}」。${locationHint}`,
        how_to_fill: `原本または公的身分証明書に記載されている通りに入力してください。`,
        example: realisticExample,
        common_mistakes: `誤字・脱字や重要な記号の入力漏れ。`,
        foreign_note: `外国人の方はパスポートの記載と照合してください。`
      },
      ko: {
        label: raw,
        meaning: `입력란: "${raw}". ${locationHint}`,
        how_to_fill: `실물 서류 또는 신분증에 기재된 내용 그대로 정확하게 입력하세요.`,
        example: realisticExample,
        common_mistakes: `오탈자 또는 필수 표기 누락.`,
        foreign_note: `외국인의 경우 여권 표기와 일치하는지 확인하세요.`
      }
    };

    return dict[lang] || dict['id'];
  }

  function getI18nText(key, lang) {
    const titles = {
      meaning_title: { id: 'Arti Kolom', en: 'Meaning & Purpose', zh: '栏目含义', ja: '項目の意味', ko: '항목 설명' },
      how_title: { id: 'Cara Mengisi', en: 'How to Fill', zh: '填写指南', ja: '記入方法', ko: '작성 요령' },
      example_title: { id: 'Contoh Fiktif', en: 'Fictional Example', zh: '示例演示', ja: '記入例（架空）', ko: '가상 예시' },
      mistake_title: { id: 'Kesalahan Umum', en: 'Common Mistakes', zh: '常见误区', ja: 'よくある誤り', ko: '자주 하는 실수' },
      foreign_title: { id: 'Catatan untuk WNA', en: 'Notes for Foreigners', zh: '外籍特别提醒', ja: '外国人向け注意事項', ko: '외국인 유의사항' }
    };
    return (titles[key] && titles[key][lang]) || (titles[key] && titles[key]['id']) || '';
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function updateLanguage(newLang) {
    if (newLang && currentFieldItem && containerEl && containerEl.style.display !== 'none') {
      currentLanguage = newLang;
      render(currentFieldItem, currentIndex, totalFields, currentLanguage);
    }
  }

  return {
    initPanel,
    render,
    hide,
    updateLanguage
  };
})();

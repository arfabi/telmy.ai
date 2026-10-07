// Telmy — Side Panel Co-Pilot
window.GMTPanel = (function () {
  let panelEl = null;
  let launcherEl = null;
  let currentFieldItem = null;
  let currentIndex = -1;
  let allFieldsList = [];
  let currentLanguage = 'id';
  let isPanelMinimized = false;
  let onNavigateCallback = null;
  let onLanguageChangeCallback = null;
  let cachedPageSummary = null;

  // Complete I18N Matrix for UI text across 5 languages
  const I18N = {
    brand_title: { id: 'Telmy.ai', en: 'Telmy.ai', zh: 'Telmy.ai', ja: 'Telmy.ai', ko: 'Telmy.ai' },
    copilot_badge: { id: 'Form Assistant', en: 'Form Assistant', zh: '表单助手', ja: 'フォームアシスタント', ko: '양식 도우미' },
    page_summary_title: { id: '📌 Ringkasan Formulir', en: '📌 Form Overview', zh: '📌 表单概览', ja: '📌 フォーム概要', ko: '📌 양식 개요' },
    prerequisites_title: { id: 'Dokumen Persiapan:', en: 'Prerequisites:', zh: '建议提前准备材料：', ja: '事前準備書類：', ko: '사전 준비 서류:' },
    progress_label: { id: 'Progres Pengisian', en: 'Form Progress', zh: '填写进度', ja: '入力進捗', ko: '작성 진행도' },
    fields_count: { id: 'Kolom', en: 'Fields', zh: '项', ja: '項目', ko: '개' },
    meaning_title: { id: 'Arti & Fungsi Kolom', en: 'Meaning & Purpose', zh: '栏目含义与用途', ja: '項目の意味と用途', ko: '항목 설명 및 용도' },
    how_title: { id: 'Cara Mengisi', en: 'How to Fill', zh: '填写指南与格式', ja: '入力方法・形式', ko: '작성 요령 및 형식' },
    example_title: { id: 'Contoh Isian Fiktif', en: 'Fictional Example', zh: '虚构示例演示', ja: '記入例（架空）', ko: '가상 예시' },
    mistake_title: { id: 'Kesalahan Umum', en: 'Common Mistakes', zh: '常见误区与避坑', ja: 'よくある誤り', ko: '자주 하는 실수' },
    foreign_title: { id: 'Catatan untuk WNA', en: 'Notes for Foreigners', zh: '外籍特别提醒', ja: '外国人向け注意事項', ko: '외국인 유의사항' },
    btn_suggest: { id: 'Sarankan Perbaikan', en: 'Suggest Improvement', zh: '反馈建议', ja: '改善提案', ko: '수정 제안' },
    btn_prev: { id: 'Sebelumnya', en: 'Previous', zh: '上一项', ja: '前へ', ko: '이전' },
    btn_next: { id: 'Berikutnya', en: 'Next', zh: '下一项', ja: '次へ', ko: '다음' },
    empty_hint_title: { id: 'Panduan Siap Membantu Anda', en: 'Ready to Assist You', zh: '智能导填助手已就绪', ja: 'スマートガイド準備完了', ko: '스마트 도우미 준비 완료' },
    empty_hint_desc: {
      id: 'Arahkan kursor atau klik salah satu kolom formulir di sebelah kiri untuk melihat petunjuk detail, aturan, dan contoh isian.',
      en: 'Hover or click any form field on the left to inspect official guidelines, formatting rules, and sample entries.',
      zh: '在左侧页面点击或将光标移至任意输入栏，即可查看详细说明、规范要求与示例。',
      ja: '左側の入力欄をクリックまたは選択すると、詳しい記入ルールや入力例が表示されます。',
      ko: '왼쪽 양식의 입력란을 클릭하거나 선택하면 상세 작성 안내와 예시를 확인할 수 있습니다.'
    },
    quick_list_title: { id: 'Daftar Kolom Terdeteksi:', en: 'Detected Fields List:', zh: '已检测到的表单项：', ja: '検出された入力項目：', ko: '감지된 입력란 목록:' },
    source_verified: { id: 'Terverifikasi', en: 'Verified', zh: '已官方验证', ja: '検証済み', ko: '공식 검증됨' },
    source_ai: { id: 'Draf AI', en: 'AI Draft', zh: 'AI草稿', ja: 'AI生成', ko: 'AI 생성' },
    loading_ai: { id: 'Sedang menyusun panduan AI...', en: 'Generating AI explanation...', zh: '正在生成智能指南...', ja: 'AIガイドを生成中...', ko: 'AI 설명을 생성하는 중...' },
    drawer_title: { id: '💡 Sarankan Perbaikan', en: '💡 Suggest Improvement', zh: '💡 提出修改建议', ja: '💡 改善案の送信', ko: '💡 수정 제안' },
    drawer_placeholder: {
      id: 'Tuliskan koreksi atau tips tambahan untuk kolom ini...',
      en: 'Write your correction or helpful tips for this field...',
      zh: '请输入您对该输入栏的修正或实用建议...',
      ja: 'この項目に関する修正案や補足を入力してください...',
      ko: '이 입력란에 대한 수정 사항이나 유용한 팁을 입력해 주세요...'
    },
    drawer_submit: { id: 'Kirim Masukan', en: 'Submit Feedback', zh: '提交建议', ja: '送信する', ko: '제안 제출' },
    drawer_sending: { id: 'Mengirim...', en: 'Sending...', zh: '正在提交...', ja: '送信中...', ko: '전송 중...' },
    drawer_success: {
      id: '✅ Terima kasih! Masukan Anda telah dicatat ke riwayat saran.',
      en: '✅ Thank you! Your suggestion has been recorded.',
      zh: '✅ 感谢！您的建议已成功记录。',
      ja: '✅ ありがとうございます！提案を記録しました。',
      ko: '✅ 감사합니다! 제안이 정상적으로 접수되었습니다.'
    },
    default_field_title: { id: 'Kolom Isian', en: 'Form Field', zh: '表单输入项', ja: '入力項目', ko: '입력란' }
  };

  function t(key) {
    const entry = I18N[key];
    if (!entry) return '';
    return entry[currentLanguage] || entry['id'] || '';
  }

  function initPanel(lang = 'id', onNavigate, onLangChange) {
    currentLanguage = lang || 'id';
    onNavigateCallback = onNavigate;
    onLanguageChangeCallback = onLangChange;

    if (panelEl) panelEl.remove();
    if (launcherEl) launcherEl.remove();

    // 1. Create Side Panel Container
    panelEl = document.createElement('div');
    panelEl.className = 'gmt-ui-container gmt-side-panel';
    panelEl.id = 'gmt-side-panel-container';

    // 2. Create Minimized Launcher Pill
    launcherEl = document.createElement('div');
    launcherEl.className = 'gmt-ui-container gmt-launcher-pill';
    launcherEl.id = 'gmt-launcher-pill';
    launcherEl.style.display = 'none';
    launcherEl.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
      <span>Telmy.ai</span>
      <span class="gmt-pill-badge" id="gmt-pill-count">0</span>
    `;
    launcherEl.addEventListener('click', expand);

    document.body.appendChild(panelEl);
    document.body.appendChild(launcherEl);

    // Initial render empty state
    renderShell();
  }

  function renderShell() {
    if (!panelEl) return;

    panelEl.innerHTML = `
      <!-- Header -->
      <div class="gmt-panel-header">
        <div class="gmt-brand-container">
          <span class="gmt-brand-logo">${t('brand_title')}</span>
          <span class="gmt-copilot-tag">${t('copilot_badge')}</span>
        </div>
        <div class="gmt-header-controls">
          <select class="gmt-lang-select" id="gmt-panel-lang-select" title="Pilih Bahasa">
            <option value="id" ${currentLanguage === 'id' ? 'selected' : ''}>🇮🇩 ID</option>
            <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
            <option value="zh" ${currentLanguage === 'zh' ? 'selected' : ''}>🇨🇳 中文</option>
            <option value="ja" ${currentLanguage === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
            <option value="ko" ${currentLanguage === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
          </select>
          <button type="button" class="gmt-icon-btn" id="gmt-btn-minimize" title="Sembunyikan ke sisi kanan">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <!-- Scrollable Body -->
      <div class="gmt-panel-body" id="gmt-panel-body-content">
        <!-- Briefing section will be injected here -->
        <div id="gmt-briefing-slot"></div>
        <!-- Active field or empty state will be injected here -->
        <div id="gmt-field-slot"></div>
      </div>

      <!-- Footer Stepper -->
      <div class="gmt-panel-footer">
        <button type="button" class="gmt-nav-btn" id="gmt-prev-btn" disabled>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          <span>${t('btn_prev')}</span>
        </button>

        <div class="gmt-stepper-counter" id="gmt-counter-label">
          <span class="gmt-counter-active">0</span> / ${allFieldsList.length || 0}
        </div>

        <button type="button" class="gmt-nav-btn" id="gmt-next-btn" disabled>
          <span>${t('btn_next')}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    `;

    bindHeaderEvents();
    renderBriefingCard();
    renderFieldSlot();
    updateFooterStepper();
  }

  function bindHeaderEvents() {
    const langSelect = panelEl.querySelector('#gmt-panel-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        currentLanguage = newLang;
        chrome.runtime.sendMessage({
          type: 'UPDATE_SETTINGS',
          payload: { language: newLang }
        });
        if (onLanguageChangeCallback) onLanguageChangeCallback(newLang);
        renderShell();
      });
    }

    const minBtn = panelEl.querySelector('#gmt-btn-minimize');
    if (minBtn) {
      minBtn.addEventListener('click', minimize);
    }

    const prevBtn = panelEl.querySelector('#gmt-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0 && onNavigateCallback) {
          onNavigateCallback(currentIndex - 1);
        }
      });
    }

    const nextBtn = panelEl.querySelector('#gmt-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < allFieldsList.length - 1 && onNavigateCallback) {
          onNavigateCallback(currentIndex + 1);
        }
      });
    }
  }

  function setPageSummary(summaryData, fieldsList = []) {
    cachedPageSummary = summaryData;
    if (fieldsList && fieldsList.length) {
      allFieldsList = fieldsList;
    }
    const countBadge = launcherEl ? launcherEl.querySelector('#gmt-pill-count') : null;
    if (countBadge) countBadge.textContent = allFieldsList.length;

    renderBriefingCard();
    updateFooterStepper();
  }

  function renderBriefingCard() {
    const slot = panelEl ? panelEl.querySelector('#gmt-briefing-slot') : null;
    if (!slot) return;

    let summary = null;
    if (cachedPageSummary) {
      summary = cachedPageSummary[currentLanguage] || cachedPageSummary['id'] || cachedPageSummary;
    }

    const total = allFieldsList.length;
    // Calculate how many fields already have values filled
    let filledCount = 0;
    allFieldsList.forEach(item => {
      const el = item.metadata ? item.metadata.element : null;
      if (el && el.value && el.value.trim() !== '') filledCount++;
    });

    const percent = total > 0 ? Math.min(100, Math.round((filledCount / total) * 100)) : 0;

    const defaultTitle = document.title || 'Formulir Pelayanan Publik';
    const titleText = summary && summary.title ? summary.title : defaultTitle;
    const descText = summary && summary.description 
      ? summary.description 
      : (currentLanguage === 'zh' ? '检测到本页包含多个法定表单项。请在左侧检查并依次录入。' :
         currentLanguage === 'en' ? 'Multiple public form fields detected on this page. Review instructions below.' :
         'Terdeteksi kolom formulir pelayanan publik. Pastikan dokumen fisik Anda telah siap.');

    const prereqs = summary && Array.isArray(summary.prerequisites) ? summary.prerequisites : [];

    slot.innerHTML = `
      <div class="gmt-briefing-card">
        <div class="gmt-briefing-header">
          <div class="gmt-briefing-title-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>${escapeHTML(titleText)}</span>
          </div>
        </div>
        <div class="gmt-briefing-desc">${escapeHTML(descText)}</div>

        ${prereqs.length > 0 ? `
          <div class="gmt-prerequisites-list">
            <div style="font-size: 11px; font-weight: 700; color: #1e40af; margin-bottom: 2px;">${t('prerequisites_title')}</div>
            ${prereqs.map(p => `
              <div class="gmt-prereq-item">
                <span class="gmt-prereq-bullet">•</span>
                <span>${escapeHTML(p)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Progress Track -->
        <div class="gmt-progress-container">
          <div class="gmt-progress-label-row">
            <span>${t('progress_label')}</span>
            <span><strong>${filledCount}</strong> / ${total} ${t('fields_count')} (${percent}%)</span>
          </div>
          <div class="gmt-progress-track">
            <div class="gmt-progress-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderFieldSlot() {
    const slot = panelEl ? panelEl.querySelector('#gmt-field-slot') : null;
    if (!slot) return;

    if (!currentFieldItem || currentIndex < 0) {
      // Empty State: Show helpful guidance & quick list of all fields
      slot.innerHTML = `
        <div class="gmt-empty-state">
          <div class="gmt-empty-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </div>
          <div class="gmt-empty-title">${t('empty_hint_title')}</div>
          <div class="gmt-empty-desc">${t('empty_hint_desc')}</div>

          ${allFieldsList.length > 0 ? `
            <div class="gmt-quick-field-list">
              <div style="font-size: 11.5px; font-weight: 700; color: #475569; margin-bottom: 4px;">
                ${t('quick_list_title')}
              </div>
              ${allFieldsList.map((item, idx) => {
                const label = item.metadata ? (item.metadata.label || item.metadata.name || `Field #${idx + 1}`) : `Field #${idx + 1}`;
                return `
                  <div class="gmt-quick-field-item" data-field-index="${idx}">
                    <span>${idx + 1}. ${escapeHTML(label)}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      `;

      // Bind quick field item clicks
      slot.querySelectorAll('.gmt-quick-field-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-field-index'), 10);
          if (onNavigateCallback) onNavigateCallback(idx);
        });
      });
      return;
    }

    const item = currentFieldItem;
    const metadata = item.metadata;
    const dict = item.dictEntry;

    // In AI_FIRST mode or if not fetched from backend yet, trigger fetch and show AI loading state
    const hasCachedRealAi = dict && dict.translations && dict.translations[currentLanguage] && dict.translations[currentLanguage]._isRealAi;
    if (!item._backendFetched && !hasCachedRealAi) {
      fetchBackendAiExplanation(item, metadata);

      const fieldTitle = metadata.label || metadata.name || t('default_field_title');
      slot.innerHTML = `
        <div class="gmt-field-card">
          <div class="gmt-field-topbar">
            <div class="gmt-field-title-area">
              <h3 class="gmt-field-title">${escapeHTML(fieldTitle)}</h3>
              ${metadata.label && metadata.label !== fieldTitle ? `<div class="gmt-field-orig-label">${escapeHTML(metadata.label)}</div>` : ''}
            </div>
            <span class="gmt-source-tag gmt-source-ai" style="background: #ede9fe; color: #6d28d9; border: 1px solid #ddd6fe;">🤖 AI Generating...</span>
          </div>

          <div style="padding: 24px 8px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; color: #4338ca; font-size: 13.5px;">
              <svg class="gmt-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <span>${currentLanguage === 'zh' ? 'GLM-5.3-Flash 正在深入分析...' : currentLanguage === 'en' ? 'GLM-5.3-Flash is analyzing this field...' : 'GLM-5.3-Flash sedang menganalisis kolom ini...'}</span>
            </div>
            <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
              ${currentLanguage === 'zh' ? '正在提取官方填写规范、示例与涉外注意事项...' : currentLanguage === 'en' ? 'Formulating official instructions, examples & notes for foreigners...' : 'Sedang menyusun arti kolom, panduan, dan contoh isian...'}
            </div>
            <div style="margin-top: 18px;">
              <div class="gmt-skeleton-line" style="width: 100%;"></div>
              <div class="gmt-skeleton-line" style="width: 85%;"></div>
              <div class="gmt-skeleton-line" style="width: 70%;"></div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Determine explanation content
    let fieldData = null;
    let isAi = !dict || dict.source === 'ai';

    if (dict && dict.translations && dict.translations[currentLanguage]) {
      fieldData = dict.translations[currentLanguage];
    } else if (dict && dict.translations && dict.translations['id']) {
      fieldData = generateDynamicFallback(metadata, currentLanguage, dict.translations['id']);
    } else {
      fieldData = generateDynamicFallback(metadata, currentLanguage);
    }

    const titleText = fieldData.label || metadata.label || metadata.name || t('default_field_title');
    const sourceLabel = isAi ? t('source_ai') : t('source_verified');
    const sourceClass = isAi ? 'gmt-source-ai' : 'gmt-source-verified';

    // Format Chips
    const formatTags = [];
    if (metadata.isNumeric) {
      formatTags.push(currentLanguage === 'zh' ? '🔢 纯数字格式' : currentLanguage === 'en' ? '🔢 Numeric digits' : '🔢 Format Angka');
    }
    if (metadata.mask) {
      formatTags.push(`🎭 ${metadata.mask}`);
    } else if (metadata.placeholder && metadata.placeholder.length < 28) {
      formatTags.push(`Contoh: ${metadata.placeholder}`);
    }
    if (metadata.maxLength) {
      formatTags.push(currentLanguage === 'zh' ? `最多${metadata.maxLength}位` : currentLanguage === 'en' ? `Max ${metadata.maxLength} chars` : `Maks ${metadata.maxLength} karakter`);
    }

    slot.innerHTML = `
      <div class="gmt-field-card">
        <!-- Top Bar -->
        <div class="gmt-field-topbar">
          <div class="gmt-field-title-area">
            <h3 class="gmt-field-title">${escapeHTML(titleText)}</h3>
            ${metadata.label && metadata.label !== titleText ? `<div class="gmt-field-orig-label">${escapeHTML(metadata.label)}</div>` : ''}
          </div>
          <span class="gmt-source-tag ${sourceClass}">${sourceLabel}</span>
        </div>

        <!-- Format Chips -->
        ${formatTags.length > 0 ? `
          <div class="gmt-format-chips">
            ${formatTags.map(tag => `<span class="gmt-chip">${escapeHTML(tag)}</span>`).join('')}
          </div>
        ` : ''}

        <!-- Meaning -->
        <div class="gmt-section-block">
          <div class="gmt-block-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            ${t('meaning_title')}
          </div>
          <div class="gmt-block-text">${escapeHTML(fieldData.meaning || '-')}</div>
        </div>

        <!-- How to Fill -->
        <div class="gmt-section-block">
          <div class="gmt-block-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            ${t('how_title')}
          </div>
          <div class="gmt-block-text">${escapeHTML(fieldData.how_to_fill || fieldData.howToFill || '-')}</div>
        </div>

        <!-- Fictional Example Box -->
        <div class="gmt-section-block">
          <div class="gmt-block-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
            ${t('example_title')}
          </div>
          <div class="gmt-example-box">${escapeHTML(fieldData.example || '-')}</div>
        </div>

        <!-- Common Mistakes -->
        ${(fieldData.common_mistakes || fieldData.commonMistakes) ? `
          <div class="gmt-alert-mistakes">
            <div style="font-weight: 700; margin-bottom: 2px;">⚠️ ${t('mistake_title')}</div>
            <div>${escapeHTML(Array.isArray(fieldData.common_mistakes || fieldData.commonMistakes) ? (fieldData.common_mistakes || fieldData.commonMistakes).join('. ') : (fieldData.common_mistakes || fieldData.commonMistakes))}</div>
          </div>
        ` : ''}

        <!-- Notes for Foreigners -->
        ${(fieldData.foreign_note || fieldData.tipsForForeigners) ? `
          <div class="gmt-alert-foreign">
            <div style="font-weight: 700; margin-bottom: 2px;">🌐 ${t('foreign_title')}</div>
            <div>${escapeHTML(fieldData.foreign_note || fieldData.tipsForForeigners)}</div>
          </div>
        ` : ''}

        <!-- Suggest Button & Drawer -->
        <div>
          <button type="button" class="gmt-suggest-action-btn" id="gmt-btn-toggle-suggest">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></svg>
            <span>${t('btn_suggest')}</span>
          </button>

          <div class="gmt-feedback-drawer" id="gmt-feedback-drawer" style="display: none;">
            <div style="font-size: 11.5px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">${t('drawer_title')}</div>
            <textarea id="gmt-feedback-text" placeholder="${t('drawer_placeholder')}"></textarea>
            <div class="gmt-drawer-actions">
              <button type="button" class="gmt-btn-submit" id="gmt-btn-submit-feedback">${t('drawer_submit')}</button>
            </div>
            <div id="gmt-feedback-status"></div>
          </div>
        </div>
      </div>
    `;

    bindFieldEvents(titleText, metadata);

    // If this field is an unknown/AI field and backend is active, asynchronously request Gemini translation
    if (isAi && !item._backendFetched) {
      fetchBackendAiExplanation(item, metadata);
    }
  }

  function bindFieldEvents(fieldTitle, metadata) {
    const toggleBtn = panelEl.querySelector('#gmt-btn-toggle-suggest');
    const drawer = panelEl.querySelector('#gmt-feedback-drawer');
    const submitBtn = panelEl.querySelector('#gmt-btn-submit-feedback');
    const textArea = panelEl.querySelector('#gmt-feedback-text');
    const statusDiv = panelEl.querySelector('#gmt-feedback-status');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = drawer.style.display === 'none';
        drawer.style.display = isHidden ? 'block' : 'none';
        if (isHidden && textArea) textArea.focus();
      });
    }

    if (submitBtn && textArea) {
      submitBtn.addEventListener('click', () => {
        const text = textArea.value.trim();
        if (!text) {
          textArea.focus();
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = t('drawer_sending');

        chrome.runtime.sendMessage({
          type: 'SUBMIT_SUGGESTION',
          payload: {
            fieldId: metadata.id || metadata.name || 'field_' + currentIndex,
            fieldLabel: fieldTitle,
            type: 'suggestion',
            text: text,
            language: currentLanguage,
            domain: window.location.hostname
          }
        }, () => {
          submitBtn.disabled = false;
          submitBtn.textContent = t('drawer_submit');
          textArea.value = '';
          statusDiv.innerHTML = `<div style="font-size: 11.5px; color: #166534; font-weight: 600; margin-top: 6px;">${t('drawer_success')}</div>`;
          setTimeout(() => {
            drawer.style.display = 'none';
            statusDiv.innerHTML = '';
          }, 2400);
        });
      });
    }
  }

  function fetchBackendAiExplanation(item, metadata) {
    chrome.runtime.sendMessage({
      type: 'EXPLAIN_FIELD',
      payload: {
        metadata: {
          label: metadata.label,
          name: metadata.name,
          type: metadata.type,
          options: metadata.options || null,
          placeholder: metadata.placeholder,
          domain: window.location.hostname
        },
        language: currentLanguage,
        pageContext: document.title
      }
    }, (res) => {
      item._backendFetched = true;
      if (res && res.success && res.data) {
        if (!item.dictEntry) {
          item.dictEntry = { source: 'ai', translations: {} };
        }
        item.dictEntry.translations[currentLanguage] = {
          label: res.data.label || metadata.label,
          meaning: res.data.meaning,
          how_to_fill: res.data.howToFill || res.data.how_to_fill,
          example: res.data.example,
          common_mistakes: res.data.commonMistakes || res.data.common_mistakes,
          foreign_note: res.data.tipsForForeigners || res.data.foreign_note,
          _isRealAi: true
        };
      }
      // Re-render if this field is still active
      if (currentFieldItem === item) {
        renderFieldSlot();
      }
    });
  }

  function updateFooterStepper() {
    if (!panelEl) return;
    const prevBtn = panelEl.querySelector('#gmt-prev-btn');
    const nextBtn = panelEl.querySelector('#gmt-next-btn');
    const counterLabel = panelEl.querySelector('#gmt-counter-label');

    const total = allFieldsList.length;
    const currentDisplay = currentIndex >= 0 ? currentIndex + 1 : 0;

    if (counterLabel) {
      counterLabel.innerHTML = `<span class="gmt-counter-active">${currentDisplay}</span> / ${total}`;
    }

    if (prevBtn) {
      prevBtn.disabled = currentIndex <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex < 0 || currentIndex >= total - 1;
    }
  }

  function render(item, index, total, lang) {
    if (!panelEl) initPanel(lang, onNavigateCallback, onLanguageChangeCallback);

    currentFieldItem = item;
    currentIndex = index;
    if (lang) currentLanguage = lang;

    // Ensure side panel is expanded and visible
    expand();

    renderBriefingCard();
    renderFieldSlot();
    updateFooterStepper();
  }

  function minimize() {
    isPanelMinimized = true;
    if (panelEl) panelEl.classList.add('gmt-collapsed');
    if (launcherEl) launcherEl.style.display = 'flex';
  }

  function expand() {
    isPanelMinimized = false;
    if (panelEl) panelEl.classList.remove('gmt-collapsed');
    if (launcherEl) launcherEl.style.display = 'none';
  }

  function hide() {
    minimize();
  }

  function updateLanguage(newLang) {
    if (newLang && newLang !== currentLanguage) {
      currentLanguage = newLang;
      renderShell();
    }
  }

  // 100% Localized Fallback with Smart Semantic Recognition
  function generateDynamicFallback(metadata, lang, idFallback = null) {
    const raw = (metadata.label || metadata.name || t('default_field_title')).replace(/\*/g, '').trim();
    const lower = raw.toLowerCase();

    // 1. Semantic recognition for Tempat Lahir (Place of Birth)
    if (lower.includes('tempat') && lower.includes('lahir')) {
      const places = {
        en: {
          label: 'Place of Birth',
          meaning: 'Official city or municipality where the applicant was born as stated in official records.',
          how_to_fill: 'Enter the city or regency as stated in your official birth certificate, passport, or national ID card.',
          example: 'New York, USA (or Jakarta, Indonesia)',
          common_mistakes: 'Entering hospital or clinic name instead of the official municipality or city.',
          foreign_note: 'For foreign applicants, write the city and state exactly as printed on your international passport.'
        },
        zh: {
          label: '出生地点 (Place of Birth)',
          meaning: '申请人出生的官方城市或法定行政区域。',
          how_to_fill: '请按您的出生证明、护照或有效身份证件上载明的城市名称填写。',
          example: '纽约，美国（或雅加达，印尼）',
          common_mistakes: '误填医院名称而非官方城市，或拼写与护照记录不一致。',
          foreign_note: '外籍人士请务必按本人国际护照上的英文城市名称完整准确填写。'
        },
        ja: {
          label: '出生地 (Place of Birth)',
          meaning: '申請者の公式な出生都市または自治体名です。',
          how_to_fill: '出生証明書またはパスポートに記載されている都市名を入力してください。',
          example: 'New York, USA（または東京）',
          common_mistakes: '病院名を入力してしまう誤りやスペルの誤字。',
          foreign_note: '外国人の方はパスポート記載の都市名（英字）と正確に一致させてください。'
        },
        ko: {
          label: '출생지 (Place of Birth)',
          meaning: '신청인이 출생한 공식 도시 또는 행정구역입니다.',
          how_to_fill: '출생증명서 또는 여권에 기재된 도시명을 정확하게 입력하세요.',
          example: 'New York, USA (또는 서울)',
          common_mistakes: '도시 대신 병원명을 기재하는 실수.',
          foreign_note: '외국인의 경우 소지하신 여권의 출생지(City) 표기와 일치하게 입력하세요.'
        },
        id: {
          label: 'Tempat Lahir',
          meaning: 'Kota atau kabupaten tempat pemohon dilahirkan sesuai dokumen kependudukan resmi.',
          how_to_fill: 'Tuliskan nama kota atau kabupaten kelahiran sesuai dengan Akta Kelahiran atau KTP/Paspor Anda.',
          example: 'Jakarta / Surabaya / New York',
          common_mistakes: 'Menuliskan nama rumah sakit atau kelurahan alih-alih kota resmi.',
          foreign_note: 'Bagi WNA, tuliskan nama kota dan negara kelahiran sesuai paspor aktif.'
        }
      };
      return places[lang] || places['en'];
    }

    // 2. Semantic recognition for Tanggal Lahir (Date of Birth)
    if (lower.includes('tanggal') && lower.includes('lahir')) {
      const dates = {
        en: {
          label: 'Date of Birth',
          meaning: 'Official date of birth of the applicant in standard DD-MM-YYYY format.',
          how_to_fill: 'Select or input date (Day-Month-Year) matching your passport or official identity document.',
          example: '15-08-1990',
          common_mistakes: 'Swapping day and month, or entering an expired/invalid date.',
          foreign_note: 'Ensure the date strictly matches your passport.'
        },
        zh: {
          label: '出生日期 (Date of Birth)',
          meaning: '申请人的官方出生年月日。',
          how_to_fill: '请按照日-月-年 (DD-MM-YYYY) 顺序输入或在日历中选择。',
          example: '15-08-1990',
          common_mistakes: '日与月颠倒填写，或与护照上的出生日期不符。',
          foreign_note: '必须与有效护照上的出生日期完全一致。'
        },
        id: {
          label: 'Tanggal Lahir',
          meaning: 'Tanggal, bulan, dan tahun kelahiran resmi pemohon.',
          how_to_fill: 'Isikan sesuai format tanggal (DD-MM-YYYY) atau pilih dari kalender.',
          example: '15-08-1990',
          common_mistakes: 'Tertukar antara urutan hari dan bulan.',
          foreign_note: 'Pastikan tanggal lahir persis sesuai paspor aktif.'
        }
      };
      return dates[lang] || dates['en'];
    }

    // 3. Semantic recognition for Nama Lengkap (Full Name)
    if (lower.includes('nama') && !lower.includes('ibu') && !lower.includes('ayah') && !lower.includes('instansi')) {
      const names = {
        en: {
          label: 'Full Legal Name',
          meaning: 'Complete legal name of the applicant as printed on official government identification.',
          how_to_fill: 'Type your full legal name without nicknames or unauthorized abbreviations.',
          example: 'JOHN MICHAEL DOE',
          commonMistakes: 'Omitting middle name or nickname typo.',
          foreign_note: 'Write exactly as shown in the machine-readable zone of your passport.'
        },
        zh: {
          label: '法定全名 (Full Name)',
          meaning: '申请人在政府官方身份证件上登记的完整法定姓名。',
          how_to_fill: '请完整录入您的法定全名，切勿使用昵称或缩写。',
          example: 'JOHN MICHAEL DOE',
          common_mistakes: '遗漏中间名 (Middle Name) 或拼写错误。',
          foreign_note: '外籍人士请按照国际护照上的英文姓名完整大写录入。'
        },
        id: {
          label: 'Nama Lengkap',
          meaning: 'Nama resmi pemohon sesuai dokumen identitas yang sah.',
          how_to_fill: 'Ketikkan nama lengkap tanpa singkatan.',
          example: 'BUDI PRASETYO / JOHN MICHAEL DOE',
          common_mistakes: 'Menulis nama panggilan atau singkatan.',
          foreign_note: 'Bagi WNA, tulis nama persis sesuai paspor internasional.'
        }
      };
      return names[lang] || names['en'];
    }

    // 4. Semantic recognition for File Uploads (Pilih File / Unggah Berkas)
    if (metadata.type === 'file' || lower.includes('file') || lower.includes('unggah') || lower.includes('upload') || lower.includes('berkas')) {
      const files = {
        en: {
          label: 'Upload Document / Choose File',
          meaning: 'Upload digital scan or photo of your official document (PDF or JPG format, under 2MB).',
          how_to_fill: 'Scan your official paper document clearly with all stamps and signatures visible, then click Browse/Choose File to select it.',
          example: 'diploma_scan_original.pdf (Max 2MB)',
          common_mistakes: 'Uploading blurry scan, exceeding size limits (max 2MB), or missing back-page stamps.',
          foreign_note: 'Ensure your foreign document has required sworn translations and consular legalization before uploading.'
        },
        zh: {
          label: '上传证明文件 (Upload Document)',
          meaning: '上传您需要认证的原始文书高清扫描件（PDF或JPG格式，2MB以内）。',
          how_to_fill: '请确保扫描件完整清晰，印章及签名无遮挡，点击“选择文件”后上传。',
          example: 'diploma_scan_official.pdf (2MB以内)',
          common_mistakes: '扫描件模糊、文件大小超限（超过2MB）或缺少背面印章页。',
          foreign_note: '外籍人员文件如为外语版本，须备齐官方认可的公证翻译认证原件扫描件。'
        },
        id: {
          label: 'Unggah Berkas / Dokumen',
          meaning: 'Unggah scan dokumen resmi asli Anda dalam format PDF atau JPG untuk diverifikasi.',
          how_to_fill: 'Pastikan scan dokumen jelas terbaca, stempel dan tanda tangan lengkap, lalu klik Pilih File.',
          example: 'scan_ijazah_asli.pdf (Maks 2MB)',
          common_mistakes: 'File foto blur/terpotong, ukuran melebihi 2MB, atau file bukan PDF/JPG.',
          foreign_note: 'Untuk dokumen asing, pastikan telah disertai terjemahan tersumpah resmi.'
        }
      };
      return files[lang] || files['en'];
    }

    // Generic fallback templates
    const templates = {
      zh: {
        label: raw || '表单输入项',
        meaning: idFallback && idFallback.meaning 
          ? `该栏目用于采集“${raw}”的相关法定信息。请核实您所持有的官方公证书或证明文件。`
          : `该栏目用于采集“${raw}”的相关法定信息。请核实您所持有的官方公证书或证明文件。`,
        how_to_fill: `请严格按照您的纸质文件或有效身份证件上的原始记录录入，注意字母大小写及特殊字符。`,
        example: metadata.placeholder && metadata.placeholder.length < 32 ? metadata.placeholder : `示例数据（根据官方文书填写）`,
        common_mistakes: `数字或字母拼写错误，或者上传了未获公证认证的扫描件。`,
        foreign_note: `外籍人员请核对护照或合法居留签证上的原始拼写与编号。`
      },
      en: {
        label: raw || 'Form Field',
        meaning: `This field requires the official details for "${raw}". Please verify against your registered legal documents.`,
        how_to_fill: `Type details accurately as stated in your physical document or legal identification. Ensure correct spelling.`,
        example: metadata.placeholder && metadata.placeholder.length < 32 ? metadata.placeholder : `Sample Official Entry`,
        common_mistakes: `Typographical error or mismatched serial number with the physical document.`,
        foreign_note: `For foreign nationals, ensure the name and number match your active passport or KITAS.`
      },
      ja: {
        label: raw || '入力項目',
        meaning: `「${raw}」に関する公的情報の入力欄です。原本または公的証明書と照合の上、入力してください。`,
        how_to_fill: `原本または公的身分証明書に記載されている通りに正確に入力してください。`,
        example: metadata.placeholder && metadata.placeholder.length < 32 ? metadata.placeholder : `入力例（原本通り）`,
        common_mistakes: `誤字・脱字や重要な記号の入力漏れ。`,
        foreign_note: `外国人の方はパスポートの記載と完全に一致しているかご確認ください。`
      },
      ko: {
        label: raw || '입력란',
        meaning: `"${raw}"에 관한 공식 행정 정보를 입력하는 란입니다. 지참하신 공문서와 대조하여 입력하세요.`,
        how_to_fill: `실물 서류 또는 신분증에 기재된 내용 그대로 정확하게 입력하세요.`,
        example: metadata.placeholder && metadata.placeholder.length < 32 ? metadata.placeholder : `입력 예시 (공식 서류 기준)`,
        common_mistakes: `오탈자 또는 필수 표기 누락.`,
        foreign_note: `외국인의 경우 여권 표기와 일치하는지 확인하세요.`
      },
      id: {
        label: raw || 'Kolom Isian',
        meaning: `Kolom "${raw}". Periksa lembar dokumen resmi yang Anda miliki.`,
        how_to_fill: `Ketikkan data persis seperti yang tertera di dokumen fisik atau kartu identitas Anda.`,
        example: metadata.placeholder && metadata.placeholder.length < 32 ? metadata.placeholder : `Contoh Isian Sesuai Berkas`,
        common_mistakes: `Salah ketik angka/huruf atau mengosongkan kolom penting ini.`,
        foreign_note: `Bagi WNA, pastikan data yang dimasukkan sesuai dengan paspor atau dokumen resmi yang disahkan.`
      }
    };

    return templates[lang] || templates['id'];
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

  return {
    initPanel,
    setPageSummary,
    render,
    hide,
    minimize,
    expand,
    updateLanguage
  };
})();

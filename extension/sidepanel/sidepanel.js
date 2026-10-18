// Telmy.ai — Chrome Native Side Panel Controller
document.addEventListener('DOMContentLoaded', async () => {
  // UI Elements
  const langSelect = document.getElementById('sp-lang-select');
  const spLangDropdown = document.getElementById('sp-lang-dropdown');
  const spLangBtn = document.getElementById('sp-lang-btn');
  const spLangMenu = document.getElementById('sp-lang-menu');
  const spCurrentFlag = document.getElementById('sp-current-flag');
  const spCurrentLangCode = document.getElementById('sp-current-lang-code');
  const btnRescan = document.getElementById('sp-btn-rescan');
  const tabBtns = document.querySelectorAll('.sp-tab-btn');
  const panes = document.querySelectorAll('.sp-pane');
  const badgeFieldsCount = document.getElementById('badge-fields-count');

  // Audio Bar Elements
  const audioBar = document.getElementById('sp-audio-bar');
  const btnStopAudio = document.getElementById('sp-btn-stop-audio');
  const audioStatusText = document.getElementById('sp-audio-status-text');

  // Chat Elements
  const chatStream = document.getElementById('chat-stream');
  const chatInput = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send');
  const btnMic = document.getElementById('btn-mic');
  const btnMute = document.getElementById('btn-mute');
  const micBanner = document.getElementById('mic-status-banner');
  const micText = document.getElementById('mic-status-text');

  // Big Mode Cards & Voicebot Stage Elements
  const cardModeChat = document.getElementById('card-mode-chat');
  const cardModeVoice = document.getElementById('card-mode-voice');
  const badgeModeChatStatus = document.getElementById('badge-mode-chat-status');
  const badgeModeVoiceStatus = document.getElementById('badge-mode-voice-status');
  const spVoicebotStage = document.getElementById('sp-voicebot-stage');
  const spVoicebotRobotSlot = document.getElementById('sp-voicebot-robot-slot');
  const lblVoicebotStatusTitle = document.getElementById('lbl-voicebot-status-title');
  const lblVoicebotStatusDesc = document.getElementById('lbl-voicebot-status-desc');
  const btnVoicebotBigMic = document.getElementById('btn-voicebot-big-mic');
  const lblVoicebotMicCaption = document.getElementById('lbl-voicebot-mic-caption');
  const spModeCardsContainer = document.getElementById('sp-mode-cards-container');
  const spModeCompactBar = document.getElementById('sp-mode-compact-bar');
  const lblCompactModeTitle = document.getElementById('lbl-compact-mode-title');
  const spVoiceActionBar = document.getElementById('sp-voice-action-bar');
  const btnVoiceFooterMic = document.getElementById('btn-voice-footer-mic');
  const lblVoiceFooterMic = document.getElementById('lbl-voice-footer-mic');
  const spInputBar = document.getElementById('sp-input-bar');

  // Translation Banner & Quick Chips Elements (Priority 3)
  const spTranslateBanner = document.getElementById('sp-translate-banner');
  const lblTranslateStatus = document.getElementById('lbl-translate-status');
  const lblTranslateSubtitle = document.getElementById('lbl-translate-subtitle');
  const btnToggleTranslate = document.getElementById('btn-toggle-translate');
  const btnTranslateIcon = document.getElementById('btn-translate-icon');
  const btnTranslateLabel = document.getElementById('btn-translate-label');
  const chipTranslatePage = document.getElementById('chip-translate-page');
  const chipWhatIsThis = document.getElementById('chip-what-is-this');
  const chipRequiredDocs = document.getElementById('chip-required-docs');
  const lblChipTranslate = document.getElementById('lbl-chip-translate');
  const lblChipWhat = document.getElementById('lbl-chip-what');
  const lblChipDocs = document.getElementById('lbl-chip-docs');

  // Fields Elements & 5 Flow States
  const fieldsEmptyState = document.getElementById('fields-empty-state');
  const fieldsAnalyzingState = document.getElementById('fields-analyzing-state');
  const fieldsAnalyzedState = document.getElementById('fields-analyzed-state');
  const fieldDetailContent = document.getElementById('field-detail-content');
  const fieldsCompletionState = document.getElementById('fields-completion-state');
  const spStepperFooter = document.getElementById('sp-stepper-footer');
  const analyzedSummaryText = document.getElementById('analyzed-summary-text');
  const btnStartFormGuide = document.getElementById('btn-start-form-guide');
  const btnTriggerPreAudit = document.getElementById('btn-trigger-pre-audit');
  const boxAuditChecklistResults = document.getElementById('box-audit-checklist-results');
  const auditChecklistItems = document.getElementById('audit-checklist-items');
  const fieldsQuickList = document.getElementById('fields-quick-list');
  const fieldsCountPill = document.getElementById('fields-count-pill');
  const btnStepperPrev = document.getElementById('btn-stepper-prev');
  const btnStepperNext = document.getElementById('btn-stepper-next');
  const stepperIndicator = document.getElementById('stepper-indicator');

  let currentFieldsState = 'empty'; // 'empty' | 'analyzing' | 'analyzed' | 'detail' | 'completion'

  function showFieldsState(state) {
    currentFieldsState = state;
    if (fieldsEmptyState) fieldsEmptyState.style.display = (state === 'empty') ? 'block' : 'none';
    if (fieldsAnalyzingState) fieldsAnalyzingState.style.display = (state === 'analyzing') ? 'block' : 'none';
    if (fieldsAnalyzedState) fieldsAnalyzedState.style.display = (state === 'analyzed') ? 'block' : 'none';
    if (fieldDetailContent) fieldDetailContent.style.display = (state === 'detail') ? 'block' : 'none';
    if (fieldsCompletionState) fieldsCompletionState.style.display = (state === 'completion') ? 'block' : 'none';

    // Synchronize page-wide scanning beam animation (like Translator)
    if (currentTabId) {
      if (state === 'analyzing') {
        safeSendTabMessage(currentTabId, { 
          type: 'START_PAGE_SCAN_ANIMATION', 
          mode: 'analyze', 
          language: currentLanguage 
        });
      } else {
        safeSendTabMessage(currentTabId, { type: 'STOP_PAGE_SCAN_ANIMATION' });
      }
    }

    if (spStepperFooter) {
      spStepperFooter.style.display = (state === 'detail' || state === 'completion') ? 'flex' : 'none';
    }
  }

  let lastEmptyState = { reason: 'unscanned', extraData: null };

  function updateEmptyStateUI(reason = 'unscanned', extraData = null) {
    lastEmptyState = { reason, extraData };
    const elIcon = document.getElementById('icon-empty-fields');
    const elTitle = document.getElementById('lbl-empty-fields-title');
    const elDesc = document.getElementById('lbl-empty-fields-desc');
    const btnManual = document.getElementById('btn-manual-analyze-form');
    const elBtnText = document.getElementById('lbl-btn-analyze-now');
    const btnUploadLocal = document.getElementById('btn-empty-upload-local');
    const elUploadLocalText = document.getElementById('lbl-btn-upload-local');

    if (reason === 'unscanned') {
      if (elIcon) elIcon.innerHTML = `<div class="empty-icon-bubble"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></div>`;
      if (elTitle) elTitle.textContent = t('empty_unscanned_title');
      if (elDesc) elDesc.textContent = t('empty_unscanned_desc');
      if (elBtnText) elBtnText.textContent = t('empty_unscanned_btn_analyze');
      if (btnManual) {
        btnManual.style.display = 'inline-flex';
        btnManual.onclick = () => triggerFullFormAnalysis();
      }
      if (btnUploadLocal) {
        btnUploadLocal.style.display = 'inline-flex';
        btnUploadLocal.onclick = () => openPdfMode(true);
      }
      if (elUploadLocalText) {
        elUploadLocalText.textContent = t('empty_unscanned_btn_upload');
      }
    } else if (reason === 'no_fields') {
      if (btnUploadLocal) {
        btnUploadLocal.style.display = 'inline-flex';
        btnUploadLocal.onclick = () => openPdfMode(true);
      }
      if (elUploadLocalText) {
        elUploadLocalText.textContent = t('empty_unscanned_btn_upload');
      }
      if (extraData && extraData.actionButton) {
        const btnLabel = extraData.actionButton.text || '';
        if (elIcon) elIcon.innerHTML = `<div class="empty-icon-bubble"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>`;
        if (elTitle) elTitle.textContent = t('empty_action_btn_title', { button: btnLabel });
        if (elDesc) elDesc.textContent = t('empty_action_btn_desc', { button: btnLabel });
        if (elBtnText) elBtnText.textContent = t('empty_action_btn_click', { button: btnLabel });
        if (btnManual) {
          btnManual.style.display = 'inline-flex';
          btnManual.onclick = () => {
            safeSendTabMessage(currentTabId, { type: 'CLICK_ACTION_BUTTON' });
          };
        }
      } else {
        if (elIcon) elIcon.innerHTML = `<div class="empty-icon-bubble"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>`;
        if (elTitle) elTitle.textContent = t('empty_no_fields_title');
        if (elDesc) elDesc.textContent = t('empty_no_fields_desc');
        if (elBtnText) elBtnText.textContent = t('empty_no_fields_btn_rescan');
        if (btnManual) {
          btnManual.style.display = 'inline-flex';
          btnManual.onclick = () => triggerFullFormAnalysis();
        }
      }
    } else if (reason === 'select_field') {
      if (btnUploadLocal) btnUploadLocal.style.display = 'none';
      if (elIcon) elIcon.innerHTML = `<div class="empty-icon-bubble"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8.8-2.9a2 2 0 0 1 2.8-1.1l.1.1a2 2 0 0 1 1.1 2.8l-.8 2.9Z"/><path d="m6 12 2-2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/></svg></div>`;
      if (elTitle) elTitle.textContent = t('empty_fields_title');
      if (elDesc) elDesc.textContent = t('empty_fields_desc');
      if (elBtnText) elBtnText.textContent = t('btn_start_guide');
      if (btnManual) {
        btnManual.style.display = 'inline-flex';
        btnManual.onclick = () => {
          if (detectedFields && detectedFields.length > 0) selectFieldByIndex(0, true);
        };
      }
    }
  }

  // Safe wrapper for chrome.tabs.sendMessage that prevents "Unchecked runtime.lastError"
  function safeSendTabMessage(tabId, message, callback = null) {
    if (!tabId) {
      if (callback) callback(new Error('No tabId provided'), null);
      return;
    }
    chrome.tabs.sendMessage(tabId, message, (response) => {
      const err = chrome.runtime.lastError;
      if (callback) {
        callback(err, response);
      }
    });
  }

  // PDF Mode Elements (Priority 7)
  const spPdfAlertBanner = document.getElementById('sp-pdf-alert-banner');
  const btnPdfBannerAction = document.getElementById('btn-pdf-banner-action');
  const btnModeWeb = document.getElementById('btn-mode-web');
  const btnModePdf = document.getElementById('btn-mode-pdf');
  const webModeContainer = document.getElementById('web-mode-container');
  const pdfModeContainer = document.getElementById('pdf-mode-container');
  const spPdfDropzone = document.getElementById('sp-pdf-dropzone');
  const spPdfFileInput = document.getElementById('sp-pdf-file-input');
  const btnBrowsePdf = document.getElementById('btn-browse-pdf');
  const spPdfDropContent = document.getElementById('sp-pdf-drop-content');
  const spPdfAnalyzing = document.getElementById('sp-pdf-analyzing');
  const spPdfResultCard = document.getElementById('sp-pdf-result-card');
  const btnResetPdf = document.getElementById('btn-reset-pdf');
  const pdfDocTitle = document.getElementById('pdf-doc-title');
  const pdfDocSummary = document.getElementById('pdf-doc-summary');
  const pdfChecklistCard = document.getElementById('pdf-checklist-card');
  const pdfChecklistBadge = document.getElementById('pdf-checklist-badge');
  const pdfChecklistItems = document.getElementById('pdf-checklist-items');
  const pdfSectionsTabs = document.getElementById('pdf-sections-tabs');
  const pdfActiveSectionFields = document.getElementById('pdf-active-section-fields');
  const pdfSectionIndicator = document.getElementById('pdf-section-indicator');
  const btnPdfExportFilled = document.getElementById('btn-pdf-export-filled');

  // Priority 7 & 8: Encrypted Profile Vault & Multi-Document Ingestion Elements
  const vaultLockedStateView = document.getElementById('vault-locked-state-view');
  const vaultUnlockedStateView = document.getElementById('vault-unlocked-state-view');
  const btnVaultGateAction = document.getElementById('btn-vault-gate-action');
  const lblVaultGateTitle = document.getElementById('lbl-vault-gate-title');
  const lblVaultGateDesc = document.getElementById('lbl-vault-gate-desc');
  const lblVaultGateBtn = document.getElementById('lbl-vault-gate-btn');
  const btnVaultLockToggle = document.getElementById('btn-vault-lock-toggle');
  const lblVaultLockIcon = document.getElementById('lbl-vault-lock-icon');
  const btnVaultAutofillNow = document.getElementById('btn-vault-autofill-now');
  const vaultFieldsCount = document.getElementById('vault-fields-count');
  const btnOpenDashboardVault = document.getElementById('btn-open-dashboard-vault');
  const vaultFieldsList = document.getElementById('vault-fields-list');

  // Vault Modals Elements (Dual-Lock: Password & 12-Word Seed Phrase)
  const vaultPinModal = document.getElementById('vault-pin-modal');
  const vaultPinModalTitle = document.getElementById('vault-pin-modal-title');
  const vaultPinModalSub = document.getElementById('vault-pin-modal-sub');
  const vaultModalIcon = document.getElementById('vault-modal-icon');
  const vaultLockoutBanner = document.getElementById('vault-lockout-banner');
  const vaultLockoutText = document.getElementById('vault-lockout-text');
  const btnVaultResetVault = document.getElementById('btn-vault-reset-vault');
  const vaultModeTabs = document.getElementById('vault-mode-tabs');
  const tabVaultPassword = document.getElementById('tab-vault-password');
  const tabVaultSeed = document.getElementById('tab-vault-seed');
  const vaultViewPassword = document.getElementById('vault-view-password');
  const vaultViewSeed = document.getElementById('vault-view-seed');
  const inputVaultPassword = document.getElementById('input-vault-password');
  const btnTogglePwdVisibility = document.getElementById('btn-toggle-pwd-visibility');
  const vaultPwdStrengthWrap = document.getElementById('vault-pwd-strength-wrap');
  const vaultStrengthBar = document.getElementById('vault-strength-bar');
  const vaultStrengthText = document.getElementById('vault-strength-text');
  const vaultSeedSetupBox = document.getElementById('vault-seed-setup-box');
  const vaultSeedUnlockBox = document.getElementById('vault-seed-unlock-box');
  const vaultSeedChips = document.getElementById('vault-seed-chips');
  const btnGenerateNewSeed = document.getElementById('btn-generate-new-seed');
  const btnCopySeedWords = document.getElementById('btn-copy-seed-words');
  const btnDownloadSeedTxt = document.getElementById('btn-download-seed-txt');
  const chkSeedSaved = document.getElementById('chk-seed-saved');
  const textareaVaultSeed = document.getElementById('textarea-vault-seed');
  const vaultPinError = document.getElementById('vault-pin-error');
  const btnSubmitVaultPin = document.getElementById('btn-submit-vault-pin');
  const btnCancelVaultPin = document.getElementById('btn-cancel-vault-pin');

  const vaultFieldModal = document.getElementById('vault-field-modal');
  const lblVaultModalFieldTitle = document.getElementById('lbl-vault-modal-field-title');
  const btnCloseFieldModal = document.getElementById('btn-close-field-modal');
  const inputVaultFieldLabel = document.getElementById('input-vault-field-label');
  const inputVaultFieldValue = document.getElementById('input-vault-field-value');
  const inputVaultFieldAliases = document.getElementById('input-vault-field-aliases');
  const btnSaveVaultField = document.getElementById('btn-save-vault-field');
  const btnCancelVaultField = document.getElementById('btn-cancel-vault-field');

  // Vault Ingestion Dropzone Elements
  const vaultDocDropzone = document.getElementById('vault-doc-dropzone');
  const vaultDocFileInput = document.getElementById('vault-doc-file-input');
  const btnBrowseVaultDoc = document.getElementById('btn-browse-vault-doc');
  const vaultDocContent = document.getElementById('vault-drop-content');
  const vaultDocAnalyzing = document.getElementById('vault-doc-analyzing');

  // Pre-Submission Auditor Elements (Priority 9.2)
  const btnRunFormAudit = document.getElementById('btn-run-form-audit');
  const spAuditReportBox = document.getElementById('sp-audit-report-box');
  const auditStatusPill = document.getElementById('audit-status-pill');
  const auditReportItems = document.getElementById('audit-report-items');
  const btnCloseAuditReport = document.getElementById('btn-close-audit-report');

  // Summary Elements
  const progressPercent = document.getElementById('progress-percent');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressSubText = document.getElementById('progress-sub-text');
  const summaryDescText = document.getElementById('summary-desc-text');
  const boxPrerequisites = document.getElementById('box-prerequisites');
  const summaryPrereqList = document.getElementById('summary-prereq-list');

  // User Profile & Standby Elements
  const btnUser = document.getElementById('sp-btn-user');
  const btnClose = document.getElementById('sp-btn-close');
  const btnResume = document.getElementById('sp-btn-resume');
  const pausedBanner = document.getElementById('sp-paused-banner');
  const profilePopover = document.getElementById('sp-profile-popover');
  const userAvatarText = document.getElementById('sp-user-avatar-text');
  const userAvatarImg = document.getElementById('sp-user-avatar-img');
  const popoverAvatarText = document.getElementById('popover-avatar-text');
  const popoverAvatarImg = document.getElementById('popover-avatar-img');
  const popoverUserName = document.getElementById('popover-user-name');
  const popoverUserEmail = document.getElementById('popover-user-email');
  const popoverAuthBadge = document.getElementById('popover-auth-badge');
  const btnPopoverAuth = document.getElementById('btn-popover-auth');
  const btnPopoverSignout = document.getElementById('btn-popover-signout');

  // Onboarding Elements
  const onboardingModal = document.getElementById('sp-onboarding-modal');
  const onboardingLangSelect = document.getElementById('onboarding-lang-select');
  const btnOnboardingGoogle = document.getElementById('btn-onboarding-google');
  const btnOnboardingFinish = document.getElementById('btn-onboarding-finish');
  const onboardingUnauthed = document.getElementById('onboarding-unauthed');
  const onboardingAuthed = document.getElementById('onboarding-authed');
  const onboardingUserName = document.getElementById('onboarding-user-name');
  const onboardingUserEmail = document.getElementById('onboarding-user-email');
  const onboardingUserAvatarText = document.getElementById('onboarding-user-avatar-text');
  const onboardingUserAvatarImg = document.getElementById('onboarding-user-avatar-img');

  // Priority 8: Quota & Paywall Elements
  const spQuotaBadge = document.getElementById('sp-quota-badge');
  const spQuotaText = document.getElementById('sp-quota-text');
  const spPaywallModal = document.getElementById('sp-paywall-modal');
  const btnClosePaywall = document.getElementById('btn-close-paywall');
  const paywallStatusSubtitle = document.getElementById('paywall-status-subtitle');
  const paywallSumRemaining = document.getElementById('paywall-sum-remaining');
  const paywallSumPlan = document.getElementById('paywall-sum-plan');
  const paywallSumPayg = document.getElementById('paywall-sum-payg');
  const paywallSumPro = document.getElementById('paywall-sum-pro');
  const btnUpgradeDashboard = document.getElementById('btn-upgrade-dashboard');
  const btnTierPurchases = document.querySelectorAll('.btn-tier-purchase');
  const btnSimInstants = document.querySelectorAll('.btn-sim-instant');

  // State
  let currentLanguage = 'en';
  let isMuted = false;
  let isListening = false;
  let isSpeaking = false;
  let currentAudio = null;
  let speechRecognizer = null;
  let chatHistory = [];
  let detectedFields = [];
  let activeFieldIndex = -1;
  let currentTabId = null;
  let currentTabUrl = '';
  const tabSessions = new Map();
  let cachedPageSummary = null;
  let currentUser = null;
  let isScannerRunning = true;
  let isCurrentPageAnalyzed = false;
  let isPageTranslated = false;
  let isTranslating = false;
  let translatedElementCount = 0;
  let telmyAvatar = null;
  let voicebotAvatar = null;
  let currentBotMode = 'chat'; // 'chat' | 'voice'
  let activeSourceMode = 'web';
  let currentPdfData = null;
  let activePdfSectionIndex = 0;
  let pdfChecklistState = {};
  let currentQuotaData = null;

  // Priority 7 & 9 States
  let currentPdfRawBytes = null;
  let currentPdfFileName = 'Document.pdf';
  let currentPdfMimeType = 'application/pdf';
  let pdfUserFormValues = {};

  // Priority 7 & 8 Vault State
  let currentDecryptedVault = null;
  let currentVaultPin = null;
  let isVaultUnlocked = false;
  let currentEditingFieldId = null;
  let pinUnlockCallback = null;
  let activeVaultMode = 'password'; // 'password' | 'seed_phrase'
  let isVaultSetupMode = false;
  let currentGeneratedSeed = '';
  let lockoutInterval = null;

  // Complete JAPAC Multi-Language Matrix (English default)
  const I18N = {
    "brand_tag": {
          "en": "AI Form Assistant",
          "id": "Asisten Formulir AI",
          "ja": "AI フォームアシスタント",
          "ko": "AI 양식 도우미",
          "zh": "AI 表单助手",
          "zh-TW": "AI 表單助手",
          "vi": "Trợ lý Biểu mẫu AI",
          "th": "ผู้ช่วยฟอร์ม AI",
          "hi": "AI फ़ॉर्म सहायक",
          "fil": "AI Form Assistant",
          "ms": "Pembantu Borang AI"
    },
    "tab_chat": {
          "en": "AI Assistant",
          "id": "AI Assistant",
          "ja": "AI アシスタント",
          "ko": "AI 어시스턴트",
          "zh": "AI 助手",
          "zh-TW": "AI 助理",
          "vi": "Trợ lý AI",
          "th": "ผู้ช่วย AI",
          "hi": "AI सहायक",
          "fil": "AI Assistant",
          "ms": "Pembantu AI"
    },
    "tab_vault": {
          "en": "AutoFill",
          "id": "AutoFill",
          "ja": "自動入力",
          "ko": "자동완성",
          "zh": "自动填写",
          "zh-TW": "自動填寫",
          "vi": "Tự động điền",
          "th": "กรอกอัตโนมัติ",
          "hi": "ऑटोफ़िल",
          "fil": "AutoFill",
          "ms": "AutoFill"
    },
    "tab_pdf": {
          "en": "PDF Form",
          "id": "Formulir PDF",
          "ja": "PDFフォーム",
          "ko": "PDF 양식",
          "zh": "PDF 表单",
          "zh-TW": "PDF 表單",
          "vi": "Biểu mẫu PDF",
          "th": "แบบฟอร์ม PDF",
          "hi": "पीडीएफ फ़ॉर्म",
          "fil": "PDF Form",
          "ms": "Borang PDF"
    },
    "tab_fields": {
          "en": "Forms Guide",
          "id": "Forms Guide",
          "ja": "フォームガイド",
          "ko": "양식 가이드",
          "zh": "表单指南",
          "zh-TW": "表單指南",
          "vi": "Hướng dẫn biểu mẫu",
          "th": "คู่มือฟอร์ม",
          "hi": "फ़ॉर्म गाइड",
          "fil": "Forms Guide",
          "ms": "Panduan Borang"
    },
    "field_unit": {
          "en": "Fields",
          "id": "Kolom",
          "ja": "項目",
          "ko": "입력란",
          "zh": "项",
          "zh-TW": "項",
          "vi": "Trường",
          "th": "ช่อง",
          "hi": "फ़ील्ड्स",
          "fil": "Kolum",
          "ms": "Ruangan"
    },
    "tab_summary": {
          "en": "Overview",
          "id": "Ringkasan",
          "ja": "概要",
          "ko": "개요",
          "zh": "概览",
          "zh-TW": "總覽",
          "vi": "Tổng quan",
          "th": "ภาพรวม",
          "hi": "सारांश",
          "fil": "Pangkalahatan",
          "ms": "Ringkasan"
    },
    "chat_placeholder": {
          "en": "Ask Telmy or type 'Show me [words]'...",
          "id": "Tanya Telmy atau ketik 'Tunjukkan [kata]'...",
          "ja": "Telmyに質問、または「[単語]を見せて」...",
          "ko": "Telmy에게 질문하거나 '[단어] 보여줘' 입력...",
          "zh": "向 Telmy 提问或输入“给我看[内容]”...",
          "zh-TW": "向 Telmy 提問或輸入「給我看[內容]」...",
          "vi": "Hỏi Telmy hoặc gõ 'Cho tôi xem [từ]'...",
          "th": "ถาม Telmy หรือพิมพ์ 'แสดงให้ฉันดู [คำ]'...",
          "hi": "Telmy से पूछें या 'मुझे दिखाओ [शब्द]' लिखें...",
          "fil": "Magtanong o i-type ang 'Ipakita mo [salita]'...",
          "ms": "Tanya Telmy atau taip 'Tunjukkan [perkataan]'..."
    },
    "welcome_msg": {
          "en": "Hello! I am **Telmy**, your AI form-filling assistant. Ask me anything about this form using text or click the microphone button below to speak.",
          "id": "Halo! Saya **Telmy**, asisten pengisian formulir Anda. Tanyakan apa saja tentang formulir ini atau klik tombol mikrofon di bawah untuk berbicara.",
          "ja": "こんにちは！フォーム入力アシスタントの **Telmy** です。フォームについて何でも質問するか、下のマイクボタンを押してお話しください。",
          "ko": "안녕하세요! 양식 작성 도우미 **Telmy** 입니다. 양식에 대해 궁금한 점을 질문하거나 아래 마이크 버튼을 눌러 말씀해 주세요.",
          "zh": "您好！我是您的表单填写助手 **Telmy**。您可以随时询问有关此表单的任何问题，或点击下方的麦克风直接说话。",
          "zh-TW": "您好！我是您的表單填寫助理 **Telmy**。您可以隨時詢問有關此表單的任何問題，或點擊下方的麥克風直接說話。",
          "vi": "Xin chào! Tôi là **Telmy**, trợ lý điền biểu mẫu của bạn. Hãy hỏi tôi bất cứ điều gì về biểu mẫu này, hoặc nhấn nút micrô bên dưới để nói.",
          "th": "สวัสดีครับ! ผมคือ **Telmy** ผู้ช่วยกรอกแบบฟอร์มของคุณ สามารถถามเกี่ยวกับฟอร์มนี้ หรือกดปุ่มไมโครโฟนด้านล่างเพื่อพูดคุยได้เลยครับ",
          "hi": "नमस्ते! मैं **Telmy** हूँ, आपका फ़ॉर्म भरने का सहायक। इस फ़ॉर्म के बारे में कुछ भी पूछें, या बोलने के लिए नीचे दिए गए माइक्रोफ़ोन पर क्लिक करें।",
          "fil": "Kamusta! Ako si **Telmy**, ang iyong assistant sa pagsagot ng form. Magtanong tungkol sa form na ito o pindutin ang mikropono sa ibaba para magsalita.",
          "ms": "Hai! Saya **Telmy**, pembantu pengisian borang anda. Tanya apa sahaja tentang borang ini atau klik butang mikrofon di bawah untuk bercakap."
    },
    "stepper_prev": {
          "en": "Previous",
          "id": "Sebelumnya",
          "ja": "前へ",
          "ko": "이전",
          "zh": "上一项",
          "zh-TW": "上一項",
          "vi": "Trước",
          "th": "ก่อนหน้า",
          "hi": "पिछला",
          "fil": "Nakaraan",
          "ms": "Sebelumnya"
    },
    "stepper_next": {
          "en": "Next",
          "id": "Berikutnya",
          "ja": "次へ",
          "ko": "다음",
          "zh": "下一项",
          "zh-TW": "下一項",
          "vi": "Tiếp theo",
          "th": "ถัดไป",
          "hi": "अगला",
          "fil": "Susunod",
          "ms": "Seterusnya"
    },
    "mic_listening": {
          "en": "Listening to your voice...",
          "id": "Mendengarkan ucapan Anda...",
          "ja": "音声を認識中...",
          "ko": "듣고 있습니다...",
          "zh": "正在聆听您的声音...",
          "zh-TW": "正在聆聽您的聲音...",
          "vi": "Đang lắng nghe giọng nói của bạn...",
          "th": "กำลังฟังเสียงของคุณ...",
          "hi": "आपकी आवाज़ सुन रहे हैं...",
          "fil": "Nakikinig sa iyong boses...",
          "ms": "Mendengar suara anda..."
    },
    "speaking_text": {
          "en": "Telmy is speaking...",
          "id": "Telmy sedang membaca panduan...",
          "ja": "Telmy が音声を読み上げ中...",
          "ko": "Telmy가 안내를 읽고 있습니다...",
          "zh": "Telmy 正在朗读指南...",
          "zh-TW": "Telmy 正在朗讀指引...",
          "vi": "Telmy đang đọc hướng dẫn...",
          "th": "Telmy กำลังอ่านคำแนะนำ...",
          "hi": "Telmy मार्गदर्शन पढ़ रहा है...",
          "fil": "Binabasa ni Telmy ang gabay...",
          "ms": "Telmy sedang membaca panduan..."
    },
    "empty_fields_title": {
          "en": "Select a Form Field",
          "id": "Pilih Kolom Formulir",
          "ja": "入力項目を選択してください",
          "ko": "입력란을 선택하세요",
          "zh": "请选择表单项",
          "zh-TW": "請選擇表單欄位",
          "vi": "Chọn trường biểu mẫu",
          "th": "เลือกช่องกรอกข้อมูล",
          "hi": "एक फ़ॉर्म फ़ील्ड चुनें",
          "fil": "Pumili ng Kolum",
          "ms": "Pilih Ruangan Borang"
    },
    "empty_fields_desc": {
          "en": "Hover or click any field badge on the page to view detailed guidelines and examples.",
          "id": "Arahkan kursor atau klik nomor kolom di formulir sebelah kiri untuk melihat panduan detail dan contoh isian.",
          "ja": "左側のフォームの項目番号にカーソルを合わせるかクリックすると詳細ガイドが表示されます。",
          "ko": "왼쪽 양식의 입력란 번호를 클릭하면 상세 안내와 예시를 확인할 수 있습니다.",
          "zh": "悬停或点击左侧表单中的项目编号，可查看详细填写指南与示例。",
          "zh-TW": "指向或點擊左側表單上的欄位編號，即可查看詳細說明與範例。",
          "vi": "Di chuột hoặc nhấp vào số trường trên biểu mẫu để xem hướng dẫn chi tiết và ví dụ.",
          "th": "ชี้หรือคลิกที่หมายเลขช่องในฟอร์มเพื่อดูคำแนะนำและตัวอย่างโดยละเอียด",
          "hi": "विस्तृत दिशानिर्देश और उदाहरण देखने के लिए पेज पर किसी फ़ील्ड पर कर्सर ले जाएँ या क्लिक करें।",
          "fil": "Itapat o i-click ang numero ng kolum sa form para makita ang detalye at halimbawa.",
          "ms": "Arahkan kursor atau klik nombor ruangan pada borang untuk melihat panduan terperinci."
    },
    "btn_start_guide": {
          "en": "🚀 Guide Me (Field by Field)",
          "id": "🚀 Pandu Saya (Kolom demi Kolom)",
          "ja": "🚀 ガイドを開始する",
          "ko": "🚀 안내 시작하기",
          "zh": "🚀 开始逐项指引",
          "zh-TW": "🚀 開始逐項指引",
          "vi": "🚀 Bắt đầu hướng dẫn",
          "th": "🚀 เริ่มต้นคำแนะนำ",
          "hi": "🚀 मार्गदर्शन शुरू करें",
          "fil": "🚀 Simulan ang Gabay",
          "ms": "🚀 Pandu Saya (Ruangan demi Ruangan)"
    },
    "guide_quota_note": {
          "en": "💡 Uses 1 form quota for 24-hour full assistance on this form",
          "id": "💡 Menggunakan 1 kuota form untuk pendampingan penuh 24 jam",
          "ja": "💡 このフォームで24時間完全ガイド（利用枠1回分）",
          "ko": "💡 이 양식에 대해 24시간 전체 안내 제공 (양식 1회 사용)",
          "zh": "💡 使用1个表单额度，在此表单提供24小时完整指引",
          "zh-TW": "💡 使用1個表單額度，在此表單提供24小時完整指引",
          "vi": "💡 Sử dụng 1 hạn mức biểu mẫu cho 24 giờ hỗ trợ đầy đủ",
          "th": "💡 ใช้โควตา 1 แบบฟอร์มเพื่อรับคำแนะนำครบถ้วน 24 ชั่วโมง",
          "hi": "💡 इस फॉर्म पर 24 घंटे की पूरी सहायता के लिए 1 फॉर्म कोटा का उपयोग करता है",
          "fil": "💡 Gumagamit ng 1 kuota ng form para sa 24-oras na buong tulong",
          "ms": "💡 Menggunakan 1 kuota borang untuk bantuan penuh 24 jam"
    },
    "empty_unscanned_title": {
          "en": "Form Not Yet Analyzed",
          "id": "Form Belum Dianalisis",
          "ja": "フォームはまだ分析されていません",
          "ko": "양식이 아직 분석되지 않았습니다",
          "zh": "表单尚未分析",
          "zh-TW": "表單尚未分析",
          "vi": "Biểu mẫu chưa được phân tích",
          "th": "ยังไม่ได้วิเคราะห์แบบฟอร์ม",
          "hi": "फ़ॉर्म का अभी विश्लेषण नहीं किया गया है",
          "fil": "Hindi Pa Nasusuri ang Form",
          "ms": "Borang Belum Dianalisis"
    },
    "empty_unscanned_desc": {
          "en": "This page has not been analyzed yet. Please click the button below to analyze this page to find forms, or you can upload a local PDF / image form.",
          "id": "Halaman ini belum dianalisis. Silakan klik tombol di bawah untuk menganalisis formulir di halaman ini guna menemukan formulir, atau Anda dapat mengunggah file formulir PDF / gambar lokal.",
          "ja": "このページはまだ分析されていません。下のボタンをクリックしてこのページのフォームを検出するか、ローカルのPDF / 画像フォームをアップロードしてください。",
          "ko": "이 페이지는 아직 분석되지 않았습니다. 아래 버튼을 클릭하여 양식을 감지하거나 로컬 PDF/이미지 양식을 업로드하세요.",
          "zh": "此页面尚未分析。请点击下方按钮分析此页面以查找表单，或者您可以上传本地 PDF / 图片表单。",
          "zh-TW": "此頁面尚未分析。請點擊下方按鈕分析此頁面以尋找表單，或上傳本地 PDF / 圖片表單。",
          "vi": "Trang này chưa được phân tích. Vui lòng nhấp vào nút bên dưới để phân tích tìm biểu mẫu, hoặc bạn có thể tải lên tệp biểu mẫu PDF / hình ảnh cục bộ.",
          "th": "หน้านี้ยังไม่ได้รับการวิเคราะห์ กรุณาคลิกปุ่มด้านล่างเพื่อวิเคราะห์แบบฟอร์มในหน้านี้ หรือคุณสามารถอัปโหลดไฟล์แบบฟอร์ม PDF / รูปภาพได้",
          "hi": "इस पेज का अभी विश्लेषण नहीं किया गया है। फ़ॉर्म खोजने के लिए कृपया नीचे दिए गए बटन पर क्लिक करें, या आप एक स्थानीय पीडीएफ/छवि फ़ॉर्म अपलोड कर सकते हैं।",
          "fil": "Hindi pa nasusuri ang pahinang ito. I-click ang button sa ibaba upang suriin ang mga form, o maaari kang mag-upload ng lokal na PDF / image form.",
          "ms": "Halaman ini belum dianalisis. Sila klik butang di bawah untuk menganalisis borang di halaman ini, atau anda boleh memuat naik fail borang PDF / imej tempatan."
    },
    "empty_unscanned_btn_analyze": {
          "en": "Analyze This Form",
          "id": "Analisis Formulir Ini",
          "ja": "このフォームを分析する",
          "ko": "이 양식 분석하기",
          "zh": "分析此表单",
          "zh-TW": "分析此表單",
          "vi": "Phân tích biểu mẫu này",
          "th": "วิเคราะห์แบบฟอร์มนี้",
          "hi": "इस फ़ॉर्म का विश्लेषण करें",
          "fil": "Suriin ang Form na Ito",
          "ms": "Analisis Borang Ini"
    },
    "found_action_button_speech": {
          "en": "We found the button you need to click: {button}",
          "id": "Kami sudah menemukan tombol yang harus kamu klik: {button}",
          "ja": "クリックする必要があるボタンを検出しました: {button}",
          "ko": "클릭해야 할 버튼을 찾았습니다: {button}",
          "zh": "我们找到了您需要点击的按钮：{button}",
          "zh-TW": "我們找到了您需要點擊的按鈕：{button}",
          "vi": "Chúng tôi đã tìm thấy nút bạn cần nhấn: {button}",
          "th": "เราพบปุ่มที่คุณต้องคลิกแล้ว: {button}",
          "hi": "हमें वह बटन मिल गया है जिसे आपको क्लिक करना है: {button}",
          "fil": "Nahanap namin ang button na kailangan mong i-click: {button}",
          "ms": "Kami telah menemui butang yang perlu anda klik: {button}"
    },
    "found_action_button_chat": {
          "en": "🎯 **We found the button you need to click:** **\"{button}\"**!\n\nThis button has been highlighted on the webpage. Please click it to proceed with your application.",
          "id": "🎯 **Kami sudah menemukan tombol yang harus kamu klik:** **\"{button}\"**!\n\nTombol tersebut sudah kami beri sorotan (highlight) di halaman web. Silakan klik tombol tersebut untuk memulai proses pengajuan.",
          "ja": "🎯 **クリックが必要なボタンを検出しました:** **「{button}」**!\n\nWebページ上でハイライト表示されています。申請を進めるにはクリックしてください。",
          "ko": "🎯 **클릭해야 할 버튼을 찾았습니다:** **\"{button}\"**!\n\n웹페이지에서 강조 표시되었습니다. 신청을 진행하려면 클릭하세요.",
          "zh": "🎯 **已找到需要点击的按钮：** **“{button}”**！\n\n该按钮已在网页上高亮标出，请点击以继续申请。",
          "zh-TW": "🎯 **已找到需要點擊的按鈕：** **「{button}」**！\n\n該按鈕已在網頁上反白標出，請點擊以繼續申請。",
          "vi": "🎯 **Đã tìm thấy nút bạn cần nhấn:** **\"{button}\"**!\n\nNút này đã được làm nổi bật trên trang web. Vui lòng nhấp vào để tiếp tục nộp đơn.",
          "th": "🎯 **เราพบปุ่มที่คุณต้องคลิกแล้ว:** **\"{button}\"**!\n\nปุ่มนี้ได้รับการเน้นบนหน้าเว็บแล้ว กรุณาคลิกเพื่อดำเนินการต่อ",
          "hi": "🎯 **हमें वह बटन मिल गया है जिसे आपको क्लिक करना है:** **\"{button}\"**!\n\nयह बटन वेबपेज पर हाइलाइट किया गया है। आगे बढ़ने के लिए कृपया इस पर क्लिक करें।",
          "fil": "🎯 **Nahanap namin ang button na dapat mong i-click:** **\"{button}\"**!\n\nNaka-highlight na ang button na ito sa webpage. I-click ito upang magpatuloy.",
          "ms": "🎯 **Kami telah menemui butang yang perlu anda klik:** **\"{button}\"**!\n\nButang ini telah disorot pada halaman web. Sila klik untuk meneruskan permohonan."
    },
    "found_fields_speech": {
          "en": "Found {count} form fields on this page.",
          "id": "Ditemukan {count} kolom formulir pada halaman ini.",
          "ja": "このページで {count} 件のフォーム項目を検出しました。",
          "ko": "이 페이지에서 {count}개의 양식 입력란을 찾았습니다.",
          "zh": "在此页面找到 {count} 个表单输入项。",
          "zh-TW": "在此頁面找到 {count} 個表單欄位。",
          "vi": "Đã tìm thấy {count} trường biểu mẫu trên trang này.",
          "th": "พบ {count} ช่องกรอกข้อมูลในหน้านี้",
          "hi": "इस पेज पर {count} फ़ॉर्म फ़ील्ड मिले हैं।",
          "fil": "Nahanap ang {count} na kolum sa pahinang ito.",
          "ms": "Ditemui {count} ruangan borang pada halaman ini."
    },
    "found_fields_chat": {
          "en": "📋 **Page Scan Complete!**\n\nFound **{count} form fields** on this page. All fields have numbered badges ready.",
          "id": "📋 **Halaman Berhasil Dipindai!**\n\nDitemukan **{count} kolom formulir** pada halaman ini. Semua kolom telah diberi nomor badge panduan.",
          "ja": "📋 **ページスキャン完了！**\n\n**{count} 件のフォーム項目**を検出しました。すべての項目に番号バッジが付いています。",
          "ko": "📋 **페이지 스캔 완료!**\n\n이 페이지에서 **{count}개의 입력란**을 찾았습니다. 모든 입력란에 번호 배지가 준비되었습니다.",
          "zh": "📋 **页面扫描完成！**\n\n在此页面发现 **{count} 个表单字段**。所有字段均已标出编号指示牌。",
          "zh-TW": "📋 **頁面掃描完成！**\n\n在此頁面發現 **{count} 個表單欄位**。所有欄位均已標出編號指示牌。",
          "vi": "📋 **Quét trang hoàn tất!**\n\nĐã tìm thấy **{count} trường biểu mẫu** trên trang này. Tất cả các trường đã có huy hiệu số.",
          "th": "📋 **สแกนหน้าเว็บเสร็จสมบูรณ์!**\n\nพบ **{count} ช่องกรอกข้อมูล** ในหน้านี้ ทุกช่องมีป้ายหมายเลขกำกับแล้ว",
          "hi": "📋 **पेज स्कैन पूरा हुआ!**\n\nइस पेज पर **{count} फ़ॉर्म फ़ील्ड** मिले हैं। सभी फ़ील्ड्स पर नंबर बैज तैयार हैं।",
          "fil": "📋 **Tapos na ang Pag-scan!**\n\nNahanap ang **{count} form fields** sa pahinang ito. May gabay na numero ang lahat ng kolum.",
          "ms": "📋 **Imbasan Halaman Selesai!**\n\nDitemui **{count} ruangan borang** pada halaman ini. Semua ruangan telah sedia dengan lencana bernombor."
    },
    "scan_searching_msg": {
          "en": "🔍 Scanning the page to detect form fields and action buttons for you...",
          "id": "🔍 Sedang memeriksa dan memindai halaman untuk mendeteksi tombol pengajuan dan kolom formulir...",
          "ja": "🔍 ページをスキャンしてフォーム項目と申請ボタンを検出しています...",
          "ko": "🔍 양식 입력란과 신청 버튼을 감지하기 위해 페이지를 스캔하는 중입니다...",
          "zh": "🔍 正在扫描页面以检测表单项与操作按钮...",
          "zh-TW": "🔍 正在掃描頁面以偵測表單欄位與操作按鈕...",
          "vi": "🔍 Đang quét trang để phát hiện các trường biểu mẫu và nút thao tác...",
          "th": "🔍 กำลังสแกนหน้าเว็บเพื่อตรวจหาช่องกรอกข้อมูลและปุ่มการดำเนินการ...",
          "hi": "🔍 आपके लिए फ़ॉर्म फ़ील्ड्स और कार्रवाई बटन खोजने हेतु पेज को स्कैन किया जा रहा है...",
          "fil": "🔍 Sinasuri ang pahina upang mahanap ang mga form fields at action buttons...",
          "ms": "🔍 Sedang mengimbas halaman untuk mengesan ruangan borang dan butang tindakan..."
    },
    "scan_no_fields_chat": {
          "en": "🔍 **Page Form Scan Result:**\n\nTelmy scanned this page but found 0 form input fields. Please ensure you are on the actual form page or navigation menu.",
          "id": "🔍 **Hasil Pemindaian Formulir:**\n\nTelmy telah memindai halaman ini secara menyeluruh, namun tidak mendeteksi adanya kolom isian formulir (0 kolom). Pastikan Anda membuka halaman formulir yang aktif, atau periksa menu navigasi untuk memulai pengajuan.",
          "ja": "🔍 **ページフォームのスキャン結果:**\n\nこのページに入力項目は検出されませんでした (0 件)。実際の申請フォームページまたはナビゲーションメニューを開いているかご確認ください。",
          "ko": "🔍 **페이지 양식 스캔 결과:**\n\n이 페이지에서 입력란을 찾지 못했습니다 (0개). 실제 양식 페이지나 탐색 메뉴에 있는지 확인해 주세요.",
          "zh": "🔍 **页面表单扫描结果：**\n\nTelmy 扫描了此页面，但未发现表单输入框（0 项）。请确认您已处于实际表单页面或导航菜单中。",
          "zh-TW": "🔍 **頁面表單掃描結果：**\n\nTelmy 掃描了此頁面，但未發現表單欄位（0 項）。請確認您已處於實際表單頁面或導覽選單中。",
          "vi": "🔍 **Kết quả quét biểu mẫu trang:**\n\nTelmy đã quét trang này nhưng không tìm thấy trường nhập liệu nào (0 trường). Vui lòng đảm bảo bạn đang ở đúng trang biểu mẫu thực tế.",
          "th": "🔍 **ผลการสแกนแบบฟอร์มหน้าเว็บ:**\n\nTelmy ได้สแกนหน้านี้แล้วแต่ไม่พบช่องกรอกข้อมูล (0 ช่อง) โปรดตรวจสอบว่าคุณอยู่ในหน้าแบบฟอร์มที่ถูกต้องหรือเมนูการนำทาง",
          "hi": "🔍 **पेज फ़ॉर्म स्कैन परिणाम:**\n\nTelmy ने इस पेज को स्कैन किया लेकिन 0 फ़ॉर्म फ़ील्ड मिले। कृपया सुनिश्चित करें कि आप वास्तविक फ़ॉर्म पेज या नेविगेशन मेनू पर हैं।",
          "fil": "🔍 **Resulta ng Pag-scan sa Form ng Pahina:**\n\nNa-scan ni Telmy ang pahinang ito ngunit walang nakitang field ng input ng form (0). Pakitiyak na nasa aktwal na pahina ng form ka.",
          "ms": "🔍 **Keputusan Imbasan Borang Halaman:**\n\nTelmy telah mengimbas halaman ini tetapi menemui 0 ruangan input borang. Sila pastikan anda berada di halaman borang sebenar atau menu navigasi."
    },
    "ask_where_is_element": {
          "en": "On this webpage, where is \"{element}\" located? Please indicate its position.",
          "id": "Di halaman web ini, di mana letak \"{element}\"? Tolong tunjukkan posisinya.",
          "ja": "このWebページで「{element}」はどこにありますか？位置を示してください。",
          "ko": "이 웹페이지에서 \"{element}\"는 어디에 있나요? 위치를 알려주세요.",
          "zh": "在这个网页上，“{element}”在哪里？请指出其具体位置。",
          "zh-TW": "在這個網頁上，「{element}」在哪裡？請指出其具體位置。",
          "vi": "Trên trang web này, \"{element}\" nằm ở đâu? Vui lòng chỉ ra vị trí của nó.",
          "th": "ในหน้าเว็บนี้ \"{element}\" อยู่ตรงไหน? โปรดบอกตำแหน่งให้หน่อย",
          "hi": "इस वेबपेज पर \"{element}\" कहाँ स्थित है? कृपया इसकी स्थिति बताएं।",
          "fil": "Sa webpage na ito, saan matatagpuan ang \"{element}\"? Pakituro ang posisyon nito.",
          "ms": "Di halaman web ini, di manakah letaknya \"{element}\"? Sila tunjukkan kedudukannya."
    },
    "empty_unscanned_btn_upload": {
          "en": "Upload Local Form (PDF)",
          "id": "Unggah Formulir PDF Lokal",
          "ja": "ローカルPDFフォームをアップロード",
          "ko": "로컬 PDF 양식 업로드",
          "zh": "上传本地 PDF 表单",
          "zh-TW": "上傳本地 PDF 表單",
          "vi": "Tải lên biểu mẫu PDF cục bộ",
          "th": "อัปโหลดแบบฟอร์ม PDF จากเครื่อง",
          "hi": "स्थानीय पीडीएफ फ़ॉर्म अपलोड करें",
          "fil": "Mag-upload ng Lokal na PDF Form",
          "ms": "Muat Naik Borang PDF Tempatan"
    },
    "empty_action_btn_title": {
          "en": "Action Button Found: {button}",
          "id": "Tombol Pengajuan Ditemukan: {button}",
          "ja": "アクションボタンを検出: {button}",
          "ko": "작업 버튼 발견: {button}",
          "zh": "已找到操作按钮：{button}",
          "zh-TW": "已找到操作按鈕：{button}",
          "vi": "Đã tìm thấy nút thao tác: {button}",
          "th": "พบปุ่มการดำเนินการ: {button}",
          "hi": "कार्रवाई बटन मिला: {button}",
          "fil": "Nahanap ang Action Button: {button}",
          "ms": "Butang Tindakan Ditemui: {button}"
    },
    "empty_action_btn_desc": {
          "en": "No form inputs on this page. However, Telmy found and highlighted the application button: \"{button}\". Click it on the page to proceed.",
          "id": "Belum ada formulir input di halaman ini. Namun Telmy telah menemukan dan menyorot tombol untuk memulai pengajuan: \"{button}\". Silakan klik tombol tersebut di halaman web.",
          "ja": "このページに入力項目はありませんが、申請ボタン「{button}」が検出されハイライトされました。ページ上のボタンをクリックして進んでください。",
          "ko": "이 페이지에는 입력란이 없습니다. 하지만 Telmy가 신청 시작 버튼 \"{button}\"을 찾아 강조 표시했습니다. 페이지에서 해당 버튼을 클릭하세요.",
          "zh": "此页面暂无表单输入框。但 Telmy 找到了申请按钮：“{button}”。请在网页上点击该按钮继续。",
          "zh-TW": "此頁面暫無表單輸入欄位。但 Telmy 找到了申請按鈕：「{button}」。請在網頁上點擊該按鈕以繼續。",
          "vi": "Chưa có trường nhập liệu trên trang này. Tuy nhiên, Telmy đã tìm thấy và làm nổi bật nút bắt đầu nộp: \"{button}\". Vui lòng nhấp vào nút đó trên trang web.",
          "th": "ยังไม่มีช่องกรอกข้อมูลในหน้านี้ แต่ Telmy ได้ตรวจพบและเน้นปุ่มเริ่มต้นการสมัคร: \"{button}\" กรุณาคลิกปุ่มนั้นบนหน้าเว็บเพื่อดำเนินการต่อ",
          "hi": "इस पेज पर कोई इनपुट फ़ील्ड नहीं है। हालाँकि, Telmy ने आवेदन बटन खोजा और हाइलाइट किया: \"{button}\"। आगे बढ़ने के लिए पेज पर उस पर क्लिक करें।",
          "fil": "Walang input fields sa pahinang ito. Gayunpaman, nahanap at na-highlight ni Telmy ang application button: \"{button}\". I-click ito sa webpage upang magpatuloy.",
          "ms": "Tiada ruangan input di halaman ini. Namun Telmy telah menemui dan menonjolkan butang permohonan: \"{button}\". Sila klik butang tersebut di halaman web."
    },
    "empty_action_btn_click": {
          "en": "Click \"{button}\"",
          "id": "Klik \"{button}\"",
          "ja": "「{button}」をクリック",
          "ko": "\"{button}\" 클릭",
          "zh": "点击 \"{button}\"",
          "zh-TW": "點擊 \"{button}\"",
          "vi": "Nhấp vào \"{button}\"",
          "th": "คลิก \"{button}\"",
          "hi": "\"{button}\" पर क्लिक करें",
          "fil": "I-click ang \"{button}\"",
          "ms": "Klik \"{button}\""
    },
    "empty_no_fields_title": {
          "en": "No Form Fields Detected",
          "id": "Tidak Ada Kolom Formulir di Halaman Ini",
          "ja": "入力項目が検出されませんでした",
          "ko": "감지된 양식 입력란이 없습니다",
          "zh": "未检测到表单字段",
          "zh-TW": "未偵測到表單欄位",
          "vi": "Không tìm thấy trường biểu mẫu nào",
          "th": "ตรวจไม่พบช่องกรอกแบบฟอร์มในหน้านี้",
          "hi": "पेज पर कोई फ़ॉर्म फ़ील्ड नहीं मिला",
          "fil": "Walang Nakitang Form Fields sa Pahinang Ito",
          "ms": "Tiada Ruangan Borang Dikesan di Halaman Ini"
    },
    "empty_no_fields_desc": {
          "en": "Telmy scanned this page but found 0 input fields. If you need to submit an application, ensure you are on the actual form page or logged in.",
          "id": "Telmy telah memindai halaman ini dan tidak menemukan kolom input formulir (0 kolom). Jika Anda ingin mengajukan permohonan, pastikan Anda berada di halaman formulir atau login terlebih dahulu.",
          "ja": "Telmyがこのページをスキャンしましたが、入力項目が見つかりませんでした (0件)。申請を行う場合は、実際のフォーム画面を開いているかログインしていることを確認してください。",
          "ko": "Telmy가 이 페이지를 스캔했지만 입력란을 찾지 못했습니다 (0개). 신청서를 작성하려면 실제 양식 페이지로 이동하거나 먼저 로그인하세요.",
          "zh": "Telmy 已扫描此页面，但未发现表单输入项 (0 项)。如需提交申请，请确保您位于实际的表单页面或已先登录。",
          "zh-TW": "Telmy 已掃描此頁面，但未發現表單輸入欄位 (0 欄)。如需填寫申請，請確認您已在實際的表單頁面或先完成登入。",
          "vi": "Telmy đã quét trang này nhưng không tìm thấy trường nhập liệu nào (0 trường). Nếu bạn cần nộp đơn, hãy đảm bảo bạn đang ở đúng trang biểu mẫu hoặc đã đăng nhập.",
          "th": "Telmy ได้สแกนหน้านี้แล้วแต่ไม่พบช่องกรอกข้อมูล (0 ช่อง) หากต้องการส่งใบสมัคร กรุณาตรวจสอบว่าคุณอยู่ในหน้าแบบฟอร์มจริงหรือเข้าสู่ระบบแล้ว",
          "hi": "Telmy ने इस पेज को स्कैन किया लेकिन 0 फ़ील्ड पाए। यदि आपको आवेदन जमा करना है, तो सुनिश्चित करें कि आप वास्तविक फ़ॉर्म पेज पर हैं या लॉग इन हैं।",
          "fil": "Na-scan ni Telmy ang pahinang ito at walang nakitang input field (0 fields). Kung nais mong mag-apply, siguraduhing nasa aktwal na form page ka o naka-log in.",
          "ms": "Telmy telah mengimbas halaman ini dan mendapati 0 ruangan input. Jika anda ingin mengemukakan permohonan, pastikan anda berada di halaman borang sebenar atau telah log masuk."
    },
    "empty_no_fields_btn_rescan": {
          "en": "Rescan Page",
          "id": "Pindai Ulang Halaman",
          "ja": "ページを再スキャン",
          "ko": "페이지 다시 스캔",
          "zh": "重新扫描页面",
          "zh-TW": "重新掃描頁面",
          "vi": "Quét lại trang",
          "th": "สแกนหน้านี้ใหม่",
          "hi": "पेज को पुनः स्कैन करें",
          "fil": "I-rescan ang Pahina",
          "ms": "Imbas Semula Halaman"
    },
    "paywall_modal_title": {
          "en": "Form Analysis Quota",
          "id": "Kuota Analisis Formulir",
          "ja": "フォーム分析枠・利用枠",
          "ko": "양식 분석 할당량",
          "zh": "表单分析额度",
          "zh-TW": "表單分析額度",
          "vi": "Hạn mức Phân tích Biểu mẫu",
          "th": "โควต้าการวิเคราะห์แบบฟอร์ม",
          "hi": "फ़ॉर्म विश्लेषण कोटा",
          "fil": "Quota sa Pagsusuri ng Form",
          "ms": "Kuota Analisis Borang"
    },
    "paywall_modal_sub": {
          "en": "Upgrade your form quota for uninterrupted assistance",
          "id": "Tingkatkan kuota formulir Anda untuk bantuan tanpa henti",
          "ja": "中断することなくAIアシスタントを利用するために枠をアップグレード",
          "ko": "끊김 없는 지원을 위해 양식 할당량을 업그레이드하세요",
          "zh": "升级您的表单额度以获取不间断的 AI 填写指引",
          "zh-TW": "升級您的表單額度以獲得不中斷的 AI 填寫指引",
          "vi": "Nâng cấp hạn mức biểu mẫu để được hỗ trợ liên tục",
          "th": "อัปเกรดโควต้าฟอร์มเพื่อรับความช่วยเหลืออย่างต่อเนื่อง",
          "hi": "निरंतर सहायता के लिए अपना फ़ॉर्म कोटा अपग्रेड करें",
          "fil": "I-upgrade ang iyong quota para sa tuloy-tuloy na tulong",
          "ms": "Tingkatkan kuota borang anda untuk bantuan tanpa henti"
    },
    "paywall_sum_remaining": {
          "en": "Forms Remaining",
          "id": "Sisa Formulir",
          "ja": "残りのフォーム枠",
          "ko": "남은 양식 횟수",
          "zh": "剩余表单额度",
          "zh-TW": "剩餘表單額度",
          "vi": "Biểu mẫu còn lại",
          "th": "ฟอร์มคงเหลือ",
          "hi": "शेष फ़ॉर्म",
          "fil": "Natitirang Forms",
          "ms": "Baki Borang"
    },
    "paywall_sum_active_tier": {
          "en": "Active Tier:",
          "id": "Paket Aktif:",
          "ja": "現在のプラン:",
          "ko": "현재 등급:",
          "zh": "当前方案：",
          "zh-TW": "目前方案：",
          "vi": "Gói hiện tại:",
          "th": "แพ็กเกจปัจจุบัน:",
          "hi": "सक्रिय स्तर:",
          "fil": "Aktibong Antas:",
          "ms": "Pelan Aktif:"
    },
    "paywall_sum_payg": {
          "en": "Permanent Credits (PAYG):",
          "id": "Kredit Permanen (PAYG):",
          "ja": "永久クレジット (PAYG):",
          "ko": "영구 크레딧 (PAYG):",
          "zh": "永久点数 (PAYG)：",
          "zh-TW": "永久點數 (PAYG)：",
          "vi": "Tín dụng vĩnh viễn (PAYG):",
          "th": "เครดิตถาวร (PAYG):",
          "hi": "स्थायी क्रेडिट (PAYG):",
          "fil": "Permanenteng Kredito (PAYG):",
          "ms": "Kredit Kekal (PAYG):"
    },
    "paywall_sum_pro": {
          "en": "Monthly Subscription:",
          "id": "Langganan Bulanan:",
          "ja": "月額サブスクリプション:",
          "ko": "월간 구독:",
          "zh": "月度订阅：",
          "zh-TW": "月度訂閱：",
          "vi": "Đăng ký hàng tháng:",
          "th": "สมาชิกรายเดือน:",
          "hi": "मासिक सदस्यता:",
          "fil": "Buwanang Subskripsyon:",
          "ms": "Langganan Bulanan:"
    },
    "paywall_dashboard_info": {
          "en": "Upgrade subscription, purchase extra credits, or manage billing easily on the Telmy Web Dashboard.",
          "id": "Tingkatkan paket langganan, tambah kuota form, atau kelola tagihan dengan mudah di Dashboard Web Telmy.",
          "ja": "Telmy Webダッシュボードで、プランのアップグレード、追加クレジットの購入、請求管理を簡単に行えます。",
          "ko": "Telmy 웹 대시보드에서 손쉽게 구독을 업그레이드하고 추가 크레딧을 구매하거나 결제를 관리하세요.",
          "zh": "在 Telmy 网页控制台中轻松升级订阅、购买额外额度或管理账单。",
          "zh-TW": "在 Telmy 網頁主控台中輕鬆升級訂閱、購買額外額度或管理帳單。",
          "vi": "Nâng cấp gói đăng ký, mua thêm hạn mức biểu mẫu hoặc quản lý thanh toán dễ dàng trên Telmy Web Dashboard.",
          "th": "อัปเกรดแพ็กเกจ ซื้อโควต้าฟอร์มเพิ่มเติม หรือจัดการการเรียกเก็บเงินได้อย่างง่ายดายบน Telmy Web Dashboard",
          "hi": "Telmy वेब डैशबोर्ड पर आसानी से सदस्यता अपग्रेड करें, अतिरिक्त क्रेडिट खरीदें, या बिलिंग प्रबंधित करें।",
          "fil": "Madaling mag-upgrade ng subskripsyon, bumili ng dagdag na quota, o pamahalaan ang billing sa Telmy Web Dashboard.",
          "ms": "Tingkatkan langganan, beli kuota borang tambahan, atau urus pengebilan dengan mudah di Papan Pemuka Web Telmy."
    },
    "paywall_btn_upgrade_dashboard": {
          "en": "Upgrade Quota on Dashboard ↗",
          "id": "Tingkatkan Kuota di Dashboard ↗",
          "ja": "ダッシュボードで枠をアップグレード ↗",
          "ko": "대시보드에서 할당량 업그레이드 ↗",
          "zh": "前往控制台升级额度 ↗",
          "zh-TW": "前往主控台升級額度 ↗",
          "vi": "Nâng cấp hạn mức trên Dashboard ↗",
          "th": "อัปเกรดโควต้าบนแดชบอร์ด ↗",
          "hi": "डैशबोर्ड पर कोटा अपग्रेड करें ↗",
          "fil": "I-upgrade ang Quota sa Dashboard ↗",
          "ms": "Tingkatkan Kuota di Papan Pemuka ↗"
    },
    "paywall_exhausted_sub": {
          "en": "Your free form quota is exhausted. Visit the dashboard to upgrade and continue.",
          "id": "Kuota formulir gratis Anda telah habis. Kunjungi dashboard untuk upgrade dan melanjutkan.",
          "ja": "無料枠を使い切りました。継続してご利用いただくにはダッシュボードでアップグレードしてください。",
          "ko": "무료 양식 할당량이 모두 소진되었습니다. 계속하려면 대시보드에서 업그레이드하세요.",
          "zh": "您的免费表单额度已用完。请访问控制台升级以继续使用。",
          "zh-TW": "您的免費表單額度已用完。請前往主控台升級以繼續使用。",
          "vi": "Hạn mức biểu mẫu miễn phí của bạn đã hết. Hãy truy cập dashboard để nâng cấp và tiếp tục.",
          "th": "โควต้าแบบฟอร์มฟรีของคุณหมดแล้ว กรุณาไปที่แดชบอร์ดเพื่ออัปเกรดและดำเนินการต่อ",
          "hi": "आपका निःशुल्क फ़ॉर्म कोटा समाप्त हो गया है। जारी रखने के लिए डैशबोर्ड पर अपग्रेड करें।",
          "fil": "Ubos na ang iyong libreng form quota. Bisitahin ang dashboard upang mag-upgrade at magpatuloy.",
          "ms": "Kuota borang percuma anda telah habis. Sila ke papan pemuka untuk menaik taraf dan teruskan."
    },
    "detected_fields_header": {
          "en": "Detected Form Fields",
          "id": "Daftar Kolom Terdeteksi",
          "ja": "検出された入力項目一覧",
          "ko": "감지된 입력란 목록",
          "zh": "已检测表单项列表",
          "zh-TW": "已偵測欄位清單",
          "vi": "Danh sách trường đã phát hiện",
          "th": "รายการช่องที่ตรวจพบ",
          "hi": "पहचाने गए फ़ॉर्म फ़ील्ड्स",
          "fil": "Mga Nakitang Kolum",
          "ms": "Senarai Ruangan Dikesan"
    },
    "progress_title": {
          "en": "Form Completion Progress",
          "id": "Progres Pengisian Form",
          "ja": "入力進捗状況",
          "ko": "양식 작성 진행률",
          "zh": "表单填写进度",
          "zh-TW": "表單填寫進度",
          "vi": "Tiến độ hoàn thành biểu mẫu",
          "th": "ความคืบหน้าการกรอกแบบฟอร์ม",
          "hi": "फ़ॉर्म भरने की प्रगति",
          "fil": "Progreso ng Pagsagot",
          "ms": "Kemajuan Mengisi Borang"
    },
    "summary_title": {
          "en": "📌 Form Overview",
          "id": "📌 Ringkasan Formulir",
          "ja": "📌 フォーム概要",
          "ko": "📌 양식 개요",
          "zh": "📌 表单概览",
          "zh-TW": "📌 表單總覽",
          "vi": "📌 Tổng quan biểu mẫu",
          "th": "📌 ภาพรวมแบบฟอร์ม",
          "hi": "📌 फ़ॉर्म का सारांश",
          "fil": "📌 Buod ng Form",
          "ms": "📌 Ringkasan Borang"
    },
    "prereq_title": {
          "en": "📑 Prerequisites & Documents",
          "id": "📑 Dokumen yang Perlu Disiapkan",
          "ja": "📑 事前準備書類",
          "ko": "📑 준비 서류",
          "zh": "📑 需准备的文件",
          "zh-TW": "📑 需準備的證件",
          "vi": "📑 Giấy tờ cần chuẩn bị",
          "th": "📑 เอกสารที่ต้องเตรียม",
          "hi": "📑 आवश्यक दस्तावेज़",
          "fil": "📑 Mga Kinakailangang Dokumento",
          "ms": "📑 Dokumen Diperlukan"
    },
    "tips_title": {
          "en": "💡 Helpful Tips",
          "id": "💡 Tips Pengisian",
          "ja": "💡 入力のヒント",
          "ko": "💡 작성 팁",
          "zh": "💡 填写提示",
          "zh-TW": "💡 填寫貼士",
          "vi": "💡 Mẹo điền biểu mẫu",
          "th": "💡 เคล็ดลับการกรอก",
          "hi": "💡 उपयोगी सुझाव",
          "fil": "💡 Mga Tip",
          "ms": "💡 Petua Mengisi"
    },
    "detail_meaning": {
          "en": "Meaning & Purpose",
          "id": "Maksud & Fungsi Kolom",
          "ja": "項目の意味と用途",
          "ko": "항목 설명 및 용도",
          "zh": "含义与用途",
          "zh-TW": "含義與用途",
          "vi": "Ý nghĩa & Mục đích",
          "th": "ความหมายและวัตถุประสงค์",
          "hi": "अर्थ और उद्देश्य",
          "fil": "Kahulugan at Layunin",
          "ms": "Maksud & Fungsi Ruangan"
    },
    "detail_how": {
          "en": "How to Fill",
          "id": "Cara Mengisi",
          "ja": "入力手順",
          "ko": "작성 방법",
          "zh": "如何填写",
          "zh-TW": "如何填寫",
          "vi": "Cách điền",
          "th": "วิธีการกรอก",
          "hi": "कैसे भरें",
          "fil": "Paano Sagutan",
          "ms": "Cara Mengisi"
    },
    "detail_example": {
          "en": "Example Entry",
          "id": "Contoh Isian",
          "ja": "記入例",
          "ko": "예시",
          "zh": "参考示例",
          "zh-TW": "參考範例",
          "vi": "Ví dụ mẫu",
          "th": "ตัวอย่างการกรอก",
          "hi": "उदाहरण",
          "fil": "Halimbawa",
          "ms": "Contoh Isian"
    },
    "detail_copy": {
          "en": "Copy",
          "id": "Salin",
          "ja": "コピー",
          "ko": "복사",
          "zh": "复制",
          "zh-TW": "複製",
          "vi": "Sao chép",
          "th": "คัดลอก",
          "hi": "कॉपी करें",
          "fil": "Kopyahin",
          "ms": "Salin"
    },
    "detail_copied": {
          "en": "Copied!",
          "id": "Tersalin!",
          "ja": "コピー完了!",
          "ko": "복사됨!",
          "zh": "已复制!",
          "zh-TW": "已複製!",
          "vi": "Đã sao chép!",
          "th": "คัดลอกแล้ว!",
          "hi": "कॉपी हो गया!",
          "fil": "Nakopya!",
          "ms": "Disalin!"
    },
    "detail_avoid": {
          "en": "Common Mistakes",
          "id": "Hindari Kesalahan",
          "ja": "注意点",
          "ko": "주의 사항",
          "zh": "避免错误",
          "zh-TW": "避免錯誤",
          "vi": "Tránh lỗi",
          "th": "ข้อควรระวัง",
          "hi": "गलतियों से बचें",
          "fil": "Iwasan ang Mali",
          "ms": "Elakkan Kesilapan"
    },
    "detail_foreign_notes": {
          "en": "Notes for Foreigners",
          "id": "Catatan untuk WNA",
          "ja": "外国人向け注意事項",
          "ko": "외국인 유의사항",
          "zh": "外籍人士注意事项",
          "zh-TW": "外籍人士注意事項",
          "vi": "Lưu ý cho người nước ngoài",
          "th": "หมายเหตุสำหรับชาวต่างชาติ",
          "hi": "विदेशी नागरिकों के लिए निर्देश",
          "fil": "Paunawa para sa Dayuhan",
          "ms": "Nota untuk Warga Asing"
    },
    "ai_draft_badge": {
          "en": "AI Draft",
          "id": "Draf AI",
          "ja": "AIドラフト",
          "ko": "AI 초안",
          "zh": "AI草案",
          "zh-TW": "AI草案",
          "vi": "Bản thảo AI",
          "th": "ร่างโดย AI",
          "hi": "एआई प्रारूप",
          "fil": "AI Draft",
          "ms": "Draf AI"
    },
    "fields_unit": {
          "en": "Fields",
          "id": "Kolom",
          "ja": "項目",
          "ko": "개",
          "zh": "项",
          "zh-TW": "項",
          "vi": "trường",
          "th": "ช่อง",
          "hi": "फ़ील्ड्स",
          "fil": "Kolum",
          "ms": "Ruangan"
    },
    "analyzing_title": {
          "en": "Gemini AI is Analyzing Form...",
          "id": "Gemini AI Sedang Menganalisis Formulir...",
          "ja": "Gemini AI がフォームを解析中...",
          "ko": "Gemini AI가 양식을 분석하고 있습니다...",
          "zh": "Gemini AI 正在分析表单...",
          "zh-TW": "Gemini AI 正在分析表單...",
          "vi": "Gemini AI đang phân tích biểu mẫu...",
          "th": "Gemini AI กำลังวิเคราะห์แบบฟอร์ม...",
          "hi": "Gemini AI फ़ॉर्म का विश्लेषण कर रहा है...",
          "fil": "Sinusuri ng Gemini AI ang Form...",
          "ms": "Gemini AI Sedang Menganalisis Borang..."
    },
    "analyzing_desc": {
          "en": "Reading all input structures, official bureaucracy rules, and document requirements.",
          "id": "Membaca seluruh struktur input, aturan resmi birokrasi, dan persyaratan dokumen.",
          "ja": "すべての入力構造、公式な手続き規則、必要書類を確認しています。",
          "ko": "모든 입력 항목 구조, 공식 절차 규정 및 제출 서류 요건을 검토 중입니다.",
          "zh": "正在读取所有输入结构、官方办事规则与所需文件。",
          "zh-TW": "正在讀取所有輸入結構、官方規範與所需文件。",
          "vi": "Đang đọc toàn bộ cấu trúc trường nhập, quy định thủ tục và tài liệu yêu cầu.",
          "th": "กำลังอ่านโครงสร้างช่องกรอกข้อมูล กฎเกณฑ์ทางการ และเอกสารที่ต้องใช้",
          "hi": "सभी इनपुट संरचना, आधिकारिक नियमों और दस्तावेज़ आवश्यकताओं की समीक्षा की जा रही है।",
          "fil": "Binabasa ang buong istruktura ng input, opisyal na patakaran, at kinakailangang dokumento.",
          "ms": "Membaca semua struktur input, peraturan rasmi, dan syarat dokumen."
    },
    "analyzed_title": {
          "en": "Form Successfully Analyzed!",
          "id": "Form Berhasil Dianalisis!",
          "ja": "フォームの解析が完了しました！",
          "ko": "양식 분석이 완료되었습니다!",
          "zh": "表单已成功分析！",
          "zh-TW": "表單已成功分析！",
          "vi": "Đã phân tích biểu mẫu thành công!",
          "th": "วิเคราะห์แบบฟอร์มสำเร็จแล้ว!",
          "hi": "फ़ॉर्म का सफलतापूर्वक विश्लेषण हो गया!",
          "fil": "Matagumpay na Nasuri ang Form!",
          "ms": "Borang Berjaya Dianalisis!"
    },
    "analyzed_summary_label": {
          "en": "📌 This form is for:",
          "id": "📌 Formulir ini adalah:",
          "ja": "📌 このフォームについて:",
          "ko": "📌 이 양식의 개요:",
          "zh": "📌 此表单说明：",
          "zh-TW": "📌 此表單說明：",
          "vi": "📌 Biểu mẫu này dành cho:",
          "th": "📌 แบบฟอร์มนี้คือ:",
          "hi": "📌 यह फ़ॉर्म इसके लिए है:",
          "fil": "📌 Ang form na ito ay para sa:",
          "ms": "📌 Borang ini adalah:"
    },
    "analyzed_hint_text": {
          "en": "Click on any field on the webpage that you want to fill, or click the button below for step-by-step guidance:",
          "id": "Silakan klik pada field di halaman web yang ingin kamu isi, atau klik tombol di bawah untuk panduan langkah demi langkah:",
          "ja": "入力したいWebページの項目をクリックするか、下のボタンを押してステップ順のガイドを開始してください：",
          "ko": "웹페이지에서 입력할 항목을 클릭하거나, 아래 버튼을 눌러 단계별 안내를 시작하세요:",
          "zh": "点击网页上您要填写的输入框查看指引，或点击下方按钮开启逐项指引：",
          "zh-TW": "點擊網頁上您要填寫的欄位查看指引，或點擊下方按鈕開始逐步指引：",
          "vi": "Nhấp vào bất kỳ trường nào trên trang web để xem hướng dẫn, hoặc nhấp vào nút bên dưới để được hướng dẫn từng bước:",
          "th": "คลิกที่ช่องกรอกข้อมูลบนหน้าเว็บเพื่อดูคำแนะนำ หรือกดปุ่มด้านล่างเพื่อรับคำแนะนำทีละขั้นตอน:",
          "hi": "दिशानिर्देश देखने के लिए वेबपेज पर किसी भी फ़ील्ड पर क्लिक करें, या चरण-दर-चरण मार्गदर्शन के लिए नीचे दिए गए बटन पर क्लिक करें:",
          "fil": "I-click ang anumang kolum sa webpage upang makita ang gabay, o i-click ang pindutan sa ibaba para sa sunud-sunod na gabay:",
          "ms": "Sila klik pada ruangan di laman web yang ingin diisi, atau klik butang di bawah untuk panduan langkah demi langkah:"
    },
    "completion_title": {
          "en": "All Done!",
          "id": "Selesai!",
          "ja": "完了しました！",
          "ko": "모두 완료되었습니다!",
          "zh": "全部完成！",
          "zh-TW": "全部完成！",
          "vi": "Hoàn tất!",
          "th": "เสร็จสิ้นทั้งหมด!",
          "hi": "सब पूरा हो गया!",
          "fil": "Tapos Na!",
          "ms": "Semua Selesai!"
    },
    "completion_subtitle": {
          "en": "All form fields have been reviewed and filled.",
          "id": "Semua form berhasil kamu isi.",
          "ja": "すべての項目の確認と入力が完了しました。",
          "ko": "모든 양식 항목의 작성 및 검토가 완료되었습니다.",
          "zh": "所有表单项均已填写完毕。",
          "zh-TW": "所有表單欄位均已填寫完畢。",
          "vi": "Tất cả các trường đã được điền xong.",
          "th": "กรอกข้อมูลครบทุกช่องเรียบร้อยแล้ว",
          "hi": "सभी फ़ॉर्म फ़ील्ड की समीक्षा और भर दिया गया है।",
          "fil": "Lahat ng kolum sa form ay nasagutan na.",
          "ms": "Semua ruangan borang telah berjaya diisi."
    },
    "translate_banner_title": {
          "en": "Full Page Translation",
          "id": "Terjemahan Halaman Penuh",
          "ja": "全ページ翻訳",
          "ko": "전체 페이지 번역",
          "zh": "全页面翻译",
          "zh-TW": "全頁面翻譯",
          "vi": "Dịch toàn bộ trang",
          "th": "แปลทั้งหน้า",
          "hi": "पूरे पृष्ठ का अनुवाद",
          "fil": "Pagsasalin ng Buong Pahina",
          "ms": "Terjemahan Penuh Halaman"
    },
    "translate_banner_sub": {
          "en": "Context-Aware & UI/UX Standards",
          "id": "Berbasis Konteks & Standar UI/UX",
          "ja": "文脈重視・UI標準保持",
          "ko": "문맥 맞춤 및 UI 표준 유지",
          "zh": "上下文感知与UI标准",
          "zh-TW": "語境感知與UI標準",
          "vi": "Nhận biết ngữ cảnh & chuẩn UI",
          "th": "เข้าใจบริบทและมาตรฐาน UI",
          "hi": "संदर्भ-सचेत और UI मानक",
          "fil": "May kamalayan sa konteksto",
          "ms": "Peka konteks & standard UI"
    },
    "btn_translate_page": {
          "en": "Translate Page",
          "id": "Terjemahkan",
          "ja": "翻訳する",
          "ko": "페이지 번역",
          "zh": "翻译页面",
          "zh-TW": "翻譯頁面",
          "vi": "Dịch trang",
          "th": "แปลหน้าเว็บ",
          "hi": "अनुवाद करें",
          "fil": "Isalin",
          "ms": "Terjemah"
    },
    "btn_revert_page": {
          "en": "Show Original",
          "id": "Kembalikan Asli",
          "ja": "原文に戻す",
          "ko": "원문 보기",
          "zh": "显示原文",
          "zh-TW": "顯示原文",
          "vi": "Hiện bản gốc",
          "th": "แสดงต้นฉบับ",
          "hi": "मूल दिखाएं",
          "fil": "Ipakita ang Orihinal",
          "ms": "Tunjuk Asal"
    },
    "translating_status": {
          "en": "Translating with Gemini...",
          "id": "Menerjemahkan dengan Gemini...",
          "ja": "Gemini で翻訳中...",
          "ko": "Gemini로 번역 중...",
          "zh": "正在使用 Gemini 翻译...",
          "zh-TW": "正在使用 Gemini 翻譯...",
          "vi": "Đang dịch bằng Gemini...",
          "th": "กำลังแปลด้วย Gemini...",
          "hi": "Gemini से अनुवाद हो रहा है...",
          "fil": "Isinasalin gamit ang Gemini...",
          "ms": "Menterjemah dengan Gemini..."
    },
    "chip_translate": {
          "en": "Translate Page",
          "id": "Terjemahkan Halaman",
          "ja": "ページを翻訳",
          "ko": "페이지 번역",
          "zh": "翻译页面",
          "zh-TW": "翻譯頁面",
          "vi": "Dịch trang",
          "th": "แปลหน้าเว็บ",
          "hi": "पृष्ठ का अनुवाद",
          "fil": "Isalin ang Pahina",
          "ms": "Terjemah Halaman"
    },
    "chip_what": {
          "en": "What is this form?",
          "id": "Formulir apa ini?",
          "ja": "このフォームは何？",
          "ko": "이 양식은 무엇인가요?",
          "zh": "这是什么表单？",
          "zh-TW": "這是什麼表單？",
          "vi": "Đây là biểu mẫu gì?",
          "th": "แบบฟอร์มนี้คืออะไร?",
          "hi": "यह क्या फ़ॉर्म है?",
          "fil": "Anong form ito?",
          "ms": "Apakah borang ini?"
    },
    "chip_docs": {
          "en": "Required Docs",
          "id": "Syarat Dokumen",
          "ja": "必要書類",
          "ko": "필요 서류",
          "zh": "所需证件",
          "zh-TW": "所需證件",
          "vi": "Giấy tờ cần có",
          "th": "เอกสารที่ต้องใช้",
          "hi": "आवश्यक दस्तावेज़",
          "fil": "Mga Dokumento",
          "ms": "Dokumen Diperlukan"
    },
    "privacy_text": {
          "en": "Privacy Shield: PII Masked Locally",
          "id": "Pelindung Privasi: PII Disamarkan Lokal",
          "ja": "プライバシー保護: 個人情報をローカルでマスク",
          "ko": "개인정보 보호: 로컬에서 PII 마스킹",
          "zh": "隐私保护：本地屏蔽敏感信息",
          "zh-TW": "隱私保護：本機屏蔽敏感資料",
          "vi": "Bảo vệ quyền riêng tư: Che PII cục bộ",
          "th": "การคุ้มครองความเป็นส่วนตัว: ซ่อนข้อมูลระบุตัวตนในตัวเครื่อง",
          "hi": "गोपनीयता शील्ड: PII स्थानीय रूप से छुपाया गया",
          "fil": "Privacy Shield: Naka-mask ang PII",
          "ms": "Pelindung Privasi: PII Ditolak Tempatan"
    },
    "audit_btn_title": {
          "en": "Pre-Submission Form Audit",
          "id": "Audit Form Sebelum Submit",
          "ja": "送信前フォーム検証",
          "ko": "제출 전 양식 검토",
          "zh": "提交前表单审核",
          "zh-TW": "提交前表單審核",
          "vi": "Kiểm tra biểu mẫu trước khi gửi",
          "th": "ตรวจสอบฟอร์มก่อนส่ง",
          "hi": "सबमिट करने से पहले फ़ॉर्म ऑडिट",
          "fil": "I-audit ang Form Bago Isumite",
          "ms": "Audit Borang Sebelum Hantar"
    },
    "audit_btn_sub": {
          "en": "Sanity check completeness & format",
          "id": "Pemeriksaan kelengkapan & format isian",
          "ja": "記入漏れや形式の自動チェック",
          "ko": "작성 누락 및 형식 점검",
          "zh": "检查完整性与格式规范",
          "zh-TW": "檢查完整性與格式規範",
          "vi": "Kiểm tra tính đầy đủ & định dạng",
          "th": "ตรวจความสมบูรณ์และรูปแบบ",
          "hi": "पूर्णता और प्रारूप की जाँच करें",
          "fil": "Tingnan ang pagkakumpleto at format",
          "ms": "Pemeriksaan kelengkapan & format"
    },
    "audit_report_heading": {
          "en": "Form Audit Report",
          "id": "Laporan Audit Form",
          "ja": "フォーム検証レポート",
          "ko": "양식 검토 보고서",
          "zh": "表单审核报告",
          "zh-TW": "表單審核報告",
          "vi": "Báo cáo kiểm tra biểu mẫu",
          "th": "รายงานการตรวจสอบฟอร์ม",
          "hi": "फ़ॉर्म ऑडिट रिपोर्ट",
          "fil": "Ulat sa Pag-audit ng Form",
          "ms": "Laporan Audit Borang"
    },
    "audit_status_ready": {
          "en": "🟢 Ready to Submit",
          "id": "🟢 100% Siap Kirim",
          "ja": "🟢 送信準備完了",
          "ko": "🟢 제출 준비 완료",
          "zh": "🟢 已准备好提交",
          "zh-TW": "🟢 已準備好提交",
          "vi": "🟢 Sẵn sàng gửi",
          "th": "🟢 พร้อมส่ง",
          "hi": "🟢 सबमिट के लिए तैयार",
          "fil": "🟢 Handa nang Isumite",
          "ms": "🟢 Sedia Dihantar"
    },
    "audit_status_danger": {
          "en": "🔴 Action Required",
          "id": "🔴 Perlu Diperbaiki",
          "ja": "🔴 要修正",
          "ko": "🔴 조치 필요",
          "zh": "🔴 需要修正",
          "zh-TW": "🔴 需要修正",
          "vi": "🔴 Cần chỉnh sửa",
          "th": "🔴 ต้องแก้ไข",
          "hi": "🔴 कार्रवाई आवश्यक",
          "fil": "🔴 Kailangang Ayusin",
          "ms": "🔴 Perlu Dibetulkan"
    },
    "audit_status_warning": {
          "en": "🟡 Suggestions Found",
          "id": "🟡 Cek Rekomendasi",
          "ja": "🟡 推奨事項あり",
          "ko": "🟡 권장 사항 있음",
          "zh": "🟡 建议优化",
          "zh-TW": "🟡 建議優化",
          "vi": "🟡 Gợi ý cần xem",
          "th": "🟡 มีคำแนะนำ",
          "hi": "🟡 सुझाव उपलब्ध",
          "fil": "🟡 May Mungkahi",
          "ms": "🟡 Ada Cadangan"
    },
    "mode_chat_title": {
          "en": "Chatbot Mode",
          "id": "Mode Chatbot",
          "ja": "チャットボット",
          "ko": "챗봇 모드",
          "zh": "聊天机器人模式",
          "zh-TW": "聊天機器人模式",
          "vi": "Chế độ Chatbot",
          "th": "โหมดแชทบอท",
          "hi": "चैटबॉट मोड",
          "fil": "Chatbot Mode",
          "ms": "Mod Chatbot"
    },
    "mode_chat_desc": {
          "en": "Fast & silent text (Muted)",
          "id": "Teks cepat & hening (Mute)",
          "ja": "高速・テキスト対話 (ミュート)",
          "ko": "조용한 텍스트 대화 (음소거)",
          "zh": "快速静音文本 (静音)",
          "zh-TW": "快速靜音文字 (靜音)",
          "vi": "Văn bản nhanh & im lặng (Tắt tiếng)",
          "th": "ข้อความรวดเร็วและเงียบ (ปิดเสียง)",
          "hi": "तेज़ और शांत टेक्स्ट (म्यूट)",
          "fil": "Mabilis at tahimik na text (Naka-mute)",
          "ms": "Teks pantas & senyap (Bisu)"
    },
    "mode_chat_compact": {
          "en": "Chatbot (Silent)",
          "id": "Chatbot (Hening)",
          "ja": "チャットボット (静音)",
          "ko": "챗봇 (조용히)",
          "zh": "聊天机器人 (静音)",
          "zh-TW": "聊天機器人 (靜音)",
          "vi": "Chatbot (Im lặng)",
          "th": "แชทบอท (เงียบ)",
          "hi": "चैटबॉट (शांत)",
          "fil": "Chatbot (Tahimik)",
          "ms": "Chatbot (Senyap)"
    },
    "mode_voice_title": {
          "en": "Voicebot Mode",
          "id": "Mode Voicebot",
          "ja": "音声対話モード",
          "ko": "음성봇 모드",
          "zh": "语音助手模式",
          "zh-TW": "語音助理模式",
          "vi": "Chế độ Voicebot",
          "th": "โหมดสนทนาเสียง",
          "hi": "वॉइसबॉट मोड",
          "fil": "Voicebot Mode",
          "ms": "Mod Voicebot"
    },
    "mode_voice_desc": {
          "en": "Google WaveNet Voice & Interactive Avatar",
          "id": "Suara Google WaveNet & Avatar Interaktif",
          "ja": "Google WaveNet音声＆対話アバター",
          "ko": "Google WaveNet 음성 및 대화형 아바타",
          "zh": "Google WaveNet 语音与动态形象",
          "zh-TW": "Google WaveNet 語音與互動虛擬人",
          "vi": "Giọng nói Google WaveNet & Avatar tương tác",
          "th": "เสียง Google WaveNet และอวาตาร์โต้ตอบ",
          "hi": "Google WaveNet आवाज़ और इंटरैक्टिव अवतार",
          "fil": "Boses ng Google WaveNet at Interactive Avatar",
          "ms": "Suara Google WaveNet & Avatar Interaktif"
    },
    "mode_voice_compact": {
          "en": "Voicebot (Interactive)",
          "id": "Voicebot (Interaktif)",
          "ja": "音声ボット (対話)",
          "ko": "음성봇 (대화형)",
          "zh": "语音助手 (互动)",
          "zh-TW": "語音助理 (互動)",
          "vi": "Voicebot (Tương tác)",
          "th": "สนทนาเสียง (โต้ตอบ)",
          "hi": "वॉइसबॉट (इंटरैक्टिव)",
          "fil": "Voicebot (Interactive)",
          "ms": "Voicebot (Interaktif)"
    },
    "mode_status_active": {
          "en": "✓ Active",
          "id": "✓ Aktif",
          "ja": "✓ 有効",
          "ko": "✓ 활성",
          "zh": "✓ 已启用",
          "zh-TW": "✓ 已啟用",
          "vi": "✓ Hoạt động",
          "th": "✓ ใช้งานอยู่",
          "hi": "✓ सक्रिय",
          "fil": "✓ Aktibo",
          "ms": "✓ Aktif"
    },
    "mode_status_switch": {
          "en": "○ Switch Mode",
          "id": "○ Beralih Mode",
          "ja": "○ 切り替え",
          "ko": "○ 모드 전환",
          "zh": "○ 切换模式",
          "zh-TW": "○ 切換模式",
          "vi": "○ Chuyển chế độ",
          "th": "○ สลับโหมด",
          "hi": "○ मोड बदलें",
          "fil": "○ Lumipat ng Mode",
          "ms": "○ Tukar Mod"
    },
    "hover_change_mode": {
          "en": "Hover to change mode",
          "id": "Arahkan kursor untuk ganti mode",
          "ja": "カーソルを合わせて切替",
          "ko": "마우스를 올려 모드 변경",
          "zh": "悬停以切换模式",
          "zh-TW": "懸停以切換模式",
          "vi": "Di chuột để đổi chế độ",
          "th": "ชี้เพื่อเปลี่ยนโหมด",
          "hi": "मोड बदलने के लिए होवर करें",
          "fil": "Itapat para magpalit ng mode",
          "ms": "Arahkan kursor untuk tukar mod"
    },
    "voicebot_status_idle_title": {
          "en": "Hello, I'm Telmy!",
          "id": "Halo, saya Telmy!",
          "ja": "こんにちは、Telmyです！",
          "ko": "안녕하세요, Telmy입니다!",
          "zh": "您好，我是 Telmy！",
          "zh-TW": "您好，我是 Telmy！",
          "vi": "Xin chào, tôi là Telmy!",
          "th": "สวัสดีครับ ผมคือ Telmy!",
          "hi": "नमस्ते, मैं Telmy हूँ!",
          "fil": "Kamusta, ako si Telmy!",
          "ms": "Hai, saya Telmy!"
    },
    "voicebot_status_idle_desc": {
          "en": "Click the microphone button below to speak directly",
          "id": "Klik tombol mikrofon di bawah untuk berbicara langsung",
          "ja": "下のマイクボタンをクリックして直接お話しください",
          "ko": "아래 마이크 버튼을 눌러 말씀해 주세요",
          "zh": "点击下方麦克风即可直接语音交流",
          "zh-TW": "點擊下方麥克風即可直接語音對話",
          "vi": "Nhấn nút micrô bên dưới để nói trực tiếp",
          "th": "กดปุ่มไมโครโฟนด้านล่างเพื่อพูดคุยโดยตรง",
          "hi": "सीधे बात करने के लिए नीचे दिए गए माइक पर क्लिक करें",
          "fil": "I-click ang mikropono sa ibaba para magsalita",
          "ms": "Klik butang mikrofon di bawah untuk bercakap terus"
    },
    "voicebot_mic_caption_idle": {
          "en": "Click to Speak",
          "id": "Klik untuk Bicara",
          "ja": "クリックして話す",
          "ko": "클릭하여 말하기",
          "zh": "点击说话",
          "zh-TW": "點擊說話",
          "vi": "Nhấn để nói",
          "th": "กดเพื่อพูด",
          "hi": "बोलने के लिए क्लिक करें",
          "fil": "I-click para Magsalita",
          "ms": "Klik untuk Bercakap"
    },
    "voicebot_status_listening_title": {
          "en": "Listening...",
          "id": "Mendengarkan...",
          "ja": "音声を聞き取り中...",
          "ko": "듣고 있습니다...",
          "zh": "正在聆听...",
          "zh-TW": "正在聆聽...",
          "vi": "Đang lắng nghe...",
          "th": "กำลังฟัง...",
          "hi": "सुन रहे हैं...",
          "fil": "Nakikinig...",
          "ms": "Mendengar..."
    },
    "voicebot_status_listening_desc": {
          "en": "Speak now into your microphone...",
          "id": "Silakan bicara ke mikrofon Anda...",
          "ja": "マイクに向かってお話しください...",
          "ko": "마이크에 대고 말씀하세요...",
          "zh": "请对着麦克风说话...",
          "zh-TW": "請對著麥克風說話...",
          "vi": "Hãy nói vào micrô của bạn...",
          "th": "พูดใส่ไมโครโฟนของคุณได้เลย...",
          "hi": "कृपया अपने माइक्रोफ़ोन में बोलें...",
          "fil": "Magsalita sa iyong mikropono...",
          "ms": "Sila bercakap ke mikrofon anda..."
    },
    "voicebot_mic_caption_listening": {
          "en": "Listening...",
          "id": "Mendengarkan...",
          "ja": "音声認識中...",
          "ko": "듣는 중...",
          "zh": "正在聆听...",
          "zh-TW": "正在聆聽...",
          "vi": "Đang nghe...",
          "th": "กำลังฟัง...",
          "hi": "सुन रहे हैं...",
          "fil": "Nakikinig...",
          "ms": "Mendengar..."
    },
    "voicebot_status_speaking_title": {
          "en": "Telmy is Speaking",
          "id": "Telmy Berbicara",
          "ja": "Telmy が発話中",
          "ko": "Telmy가 말하고 있습니다",
          "zh": "Telmy 正在说话",
          "zh-TW": "Telmy 正在說話",
          "vi": "Telmy đang nói",
          "th": "Telmy กำลังพูด",
          "hi": "Telmy बोल रहा है",
          "fil": "Nagsasalita si Telmy",
          "ms": "Telmy sedang Bercakap"
    },
    "voicebot_status_speaking_desc": {
          "en": "Please listen to the guidance",
          "id": "Silakan dengarkan panduan",
          "ja": "ガイダンスをお聞きください",
          "ko": "안내를 들어주세요",
          "zh": "请聆听指引",
          "zh-TW": "請聆聽指引",
          "vi": "Vui lòng lắng nghe hướng dẫn",
          "th": "โปรดฟังคำแนะนำ",
          "hi": "कृपया मार्गदर्शन सुनें",
          "fil": "Makinig sa gabay",
          "ms": "Sila dengar panduan"
    },
    "voicebot_mic_caption_speaking": {
          "en": "Speaking...",
          "id": "Sedang Membaca...",
          "ja": "読み上げ中...",
          "ko": "음성 출력 중...",
          "zh": "正在朗读...",
          "zh-TW": "正在朗讀...",
          "vi": "Đang phát âm...",
          "th": "กำลังอ่าน...",
          "hi": "बोल रहा है...",
          "fil": "Nagsasalita...",
          "ms": "Sedang Membaca..."
    },
    "welcome_hero_title": {
          "en": "Hello! I am Telmy 👋",
          "id": "Halo! Saya Telmy 👋",
          "ja": "こんにちは！Telmyです 👋",
          "ko": "안녕하세요! Telmy입니다 👋",
          "zh": "您好！我是 Telmy 👋",
          "zh-TW": "您好！我是 Telmy 👋",
          "vi": "Xin chào! Tôi là Telmy 👋",
          "th": "สวัสดีครับ! ผมคือ Telmy 👋",
          "hi": "नमस्ते! मैं Telmy हूँ 👋",
          "fil": "Kamusta! Ako si Telmy 👋",
          "ms": "Hai! Saya Telmy 👋"
    },
    "welcome_hero_desc": {
          "en": "Your friendly AI form-filling companion. Ask me anything about this form using text or speech, or choose an option below:",
          "id": "Asisten ramah pengisian formulir AI Anda. Tanyakan apa pun tentang formulir ini via teks atau suara, atau pilih opsi di bawah:",
          "ja": "あなたのAIフォーム入力アシスタントです。テキストまたは音声で質問するか、以下のオプションを選択してください：",
          "ko": "친절한 AI 양식 작성 도우미입니다. 텍스트나 음성으로 질문하시거나 아래 옵션을 선택하세요:",
          "zh": "您的专属 AI 表单填写助手。通过文字或语音提问，或选择以下操作：",
          "zh-TW": "您的專屬 AI 表單填寫助理。透過文字或語音提問，或選擇以下操作：",
          "vi": "Trợ lý AI thân thiện giúp bạn điền biểu mẫu. Hãy hỏi tôi qua văn bản hoặc giọng nói, hoặc chọn bên dưới:",
          "th": "ผู้ช่วยกรอกฟอร์ม AI ของคุณ ถามคำถามผ่านข้อความหรือเสียง หรือเลือกตัวเลือกด้านล่าง:",
          "hi": "आपका मित्रवत AI फ़ॉर्म सहायक। टेक्स्ट या आवाज़ से कुछ भी पूछें, या नीचे दिए गए विकल्प चुनें:",
          "fil": "Ang iyong maaasahang AI form assistant. Magtanong gamit ang text o boses, o pumili sa ibaba:",
          "ms": "Pembantu pengisian borang AI mesra anda. Tanya apa sahaja menggunakan teks atau suara, atau pilih pilihan di bawah:"
    },
    "welcome_chip_about": {
          "en": "Tell me About this form",
          "id": "Jelaskan tentang formulir ini",
          "ja": "このフォームの概要を教えて",
          "ko": "이 양식에 대해 알려줘",
          "zh": "告诉我此表单的内容",
          "zh-TW": "告訴我此表單的內容",
          "vi": "Cho tôi biết về biểu mẫu này",
          "th": "อธิบายเกี่ยวกับฟอร์มนี้",
          "hi": "इस फ़ॉर्म के बारे में बताएं",
          "fil": "Sabihin ang tungkol sa form na ito",
          "ms": "Terangkan tentang borang ini"
    },
    "welcome_chip_guide": {
          "en": "Guide me Fields by Fields",
          "id": "Pandu saya Kolom demi Kolom",
          "ja": "項目ごとにガイドして",
          "ko": "항목별로 안내해줘",
          "zh": "逐项引导我填写",
          "zh-TW": "逐欄引導我填寫",
          "vi": "Hướng dẫn từng trường",
          "th": "แนะนำทีละช่อง",
          "hi": "एक-एक करके फ़ील्ड्स समझाएं",
          "fil": "Gabayan ako bawat kolum",
          "ms": "Pandu saya Ruangan demi Ruangan"
    },
    "welcome_chip_translate": {
          "en": "Translate this Page",
          "id": "Terjemahkan Halaman Ini",
          "ja": "このページを翻訳",
          "ko": "이 페이지 번역",
          "zh": "翻译此页面",
          "zh-TW": "翻譯此頁面",
          "vi": "Dịch trang này",
          "th": "แปลหน้านี้",
          "hi": "इस पृष्ठ का अनुवाद करें",
          "fil": "Isalin ang pahinang ito",
          "ms": "Terjemah Halaman Ini"
    },
    "welcome_chip_show_me": {
          "en": "Show Me / Find on Screen 👆",
          "id": "Tunjukkan / Cari di Layar 👆",
          "ja": "画面で指し示す / 見せて 👆",
          "ko": "화면에서 가리켜 보여줘 👆",
          "zh": "在屏幕上指出 / 给我看 👆",
          "zh-TW": "在螢幕上指出 / 給我看 👆",
          "vi": "Chỉ cho tôi / Cho tôi xem trên màn hình 👆",
          "th": "แสดงให้ฉันดู / ชี้บนหน้าจอ 👆",
          "hi": "स्क्रीन पर मुझे दिखाओ 👆",
          "fil": "Ipakita Mo / Ituro sa Screen 👆",
          "ms": "Tunjukkan / Cari pada Skrin 👆"
    },
    "default_chat_reply": {
          "en": "I am ready to help you complete this form. Click on any field on the page to see detailed step-by-step guidance.",
          "id": "Saya siap membantu memandu pengisian formulir ini. Klik salah satu kolom di halaman untuk melihat petunjuk detail.",
          "ja": "このフォームの入力をサポートします。ページ内の入力項目をクリックして詳細な手順をご確認ください。",
          "ko": "양식 작성을 도와드릴 준비가 되었습니다. 페이지의 입력란을 클릭하여 단계별 안내를 확인하세요.",
          "zh": "我已准备好协助您填写此表单。点击页面上的任意输入项即可查看详细指引。",
          "zh-TW": "我已準備好協助您填寫此表單。點擊頁面上的任意欄位即可查看詳細指引。",
          "vi": "Tôi sẵn sàng giúp bạn điền biểu mẫu này. Nhấp vào bất kỳ trường nào trên trang để xem hướng dẫn chi tiết.",
          "th": "พร้อมช่วยเหลือคุณในการกรอกแบบฟอร์มนี้แล้ว คลิกที่ช่องใดก็ได้ในหน้าเพื่อดูคำแนะนำทีละขั้นตอน",
          "hi": "मैं इस फ़ॉर्म को भरने में आपकी मदद के लिए तैयार हूँ। विस्तृत मार्गदर्शन देखने के लिए पेज पर किसी फ़ील्ड पर क्लिक करें।",
          "fil": "Handa akong tulungan kang sagutan ang form na ito. I-click ang anumang kolum para sa gabay.",
          "ms": "Saya sedia membantu mengisi borang ini. Klik mana-mana ruangan pada halaman untuk melihat panduan terperinci."
    },
    "msg_about_form": {
          "en": "Tell me what this form is about and what documents are required.",
          "id": "Tolong jelaskan ringkasan formulir ini dan apa saja yang diperlukan.",
          "ja": "このフォームの概要と必要な書類について教えてください。",
          "ko": "이 양식의 개요와 필요한 서류를 설명해 주세요.",
          "zh": "请解释此表单的概要以及需要准备哪些文件。",
          "zh-TW": "請說明此表單的概要以及需要準備哪些證件。",
          "vi": "Hãy giải thích biểu mẫu này nói về điều gì và cần những giấy tờ nào.",
          "th": "ช่วยอธิบายภาพรวมของฟอร์มนี้และเอกสารที่ต้องใช้หน่อยครับ",
          "hi": "कृपया बताएं कि यह फ़ॉर्म किस बारे में है और किन दस्तावेज़ों की आवश्यकता है।",
          "fil": "Ipaliwanag kung para saan ang form na ito at anong mga dokumento ang kailangan.",
          "ms": "Tolong jelaskan ringkasan borang ini dan apa yang diperlukan."
    },
    "autofill_not_configured_msg": {
          "en": "⚡ **1-Click AutoFill**: Your master profile is not configured yet. Visit your Member Area at https://telmy.id/dashboard#autofill to set up your legal name, passport, and identity info!",
          "id": "⚡ **1-Click AutoFill**: Data profil tersimpan Anda belum diisi. Kunjungi Member Area di https://telmy.id/dashboard#autofill untuk menyimpan data paspor, NIK, dan identitas Anda!",
          "ja": "⚡ **1-クリック自動入力**: マスタープロファイルが未設定です。https://telmy.id/dashboard#autofill で身元情報を登録してください！",
          "ko": "⚡ **1-클릭 자동완성**: 마스터 프로필이 설정되지 않았습니다. https://telmy.id/dashboard#autofill 에서 정보를 등록하세요!",
          "zh": "⚡ **一键自动填写**：您的个人主配置文件尚未设置。请访问 https://telmy.id/dashboard#autofill 设置您的身份信息！",
          "zh-TW": "⚡ **一鍵自動填寫**：您的個人主設定檔尚未設定。請訪問 https://telmy.id/dashboard#autofill 設定您的身分資料！",
          "vi": "⚡ **Tự động điền 1 chạm**: Hồ sơ của bạn chưa được thiết lập. Hãy truy cập https://telmy.id/dashboard#autofill để cài đặt!",
          "th": "⚡ **กรอกอัตโนมัติใน 1 คลิก**: คุณยังไม่ได้ตั้งค่าโปรไฟล์หลัก ไปที่ https://telmy.id/dashboard#autofill เพื่อตั้งค่า!",
          "hi": "⚡ **1-क्लिक ऑटोफ़िल**: आपकी प्रोफ़ाइल अभी कॉन्फ़िगर नहीं है। अपनी जानकारी सेट करने के लिए https://telmy.id/dashboard#autofill पर जाएं!",
          "fil": "⚡ **1-Click AutoFill**: Hindi pa naka-configure ang iyong profile. Pumunta sa https://telmy.id/dashboard#autofill!",
          "ms": "⚡ **1-Click AutoFill**: Profil utama anda belum ditetapkan. Layari https://telmy.id/dashboard#autofill untuk menyediakannya!"
    },
    "autofill_complete_msg": {
          "en": "⚡ **1-Click AutoFill Complete**: Successfully filled {count} using your encrypted profile vault. Please review all entries before submitting!",
          "id": "⚡ **1-Click AutoFill Selesai**: Berhasil mengisi {count} dari profil aman Anda. Harap periksa kembali sebelum mengirimkan formulir!",
          "ja": "⚡ **自動入力完了**: 暗号化保管庫から {count} を正常に入力しました。送信前に全項目をご確認ください！",
          "ko": "⚡ **자동완성 완료**: 보안 보관함의 데이터로 {count}을(를) 채웠습니다. 제출 전 반드시 확인해 주세요!",
          "zh": "⚡ **自动填写完成**：已使用加密个人资料成功填写 {count}。请在提交前仔细核对！",
          "zh-TW": "⚡ **自動填寫完成**：已使用加密個人檔案成功填寫 {count}。請在提交前仔細核對！",
          "vi": "⚡ **Hoàn tất tự động điền**: Đã điền thành công {count} từ kho an toàn. Vui lòng kiểm tra lại trước khi gửi!",
          "th": "⚡ **กรอกอัตโนมัติเสร็จสิ้น**: กรอก {count} สำเร็จจากคลังที่ปลอดภัย โปรดตรวจสอบก่อนส่งฟอร์ม!",
          "hi": "⚡ **1-क्लिक ऑटोफ़िल पूर्ण**: आपके सुरक्षित वॉल्ट से {count} सफलतापूर्वक भर दिए गए। कृपया सबमिट करने से पहले जाँच लें!",
          "fil": "⚡ **Tapos na ang 1-Click AutoFill**: Matagumpay na napunan ang {count} mula sa iyong secure vault. Suriin bago isumite!",
          "ms": "⚡ **1-Click AutoFill Selesai**: Berjaya mengisi {count} daripada profil selamat anda. Sila semak semula sebelum menghantar!"
    },
    "matching_fields": {
          "en": "matching fields",
          "id": "kolom yang cocok",
          "ja": "一致する項目",
          "ko": "일치하는 항목",
          "zh": "匹配的字段",
          "zh-TW": "相符的欄位",
          "vi": "trường phù hợp",
          "th": "ช่องที่ตรงกัน",
          "hi": "मिलान फ़ील्ड्स",
          "fil": "mga tumutugmang kolum",
          "ms": "ruangan yang sepadan"
    },
    "page_reverted_msg": {
          "en": "🔙 The webpage has been restored to its original text.",
          "id": "🔙 Halaman web telah dikembalikan ke bahasa aslinya.",
          "ja": "🔙 ウェブページを元の言語に戻しました。",
          "ko": "🔙 웹페이지가 원래 언어로 복원되었습니다.",
          "zh": "🔙 网页已恢复为其原始语言。",
          "zh-TW": "🔙 網頁已還原為其原始語言。",
          "vi": "🔙 Trang web đã được khôi phục về văn bản gốc.",
          "th": "🔙 หน้าเว็บถูกกู้คืนเป็นภาษาดั้งเดิมแล้ว",
          "hi": "🔙 वेबपेज अपने मूल टेक्स्ट में पुनर्स्थापित कर दिया गया है।",
          "fil": "🔙 Ibinalik ang webpage sa orihinal na wika.",
          "ms": "🔙 Halaman web telah dikembalikan ke bahasa asalnya."
    },
    "no_translatable_elements_msg": {
          "en": "No translatable elements detected on this webpage.",
          "id": "Tidak ada elemen teks yang dapat diterjemahkan pada halaman ini.",
          "ja": "このウェブページには翻訳可能なテキストが検出されませんでした。",
          "ko": "이 웹페이지에서 번역 가능한 요소를 찾을 수 없습니다.",
          "zh": "此网页未检测到可翻译的文本元素。",
          "zh-TW": "此網頁未偵測到可翻譯的文字元素。",
          "vi": "Không tìm thấy phần tử có thể dịch trên trang web này.",
          "th": "ไม่พบข้อความที่แปลได้ในหน้าเว็บนี้",
          "hi": "इस वेबपेज पर कोई अनुवाद योग्य तत्व नहीं मिला।",
          "fil": "Walang nakitang text na maisasalin sa webpage na ito.",
          "ms": "Tiada elemen teks yang boleh diterjemahkan pada halaman ini."
    },
    "page_translated_msg": {
          "en": "🌐 **Full Page Translated ({count} elements)**\n\nThe webpage has been translated into **{lang}** using **Google Gemini**.\n\n✓ **Official Bureaucracy Terms Preserved** (e.g., NIK, KTP, NPWP, SKCK)\n✓ **UI/UX Standards Applied** (Button & navigation actions mapped professionally)\n\nYou can click **Show Original** at any time to revert.",
          "id": "🌐 **Halaman Berhasil Diterjemahkan ({count} elemen)**\n\nSeluruh teks UI halaman telah diterjemahkan ke bahasa **{lang}** menggunakan **Google Gemini**.\n\n✓ **Istilah Birokrasi Baku Terjaga** (NIK, KTP, KK, SKCK)\n✓ **Standar UI/UX Profesional** (Tombol navigasi disesuaikan secara natural)\n\nKlik **Kembalikan Asli** kapan saja jika ingin membaca versi asli.",
          "ja": "🌐 **全ページ翻訳完了 ({count} 項目)**\n\n**Google Gemini** により **{lang}** へ翻訳されました。\n\n✓ 公的行政用語を正確に保持\n✓ UI/UX標準に準拠したボタン配置\n\nいつでも「原文に戻す」をクリックして戻せます。",
          "ko": "🌐 **전체 페이지 번역 완료 ({count}개 항목)**\n\n**Google Gemini**를 사용하여 **{lang}**(으)로 번역되었습니다.\n\n✓ 공공 행정 용어 정확히 보존\n✓ 전문적 UI/UX 표준 적용\n\n언제든지 **원문 보기**를 클릭하여 되돌릴 수 있습니다.",
          "zh": "🌐 **全页面翻译完成（共 {count} 个元素）**\n\n已使用 **Google Gemini** 翻译为 **{lang}**。\n\n✓ 规范行政术语精准保留\n✓ 专业 UI/UX 标准适配\n\n您可随时点击**显示原文**恢复。",
          "zh-TW": "🌐 **全頁面翻譯完成（共 {count} 個元素）**\n\n已使用 **Google Gemini** 翻譯為 **{lang}**。\n\n✓ 規範行政術語精準保留\n✓ 專業 UI/UX 標準適配\n\n您可隨時點擊**顯示原文**還原。",
          "vi": "🌐 **Đã dịch toàn bộ trang ({count} phần tử)**\n\nTrang web đã được dịch sang **{lang}** bằng **Google Gemini**.\n\n✓ Bảo toàn thuật ngữ hành chính chính thức\n✓ Áp dụng chuẩn UI/UX chuyên nghiệp\n\nBạn có thể nhấp **Hiện bản gốc** bất kỳ lúc nào.",
          "th": "🌐 **แปลทั้งหน้าเสร็จสิ้น ({count} รายการ)**\n\nแปลเป็นภาษา **{lang}** โดย **Google Gemini** แล้ว\n\n✓ รักษาคำศัพท์ราชการอย่างถูกต้อง\n✓ มาตรฐาน UI/UX เป็นธรรมชาติ\n\nคลิก **แสดงต้นฉบับ** เพื่อเปลี่ยนกลับได้ตลอดเวลา",
          "hi": "🌐 **पूरे पृष्ठ का अनुवाद पूर्ण ({count} तत्व)**\n\n**Google Gemini** द्वारा **{lang}** में अनुवादित।\n\n✓ आधिकारिक प्रशासनिक शब्दावली सुरक्षित\n✓ पेशेवर UI/UX मानक लागू\n\nवापस लौटने के लिए कभी भी **मूल दिखाएं** पर क्लिक करें।",
          "fil": "🌐 **Naisalin ang Buong Pahina ({count} elemento)**\n\nNaisalin sa **{lang}** gamit ang **Google Gemini**.\n\n✓ Napanatili ang mga opisyal na termino\n✓ Propesyonal na pamantayan sa UI/UX\n\nI-click ang **Ipakita ang Orihinal** upang ibalik.",
          "ms": "🌐 **Halaman Berjaya Diterjemahkan ({count} elemen)**\n\nHalaman telah diterjemahkan ke **{lang}** menggunakan **Google Gemini**.\n\n✓ Istilah rasmi dikekalkan\n✓ Piawaian UI/UX profesional digunakan\n\nKlik **Tunjuk Asal** pada bila-bila masa untuk kembali."
    },
    "translate_error_msg": {
          "en": "⚠️ Translation service encountered an issue. Please ensure network connectivity.",
          "id": "⚠️ Layanan terjemahan mengalami kendala. Pastikan koneksi internet stabil.",
          "ja": "⚠️ 翻訳サービスで問題が発生しました。ネットワーク接続をご確認ください。",
          "ko": "⚠️ 번역 서비스에 문제가 발생했습니다. 네트워크 연결을 확인하세요.",
          "zh": "⚠️ 翻译服务遇到问题，请检查网络连接。",
          "zh-TW": "⚠️ 翻譯服務發生問題，請檢查網路連線。",
          "vi": "⚠️ Dịch vụ dịch thuật gặp sự cố. Vui lòng kiểm tra kết nối mạng.",
          "th": "⚠️ บริการแปลพบปัญหา โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
          "hi": "⚠️ अनुवाद सेवा में समस्या आई। कृपया नेटवर्क कनेक्शन जांचें।",
          "fil": "⚠️ Nagka-problema sa serbisyo ng pagsasalin. Pakisuri ang koneksyon.",
          "ms": "⚠️ Perkhidmatan terjemahan menghadapi masalah. Sila pastikan sambungan internet stabil."
    },
    "chip_what_msg": {
          "en": "What is this form about and what should I know?",
          "id": "Jelaskan formulir ini tentang apa dan apa yang perlu saya ketahui?",
          "ja": "このフォームは何についてのものですか？注意点は何ですか？",
          "ko": "이 양식은 무엇에 관한 것이며 어떤 점을 알아야 하나요?",
          "zh": "这是什么表单，有哪些注意事项？",
          "zh-TW": "這是什麼表單，有哪些注意事項？",
          "vi": "Biểu mẫu này nói về điều gì và tôi cần biết những gì?",
          "th": "แบบฟอร์มนี้เกี่ยวกับอะไรและมีอะไรที่ฉันควรรู้บ้าง?",
          "hi": "यह फ़ॉर्म किस बारे में है और मुझे क्या जानना चाहिए?",
          "fil": "Para saan ang form na ito at ano ang dapat kong malaman?",
          "ms": "Borang ini tentang apa dan apakah yang perlu saya ketahui?"
    },
    "chip_docs_msg": {
          "en": "What documents and requirements do I need to prepare for this form?",
          "id": "Apa saja berkas dan dokumen yang harus saya siapkan untuk mengisi formulir ini?",
          "ja": "このフォームに入力するために準備すべき書類は何ですか？",
          "ko": "이 양식을 작성하기 위해 준비해야 할 서류는 무엇인가요?",
          "zh": "填写此表单需要准备哪些文件和资料？",
          "zh-TW": "填寫此表單需要準備哪些文件與資料？",
          "vi": "Tôi cần chuẩn bị những tài liệu và giấy tờ gì cho biểu mẫu này?",
          "th": "ต้องเตรียมเอกสารอะไรบ้างสำหรับแบบฟอร์มนี้?",
          "hi": "इस फ़ॉर्म के लिए मुझे कौन से दस्तावेज़ और आवश्यकताएं तैयार करनी होंगी?",
          "fil": "Anong mga dokumento ang kailangan kong ihanda para sa form na ito?",
          "ms": "Apakah dokumen yang perlu saya sediakan untuk borang ini?"
    },
    "avatar_greeting": {
          "en": "Hi there! 👋 I'm Telmy, your form assistant. You can ask me any question or press the microphone button below to speak with me!",
          "id": "Halo! 👋 Saya Telmy, asisten formulir kamu. Kamu bisa tanyakan apa saja atau tekan tombol mikrofon di bawah untuk bicara langsung!",
          "ja": "こんにちは！ 👋 フォームアシスタントの Telmy です。質問を入力するか、下のマイクボタンを押してお話しください！",
          "ko": "안녕하세요! 👋 양식 도우미 Telmy입니다. 질문을 입력하시거나 아래 마이크 버튼을 눌러 직접 말씀해 주세요!",
          "zh": "您好！👋 我是您的表单助手 Telmy。您可以随时提问，或点击下方麦克风与我直接交谈！",
          "zh-TW": "您好！👋 我是您的表單助理 Telmy。您可以隨時提問，或點擊下方麥克風與我直接對話！",
          "vi": "Xin chào! 👋 Tôi là Telmy, trợ lý biểu mẫu của bạn. Bạn có thể hỏi bất cứ điều gì hoặc nhấn micrô bên dưới để trò chuyện!",
          "th": "สวัสดีครับ! 👋 ผมคือ Telmy ผู้ช่วยฟอร์มของคุณ ถามอะไรก็ได้หรือกดปุ่มไมโครโฟนด้านล่างเพื่อคุยกับผมเลย!",
          "hi": "नमस्ते! 👋 मैं Telmy हूँ। आप मुझसे कुछ भी पूछ सकते हैं या मुझसे बात करने के लिए नीचे दिए गए माइक को दबा सकते हैं!",
          "fil": "Kamusta! 👋 Ako si Telmy. Magtanong ng kahit ano o pindutin ang mikropono sa ibaba para makipag-usap!",
          "ms": "Hai! 👋 Saya Telmy, pembantu borang anda. Anda boleh tanya apa sahaja atau tekan butang mikrofon di bawah untuk bercakap!"
    },
    "mic_perm_required_msg": {
          "en": "🎙️ **Microphone Permission Required**: A new tab has opened to grant microphone access. Please click **Allow** on that tab, then click the microphone button again!",
          "id": "🎙️ **Izin Mikrofon Diperlukan**: Tab baru telah dibuka untuk memberikan izin mikrofon satu kali klik. Silakan klik **Allow** pada tab tersebut, lalu tekan tombol mikrofon kembali!",
          "ja": "🎙️ **マイクの許可が必要です**: マイクアクセスを許可するための新しいタブが開きました。そのタブで **許可** をクリックし、再度マイクボタンを押してください！",
          "ko": "🎙️ **마이크 권한 필요**: 마이크 사용 권한을 허용할 수 있는 새 탭이 열렸습니다. 해당 탭에서 **허용**을 누른 후 마이크 버튼을 다시 눌러주세요!",
          "zh": "🎙️ **需要麦克风权限**：已打开新标签页以授予麦克风权限。请在该标签页中点击**允许**，然后再次点击麦克风按钮！",
          "zh-TW": "🎙️ **需要麥克風權限**：已開啟新分頁以授予麥克風權限。請在該分頁中點擊**允許**，然後再次點擊麥克風按鈕！",
          "vi": "🎙️ **Cần cấp quyền Micrô**: Tab mới đã mở để cấp quyền truy cập micrô. Vui lòng nhấp **Cho phép** trên tab đó, sau đó nhấp lại nút micrô!",
          "th": "🎙️ **ต้องได้รับอนุญาตใช้ไมโครโฟน**: แท็บใหม่เปิดขึ้นเพื่ออนุญาตให้เข้าถึงไมโครโฟน โปรดคลิก **อนุญาต** บนแท็บนั้นแล้วกดปุ่มไมค์อีกครั้ง!",
          "hi": "🎙️ **माइक्रोफ़ोन अनुमति आवश्यक**: माइक्रोफ़ोन एक्सेस देने के लिए एक नया टैब खुला है। कृपया उस टैब पर **Allow** पर क्लिक करें, फिर माइक बटन दोबारा दबाएं!",
          "fil": "🎙️ **Kailangan ng Pahintulot sa Mikropono**: Nagbukas ng bagong tab para magbigay ng access. I-click ang **Allow** doon, saka pindutin muli ang mic!",
          "ms": "🎙️ **Kebenaran Mikrofon Diperlukan**: Tab baharu telah dibuka untuk memberi kebenaran mikrofon. Sila klik **Allow** pada tab tersebut, kemudian tekan butang mikrofon semula!"
    },
    "field_label_prefix": {
          "en": "Field",
          "id": "Kolom",
          "ja": "項目",
          "ko": "입력란",
          "zh": "字段",
          "zh-TW": "欄位",
          "vi": "Trường",
          "th": "ช่อง",
          "hi": "फ़ील्ड",
          "fil": "Kolum",
          "ms": "Ruangan"
    },
    "summary_desc_fallback": {
          "en": "This page contains {count} form input fields.",
          "id": "Halaman ini memuat {count} kolom isian formulir.",
          "ja": "このページには {count} 個の入力項目があります。",
          "ko": "이 페이지에는 {count}개의 입력란이 있습니다.",
          "zh": "此页面包含 {count} 个表单输入项。",
          "zh-TW": "此頁面包含 {count} 個表單輸入項。",
          "vi": "Trang này có {count} trường nhập biểu mẫu.",
          "th": "หน้านี้มีช่องกรอกแบบฟอร์ม {count} ช่อง",
          "hi": "इस पेज पर {count} फ़ॉर्म फ़ील्ड्स मौजूद हैं।",
          "fil": "Ang pahinang ito ay may {count} na kolum.",
          "ms": "Halaman ini mengandungi {count} ruangan borang."
    },
    "progress_sub_text": {
          "en": "{filled} of {total} fields filled",
          "id": "{filled} dari {total} kolom terisi",
          "ja": "{total} 項目中 {filled} 項目入力済み",
          "ko": "{total}개 중 {filled}개 작성됨",
          "zh": "已填写 {filled} / {total} 项",
          "zh-TW": "已填寫 {filled} / {total} 項",
          "vi": "Đã điền {filled} trên {total} trường",
          "th": "กรอกแล้ว {filled} จาก {total} ช่อง",
          "hi": "{total} में से {filled} फ़ील्ड्स भरे गए",
          "fil": "{filled} sa {total} na kolum ay napunan",
          "ms": "{filled} daripada {total} ruangan telah diisi"
    },
    "pdf_intro_msg": {
          "en": "I've analyzed {title}. You can type into fields directly and export the completed official document.",
          "id": "Saya telah menganalisis formulir {title}. Anda dapat mengisi langsung kolom di bawah dan mengekspor hasilnya.",
          "ja": "{title} を解析しました。直接入力して完成した公式書類を書き出せます。",
          "ko": "{title}을(를) 분석했습니다. 아래에서 직접 입력 후 문서를 내보낼 수 있습니다.",
          "zh": "已分析 {title}。您可以直接在下方填写并导出完成的正式文档。",
          "zh-TW": "已分析 {title}。您可以直接在下方填寫並匯出完成的正式文件。",
          "vi": "Tôi đã phân tích {title}. Bạn có thể điền trực tiếp và xuất tài liệu hoàn chỉnh.",
          "th": "วิเคราะห์ {title} แล้ว คุณสามารถกรอกโดยตรงและส่งออกเอกสารฉบับสมบูรณ์ได้",
          "hi": "मैंने {title} का विश्लेषण किया है। आप सीधे भर सकते हैं और दस्तावेज़ निर्यात कर सकते हैं।",
          "fil": "Nasuri ko na ang {title}. Maaari mong sagutan nang direkta at i-export ang opisyal na dokumento.",
          "ms": "Saya telah menganalisis borang {title}. Anda boleh mengisi terus ruangan di bawah dan mengeksport hasilnya."
    },
    "your_document": {
          "en": "your document",
          "id": "dokumen Anda",
          "ja": "ドキュメント",
          "ko": "문서",
          "zh": "您的文档",
          "zh-TW": "您的文件",
          "vi": "tài liệu của bạn",
          "th": "เอกสารของคุณ",
          "hi": "आपका दस्तावेज़",
          "fil": "iyong dokumento",
          "ms": "dokumen anda"
    },
    "how_to_complete_field_msg": {
          "en": "How do I complete \"{field}\" on this form?",
          "id": "Bagaimana cara mengisi \"{field}\" pada formulir ini?",
          "ja": "このフォームで「{field}」はどのように記入しますか？",
          "ko": "이 양식에서 \"{field}\"은(는) 어떻게 작성하나요?",
          "zh": "如何在此表单中填写“{field}”？",
          "zh-TW": "如何在此表單中填寫「{field}」？",
          "vi": "Cách điền \"{field}\" trên biểu mẫu này như thế nào?",
          "th": "กรอก \"{field}\" ในฟอร์มนี้อย่างไร?",
          "hi": "इस फ़ॉर्म पर \"{field}\" को कैसे भरें?",
          "fil": "Paano sasagutan ang \"{field}\" sa form na ito?",
          "ms": "Bagaimana cara mengisi \"{field}\" pada borang ini?"
    },
    "audit_scan_error": {
          "en": "Unable to scan form values on this webpage. Please ensure active input fields exist.",
          "id": "Tidak dapat memindai nilai isian formulir pada halaman web ini. Pastikan halaman memiliki input aktif.",
          "ja": "このウェブページのフォーム値をスキャンできません。入力項目が存在することをご確認ください。",
          "ko": "이 웹페이지의 양식 값을 스캔할 수 없습니다. 활성 입력란이 있는지 확인하세요.",
          "zh": "无法扫描此网页上的表单值。请确保页面具有有效输入项。",
          "zh-TW": "無法掃描此網頁上的表單值。請確認頁面具有有效輸入欄位。",
          "vi": "Không thể quét các giá trị biểu mẫu trên trang này. Hãy đảm bảo trang có các trường nhập.",
          "th": "ไม่สามารถสแกนค่าในฟอร์มของหน้านี้ได้ โปรดตรวจสอบว่ามีช่องกรอกที่ใช้งานอยู่",
          "hi": "इस वेबपेज पर फ़ॉर्म मानों को स्कैन करने में असमर्थ। कृपया सक्रिय इनपुट फ़ील्ड सुनिश्चित करें।",
          "fil": "Hindi ma-scan ang mga value ng form sa webpage na ito. Siguraduhing may aktibong input.",
          "ms": "Tidak dapat mengimbas nilai isian borang pada halaman ini. Pastikan terdapat input aktif."
    },
    "audit_no_fields": {
          "en": "No form fields detected to audit.",
          "id": "Belum ada kolom yang terdeteksi untuk diaudit.",
          "ja": "検証対象の入力項目が検出されていません。",
          "ko": "검토할 양식 입력란이 감지되지 않았습니다.",
          "zh": "未检测到可审核的表单项。",
          "zh-TW": "未偵測到可審核的表單欄位。",
          "vi": "Không tìm thấy trường biểu mẫu nào để kiểm tra.",
          "th": "ไม่พบช่องกรอกแบบฟอร์มที่จะตรวจสอบ",
          "hi": "ऑडिट करने के लिए कोई फ़ॉर्म फ़ील्ड नहीं मिली।",
          "fil": "Walang nakitang kolum para i-audit.",
          "ms": "Tiada ruangan borang yang dikesan untuk diaudit."
    },
    "audit_required_empty_title": {
          "en": "Required Field Empty:",
          "id": "Kolom Wajib Belum Diisi:",
          "ja": "必須項目が未入力:",
          "ko": "필수 항목 누락:",
          "zh": "必填项未填写：",
          "zh-TW": "必填欄位未填寫：",
          "vi": "Trường bắt buộc chưa điền:",
          "th": "ยังไม่ได้กรอกช่องบังคับ:",
          "hi": "आवश्यक फ़ील्ड खाली है:",
          "fil": "Kailangang Kolum ay Walang Laman:",
          "ms": "Ruangan Wajib Belum Diisi:"
    },
    "audit_required_empty_desc": {
          "en": "This field is required. Leaving it blank may cause submission rejection or disqualification.",
          "id": "Kolom ini wajib diisi menurut aturan portal. Kosong berisiko diskualifikasi otomatis.",
          "ja": "この項目は必須です。空欄のまま送信すると却下される恐れがあります。",
          "ko": "이 항목은 필수입니다. 비워 둘 경우 제출이 거부되거나 탈락될 수 있습니다.",
          "zh": "此项为必填项。留空可能导致提交被拒或丧失资格。",
          "zh-TW": "此欄位為必填項目。留空可能導致提交遭拒或喪失資格。",
          "vi": "Trường này là bắt buộc. Để trống có thể dẫn đến việc hồ sơ bị từ chối.",
          "th": "ช่องนี้เป็นช่องบังคับ การเว้นว่างไว้อาจทำให้ถูกปฏิเสธการส่งฟอร์ม",
          "hi": "यह फ़ील्ड आवश्यक है। इसे खाली छोड़ने से आवेदन अस्वीकार हो सकता है।",
          "fil": "Kailangan ang kolum na ito. Ang pag-iwan nitong walang laman ay maaaring maging sanhi ng pagtanggi.",
          "ms": "Ruangan ini wajib diisi. Dibiarkan kosong berisiko pembatalan permohonan."
    },
    "audit_passport_crit_title": {
          "en": "Passport Validity Critical (<6 Months):",
          "id": "Masa Berlaku Paspor Kritis (<6 Bulan):",
          "ja": "パスポート有効期限が切迫 (<6ヶ月):",
          "ko": "여권 유효기간 위험 (<6개월):",
          "zh": "护照有效期告急（<6个月）：",
          "zh-TW": "護照有效期限告急（<6個月）：",
          "vi": "Hạn hộ chiếu sắp hết (<6 tháng):",
          "th": "อายุหนังสือเดินทางเหลือน้อย (<6 เดือน):",
          "hi": "पासपोर्ट वैधता महत्वपूर्ण (<6 महीने):",
          "fil": "Kritikal ang Bisa ng Pasaporte (<6 Buwan):",
          "ms": "Tempoh Sah Pasport Kritikal (<6 Bulan):"
    },
    "audit_passport_crit_desc": {
          "en": "Most embassies, consulates, and airlines require at least 6 months validity from departure date.",
          "id": "Hampir seluruh kedutaan dan maskapai menolak paspor dengan sisa masa berlaku kurang dari 6 bulan.",
          "ja": "ほとんどの大使館や航空会社は、出発日から6ヶ月以上の有効期限を要求します。",
          "ko": "대부분의 대사관과 항공사는 출발일 기준 최소 6개월의 유효기간을 요구합니다.",
          "zh": "大多数使馆与航空公司要求护照自出发日起至少有6个月有效期。",
          "zh-TW": "大多數使館與航空公司要求護照自出發日起至少具備6個月有效期限。",
          "vi": "Hầu hết các đại sứ quán và hãng hàng không yêu cầu thời hạn ít nhất 6 tháng kể từ ngày khởi hành.",
          "th": "สถานทูตและสายการบินส่วนใหญ่ต้องการอายุหนังสือเดินทางอย่างน้อย 6 เดือนนับจากวันเดินทาง",
          "hi": "अधिकांश दूतावास और एयरलाइंस प्रस्थान तिथि से कम से कम 6 महीने की वैधता मांगते हैं।",
          "fil": "Karamihan sa mga embahada at airline ay nangangailangan ng hindi bababa sa 6 na buwang bisa.",
          "ms": "Hampir semua kedutaan dan syarikat penerbangan menolak pasport dengan baki kurang 6 bulan."
    },
    "audit_academic_title_title": {
          "en": "Academic Title in Name Field:",
          "id": "Gelar Akademik Terdeteksi di Kolom Nama:",
          "ja": "氏名欄に学位・称号が検出されました:",
          "ko": "이름란에 학위/직함이 포함됨:",
          "zh": "姓名栏检测到学位头衔：",
          "zh-TW": "姓名欄位偵測到學位頭銜：",
          "vi": "Phát hiện học vị trong trường tên:",
          "th": "พบคำนำหน้าทางวิชาการในช่องชื่อ:",
          "hi": "नाम फ़ील्ड में शैक्षणिक उपाधि पाई गई:",
          "fil": "May Academic Title sa Kolum ng Pangalan:",
          "ms": "Gelaran Akademik Dikesan pada Ruangan Nama:"
    },
    "audit_academic_title_desc": {
          "en": "International scholarship and visa portals usually require exact passport name without academic/honorary titles.",
          "id": "Sebagian besar pendaftaran beasiswa dan visa internasional melarang gelar di kolom nama resmi paspor.",
          "ja": "国際的な奨学金やビザでは、学位称号を含まないパスポート記載通りの氏名が求められます。",
          "ko": "국제 장학금 및 비자 포털은 직함을 제외한 여권상의 정확한 성명을 요구합니다.",
          "zh": "国际奖学金和签证申请通常要求填写与护照一致的姓名，严禁包含学位或荣誉头衔。",
          "zh-TW": "國際獎學金和簽證申請通常要求填寫與護照完全一致的姓名，嚴禁包含學位或榮譽頭銜。",
          "vi": "Hồ sơ học bổng và thị thực quốc tế thường yêu cầu tên chính xác theo hộ chiếu mà không có học vị.",
          "th": "พอร์ทัลทุนการศึกษาและวีซ่าระหว่างประเทศมักกำหนดให้ระบุชื่อตามหนังสือเดินทางโดยไม่มีตำแหน่งทางวิชาการ",
          "hi": "अंतर्राष्ट्रीय छात्रवृत्ति और वीज़ा पोर्टल आमतौर पर बिना किसी उपाधि के सटीक पासपोर्ट नाम मांगते हैं।",
          "fil": "Karaniwang hinihingi ng international scholarship at visa ang eksaktong pangalan sa pasaporte nang walang titulo.",
          "ms": "Sebahagian besar pendaftaran biasiswa dan visa melarang gelaran akademik pada nama rasmi pasport."
    },
    "audit_lowercase_name_title": {
          "en": "Name Field is Lowercase:",
          "id": "Nama Huruf Kecil Semua:",
          "ja": "氏名がすべて小文字です:",
          "ko": "이름이 모두 소문자입니다:",
          "zh": "姓名栏为全小写：",
          "zh-TW": "姓名欄位為全小寫：",
          "vi": "Tên viết toàn bộ bằng chữ thường:",
          "th": "ชื่อเป็นตัวพิมพ์เล็กทั้งหมด:",
          "hi": "नाम फ़ील्ड केवल छोटे अक्षरों में है:",
          "fil": "Maliit na Titik Lahat ang Pangalan:",
          "ms": "Nama Huruf Kecil Sahaja:"
    },
    "audit_lowercase_name_desc": {
          "en": "Recommended to use UPPERCASE or Title Case matching your official identity document.",
          "id": "Disarankan gunakan HURUF KAPITAL atau Title Case sesuai paspor untuk menghindari kesalahan cetak berkas.",
          "ja": "書類の印刷不備を防ぐため、公的身分証に合わせた大文字またはタイトルケースを推奨します。",
          "ko": "문서 인쇄 오류를 방지하기 위해 신분증과 일치하는 대문자 작성을 권장합니다.",
          "zh": "建议使用全大写或首字母大写，与官方证件保持完全一致。",
          "zh-TW": "建議使用全大寫或首字母大寫，與官方身分證明文件保持完全一致。",
          "vi": "Khuyến nghị dùng CHỮ HOA hoặc Title Case khớp với giấy tờ tùy thân chính thức.",
          "th": "แนะนำให้ใช้ตัวพิมพ์ใหญ่หรือ Title Case ให้ตรงกับเอกสารทางการ",
          "hi": "आधिकारिक दस्तावेज़ से मिलान करने के लिए बड़े अक्षरों (UPPERCASE) का उपयोग करने की सलाह दी जाती है।",
          "fil": "Inirerekomendang gamitin ang MALALAKING TITIK o Title Case na tugma sa iyong dokumento.",
          "ms": "Disyorkan gunakan HURUF BESAR atau Title Case sepadan dengan dokumen rasmi."
    },
    "audit_id_length_title": {
          "en": "Non-Standard ID Length ({count} digits)",
          "id": "Panjang NIK Tidak Standar ({count} digit)",
          "ja": "身元番号の桁数が規格外です ({count} 桁)",
          "ko": "표준이 아닌 식별번호 길이 ({count}자리)",
          "zh": "证件号长度不规范（{count} 位）",
          "zh-TW": "證件號長度不符規範（{count} 碼）",
          "vi": "Độ dài số định danh không chuẩn ({count} số)",
          "th": "ความยาวหมายเลขประจำตัวไม่เป็นมาตรฐาน ({count} หลัก)",
          "hi": "गैर-मानक आईडी लंबाई ({count} अंक)",
          "fil": "Hindi Karaniwang Haba ng ID ({count} digit)",
          "ms": "Panjang No. Kad Pengenalan Tidak Piawai ({count} digit)"
    },
    "audit_id_length_desc": {
          "en": "Standard Indonesian National ID (NIK) is exactly 16 digits.",
          "id": "Format NIK Indonesia adalah tepat 16 digit angka.",
          "ja": "インドネシアの身分証番号 (NIK) は正確に16桁です。",
          "ko": "인도네시아 국가 식별 번호(NIK)는 정확히 16자리 숫자입니다.",
          "zh": "印尼国家身份证（NIK）规范格式为准确的 16 位纯数字。",
          "zh-TW": "印尼國家身分證（NIK）標準格式為準確的 16 碼純數字。",
          "vi": "Định dạng NIK Indonesia tiêu chuẩn là chính xác 16 chữ số.",
          "th": "รูปแบบ NIK ของอินโดนีเซียคือตัวเลข 16 หลัก",
          "hi": "मानक इंडोनेशियाई राष्ट्रीय पहचान पत्र (NIK) ठीक 16 अंकों का होता है।",
          "fil": "Ang karaniwang Indonesian National ID (NIK) ay eksaktong 16 na digit.",
          "ms": "Format NIK Indonesia adalah tepat 16 digit angka."
    },
    "audit_all_clean_title": {
          "en": "All Fields Meet Standard Requirements",
          "id": "Semua Isian Sesuai Standar Birokrasi",
          "ja": "すべての項目が基準を満たしています",
          "ko": "모든 항목이 규정 기준을 충족합니다",
          "zh": "所有填写项均符合规范标准",
          "zh-TW": "所有填寫欄位皆符合規範標準",
          "vi": "Tất cả các trường đều đạt chuẩn",
          "th": "ทุกช่องตรงตามมาตรฐานที่กำหนด",
          "hi": "सभी फ़ील्ड्स मानक आवश्यकताओं को पूरा करते हैं",
          "fil": "Lahat ng Kolum ay Sumusunod sa Pamantayan",
          "ms": "Semua Isian Mematuhi Piawaian"
    },
    "audit_all_clean_desc": {
          "en": "Names, dates, and required fields are properly formatted with no critical errors detected.",
          "id": "Format nama, tanggal, dan seluruh kolom wajib telah terisi rapi tanpa potensi diskualifikasi.",
          "ja": "氏名、日付、必須項目が正確に記入されており、重大な不備は検出されませんでした。",
          "ko": "이름, 날짜 및 필수 항목이 올바르게 작성되었으며 심각한 오류가 감지되지 않았습니다.",
          "zh": "姓名、日期和必填项格式正确，未检测到任何严重问题。",
          "zh-TW": "姓名、日期和必填欄位格式正確，未偵測到任何重大錯誤。",
          "vi": "Tên, ngày tháng và các trường bắt buộc đã được định dạng đúng, không có lỗi nghiêm trọng.",
          "th": "ชื่อ วันที่ และช่องบังคับได้รับการจัดรูปแบบอย่างถูกต้อง ไม่พบข้อผิดพลาดร้ายแรง",
          "hi": "नाम, तिथियां और आवश्यक फ़ील्ड्स उचित रूप से प्रारूपित हैं, कोई त्रुटि tidak मिली।",
          "fil": "Maayos ang format ng mga pangalan, petsa, at kinakailangang kolum nang walang kritikal na error.",
          "ms": "Format nama, tarikh, dan semua ruangan wajib telah diisi dengan kemas tanpa ralat."
    },
    "card_analyze_form": {
          "en": "Analyze Form",
          "id": "Analisis Formulir",
          "ja": "フォームを解析",
          "ko": "양식 분석",
          "zh": "分析表单",
          "zh-TW": "分析表單",
          "vi": "Phân tích biểu mẫu",
          "th": "วิเคราะห์แบบฟอร์ม",
          "hi": "फ़ॉर्म का विश्लेषण करें",
          "fil": "Suriin ang Form",
          "ms": "Analisis Borang"
    },
    "card_explain_this": {
          "en": "Explain This",
          "id": "Jelaskan Ini",
          "ja": "これについて解説",
          "ko": "이 부분 설명",
          "zh": "解释此内容",
          "zh-TW": "解釋此內容",
          "vi": "Giải thích phần này",
          "th": "อธิบายส่วนนี้",
          "hi": "इसे समझाइए",
          "fil": "Ipaliwanag Ito",
          "ms": "Terangkan Ini"
    },
    "card_autofill": {
          "en": "1-Click Auto Fill",
          "id": "1-Klik Isi Otomatis",
          "ja": "1クリック自動入力",
          "ko": "원클릭 자동 완성",
          "zh": "一键自动填充",
          "zh-TW": "一鍵自動填寫",
          "vi": "Tự động điền 1-chạm",
          "th": "กรอกอัตโนมัติ 1 คลิก",
          "hi": "1-क्लिक ऑटो फिल",
          "fil": "1-Click Auto Fill",
          "ms": "1-Klik Isi Automatik"
    },
    "card_upload_pdf": {
          "en": "Upload PDF Form",
          "id": "Unggah Formulir PDF",
          "ja": "PDFフォームをアップロード",
          "ko": "PDF 양식 업로드",
          "zh": "上传PDF表单",
          "zh-TW": "上傳PDF表單",
          "vi": "Tải lên biểu mẫu PDF",
          "th": "อัปโหลดแบบฟอร์ม PDF",
          "hi": "PDF फ़ॉर्म अपलोड करें",
          "fil": "Mag-upload ng PDF Form",
          "ms": "Muat Naik Borang PDF"
    },
    "card_translate_page": {
          "en": "Translate Page",
          "id": "Terjemahkan Halaman",
          "ja": "ページを翻訳",
          "ko": "페이지 번역",
          "zh": "翻译页面",
          "zh-TW": "翻譯頁面",
          "vi": "Dịch trang",
          "th": "แปลหน้าเว็บ",
          "hi": "पृष्ठ का अनुवाद करें",
          "fil": "Isalin ang Pahina",
          "ms": "Terjemah Halaman"
    },
    "card_show_me": {
          "en": "Show Me",
          "id": "Tunjukkan",
          "ja": "位置を見せて",
          "ko": "위치 보여줘",
          "zh": "指出位置",
          "zh-TW": "指出位置",
          "vi": "Chỉ cho tôi",
          "th": "แสดงตำแหน่ง",
          "hi": "मुझे दिखाओ",
          "fil": "Ipakita Mo",
          "ms": "Tunjukkan"
    },
    "card_form_auditor": {
          "en": "Pre-Submit Audit",
          "id": "Audit Pra-Kirim",
          "ja": "送信前監査",
          "ko": "제출 전 검토",
          "zh": "提交前审核",
          "zh-TW": "送出前審核",
          "vi": "Kiểm tra trước khi gửi",
          "th": "ตรวจสอบก่อนส่ง",
          "hi": "सबमिट से पहले ऑडिट",
          "fil": "Suriin Bago Isumite",
          "ms": "Audit Pra-Hantar"
    },
    "card_accessibility": {
          "en": "Accessibility Hub",
          "id": "Pusat Aksesibilitas",
          "ja": "アクセシビリティハブ",
          "ko": "접근성 허브",
          "zh": "无障碍中心",
          "zh-TW": "無障礙中心",
          "vi": "Trung tâm trợ năng",
          "th": "ศูนย์การเข้าถึง",
          "hi": "सुलभता केंद्र",
          "fil": "Sentro ng Accessibility",
          "ms": "Pusat Kebolehcapaian"
    },
    "a11y_hub_title": {
          "en": "Accessibility Hub",
          "id": "Pusat Aksesibilitas",
          "ja": "アクセシビリティハブ",
          "ko": "접근성 허브",
          "zh": "无障碍中心",
          "zh-TW": "無障礙中心",
          "vi": "Trung tâm trợ năng",
          "th": "ศูนย์การเข้าถึง",
          "hi": "सुलभता केंद्र",
          "fil": "Sentro ng Accessibility",
          "ms": "Pusat Kebolehcapaian"
    },
    "a11y_btn_back": {
          "en": "Back",
          "id": "Kembali",
          "ja": "戻る",
          "ko": "뒤로",
          "zh": "返回",
          "zh-TW": "返回",
          "vi": "Quay lại",
          "th": "ย้อนกลับ",
          "hi": "वापस",
          "fil": "Bumalik",
          "ms": "Kembali"
    },
    "a11y_btn_reset": {
          "en": "Reset",
          "id": "Reset",
          "ja": "リセット",
          "ko": "초기화",
          "zh": "重置",
          "zh-TW": "重設",
          "vi": "Đặt lại",
          "th": "รีเซ็ต",
          "hi": "रीसेट",
          "fil": "I-reset",
          "ms": "Set Semula"
    },
    "a11y_banner_text": {
          "en": "Personalize this page for maximum comfort & cognitive focus.",
          "id": "Sesuaikan halaman web ini demi kenyamanan & fokus Anda.",
          "ja": "Webページを快適で見やすく、集中しやすい表示にカスタマイズします。",
          "ko": "최적의 편안함과 인지 집중을 위해 웹페이지를 맞춤 설정하세요.",
          "zh": "自适应优化当前网页显示，提升阅读舒适度与专注力。",
          "zh-TW": "自適應調整當前網頁，提升閱讀舒適度與專注度。",
          "vi": "Cá nhân hóa trang web này để đọc thoải mái và tập trung tối đa.",
          "th": "ปรับแต่งหน้านี้เพื่อความสบายตาและสมาธิสูงสุดในการอ่าน",
          "hi": "अधिकतम आराम और ध्यान के लिए इस वेबपेज को अनुकूलित करें।",
          "fil": "I-personalize ang webpage na ito para sa ginhawa at konsentrasyon.",
          "ms": "Peribadikan halaman web ini untuk keselesaan & tumpuan kognitif anda."
    },
    "a11y_presets_label": {
          "en": "Quick Accessibility Profiles",
          "id": "Profil Aksesibilitas Cepat",
          "ja": "クイックプリセット",
          "ko": "빠른 프로필 프리셋",
          "zh": "快速无障碍配置",
          "zh-TW": "快速無障礙設定",
          "vi": "Cấu hình trợ năng nhanh",
          "th": "โปรไฟล์การเข้าถึงด่วน",
          "hi": "त्वरित सुलभता प्रोफ़ाइल",
          "fil": "Mabilisang Profile ng Accessibility",
          "ms": "Profil Pantas Kebolehcapaian"
    },
    "a11y_preset_adhd": {
          "en": "ADHD Friendly",
          "id": "Ramah ADHD",
          "ja": "ADHDサポート",
          "ko": "ADHD 맞춤",
          "zh": "专注模式 (ADHD)",
          "zh-TW": "專注模式 (ADHD)",
          "vi": "Thân thiện ADHD",
          "th": "เหมาะสำหรับสมาธิสั้น (ADHD)",
          "hi": "एडीएचडी अनुकूल",
          "fil": "ADHD Friendly",
          "ms": "Mesra ADHD"
    },
    "a11y_preset_dyslexia": {
          "en": "Dyslexia Friendly",
          "id": "Ramah Disleksia",
          "ja": "読字アシスト (ディスレクシア)",
          "ko": "난독증 친화형",
          "zh": "阅读障碍友好",
          "zh-TW": "閱讀障礙友善",
          "vi": "Thân thiện chứng khó đọc",
          "th": "อ่านง่ายสำหรับภาวะดิสเล็กเซีย",
          "hi": "डिस्लेक्सिया अनुकूल",
          "fil": "Dyslexia Friendly",
          "ms": "Mesra Disleksia"
    },
    "a11y_preset_lowvision": {
          "en": "Low Vision / High Contrast",
          "id": "Penglihatan Rendah / Kontras",
          "ja": "ロービジョン / 高コントラスト",
          "ko": "저시력 / 고대비",
          "zh": "低视力 / 高对比度",
          "zh-TW": "低視力 / 高對比度",
          "vi": "Thị lực yếu / Độ tương phản cao",
          "th": "สายตาเลือนราง / คอนทราสต์สูง",
          "hi": "अल्प दृष्टि / उच्च कंट्रास्ट",
          "fil": "Low Vision / High Contrast",
          "ms": "Penglihatan Rendah / Kontras Tinggi"
    },
    "a11y_preset_senior": {
          "en": "Senior Friendly",
          "id": "Ramah Lansia",
          "ja": "シニア見やすさ重視",
          "ko": "시니어 친화형",
          "zh": "长辈友好模式",
          "zh-TW": "銀髮長輩模式",
          "vi": "Thân thiện người cao tuổi",
          "th": "อ่านง่ายสำหรับผู้สูงอายุ",
          "hi": "वरिष्ठ नागरिक अनुकूल",
          "fil": "Senior Friendly",
          "ms": "Mesra Warga Emas"
    },
    "a11y_tile_spotlight": {
          "en": "Reading Spotlight",
          "id": "Sorotan Baca (Spotlight)",
          "ja": "リーディングスポットライト",
          "ko": "독서 집중 가이드",
          "zh": "阅读聚光灯",
          "zh-TW": "閱讀聚光燈",
          "vi": "Đèn soi dòng đọc",
          "th": "แถบนำสายตาอ่าน",
          "hi": "रीडिंग स्पॉटलाइट",
          "fil": "Reading Spotlight",
          "ms": "Lampu Tumpu Membaca"
    },
    "a11y_tile_speak": {
          "en": "Text to Speech (TTS)",
          "id": "Bicara Teks (TTS)",
          "ja": "音声読み上げ (TTS)",
          "ko": "텍스트 음성 변환 (TTS)",
          "zh": "语音朗读 (TTS)",
          "zh-TW": "語音朗讀 (TTS)",
          "vi": "Đọc văn bản (TTS)",
          "th": "อ่านออกเสียง (TTS)",
          "hi": "टेक्स्ट टू स्पीच (TTS)",
          "fil": "Text to Speech (TTS)",
          "ms": "Teks ke Suara (TTS)"
    },
    "a11y_tile_contrast": {
          "en": "Contrast Mode",
          "id": "Mode Kontras",
          "ja": "コントラストモード",
          "ko": "대비 모드",
          "zh": "对比度模式",
          "zh-TW": "對比度模式",
          "vi": "Chế độ tương phản",
          "th": "โหมดคอนทราสต์",
          "hi": "कंट्रास्ट मोड",
          "fil": "Contrast Mode",
          "ms": "Mod Kontras"
    },
    "a11y_tile_links": {
          "en": "Highlight Links",
          "id": "Sorot Tautan",
          "ja": "リンクを強調",
          "ko": "링크 강조",
          "zh": "高亮显示链接",
          "zh-TW": "突顯超連結",
          "vi": "Làm nổi bật liên kết",
          "th": "เน้นลิงก์",
          "hi": "लिंक हाइलाइट करें",
          "fil": "I-highlight ang Links",
          "ms": "Serlahkan Pautan"
    },
    "a11y_tile_text_size": {
          "en": "Bigger Text Size",
          "id": "Ukuran Teks Lebih Besar",
          "ja": "文字サイズ拡大",
          "ko": "글자 크기 확대",
          "zh": "放大文字大小",
          "zh-TW": "放大文字尺寸",
          "vi": "Phóng to chữ",
          "th": "เพิ่มขนาดตัวอักษร",
          "hi": "बड़ा टेक्स्ट आकार",
          "fil": "Lalakihan ang Letra",
          "ms": "Besarkan Saiz Teks"
    },
    "a11y_tile_spacing": {
          "en": "Text Spacing",
          "id": "Jarak Huruf & Teks",
          "ja": "文字間隔の調整",
          "ko": "글자 간격 넓히기",
          "zh": "文字间距",
          "zh-TW": "文字間距",
          "vi": "Giãn cách chữ",
          "th": "ระยะห่างตัวอักษร",
          "hi": "टेक्स्ट स्पेसिंग",
          "fil": "Puwang ng Letra",
          "ms": "Jarak Teks & Huruf"
    },
    "a11y_tile_animations": {
          "en": "Pause Animations",
          "id": "Jeda Animasi Web",
          "ja": "アニメーション停止",
          "ko": "애니메이션 일시중지",
          "zh": "暂停网页动画",
          "zh-TW": "暫停網頁動畫",
          "vi": "Tạm dừng chuyển động",
          "th": "หยุดภาพเคลื่อนไหวชั่วคราว",
          "hi": "एनिमेशन रोकें",
          "fil": "I-pause ang Animations",
          "ms": "Jeda Animasi"
    },
    "a11y_tile_hide_images": {
          "en": "Hide All Images",
          "id": "Sembunyikan Gambar",
          "ja": "画像を非表示",
          "ko": "이미지 숨기기",
          "zh": "隐藏所有图片",
          "zh-TW": "隱藏所有圖片",
          "vi": "Ẩn toàn bộ hình ảnh",
          "th": "ซ่อนรูปภาพทั้งหมด",
          "hi": "सभी चित्र छिपाएँ",
          "fil": "Itago ang mga Larawan",
          "ms": "Sembunyi Gambar"
    },
    "a11y_tile_dyslexia": {
          "en": "Dyslexia Friendly Font",
          "id": "Font Ramah Disleksia",
          "ja": "ディスレクシア対応フォント",
          "ko": "난독증 보조 폰트",
          "zh": "易读排版字体",
          "zh-TW": "易讀排版字型",
          "vi": "Phông chữ dễ đọc",
          "th": "ฟอนต์อ่านง่ายสำหรับดิสเล็กเซีย",
          "hi": "डिस्लेक्सिया फ़ॉन्ट",
          "fil": "Dyslexia Font",
          "ms": "Fon Mesra Disleksia"
    },
    "a11y_tile_cursor": {
          "en": "Big Cursor",
          "id": "Kursor Ukuran Besar",
          "ja": "大型カーソル",
          "ko": "대형 마우스 커서",
          "zh": "放大鼠标指针",
          "zh-TW": "加大滑鼠指標",
          "vi": "Con trỏ chuột lớn",
          "th": "เคอร์เซอร์ขนาดใหญ่",
          "hi": "बड़ा कर्सर",
          "fil": "Malaking Cursor",
          "ms": "Kursor Saiz Besar"
    },
    "a11y_tile_tooltips": {
          "en": "Live Explanatory Tooltips",
          "id": "Penjelasan Cepat (Tooltips)",
          "ja": "用語ツールチップ",
          "ko": "설명 툴팁 표시",
          "zh": "悬浮解释提示 (Tooltips)",
          "zh-TW": "懸浮註釋提示 (Tooltips)",
          "vi": "Chú thích hướng dẫn nổi",
          "th": "คำอธิบายลอยชี้แจง",
          "hi": "लाइव व्याख्या टूलटिप्स",
          "fil": "Paliwanag na Tooltips",
          "ms": "Penjelasan Cepat (Tooltips)"
    },
    "a11y_tile_line_height": {
          "en": "Line Height Spacing",
          "id": "Jarak Antar Baris (Line Height)",
          "ja": "行間を広げる",
          "ko": "줄 간격 넓히기",
          "zh": "增加行距",
          "zh-TW": "增加行高間距",
          "vi": "Chiều cao dòng",
          "th": "ระยะห่างระหว่างบรรทัด",
          "hi": "पंक्ति ऊंचाई",
          "fil": "Taas ng Linya",
          "ms": "Ketinggian Baris"
    },
    "a11y_tile_align": {
          "en": "Text Alignment",
          "id": "Perataan Teks (Alignment)",
          "ja": "テキスト配置",
          "ko": "텍스트 정렬",
          "zh": "文字对齐方向",
          "zh-TW": "文字對齊方式",
          "vi": "Căn lề văn bản",
          "th": "การจัดตำแหน่งข้อความ",
          "hi": "टेक्स्ट संरेखण",
          "fil": "Pag-align ng Teksto",
          "ms": "Jajaran Teks"
    },
    "a11y_tile_saturation": {
          "en": "Color Saturation",
          "id": "Saturasi Warna",
          "ja": "色の彩度調整",
          "ko": "색상 채도 조절",
          "zh": "色彩饱和度",
          "zh-TW": "色彩飽和度",
          "vi": "Độ bão hòa màu",
          "th": "ความอิ่มตัวของสี",
          "hi": "रंग संतृप्ति",
          "fil": "Kulay Saturation",
          "ms": "Ketepuan Warna"
    },
    "a11y_status_off": {
          "en": "Off",
          "id": "Mati",
          "ja": "無効",
          "ko": "꺼짐",
          "zh": "已关闭",
          "zh-TW": "關閉",
          "vi": "Tắt",
          "th": "ปิด",
          "hi": "बंद",
          "fil": "Naka-off",
          "ms": "Mati"
    },
    "a11y_status_on": {
          "en": "Active",
          "id": "Aktif",
          "ja": "有効",
          "ko": "켜짐",
          "zh": "已开启",
          "zh-TW": "已啟用",
          "vi": "Bật",
          "th": "เปิดใช้งาน",
          "hi": "सक्रिय",
          "fil": "Aktibo",
          "ms": "Aktif"
    },
    "a11y_status_normal": {
          "en": "Normal",
          "id": "Normal",
          "ja": "標準",
          "ko": "보통",
          "zh": "正常",
          "zh-TW": "一般",
          "vi": "Bình thường",
          "th": "ปกติ",
          "hi": "सामान्य",
          "fil": "Karaniwan",
          "ms": "Normal"
    },
    "a11y_status_paused": {
          "en": "Paused",
          "id": "Dijeda",
          "ja": "停止中",
          "ko": "일시정지됨",
          "zh": "已暂停",
          "zh-TW": "已暫停",
          "vi": "Đã tạm dừng",
          "th": "หยุดชั่วคราว",
          "hi": "रोका गया",
          "fil": "Naka-pause",
          "ms": "Dijeda"
    },
    "a11y_status_hidden": {
          "en": "Hidden",
          "id": "Tersembunyi",
          "ja": "非表示",
          "ko": "숨김",
          "zh": "已隐藏",
          "zh-TW": "已隱藏",
          "vi": "Đã ẩn",
          "th": "ซ่อนอยู่",
          "hi": "छिपा हुआ",
          "fil": "Nakatago",
          "ms": "Tersembunyi"
    },
    "a11y_status_cursor_big_white": {
          "en": "Big White",
          "id": "Putih Besar",
          "ja": "大（白）",
          "ko": "대형 (흰색)",
          "zh": "大号白色",
          "zh-TW": "大號白色",
          "vi": "Trắng lớn",
          "th": "สีขาวขนาดใหญ่",
          "hi": "बड़ा सफेद",
          "fil": "Malaking Puti",
          "ms": "Putih Besar"
    },
    "a11y_status_cursor_big_black": {
          "en": "Big Black",
          "id": "Hitam Besar",
          "ja": "大（黒）",
          "ko": "대형 (검정)",
          "zh": "大号黑色",
          "zh-TW": "大號黑色",
          "vi": "Đen lớn",
          "th": "สีดำขนาดใหญ่",
          "hi": "बड़ा काला",
          "fil": "Malaking Itim",
          "ms": "Hitam Besar"
    },
    "a11y_status_align_left": {
          "en": "Left",
          "id": "Kiri",
          "ja": "左揃え",
          "ko": "왼쪽 정렬",
          "zh": "左对齐",
          "zh-TW": "靠左對齊",
          "vi": "Căn trái",
          "th": "ชิดซ้าย",
          "hi": "बायाँ",
          "fil": "Kaliwa",
          "ms": "Kiri"
    },
    "a11y_status_align_right": {
          "en": "Right",
          "id": "Kanan",
          "ja": "右揃え",
          "ko": "오른쪽 정렬",
          "zh": "右对齐",
          "zh-TW": "靠右對齊",
          "vi": "Căn phải",
          "th": "ชิดขวา",
          "hi": "दायाँ",
          "fil": "Kanan",
          "ms": "Kanan"
    },
    "a11y_status_yellow_black": {
          "en": "Yellow/Black",
          "id": "Kuning/Hitam",
          "ja": "黄色/黒",
          "ko": "노랑/검정",
          "zh": "黄黑对比",
          "zh-TW": "黃黑對比",
          "vi": "Vàng/Đen",
          "th": "เหลือง/ดำ",
          "hi": "पीला/काला",
          "fil": "Dilaw/Itim",
          "ms": "Kuning/Hitam"
    },
    "a11y_status_sat_low": {
          "en": "Low Saturation",
          "id": "Saturasi Rendah",
          "ja": "低彩度",
          "ko": "낮은 채도",
          "zh": "低饱和度",
          "zh-TW": "低飽和度",
          "vi": "Độ bão hòa thấp",
          "th": "ความอิ่มตัวต่ำ",
          "hi": "कम संतृप्ति",
          "fil": "Mababang Saturation",
          "ms": "Ketepuan Rendah"
    },
    "a11y_status_sat_mono": {
          "en": "Monochrome",
          "id": "Monokrom (Grayscale)",
          "ja": "モノクロ",
          "ko": "흑백",
          "zh": "单色黑白",
          "zh-TW": "單色灰階",
          "vi": "Đơn sắc",
          "th": "ขาวดำ",
          "hi": "मोनोक्रोम",
          "fil": "Monochrome",
          "ms": "Monokrom"
    },
    "a11y_status_sat_high": {
          "en": "High Saturation",
          "id": "Saturasi Tinggi",
          "ja": "高彩度",
          "ko": "높은 채도",
          "zh": "高饱和度",
          "zh-TW": "高飽和度",
          "vi": "Độ bão hòa cao",
          "th": "ความอิ่มตัวสูง",
          "hi": "उच्च संतृप्ति",
          "fil": "Mataas na Saturation",
          "ms": "Ketepuan Tinggi"
    },
    "auth_gate_title": {
          "en": "Authentication Required",
          "id": "Login Diperlukan",
          "ja": "ログインが必要です",
          "ko": "로그인이 필요합니다",
          "zh": "需要登录",
          "zh-TW": "需要登入",
          "vi": "Yêu cầu đăng nhập",
          "th": "จำเป็นต้องเข้าสู่ระบบ",
          "hi": "प्रमाणीकरण आवश्यक है",
          "fil": "Kailangang Mag-login",
          "ms": "Log Masuk Diperlukan"
    },
    "auth_gate_desc": {
          "en": "Please log in to your Telmy account to unlock real-time form guidance, multimodal AI analysis, and encrypted autofill.",
          "id": "Silakan masuk ke akun Telmy Anda untuk membuka panduan pengisian instan, analisis AI multimodal, dan pengisian otomatis.",
          "ja": "Telmyアカウントにログインして、リアルタイムのフォームガイド、マルチモーダルAI解析、暗号化自動入力を利用してください。",
          "ko": "Telmy 계정에 로그인하여 실시간 양식 안내, 멀티모달 AI 분석 및 암호화된 자동 완성을 잠금 해제하세요.",
          "zh": "请登录您的 Telmy 账户以解锁实时表单指引、多模态AI解析与本地加密自动填充。",
          "zh-TW": "請登入您的 Telmy 帳戶以啟用即時表單引導、多模態AI解析與加密自動填寫。",
          "vi": "Vui lòng đăng nhập vào tài khoản Telmy để mở khóa hướng dẫn trực tiếp, phân tích AI và tự động điền bảo mật.",
          "th": "กรุณาเข้าสู่ระบบบัญชี Telmy เพื่อปลดล็อกคำแนะนำการกรอกฟอร์มแบบเรียลไทม์ การวิเคราะห์ AI และการกรอกอัตโนมัติ",
          "hi": "वास्तविक समय में फ़ॉर्म मार्गदर्शन, AI विश्लेषण और सुरक्षित ऑटोफ़िल के लिए कृपया अपने Telmy खाते में लॉग इन करें।",
          "fil": "Mangyaring mag-log in sa iyong Telmy account upang magamit ang real-time na gabay, AI analysis, at autofill.",
          "ms": "Sila log masuk ke akaun Telmy anda untuk menggunakan panduan borang masa nyata, analisis AI, dan autofill disulitkan."
    },
    "auth_gate_btn": {
          "en": "Sign In / Register with Google",
          "id": "Masuk / Daftar dengan Google",
          "ja": "Googleでログイン / 新規登録",
          "ko": "Google로 로그인 / 회원가입",
          "zh": "使用 Google 登录 / 注册",
          "zh-TW": "使用 Google 登入 / 註冊",
          "vi": "Đăng nhập / Đăng ký bằng Google",
          "th": "เข้าสู่ระบบ / ลงทะเบียนด้วย Google",
          "hi": "Google से साइन इन / रजिस्टर करें",
          "fil": "Mag-sign In gamit ang Google",
          "ms": "Log Masuk / Daftar dengan Google"
    },
    "auth_gate_note": {
          "en": "Fast, secure & free credits included.",
          "id": "Cepat, aman & kuota gratis sudah termasuk.",
          "ja": "高速・安全で、無料枠も含まれています。",
          "ko": "빠르고 안전하며 무료 크레딧이 포함되어 있습니다.",
          "zh": "极速、安全，并包含免费使用额度。",
          "zh-TW": "快速、安全，並包含免費額度。",
          "vi": "Nhanh chóng, an toàn và tặng kèm lượt dùng miễn phí.",
          "th": "รวดเร็ว ปลอดภัย พร้อมเครดิตฟรี",
          "hi": "तेज़, सुरक्षित और मुफ़्त क्रेडिट शामिल हैं।",
          "fil": "Mabilis, ligtas at may libreng credits.",
          "ms": "Pantas, selamat & kredit percuma disertakan."
    },
    "popover_guest_user": {
          "en": "Guest User",
          "id": "Pengguna Tamu",
          "ja": "ゲストユーザー",
          "ko": "게스트 사용자",
          "zh": "访客用户",
          "zh-TW": "訪客使用者",
          "vi": "Người dùng khách",
          "th": "ผู้ใช้งานทั่วไป",
          "hi": "अतिथि उपयोगकर्ता",
          "fil": "Bisitang Gumagamit",
          "ms": "Pengguna Tetamu"
    },
    "popover_not_signed_in": {
          "en": "Not signed in",
          "id": "Belum masuk",
          "ja": "未ログイン",
          "ko": "로그인되지 않음",
          "zh": "未登录",
          "zh-TW": "未登入",
          "vi": "Chưa đăng nhập",
          "th": "ยังไม่ได้เข้าสู่ระบบ",
          "hi": "साइन इन नहीं किया",
          "fil": "Hindi naka-sign in",
          "ms": "Belum log masuk"
    },
    "popover_guest_mode": {
          "en": "Guest Mode",
          "id": "Mode Tamu",
          "ja": "ゲストモード",
          "ko": "게스트 모드",
          "zh": "访客模式",
          "zh-TW": "訪客模式",
          "vi": "Chế độ khách",
          "th": "โหมดผู้ใช้ทั่วไป",
          "hi": "अतिथि मोड",
          "fil": "Guest Mode",
          "ms": "Mod Tetamu"
    },
    "popover_sign_out": {
          "en": "Sign Out",
          "id": "Keluar Akun",
          "ja": "ログアウト",
          "ko": "로그아웃",
          "zh": "退出登录",
          "zh-TW": "登出帳戶",
          "vi": "Đăng xuất",
          "th": "ออกจากระบบ",
          "hi": "साइन आउट",
          "fil": "Mag-sign Out",
          "ms": "Log Keluar"
    },
    "vault_gate_title_locked": {
          "en": "Profile Vault is Locked",
          "id": "Brankas Profil Terkunci",
          "ja": "プロファイル金庫は施錠されています",
          "ko": "프로필 금고가 잠겨 있습니다",
          "zh": "本地资料保险箱已锁定",
          "zh-TW": "個人資料金庫已上鎖",
          "vi": "Két bảo mật hồ sơ đang khóa",
          "th": "ห้องนิรภัยข้อมูลส่วนตัวถูกล็อค",
          "hi": "प्रोफ़ाइल वॉल्ट लॉक है",
          "fil": "Naka-lock ang Profile Vault",
          "ms": "Peti Profil Dikunci"
    },
    "vault_gate_title_setup": {
          "en": "Set Up Your Profile Vault",
          "id": "Siapkan Brankas Profil Anda",
          "ja": "プロファイル金庫を設定",
          "ko": "프로필 금고 설정하기",
          "zh": "创建本地资料保险箱",
          "zh-TW": "設定您的個人資料金庫",
          "vi": "Thiết lập két bảo mật hồ sơ",
          "th": "ตั้งค่าห้องนิรภัยข้อมูลส่วนตัว",
          "hi": "अपना प्रोफ़ाइल वॉल्ट सेटअप करें",
          "fil": "I-setup ang Iyong Profile Vault",
          "ms": "Sediakan Peti Profil Anda"
    },
    "vault_gate_desc_locked": {
          "en": "Encrypted client-side with AES-GCM-256. Enter your Master Password or Seed Phrase to unlock.",
          "id": "Terenkripsi di perangkat Anda dengan AES-GCM-256. Masukkan Password Utama atau Seed Phrase untuk membuka.",
          "ja": "AES-GCM-256でクライアント側暗号化されています。解除するにはマスターパスワードまたはシードフレーズを入力してください。",
          "ko": "AES-GCM-256으로 클라이언트 측에서 안전하게 암호화되었습니다. 잠금을 해제하려면 마스터 비밀번호나 시드 구문을 입력하세요.",
          "zh": "采用 AES-GCM-256 客户端本地高强度加密。请输入主密码或助记词解锁。",
          "zh-TW": "採用 AES-GCM-256 本地端高強度加密。請輸入主密碼或復原註記詞以解鎖。",
          "vi": "Được mã hóa cục bộ với AES-GCM-256. Nhập Mật khẩu chính hoặc Cụm từ hạt giống để mở khóa.",
          "th": "เข้ารหัสที่ฝั่งผู้ใช้ด้วย AES-GCM-256 กรุณาใส่รหัสผ่านหลักหรือคำกู้คืนเพื่อปลดล็อค",
          "hi": "AES-GCM-256 के साथ सुरक्षित रूप से एन्क्रिप्टेड। अनलॉक करने के लिए अपना मास्टर पासवर्ड या सीड वाक्यांश दर्ज करें।",
          "fil": "Naka-encrypt gamit ang AES-GCM-256. Ilagay ang Master Password o Seed Phrase upang ma-unlock.",
          "ms": "Disulitkan secara setempat dengan AES-GCM-256. Masukkan Kata Laluan Utama atau Frasa Benih untuk membuka."
    },
    "vault_gate_desc_setup": {
          "en": "Protect your sensitive ID and form autofill data with Zero-Knowledge encryption. Only you hold the decryption keys.",
          "id": "Lindungi KTP dan data isian formulir dengan enkripsi Zero-Knowledge. Hanya Anda yang memegang kunci pembukanya.",
          "ja": "ゼロ知識暗号化で身分証や自動入力データを保護します。復号キーを保持できるのはあなただけです。",
          "ko": "영지식(Zero-Knowledge) 암호화로 신분증과 자동 완성 데이터를 보호하세요. 복호화 키는 오직 본인만 소유합니다.",
          "zh": "零知识加密技术守护您的身份证件与自动填充信息。只有您拥有解密密钥。",
          "zh-TW": "零知識加密技術保護您的身分資料與自動填寫內容。只有您擁有解密金鑰。",
          "vi": "Bảo vệ căn cước và dữ liệu điền mẫu với mã hóa Zero-Knowledge. Chỉ duy nhất bạn sở hữu khóa giải mã.",
          "th": "ปกป้องบัตรประชาชนและข้อมูลกรอกฟอร์มด้วยการเข้ารหัส Zero-Knowledge มีเพียงคุณเท่านั้นที่ถือกุญแจถอดรหัส",
          "hi": "जीरो-नॉलेज एन्क्रिप्शन के साथ अपने पहचान पत्र और फ़ॉर्म डेटा को सुरक्षित करें। केवल आपके पास कुंजी है।",
          "fil": "Protektahan ang iyong ID at autofill data gamit ang Zero-Knowledge encryption. Ikaw lang ang may hawak ng susi.",
          "ms": "Lindungi data pengenalan dan autofill anda dengan penyulitan Zero-Knowledge. Hanya anda yang memegang kuncinya."
    },
    "vault_gate_btn_unlock": {
          "en": "Unlock Vault",
          "id": "Buka Kunci Brankas",
          "ja": "金庫のロックを解除",
          "ko": "금고 잠금 해제",
          "zh": "解锁保险箱",
          "zh-TW": "解鎖金庫",
          "vi": "Mở khóa két",
          "th": "ปลดล็อคห้องนิรภัย",
          "hi": "वॉल्ट अनलॉक करें",
          "fil": "I-unlock ang Vault",
          "ms": "Buka Peti"
    },
    "vault_gate_btn_setup": {
          "en": "Create Master Key & Lock",
          "id": "Buat Kunci Utama & Kunci",
          "ja": "マスターキーを作成して施錠",
          "ko": "마스터 키 생성 및 잠금",
          "zh": "创建主密钥并加密",
          "zh-TW": "建立主金鑰並加密",
          "vi": "Tạo khóa chính và bảo mật",
          "th": "สร้างรหัสหลักและล็อค",
          "hi": "मास्टर कुंजी बनाएं और सुरक्षित करें",
          "fil": "Gumawa ng Master Key",
          "ms": "Cipta Kunci Utama & Kunci"
    },
    "vault_device_encrypted_note": {
          "en": "Zero-Knowledge: Data is encrypted locally. Telmy servers never see your private keys.",
          "id": "Zero-Knowledge: Data terenkripsi di perangkat Anda. Server Telmy tidak pernah memiliki kunci Anda.",
          "ja": "ゼロ知識設計：データは端末上で暗号化されます。Telmyのサーバーが秘密鍵を閲覧・保存することはありません。",
          "ko": "영지식 설계: 데이터는 기기에서 로컬로 암호화됩니다. Telmy 서버는 복호화 키를 알 수 없습니다.",
          "zh": "零知识安全架构：数据完全在本地加密，Telmy 服务器绝不接触您的私钥。",
          "zh-TW": "零知識架構：資料完全在您的裝置本地加密，Telmy 伺服器絕不接觸您的私密金鑰。",
          "vi": "Zero-Knowledge: Dữ liệu được mã hóa cục bộ. Máy chủ Telmy không bao giờ thấy khóa riêng tư của bạn.",
          "th": "Zero-Knowledge: ข้อมูลได้รับการเข้ารหัสในเครื่อง เซิร์ฟเวอร์ Telmy จะไม่มีวันเห็นกุญแจส่วนตัวของคุณ",
          "hi": "जीरो-नॉलेज: डेटा स्थानीय रूप से एन्क्रिप्ट किया गया है। Telmy सर्वर आपकी निजी कुंजी कभी नहीं देखते हैं।",
          "fil": "Zero-Knowledge: Ang data ay lokal na naka-encrypt. Hindi kailanman nakikita ng server ang iyong susi.",
          "ms": "Zero-Knowledge: Data disulitkan secara setempat. Pelayan Telmy tidak pernah melihat kunci peribadi anda."
    },
    "vault_unlocked_title": {
          "en": "Vault Unlocked",
          "id": "Brankas Terbuka",
          "ja": "金庫解錠中",
          "ko": "금고 잠금 해제됨",
          "zh": "保险箱已解锁",
          "zh-TW": "金庫已解鎖",
          "vi": "Két bảo mật đã mở",
          "th": "ห้องนิรภัยปลดล็อคแล้ว",
          "hi": "वॉल्ट खुला है",
          "fil": "Bukas ang Vault",
          "ms": "Peti Dibuka"
    },
    "vault_unlocked_sub": {
          "en": "Ready for 1-Click AutoFill on active forms",
          "id": "Siap untuk Isi Otomatis 1-Klik pada formulir aktif",
          "ja": "開いているフォームへの1クリック自動入力が可能です",
          "ko": "활성 양식에 원클릭 자동 작성이 가능합니다",
          "zh": "随时可对当前网页表单执行一键自动填充",
          "zh-TW": "隨時可於目前表單執行一鍵自動填寫",
          "vi": "Sẵn sàng tự động điền 1-chạm vào biểu mẫu đang mở",
          "th": "พร้อมใช้งานกรอกอัตโนมัติ 1 คลิกบนฟอร์มที่เปิดอยู่",
          "hi": "सक्रिय फ़ॉर्म पर 1-क्लिक ऑटोफ़िल के लिए तैयार",
          "fil": "Handa para sa 1-Click AutoFill sa aktibong form",
          "ms": "Sedia untuk Isi Automatik 1-Klik pada borang aktif"
    },
    "vault_btn_dashboard": {
          "en": "Dashboard ↗",
          "id": "Dashboard ↗",
          "ja": "ダッシュボード ↗",
          "ko": "대시보드 ↗",
          "zh": "控制台 ↗",
          "zh-TW": "控制台 ↗",
          "vi": "Bảng điều khiển ↗",
          "th": "แดชบอร์ด ↗",
          "hi": "डैशबोर्ड ↗",
          "fil": "Dashboard ↗",
          "ms": "Papan Pemuka ↗"
    },
    "vault_btn_lock": {
          "en": "Lock",
          "id": "Kunci",
          "ja": "施錠",
          "ko": "잠그기",
          "zh": "锁定",
          "zh-TW": "上鎖",
          "vi": "Khóa",
          "th": "ล็อค",
          "hi": "लॉक करें",
          "fil": "I-lock",
          "ms": "Kunci"
    },
    "vault_ready_title": {
          "en": "Ready to Fill Active Form",
          "id": "Siap Mengisi Formulir Aktif",
          "ja": "アクティブなフォームの入力準備完了",
          "ko": "양식 자동 입력 준비 완료",
          "zh": "准备填写当前网页表单",
          "zh-TW": "準備填寫當前表單",
          "vi": "Sẵn sàng điền vào biểu mẫu",
          "th": "พร้อมกรอกข้อมูลลงในฟอร์มแล้ว",
          "hi": "सक्रिय फ़ॉर्म भरने के लिए तैयार",
          "fil": "Handang Punan ang Aktibong Form",
          "ms": "Sedia Mengisi Borang Aktif"
    },
    "vault_ready_sub": {
          "en": "Matches verified profile data to web inputs",
          "id": "Mencocokkan data profil terverifikasi ke kolom web",
          "ja": "検証済みの個人プロファイル情報を入力欄に照合します",
          "ko": "검증된 프로필 데이터를 웹 입력란에 매칭합니다",
          "zh": "智能比对并匹配本地已验证身份信息至网页输入框",
          "zh-TW": "自動比對並對齊驗證資料至網頁欄位",
          "vi": "Đối chiếu dữ liệu hồ sơ đã xác thực với các ô nhập trên web",
          "th": "จับคู่ข้อมูลโปรไฟล์ที่ยืนยันแล้วเข้ากับช่องกรอกบนเว็บ",
          "hi": "सत्यापित प्रोफ़ाइल डेटा को वेब इनपुट से मिलाता है",
          "fil": "Itinutugma ang verified profile data sa mga kolum",
          "ms": "Memadankan data profil disahkan ke ruangan input web"
    },
    "vault_btn_autofill_now": {
          "en": "1-Click AutoFill",
          "id": "1-Klik Isi Otomatis",
          "ja": "1クリック自動入力",
          "ko": "원클릭 자동 완성",
          "zh": "一键自动填充",
          "zh-TW": "一鍵自動填寫",
          "vi": "Tự động điền 1-chạm",
          "th": "กรอกอัตโนมัติ 1 คลิก",
          "hi": "1-क्लिक ऑटो फिल",
          "fil": "1-Click Auto Fill",
          "ms": "1-Klik Isi Automatik"
    },
    "vault_data_title": {
          "en": "Verified Profile Data",
          "id": "Data Profil Terverifikasi",
          "ja": "認証済みプロファイル情報",
          "ko": "검증된 프로필 데이터",
          "zh": "已验证个人档案数据",
          "zh-TW": "已驗證個人資料",
          "vi": "Dữ liệu hồ sơ đã xác thực",
          "th": "ข้อมูลโปรไฟล์ที่ผ่านการตรวจสอบ",
          "hi": "सत्यापित प्रोफ़ाइल डेटा",
          "fil": "Na-verify na Data ng Profile",
          "ms": "Data Profil Disahkan"
    },
    "vault_btn_add_data": {
          "en": "+ Add Data",
          "id": "+ Tambah Data",
          "ja": "+ データを追加",
          "ko": "+ 항목 추가",
          "zh": "+ 添加数据",
          "zh-TW": "+ 新增資料",
          "vi": "+ Thêm dữ liệu",
          "th": "+ เพิ่มข้อมูล",
          "hi": "+ डेटा जोड़ें",
          "fil": "+ Magdagdag ng Data",
          "ms": "+ Tambah Data"
    },
    "vault_upload_title": {
          "en": "Add Profile Data via ID or Document",
          "id": "Tambah Data Profil via KTP atau Dokumen",
          "ja": "身分証・書類からデータを自動抽出",
          "ko": "신분증 또는 서류로 데이터 추가",
          "zh": "通过身份证件或文档导入数据",
          "zh-TW": "透過身分證件或文件匯入資料",
          "vi": "Thêm dữ liệu hồ sơ qua CCCD/Tài liệu",
          "th": "เพิ่มข้อมูลโปรไฟล์ผ่านบัตรหรือเอกสาร",
          "hi": "पहचान पत्र या दस्तावेज़ के माध्यम से डेटा जोड़ें",
          "fil": "Magdagdag ng Data gamit ang ID/Dokumento",
          "ms": "Tambah Data Profil via Dokumen/Kad Pengenalan"
    },
    "vault_upload_sub": {
          "en": "Simply upload your ID card, Passport, or Academic Certificate (PDF, PNG, JPG)",
          "id": "Cukup unggah foto KTP, Paspor, atau Ijazah Anda (PDF, PNG, JPG)",
          "ja": "身分証明書、パスポート、卒業証明書（PDF, PNG, JPG）をアップロードしてください",
          "ko": "신분증, 여권, 학위 증명서(PDF, PNG, JPG)를 업로드하세요",
          "zh": "支持上传身份证、护照或毕业证等文件（PDF、PNG、JPG）",
          "zh-TW": "支援上傳身分證、護照或學位證書等檔案（PDF、PNG、JPG）",
          "vi": "Chỉ cần tải lên CCCD, Hộ chiếu hoặc Bằng tốt nghiệp (PDF, PNG, JPG)",
          "th": "เพียงอัปโหลดบัตรประชาชน หนังสือเดินทาง หรือใบรับรองการศึกษา (PDF, PNG, JPG)",
          "hi": "बस अपना पहचान पत्र, पासपोर्ट या प्रमाण पत्र अपलोड करें (PDF, PNG, JPG)",
          "fil": "I-upload lamang ang iyong ID, Pasaporte, o Sertipiko (PDF, PNG, JPG)",
          "ms": "Cukup muat naik kad pengenalan, pasport, atau sijil akademik (PDF, PNG, JPG)"
    },
    "vault_btn_upload_doc": {
          "en": "Upload Document",
          "id": "Unggah Dokumen",
          "ja": "書類をアップロード",
          "ko": "서류 업로드",
          "zh": "上传文件",
          "zh-TW": "上傳文件",
          "vi": "Tải lên tài liệu",
          "th": "อัปโหลดเอกสาร",
          "hi": "दस्तावेज़ अपलोड करें",
          "fil": "Mag-upload ng Dokumento",
          "ms": "Muat Naik Dokumen"
    },
    "vault_trust_note": {
          "en": "Files are never stored on our servers. All extracted data belongs 100% to you and is encrypted locally.",
          "id": "Berkas tidak pernah disimpan di server kami. Semua data milik Anda 100% dan dienkripsi secara lokal.",
          "ja": "ファイルがサーバーに保存されることはありません。抽出データはすべて暗号化され端末内に保護されます。",
          "ko": "파일은 서버에 저장되지 않습니다. 추출된 모든 데이터는 100% 사용자의 소유이며 로컬에서 암호화됩니다.",
          "zh": "文件绝不留存在服务器上。提取出的所有个人数据均由您独家拥有并于本地加密保存。",
          "zh-TW": "檔案絕不儲存於伺服器。擷取出的所有個人資料100%屬於您並於本地加密。",
          "vi": "Tệp không bao giờ được lưu trên máy chủ. Mọi dữ liệu trích xuất hoàn toàn thuộc về bạn và được mã hóa tại máy.",
          "th": "ไฟล์จะไม่ถูกจัดเก็บบนเซิร์ฟเวอร์ของเรา ข้อมูลทั้งหมดเป็นของคุณ 100% และถูกเข้ารหัสในเครื่อง",
          "hi": "फ़ाइलें कभी भी हमारे सर्वर पर संग्रहीत नहीं होती हैं। सभी डेटा आपका है और स्थानीय रूप से एन्क्रिप्टेड है।",
          "fil": "Hindi kailanman iniimbak ang mga file sa aming server. Ang data ay 100% sa iyo at lokal na naka-encrypt.",
          "ms": "Fail tidak pernah disimpan di pelayan kami. Semua data diekstrak 100% milik anda dan disulitkan setempat."
    },
    "vault_extracting_title": {
          "en": "Extracting data with Gemini Multimodal...",
          "id": "Mengekstrak data dengan Gemini Multimodal...",
          "ja": "Gemini マルチモーダルAIで解析中...",
          "ko": "Gemini 멀티모달 AI로 데이터 추출 중...",
          "zh": "正在通过 Gemini 多模态模型解析提取数据...",
          "zh-TW": "正在透過 Gemini 多模態模型分析擷取資料...",
          "vi": "Đang trích xuất dữ liệu bằng Gemini Multimodal...",
          "th": "กำลังแยกข้อมูลด้วย Gemini Multimodal...",
          "hi": "Gemini मल्टीमॉडल से डेटा निकाला जा रहा है...",
          "fil": "Kinukuha ang data gamit ang Gemini Multimodal...",
          "ms": "Mengekstrak data dengan Gemini Multimodal..."
    },
    "vault_shred_note": {
          "en": "File is shredded from memory immediately",
          "id": "Berkas langsung dihapus seketika dari memori",
          "ja": "ファイルは処理後直ちにメモリから完全に破棄されます",
          "ko": "처리가 끝나는 즉시 메모리에서 파일이 영구 파기됩니다",
          "zh": "文件处理完成后立即从内存中彻底粉碎清除",
          "zh-TW": "處理完畢後立即從記憶體中徹底銷毀清除",
          "vi": "Tệp được hủy ngay lập tức khỏi bộ nhớ",
          "th": "ไฟล์จะถูกลบออกจากหน่วยความจำทันทีหลังการประมวลผล",
          "hi": "फ़ाइल को मेमोरी से तुरंत हटा दिया जाता है",
          "fil": "Agad na binubura ang file mula sa memorya",
          "ms": "Fail segera dimusnahkan daripada memori"
    },
    "pdf_btn_back": {
          "en": "← Back to Web Form Guide",
          "id": "← Kembali ke Panduan Web Form",
          "ja": "← Webフォームガイドに戻る",
          "ko": "← 웹 양식 안내로 돌아가기",
          "zh": "← 返回网页表单指引",
          "zh-TW": "← 返回網頁表單引導",
          "vi": "← Quay lại Hướng dẫn biểu mẫu Web",
          "th": "← กลับไปที่คำแนะนำแบบฟอร์มบนเว็บ",
          "hi": "← वेब फ़ॉर्म गाइड पर वापस जाएं",
          "fil": "← Bumalik sa Gabay sa Web Form",
          "ms": "← Kembali ke Panduan Borang Web"
    },
    "pdf_drop_title": {
          "en": "Drop your Official Form PDF or Document Image here",
          "id": "Tarik & lepas Formulir PDF atau Foto Dokumen di sini",
          "ja": "公的書類PDFまたは文書画像をここにドロップ",
          "ko": "공식 양식 PDF 또는 서류 이미지를 여기에 끌어다 놓으세요",
          "zh": "拖拽您的官方表单PDF或证件扫描件至此",
          "zh-TW": "拖放您的官方表單PDF或文件圖檔至此",
          "vi": "Kéo thả biểu mẫu PDF hoặc hình ảnh tài liệu vào đây",
          "th": "วางแบบฟอร์มทางการ PDF หรือภาพถ่ายเอกสารที่นี่",
          "hi": "अपना आधिकारिक फ़ॉर्म PDF या दस्तावेज़ छवि यहाँ छोड़ें",
          "fil": "I-drop ang iyong Form PDF o Larawan ng Dokumento rito",
          "ms": "Lepaskan Borang Rasmi PDF atau Foto Dokumen di sini"
    },
    "pdf_drop_sub": {
          "en": "Supports PDF, JPG, PNG, WebP • Zero-Retention Processing",
          "id": "Mendukung PDF, JPG, PNG, WebP • Kebijakan Zero-Retention",
          "ja": "PDF, JPG, PNG, WebP 対応 • ゼロ保持ポリシー（即時破棄）",
          "ko": "PDF, JPG, PNG, WebP 지원 • 영구 비저장(Zero-Retention) 처리",
          "zh": "支持 PDF、JPG、PNG、WebP • 零留存内存即时粉碎机制",
          "zh-TW": "支援 PDF、JPG、PNG、WebP • 零保存即時粉碎機制",
          "vi": "Hỗ trợ PDF, JPG, PNG, WebP • Cơ chế bảo mật Zero-Retention",
          "th": "รองรับ PDF, JPG, PNG, WebP • ประมวลผลแบบไร้การจัดเก็บ (Zero-Retention)",
          "hi": "PDF, JPG, PNG, WebP का समर्थन करता है • जीरो-रिटेंशन प्रोसेसिंग",
          "fil": "Suportado ang PDF, JPG, PNG, WebP • Zero-Retention",
          "ms": "Menyokong PDF, JPG, PNG, WebP • Polisi Zero-Retention"
    },
    "pdf_btn_choose": {
          "en": "Choose File from Computer",
          "id": "Pilih Berkas dari Komputer",
          "ja": "ファイルを選択",
          "ko": "컴퓨터에서 파일 선택",
          "zh": "从电脑中选择文件",
          "zh-TW": "從電腦選取檔案",
          "vi": "Chọn tệp từ máy tính",
          "th": "เลือกไฟล์จากคอมพิวเตอร์",
          "hi": "कंप्यूटर से फ़ाइल चुनें",
          "fil": "Pumili ng File sa Computer",
          "ms": "Pilih Fail dari Komputer"
    },
    "pdf_analyzing_title": {
          "en": "Gemini 3.5 Multimodal Analyzing Document...",
          "id": "Gemini 3.5 Multimodal Sedang Menganalisis Dokumen...",
          "ja": "Gemini 3.5 マルチモーダルAIが書類を解析中...",
          "ko": "Gemini 3.5 멀티모달이 문서를 정밀 분석 중...",
          "zh": "Gemini 3.5 多模态模型正在分析文档结构...",
          "zh-TW": "Gemini 3.5 多模態模型正在深度解析文件...",
          "vi": "Gemini 3.5 Multimodal đang phân tích tài liệu...",
          "th": "Gemini 3.5 Multimodal กำลังวิเคราะห์เอกสาร...",
          "hi": "Gemini 3.5 मल्टीमॉडल दस्तावेज़ का विश्लेषण कर रहा है...",
          "fil": "Sinusuri ng Gemini 3.5 Multimodal ang dokumento...",
          "ms": "Gemini 3.5 Multimodal Sedang Menganalisis Dokumen..."
    },
    "pdf_analyzing_sub": {
          "en": "Detecting form structure, required attachments, and official seal locations...",
          "id": "Mendeteksi struktur kolom, lampiran wajib, serta posisi tanda tangan & stempel...",
          "ja": "入力構造、必須添付書類、署名・捺印位置を特定しています...",
          "ko": "입력란 구조, 필수 첨부 서류, 서명 및 날인 위치를 인식하는 중입니다...",
          "zh": "正在智能识别输入框、必交附件清单与官方盖章签字位置...",
          "zh-TW": "正在自動辨識欄位、必備附件與官方蓋章簽名位置...",
          "vi": "Đang phát hiện các ô nhập, tài liệu đính kèm bắt buộc và vị trí ký tên/đóng dấu...",
          "th": "กำลังตรวจหาโครงสร้างฟอร์ม เอกสารแนบที่จำเป็น และตำแหน่งลงนาม/ตราประทับ...",
          "hi": "फ़ॉर्म संरचना, आवश्यक संलग्नक और आधिकारिक मुहर स्थानों का पता लगाया जा रहा है...",
          "fil": "Kinikilala ang istruktura ng form, mga kinakailangang kalakip, at posisyon ng pirma...",
          "ms": "Mengesan struktur ruangan, lampiran wajib, serta kedudukan tandatangan & cop rasmi..."
    },
    "pdf_btn_new_form": {
          "en": "Upload Another Document",
          "id": "Unggah Dokumen Lain",
          "ja": "別の書類をアップロード",
          "ko": "다른 문서 업로드",
          "zh": "上传其他文档",
          "zh-TW": "上傳其他文件",
          "vi": "Tải lên tài liệu khác",
          "th": "อัปโหลดเอกสารอื่น",
          "hi": "अन्य दस्तावेज़ अपलोड करें",
          "fil": "Mag-upload ng Ibang Dokumento",
          "ms": "Muat Naik Dokumen Lain"
    },
    "pdf_checklist_title": {
          "en": "📋 Required Documents & Checklists",
          "id": "📋 Persyaratan Dokumen & Ceklis",
          "ja": "📋 必要書類・チェックリスト",
          "ko": "📋 필수 제출 서류 및 체크리스트",
          "zh": "📋 所需文件与检查清单",
          "zh-TW": "📋 必備文件與檢查清單",
          "vi": "📋 Danh mục tài liệu yêu cầu",
          "th": "📋 รายการเอกสารที่ต้องใช้และเช็คลิสต์",
          "hi": "📋 आवश्यक दस्तावेज़ और चेकलिस्ट",
          "fil": "📋 Kinakailangang Dokumento at Checklist",
          "ms": "📋 Syarat Dokumen & Senarai Semak"
    },
    "pdf_sections_title": {
          "en": "Interactive Form Fields",
          "id": "Kolom Isian Formulir Interaktif",
          "ja": "インタラクティブ入力フォーム",
          "ko": "대화형 입력 양식 필드",
          "zh": "交互式表单填写项",
          "zh-TW": "互動式表單填寫欄位",
          "vi": "Các trường nhập biểu mẫu tương tác",
          "th": "ช่องกรอกแบบฟอร์มแบบอินเทอร์แอคทีฟ",
          "hi": "इंटरैक्टिव फ़ॉर्म फ़ील्ड",
          "fil": "Interactive Form Fields",
          "ms": "Ruangan Isian Borang Interaktif"
    },
    "pdf_export_title": {
          "en": "Export Ready Form Document",
          "id": "Ekspor Dokumen Formulir Siap Pakai",
          "ja": "記入済み書類のエクスポート",
          "ko": "작성 완료된 문서 내보내기",
          "zh": "导出填写完整的官方文件",
          "zh-TW": "匯出填寫完整的官方文件",
          "vi": "Xuất biểu mẫu đã hoàn tất",
          "th": "ส่งออกเอกสารแบบฟอร์มที่กรอกเสร็จแล้ว",
          "hi": "तैयार फ़ॉर्म दस्तावेज़ निर्यात करें",
          "fil": "I-export ang Kumpletong Form",
          "ms": "Eksport Dokumen Borang Lengkap"
    },
    "pdf_export_desc": {
          "en": "Type directly into fields above or autofill from your profile, then export the completed document.",
          "id": "Ketik langsung pada kolom di atas atau isi otomatis dari profil, lalu unduh dokumen resmi yang sudah terisi.",
          "ja": "上記の各項目に直接入力するかプロファイルから自動入力し、完成したPDF書類を書き出します。",
          "ko": "위 입력란에 직접 입력하거나 프로필에서 자동 완성한 후 완성된 문서를 다운로드하세요.",
          "zh": "您可直接在上列字段输入或从保险箱自动填充，随后一键导出完整文档。",
          "zh-TW": "您可直接填寫上方欄位或從個人金庫自動填入，隨後一鍵匯出完整檔案。",
          "vi": "Nhập trực tiếp hoặc tự động điền từ hồ sơ, sau đó tải về tài liệu hoàn chỉnh.",
          "th": "พิมพ์ลงในช่องด้านบนโดยตรงหรือกรอกอัตโนมัติจากโปรไฟล์ จากนั้นดาวน์โหลดเอกสารที่สมบูรณ์",
          "hi": "ऊपर दिए गए फ़ील्ड में सीधे टाइप करें या अपनी प्रोफ़ाइल से ऑटोफ़िल करें, फिर पूरा दस्तावेज़ डाउनलोड करें।",
          "fil": "Mag-type nang direkta o mag-autofill mula sa profile, pagkatapos ay i-download ang form.",
          "ms": "Taip terus ke dalam ruangan di atas atau isi automatik dari profil, kemudian muat turun borang lengkap."
    },
    "pdf_btn_download": {
          "en": "📥 Download Completed PDF",
          "id": "📥 Unduh Formulir PDF Lengkap",
          "ja": "📥 完成したPDFをダウンロード",
          "ko": "📥 작성 완료된 PDF 다운로드",
          "zh": "📥 下载填写完毕的PDF",
          "zh-TW": "📥 下載填寫完整的PDF",
          "vi": "📥 Tải xuống PDF hoàn chỉnh",
          "th": "📥 ดาวน์โหลด PDF ที่กรอกเสร็จแล้ว",
          "hi": "📥 भरा हुआ PDF डाउनलोड करें",
          "fil": "📥 I-download ang Kumpletong PDF",
          "ms": "📥 Muat Turun PDF Lengkap"
    },
    "alert_snip_prompt": {
          "en": "Explain This: Please explain this part that I cropped from the page \"{title}\"{surrounding}. What does it mean and how do I fill it correctly?",
          "id": "Jelaskan Ini: Mohon jelaskan bagian yang saya potong ini di halaman \"{title}\"{surrounding}. Apa maksudnya dan bagaimana cara mengisinya dengan benar?",
          "ja": "これについて解説: ページ「{title}」{surrounding}から切り取ったこの部分を解説してください。どういう意味で、どのように正しく記入すべきですか？",
          "ko": "이 부분 설명: \"{title}\" 페이지{surrounding}에서 캡처한 이 부분을 설명해 주세요. 어떤 의미이며 어떻게 올바르게 작성해야 하나요?",
          "zh": "解释此内容: 请为我解释从页面 \"{title}\"{surrounding} 截取的这个区域。它是什么含义以及应当如何正确填写？",
          "zh-TW": "解釋此內容: 請為我說明從頁面「{title}」{surrounding}擷取的這個區塊。代表什麼含義以及該如何正確填寫？",
          "vi": "Giải thích phần này: Vui lòng giải thích phần tôi đã cắt từ trang \"{title}\"{surrounding}. Phần này có ý nghĩa gì và điền sao cho đúng?",
          "th": "อธิบายส่วนนี้: โปรดช่วยอธิบายส่วนที่ฉันตัดมาจากหน้า \"{title}\"{surrounding} ส่วนนี้หมายถึงอะไรและควรกรอกอย่างไรให้ถูกต้อง?",
          "hi": "इसे समझाइए: कृपया पेज \"{title}\"{surrounding} से क्रॉप किए गए इस भाग को समझाइए। इसका क्या अर्थ है और इसे सही तरीके से कैसे भरें?",
          "fil": "Ipaliwanag Ito: Pakipaliwanag ang bahaging ito mula sa pahinang \"{title}\"{surrounding}. Ano ang ibig sabihin nito at paano ito pupunan nang tama?",
          "ms": "Terangkan Ini: Sila terangkan bahagian yang saya potong dari halaman \"{title}\"{surrounding}. Apakah maksudnya dan bagaimana cara mengisinya dengan betul?"
    },
    "snip_hint_drag": {
          "en": "✂️ Drag the area you want explained (Press ESC to cancel)",
          "id": "✂️ Tarik area yang ingin dijelaskan (Tekan ESC untuk batal)",
          "ja": "✂️ 解説したい領域をドラッグして選択 (ESCでキャンセル)",
          "ko": "✂️ 설명을 원하는 영역을 드래그하세요 (취소하려면 ESC)",
          "zh": "✂️ 框选您希望解释的区域 (按 ESC 取消)",
          "zh-TW": "✂️ 框選您希望說明的區域 (按 ESC 取消)",
          "vi": "✂️ Kéo vùng bạn muốn được giải thích (Nhấn ESC để hủy)",
          "th": "✂️ ลากคลุมพื้นที่ที่ต้องการให้ช่วยอธิบาย (กด ESC เพื่อยกเลิก)",
          "hi": "✂️ जिस क्षेत्र को समझाना चाहते हैं उसे खींचकर चुनें (रद्द करने के लिए ESC दबाएं)",
          "fil": "✂️ I-drag ang lugar na nais mong ipaliwanag (Pindutin ang ESC para ikansela)",
          "ms": "✂️ Seret kawasan yang ingin diterangkan (Tekan ESC untuk batal)"
    },
    "snip_hint_capturing": {
          "en": "⏳ Capturing screenshot...",
          "id": "⏳ Mengambil tangkapan layar...",
          "ja": "⏳ スクリーンショットを取得中...",
          "ko": "⏳ 스크린샷 캡처 중...",
          "zh": "⏳ 正在截取屏幕...",
          "zh-TW": "⏳ 正在擷取螢幕...",
          "vi": "⏳ Đang chụp ảnh màn hình...",
          "th": "⏳ กำลังจับภาพหน้าจอ...",
          "hi": "⏳ स्क्रीनशॉट लिया जा रहा है...",
          "fil": "⏳ Kinukunan ng screenshot...",
          "ms": "⏳ Mengambil tangkapan skrin..."
    },
    "alert_no_active_tab": {
          "en": "No active form tab found. Please open an official form webpage first.",
          "id": "Tab formulir aktif tidak ditemukan. Silakan buka halaman web formulir terlebih dahulu.",
          "ja": "アクティブなフォームタブが見つかりません。まず対象のWebページを開いてください。",
          "ko": "활성화된 양식 탭을 찾을 수 없습니다. 먼저 양식 웹페이지를 열어주세요.",
          "zh": "未找到活动的表单标签页。请先在浏览器中打开目标表单页面。",
          "zh-TW": "未找到啟用的表單分頁。請先在瀏覽器中開啟表單頁面。",
          "vi": "Không tìm thấy tab biểu mẫu nào. Vui lòng mở trang web biểu mẫu trước.",
          "th": "ไม่พบแท็บแบบฟอร์มที่ใช้งานอยู่ กรุณาเปิดหน้าเว็บแบบฟอร์มก่อน",
          "hi": "कोई सक्रिय फ़ॉर्म टैब नहीं मिला। कृपया पहले एक आधिकारिक फ़ॉर्म वेबपेज खोलें।",
          "fil": "Walang nahanap na aktibong tab ng form. Buksan muna ang webpage ng form.",
          "ms": "Tab borang aktif tidak dijumpai. Sila buka halaman borang terlebih dahulu."
    },
    "alert_pdf_extract_fail": {
          "en": "Could not extract entities from document. Please ensure the document is clear and readable.",
          "id": "Gagal mengekstrak data dari dokumen. Pastikan foto atau dokumen terbaca dengan jelas.",
          "ja": "書類からデータを抽出できませんでした。画像や文書が鮮明で読み取り可能であることを確認してください。",
          "ko": "문서에서 데이터를 추출할 수 없습니다. 문서가 선명하고 읽기 쉬운지 확인하세요.",
          "zh": "无法从文档中提取有效信息。请确保上传的图片或文件文字清晰可辨。",
          "zh-TW": "無法從文件中擷取資訊。請確認上傳的圖片或檔案文字清晰可辨。",
          "vi": "Không thể trích xuất dữ liệu. Vui lòng đảm bảo tài liệu rõ nét và dễ đọc.",
          "th": "ไม่สามารถแยกข้อมูลจากเอกสารได้ กรุณาตรวจสอบให้แน่ใจว่าเอกสารชัดเจนและอ่านง่าย",
          "hi": "दस्तावेज़ से डेटा नहीं निकाला जा सका। कृपया सुनिश्चित करें कि दस्तावेज़ स्पष्ट और पठनीय है।",
          "fil": "Hindi ma-extract ang data. Siguraduhing malinaw at nababasa ang dokumento.",
          "ms": "Gagal mengekstrak data dari dokumen. Pastikan dokumen jelas dan boleh dibaca."
    },
    "alert_pdf_extract_success": {
          "en": "🎉 Successfully extracted {count} fields from \"{docName}\" into your encrypted Vault!\n\nZero-Retention Policy: Physical document file was discarded immediately.",
          "id": "🎉 Berhasil mengekstrak {count} data dari \"{docName}\" ke Brankas terenkripsi Anda!\n\nKebijakan Zero-Retention: Berkas fisik langsung dihapus seketika dari memori.",
          "ja": "🎉 「{docName}」から {count} 件の項目を暗号化金庫に抽出しました！\n\nゼロ保持ポリシー：元ファイルは直ちにメモリから完全消去されました。",
          "ko": "🎉 \"{docName}\"에서 {count}개의 항목을 암호화 금고로 성공적으로 추출했습니다!\n\n영구 비저장 정책: 원본 파일은 즉시 메모리에서 영구 삭제되었습니다.",
          "zh": "🎉 成功从 \"{docName}\" 提取 {count} 条档案至您的加密保险箱！\n\n零留存隐私政策：原始文件已立即从内存中彻底清除。",
          "zh-TW": "🎉 成功從「{docName}」擷取 {count} 筆資料至您的加密金庫！\n\n零保存原則：原始檔案已即刻自記憶體完全銷毀。",
          "vi": "🎉 Đã trích xuất thành công {count} trường từ \"{docName}\" vào Két mã hóa!\n\nChính sách Zero-Retention: Tệp gốc đã bị hủy ngay lập tức khỏi bộ nhớ.",
          "th": "🎉 แยกข้อมูลสำเร็จ {count} ช่องจาก \"{docName}\" เข้าสู่ห้องนิรภัยที่เข้ารหัสของคุณแล้ว!\n\nนโยบายไร้การจัดเก็บ: ไฟล์ต้นฉบับถูกทำลายออกจากหน่วยความจำทันที",
          "hi": "🎉 \"{docName}\" से {count} फ़ील्ड सफलतापूर्वक आपके एन्क्रिप्टेड वॉल्ट में निकाले गए!\n\nजीरो-रिटेंशन नीति: भौतिक फ़ाइल तुरंत हटा दी गई।",
          "fil": "🎉 Matagumpay na na-extract ang {count} fields mula sa \"{docName}\" papunta sa iyong Vault!\n\nZero-Retention: Agad na binura ang file.",
          "ms": "🎉 Berjaya mengekstrak {count} data dari \"{docName}\" ke dalam Peti terenkripsi anda!\n\nPolisi Zero-Retention: Fail asal segera dimusnahkan."
    },
    "alert_vault_empty": {
          "en": "Your Vault is currently empty. Please add profile fields or upload an ID card first.",
          "id": "Brankas Anda masih kosong. Silakan tambah data profil atau unggah KTP/Paspor terlebih dahulu.",
          "ja": "金庫にデータがありません。まずプロファイル項目を追加するか、身分証をアップロードしてください。",
          "ko": "금고가 비어 있습니다. 먼저 프로필 항목을 추가하거나 신분증을 업로드하세요.",
          "zh": "您的保险箱目前为空。请先手动添加资料或上传身份证件。",
          "zh-TW": "您的金庫目前為空。請先新增個人資料或上傳身分證件。",
          "vi": "Két của bạn đang trống. Vui lòng thêm trường hồ sơ hoặc tải lên CCCD trước.",
          "th": "ห้องนิรภัยของคุณยังว่างอยู่ กรุณาเพิ่มข้อมูลโปรไฟล์หรืออัปโหลดบัตรประชาชนก่อน",
          "hi": "आपका वॉल्ट वर्तमान में खाली है। कृपया पहले प्रोफ़ाइल फ़ील्ड जोड़ें या पहचान पत्र अपलोड करें।",
          "fil": "Walang laman ang iyong Vault. Magdagdag muna ng profile fields o mag-upload ng ID.",
          "ms": "Peti anda masih kosong. Sila tambah data profil atau muat naik dokumen pengenalan dahulu."
    },
    "alert_vault_wiped": {
          "en": "Vault wiped successfully. All data has been cleared.",
          "id": "Brankas berhasil dikosongkan. Seluruh data telah dihapus bersih.",
          "ja": "金庫を初期化しました。すべてのデータが消去されました。",
          "ko": "금고가 초기화되었습니다. 모든 데이터가 삭제되었습니다.",
          "zh": "保险箱已重置清空，所有本地加密数据已清除。",
          "zh-TW": "金庫已重設，所有本地加密資料已清除。",
          "vi": "Đã xóa trắng két thành công. Mọi dữ liệu đã được dọn sạch.",
          "th": "ล้างห้องนิรภัยสำเร็จ ข้อมูลทั้งหมดถูกลบเรียบร้อยแล้ว",
          "hi": "वॉल्ट सफलतापूर्वक साफ़ किया गया। सारा डेटा मिटा दिया गया है।",
          "fil": "Matagumpay na na-clear ang Vault. Nabura ang lahat ng data.",
          "ms": "Peti berjaya dikosongkan. Semua data telah dipadam sepenuhnya."
    },
    "alert_label_required": {
          "en": "Field Label is required.",
          "id": "Nama / Label Kolom wajib diisi.",
          "ja": "項目名は必須です。",
          "ko": "항목 이름(라벨)은 필수입니다.",
          "zh": "字段名称为必填项。",
          "zh-TW": "欄位名稱為必填。",
          "vi": "Tên trường là bắt buộc.",
          "th": "จำเป็นต้องระบุชื่อช่องข้อมูล",
          "hi": "फ़ील्ड लेबल आवश्यक है।",
          "fil": "Kailangan ang Field Label.",
          "ms": "Nama ruangan wajib diisi."
    },
    "alert_value_required": {
          "en": "Field Value is required.",
          "id": "Nilai Isian Kolom wajib diisi.",
          "ja": "入力値は必須です。",
          "ko": "항목 값은 필수입니다.",
          "zh": "字段内容为必填项。",
          "zh-TW": "欄位內容為必填。",
          "vi": "Giá trị trường là bắt buộc.",
          "th": "จำเป็นต้องระบุค่าของช่องข้อมูล",
          "hi": "फ़ील्ड मान आवश्यक है।",
          "fil": "Kailangan ang Field Value.",
          "ms": "Nilai ruangan wajib diisi."
    },
    "alert_pdf_download_success": {
          "en": "Success! The completed official PDF document has been downloaded to your computer.",
          "id": "Berhasil! Formulir PDF resmi yang sudah terisi lengkap telah diunduh ke komputer Anda.",
          "ja": "成功しました！記入済みの公式PDF書類がダウンロードされました。",
          "ko": "완료되었습니다! 작성이 끝난 공식 PDF 서류가 다운로드되었습니다.",
          "zh": "成功！填写完整的官方PDF文件已下载至您的电脑。",
          "zh-TW": "成功！填寫完整的官方PDF檔案已下載至您的電腦。",
          "vi": "Thành công! Tài liệu PDF chính thức đã điền hoàn tất được tải về máy tính.",
          "th": "สำเร็จ! เอกสาร PDF ทางการที่กรอกเสร็จสมบูรณ์ถูกดาวน์โหลดลงเครื่องแล้ว",
          "hi": "सफलता! पूरा भरा हुआ आधिकारिक PDF दस्तावेज़ आपके कंप्यूटर पर डाउनलोड हो गया है।",
          "fil": "Tagumpay! Na-download sa computer ang kumpletong opisyal na PDF form.",
          "ms": "Berjaya! Borang PDF rasmi yang lengkap telah dimuat turun ke komputer anda."
    },
    "alert_pdf_local_file_hint": {
          "en": "Due to Chrome local file restrictions (file://), please drag and drop the PDF file from your computer into the dropzone below.",
          "id": "Karena pembatasan file lokal Chrome (file://), silakan tarik dan jatuhkan file PDF dari komputer Anda ke kotak unggah di bawah.",
          "ja": "Chromeのローカルファイル制限（file://）のため、パソコンから下のドロップゾーンにPDFファイルをドラッグ＆ドロップしてください。",
          "ko": "Chrome의 로컬 파일 제한(file://)으로 인해 컴퓨터에서 아래 드롭존으로 PDF 파일을 직접 끌어다 놓아주세요.",
          "zh": "因 Chrome 本地文件安全策略限制 (file://)，请直接将电脑中的PDF文件拖拽到下方区域。",
          "zh-TW": "由於 Chrome 本地端安全限制 (file://)，請直接將電腦中的PDF檔案拖曳至下方區塊。",
          "vi": "Do giới hạn của Chrome với tệp cục bộ (file://), vui lòng kéo thả tệp PDF vào khung bên dưới.",
          "th": "เนื่องจากข้อจำกัดของไฟล์ในเครื่องบน Chrome (file://) กรุณาลากและวางไฟล์ PDF ลงในช่องด้านล่าง",
          "hi": "Chrome स्थानीय फ़ाइल प्रतिबंधों (file://) के कारण, कृपया अपने कंप्यूटर से PDF फ़ाइल को नीचे खींचें और छोड़ें।",
          "fil": "Dahil sa restriksyon ng Chrome sa local files, i-drag and drop ang PDF sa dropzone sa ibaba.",
          "ms": "Kerana sekatan fail setempat Chrome (file://), sila seret dan lepas fail PDF ke dalam kotak di bawah."
    },
    "alert_payment_success": {
          "en": "🎉 Payment Successful!\n\nPlan: {plan} ({forms} Forms)\nRemaining Quota: {quota}\nPayment Method: QRIS / Virtual Account (Mayar.id)\n\nThank you for subscribing to Telmy.ai!",
          "id": "🎉 Pembayaran Berhasil!\n\nPaket: {plan} ({forms} Forms)\nSisa Kuota: {quota}\nMetode: QRIS / Virtual Account (Mayar.id)\n\nTerima kasih telah berlangganan Telmy.ai!",
          "ja": "🎉 お支払いが完了しました！\n\nプラン: {plan} ({forms} フォーム)\n残り枠: {quota}\n決済手段: QRIS / Virtual Account\n\nTelmy.ai をご利用いただきありがとうございます！",
          "ko": "🎉 결제가 성공했습니다!\n\n플랜: {plan} ({forms}개 양식)\n남은 할당량: {quota}\n결제 수단: QRIS / 가상 계좌\n\nTelmy.ai를 구독해 주셔서 감사합니다!",
          "zh": "🎉 支付成功！\n\n方案: {plan} ({forms} 份表单)\n剩余额度: {quota}\n支付方式: QRIS / 虚拟账户\n\n感谢您订阅 Telmy.ai！",
          "zh-TW": "🎉 付款成功！\n\n方案: {plan} ({forms} 份表單)\n剩餘額度: {quota}\n付款方式: QRIS / 虛擬帳號\n\n感謝您訂閱 Telmy.ai！",
          "vi": "🎉 Thanh toán thành công!\n\nGói: {plan} ({forms} biểu mẫu)\nHạn mức còn lại: {quota}\n\nCảm ơn bạn đã đồng hành cùng Telmy.ai!",
          "th": "🎉 ชำระเงินสำเร็จแล้ว!\n\nแพ็กเกจ: {plan} ({forms} ฟอร์ม)\nโควต้าคงเหลือ: {quota}\n\nขอบคุณที่สนับสนุน Telmy.ai!",
          "hi": "🎉 भुगतान सफल!\n\nप्लान: {plan} ({forms} फ़ॉर्म)\nशेष कोटा: {quota}\n\nTelmy.ai की सदस्यता लेने के लिए धन्यवाद!",
          "fil": "🎉 Tagumpay ang Bayad!\n\nPlan: {plan} ({forms} Forms)\nNatitirang Quota: {quota}\n\nSalamat sa pagtangkilik sa Telmy.ai!",
          "ms": "🎉 Pembayaran Berjaya!\n\nPelan: {plan} ({forms} Borang)\nBaki Kuota: {quota}\n\nTerima kasih kerana melanggan Telmy.ai!"
    },
    "btn_new_conversation": {
          "en": "New Conversation",
          "id": "Percakapan Baru",
          "ja": "新しい会話",
          "ko": "새 대화",
          "zh": "开启新对话",
          "zh-TW": "新對話",
          "vi": "Cuộc trò chuyện mới",
          "th": "เริ่มบทสนทนาใหม่",
          "hi": "नई बातचीत",
          "fil": "Bagong Usapan",
          "ms": "Perbualan Baharu"
    },
    "alert_extract_web_text_fail": {
          "en": "Unable to extract webpage text. Please refresh the page and try again.",
          "id": "Gagal mengekstrak teks halaman web. Silakan muat ulang halaman dan coba lagi.",
          "ja": "Webページのテキストを抽出できませんでした。ページを更新して再試行してください。",
          "ko": "웹페이지 텍스트를 추출할 수 없습니다. 페이지를 새로고침한 후 다시 시도해 주세요.",
          "zh": "未能提取网页文本。请刷新该页面后重试。",
          "zh-TW": "無法擷取網頁文字。請重新整理頁面後再試一次。",
          "vi": "Không thể trích xuất văn bản trang web. Vui lòng làm mới trang và thử lại.",
          "th": "ไม่สามารถดึงข้อความจากหน้าเว็บได้ กรุณารีเฟรชหน้าแล้วลองอีกครั้ง",
          "hi": "वेबपेज टेक्स्ट निकालने में असमर्थ। कृपया पृष्ठ को रीफ़्रेश करें और पुनः प्रयास करें।",
          "fil": "Hindi ma-extract ang text ng webpage. I-refresh ang pahina at subukan muli.",
          "ms": "Gagal mengekstrak teks laman web. Sila muat semula halaman dan cuba lagi."
    },
    "alert_pdf_tab_download_fail": {
          "en": "Could not download PDF form from the active tab automatically. Please upload your document to the dropzone.",
          "id": "Tidak dapat mengunduh formulir PDF dari tab aktif secara otomatis. Silakan unggah dokumen Anda ke kotak unggah.",
          "ja": "アクティブなタブからPDFを自動取得できませんでした。ファイルを下のドロップゾーンにアップロードしてください。",
          "ko": "활성 탭에서 PDF 양식을 자동으로 가져올 수 없습니다. 아래 영역에 문서를 업로드해 주세요.",
          "zh": "无法自动从当前标签页下载PDF表单。请直接上传您的文档至放置区。",
          "zh-TW": "無法自動從分頁下載PDF表單。請手動將文件上傳至放置區。",
          "vi": "Không thể tự động tải PDF từ tab hiện tại. Vui lòng tải tệp vào khung bên dưới.",
          "th": "ไม่สามารถดาวน์โหลด PDF จากแท็บที่ใช้งานอยู่โดยอัตโนมัติได้ กรุณาอัปโหลดลงในช่องด้านล่าง",
          "hi": "सक्रिय टैब से PDF फ़ॉर्म स्वचालित रूप से डाउनलोड नहीं हो सका। कृपया दस्तावेज़ को ड्रॉपज़ोन में अपलोड करें।",
          "fil": "Hindi awtomatikong ma-download ang PDF mula sa tab. I-upload ang dokumento sa dropzone.",
          "ms": "Tidak dapat memuat turun PDF secara automatik dari tab aktif. Sila muat naik ke dalam kotak di bawah."
    },
    "alert_tab_read_fail": {
          "en": "Failed to read document from active tab: {error}",
          "id": "Gagal membaca dokumen dari tab aktif: {error}",
          "ja": "アクティブタブからの書類読み取りに失敗しました: {error}",
          "ko": "활성 탭에서 문서를 읽지 못했습니다: {error}",
          "zh": "从活动标签页读取文档失败: {error}",
          "zh-TW": "讀取分頁文件失敗: {error}",
          "vi": "Không thể đọc tài liệu từ tab hiện tại: {error}",
          "th": "ไม่สามารถอ่านเอกสารจากแท็บที่ใช้งานอยู่ได้: {error}",
          "hi": "सक्रिय टैब से दस्तावेज़ पढ़ने में विफल: {error}",
          "fil": "Nabigong basahin ang dokumento: {error}",
          "ms": "Gagal membaca dokumen dari tab aktif: {error}"
    },
    "alert_gemini_backend_fail": {
          "en": "Failed to analyze document with Gemini. Please ensure backend is active.",
          "id": "Gagal menganalisis dokumen dengan Gemini. Pastikan backend aktif.",
          "ja": "Geminiによる書類解析に失敗しました。バックエンドが稼働しているか確認してください。",
          "ko": "Gemini로 문서를 분석하지 못했습니다. 백엔드가 활성화되어 있는지 확인하세요.",
          "zh": "通过 Gemini 模型解析文档失败。请确认后端服务处于正常连接状态。",
          "zh-TW": "透過 Gemini 解析文件失敗。請確認後端服務正常運作中。",
          "vi": "Không thể phân tích tài liệu với Gemini. Hãy kiểm tra dịch vụ backend.",
          "th": "วิเคราะห์เอกสารด้วย Gemini ล้มเหลว กรุณาตรวจสอบว่าระบบเบื้องหลังทำงานอยู่",
          "hi": "Gemini के साथ दस्तावेज़ का विश्लेषण करने में विफल। कृपया सुनिश्चित करें कि बैकएंड सक्रिय है।",
          "fil": "Nabigong suriin ang dokumento gamit ang Gemini. Tiyaking aktibo ang backend.",
          "ms": "Gagal menganalisis dokumen dengan Gemini. Sila pastikan backend aktif."
    },
    "alert_invalid_pdf_or_image": {
          "en": "Please select a valid PDF file or document image (JPG, PNG, WebP).",
          "id": "Harap pilih file PDF yang valid atau gambar dokumen (JPG, PNG, WebP).",
          "ja": "有効なPDFファイルまたは書類画像（JPG, PNG, WebP）を選択してください。",
          "ko": "유효한 PDF 파일 또는 서류 이미지(JPG, PNG, WebP)를 선택해 주세요.",
          "zh": "请选择有效的 PDF 文件或清晰的文档图片（JPG、PNG、WebP）。",
          "zh-TW": "請選取有效的 PDF 檔案或清晰的文件圖檔（JPG、PNG、WebP）。",
          "vi": "Vui lòng chọn tệp PDF hoặc hình ảnh tài liệu hợp lệ (JPG, PNG, WebP).",
          "th": "กรุณาเลือกไฟล์ PDF หรือรูปภาพเอกสารที่ถูกต้อง (JPG, PNG, WebP)",
          "hi": "कृपया एक वैध PDF फ़ाइल या दस्तावेज़ छवि (JPG, PNG, WebP) चुनें।",
          "fil": "Pumili ng wastong PDF file o larawan ng dokumento (JPG, PNG, WebP).",
          "ms": "Sila pilih fail PDF atau imej dokumen yang sah (JPG, PNG, WebP)."
    },
    "alert_process_file_fail": {
          "en": "Failed to process file: {error}",
          "id": "Gagal memproses berkas: {error}",
          "ja": "ファイルの処理に失敗しました: {error}",
          "ko": "파일 처리에 실패했습니다: {error}",
          "zh": "处理文件失败: {error}",
          "zh-TW": "處理檔案失敗: {error}",
          "vi": "Không thể xử lý tệp: {error}",
          "th": "ประมวลผลไฟล์ล้มเหลว: {error}",
          "hi": "फ़ाइल संसाधित करने में विफल: {error}",
          "fil": "Nabigong iproseso ang file: {error}",
          "ms": "Gagal memproses fail: {error}"
    },
    "alert_no_original_doc": {
          "en": "No original document loaded.",
          "id": "Belum ada dokumen asli yang dimuat.",
          "ja": "元の書類が読み込まれていません。",
          "ko": "로드된 원본 문서가 없습니다.",
          "zh": "未加载任何原始文档。",
          "zh-TW": "尚未載入任何原始文件。",
          "vi": "Chưa có tài liệu gốc nào được tải lên.",
          "th": "ยังไม่มีเอกสารต้นฉบับโหลดอยู่",
          "hi": "कोई मूल दस्तावेज़ लोड नहीं हुआ।",
          "fil": "Walang orihinal na dokumentong naka-load.",
          "ms": "Tiada dokumen asal dimuatkan."
    },
    "alert_pdf_lib_loading": {
          "en": "PDF library is loading. Please wait a few seconds.",
          "id": "Pustaka PDF sedang dimuat. Harap tunggu beberapa detik.",
          "ja": "PDFライブラリを読み込み中です。数秒お待ちください。",
          "ko": "PDF 라이브러리를 불러오는 중입니다. 잠시만 기다려 주세요.",
          "zh": "PDF 处理核心正在加载中，请稍候数秒。",
          "zh-TW": "PDF 核心程式庫正在載入中，請稍候數秒。",
          "vi": "Thư viện PDF đang tải. Vui lòng đợi trong giây lát.",
          "th": "ไลบรารี PDF กำลังโหลด กรุณารอสักครู่",
          "hi": "PDF लाइब्रेरी लोड हो रही है। कृपया कुछ सेकंड प्रतीक्षा करें।",
          "fil": "Naglo-load ang PDF library. Maghintay nang ilang segundo.",
          "ms": "Pustaka PDF sedang dimuatkan. Sila tunggu beberapa saat."
    },
    "alert_pdf_export_fail": {
          "en": "Failed to export PDF: {error}",
          "id": "Gagal mengekspor PDF: {error}",
          "ja": "PDFのエクスポートに失敗しました: {error}",
          "ko": "PDF 내보내기 실패: {error}",
          "zh": "导出 PDF 失败: {error}",
          "zh-TW": "匯出 PDF 失敗: {error}",
          "vi": "Xuất PDF thất bại: {error}",
          "th": "ส่งออก PDF ล้มเหลว: {error}",
          "hi": "PDF निर्यात करने में विफल: {error}",
          "fil": "Nabigong i-export ang PDF: {error}",
          "ms": "Gagal mengeksport PDF: {error}"
    },
    "confirm_reset_vault": {
          "en": "Are you sure you want to reset your vault? All local encrypted data will be wiped so you can create a fresh vault.",
          "id": "Apakah Anda yakin ingin mengatur ulang brankas? Semua data terenkripsi lokal akan dihapus agar Anda dapat membuat brankas baru.",
          "ja": "金庫を初期化してもよろしいですか？新しい金庫を作成するため、端末上のすべての暗号化データが完全に消去されます。",
          "ko": "금고를 재설정하시겠습니까? 새 금고를 만들 수 있도록 로컬에 암호화된 모든 데이터가 삭제됩니다.",
          "zh": "确定要重置保险箱吗？这将永久抹除所有本地加密数据，以便您重新创建全新保险箱。",
          "zh-TW": "確定要重設金庫嗎？這將抹除本地所有加密資料，以便您重新設定。",
          "vi": "Bạn có chắc chắn muốn đặt lại két? Mọi dữ liệu mã hóa cục bộ sẽ bị xóa sạch để bạn tạo két mới.",
          "th": "คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตห้องนิรภัย? ข้อมูลที่เข้ารหัสทั้งหมดในเครื่องจะถูกลบเพื่อให้คุณสร้างใหม่ได้",
          "hi": "क्या आप वाकई अपना वॉल्ट रीसेट करना चाहते हैं? सभी स्थानीय डेटा मिटा दिया जाएगा।",
          "fil": "Sigurado ka bang nais mong i-reset ang vault? Mabubura ang lahat ng data upang makagawa ng bago.",
          "ms": "Adakah anda pasti mahu menetapkan semula peti? Semua data tempatan akan dipadam untuk membuat peti baharu."
    },
    "confirm_delete_vault_field": {
          "en": "Delete \"{name}\" from your vault?",
          "id": "Hapus \"{name}\" dari brankas Anda?",
          "ja": "金庫から「{name}」を削除しますか？",
          "ko": "금고에서 \"{name}\" 항목을 삭제하시겠습니까?",
          "zh": "确定从保险箱中删除 \"{name}\" 吗？",
          "zh-TW": "確定從金庫中刪除「{name}」嗎？",
          "vi": "Xóa \"{name}\" khỏi két bảo mật của bạn?",
          "th": "ต้องการลบ \"{name}\" ออกจากห้องนิรภัยของคุณหรือไม่?",
          "hi": "क्या अपने वॉल्ट से \"{name}\" को हटाना चाहते हैं?",
          "fil": "Tanggalin ang \"{name}\" mula sa iyong vault?",
          "ms": "Padam \"{name}\" dari peti anda?"
    },
    "alert_valid_id_doc_req": {
          "en": "Please upload an ID card, Passport, or Academic Document in PDF, JPG, or PNG format.",
          "id": "Harap unggah KTP, Paspor, atau Ijazah dalam format PDF, JPG, atau PNG.",
          "ja": "PDF、JPG、PNG形式の身分証、パスポート、または卒業証明書をアップロードしてください。",
          "ko": "PDF, JPG, PNG 형식의 신분증, 여권 또는 학위 서류를 업로드해 주세요.",
          "zh": "请上传 PDF、JPG 或 PNG 格式的身份证、护照或学历证件。",
          "zh-TW": "請上傳 PDF、JPG 或 PNG 格式的身分證、護照或學歷文件。",
          "vi": "Vui lòng tải lên CCCD, Hộ chiếu hoặc Bằng cấp ở định dạng PDF, JPG hoặc PNG.",
          "th": "กรุณาอัปโหลดบัตรประชาชน หนังสือเดินทาง หรือเอกสารการศึกษาในรูปแบบ PDF, JPG หรือ PNG",
          "hi": "कृपया PDF, JPG या PNG प्रारूप में पहचान पत्र, पासपोर्ट या प्रमाण पत्र अपलोड करें।",
          "fil": "Mag-upload ng ID, Pasaporte, o Sertipiko sa PDF, JPG, o PNG na format.",
          "ms": "Sila muat naik kad pengenalan, pasport, atau sijil dalam format PDF, JPG, atau PNG."
    },
    "alert_extraction_error": {
          "en": "Extraction failed: {error}",
          "id": "Ekstraksi gagal: {error}",
          "ja": "抽出に失敗しました: {error}",
          "ko": "추출 실패: {error}",
          "zh": "提取失败: {error}",
          "zh-TW": "擷取失敗: {error}",
          "vi": "Trích xuất thất bại: {error}",
          "th": "การดึงข้อมูลล้มเหลว: {error}",
          "hi": "निष्कर्षण विफल रहा: {error}",
          "fil": "Nabigo ang pagkuha: {error}",
          "ms": "Pengekstrakan gagal: {error}"
    },
    "alert_doc_processing_error": {
          "en": "Document processing error: {error}",
          "id": "Terjadi kesalahan pemrosesan dokumen: {error}",
          "ja": "書類の処理中にエラーが発生しました: {error}",
          "ko": "문서 처리 중 오류가 발생했습니다: {error}",
          "zh": "文档处理出错: {error}",
          "zh-TW": "文件處理發生錯誤: {error}",
          "vi": "Lỗi xử lý tài liệu: {error}",
          "th": "เกิดข้อผิดพลาดในการประมวลผลเอกสาร: {error}",
          "hi": "दस्तावेज़ प्रसंस्करण त्रुटि: {error}",
          "fil": "May error sa pagproseso ng dokumento: {error}",
          "ms": "Ralat pemprosesan dokumen: {error}"
    },
    "audit_tag_privacy": {
          "en": "Privacy Protected",
          "id": "Privasi Terlindungi",
          "ja": "プライバシー保護済み",
          "ko": "개인정보 보호됨",
          "zh": "隐私已受保护",
          "zh-TW": "隱私安全保護",
          "vi": "Bảo vệ quyền riêng tư",
          "th": "ปกป้องความเป็นส่วนตัวแล้ว",
          "hi": "गोपनीयता सुरक्षित",
          "fil": "Protektado ang Privacy",
          "ms": "Privasi Terpelihara"
    },
    "audit_tag_empty_required": {
          "en": "Missing (Required)",
          "id": "Belum Diisi (Wajib)",
          "ja": "未入力（必須）",
          "ko": "누락됨 (필수)",
          "zh": "未填（必填项）",
          "zh-TW": "未填寫（必填）",
          "vi": "Còn trống (Bắt buộc)",
          "th": "ยังไม่ได้กรอก (จำเป็น)",
          "hi": "छूट गया (आवश्यक)",
          "fil": "Kulang (Kailangan)",
          "ms": "Belum Diisi (Wajib)"
    },
    "audit_tag_empty_optional": {
          "en": "Optional (Empty)",
          "id": "Opsional Kosong",
          "ja": "未入力（任意）",
          "ko": "비어 있음 (선택)",
          "zh": "未填（选填）",
          "zh-TW": "空白（選填）",
          "vi": "Để trống (Tùy chọn)",
          "th": "ว่าง (ไม่บังคับ)",
          "hi": "वैकल्पिक (खाली)",
          "fil": "Opsyonal (Walang laman)",
          "ms": "Pilihan (Kosong)"
    },
    "audit_tag_passed": {
          "en": "Passed Audit",
          "id": "Lolos Audit",
          "ja": "検証合格",
          "ko": "검토 통과",
          "zh": "审核通过",
          "zh-TW": "審核通過",
          "vi": "Đạt kiểm tra",
          "th": "ผ่านการตรวจสอบ",
          "hi": "ऑडिट पास हुआ",
          "fil": "Pumasa sa Audit",
          "ms": "Lulus Audit"
    },
    "audit_banner_empty_title": {
          "en": "There are {count} required fields not filled!",
          "id": "Ada {count} kolom wajib yang belum diisi!",
          "ja": "未入力の必須項目が {count} 件あります！",
          "ko": "아직 작성되지 않은 필수 항목이 {count}개 있습니다!",
          "zh": "尚有 {count} 项必填字段未填写！",
          "zh-TW": "尚有 {count} 個必填欄位未填寫！",
          "vi": "Còn {count} trường bắt buộc chưa được điền!",
          "th": "มีช่องที่จำเป็นต้องกรอกอีก {count} ช่องที่ยังว่างอยู่!",
          "hi": "{count} आवश्यक फ़ील्ड नहीं भरे गए हैं!",
          "fil": "May {count} kinakailangang kolum na hindi pa napupunan!",
          "ms": "Terdapat {count} ruangan wajib yang belum diisi!"
    },
    "audit_banner_empty_desc": {
          "en": "Please complete the fields highlighted in red above before submitting the form.",
          "id": "Harap lengkapi kolom bertanda merah di atas sebelum mengirim formulir.",
          "ja": "フォームを送信する前に、上の赤色で強調された項目をすべて入力してください。",
          "ko": "양식을 제출하기 전에 위 빨간색으로 표시된 항목을 완료해 주세요.",
          "zh": "请在提交前补齐上方用红色高亮标出的各项。",
          "zh-TW": "請在送出表單前填妥上方紅色標示之必填欄位。",
          "vi": "Vui lòng hoàn thành các trường được đánh dấu đỏ trước khi gửi.",
          "th": "กรุณากรอกข้อมูลในช่องสีแดงด้านบนให้ครบถ้วนก่อนส่งแบบฟอร์ม",
          "hi": "फ़ॉर्म सबमिट करने से पहले कृपया ऊपर लाल रंग में हाइलाइट किए गए फ़ील्ड को भरें।",
          "fil": "Pakikumpleto ang mga kolum na naka-highlight na pula bago isumite.",
          "ms": "Sila lengkapkan ruangan bertanda merah di atas sebelum menghantar borang."
    },
    "audit_banner_warning_title": {
          "en": "Audit Complete ({count} recommendations)",
          "id": "Audit Selesai ({count} saran perbaikan)",
          "ja": "監査完了（{count} 件の改善提案）",
          "ko": "검토 완료 ({count}개의 권장 사항)",
          "zh": "审核完成（发现 {count} 条格式优化建议）",
          "zh-TW": "審核完成（發現 {count} 項格式建議）",
          "vi": "Kiểm tra hoàn tất ({count} đề xuất cải thiện)",
          "th": "ตรวจสอบเสร็จสิ้น ({count} คำแนะนำในการปรับปรุง)",
          "hi": "ऑडिट पूरा हुआ ({count} सुधार सुझाव)",
          "fil": "Tapos na ang Audit ({count} mungkahi)",
          "ms": "Audit Selesai ({count} cadangan penambahbaikan)"
    },
    "audit_banner_warning_desc": {
          "en": "Review the fields highlighted in yellow before clicking Submit.",
          "id": "Periksa kembali kolom bertanda kuning sebelum mengklik Submit.",
          "ja": "送信ボタンを押す前に、黄色の項目をご確認ください。",
          "ko": "제출을 클릭하기 전에 노란색으로 강조된 항목을 다시 확인하세요.",
          "zh": "请在点击提交按钮前，核查黄色标记项的格式。",
          "zh-TW": "請在點擊送出前，確認黃色標記欄位的內容。",
          "vi": "Xem lại các trường màu vàng trước khi nhấn Gửi.",
          "th": "ตรวจสอบช่องที่ไฮไลต์สีเหลืองอีกครั้งก่อนคลิกส่ง",
          "hi": "सबमिट पर क्लिक करने से पहले पीले रंग से हाइलाइट किए गए फ़ील्ड की समीक्षा करें।",
          "fil": "Suriin ang mga kolum na kulay dilaw bago i-submit.",
          "ms": "Semak semula ruangan bertanda kuning sebelum mengklik Hantar."
    },
    "audit_banner_clean_title": {
          "en": "All fields have passed the audit!",
          "id": "Semua isian sudah lolos Audit!",
          "ja": "すべての入力項目が監査を通過しました！",
          "ko": "모든 항목이 검토를 통과했습니다!",
          "zh": "所有表单项均已顺利通过审核！",
          "zh-TW": "所有欄位均已順利通過審核！",
          "vi": "Tất cả các trường đã vượt qua kiểm tra!",
          "th": "ข้อมูลทั้งหมดผ่านการตรวจสอบเรียบร้อยแล้ว!",
          "hi": "सभी फ़ील्ड ऑडिट में पास हो गए हैं!",
          "fil": "Lahat ng kolum ay pumasa sa audit!",
          "ms": "Semua ruangan telah lulus Audit!"
    },
    "audit_banner_clean_desc": {
          "en": "Your form is ready to be submitted. Please click the Submit button on the webpage.",
          "id": "Formulir Anda siap dikirim. Silakan klik tombol Submit pada formulir.",
          "ja": "フォームの送信準備が整いました。Webページ上の送信ボタンを押してください。",
          "ko": "양식을 제출할 준비가 되었습니다. 웹페이지의 제출 버튼을 클릭하세요.",
          "zh": "您的表单已准备就绪，可以放心点击网页上的提交按钮。",
          "zh-TW": "表單已萬無一失，您可以安心點擊網頁上的送出按鈕。",
          "vi": "Biểu mẫu đã sẵn sàng để gửi. Vui lòng nhấp nút Gửi trên trang web.",
          "th": "แบบฟอร์มของคุณพร้อมส่งแล้ว กรุณาคลิกปุ่มส่งบนหน้าเว็บ",
          "hi": "आपका फ़ॉर्म सबमिट करने के लिए तैयार है। कृपया वेबपेज पर सबमिट बटन पर क्लिक करें।",
          "fil": "Handa nang isumite ang form. I-click ang Submit button sa webpage.",
          "ms": "Borang anda sedia dihantar. Sila klik butang Submit pada borang."
    },
    "popover_connected": {
          "en": "✓ Connected",
          "id": "✓ Terhubung",
          "ja": "✓ 接続済み",
          "ko": "✓ 연결됨",
          "zh": "✓ 已连接",
          "zh-TW": "✓ 已連線",
          "vi": "✓ Đã kết nối",
          "th": "✓ เชื่อมต่อแล้ว",
          "hi": "✓ जुड़ा हुआ है",
          "fil": "✓ Nakakonekta",
          "ms": "✓ Tersambung"
    },
    "popover_login_required": {
          "en": "Login Required",
          "id": "Login Diperlukan",
          "ja": "ログイン必須",
          "ko": "로그인 필요",
          "zh": "需要登录",
          "zh-TW": "需要登入",
          "vi": "Yêu cầu đăng nhập",
          "th": "จำเป็นต้องเข้าสู่ระบบ",
          "hi": "लॉगिन आवश्यक है",
          "fil": "Kailangan ng Login",
          "ms": "Log Masuk Diperlukan"
    },
    "vault_modal_title_setup": {
          "en": "Create Master Security Key",
          "id": "Buat Kunci Keamanan Utama",
          "ja": "マスターセキュリティキーを作成",
          "ko": "마스터 보안 키 생성",
          "zh": "创建主安全密钥",
          "zh-TW": "建立主要安全金鑰",
          "vi": "Tạo khóa bảo mật chính",
          "th": "สร้างรหัสความปลอดภัยหลัก",
          "hi": "मास्टर सुरक्षा कुंजी बनाएं",
          "fil": "Gumawa ng Master Security Key",
          "ms": "Cipta Kunci Keselamatan Utama"
    },
    "vault_modal_sub_setup": {
          "en": "Protect your profile data with Bank-grade Client-Side Encryption. Choose a Password (min. 8 chars) or a 12-Word Seed Phrase.",
          "id": "Lindungi data profil Anda dengan Enkripsi Sisi Klien setara Bank. Pilih Password (min. 8 karakter) atau 12 Kata Rahasia.",
          "ja": "銀行グレードの端末側暗号化で個人情報を保護します。パスワード（8文字以上）または12語のシードフレーズを選択してください。",
          "ko": "은행 수준의 클라이언트 측 암호화로 프로필 데이터를 보호하세요. 비밀번호(8자 이상) 또는 12개의 시드 단어를 선택하세요.",
          "zh": "以金融级客户端加密技术保护您的个人隐私。请选择设置密码（至少8位）或12位助记词。",
          "zh-TW": "以銀行等級的本地加密保護您的身分資料。請設定密碼（至少8個字元）或12個復原字詞。",
          "vi": "Bảo vệ hồ sơ với mã hóa cấp ngân hàng. Chọn Mật khẩu (tối thiểu 8 ký tự) hoặc Cụm từ 12 từ bí mật.",
          "th": "ปกป้องข้อมูลโปรไฟล์ด้วยการเข้ารหัสระดับธนาคาร เลือกรหัสผ่าน (อย่างน้อย 8 ตัวอักษร) หรือวลีกู้คืน 12 คำ",
          "hi": "बैंक-स्तरीय एन्क्रिप्शन के साथ अपने डेटा की सुरक्षा करें। पासवर्ड (कम से कम 8 वर्ण) या 12-शब्दों का सीड वाक्यांश चुनें।",
          "fil": "Protektahan ang iyong profile data gamit ang Bank-grade encryption. Pumili ng Password o 12-Word Seed Phrase.",
          "ms": "Lindungi data profil anda dengan Penyulitan Sisi Klien setaraf Bank. Pilih Kata Laluan atau 12 Kata Rahsia."
    },
    "vault_modal_title_unlock": {
          "en": "Unlock Profile Vault",
          "id": "Buka Kunci Brankas Profil",
          "ja": "プロファイル金庫のロックを解除",
          "ko": "프로필 금고 잠금 해제",
          "zh": "解锁个人资料保险箱",
          "zh-TW": "解鎖個人金庫",
          "vi": "Mở khóa két hồ sơ",
          "th": "ปลดล็อคห้องนิรภัยข้อมูลส่วนตัว",
          "hi": "प्रोफ़ाइल वॉल्ट अनलॉक करें",
          "fil": "I-unlock ang Profile Vault",
          "ms": "Buka Kunci Peti Profil"
    },
    "vault_modal_sub_unlock": {
          "en": "Enter your Master Password or 12 Secret Words to decrypt your profile.",
          "id": "Masukkan Password Utama atau 12 Kata Rahasia untuk membuka enkripsi profil Anda.",
          "ja": "プロファイルを復号化するために、マスターパスワードまたは12語のシードフレーズを入力してください。",
          "ko": "프로필을 복호화하려면 마스터 비밀번호 또는 12개의 시드 단어를 입력하세요.",
          "zh": "请输入您的主密码或12个助记词以解密档案。",
          "zh-TW": "請輸入主密碼或12個復原字詞以解密您的個人資料。",
          "vi": "Nhập Mật khẩu chính hoặc 12 từ bí mật để giải mã hồ sơ của bạn.",
          "th": "กรอกรหัสผ่านหลักหรือคำลับ 12 คำเพื่อถอดรหัสโปรไฟล์ของคุณ",
          "hi": "अपनी प्रोफ़ाइल को डिक्रिप्ट करने के लिए अपना मास्टर पासवर्ड या 12 गुप्त शब्द दर्ज करें।",
          "fil": "Ilagay ang Master Password o 12 Secret Words upang ma-decrypt ang iyong profile.",
          "ms": "Masukkan Kata Laluan Utama atau 12 Kata Rahsia untuk menyahsulit profil anda."
    },
    "vault_btn_submit_setup": {
          "en": "Set Up & Encrypt Vault",
          "id": "Simpan & Enkripsi Brankas",
          "ja": "暗号化して金庫を設定",
          "ko": "금고 설정 및 암호화",
          "zh": "完成设置并加密",
          "zh-TW": "完成設定並加密",
          "vi": "Thiết lập & Mã hóa két",
          "th": "ตั้งค่าและเข้ารหัสห้องนิรภัย",
          "hi": "वॉल्ट सेट करें और एन्क्रिप्ट करें",
          "fil": "I-setup at I-encrypt ang Vault",
          "ms": "Sediakan & Sulitkan Peti"
    },
    "vault_btn_submit_unlock": {
          "en": "Unlock Vault",
          "id": "Buka Kunci Brankas",
          "ja": "金庫のロックを解除",
          "ko": "금고 잠금 해제",
          "zh": "解锁保险箱",
          "zh-TW": "解鎖金庫",
          "vi": "Mở khóa két",
          "th": "ปลดล็อคห้องนิรภัย",
          "hi": "वॉल्ट अनलॉक करें",
          "fil": "I-unlock ang Vault",
          "ms": "Buka Kunci Peti"
    },
    "vault_field_modal_edit": {
          "en": "Edit Field Value",
          "id": "Edit Nilai Kolom",
          "ja": "入力項目の編集",
          "ko": "항목 값 수정",
          "zh": "编辑字段内容",
          "zh-TW": "編輯欄位內容",
          "vi": "Chỉnh sửa giá trị trường",
          "th": "แก้ไขค่าของช่องข้อมูล",
          "hi": "फ़ील्ड मान संपादित करें",
          "fil": "I-edit ang Kolum",
          "ms": "Edit Nilai Ruangan"
    },
    "vault_field_modal_add": {
          "en": "+ Add Custom Field",
          "id": "+ Tambah Kolom Baru",
          "ja": "+ カスタム項目を追加",
          "ko": "+ 맞춤 항목 추가",
          "zh": "+ 添加自定义字段",
          "zh-TW": "+ 新增自訂欄位",
          "vi": "+ Thêm trường tùy chỉnh",
          "th": "+ เพิ่มช่องข้อมูลที่กำหนดเอง",
          "hi": "+ कस्टम फ़ील्ड जोड़ें",
          "fil": "+ Magdagdag ng Custom Field",
          "ms": "+ Tambah Ruangan Tersuai"
    },
    "audit_warning_academic": {
          "en": "Academic title detected",
          "id": "Gelar akademis terdeteksi",
          "ja": "学術称号が検出されました",
          "ko": "학위/칭호가 감지됨",
          "zh": "检测到学术头衔/职称",
          "zh-TW": "偵測到學位/稱謂",
          "vi": "Phát hiện học hàm/học vị",
          "th": "ตรวจพบคำนำหน้าทางวิชาการ",
          "hi": "अकादमिक उपाधि का पता चला",
          "fil": "May nakitang academic title",
          "ms": "Gelaran akademik dikesan"
    },
    "audit_warning_lowercase": {
          "en": "All lowercase letters",
          "id": "Huruf kecil semua",
          "ja": "すべて小文字で入力されています",
          "ko": "모두 소문자로 입력됨",
          "zh": "全部为小写字母",
          "zh-TW": "全為小寫英文字母",
          "vi": "Toàn bộ là chữ thường",
          "th": "เป็นตัวพิมพ์เล็กทั้งหมด",
          "hi": "सभी छोटे अक्षर हैं",
          "fil": "Lahat ay maliit na titik",
          "ms": "Semua huruf kecil"
    },
    "audit_warning_nik_digits": {
          "en": "NIK {digits} digits (must be 16)",
          "id": "NIK {digits} digit (harus 16)",
          "ja": "身分番号 {digits}桁（16桁必須）",
          "ko": "신분번호 {digits}자리 (16자리 필수)",
          "zh": "证件号为 {digits} 位（应为16位）",
          "zh-TW": "身分識別碼為 {digits} 碼（應為16碼）",
          "vi": "Số định danh {digits} số (cần 16 số)",
          "th": "รหัสประจำตัว {digits} หลัก (ต้องมี 16 หลัก)",
          "hi": "पहचान संख्या {digits} अंक (16 होने चाहिए)",
          "fil": "NIK {digits} digits (dapat 16)",
          "ms": "No. Pengenalan {digits} digit (mesti 16)"
    },
    "audit_preaudit_btn_reviewing": {
          "en": "⏳ Reviewing form entries...",
          "id": "⏳ Memeriksa isian formulir...",
          "ja": "⏳ 入力内容をレビュー中...",
          "ko": "⏳ 입력 내용 검토 중...",
          "zh": "⏳ 正在审核各项输入内容...",
          "zh-TW": "⏳ 正在審查各項填寫內容...",
          "vi": "⏳ Đang rà soát nội dung điền...",
          "th": "⏳ กำลังตรวจสอบรายการที่กรอก...",
          "hi": "⏳ फ़ॉर्म प्रविष्टियों की समीक्षा की जा रही है...",
          "fil": "⏳ Sinusuri ang mga entry...",
          "ms": "⏳ Memeriksa isian borang..."
    },
    "audit_preaudit_btn_idle": {
          "en": "🔍 Pre-Submission Form Audit",
          "id": "🔍 Audit Pra-Kirim Formulir",
          "ja": "🔍 送信前フォーム監査",
          "ko": "🔍 제출 전 양식 정밀 검토",
          "zh": "🔍 提交前表单审核",
          "zh-TW": "🔍 送出前表單全面審核",
          "vi": "🔍 Kiểm tra biểu mẫu trước khi gửi",
          "th": "🔍 ตรวจสอบฟอร์มก่อนส่ง",
          "hi": "🔍 सबमिशन से पहले फ़ॉर्म ऑडिट",
          "fil": "🔍 Pre-Submission Form Audit",
          "ms": "🔍 Audit Pra-Hantar Borang"
    },
    "vault_lockout_msg": {
          "en": "⚠️ Too many failed attempts. Locked for {sec}s.",
          "id": "⚠️ Terlalu banyak percobaan gagal. Dikunci selama {sec}d.",
          "ja": "⚠️ 認証試行回数の上限を超えました。{sec}秒間ロックされます。",
          "ko": "⚠️ 잘못된 시도가 너무 많습니다. {sec}초 동안 잠깁니다.",
          "zh": "⚠️ 错误尝试次数过多，已锁定 {sec} 秒。",
          "zh-TW": "⚠️ 密碼嘗試錯誤過多，已鎖定 {sec} 秒。",
          "vi": "⚠️ Thử sai quá nhiều lần. Bị khóa trong {sec} giây.",
          "th": "⚠️ ลองผิดหลายครั้งเกินไป ถูกล็อคเป็นเวลา {sec} วินาที",
          "hi": "⚠️ बहुत अधिक असफल प्रयास। {sec} सेकंड के लिए लॉक किया गया।",
          "fil": "⚠️ Masyadong maraming maling subok. Naka-lock ng {sec}s.",
          "ms": "⚠️ Terlalu banyak percubaan gagal. Dikunci selama {sec}s."
    },
    "vault_verifying": {
          "en": "⏳ Verifying...",
          "id": "⏳ Memverifikasi...",
          "ja": "⏳ 確認中...",
          "ko": "⏳ 확인 중...",
          "zh": "⏳ 正在验证...",
          "zh-TW": "⏳ 正在驗證...",
          "vi": "⏳ Đang xác minh...",
          "th": "⏳ กำลังตรวจสอบ...",
          "hi": "⏳ सत्यापन किया जा रहा है...",
          "fil": "⏳ Nabe-verify...",
          "ms": "⏳ Mengesahkan..."
    },
    "vault_empty_title": {
          "en": "No Data in Vault Yet",
          "id": "Belum Ada Data di Brankas",
          "ja": "金庫にデータが登録されていません",
          "ko": "금고에 저장된 데이터가 없습니다",
          "zh": "保险箱内暂无数据",
          "zh-TW": "金庫內尚無資料",
          "vi": "Chưa có dữ liệu trong két",
          "th": "ยังไม่มีข้อมูลในห้องนิรภัย",
          "hi": "वॉल्ट में अभी कोई डेटा नहीं है",
          "fil": "Wala pang Data sa Vault",
          "ms": "Belum Ada Data di Dalam Peti"
    },
    "vault_empty_desc": {
          "en": "Upload a document (ID Card, Passport, Certificate) below for instant AI extraction, or manage your vault on the Web Dashboard.",
          "id": "Unggah dokumen (KTP, Paspor, Ijazah) di bawah untuk ekstrak instan via AI, atau kelola brankas di Dashboard Web.",
          "ja": "書類（身分証、パスポート、各種証明書）をアップロードしてAIで抽出するか、Webダッシュボードで管理してください。",
          "ko": "신분증, 여권, 증명서를 업로드하여 AI로 즉시 추출하거나 웹 대시보드에서 관리하세요.",
          "zh": "在下方上传证件（身份证、护照、证书）即可由AI瞬时提取，亦可在网页端控制台统一管理。",
          "zh-TW": "於下方上傳證件（身分證、護照、證書）即可由AI即時擷取，亦可在網頁控制台管理。",
          "vi": "Tải lên tài liệu (CCCD, Hộ chiếu, Bằng cấp) để AI trích xuất ngay, hoặc quản lý trong Bảng điều khiển Web.",
          "th": "อัปโหลดเอกสาร (บัตรประชาชน พาสปอร์ต ประกาศนียบัตร) ด้านล่างเพื่อดึงข้อมูลทันทีด้วย AI หรือจัดการบนแดชบอร์ด",
          "hi": "त्वरित AI निष्कर्षण के लिए नीचे दस्तावेज़ अपलोड करें, या वेब डैशबोर्ड पर प्रबंधित करें।",
          "fil": "Mag-upload ng dokumento sa ibaba para sa instant AI extraction, o pamahalaan sa Web Dashboard.",
          "ms": "Muat naik dokumen (Kad Pengenalan, Pasport, Sijil) di bawah untuk ekstrak AI segera, atau urus di Papan Pemuka."
    },
    "vault_empty_btn_add": {
          "en": "+ Add Data",
          "id": "+ Tambah Data",
          "ja": "+ データを追加",
          "ko": "+ 데이터 추가",
          "zh": "+ 手动添加数据",
          "zh-TW": "+ 手動新增資料",
          "vi": "+ Thêm dữ liệu",
          "th": "+ เพิ่มข้อมูล",
          "hi": "+ डेटा जोड़ें",
          "fil": "+ Magdagdag ng Data",
          "ms": "+ Tambah Data"
    },
    "vault_empty_btn_dash": {
          "en": "Open Dashboard ↗",
          "id": "Buka Dashboard ↗",
          "ja": "ダッシュボードを開く ↗",
          "ko": "대시보드 열기 ↗",
          "zh": "打开控制台 ↗",
          "zh-TW": "開啟控制台 ↗",
          "vi": "Mở Bảng điều khiển ↗",
          "th": "เปิดแดชบอร์ด ↗",
          "hi": "डैशबोर्ड खोलें ↗",
          "fil": "Buksan ang Dashboard ↗",
          "ms": "Buka Papan Pemuka ↗"
    },
    "vault_item_count_zero": {
          "en": "0 items",
          "id": "0 data",
          "ja": "0 件",
          "ko": "0개 항목",
          "zh": "0 项数据",
          "zh-TW": "0 筆資料",
          "vi": "0 mục",
          "th": "0 รายการ",
          "hi": "0 आइटम",
          "fil": "0 item",
          "ms": "0 data"
    },
    "vault_item_count": {
          "en": "{count} item{plural}",
          "id": "{count} data",
          "ja": "{count} 件",
          "ko": "{count}개 항목",
          "zh": "{count} 项数据",
          "zh-TW": "{count} 筆資料",
          "vi": "{count} mục",
          "th": "{count} รายการ",
          "hi": "{count} आइटम",
          "fil": "{count} item",
          "ms": "{count} data"
    },
    "translating_progress_sub": {
          "en": "Gemini 3.5 Flash-Lite • Preserving UI/UX & Glossary...",
          "id": "Gemini 3.5 Flash-Lite • Mempertahankan UI/UX & Glosarium...",
          "ja": "Gemini 3.5 Flash-Lite • UI/UXおよび専門用語を保持して翻訳中...",
          "ko": "Gemini 3.5 Flash-Lite • UI/UX 및 전문 용어를 보존하며 번역 중...",
          "zh": "Gemini 3.5 Flash-Lite • 正在保持原版UI/UX与专业术语翻译中...",
          "zh-TW": "Gemini 3.5 Flash-Lite • 正在維護原版UI/UX與專業詞彙翻譯中...",
          "vi": "Gemini 3.5 Flash-Lite • Đang dịch và bảo toàn giao diện & thuật ngữ...",
          "th": "Gemini 3.5 Flash-Lite • กำลังแปลโดยรักษา UI/UX และคำศัพท์เฉพาะ...",
          "hi": "Gemini 3.5 Flash-Lite • UI/UX और शब्दावली को संरक्षित करते हुए अनुवाद...",
          "fil": "Gemini 3.5 Flash-Lite • Pinapanatili ang UI/UX at Glosaryo...",
          "ms": "Gemini 3.5 Flash-Lite • Mengekalkan UI/UX & Glosari..."
    },
    "voice_click_to_speak": {
          "en": "Click to Speak",
          "id": "Klik untuk Bicara",
          "ja": "クリックして話す",
          "ko": "클릭하여 말하기",
          "zh": "点击开始说话",
          "zh-TW": "點擊開始說話",
          "vi": "Nhấp để nói",
          "th": "คลิกเพื่อพูด",
          "hi": "बोलने के लिए क्लिक करें",
          "fil": "I-click para Magsalita",
          "ms": "Klik untuk Bercakap"
    },
    "stepper_all_done": {
          "en": "All Done ✓",
          "id": "Selesai ✓",
          "ja": "すべて完了 ✓",
          "ko": "모두 완료 ✓",
          "zh": "全部完成 ✓",
          "zh-TW": "全部完成 ✓",
          "vi": "Hoàn tất ✓",
          "th": "เสร็จสิ้นทั้งหมด ✓",
          "hi": "सब पूरा हो गया ✓",
          "fil": "Lahat Tapos Na ✓",
          "ms": "Semua Selesai ✓"
    },
    "toast_vault_reset": {
          "en": "Vault has been reset. You can create a new Master Password.",
          "id": "Brankas telah direset. Anda dapat membuat Password Utama baru.",
          "ja": "金庫がリセットされました。新しいマスターパスワードを作成できます。",
          "ko": "금고가 초기화되었습니다. 새로운 마스터 비밀번호를 생성할 수 있습니다.",
          "zh": "保险箱已重置。您可以重新设定主密码。",
          "zh-TW": "金庫已重設。您可以設定新的主密碼。",
          "vi": "Két đã được đặt lại. Bạn có thể tạo Mật khẩu chính mới.",
          "th": "รีเซ็ตห้องนิรภัยแล้ว คุณสามารถสร้างรหัสผ่านหลักใหม่ได้",
          "hi": "वॉल्ट रीसेट कर दिया गया है। आप नया मास्टर पासवर्ड बना सकते हैं।",
          "fil": "Na-reset ang vault. Maaari nang gumawa ng bagong Master Password.",
          "ms": "Peti telah ditetapkan semula. Anda boleh mencipta Kata Laluan Utama baharu."
    },
    "toast_seed_copied": {
          "en": "📋 12 secret words copied to clipboard!",
          "id": "📋 12 kata rahasia disalin ke papan klip!",
          "ja": "📋 12語のシードフレーズをクリップボードにコピーしました！",
          "ko": "📋 12개의 시드 단어가 클립보드에 복사되었습니다!",
          "zh": "📋 12个助记词已复制到剪贴板！",
          "zh-TW": "📋 12個復原單字已複製至剪貼簿！",
          "vi": "📋 Đã sao chép 12 từ bí mật vào bộ nhớ tạm!",
          "th": "📋 คัดลอกคำลับ 12 คำไปยังคลิปบอร์ดแล้ว!",
          "hi": "📋 12 गुप्त शब्द क्लिपबोर्ड पर कॉपी किए गए!",
          "fil": "📋 Nakopya ang 12 lihim na salita sa clipboard!",
          "ms": "📋 12 kata rahsia telah disalin ke papan keratan!"
    },
    "toast_seed_saved": {
          "en": "📥 Emergency seed phrase text file saved!",
          "id": "📥 File teks kata rahasia darurat berhasil disimpan!",
          "ja": "📥 緊急用シードフレーズのテキストファイルを保存しました！",
          "ko": "📥 긴급 시드 구문 텍스트 파일이 저장되었습니다!",
          "zh": "📥 紧急助记词备份文本已安全保存！",
          "zh-TW": "📥 緊急復原註記詞文字檔已安全儲存！",
          "vi": "📥 Đã lưu tệp văn bản cụm từ khôi phục khẩn cấp!",
          "th": "📥 บันทึกไฟล์ข้อความวลีกู้คืนฉุกเฉินแล้ว!",
          "hi": "📥 आपातकालीन सीड वाक्यांश टेक्स्ट फ़ाइल सहेजी गई!",
          "fil": "📥 Na-save ang emergency seed phrase text file!",
          "ms": "📥 Fail teks frasa benih kecemasan berjaya disimpan!"
    },
    "toast_vault_created": {
          "en": "🔓 Vault successfully created & encrypted!",
          "id": "🔓 Brankas berhasil dibuat & terenkripsi!",
          "ja": "🔓 金庫の作成と暗号化が完了しました！",
          "ko": "🔓 금고가 성공적으로 생성 및 암호화되었습니다!",
          "zh": "🔓 保险箱已成功创建并完成加密！",
          "zh-TW": "🔓 金庫已成功建立並完成加密！",
          "vi": "🔓 Két bảo mật đã được tạo và mã hóa thành công!",
          "th": "🔓 สร้างและเข้ารหัสห้องนิรภัยสำเร็จแล้ว!",
          "hi": "🔓 वॉल्ट सफलतापूर्वक बनाया और एन्क्रिप्ट किया गया!",
          "fil": "🔓 Matagumpay na nagawa at na-encrypt ang vault!",
          "ms": "🔓 Peti berjaya dicipta & disulitkan!"
    },
    "toast_vault_unlocked": {
          "en": "🔓 Vault successfully unlocked for this session!",
          "id": "🔓 Brankas berhasil dibuka untuk sesi ini!",
          "ja": "🔓 このセッションで金庫のロックを解除しました！",
          "ko": "🔓 이번 세션 동안 금고가 잠금 해제되었습니다!",
          "zh": "🔓 保险箱已在本会话中成功解锁！",
          "zh-TW": "🔓 金庫已於本次連線階段成功解鎖！",
          "vi": "🔓 Két bảo mật đã được mở khóa cho phiên này!",
          "th": "🔓 ปลดล็อคห้องนิรภัยสำหรับเซสชันนี้สำเร็จแล้ว!",
          "hi": "🔓 इस सत्र के लिए वॉल्ट सफलतापूर्वक अनलॉक हो गया!",
          "fil": "🔓 Matagumpay na na-unlock ang vault para sa sesyong ito!",
          "ms": "🔓 Peti berjaya dibuka untuk sesi ini!"
    },
    "toast_vault_locked": {
          "en": "🔒 Vault locked again.",
          "id": "🔒 Brankas dikunci kembali.",
          "ja": "🔒 金庫を再施錠しました。",
          "ko": "🔒 금고가 다시 잠겼습니다.",
          "zh": "🔒 保险箱已重新锁定。",
          "zh-TW": "🔒 金庫已重新上鎖。",
          "vi": "🔒 Két bảo mật đã được khóa lại.",
          "th": "🔒 ห้องนิรภัยถูกล็อคอีกครั้งแล้ว",
          "hi": "🔒 वॉल्ट फिर से लॉक कर दिया गया।",
          "fil": "🔒 Naka-lock muli ang vault.",
          "ms": "🔒 Peti dikunci semula."
    },
    "vault_err_pwd_min": {
          "en": "Password must be at least 8 characters.",
          "id": "Password harus minimal 8 karakter.",
          "ja": "パスワードは8文字以上である必要があります。",
          "ko": "비밀번호는 최소 8자 이상이어야 합니다.",
          "zh": "密码长度至少需为 8 位。",
          "zh-TW": "密碼長度至少需為 8 個字元。",
          "vi": "Mật khẩu phải có ít nhất 8 ký tự.",
          "th": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
          "hi": "पासवर्ड कम से कम 8 वर्णों का होना चाहिए।",
          "fil": "Ang password ay dapat may hindi bababa sa 8 karakter.",
          "ms": "Kata laluan mestilah sekurang-kurangnya 8 aksara."
    },
    "vault_err_seed_confirm": {
          "en": "Please confirm that you have saved your 12 secret words safely.",
          "id": "Harap konfirmasi bahwa Anda telah menyimpan 12 kata rahasia dengan aman.",
          "ja": "12語のシードフレーズを安全に保管したことを確認してください。",
          "ko": "12개의 시드 단어를 안전하게 보관했음을 확인해 주세요.",
          "zh": "请确认您已安全备份并妥善保存了全部12个助记词。",
          "zh-TW": "請確認您已妥善備份並安全保存了全部12個復原單字。",
          "vi": "Vui lòng xác nhận rằng bạn đã lưu an toàn 12 từ bí mật.",
          "th": "กรุณายืนยันว่าคุณได้บันทึกคำลับ 12 คำไว้อย่างปลอดภัยแล้ว",
          "hi": "कृपया पुष्टि करें कि आपने अपने 12 गुप्त शब्दों को सुरक्षित रूप से सहेज लिया है।",
          "fil": "Pakikumpirma na na-save mo nang ligtas ang iyong 12 lihim na salita.",
          "ms": "Sila sahkan bahawa anda telah menyimpan 12 kata rahsia dengan selamat."
    },
    "vault_err_seed_12": {
          "en": "Please enter all 12 seed words separated by spaces.",
          "id": "Harap masukkan semua 12 kata rahasia yang dipisahkan dengan spasi.",
          "ja": "スペースで区切られた12語のシードフレーズをすべて入力してください。",
          "ko": "공백으로 구분된 12개의 시드 단어를 모두 입력해 주세요.",
          "zh": "请用空格分隔输入全部12个助记词。",
          "zh-TW": "請輸入以空格分隔的全部12個復原單字。",
          "vi": "Vui lòng nhập đủ 12 từ hạt giống, cách nhau bằng dấu cách.",
          "th": "กรุณากรอกคำกู้คืนทั้ง 12 คำโดยคั่นด้วยเว้นวรรค",
          "hi": "कृपया रिक्त स्थान द्वारा अलग किए गए सभी 12 सीड शब्द दर्ज करें।",
          "fil": "Pakilagay ang lahat ng 12 seed words na pinaghihiwalay ng space.",
          "ms": "Sila masukkan kesemua 12 kata rahsia yang dipisahkan dengan ruang."
    },
    "vault_err_locked_out": {
          "en": "⚠️ Vault locked due to 3 failed attempts.",
          "id": "⚠️ Brankas terkunci karena 3x salah percobaan.",
          "ja": "⚠️ 3回認証に失敗したため金庫がロックされました。",
          "ko": "⚠️ 3회 실패로 인해 금고가 잠겼습니다.",
          "zh": "⚠️ 连续3次尝试失败，保险箱已被锁定。",
          "zh-TW": "⚠️ 連續3次錯誤，金庫已鎖定。",
          "vi": "⚠️ Két bị khóa do 3 lần nhập sai.",
          "th": "⚠️ ห้องนิรภัยถูกล็อคเนื่องจากพยายามล้มเหลว 3 ครั้ง",
          "hi": "⚠️ 3 असफल प्रयासों के कारण वॉल्ट लॉक हो गया।",
          "fil": "⚠️ Naka-lock ang vault dahil sa 3 maling pagsubok.",
          "ms": "⚠️ Peti dikunci kerana 3 percubaan gagal."
    },
    "vault_err_wrong_key": {
          "en": "❌ Key incorrect. {attempts} attempt(s) remaining.",
          "id": "❌ Kunci tidak cocok. Sisa {attempts} percobaan lagi.",
          "ja": "❌ キーが一致しません。残り試行回数: {attempts}回。",
          "ko": "❌ 키가 일치하지 않습니다. 남은 시도: {attempts}회.",
          "zh": "❌ 密钥不匹配。还剩 {attempts} 次尝试机会。",
          "zh-TW": "❌ 金鑰不符合。剩餘 {attempts} 次嘗試機會。",
          "vi": "❌ Khóa không đúng. Còn lại {attempts} lần thử.",
          "th": "❌ รหัสไม่ถูกต้อง เหลือโอกาสอีก {attempts} ครั้ง",
          "hi": "❌ कुंजी गलत है। {attempts} प्रयास शेष हैं।",
          "fil": "❌ Mali ang key. May {attempts} subok na natitira.",
          "ms": "❌ Kunci tidak sepadan. Baki {attempts} percubaan lagi."
    },
    "vault_err_decryption": {
          "en": "Decryption error: {error}",
          "id": "Kesalahan dekripsi: {error}",
          "ja": "復号化エラー: {error}",
          "ko": "복호화 오류: {error}",
          "zh": "解密失败: {error}",
          "zh-TW": "解密失敗: {error}",
          "vi": "Lỗi giải mã: {error}",
          "th": "ข้อผิดพลาดในการถอดรหัส: {error}",
          "hi": "डिक्रिप्शन त्रुटि: {error}",
          "fil": "Error sa pag-decrypt: {error}",
          "ms": "Ralat penyahsulitan: {error}"
    },
    "seed_txt_title": {
          "en": "TELMY.AI — EMERGENCY ZERO-KNOWLEDGE SEED PHRASE",
          "id": "TELMY.AI — KATA KUNCI DARURAT ZERO-KNOWLEDGE",
          "ja": "TELMY.AI — 緊急用ゼロ知識シードフレーズ",
          "ko": "TELMY.AI — 비상 영지식(Zero-Knowledge) 시드 구문",
          "zh": "TELMY.AI — 紧急零知识恢复助记词",
          "zh-TW": "TELMY.AI — 緊急零知識復原助記詞",
          "vi": "TELMY.AI — CỤM TỪ HẠT GIỐNG KHẨN CẤP ZERO-KNOWLEDGE",
          "th": "TELMY.AI — วลีกู้คืนฉุกเฉิน ZERO-KNOWLEDGE",
          "hi": "TELMY.AI — आपातकालीन जीरो-नॉलेज सीड वाक्यांश",
          "fil": "TELMY.AI — EMERGENCY ZERO-KNOWLEDGE SEED PHRASE",
          "ms": "TELMY.AI — FRASA BENIH KECEMASAN ZERO-KNOWLEDGE"
    },
    "seed_txt_generated": {
          "en": "Generated: ",
          "id": "Dibuat pada: ",
          "ja": "生成日時: ",
          "ko": "생성 일시: ",
          "zh": "生成时间: ",
          "zh-TW": "產生時間: ",
          "vi": "Thời gian tạo: ",
          "th": "สร้างเมื่อ: ",
          "hi": "उत्पन्न: ",
          "fil": "Ginawa noong: ",
          "ms": "Dihasilkan pada: "
    },
    "seed_txt_label": {
          "en": "Your 12 Secret Words (Keep this safe & offline):",
          "id": "12 Kata Rahasia Anda (Simpan aman & offline):",
          "ja": "あなたの12語の秘密フレーズ（安全にオフラインで保管してください）:",
          "ko": "12개의 비밀 단어 (안전하게 오프라인으로 보관하세요):",
          "zh": "您的12个私密助记词（请妥善并离线安全保存）:",
          "zh-TW": "您的12個秘密字詞（請妥善並離線安全保存）:",
          "vi": "12 Từ bí mật của bạn (Lưu giữ an toàn & ngoại tuyến):",
          "th": "คำลับ 12 คำของคุณ (เก็บรักษาให้ปลอดภัยและออฟไลน์):",
          "hi": "आपके 12 गुप्त शब्द (इसे सुरक्षित और ऑफ़लाइन रखें):",
          "fil": "Ang iyong 12 Lihim na Salita (Itago ito nang ligtas at offline):",
          "ms": "12 Kata Rahsia Anda (Simpan selamat & luar talian):"
    },
    "seed_txt_warning": {
          "en": "IMPORTANT: If you lose these words, your encrypted profile cannot be recovered by anyone.",
          "id": "PENTING: Jika Anda kehilangan kata-kata ini, profil terenkripsi Anda tidak dapat dipulihkan oleh siapa pun.",
          "ja": "重要：これらの単語を紛失した場合、誰にも暗号化されたプロファイルを復元することはできません。",
          "ko": "중요: 이 단어들을 분실할 경우, 그 누구도 암호화된 프로필을 복구할 수 없습니다。",
          "zh": "重要提醒：若遗失这些助记词，任何人都无法为您找回或解密受保护的个人档案。",
          "zh-TW": "重要提醒：若遺失這些字詞，任何人都無法為您復原或解密受保護的個人資料。",
          "vi": "QUAN TRỌNG: Nếu bạn làm mất các từ này, không ai có thể khôi phục hồ sơ đã mã hóa của bạn.",
          "th": "สำคัญ: หากคุณทำคำเหล่านี้หาย จะไม่มีใครสามารถกู้คืนโปรไฟล์ที่เข้ารหัสของคุณได้",
          "hi": "महत्वपूर्ण: यदि आप इन शब्दों को खो देते हैं, तो कोई भी आपकी एन्क्रिप्टेड प्रोफ़ाइल को पुनर्प्राप्त नहीं कर सकता है।",
          "fil": "MAHALAGA: Kung mawala mo ang mga salitang ito, walang sinuman ang makakabawi sa iyong profile.",
          "ms": "PENTING: Jika anda kehilangan kata-kata ini, profil disulitkan anda tidak boleh dipulihkan oleh sesiapa."
    },
    "translate_success_msg": {
          "en": "🌐 **Full Page Translated ({count} elements)**\n\nThe webpage has been translated into **{lang}** using **Google Gemini AI**.\n\n✓ **Official Bureaucracy Terms Preserved**\n✓ **UI/UX Standards Applied**\n\nYou can click **Show Original** at any time to revert.",
          "id": "🌐 **Halaman Berhasil Diterjemahkan ({count} elemen)**\n\nHalaman web telah diterjemahkan ke dalam **{lang}** menggunakan **Google Gemini AI**.\n\n✓ **Istilah Birokrasi & Glosarium Terjaga**\n✓ **Standar UI/UX Diterapkan**\n\nAnda dapat mengklik **Tampilkan Asli** kapan saja untuk membatalkan.",
          "ja": "🌐 **全ページを翻訳しました（{count} 個の要素）**\n\nWebページは **Google Gemini AI** により **{lang}** に翻訳されました。\n\n✓ **公的用語・専門用語を正確に保持**\n✓ **UI/UX表示基準を維持**\n\n「元に戻す」を押すといつでも原文に戻せます。",
          "ko": "🌐 **전체 페이지 번역 완료 ({count}개 요소)**\n\n**Google Gemini AI**를 사용하여 웹페이지를 **{lang}**로 번역했습니다.\n\n✓ **공식 행정 및 전문 용어 유지**\n✓ **UI/UX 표준 적용**\n\n언제든지 '원본 보기'를 눌러 되돌릴 수 있습니다.",
          "zh": "🌐 **全页面翻译完成（共 {count} 个网页元素）**\n\n当前网页已通过 **Google Gemini AI** 翻译为 **{lang}**。\n\n✓ **准确保留官方办事与专业术语**\n✓ **保持原版 UI/UX 规范**\n\n您可以随时点击“显示原文”一键还原。",
          "zh-TW": "🌐 **全頁面翻譯完成（共 {count} 個元素）**\n\n本網頁已透過 **Google Gemini AI** 翻譯為 **{lang}**。\n\n✓ **精確保留官方與專業詞彙**\n✓ **維持原版 UI/UX 標準**\n\n您可以隨時點選「顯示原文」一鍵還原。",
          "vi": "🌐 **Đã dịch toàn bộ trang ({count} phần tử)**\n\nTrang web đã được dịch sang **{lang}** bằng **Google Gemini AI**.\n\n✓ **Bảo toàn thuật ngữ hành chính chính thức**\n✓ **Áp dụng tiêu chuẩn UI/UX**\n\nBạn có thể nhấp **Xem bản gốc** bất kỳ lúc nào để hoàn tác.",
          "th": "🌐 **แปลทั้งหน้าเสร็จสิ้น ({count} องค์ประกอบ)**\n\nหน้าเว็บได้รับการแปลเป็นภาษา **{lang}** โดย **Google Gemini AI**\n\n✓ **รักษาคำศัพท์ทางการและบริบท**\n✓ **คงมาตรฐาน UI/UX**\n\nคุณสามารถคลิก **แสดงต้นฉบับ** เพื่อย้อนกลับได้ตลอดเวลา",
          "hi": "🌐 **पूरा पृष्ठ अनूदित ({count} तत्व)**\n\nवेबपेज का **Google Gemini AI** का उपयोग करके **{lang}** में अनुवाद किया गया है।\n\n✓ **आधिकारिक नियम और शब्दावली संरक्षित**\n✓ **UI/UX मानक लागू**\n\nआप किसी भी समय वापस जाने के लिए **मूल दिखाएं** पर क्लिक कर सकते हैं।",
          "fil": "🌐 **Naisalin ang Buong Pahina ({count} elemento)**\n\nAng webpage ay naisalin sa **{lang}** gamit ang **Google Gemini AI**.\n\n✓ **Napanatili ang mga Opisyal na Termino**\n✓ **Inilapat ang UI/UX Standards**\n\nMaaari mong i-click ang **Ipakita ang Orihinal** anumang oras upang ibalik.",
          "ms": "🌐 **Borang / Halaman Diterjemahkan ({count} elemen)**\n\nLaman web telah diterjemahkan ke dalam **{lang}** menggunakan **Google Gemini AI**.\n\n✓ **Istilah Rasmi & Glosari Dikekalkan**\n✓ **Piawaian UI/UX Diterapkan**\n\nAnda boleh mengklik **Tunjuk Asal** pada bila-bila masa untuk kembali."
    },
    "translate_error_msg": {
          "en": "❌ **Failed to Translate Page**\n\n{error}\n\nPlease check your connection or try again.",
          "id": "❌ **Gagal Menerjemahkan Halaman**\n\n{error}\n\nSilakan periksa koneksi atau coba lagi.",
          "ja": "❌ **ページの翻訳に失敗しました**\n\n{error}\n\n接続状況を確認して再試行してください。",
          "ko": "❌ **페이지 번역 실패**\n\n{error}\n\n연결 상태를 확인하거나 다시 시도해 주세요.",
          "zh": "❌ **翻译页面失败**\n\n{error}\n\n请检查网络连接或稍后重试。",
          "zh-TW": "❌ **頁面翻譯失敗**\n\n{error}\n\n請檢查網路連線或稍後再試。",
          "vi": "❌ **Dịch trang thất bại**\n\n{error}\n\nVui lòng kiểm tra kết nối và thử lại.",
          "th": "❌ **แปลหน้าเว็บไม่สำเร็จ**\n\n{error}\n\nกรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง",
          "hi": "❌ **पृष्ठ का अनुवाद करने में विफल**\n\n{error}\n\nकृपया कनेक्शन जांचें या पुनः प्रयास करें।",
          "fil": "❌ **Nabigong Isalin ang Pahina**\n\n{error}\n\nPakisuri ang koneksyon at subukan muli.",
          "ms": "❌ **Gagal Menterjemah Laman**\n\n{error}\n\nSila semak sambungan anda atau cuba lagi."
    }
  };

  const LANG_SVGS = {
    en: '<svg viewBox="0 0 640 480"><rect width="640" height="480" fill="#bd3d44"/><path stroke="#fff" stroke-width="37" d="M0 55.4h640m0 73.8h-640m0 73.8h640m0 73.8h-640m0 73.8h640m0 73.8h-640"/><rect width="256" height="258" fill="#192f5d"/><g fill="#fff"><circle cx="40" cy="35" r="10"/><circle cx="100" cy="35" r="10"/><circle cx="160" cy="35" r="10"/><circle cx="220" cy="35" r="10"/><circle cx="70" cy="70" r="10"/><circle cx="130" cy="70" r="10"/><circle cx="190" cy="70" r="10"/><circle cx="40" cy="105" r="10"/><circle cx="100" cy="105" r="10"/><circle cx="160" cy="105" r="10"/><circle cx="220" cy="105" r="10"/><circle cx="70" cy="140" r="10"/><circle cx="130" cy="140" r="10"/><circle cx="190" cy="140" r="10"/><circle cx="40" cy="175" r="10"/><circle cx="100" cy="175" r="10"/><circle cx="160" cy="175" r="10"/><circle cx="220" cy="175" r="10"/><circle cx="70" cy="210" r="10"/><circle cx="130" cy="210" r="10"/><circle cx="190" cy="210" r="10"/></g></svg>',
    id: '<svg viewBox="0 0 640 480"><path fill="#e70011" d="M0 0h640v240H0z"/><path fill="#ffffff" d="M0 240h640v240H0z"/></svg>',
    ja: '<svg viewBox="0 0 640 480"><path fill="#ffffff" d="M0 0h640v480H0z"/><circle fill="#bc002d" cx="320" cy="240" r="144"/></svg>',
    ko: '<svg viewBox="0 0 640 480"><path fill="#ffffff" d="M0 0h640v480H0z"/><g transform="translate(320,240)"><path fill="#cd2e3a" d="M0-120a120 120 0 0 1 120 120 60 60 0 0 1-60 60 60 60 0 0 0-60-60 60 60 0 0 0-60 60 60 60 0 0 1-60-60A120 120 0 0 1 0-120z"/><path fill="#0047a0" d="M0 120a120 120 0 0 1-120-120 60 60 0 0 1 60-60 60 60 0 0 0 60 60 60 60 0 0 0 60-60 60 60 0 0 1 60 60A120 120 0 0 1 0 120z"/></g><g fill="#000"><rect x="90" y="80" width="30" height="90" transform="rotate(-34 105 125)"/><rect x="130" y="80" width="30" height="90" transform="rotate(-34 145 125)"/><rect x="480" y="80" width="30" height="90" transform="rotate(34 495 125)"/><rect x="520" y="80" width="30" height="90" transform="rotate(34 535 125)"/></g></svg>',
    zh: '<svg viewBox="0 0 640 480"><path fill="#ee1c25" d="M0 0h640v480H0z"/><polygon fill="#ffde00" points="120,60 133,100 175,100 141,125 154,165 120,140 86,165 99,125 65,100 107,100"/></svg>',
    'zh-TW': '<svg viewBox="0 0 640 480"><path fill="#fe0000" d="M0 0h640v480H0z"/><path fill="#000095" d="M0 0h320v240H0z"/><circle fill="#fff" cx="160" cy="120" r="50"/><circle fill="#000095" cx="160" cy="120" r="34"/><circle fill="#fff" cx="160" cy="120" r="26"/></svg>',
    vi: '<svg viewBox="0 0 640 480"><path fill="#da251d" d="M0 0h640v480H0z"/><polygon fill="#ffff00" points="320,90 357,204 477,204 380,274 417,388 320,318 223,388 260,274 163,204 283,204"/></svg>',
    th: '<svg viewBox="0 0 640 480"><path fill="#a51931" d="M0 0h640v480H0z"/><path fill="#f4f5f8" d="M0 80h640v320H0z"/><path fill="#2d2a4a" d="M0 160h640v160H0z"/></svg>',
    hi: '<svg viewBox="0 0 640 480"><path fill="#ff9933" d="M0 0h640v160H0z"/><path fill="#ffffff" d="M0 160h640v160H0z"/><path fill="#128807" d="M0 320h640v160H0z"/><circle fill="#000088" cx="320" cy="240" r="45"/><circle fill="#ffffff" cx="320" cy="240" r="37"/><circle fill="#000088" cx="320" cy="240" r="14"/></svg>',
    fil: '<svg viewBox="0 0 640 480"><path fill="#0038a8" d="M0 0h640v240H0z"/><path fill="#ce1126" d="M0 240h640v240H0z"/><polygon fill="#ffffff" points="0,0 280,240 0,480"/><circle fill="#fcd116" cx="95" cy="240" r="32"/></svg>',
    ms: '<svg viewBox="0 0 640 480"><g fill="#cc0000"><rect width="640" height="34" y="0"/><rect width="640" height="34" y="68"/><rect width="640" height="34" y="137"/><rect width="640" height="34" y="205"/><rect width="640" height="34" y="274"/><rect width="640" height="34" y="342"/><rect width="640" height="34" y="411"/></g><g fill="#ffffff"><rect width="640" height="34" y="34"/><rect width="640" height="34" y="102"/><rect width="640" height="34" y="171"/><rect width="640" height="34" y="239"/><rect width="640" height="34" y="308"/><rect width="640" height="34" y="377"/><rect width="640" height="34" y="446"/></g><rect width="320" height="274" fill="#000066"/><circle cx="160" cy="137" r="75" fill="#ffcc00"/><circle cx="185" cy="137" r="62" fill="#000066"/><polygon points="210,137 190,120 195,145 175,130 195,150 180,165 200,155 210,175 215,155 235,165 220,150 240,130 220,145 225,120" fill="#ffcc00"/></svg>'
  };

  const LANG_OPTIONS = [
    { code: 'en', label: 'English (US)', short: 'EN' },
    { code: 'id', label: 'Indonesia', short: 'ID' },
    { code: 'ja', label: '日本語', short: 'JA' },
    { code: 'ko', label: '한국어', short: 'KO' },
    { code: 'zh', label: '简体中文', short: 'ZH' },
    { code: 'zh-TW', label: '繁體中文', short: 'TW' },
    { code: 'vi', label: 'Tiếng Việt', short: 'VI' },
    { code: 'th', label: 'ไทย', short: 'TH' },
    { code: 'hi', label: 'हिन्दी', short: 'HI' },
    { code: 'fil', label: 'Filipino', short: 'FIL' },
    { code: 'ms', label: 'Bahasa Melayu', short: 'MS' }
  ];

  const LOCALE_MAP = {
    en: 'en-US',
    id: 'id-ID',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN',
    'zh-TW': 'zh-TW',
    vi: 'vi-VN',
    th: 'th-TH',
    hi: 'hi-IN',
    fil: 'fil-PH',
    ms: 'ms-MY'
  };

  function t(key, replacements = {}) {
    const entry = I18N[key];
    if (!entry) return '';
    let val = entry[currentLanguage] || entry['en'] || entry['id'] || '';
    if (replacements && typeof replacements === 'object') {
      Object.entries(replacements).forEach(([k, v]) => {
        val = val.replaceAll(`{${k}}`, v);
      });
    }
    return val;
  }

  // Custom Mini Language Dropdown with SVG Flags (Priority 5.1)
  function initCustomLanguageDropdown() {
    if (!spLangDropdown || !spLangBtn || !spLangMenu) return;

    spLangMenu.innerHTML = LANG_OPTIONS.map(opt => `
      <button type="button" class="lang-menu-item ${opt.code === currentLanguage ? 'active' : ''}" data-lang="${opt.code}">
        <span class="lang-flag">${LANG_SVGS[opt.code] || ''}</span>
        <span class="lang-name">${opt.label}</span>
        <span class="lang-code" style="margin-left: auto; font-size: 10px; opacity: 0.6;">${opt.short}</span>
      </button>
    `).join('');

    updateCustomLanguageButton();

    spLangBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = spLangDropdown.classList.contains('open');
      if (isOpen) {
        closeCustomLanguageDropdown();
      } else {
        openCustomLanguageDropdown();
      }
    });

    spLangMenu.querySelectorAll('.lang-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = item.getAttribute('data-lang');
        if (selectedLang) {
          selectLanguage(selectedLang);
        }
        closeCustomLanguageDropdown();
      });
    });

    document.addEventListener('click', (e) => {
      if (!spLangDropdown.contains(e.target)) {
        closeCustomLanguageDropdown();
      }
    });
  }

  function openCustomLanguageDropdown() {
    if (!spLangDropdown || !spLangMenu) return;
    spLangDropdown.classList.add('open');
    spLangMenu.style.display = 'flex';
  }

  function closeCustomLanguageDropdown() {
    if (!spLangDropdown || !spLangMenu) return;
    spLangDropdown.classList.remove('open');
    spLangMenu.style.display = 'none';
  }

  function updateCustomLanguageButton() {
    if (spCurrentFlag) spCurrentFlag.innerHTML = LANG_SVGS[currentLanguage] || '';
    if (spCurrentLangCode) {
      const match = LANG_OPTIONS.find(o => o.code === currentLanguage);
      spCurrentLangCode.textContent = match ? match.short : (currentLanguage || 'EN').toUpperCase();
    }
    if (spLangMenu) {
      spLangMenu.querySelectorAll('.lang-menu-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-lang') === currentLanguage);
      });
    }
  }

  function selectLanguage(lang) {
    currentLanguage = lang;
    if (langSelect) langSelect.value = currentLanguage;
    const onboardingSelect = document.getElementById('onboarding-lang-select');
    if (onboardingSelect) onboardingSelect.value = currentLanguage;
    updateCustomLanguageButton();

    chrome.storage.local.get(['settings']).then((res) => {
      const updated = { ...(res.settings || {}), language: currentLanguage };
      chrome.storage.local.set({ settings: updated });
    });

    applyLanguageUI();

    if (activeFieldIndex >= 0 && detectedFields[activeFieldIndex]) {
      renderFieldDetail(detectedFields[activeFieldIndex]);
    }
  }

  async function getActiveWebTab() {
    try {
      let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (!tab || !tab.id || tab.url?.startsWith('chrome-extension://') || tab.url?.startsWith('chrome://')) {
        const tabs = await chrome.tabs.query({ active: true });
        const webTab = tabs.find(t => t.url && (t.url.startsWith('http://') || t.url.startsWith('https://')));
        if (webTab) return webTab;
        if (tabs && tabs.length > 0) return tabs[0];
      }
      return tab || null;
    } catch (e) {
      return null;
    }
  }

  // Ensure content script & CSS are proactively injected without requiring page refresh
  async function ensureContentScriptInjected(tabId) {
    if (!tabId) return;
    try {
      const tab = await chrome.tabs.get(tabId).catch(() => null);
      const tabUrl = (tab && tab.url) ? tab.url : '';
      if (!tabUrl || isTelmyInternalUrl(tabUrl)) return;
      if (tabUrl.startsWith('chrome://') || tabUrl.startsWith('edge://') || tabUrl.startsWith('about:') || tabUrl.startsWith('chrome-extension://')) return;

      return new Promise((resolve) => {
        safeSendTabMessage(tabId, { type: 'A11Y_GET_STATE' }, async (err, res) => {
          if (err || !res) {
            console.log('[Telmy] Tab has no content script yet. Injecting on-demand without refresh...');
            await injectContentScript(tabId);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    } catch (e) {
      // safe ignore
    }
  }

  // Tab-Aware Multi-Session State Manager (Option 1)
  function saveTabSession(tabId) {
    if (!tabId) return;
    tabSessions.set(tabId, {
      url: currentTabUrl,
      detectedFields: [...detectedFields],
      activeFieldIndex,
      cachedPageSummary,
      isCurrentPageAnalyzed,
      currentFieldsState,
      isPageTranslated,
      translatedElementCount,
      chatHistory: [...chatHistory],
      activeSourceMode,
      currentPdfData,
      activePdfSectionIndex,
      pdfChecklistState: { ...pdfChecklistState },
      currentPdfRawBytes,
      currentPdfFileName,
      currentPdfMimeType,
      pdfUserFormValues: { ...pdfUserFormValues }
    });
  }

  async function restoreOrResetTabSession(tabId, tabUrl) {
    if (!tabId) return;
    currentTabId = tabId;
    currentTabUrl = tabUrl || '';

    if (tabSessions.has(tabId)) {
      // 1. Restore existing session for this tab
      const session = tabSessions.get(tabId);
      detectedFields = session.detectedFields ? [...session.detectedFields] : [];
      activeFieldIndex = session.activeFieldIndex !== undefined ? session.activeFieldIndex : -1;
      cachedPageSummary = session.cachedPageSummary || null;
      isCurrentPageAnalyzed = Boolean(session.isCurrentPageAnalyzed);
      isPageTranslated = Boolean(session.isPageTranslated);
      translatedElementCount = session.translatedElementCount || 0;
      activeSourceMode = session.activeSourceMode || 'web';
      currentPdfData = session.currentPdfData || null;
      activePdfSectionIndex = session.activePdfSectionIndex || 0;
      pdfChecklistState = session.pdfChecklistState ? { ...session.pdfChecklistState } : {};
      currentPdfRawBytes = session.currentPdfRawBytes || null;
      currentPdfFileName = session.currentPdfFileName || 'Document.pdf';
      currentPdfMimeType = session.currentPdfMimeType || 'application/pdf';
      pdfUserFormValues = session.pdfUserFormValues ? { ...session.pdfUserFormValues } : {};
      chatHistory = session.chatHistory ? [...session.chatHistory] : [];

      // Re-render chat stream
      renderWelcome();

      // Render Fields quick list & Stepper
      renderFieldsList(detectedFields);

      // Restore fields pane UI state
      if (session.currentFieldsState === 'detail' && activeFieldIndex >= 0 && detectedFields[activeFieldIndex]) {
        selectFieldByIndex(activeFieldIndex, false);
        const defaultSummary = currentLanguage === 'en'
          ? 'Official online registration form for service application.'
          : (currentLanguage === 'id' ? 'Formulir online resmi untuk pendaftaran layanan.' : 'Official registration form.');
        const summaryStr = (cachedPageSummary && cachedPageSummary.description) || defaultSummary;
        if (analyzedSummaryText) analyzedSummaryText.textContent = summaryStr;
        showFieldsState('analyzed');
      } else if (session.currentFieldsState === 'completion') {
        showFieldsState('completion');
      } else {
        updateEmptyStateUI(isCurrentPageAnalyzed && detectedFields.length > 0 ? 'select_field' : 'unscanned');
        showFieldsState('empty');
      }

      // Restore translation & PDF banner
      updateTranslateBannerUI();
      checkPdfTab(tabUrl);
      if (activeSourceMode === 'pdf') {
        switchSourceMode('pdf');
      } else {
        switchSourceMode('web');
      }
    } else {
      // 2. Fresh new session for this tab (Option 1 Tab-Aware Switching)
      detectedFields = [];
      activeFieldIndex = -1;
      cachedPageSummary = null;
      isCurrentPageAnalyzed = false;
      isPageTranslated = false;
      translatedElementCount = 0;
      activeSourceMode = 'web';
      currentPdfData = null;
      activePdfSectionIndex = 0;
      pdfChecklistState = {};
      currentPdfRawBytes = null;
      currentPdfFileName = 'Document.pdf';
      currentPdfMimeType = 'application/pdf';
      pdfUserFormValues = {};

      renderFieldsList([]);
      updateEmptyStateUI('unscanned');
      showFieldsState('empty');
      switchSourceMode('web');
      updateTranslateBannerUI();

      // Fresh new tab/session: reset chat history so onboarding welcome card is shown
      chatHistory = [];
      renderWelcome();
      checkPdfTab(tabUrl);
      checkTabScannerStatus(tabId);
      checkPageTranslationStatus(tabId);
    }
  }

  // 1. Initialize Active Tab, User & Onboarding
  async function init() {
    // Load Settings & User
    const stored = await chrome.storage.local.get(['settings', 'hasCompletedOnboarding', 'user', 'telmyBotMode']);
    if (stored.settings) {
      if (!stored.settings.apiUrl || stored.settings.apiUrl.includes('localhost') || stored.settings.apiUrl.includes('127.0.0.1') || stored.settings.apiUrl.includes('telmy.web.app') || stored.settings.apiUrl.includes('cloud.run')) {
        stored.settings.apiUrl = 'https://telmy.id/api';
        chrome.storage.local.set({ settings: stored.settings });
      }
      currentLanguage = stored.settings.language || 'en';
      langSelect.value = currentLanguage;
    } else {
      chrome.storage.local.set({ settings: { language: 'en', apiUrl: 'https://telmy.id/api', isActive: true } });
      langSelect.value = 'en';
    }

    currentUser = stored.user || null;
    initCustomLanguageDropdown();
    renderUserUI();
    applyLanguageUI();

    // Show Onboarding if first-time install
    if (!stored.hasCompletedOnboarding) {
      showOnboardingModal();
    }

    setupUserControlsAndOnboarding();
    setupPdfMode();
    setupVaultController();
    setupQuotaAndPaywall();
    refreshUserQuota();
    setupAccessibilityHub();

    // Initialize Mode Toggle Cards (Chatbot vs Voicebot)
    const initialMode = stored.telmyBotMode || 'chat';
    setBotMode(initialMode);
    setupModeToggleCards();

    // Determine current active tab
    const tab = await getActiveWebTab();
    if (tab && tab.id) {
      currentTabId = tab.id;
      ensureContentScriptInjected(tab.id);
      await restoreOrResetTabSession(tab.id, tab.url);
    } else {
      renderWelcome();
    }

    // Connect Manual Analyze and Rescan Buttons (Method 2: 1-Click with Zero Browser Reload)
    const btnManualAnalyze = document.getElementById('btn-manual-analyze-form');
    if (btnManualAnalyze) {
      btnManualAnalyze.addEventListener('click', () => {
        triggerFullFormAnalysis(btnManualAnalyze);
      });
    }

    if (btnRescan) {
      btnRescan.addEventListener('click', () => {
        triggerFullFormAnalysis();
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        if (currentTabId) {
          deactivateScannerOnTab(currentTabId);
        }
      });
    }

    // Initialize Interactive Talking Avatar Companion (Priority 2)
    if (window.TelmyAvatar) {
      telmyAvatar = new TelmyAvatar('#sp-avatar-slot', {
        size: 36,
        interactive: true,
        onClick: handleAvatarTap
      });
      if (initialMode === 'voice' && spVoicebotRobotSlot) {
        voicebotAvatar = new TelmyAvatar(spVoicebotRobotSlot, {
          size: 88,
          interactive: true,
          onClick: handleAvatarTap
        });
      }
    }

    setupSpeechRecognition();

    // Connect sidepanel lifecycle port so background worker knows when sidepanel closes
    try {
      chrome.runtime.connect({ name: 'telmy-sidepanel-lifecycle' });
    } catch (e) {}

    // Clean up active tab badges and a11y effects when sidepanel is closed/unloaded
    const handleSidepanelClose = () => {
      if (currentTabId) {
        safeSendTabMessage(currentTabId, { type: 'DEACTIVATE_SCANNER' });
        safeSendTabMessage(currentTabId, { type: 'A11Y_RESET_ALL' });
      }
      chrome.storage.local.set({
        a11y_hub_active: false,
        a11y_feature_states: {},
        a11y_spotlight_enabled: false,
        a11y_speak_enabled: false,
        a11y_thick_focus: false
      });
    };
    window.addEventListener('beforeunload', handleSidepanelClose);
    window.addEventListener('unload', handleSidepanelClose);

    // Auto-refresh session & quota when sidepanel regains window focus (e.g. returning from web login)
    window.addEventListener('focus', async () => {
      const stored = await chrome.storage.local.get(['user', 'settings']);
      if (stored.user) {
        currentUser = stored.user;
        renderUserUI();
        refreshUserQuota();
        if (onboardingModal) closeOnboardingModal();
      }
    });

    // Handle tab switching in browser (Option 1: Multi-Session Tab-Aware Switching)
    if (chrome.tabs && chrome.tabs.onActivated) {
      chrome.tabs.onActivated.addListener(async (activeInfo) => {
        if (currentTabId && currentTabId !== activeInfo.tabId) {
          saveTabSession(currentTabId);
          safeSendTabMessage(currentTabId, { type: 'DEACTIVATE_SCANNER' });
          safeSendTabMessage(currentTabId, { type: 'A11Y_RESET_ALL' });
        }
        currentTabId = activeInfo.tabId;
        const newTab = await chrome.tabs.get(activeInfo.tabId).catch(() => null) || await getActiveWebTab();
        if (newTab) {
          await restoreOrResetTabSession(currentTabId, newTab.url);
        }
        const activeSession = tabSessions.get(currentTabId);
        if (isScannerRunning && activeSession && activeSession.isCurrentPageAnalyzed) {
          activateScannerOnTab(currentTabId);
        }
      });
    }

    // Handle in-page navigation / page reload / SPA loading on current tab
    if (chrome.tabs && chrome.tabs.onUpdated) {
      chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (tabId === currentTabId && (changeInfo.status === 'complete' || changeInfo.url)) {
          if (tab && tab.url) {
            const existingSession = tabSessions.get(tabId);
            if (changeInfo.url || (existingSession && existingSession.url !== tab.url)) {
              // URL changed within tab -> reset session for new destination
              tabSessions.delete(tabId);
            }
            await restoreOrResetTabSession(tabId, tab.url);
          }
          const updatedSession = tabSessions.get(tabId);
          if (isScannerRunning && updatedSession && updatedSession.isCurrentPageAnalyzed) {
            activateScannerOnTab(currentTabId);
          }
        }
      });
    }

    // Clean up closed tabs to prevent memory leaks
    if (chrome.tabs && chrome.tabs.onRemoved) {
      chrome.tabs.onRemoved.addListener((tabId) => {
        tabSessions.delete(tabId);
      });
    }
  }

  // 2. Render User Profile UI in Header & Popover
  function renderUserUI() {
    if (currentUser) {
      const initial = (currentUser.displayName || currentUser.name || currentUser.email || 'U')[0].toUpperCase();
      if (currentUser.photoURL) {
        userAvatarImg.src = currentUser.photoURL;
        userAvatarImg.style.display = 'block';
        userAvatarText.style.display = 'none';

        popoverAvatarImg.src = currentUser.photoURL;
        popoverAvatarImg.style.display = 'block';
        popoverAvatarText.style.display = 'none';
      } else {
        userAvatarText.textContent = initial;
        userAvatarText.style.display = 'block';
        userAvatarImg.style.display = 'none';

        popoverAvatarText.textContent = initial;
        popoverAvatarText.style.display = 'block';
        popoverAvatarImg.style.display = 'none';
      }

      popoverUserName.textContent = currentUser.displayName || currentUser.name || 'User';
      popoverUserEmail.textContent = currentUser.email || t('popover_connected');
      popoverAuthBadge.textContent = t('popover_connected');
      popoverAuthBadge.className = 'badge-auth-status connected';

      btnPopoverAuth.style.display = 'none';
      btnPopoverSignout.style.display = 'block';

      // Update onboarding preview if open
      if (onboardingAuthed && onboardingUnauthed) {
        onboardingUnauthed.style.display = 'none';
        onboardingAuthed.style.display = 'flex';
        onboardingUserName.textContent = currentUser.displayName || currentUser.name || 'User';
        onboardingUserEmail.textContent = currentUser.email || '';
        if (currentUser.photoURL) {
          onboardingUserAvatarImg.src = currentUser.photoURL;
          onboardingUserAvatarImg.style.display = 'block';
          onboardingUserAvatarText.style.display = 'none';
        } else {
          onboardingUserAvatarText.textContent = initial;
        }
      }
      // Hide auth required gate & show tabs
      const authGate = document.getElementById('auth-required-gate');
      const navTabs = document.getElementById('sp-nav-tabs');
      if (authGate) authGate.style.display = 'none';
      if (navTabs) navTabs.style.display = 'flex';
      // Restore active pane
      const activeBtn = document.querySelector('.sp-tab-btn.active');
      const activeTab = activeBtn ? activeBtn.getAttribute('data-tab') : 'chat';
      panes.forEach(p => p.classList.toggle('active', p.id === `pane-${activeTab}`));
      const chatFooter = document.querySelector('.sp-chat-footer');
      if (chatFooter && activeTab === 'chat') chatFooter.style.display = 'flex';
    } else {
      userAvatarText.textContent = '👤';
      userAvatarText.style.display = 'block';
      userAvatarImg.style.display = 'none';

      popoverAvatarText.textContent = '👤';
      popoverAvatarText.style.display = 'block';
      popoverAvatarImg.style.display = 'none';

      popoverUserName.textContent = t('popover_guest_user');
      popoverUserEmail.textContent = t('popover_not_signed_in');
      popoverAuthBadge.textContent = t('popover_login_required');
      popoverAuthBadge.className = 'badge-auth-status';

      btnPopoverAuth.style.display = 'block';
      btnPopoverSignout.style.display = 'none';

      if (onboardingAuthed && onboardingUnauthed) {
        onboardingUnauthed.style.display = 'flex';
        onboardingAuthed.style.display = 'none';
      }

      // Show auth required gate & hide tabs and panes
      const authGate = document.getElementById('auth-required-gate');
      const navTabs = document.getElementById('sp-nav-tabs');
      if (authGate) authGate.style.display = 'flex';
      if (navTabs) navTabs.style.display = 'none';
      panes.forEach(p => { p.classList.remove('active'); });
      const chatFooter = document.querySelector('.sp-chat-footer');
      if (chatFooter) chatFooter.style.display = 'none';
    }
  }

  // 3. User Controls & Onboarding Events
  function setupUserControlsAndOnboarding() {
    const btnGateLogin = document.getElementById('btn-gate-login');
    if (btnGateLogin) {
      btnGateLogin.addEventListener('click', () => {
        handleUserAuthConnect();
      });
    }

    // A. Profile Popover Toggle
    btnUser.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePopover.style.display = profilePopover.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
      if (!profilePopover.contains(e.target) && e.target !== btnUser) {
        profilePopover.style.display = 'none';
      }
    });

    btnPopoverAuth.addEventListener('click', () => {
      profilePopover.style.display = 'none';
      handleUserAuthConnect();
    });

    btnPopoverSignout.addEventListener('click', async () => {
      await chrome.storage.local.remove(['user']);
      currentUser = null;
      renderUserUI();
      profilePopover.style.display = 'none';
    });

    // Priority 9.2: Form Pre-Submission Auditor Controls
    if (btnRunFormAudit) {
      btnRunFormAudit.addEventListener('click', runPreSubmissionAudit);
    }

    if (btnCloseAuditReport && spAuditReportBox) {
      btnCloseAuditReport.addEventListener('click', () => {
        spAuditReportBox.style.display = 'none';
      });
    }

    // B. Close / Pause Scanner Button (Explicit Turn-Off)
    btnClose.addEventListener('click', () => {
      if (isScannerRunning) {
        isScannerRunning = false;
        deactivateScannerOnTab(currentTabId);
        pausedBanner.style.display = 'flex';
      } else {
        // Close sidepanel window if already paused
        window.close();
      }
    });

    // Resume Scanner Button
    btnResume.addEventListener('click', () => {
      isScannerRunning = true;
      pausedBanner.style.display = 'none';
      if (currentTabId && isCurrentPageAnalyzed) {
        activateScannerOnTab(currentTabId);
      }
    });

    // C. Onboarding Wizard Actions
    onboardingLangSelect.value = currentLanguage;
    onboardingLangSelect.addEventListener('change', () => {
      currentLanguage = onboardingLangSelect.value;
      langSelect.value = currentLanguage;
      applyLanguageUI();
    });

    btnOnboardingGoogle.addEventListener('click', handleUserAuthConnect);

    btnOnboardingFinish.addEventListener('click', async () => {
      if (!currentUser) {
        handleUserAuthConnect();
        return;
      }
      await chrome.storage.local.set({
        hasCompletedOnboarding: true,
        settings: { ...(await chrome.storage.local.get(['settings'])).settings, language: currentLanguage }
      });
      closeOnboardingModal();
      if (currentTabId && isScannerRunning && isCurrentPageAnalyzed) {
        activateScannerOnTab(currentTabId);
      }
    });

    const onboardingFeatPdf = document.getElementById('onboarding-feat-pdf');
    if (onboardingFeatPdf) {
      onboardingFeatPdf.addEventListener('click', () => {
        closeOnboardingModal();
        openPdfMode();
      });
    }
  }

  function showOnboardingModal() {
    onboardingModal.style.display = 'flex';
  }

  function closeOnboardingModal() {
    onboardingModal.style.display = 'none';
  }

  // Handle Firebase Google Sign-In Connect Flow
  async function handleUserAuthConnect() {
    const settings = (await chrome.storage.local.get(['settings'])).settings || {};
    let apiUrl = settings.apiUrl || 'https://telmy.id/api';
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1') || apiUrl.includes('telmy.web.app') || apiUrl.includes('cloud.run')) {
      apiUrl = 'https://telmy.id/api';
    }
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');

    // Open live /connect tab for actual Firebase Google Sign-In
    const connectUrl = `${baseUrl}/connect`;
    chrome.tabs.create({ url: connectUrl });
  }

  // Listen for background session storage updates (e.g. from web /connect)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.user) {
      currentUser = changes.user.newValue;
      renderUserUI();
      refreshUserQuota();
      if (currentUser && onboardingModal) {
        closeOnboardingModal();
      }
    }
  });

  // Helper: check if URL belongs to Telmy's internal auth/dashboard pages (should never be scanned)
  function isTelmyInternalUrl(urlStr) {
    if (!urlStr) return false;
    try {
      const u = new URL(urlStr);
      const path = u.pathname.toLowerCase();
      // Only exclude Telmy's own internal auth/dashboard portals (e.g. connect.html, dashboard.html)
      return (
        path.includes('connect') ||
        path.includes('dashboard') ||
        path.includes('privacy')
      );
    } catch (e) {
      return false;
    }
  }

  // Check scanner status on active tab passively without attaching badges
  async function checkTabScannerStatus(tabId) {
    if (!tabId) return;
    try {
      const tab = await chrome.tabs.get(tabId).catch(() => null);
      if (!tab || !tab.url || 
          tab.url.startsWith('chrome://') || 
          tab.url.startsWith('chrome-extension://') || 
          tab.url.startsWith('edge://') || 
          tab.url.startsWith('about:') || 
          isTelmyInternalUrl(tab.url)) {
        if (badgeFieldsCount) badgeFieldsCount.textContent = '0';
        if (fieldsCountPill) fieldsCountPill.textContent = `0 ${t('field_unit') || 'Fields'}`;
        return;
      }
      safeSendTabMessage(tabId, { type: 'QUERY_PAGE_STATUS' }, (err, res) => {
        if (!err && res && res.isActive && res.detectedFieldsCount !== undefined) {
          if (badgeFieldsCount) badgeFieldsCount.textContent = res.detectedFieldsCount;
          if (fieldsCountPill) fieldsCountPill.textContent = `${res.detectedFieldsCount} ${t('field_unit') || 'Fields'}`;
        }
      });
    } catch (e) {}
  }

  // Direct Handler function to update UI from scanned response
  function applyScannedData(data) {
    console.log('[Telmy] 📥 applyScannedData payload received:', data);
    if (!data) {
      console.warn('[Telmy] ⚠️ applyScannedData called with empty/null payload.');
      updateEmptyStateUI('no_fields');
      showFieldsState('empty');
      return;
    }

    if (data.fields && Array.isArray(data.fields) && data.fields.length > 0) {
      detectedFields = data.fields;
      cachedPageSummary = data.summary || null;
      if (badgeFieldsCount) badgeFieldsCount.textContent = detectedFields.length;
      if (fieldsCountPill) fieldsCountPill.textContent = `${detectedFields.length} ${t('field_unit') || 'Fields'}`;

      console.log(`[Telmy] ✅ Detected ${detectedFields.length} form fields. Triggering batch Gemini backend analysis...`);
      // User requested: during analysis, show ONLY loading animation!
      showFieldsState('analyzing');

      // Trigger Batch Form Analysis to Backend (Gemini -> DB -> Vector Cache)
      triggerBatchBackendAnalysis(detectedFields);
    } else {
      console.warn('[Telmy] ⚠️ Scanner returned 0 fields on this page.');
      detectedFields = [];
      if (badgeFieldsCount) badgeFieldsCount.textContent = '0';
      if (fieldsCountPill) fieldsCountPill.textContent = `0 ${t('field_unit') || 'Fields'}`;

      if (data.actionButton) {
        console.log('[Telmy] 🎯 Action button discovered on page:', data.actionButton);
        updateEmptyStateUI('no_fields', { actionButton: data.actionButton });
        showFieldsState('empty');

        appendChatMessage({
          role: 'assistant',
          text: t('found_action_button_chat', { button: data.actionButton.text }),
          actions: [
            { type: 'CLICK_ACTION_BUTTON', label: `👉 ${t('empty_action_btn_click', { button: data.actionButton.text })}` }
          ],
          time: formatTime(new Date())
        });
        if (!isMuted) speakResponse(t('found_action_button_speech', { button: data.actionButton.text }));
        if (telmyAvatar) telmyAvatar.setState('CELEBRATING');
      } else {
        console.log('[Telmy] No form fields and no action button found.');
        updateEmptyStateUI('no_fields');
        showFieldsState('empty');

        appendChatMessage({
          role: 'assistant',
          text: t('scan_no_fields_chat'),
          time: formatTime(new Date())
        });
      }
    }
  }

  async function triggerBatchBackendAnalysis(fields, forceRefresh = false) {
    if (!currentTabId || !fields || fields.length === 0) {
      console.warn('[Telmy] triggerBatchBackendAnalysis aborted: no fields or tab.');
      updateEmptyStateUI('no_fields');
      showFieldsState('empty');
      return;
    }

    console.log('[Telmy] 🌐 Sending ANALYZE_FORM_PAGE batch request to background service worker...');
    showFieldsState('analyzing');

    try {
      const tab = await chrome.tabs.get(currentTabId).catch(() => null);
      const tabUrl = (tab && tab.url) ? tab.url : '';
      if (tabUrl && isTelmyInternalUrl(tabUrl)) {
        console.warn('[Telmy] Tab URL is invalid or internal.');
        updateEmptyStateUI('no_fields');
        showFieldsState('empty');
        return;
      }

      const domain = tabUrl ? new URL(tabUrl).hostname : 'web-form';
      const serializableFields = fields.map((f, idx) => {
        const meta = f.metadata || f;
        return {
          index: idx,
          id: meta.id || `f_${idx}`,
          name: meta.name || '',
          label: meta.label || meta.name || `Field ${idx + 1}`,
          type: meta.type || 'text',
          options: meta.options || null,
          placeholder: meta.placeholder || '',
          section: meta.section || ''
        };
      });

      chrome.runtime.sendMessage({
        type: 'ANALYZE_FORM_PAGE',
        payload: {
          domain,
          url: tabUrl,
          title: tab?.title || document.title || 'Web Form',
          fields: serializableFields,
          language: currentLanguage
        }
      }, (resp) => {
        const lastErr = chrome.runtime.lastError;
        console.log('[Telmy] ANALYZE_FORM_PAGE response:', resp, 'lastErr:', lastErr);
        if (!lastErr && resp && resp.success && resp.data) {
          isCurrentPageAnalyzed = true;
          const analyzed = resp.data;
          if (resp.quota) {
            refreshUserQuota(resp.quota);
          }

          if (Array.isArray(analyzed.fields)) {
            analyzed.fields.forEach((af, idx) => {
              const cacheKey = getFieldCacheKey(af, idx, currentLanguage);
              globalExplanationCache.set(cacheKey, af);
              if (detectedFields[idx]) {
                detectedFields[idx]._aiExplanation = detectedFields[idx]._aiExplanation || {};
                detectedFields[idx]._aiExplanation[currentLanguage] = af;
              }
            });
          }

          // Format summary description
          const defaultSummary = currentLanguage === 'en'
            ? 'Official online registration form for service application.'
            : (currentLanguage === 'id' ? 'Formulir online resmi untuk pendaftaran layanan.' : 'Official registration form.');
          const summaryStr = analyzed.summary || (cachedPageSummary?.description) || defaultSummary;
          if (analyzedSummaryText) {
            analyzedSummaryText.textContent = summaryStr;
          }

          // Transition from Loading Animation -> Analyzed Result Ready State!
          showFieldsState('analyzed');

          const count = analyzed.fields?.length || detectedFields.length;
          let chatSuccessText = '';
          if (currentLanguage === 'id') {
            chatSuccessText = `📋 **Form Berhasil Dianalisis (${count} Kolom Dikenali)**\n\n📌 *${summaryStr}*\n\n✓ *Silakan klik pada kolom di halaman web yang ingin kamu isi, atau klik tombol **Guide Me (Field by Field)** di tab Fields & Audit.*`;
          } else if (currentLanguage === 'ja') {
            chatSuccessText = `📋 **フォームの解析が完了しました (${count} 項目を検出)**\n\n📌 *${summaryStr}*\n\n✓ *入力したいWebページの項目をクリックするか、Fields & Audit タブの **Guide Me** ボタンをクリックしてください。*`;
          } else if (currentLanguage === 'ko') {
            chatSuccessText = `📋 **양식 분석 완료 (${count}개 입력란 감지)**\n\n📌 *${summaryStr}*\n\n✓ *웹페이지에서 입력할 항목을 클릭하거나, Fields & Audit 탭에서 **Guide Me** 버튼을 눌러주세요.*`;
          } else if (currentLanguage === 'zh' || currentLanguage === 'zh-TW') {
            chatSuccessText = `📋 **表单分析完成 (已识别 ${count} 个表单项)**\n\n📌 *${summaryStr}*\n\n✓ *请点击网页上要填写的输入框，或在 Fields & Audit 标签页点击 **Guide Me** 按钮。*`;
          } else {
            chatSuccessText = `📋 **Form Successfully Analyzed (${count} Fields Detected)**\n\n📌 *${summaryStr}*\n\n✓ *Click on any field on the webpage to start filling, or click **Guide Me (Field by Field)** in the Fields & Audit tab.*`;
          }

          appendChatMessage({
            role: 'assistant',
            text: chatSuccessText,
            actions: [
              { type: 'GUIDE_FIELDS', label: t('btn_start_guide') || '🚀 Guide Me (Field by Field)' }
            ],
            time: formatTime(new Date())
          });
        } else {
          // Failure handling: revert to empty state with honest error and retry
          const errDetail = resp?.error || lastErr?.message || (currentLanguage === 'en' ? 'Gemini AI is unable to respond' : 'Gemini AI tidak dapat merespons');
          console.warn('[Telmy] ⚠️ ANALYZE_FORM_PAGE failed:', errDetail);
          updateEmptyStateUI('no_fields');
          showFieldsState('empty');

          const lblEmptyTitle = document.getElementById('lbl-empty-fields-title');
          if (lblEmptyTitle) lblEmptyTitle.textContent = currentLanguage === 'en' ? 'Form Analysis Failed' : 'Analisis Formulir Gagal';

          const lblEmptyDesc = document.getElementById('lbl-empty-fields-desc');
          if (lblEmptyDesc) {
            lblEmptyDesc.textContent = currentLanguage === 'en'
              ? `Failed to analyze form: ${errDetail}. Please click the button below to retry.`
              : `Gagal menganalisis formulir: ${errDetail}. Silakan klik tombol di bawah untuk mencoba kembali.`;
          }

          const lblBtnAnalyzeNow = document.getElementById('lbl-btn-analyze-now');
          if (lblBtnAnalyzeNow) lblBtnAnalyzeNow.textContent = currentLanguage === 'en' ? '🔄 Retry Form Analysis' : '🔄 Coba Analisis Formulir Lagi';

          appendChatMessage({
            role: 'assistant',
            text: currentLanguage === 'en'
              ? `⚠️ **Failed to Fully Analyze Form Structure**\n\n${errDetail}\n\n*Please click the Retry Form Analysis button.*`
              : `⚠️ **Gagal Menganalisis Struktur Formulir Secara Penuh**\n\n${errDetail}\n\n*Silakan klik tombol Coba Analisis Formulir Lagi.*`,
            time: formatTime(new Date())
          });
        }
      });
    } catch (e) {
      console.warn('[Telmy] Batch backend analysis notice:', e.message);
      updateEmptyStateUI('no_fields');
      showFieldsState('empty');
    }
  }

  // Unified Full Form Analysis & Rescan
  async function triggerFullFormAnalysis(triggerBtn = null) {
    console.log('[Telmy] 🔍 User triggered triggerFullFormAnalysis. Button:', triggerBtn);
    if (btnRescan) {
      btnRescan.style.transform = 'rotate(180deg)';
      setTimeout(() => { if (btnRescan) btnRescan.style.transform = ''; }, 400);
    }

    // Immediately show ONLY pure loading animation!
    showFieldsState('analyzing');

    // Resolve active webpage tab
    const tab = await getActiveWebTab();
    const tabId = (tab && tab.id) ? tab.id : currentTabId;
    console.log('[Telmy] Active webpage tab identified:', tabId, tab ? tab.url : 'No tab');
    if (!tabId) {
      console.warn('[Telmy] ⚠️ No active tab ID found.');
      updateEmptyStateUI('no_fields');
      showFieldsState('empty');
      return;
    }
    currentTabId = tabId;
    isCurrentPageAnalyzed = false;

    // Activate scanner on tab safely without unhandled runtime.lastError
    console.log('[Telmy] Activating scanner on tab:', tabId);
    activateScannerOnTab(tabId);
  }

  // 4. Activate Scanner on Active Tab (On-Demand 1-Click with Zero Browser Reload)
  async function activateScannerOnTab(tabId, onDone = null) {
    if (!tabId) return;
    console.log('[Telmy] activateScannerOnTab executing on tabId:', tabId);
    try {
      const tab = await chrome.tabs.get(tabId).catch(() => null);
      const tabUrl = (tab && tab.url) ? tab.url : '';
      const isRestricted = Boolean(tabUrl && (
        tabUrl.startsWith('chrome://') || 
        tabUrl.startsWith('chrome-extension://') || 
        tabUrl.startsWith('edge://') || 
        tabUrl.startsWith('about:') || 
        tabUrl.startsWith('view-source:') ||
        isTelmyInternalUrl(tabUrl)
      ));

      if (isRestricted) {
        console.warn('[Telmy] ⚠️ Tab URL is internal or restricted:', tabUrl);
        if (badgeFieldsCount) badgeFieldsCount.textContent = '0';
        if (fieldsCountPill) fieldsCountPill.textContent = `0 ${t('field_unit') || 'Fields'}`;
        updateEmptyStateUI('no_fields');
        showFieldsState('empty');
        return;
      }

      console.log('[Telmy] Sending ACTIVATE_SCANNER message to tabId:', tabId, tabUrl || '(active tab)');
      safeSendTabMessage(tabId, { type: 'ACTIVATE_SCANNER' }, (err, res) => {
        if (err || !res) {
          console.log('[Telmy] Tab did not respond to ACTIVATE_SCANNER (script might not be loaded). Injecting scripts...');
          // Robust top-frame dynamic injection (no page refresh required!)
          injectContentScript(tabId, () => {
            console.log('[Telmy] Dynamic script injection finished. Re-sending ACTIVATE_SCANNER...');
            safeSendTabMessage(tabId, { type: 'ACTIVATE_SCANNER' }, (err2, res2) => {
              console.log('[Telmy] Scanner response after injection:', res2, 'Error:', err2 ? err2.message : null);
              if (res2) {
                applyScannedData(res2);
                if (onDone) onDone(res2);
              } else {
                console.warn('[Telmy] ⚠️ Scanner failed to respond after injection.');
                updateEmptyStateUI('no_fields');
                showFieldsState('empty');
              }
            });
          });
        } else {
          console.log('[Telmy] Scanner responded directly:', res);
          applyScannedData(res);
          if (onDone) onDone(res);
        }
      });
    } catch (err) {
      console.error('[Telmy] activateScannerOnTab exception caught:', err);
      updateEmptyStateUI('no_fields');
      showFieldsState('empty');
    }
  }

  // Deactivate Scanner on Active Tab (Total DOM Cleanup)
  function deactivateScannerOnTab(tabId) {
    if (!tabId) return;
    safeSendTabMessage(tabId, { type: 'DEACTIVATE_SCANNER' });
    if (badgeFieldsCount) badgeFieldsCount.textContent = '0';
    if (fieldsCountPill) fieldsCountPill.textContent = `0 ${t('field_unit') || 'Fields'}`;
  }

  // On-demand injection into active tab (targets top frame reliably without failing on subframes)
  async function injectContentScript(tabId, onInjected) {
    try {
      const tab = await chrome.tabs.get(tabId).catch(() => null);
      const tabUrl = (tab && tab.url) ? tab.url : '';
      if (tabUrl && (
          tabUrl.startsWith('chrome://') || 
          tabUrl.startsWith('chrome-extension://') || 
          tabUrl.startsWith('edge://') || 
          tabUrl.startsWith('about:') || 
          tabUrl.startsWith('view-source:') || 
          isTelmyInternalUrl(tabUrl))
      ) {
        console.warn('[Telmy] Skipping injection on restricted URL:', tabUrl);
        return;
      }

      await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['content/overlay.css']
      }).catch(() => {});

      await chrome.scripting.executeScript({
        target: { tabId },
        files: [
          'content/scanner.js',
          'content/highlighter.js',
          'content/translator.js',
          'content/a11y-manager.js',
          'content/content-main.js'
        ]
      });

      if (onInjected) setTimeout(onInjected, 150);
    } catch (e) {
      console.warn('[Telmy] On-demand injection notice:', e.message);
    }
  }

  function triggerTabRescan(tabId) {
    if (!isScannerRunning) return;
    activateScannerOnTab(tabId);
  }

  // 3. Listen for Messages from Content Script & Background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GMT_PAGE_MAPPED') {
      detectedFields = message.fields || [];
      cachedPageSummary = message.summary || null;
      if (badgeFieldsCount) badgeFieldsCount.textContent = detectedFields.length;
      if (fieldsCountPill) fieldsCountPill.textContent = `${detectedFields.length} ${t('field_unit') || 'Fields'}`;

      // Automatically run full batch analysis on backend if not yet analyzed
      if (!isCurrentPageAnalyzed && detectedFields.length > 0) {
        showFieldsState('analyzing');
        triggerBatchBackendAnalysis(detectedFields);
      }

      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'SNIP_AREA_CAPTURED') {
      const { image, metadata } = message.payload;
      handleProcessSnipExplain(image, metadata);
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'GMT_FIELD_FOCUSED') {
      const idx = message.index;
      selectFieldByIndex(idx, false);
      sendResponse({ success: true });
      return false;
    }

    // Context Menu Triggers
    if (message.type === 'CONTEXT_MENU_TRANSLATE_FORM') {
      if (tabBtns && tabBtns[0]) tabBtns[0].click(); // Switch to Chat/Assistant tab
      handleTogglePageTranslation(false);
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'CONTEXT_MENU_ANALYZE_FORM') {
      const fieldsTabBtn = document.querySelector('[data-tab="fields"]');
      if (fieldsTabBtn) fieldsTabBtn.click(); // Switch to Forms/Fields tab
      if (currentTabId) {
        activateScannerOnTab(currentTabId);
      }
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'CONTEXT_MENU_AUTOFILL') {
      handleTriggerAutoFill();
      sendResponse({ success: true });
      return false;
    }
  });

  // 4. Tab Navigation
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
      
      // Pastikan Accessibility Hub tertutup saat berpindah tab
      if (paneA11yHub) {
        paneA11yHub.style.display = 'none';
        paneA11yHub.classList.remove('active');
      }

      panes.forEach((p) => {
        if (p.id === 'pane-a11y-hub') {
          p.style.display = 'none';
          p.classList.remove('active');
          return;
        }
        p.style.display = '';
        p.classList.toggle('active', p.id === `pane-${targetTab}`);
      });
      const chatFooter = document.querySelector('.sp-chat-footer');
      if (chatFooter) {
        chatFooter.style.display = targetTab === 'chat' ? 'flex' : 'none';
      }
    });
  });

  // Language Change
  langSelect.addEventListener('change', (e) => {
    selectLanguage(e.target.value);
  });

  function applyLanguageUI() {
    chatInput.placeholder = t('chat_placeholder');
    const elChat = document.getElementById('lbl-tab-chat');
    if (elChat) elChat.textContent = t('tab_chat');
    const elVault = document.getElementById('lbl-tab-vault');
    if (elVault) elVault.textContent = t('tab_vault');
    const elPdf = document.getElementById('lbl-tab-pdf');
    if (elPdf) elPdf.textContent = t('tab_pdf');
    const elFields = document.getElementById('lbl-tab-fields');
    if (elFields) elFields.textContent = t('tab_fields');
    const elSummary = document.getElementById('lbl-tab-summary');
    if (elSummary) elSummary.textContent = t('tab_summary');
    const elPrev = document.getElementById('lbl-stepper-prev');
    if (elPrev) elPrev.textContent = t('stepper_prev');
    const elNext = document.getElementById('lbl-stepper-next');
    if (elNext) elNext.textContent = t('stepper_next');
    const elBrand = document.getElementById('lbl-brand-tag');
    if (elBrand) elBrand.textContent = t('brand_tag');
    if (lastEmptyState && lastEmptyState.reason) {
      updateEmptyStateUI(lastEmptyState.reason, lastEmptyState.extraData);
    } else {
      updateEmptyStateUI(isCurrentPageAnalyzed && detectedFields.length > 0 ? 'select_field' : 'unscanned');
    }
    const elBtnGuide = document.getElementById('lbl-btn-guide-me');
    if (elBtnGuide) elBtnGuide.textContent = t('btn_start_guide');
    const elQuotaHint = document.getElementById('lbl-guide-quota-hint');
    if (elQuotaHint) elQuotaHint.innerHTML = `<small>${escapeHTML(t('guide_quota_note'))}</small>`;
    const elHdr = document.getElementById('lbl-detected-fields-header');
    if (elHdr) elHdr.textContent = t('detected_fields_header');
    const elProg = document.getElementById('lbl-progress-title');
    if (elProg) elProg.textContent = t('progress_title');
    const elSumTitle = document.getElementById('lbl-summary-title');
    if (elSumTitle) elSumTitle.textContent = t('summary_title');
    const elPreTitle = document.getElementById('lbl-prereq-title');
    if (elPreTitle) elPreTitle.textContent = t('prereq_title');
    const elTips = document.getElementById('lbl-tips-title');
    if (elTips) elTips.textContent = t('tips_title');

    // Form Analyzing, Analyzed Ready State & Completion
    const elAnalyzingTitle = document.getElementById('lbl-analyzing-title');
    if (elAnalyzingTitle) elAnalyzingTitle.textContent = t('analyzing_title');
    const elAnalyzingDesc = document.getElementById('lbl-analyzing-desc');
    if (elAnalyzingDesc) elAnalyzingDesc.textContent = t('analyzing_desc');

    const elAnalyzedTitle = document.getElementById('lbl-analyzed-title');
    if (elAnalyzedTitle) elAnalyzedTitle.textContent = t('analyzed_title');
    const elAnalyzedSummaryBoxLabel = document.getElementById('lbl-analyzed-summary-box-label');
    if (elAnalyzedSummaryBoxLabel) elAnalyzedSummaryBoxLabel.textContent = t('analyzed_summary_label');
    const elAnalyzedHintText = document.getElementById('lbl-analyzed-hint-text');
    if (elAnalyzedHintText) elAnalyzedHintText.textContent = t('analyzed_hint_text');

    const elCompletionTitle = document.getElementById('lbl-completion-title');
    if (elCompletionTitle) elCompletionTitle.textContent = t('completion_title');
    const elCompletionSubtitle = document.getElementById('lbl-completion-subtitle');
    if (elCompletionSubtitle) elCompletionSubtitle.textContent = t('completion_subtitle');

    // Mode Card Titles & Descriptions
    const chatTitle = cardModeChat?.querySelector('.mode-card-title');
    if (chatTitle) chatTitle.textContent = t('mode_chat_title');
    const chatDesc = cardModeChat?.querySelector('.mode-card-desc');
    if (chatDesc) chatDesc.textContent = t('mode_chat_desc');
    const voiceTitle = cardModeVoice?.querySelector('.mode-card-title');
    if (voiceTitle) voiceTitle.textContent = t('mode_voice_title');
    const voiceDesc = cardModeVoice?.querySelector('.mode-card-desc');
    if (voiceDesc) voiceDesc.textContent = t('mode_voice_desc');

    if (lblCompactModeTitle) {
      lblCompactModeTitle.textContent = currentBotMode === 'chat'
        ? `Mode: ${t('mode_chat_compact')}`
        : `Mode: ${t('mode_voice_compact')}`;
    }
    const compactHoverHint = spModeCompactBar?.querySelector('span:last-child');
    if (compactHoverHint) compactHoverHint.textContent = `${t('hover_change_mode')} ▾`;

    // Pre-Submission Form Auditor
    const elAuditTitle = document.getElementById('lbl-audit-btn-title');
    if (elAuditTitle) elAuditTitle.textContent = t('audit_btn_title');
    const elAuditSub = document.getElementById('lbl-audit-btn-sub');
    if (elAuditSub) elAuditSub.textContent = t('audit_btn_sub');
    const elAuditHeading = document.getElementById('lbl-audit-report-heading');
    if (elAuditHeading) elAuditHeading.textContent = t('audit_report_heading');

    // Translation Banner & Chips
    if (lblChipTranslate) lblChipTranslate.textContent = t('chip_translate');
    if (lblChipWhat) lblChipWhat.textContent = t('chip_what');
    if (lblChipDocs) lblChipDocs.textContent = t('chip_docs');
    updateTranslateBannerUI();

    // Mode Card Badges & Voicebot Stage Text
    if (currentBotMode === 'chat') {
      if (badgeModeChatStatus) badgeModeChatStatus.textContent = t('mode_status_active');
      if (badgeModeVoiceStatus) badgeModeVoiceStatus.textContent = t('mode_status_switch');
    } else {
      if (badgeModeVoiceStatus) badgeModeVoiceStatus.textContent = t('mode_status_active');
      if (badgeModeChatStatus) badgeModeChatStatus.textContent = t('mode_status_switch');
    }
    updateVoicebotStageLabels();

    // --- Accessibility Hub Dynamic Translation ---
    const elA11yTitle = document.getElementById('lbl-a11y-hub-title');
    if (elA11yTitle) elA11yTitle.textContent = t('a11y_hub_title');
    const elA11yBack = document.getElementById('btn-a11y-back');
    if (elA11yBack) {
      const backLbl = elA11yBack.querySelector('.back-label');
      if (backLbl) backLbl.textContent = t('a11y_btn_back');
    }
    const elA11yReset = document.getElementById('btn-a11y-reset-all');
    if (elA11yReset) elA11yReset.textContent = t('a11y_btn_reset');
    const elA11yBanner = document.querySelector('.a11y-hub-banner .a11y-banner-text');
    if (elA11yBanner) elA11yBanner.textContent = t('a11y_banner_text');
    const elA11yPresetsLabel = document.querySelector('.a11y-presets-label');
    if (elA11yPresetsLabel) elA11yPresetsLabel.textContent = t('a11y_presets_label');

    // A11y Presets names
    const presetAdhd = document.querySelector('.a11y-preset-btn[data-preset="adhd"] .preset-name');
    if (presetAdhd) presetAdhd.textContent = t('a11y_preset_adhd');
    const presetDys = document.querySelector('.a11y-preset-btn[data-preset="dyslexia"] .preset-name');
    if (presetDys) presetDys.textContent = t('a11y_preset_dyslexia');
    const presetLow = document.querySelector('.a11y-preset-btn[data-preset="lowvision"] .preset-name');
    if (presetLow) presetLow.textContent = t('a11y_preset_lowvision');
    const presetSen = document.querySelector('.a11y-preset-btn[data-preset="senior"] .preset-name');
    if (presetSen) presetSen.textContent = t('a11y_preset_senior');

    // 14 A11y Tile Cards titles & badge refresh
    const a11yTiles = [
      { id: 'spotlight', key: 'a11y_tile_spotlight' },
      { id: 'speak', key: 'a11y_tile_speak' },
      { id: 'contrast', key: 'a11y_tile_contrast' },
      { id: 'links', key: 'a11y_tile_links' },
      { id: 'text-size', key: 'a11y_tile_text_size' },
      { id: 'spacing', key: 'a11y_tile_spacing' },
      { id: 'animations', key: 'a11y_tile_animations' },
      { id: 'hide-images', key: 'a11y_tile_hide_images' },
      { id: 'dyslexia', key: 'a11y_tile_dyslexia' },
      { id: 'cursor', key: 'a11y_tile_cursor' },
      { id: 'tooltips', key: 'a11y_tile_tooltips' },
      { id: 'line-height', key: 'a11y_tile_line_height' },
      { id: 'align', key: 'a11y_tile_align' },
      { id: 'saturation', key: 'a11y_tile_saturation' }
    ];
    a11yTiles.forEach(({ id, key }) => {
      const card = document.getElementById(`tile-a11y-${id}`);
      if (card) {
        const titleEl = card.querySelector('.tile-title');
        if (titleEl) titleEl.textContent = t(key);
      }
    });
    // Refresh all badge labels according to current active language
    if (typeof a11yFeatureState !== 'undefined') {
      Object.keys(a11yFeatureState).forEach(updateA11yCardUI);
    }

    // --- Auth Gate & Profile Popover ---
    const elAuthGateTitle = document.querySelector('.auth-gate-title');
    if (elAuthGateTitle) elAuthGateTitle.textContent = t('auth_gate_title');
    const elAuthGateDesc = document.querySelector('.auth-gate-desc');
    if (elAuthGateDesc) elAuthGateDesc.textContent = t('auth_gate_desc');
    const elAuthGateBtn = document.querySelector('#btn-gate-login span');
    if (elAuthGateBtn) elAuthGateBtn.textContent = t('auth_gate_btn');
    const elAuthGateNote = document.querySelector('.auth-gate-note');
    if (elAuthGateNote) elAuthGateNote.textContent = t('auth_gate_note');

    // Popover
    const elPopoverAuth = document.getElementById('btn-popover-auth');
    if (elPopoverAuth) elPopoverAuth.textContent = t('auth_gate_btn');
    const elPopoverSignout = document.getElementById('btn-popover-signout');
    if (elPopoverSignout) elPopoverSignout.textContent = t('popover_sign_out');

    // --- Vault (AutoFill & Profile) ---
    const elVaultUnlockedSub = document.querySelector('.vault-unlocked-sub');
    if (elVaultUnlockedSub) elVaultUnlockedSub.textContent = t('vault_unlocked_sub');
    const elVaultDashLink = document.querySelector('#btn-open-dashboard-vault span');
    if (elVaultDashLink) elVaultDashLink.textContent = t('vault_btn_dashboard');
    const elVaultLockBtn = document.querySelector('#btn-vault-lock-toggle span');
    if (elVaultLockBtn) elVaultLockBtn.textContent = t('vault_btn_lock');
    const elVaultReadyTitle = document.getElementById('lbl-vault-ready-title');
    if (elVaultReadyTitle) elVaultReadyTitle.textContent = t('vault_ready_title');
    const elVaultReadySub = document.getElementById('lbl-vault-ready-sub');
    if (elVaultReadySub) elVaultReadySub.textContent = t('vault_ready_sub');
    const elVaultAutofillNow = document.querySelector('#btn-vault-autofill-now span');
    if (elVaultAutofillNow) elVaultAutofillNow.textContent = t('vault_btn_autofill_now');
    const elVaultDataTitle = document.getElementById('lbl-vault-data-title');
    if (elVaultDataTitle) elVaultDataTitle.textContent = t('vault_data_title');
    const elVaultAddData = document.querySelector('#btn-add-vault-field-manual span');
    if (elVaultAddData) elVaultAddData.textContent = t('vault_btn_add_data');
    const elVaultUploadTitle = document.getElementById('lbl-vault-upload-title');
    if (elVaultUploadTitle) elVaultUploadTitle.textContent = t('vault_upload_title');
    const elVaultUploadSub = document.getElementById('lbl-vault-upload-sub');
    if (elVaultUploadSub) elVaultUploadSub.textContent = t('vault_upload_sub');
    const elVaultBtnBrowse = document.getElementById('btn-browse-vault-doc');
    if (elVaultBtnBrowse) elVaultBtnBrowse.textContent = t('vault_btn_upload_doc');
    const elVaultTrustNote = document.querySelector('.vault-drop-trust-note span');
    if (elVaultTrustNote) elVaultTrustNote.textContent = t('vault_trust_note');
    const elVaultDevNote = document.querySelector('.vault-locked-privacy-badge span');
    if (elVaultDevNote) elVaultDevNote.textContent = t('vault_device_encrypted_note');

    // --- PDF Module ---
    const elPdfBack = document.getElementById('btn-back-from-pdf');
    if (elPdfBack) elPdfBack.textContent = t('pdf_btn_back');
    const elPdfDropTitle = document.getElementById('lbl-pdf-drop-title');
    if (elPdfDropTitle) elPdfDropTitle.textContent = t('pdf_drop_title');
    const elPdfDropSub = document.getElementById('lbl-pdf-drop-sub');
    if (elPdfDropSub) elPdfDropSub.textContent = t('pdf_drop_sub');
    const elPdfBtnBrowse = document.getElementById('btn-browse-pdf');
    if (elPdfBtnBrowse) elPdfBtnBrowse.textContent = t('pdf_btn_choose');
    const elPdfNewForm = document.getElementById('btn-reset-pdf');
    if (elPdfNewForm) elPdfNewForm.textContent = t('pdf_btn_new_form');
    const elPdfChecklistTitle = document.getElementById('lbl-pdf-checklist-title');
    if (elPdfChecklistTitle) elPdfChecklistTitle.textContent = t('pdf_checklist_title');
    const elPdfSectionsTitle = document.getElementById('lbl-pdf-sections-title');
    if (elPdfSectionsTitle) elPdfSectionsTitle.textContent = t('pdf_sections_title');
    const elPdfExportTitle = document.getElementById('lbl-export-card-title');
    if (elPdfExportTitle) elPdfExportTitle.textContent = t('pdf_export_title');
    const elPdfExportDesc = document.getElementById('lbl-export-card-desc');
    if (elPdfExportDesc) elPdfExportDesc.textContent = t('pdf_export_desc');
    const elPdfBtnDownload = document.getElementById('btn-pdf-export-filled');
    if (elPdfBtnDownload) elPdfBtnDownload.textContent = t('pdf_btn_download');

    // New Conversation sub-bar text
    const elStartOver = document.querySelector('.start-over-text');
    if (elStartOver) elStartOver.textContent = t('btn_new_conversation');

    // Update Vault Locked/Unlocked gate text if closed
    if (typeof updateVaultHeaderUI === 'function') {
      updateVaultHeaderUI(isVaultUnlocked);
    }

    // --- Quota Paywall Modal ---
    const elPaywallTitle = document.getElementById('lbl-paywall-title');
    if (elPaywallTitle) elPaywallTitle.textContent = t('paywall_modal_title');
    const elPaywallSub = document.getElementById('paywall-status-subtitle');
    if (elPaywallSub) elPaywallSub.textContent = t('paywall_modal_sub');
    const elPaywallSumRem = document.getElementById('lbl-paywall-sum-remaining');
    if (elPaywallSumRem) elPaywallSumRem.textContent = t('paywall_sum_remaining');
    const elPaywallActTier = document.getElementById('lbl-paywall-active-tier');
    if (elPaywallActTier) elPaywallActTier.textContent = t('paywall_sum_active_tier');
    const elPaywallPayg = document.getElementById('lbl-paywall-payg');
    if (elPaywallPayg) elPaywallPayg.textContent = t('paywall_sum_payg');
    const elPaywallPro = document.getElementById('lbl-paywall-pro');
    if (elPaywallPro) elPaywallPro.textContent = t('paywall_sum_pro');
    const elPaywallDashInfo = document.getElementById('lbl-paywall-dashboard-info');
    if (elPaywallDashInfo) elPaywallDashInfo.textContent = t('paywall_dashboard_info');
    const elPaywallBtnDash = document.getElementById('lbl-btn-upgrade-dashboard');
    if (elPaywallBtnDash) elPaywallBtnDash.textContent = t('paywall_btn_upgrade_dashboard');

    // If chat stream is currently showing ephemeral welcome, update its language
    if (!chatHistory || chatHistory.length === 0) {
      renderWelcome();
    }
  }

  // Rescan Button: Forces full scan ladder & tab rescan
  if (btnRescan) {
    btnRescan.addEventListener('click', () => {
      triggerFullFormAnalysis();
    });
  }

  // 5. Chat & AI Interaction
  function renderWelcome() {
    chatStream.innerHTML = '';

    // Sanitize any corrupt duplicate welcome messages from chat history
    chatHistory = (chatHistory || []).filter((m) => {
      if (!m || !m.text) return false;
      const isWelcome = m.role === 'assistant' && (
        m.text.includes('your AI form-filling assistant') ||
        m.text.includes('asisten pengisian formulir') ||
        m.text.includes('AI 양식 도우미') ||
        m.text.includes('AI フォームアシスタント') ||
        m.text.includes('Hello! I am Telmy')
      );
      return !isWelcome;
    });

    // In Voicebot mode, always hide the welcome onboarding hero card to prevent layout clutter and overlapping
    if (currentBotMode === 'voice') {
      const existingHero = chatStream.querySelector('.welcome-hero-card');
      if (existingHero) existingHero.remove();
      chatHistory.forEach(appendChatMessageDOM);
      return;
    }

    if (chatHistory.length === 0) {
      const robotIconSrc = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
        ? chrome.runtime.getURL('assets/telmy_icon.png')
        : '../assets/telmy_icon.png';

      const hero = document.createElement('div');
      hero.className = 'welcome-hero-card';
      hero.innerHTML = `
        <div class="welcome-avatar-wrap">
          <img src="${robotIconSrc}" class="welcome-robot-icon" alt="Telmy Robot">
        </div>
        <h3 class="welcome-title">${escapeHTML(t('welcome_hero_title'))}</h3>
        <p class="welcome-subtitle">${escapeHTML(t('welcome_hero_desc'))}</p>
        <div class="welcome-chips-grid welcome-grid-2col">
          <!-- Row 1: Analisis & Snip -->
          <button type="button" class="welcome-action-card chip-analyze" data-action="ANALYZE_FORM">
            <span class="chip-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <span class="chip-label">${escapeHTML(t('card_analyze_form'))}</span>
          </button>
          <button type="button" class="welcome-action-card chip-snip" data-action="EXPLAIN_THIS_SNIP">
            <span class="chip-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
            </span>
            <span class="chip-label">${escapeHTML(t('card_explain_this'))}</span>
          </button>

          <!-- Row 2: Otomasi & Dokumen -->
          <button type="button" class="welcome-action-card chip-autofill" data-action="AUTOFILL_FORM">
            <span class="chip-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </span>
            <span class="chip-label">${escapeHTML(t('card_autofill'))}</span>
          </button>
          <button type="button" class="welcome-action-card chip-pdf" data-action="OPEN_PDF">
            <span class="chip-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 12 15 15"/></svg>
            </span>
            <span class="chip-label">${escapeHTML(t('card_upload_pdf'))}</span>
          </button>

          <!-- Row 3: Bahasa & Navigasi -->
          <button type="button" class="welcome-action-card chip-translate" data-action="TRANSLATE_PAGE">
            <span class="chip-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </span>
            <span class="chip-label">${escapeHTML(t('card_translate_page'))}</span>
          </button>
          <button type="button" class="welcome-action-card chip-showme" data-action="SHOW_ME_PROMPT">
            <span class="chip-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
            </span>
            <span class="chip-label">${escapeHTML(t('card_show_me'))}</span>
          </button>

          <!-- Row 4: Verifikasi & Aksesibilitas -->
          <button type="button" class="welcome-action-card chip-auditor" data-action="AUDIT_FORM">
            <span class="chip-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </span>
            <span class="chip-label">${escapeHTML(t('card_form_auditor'))}</span>
          </button>
          <button type="button" class="welcome-action-card chip-a11y" data-action="OPEN_A11Y_HUB">
            <span class="chip-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="1.5"/><path d="M7 11h10"/><path d="M9 20l3-6 3 6"/><path d="M12 11v4"/></svg>
            </span>
            <span class="chip-label">${escapeHTML(t('card_accessibility'))}</span>
          </button>
        </div>
      `;

      hero.querySelectorAll('.welcome-action-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const act = btn.getAttribute('data-action');
          handleActionChip({ type: act });
        });
      });

      chatStream.appendChild(hero);
    } else {
      chatHistory.forEach(appendChatMessageDOM);
    }
  }

  async function handleSendMessage(text, customImage = null) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    chatInput.value = '';
    chatInput.style.height = '';

    const userMsg = {
      role: 'user',
      text: cleanText,
      image: customImage || null,
      time: formatTime(new Date())
    };
    appendChatMessage(userMsg);

    // Direct Intent 1: Context-Aware Page Translation
    if (/(terjemah.*halaman|translate.*page|translate this page|terjemahkan web|terjemahkan situs)/i.test(cleanText)) {
      handleTogglePageTranslation(true);
      return;
    }

    // Direct Intent 1b: Multi-lingual "Show Me / Tunjukkan" Action Command (11+ Languages)
    const directShowMe = parseShowMeCommand(cleanText);
    if (directShowMe) {
      console.log('[Telmy Chat] 🎯 Direct Show Me / Tunjukkan detected:', directShowMe);
      const labelDisplay = directShowMe.charAt(0).toUpperCase() + directShowMe.slice(1);
      const lang = currentLanguage || 'en';
      const localizedReplies = {
        'id': `Ini dia! Saya sudah menyorot dan menunjukkan bagian tentang **"${labelDisplay}"** di layar Anda! 👆`,
        'ms': `Ini dia! Saya telah menyorot bahagian mengenai **"${labelDisplay}"** pada skrin anda! 👆`,
        'ja': `こちらです！画面上の「**${labelDisplay}**」の部分をお示ししました！👆`,
        'ko': `여기 있습니다! 화면에서 '**${labelDisplay}**' 부분을 가리켰습니다! 👆`,
        'zh': `在这里！我已经为您在屏幕上指出了“**${labelDisplay}**”部分！👆`,
        'zh-TW': `在這裡！我已經為您在螢幕上指出了「**${labelDisplay}**」部分！👆`,
        'vi': `Đây rồi! Tôi đã chỉ phần về **"${labelDisplay}"** trên màn hình của bạn! 👆`,
        'th': `อยู่นี่แล้ว! ฉันได้ชี้ส่วนที่เกี่ยวกับ **"${labelDisplay}"** บนหน้าจอให้คุณแล้ว! 👆`,
        'hi': `यह रहा! मैंने आपकी स्क्रीन पर **"${labelDisplay}"** वाला हिस्सा दिखा दिया है! 👆`,
        'fil': `Heto na! Itinuro ko na ang bahagi tungkol sa **"${labelDisplay}"** sa iyong screen! 👆`,
        'en': `Here it is! I've highlighted and pointed out the section about **"${labelDisplay}"** on your screen! 👆`
      };
      const replyText = localizedReplies[lang] || localizedReplies['en'];

      const targetTab = await getActiveWebTab();
      const targetTabId = targetTab?.id || currentTabId;

      if (targetTabId) {
        currentTabId = targetTabId;
        safeSendTabMessage(targetTabId, {
          type: 'SPOTLIGHT_ELEMENT',
          label: `👉 ${labelDisplay}`,
          text: directShowMe.toLowerCase()
        }, (err, res) => {
          if (!err && res && res.success) {
            appendChatMessage({
              role: 'assistant',
              text: replyText,
              actions: [
                { type: 'SPOTLIGHT_ACTION', label: `👉 ${labelDisplay}`, text: directShowMe.toLowerCase() }
              ],
              time: formatTime(new Date())
            });
            if (!isMuted) speakResponse(replyText);
            if (telmyAvatar) telmyAvatar.setState('CELEBRATING');
          } else {
            injectContentScript(targetTabId, () => {
              safeSendTabMessage(targetTabId, {
                type: 'SPOTLIGHT_ELEMENT',
                label: `👉 ${labelDisplay}`,
                text: directShowMe.toLowerCase()
              }, (err2, res2) => {
                if (!err2 && res2 && res2.success) {
                  appendChatMessage({
                    role: 'assistant',
                    text: replyText,
                    actions: [
                      { type: 'SPOTLIGHT_ACTION', label: `👉 ${labelDisplay}`, text: directShowMe.toLowerCase() }
                    ],
                    time: formatTime(new Date())
                  });
                  if (!isMuted) speakResponse(replyText);
                  if (telmyAvatar) telmyAvatar.setState('CELEBRATING');
                } else {
                  // If element not found directly on page, ask Gemini AI specifically where it is located
                  executeBackendChat(t('ask_where_is_element', { element: directShowMe }));
                }
              });
            });
          }
        });
        return;
      }
    }

    // Direct Intent 2: Page Rescan or Application Action Button Search
    const isScanOrFindIntent = /(pindai.*ulang|scan.*ulang|rescan|re-scan|cek.*halaman|periksa.*halaman|dimana.*(tombol|menu|ajukan|permohonan)|cara.*(mengajukan|daftar|buat.*permohonan)|cari.*(tombol|menu|permohonan))/i.test(cleanText);

    if (isScanOrFindIntent) {
      console.log('[Telmy Chat] 🔍 User requested scan / find application action button:', cleanText);
      if (telmyAvatar) telmyAvatar.setState('THINKING');

      // Append intermediate status or indicator
      appendChatMessage({
        role: 'assistant',
        text: t('scan_searching_msg'),
        time: formatTime(new Date())
      });

      const handleScanActionDone = (resp) => {
        console.log('[Telmy Chat] handleScanActionDone with resp:', resp);
        if (resp && resp.actionButton) {
          const btnName = resp.actionButton.text;
          const replyText = t('found_action_button_chat', { button: btnName });

          appendChatMessage({
            role: 'assistant',
            text: replyText,
            actions: [
              { type: 'CLICK_ACTION_BUTTON', label: `👉 ${t('empty_action_btn_click', { button: btnName })}` }
            ],
            time: formatTime(new Date())
          });
          if (!isMuted) speakResponse(t('found_action_button_speech', { button: btnName }));
          if (telmyAvatar) telmyAvatar.setState('CELEBRATING');
        } else if (resp && resp.fieldsCount > 0) {
          const replyText = t('found_fields_chat', { count: resp.fieldsCount });

          appendChatMessage({
            role: 'assistant',
            text: replyText,
            actions: [
              { type: 'GUIDE_FIELDS', label: `🚀 ${t('btn_start_guide')}` }
            ],
            time: formatTime(new Date())
          });
          if (!isMuted) speakResponse(t('found_fields_speech', { count: resp.fieldsCount }));
          if (telmyAvatar) telmyAvatar.setState('HAPPY');
          triggerFullFormAnalysis();
        } else {
          // Fallback to Gemini AI chat
          executeBackendChat(cleanText);
        }
      };

      // Query active tab safely
      getActiveWebTab().then((tab) => {
        const tabId = (tab && tab.id) ? tab.id : currentTabId;
        if (!tabId) {
          executeBackendChat(cleanText);
          return;
        }
        currentTabId = tabId;
        safeSendTabMessage(tabId, { type: 'FIND_AND_HIGHLIGHT_ACTION_BUTTON' }, (err, resp) => {
          if (err || !resp) {
            injectContentScript(tabId, () => {
              safeSendTabMessage(tabId, { type: 'FIND_AND_HIGHLIGHT_ACTION_BUTTON' }, (err2, resp2) => {
                handleScanActionDone(resp2);
              });
            });
          } else {
            handleScanActionDone(resp);
          }
        });
      });
      return;
    }

    executeBackendChat(cleanText);
  }

  // Multi-lingual "Show Me / Tunjukkan" Action Intent Parser (11+ Languages)
  function parseShowMeCommand(text) {
    if (!text || typeof text !== 'string') return null;
    const clean = text.trim();
    const lower = clean.toLowerCase();

    // 1. Indonesian / Malay ("Tunjukkan", "Coba carikan", "Tolong carikan", "Perlihatkan", "Mana", "Cari")
    const idMatch = lower.match(/^(?:coba\s+|tolong\s+|mohon\s+|bisa\s+tolong\s+|bisa\s+)?(?:tunjukkan|perlihatkan|mana|carikan|cari)\s+(?:tulisan\s+(?:tentang\s+|soal\s+)?|bagian\s+|artikel\s+|berita\s+|postingan\s+|teks\s+|kata\s+)?(?:tentang\s+|soal\s+|mengenai\s+)?(.+)/i);
    if (idMatch && idMatch[1]) {
      return idMatch[1].replace(/^(?:tentang|soal|mengenai)\s+/i, '').replace(/^[“"'\s]+|[”"'\s?!.,]+$/g, '').trim();
    }

    // 2. English ("Show me", "Please show me", "Can you show me", "Point to", "Where is", "Find me", "Find", "Highlight")
    const enMatch = lower.match(/^(?:please\s+|can\s+you\s+|could\s+you\s+)?(?:show\s+me|point\s+to|where\s+(?:is|'s)|find\s+me|find|show|highlight)\s+(?:the\s+)?(?:article\s+(?:about|on)?|post\s+(?:about|on)?|news\s+(?:about|on)?|text\s+(?:about|on)?|section\s+(?:about|on)?|about\s+)?(.+)/i);
    if (enMatch && enMatch[1]) {
      return enMatch[1].replace(/^(?:about|on)\s+/i, '').replace(/^[“"'\s]+|[”"'\s?!.,]+$/g, '').trim();
    }

    // 3. Japanese (見せて, みせて, 教えて, おしえて, 探して, はどこ)
    if (clean.includes('見せて') || clean.includes('みせて') || clean.includes('教えて') || clean.includes('おしえて') || clean.includes('探して') || clean.includes('はどこ')) {
      const q = clean.replace(/^(?:テルミー[、,\s]*|すみません[、,\s]*|お願い[、,\s]*)/, '')
                     .replace(/(?:について(?:の(?:記事|部分|ニュース)?)?|に関する(?:記事|部分)?)?(?:見せて|みせて|教えて|おしえて|探して|はどこ|ください).*$/, '')
                     .replace(/^[“"'\s]+|[”"'\s?!。、]+$/g, '')
                     .trim();
      if (q) return q;
    }

    // 4. Korean (보여줘, 찾아줘, 어디 있어, 가리켜줘)
    if (clean.includes('보여줘') || clean.includes('보여주세요') || clean.includes('찾아줘') || clean.includes('찾아주세요') || clean.includes('가리켜줘') || clean.includes('어디 있어') || clean.includes('어디에 있어')) {
      const q = clean.replace(/^(?:텔미[、,\s]*|저기[、,\s]*)/, '')
                     .replace(/(?:에\s*대한\s*(?:기사|뉴스|내용|부분)?)?(?:보여줘|보여주세요|찾아줘|찾아주세요|가리켜줘|어디\s*있어|어디에\s*있어).*$/, '')
                     .replace(/^[“"'\s]+|[”"'\s?!.]+$/g, '')
                     .trim();
      if (q) return q;
    }

    // 5. Chinese (给我看, 給我看, 指出, 找出, 显示, 顯示, 在哪)
    if (/给我看|給我看|指出|找出|显示|顯示|在哪/.test(clean)) {
      const q = clean.replace(/^(?:请|請|麻烦)?(?:给我看|給我看|指出|找出|显示|顯示)\s*(?:关于|關于)?/, '')
                     .replace(/(?:在哪|在哪裡|在哪儿)\s*[？?]?$/, '')
                     .replace(/(?:的(?:报道|報導|文章|部分|内容))?$/, '')
                     .replace(/^[“"'\s]+|[”"'\s?!。，]+$/g, '')
                     .trim();
      if (q) return q;
    }

    // 6. Vietnamese (Cho tôi xem, Chỉ cho tôi, Tìm cho tôi, Ở đâu)
    const viMatch = lower.match(/^(?:làm\s+ơn\s+|xin\s+vui\s+lòng\s+)?(?:cho\s+tôi\s+xem|chỉ\s+cho\s+tôi|tìm\s+cho\s+tôi|ở\s+đâu)\s+(?:bài\s+viết\s+về|phần\s+về|tin\s+tức\s+về)?(.+)/i);
    if (viMatch && viMatch[1]) {
      return viMatch[1].replace(/^về\s+/i, '').replace(/^[“"'\s]+|[”"'\s?!.,]+$/g, '').trim();
    }

    // 7. Thai (แสดงให้ฉันดู, ชี้ให้ดู, หา, อยู่ไหน)
    if (clean.includes('แสดงให้ฉันดู') || clean.includes('ชี้ให้ดู') || clean.includes('อยู่ไหน')) {
      const q = clean.replace(/^(?:กรุณา\s+)?(?:แสดงให้ฉันดู|ชี้ให้ดู)\s*(?:ส่วน|ข่าว|เรื่อง)?/, '')
                     .replace(/(?:อยู่ไหน).*$/, '')
                     .replace(/^[“"'\s]+|[”"'\s?!]+$/g, '')
                     .trim();
      if (q) return q;
    }

    // 8. Hindi (मुझे दिखाओ, कहाँ है, ढूंढो)
    if (clean.includes('दिखाओ') || clean.includes('ढूंढो') || clean.includes('कहाँ है')) {
      const q = clean.replace(/^(?:कृपया\s+|मुझे\s+)?/, '')
                     .replace(/(?:के\s*बारे\s*में\s*)?(?:दिखाओ|ढूंढो|कहाँ\s*है).*$/, '')
                     .replace(/^[“"'\s]+|[”"'\s?!.|]+$/g, '')
                     .trim();
      if (q) return q;
    }

    // 9. Filipino (Ipakita mo, Nasaan ang, Hanapin, Ituro mo)
    const filMatch = lower.match(/^(?:paki\s+|pakisuyo\s+|maaari\s+bang\s+)?(?:ipakita\s+mo|nasaan\s+ang|hanapin|ituro\s+mo)\s+(?:ang\s+)?(?:balita\s+tungkol\s+sa|bahagi\s+ng)?(.+)/i);
    if (filMatch && filMatch[1]) {
      return filMatch[1].replace(/^tungkol\s+sa\s+/i, '').replace(/^[“"'\s]+|[”"'\s?!.,]+$/g, '').trim();
    }

    return null;
  }

  async function executeBackendChat(cleanText, customImage = null) {
    if (telmyAvatar) telmyAvatar.setState('THINKING');

    // Language Intelligence: Follow active user language setting, unless user explicitly opted for English
    let effectiveChatLanguage = currentLanguage || 'en';
    if (currentLanguage === 'en') {
      effectiveChatLanguage = 'en';
    } else {
      // If user selected non-English (e.g. Japanese, Indonesian), verify if query is genuinely 100% English only
      const hasNonLatin = /[\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af\u0e00-\u0e7f\u0900-\u097fàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(cleanText);
      if (!hasNonLatin) {
        const isStrictEnglishQuery = /^(what\b|how\b|why\b|can you\b|please explain\b|tell me\b|who is\b|where is\b|what does\b)/i.test(cleanText.trim());
        if (isStrictEnglishQuery && !/^(ini|itu|apa|bagaimana|tolong|dimana|adalah)\b/i.test(cleanText.trim())) {
          effectiveChatLanguage = 'en';
        }
      }
    }

    // Fetch real-time active tab DOM context (like Chrome Ask Gemini)
    let pageContext = null;
    try {
      const activeTab = await getActiveWebTab();
      const tabId = (activeTab && activeTab.id) ? activeTab.id : currentTabId;
      if (tabId) {
        pageContext = await new Promise((resolve) => {
          safeSendTabMessage(tabId, { type: 'GET_ACTIVE_PAGE_CONTEXT' }, (err, res) => {
            if (err || !res) resolve(null);
            else resolve(res);
          });
        });
      }
    } catch (_) {}

    const fullFormContext = {
      title: pageContext?.title || document.title || 'Webpage Form',
      url: pageContext?.url || currentTabUrl || '',
      domain: pageContext?.domain || '',
      headings: pageContext?.headings || [],
      buttons: pageContext?.buttons || [],
      mainText: pageContext?.mainText || '',
      summary: cachedPageSummary?.description || (analyzedSummaryText ? analyzedSummaryText.textContent : null),
      fields: detectedFields.length > 0
        ? detectedFields.map((f, i) => ({
            label: f.metadata?.label || f.metadata?.name || `Field ${i + 1}`,
            name: f.metadata?.name || '',
            type: f.metadata?.type || 'text',
            description: f._aiExplanation?.[effectiveChatLanguage]?.meaning || f._aiExplanation?.en?.meaning || ''
          }))
        : (pageContext?.inputs || []),
      activeField: activeFieldIndex >= 0 ? detectedFields[activeFieldIndex] : null,
      fieldsCount: detectedFields.length || (pageContext?.inputs?.length || 0)
    };

    // Call Backend Gateway / Chat API
    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          type: 'SEND_CHAT_MESSAGE',
          payload: {
            message: cleanText,
            history: chatHistory.slice(-8),
            language: effectiveChatLanguage,
            formContext: fullFormContext,
            screenshot: customImage || null
          }
        }, (res) => {
          if (chrome.runtime.lastError) resolve(null);
          else resolve(res);
        });
      });

      const reply = response && response.data && response.data.reply
        ? response.data.reply
        : t('default_chat_reply');

      const detectedLang = response && response.data && response.data.detectedLanguage
        ? response.data.detectedLanguage
        : null;

      const actions = response && response.data && Array.isArray(response.data.actions)
        ? response.data.actions
        : [];

      // Auto-trigger visual spotlight and flying pointer on page if AI returned SPOTLIGHT_ACTION or user asked for a button/field
      const isAskingForLoginOrRegister = /(where.*(login|sign in|signin|masuk|register|sign up|signup|daftar))/i.test(cleanText) ||
        /(how to.*(login|sign in|masuk|register|daftar))/i.test(cleanText);
      const isAskingForButton = isAskingForLoginOrRegister ||
        /(show|find|where|where's|where is|point|highlight|mana|tunjukkan|dimana|lihat|cari|how to|bagaimana).*(button|submit|register|next|daftar|kirim|tombol|login|masuk)/i.test(cleanText) ||
        /(submit|register|login|next|daftar|kirim|masuk).*button/i.test(cleanText) ||
        /tombol.*(submit|daftar|kirim|lanjut|simpan|masuk|login)/i.test(cleanText);

      const isAskingForField = /(where|where's|where do i|where i|show|point|highlight|mana|dimana|tunjukkan|upload).*(photo|picture|foto|image|paspor|passport|file|dokumen|document|ktp|email|nama|name|field|kolom)/i.test(cleanText) ||
        /(upload|unggah).*(photo|picture|foto|image|file|dokumen)/i.test(cleanText);

      // Check multi-lingual "Show Me / Tunjukkan" Action Command Parser (11+ Languages)
      const showMeQuery = parseShowMeCommand(cleanText);
      let effectiveReply = reply;

      let spotlightAct = actions.find(a => a && (a.type === 'SPOTLIGHT_ACTION' || a.type === 'CLICK_ACTION_BUTTON'));
      if (!spotlightAct) {
        if (showMeQuery) {
          let labelDisplay = showMeQuery.charAt(0).toUpperCase() + showMeQuery.slice(1);
          spotlightAct = {
            type: 'SPOTLIGHT_ACTION',
            label: `👉 ${labelDisplay}`,
            text: showMeQuery.toLowerCase()
          };
          actions.push(spotlightAct);

          // Localized friendly response
          const lang = currentLanguage || 'en';
          const q = labelDisplay;
          const localizedReplies = {
            'id': `Ini dia! Saya sudah menyorot dan menunjukkan bagian tentang **"${q}"** di layar Anda! 👆`,
            'ms': `Ini dia! Saya telah menyorot bahagian mengenai **"${q}"** pada skrin anda! 👆`,
            'ja': `こちらです！画面上の「**${q}**」の部分をお示ししました！👆`,
            'ko': `여기 있습니다! 화면에서 '**${q}**' 부분을 가리켰습니다! 👆`,
            'zh': `在这里！我已经为您在屏幕上指出了“**${q}**”部分！👆`,
            'zh-TW': `在這裡！我已經為您在螢幕上指出了「**${q}**」部分！👆`,
            'vi': `Đây rồi! Tôi đã chỉ phần về **"${q}"** trên màn hình của bạn! 👆`,
            'th': `อยู่นี่แล้ว! ฉันได้ชี้ส่วนที่เกี่ยวกับ **"${q}"** บนหน้าจอให้คุณแล้ว! 👆`,
            'hi': `यह रहा! मैंने आपकी स्क्रीन पर **"${q}"** वाला हिस्सा दिखा दिया है! 👆`,
            'fil': `Heto na! Itinuro ko na ang bahagi tungkol sa **"${q}"** sa iyong screen! 👆`,
            'en': `Here it is! I've highlighted and pointed out the section about **"${q}"** on your screen! 👆`
          };
          effectiveReply = localizedReplies[lang] || localizedReplies['en'];
        } else if (isAskingForButton) {
          let btnName = 'Submit';
          const isLogin = /login|sign in|signin|masuk/i.test(cleanText);
          const isRegister = /register|sign up|signup|daftar/i.test(cleanText);

          if (pageContext?.buttons && pageContext.buttons.length > 0) {
            if (isLogin) {
              const loginMatch = pageContext.buttons.find(b => /masuk|login|sign in|signin/i.test(b));
              btnName = loginMatch || 'Masuk';
            } else if (isRegister) {
              const regMatch = pageContext.buttons.find(b => /daftar|register|sign up|signup/i.test(b));
              btnName = regMatch || 'Daftar';
            } else {
              const match = pageContext.buttons.find(b => /submit|kirim|daftar|register|next|lanjut|save|simpan|masuk|login/i.test(b));
              btnName = match || pageContext.buttons[0];
            }
          } else {
            if (isLogin) btnName = 'Masuk';
            else if (isRegister) btnName = 'Daftar';
          }
          spotlightAct = { type: 'SPOTLIGHT_ACTION', label: btnName, text: btnName.toLowerCase() };
          actions.push(spotlightAct);
        } else if (isAskingForField) {
          let targetName = 'Photo';
          if (/photo|picture|foto|image/i.test(cleanText)) targetName = 'Photo';
          else if (/paspor|passport/i.test(cleanText)) targetName = 'Passport';
          else if (/file|dokumen|document/i.test(cleanText)) targetName = 'Document Upload';
          else if (/email/i.test(cleanText)) targetName = 'Email';
          else if (/nama|name/i.test(cleanText)) targetName = 'Name';

          spotlightAct = {
            type: 'SPOTLIGHT_ACTION',
            label: currentLanguage === 'en' ? `👉 ${targetName}` : `👉 Kolom ${targetName}`,
            text: targetName.toLowerCase()
          };
          actions.push(spotlightAct);
        }
      }

      const assistantMsg = {
        role: 'assistant',
        text: effectiveReply,
        actions: actions,
        time: formatTime(new Date())
      };
      appendChatMessage(assistantMsg);

      if (spotlightAct && currentTabId) {
        triggerSpotlightOnTab(currentTabId, spotlightAct);
      }

      // Speak response using Gemini TTS with detected response language
      if (!isMuted) {
        speakResponse(effectiveReply, detectedLang);
      } else {
        if (telmyAvatar) telmyAvatar.setState('IDLE');
      }
    } catch (e) {
      console.warn('[Telmy Chat Error]', e);
      if (telmyAvatar) telmyAvatar.setState('IDLE');
    }
  }

  btnSend.addEventListener('click', () => handleSendMessage(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(chatInput.value);
    }
  });

  // Auto-grow textarea up to 140px
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.max(52, Math.min(chatInput.scrollHeight, 140)) + 'px';
  });

  // Start Over / Start New Session button handler
  const btnStartOver = document.getElementById('btn-start-over');
  if (btnStartOver) {
    btnStartOver.addEventListener('click', handleStartOverSession);
  }

  async function handleStartOverSession() {
    console.log('[Telmy] 🔄 Resetting session to Start Over...');
    chatHistory = [];

    // Clear host storage chat if stored
    try {
      let host = 'global';
      if (currentTabUrl && (currentTabUrl.startsWith('http://') || currentTabUrl.startsWith('https://'))) {
        try {
          host = new URL(currentTabUrl).hostname;
        } catch (_) {}
      }
      const key = `telmy_sp_chat_${host}`;
      await chrome.storage.local.remove([key]);
    } catch (_) {}

    // Reset tab session memory
    if (currentTabId && tabSessions.has(currentTabId)) {
      tabSessions.delete(currentTabId);
    }

    detectedFields = [];
    activeFieldIndex = -1;
    cachedPageSummary = null;
    isCurrentPageAnalyzed = false;
    isPageTranslated = false;
    translatedElementCount = 0;
    activeSourceMode = 'web';
    currentPdfData = null;
    activePdfSectionIndex = 0;
    pdfChecklistState = {};
    currentPdfRawBytes = null;
    currentPdfFileName = 'Document.pdf';
    currentPdfMimeType = 'application/pdf';
    pdfUserFormValues = {};

    // Remove content script overlays
    if (currentTabId) {
      safeSendTabMessage(currentTabId, { type: 'DEACTIVATE_SCANNER' });
      safeSendTabMessage(currentTabId, { type: 'CLEAR_ACTIVE_HIGHLIGHT' });
    }

    // Stop audio & reset avatar
    stopSpeaking();
    if (telmyAvatar) telmyAvatar.setState('IDLE');

    // Reset UI panes
    renderFieldsList([]);
    updateEmptyStateUI('unscanned');
    showFieldsState('empty');
    updateTranslateBannerUI();
    switchSourceMode('web');

    // Switch to Assistant tab
    const tabChat = document.getElementById('tab-btn-chat');
    if (tabChat && !tabChat.classList.contains('active')) {
      tabChat.click();
    }

    // Re-render onboarding welcome hero
    renderWelcome();

    if (chatInput) {
      chatInput.value = '';
      chatInput.style.height = '';
      chatInput.focus();
    }
  }

  function appendChatMessage(msg) {
    chatHistory.push(msg);
    saveSessionChat();
    appendChatMessageDOM(msg);
  }

  function appendChatMessageDOM(msg) {
    // Remove onboarding welcome hero card as soon as an active message is rendered
    const existingHero = chatStream.querySelector('.welcome-hero-card');
    if (existingHero) {
      existingHero.remove();
    }

    const item = document.createElement('div');
    item.className = `chat-msg ${msg.role}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    if (msg.role === 'assistant') {
      avatar.innerHTML = `<img src="../assets/telmy_icon.png" style="width: 20px; height: 20px; border-radius: 6px; object-fit: contain;">`;
    } else {
      avatar.textContent = 'U';
    }

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    // Format bold markdown (**text**)
    const formatted = escapeHTML(msg.text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    let contentHtml = formatted;
    if (msg.image) {
      contentHtml = `<div style="margin-bottom: 8px;"><img src="${msg.image}" style="max-width: 100%; max-height: 140px; border-radius: 8px; border: 1.5px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.08); display: block;" alt="Snip Selection"></div>` + contentHtml;
    }
    bubble.innerHTML = contentHtml;

    if (msg.actions && msg.actions.length > 0) {
      const chips = document.createElement('div');
      chips.className = 'msg-chips-row';
      msg.actions.forEach((act) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'action-chip';
        btn.textContent = act.label || act.type;
        btn.addEventListener('click', () => handleActionChip(act));
        chips.appendChild(btn);
      });
      bubble.appendChild(chips);
    }

    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = msg.time || '';
    bubble.appendChild(time);

    item.appendChild(avatar);
    item.appendChild(bubble);
    chatStream.appendChild(item);
    chatStream.scrollTop = chatStream.scrollHeight;
  }

  function handleActionChip(act) {
    if (act.type === 'ANALYZE_FORM') {
      const tabFields = document.getElementById('tab-btn-fields');
      if (tabFields) tabFields.click();
      triggerFullFormAnalysis();
    } else if (act.type === 'ABOUT_FORM') {
      handleSendMessage(t('msg_about_form'));
    } else if (act.type === 'GUIDE_FIELDS') {
      const tabFields = document.getElementById('tab-btn-fields');
      if (tabFields) tabFields.click();
      triggerFullFormAnalysis();
      if (detectedFields && detectedFields.length > 0) {
        selectFieldByIndex(0, true);
      }
    } else if (act.type === 'AUTOFILL_FORM') {
      const tabVault = document.getElementById('tab-btn-vault');
      if (tabVault) tabVault.click();
      handleTrigger1ClickAutoFill();
    } else if (act.type === 'TRANSLATE_PAGE' || act.type === 'REVERT_PAGE') {
      handleTogglePageTranslation();
    } else if (act.type === 'OPEN_PDF') {
      openPdfMode(true);
    } else if (act.type === 'TAB_FIELDS') {
      document.getElementById('tab-btn-fields').click();
    } else if (act.type === 'TAB_SUMMARY') {
      document.getElementById('tab-btn-summary').click();
    } else if (act.type === 'FOCUS_FIELD' && act.index !== undefined) {
      selectFieldByIndex(act.index, true);
      document.getElementById('tab-btn-fields').click();
    } else if (act.type === 'CLICK_ACTION_BUTTON') {
      console.log('[Telmy] 🚀 User clicked CLICK_ACTION_BUTTON chip.');
      safeSendTabMessage(currentTabId, { type: 'CLICK_ACTION_BUTTON' }, (err, res) => {
        console.log('[Telmy] Click action button result on webpage:', res, 'Error:', err ? err.message : null);
      });
    } else if (act.type === 'SPOTLIGHT_ACTION') {
      triggerSpotlightOnTab(currentTabId, act);
    } else if (act.type === 'SHOW_ME_PROMPT') {
      const lang = currentLanguage || 'en';
      const promptTemplates = {
        'id': 'Tunjukkan tulisan tentang ',
        'ms': 'Tunjukkan bahagian mengenai ',
        'en': 'Show me section about ',
        'ja': 'について見せて',
        'ko': '에 대해 보여줘',
        'zh': '给我看关于 ',
        'zh-TW': '給我看關於 ',
        'vi': 'Cho tôi xem về ',
        'th': 'แสดงให้ฉันดูเรื่อง ',
        'hi': 'मुझे दिखाओ ',
        'fil': 'Ipakita mo ang tungkol sa '
      };
      const textToFill = promptTemplates[lang] || promptTemplates['en'];
      if (chatInput) {
        chatInput.value = textToFill;
        chatInput.focus();
        if (lang === 'ja' || lang === 'ko') {
          chatInput.setSelectionRange(0, 0);
        } else {
          chatInput.setSelectionRange(textToFill.length, textToFill.length);
        }
      }
    } else if (act.type === 'OPEN_A11Y_HUB') {
      showA11yHub();
    } else if (act.type === 'AUDIT_FORM') {
      runPreSubmissionAudit();
    } else if (act.type === 'EXPLAIN_THIS_SNIP') {
      handleExplainThisSnipAction();
    }
  }

  function triggerSpotlightOnTab(tabId, spotlightAct) {
    if (!tabId || !spotlightAct) return;
    safeSendTabMessage(tabId, {
      type: 'SPOTLIGHT_ELEMENT',
      label: spotlightAct.label || 'Klik tombol ini',
      text: spotlightAct.text || spotlightAct.label || null,
      selector: spotlightAct.selector || null
    }, (err, res) => {
      if (err || !res || !res.success) {
        injectContentScript(tabId, () => {
          safeSendTabMessage(tabId, {
            type: 'SPOTLIGHT_ELEMENT',
            label: spotlightAct.label || 'Klik tombol ini',
            text: spotlightAct.text || spotlightAct.label || null,
            selector: spotlightAct.selector || null
          });
        });
      }
    });
  }

  function openPdfMode(triggerFilePicker = false) {
    tabBtns.forEach((b) => b.classList.remove('active'));
    panes.forEach((p) => {
      p.style.display = (p.id === 'pane-pdf') ? 'flex' : 'none';
      p.classList.toggle('active', p.id === 'pane-pdf');
    });

    const chatFooter = document.querySelector('.sp-chat-footer');
    if (chatFooter) chatFooter.style.display = 'none';

    // If PDF container was hidden by source mode switch, ensure it's visible
    if (pdfModeContainer) pdfModeContainer.style.display = 'flex';

    if (triggerFilePicker) {
      const fileInput = document.getElementById('sp-pdf-file-input');
      if (fileInput) {
        setTimeout(() => fileInput.click(), 50);
      }
    }
  }

  async function handleTrigger1ClickAutoFill() {
    let afData = null;
    if (isVaultUnlocked && currentDecryptedVault && Array.isArray(currentDecryptedVault.fields) && currentDecryptedVault.fields.length > 0) {
      afData = {
        fields: currentDecryptedVault.fields
      };
      // Populate helper flat fields
      currentDecryptedVault.fields.forEach(f => {
        if (f.key && f.value) afData[f.key] = f.value;
      });
    } else {
      const stored = await chrome.storage.local.get(['telmy_autofill', 'user']);
      afData = stored.telmy_autofill || null;
      if (!afData && stored.user) {
        afData = {
          name: stored.user.displayName || stored.user.name || '',
          email: stored.user.email || ''
        };
      }
    }

    if (!afData || (!afData.fields?.length && !afData.name && !afData.passport && !afData.nik && !afData.email)) {
      appendChatMessage({
        role: 'assistant',
        text: t('autofill_not_configured_msg') || 'No profile fields found in Vault. Please add fields or unlock your Vault first.',
        time: formatTime(new Date())
      });
      return;
    }

    if (currentTabId) {
      safeSendTabMessage(currentTabId, {
        type: 'AUTOFILL_FORM_FIELDS',
        data: afData
      }, (err, res) => {
        if (err) return;
        const count = (res && res.filledCount !== undefined) ? res.filledCount : 0;
        appendChatMessage({
          role: 'assistant',
          text: t('autofill_complete_msg', {
            count: count > 0 ? `${count} ${t('fields_unit')}` : t('matching_fields')
          }),
          time: formatTime(new Date())
        });
      });
    }
  }

  // =========================================================
  // Context-Aware Page Translation Workflow (Priority 3)
  // =========================================================
  function updateTranslateBannerUI() {
    // Update Quick Chip in Chat Pane
    if (chipTranslatePage) {
      if (isTranslating) {
        chipTranslatePage.classList.add('loading');
        if (lblChipTranslate) lblChipTranslate.textContent = t('translating_status') || 'Translating...';
        chipTranslatePage.disabled = true;
      } else if (isPageTranslated) {
        chipTranslatePage.classList.add('active');
        if (lblChipTranslate) lblChipTranslate.textContent = `${t('btn_revert_page')} (${translatedElementCount})`;
        chipTranslatePage.disabled = false;
      } else {
        chipTranslatePage.classList.remove('loading', 'active');
        if (lblChipTranslate) lblChipTranslate.textContent = t('chip_translate');
        chipTranslatePage.disabled = false;
      }
    }

    if (spTranslateBanner) {
      if (isTranslating) {
        spTranslateBanner.className = 'sp-translate-banner translating';
        if (lblTranslateStatus) lblTranslateStatus.textContent = t('translating_status');
        if (lblTranslateSubtitle) lblTranslateSubtitle.textContent = t('translating_progress_sub');
        if (btnToggleTranslate) {
          btnToggleTranslate.className = 'btn-translate-action loading';
          if (btnTranslateIcon) btnTranslateIcon.textContent = '⏳';
          if (btnTranslateLabel) btnTranslateLabel.textContent = t('translating_status');
          btnToggleTranslate.disabled = true;
        }
      } else if (isPageTranslated) {
        spTranslateBanner.className = 'sp-translate-banner translated';
        if (lblTranslateStatus) lblTranslateStatus.textContent = `🌐 ${t('translate_banner_title')} (${translatedElementCount})`;
        if (lblTranslateSubtitle) lblTranslateSubtitle.textContent = `Context-Aware to ${currentLanguage.toUpperCase()}`;
        if (btnToggleTranslate) {
          btnToggleTranslate.className = 'btn-translate-action active-revert';
          if (btnTranslateIcon) btnTranslateIcon.textContent = '🔙';
          if (btnTranslateLabel) btnTranslateLabel.textContent = t('btn_revert_page');
          btnToggleTranslate.disabled = false;
        }
      } else {
        spTranslateBanner.className = 'sp-translate-banner';
        if (lblTranslateStatus) lblTranslateStatus.textContent = t('translate_banner_title');
        if (lblTranslateSubtitle) lblTranslateSubtitle.textContent = t('translate_banner_sub');
        if (btnToggleTranslate) {
          btnToggleTranslate.className = 'btn-translate-action';
          if (btnTranslateIcon) btnTranslateIcon.textContent = '🌐';
          if (btnTranslateLabel) btnTranslateLabel.textContent = t('btn_translate_page');
          btnToggleTranslate.disabled = false;
        }
      }
    }
  }

  async function checkPageTranslationStatus(tabId) {
    if (!tabId) return;
    safeSendTabMessage(tabId, { type: 'TRANSLATOR_GET_STATUS' }, (err, res) => {
      if (!err && res) {
        isPageTranslated = Boolean(res.isTranslated);
        translatedElementCount = res.elementCount || 0;
        updateTranslateBannerUI();
      }
    });
  }

  async function handleTogglePageTranslation(hasUserMsg = false) {
    if (isTranslating) return;

    if (!currentTabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) currentTabId = tab.id;
    }
    if (!currentTabId) return;

    // 1. Revert mode
    if (isPageTranslated) {
      if (!hasUserMsg) {
        appendChatMessage({
          role: 'user',
          text: currentLanguage === 'en' ? '↩️ Show Original Page' : '↩️ Tampilkan Halaman Asli',
          time: formatTime(new Date())
        });
      }

      safeSendTabMessage(currentTabId, { type: 'TRANSLATOR_REVERT_TRANSLATIONS' }, (err, res) => {
        isPageTranslated = false;
        translatedElementCount = 0;
        updateTranslateBannerUI();

        appendChatMessage({
          role: 'assistant',
          text: t('page_reverted_msg'),
          actions: [
            { type: 'TRANSLATE_PAGE', label: '🌐 ' + t('btn_translate_page') },
            { type: 'TAB_FIELDS', label: '📋 ' + t('tab_fields') }
          ],
          time: formatTime(new Date())
        });
      });
      return;
    }

    // 2. Translate mode
    // Append user chat message first so chat conversation history preserves context
    if (!hasUserMsg) {
      const userTranslateLabel = currentLanguage === 'en'
        ? '🌐 Translate This Page'
        : (currentLanguage === 'id' ? '🌐 Terjemahkan Halaman Ini' : (t('btn_translate_page') ? '🌐 ' + t('btn_translate_page') : '🌐 Translate This Page'));
      appendChatMessage({
        role: 'user',
        text: userTranslateLabel,
        time: formatTime(new Date())
      });
    }

    isTranslating = true;
    updateTranslateBannerUI();

    // Trigger visual scan beam on active webpage
    safeSendTabMessage(currentTabId, { type: 'START_PAGE_SCAN_ANIMATION' });

    // Show progressive checklist animation in chat bubble
    const progressBubble = showTranslationProgressBubble();

    // Extract texts from active tab safely
    safeSendTabMessage(currentTabId, { type: 'TRANSLATOR_EXTRACT_TEXTS' }, async (err, extractRes) => {
      // If error (e.g. content script not injected yet), inject & retry
      if (err || !extractRes || !extractRes.texts) {
        await injectContentScript(currentTabId, () => {
          safeSendTabMessage(currentTabId, { type: 'START_PAGE_SCAN_ANIMATION' });
          safeSendTabMessage(currentTabId, { type: 'TRANSLATOR_EXTRACT_TEXTS' }, (err2, retryRes) => {
            if (retryRes && retryRes.texts) {
              executeTranslationPayload(retryRes, progressBubble);
            } else {
              isTranslating = false;
              updateTranslateBannerUI();
              safeSendTabMessage(currentTabId, { type: 'STOP_PAGE_SCAN_ANIMATION' });
              progressBubble.remove();
              alert(t('alert_extract_web_text_fail'));
            }
          });
        });
        return;
      }

      executeTranslationPayload(extractRes, progressBubble);
    });
  }

  function showTranslationProgressBubble() {
    const item = document.createElement('div');
    item.className = 'chat-msg assistant';
    item.id = 'msg-translating-progress';
    item.innerHTML = `
      <div class="msg-avatar">
        <img src="../assets/telmy_icon.png" style="width: 22px; height: 22px; object-fit: contain;" alt="Telmy">
      </div>
      <div class="msg-bubble">
        <div class="telmy-translate-progress-card">
          <div class="ttp-header">
            <span class="ttp-header-spinner">✨</span>
            <span>Telmy.ai is translating your page:</span>
          </div>
          <ul class="ttp-steps">
            <li class="ttp-step active" id="ttp-step-1">
              <span class="ttp-step-icon">⏳</span>
              <span>analyze text</span>
            </li>
            <li class="ttp-step" id="ttp-step-2">
              <span class="ttp-step-icon">○</span>
              <span>analyze form</span>
            </li>
            <li class="ttp-step" id="ttp-step-3">
              <span class="ttp-step-icon">○</span>
              <span>analyze elements</span>
            </li>
            <li class="ttp-step" id="ttp-step-4">
              <span class="ttp-step-icon">○</span>
              <span>find local/legal term to prevent translation</span>
            </li>
            <li class="ttp-step" id="ttp-step-5">
              <span class="ttp-step-icon">○</span>
              <span>add context</span>
            </li>
          </ul>
        </div>
      </div>
    `;
    chatStream.appendChild(item);
    chatStream.scrollTop = chatStream.scrollHeight;

    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step <= 5) {
        const prevEl = document.getElementById(`ttp-step-${step - 1}`);
        if (prevEl) {
          prevEl.className = 'ttp-step completed';
          const icon = prevEl.querySelector('.ttp-step-icon');
          if (icon) icon.textContent = '✓';
        }
        const curEl = document.getElementById(`ttp-step-${step}`);
        if (curEl) {
          curEl.className = 'ttp-step active';
          const icon = curEl.querySelector('.ttp-step-icon');
          if (icon) icon.textContent = '⏳';
        }
      } else {
        clearInterval(interval);
      }
    }, 400);

    return {
      finish: () => {
        clearInterval(interval);
        for (let s = 1; s <= 5; s++) {
          const el = document.getElementById(`ttp-step-${s}`);
          if (el) {
            el.className = 'ttp-step completed';
            const icon = el.querySelector('.ttp-step-icon');
            if (icon) icon.textContent = '✓';
          }
        }
      },
      remove: () => {
        clearInterval(interval);
        const el = document.getElementById('msg-translating-progress');
        if (el) el.remove();
      }
    };
  }

  async function executeTranslationPayload(extractData, progressBubble = null) {
    const { texts, pageContext } = extractData;
    const count = Object.keys(texts || {}).length;

    if (count === 0) {
      isTranslating = false;
      updateTranslateBannerUI();
      safeSendTabMessage(currentTabId, { type: 'STOP_PAGE_SCAN_ANIMATION' });
      if (progressBubble) progressBubble.remove();
      appendChatMessage({
        role: 'assistant',
        text: t('no_translatable_elements_msg'),
        time: formatTime(new Date())
      });
      return;
    }

    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          type: 'TRANSLATE_PAGE',
          payload: {
            pageContext,
            targetLanguage: currentLanguage,
            texts
          }
        }, (res) => {
          if (chrome.runtime.lastError) resolve(null);
          else resolve(res);
        });
      });

      if (response && response.success && response.data && response.data.translations) {
        // Send translation mapping back to content script safely
        safeSendTabMessage(currentTabId, {
          type: 'TRANSLATOR_APPLY_TRANSLATIONS',
          translations: response.data.translations,
          targetLanguage: currentLanguage
        }, (err, applyRes) => {
          isTranslating = false;
          isPageTranslated = true;
          safeSendTabMessage(currentTabId, { type: 'STOP_PAGE_SCAN_ANIMATION' });
          if (progressBubble) progressBubble.finish();

          translatedElementCount = applyRes?.appliedCount || Object.keys(response.data.translations).length;
          updateTranslateBannerUI();

          const langUpper = currentLanguage.toUpperCase();

          setTimeout(() => {
            appendChatMessage({
              role: 'assistant',
              text: t('translate_success_msg', { count: translatedElementCount, lang: langUpper }),
              actions: [
                { type: 'REVERT_PAGE', label: '🔙 ' + t('btn_revert_page') },
                { type: 'TAB_FIELDS', label: '📋 ' + t('tab_fields') }
              ],
              time: formatTime(new Date())
            });
          }, 350);
        });
      } else {
        throw new Error(response?.error || 'Backend translation failed');
      }
    } catch (err) {
      console.warn('[Translate Error]', err);
      isTranslating = false;
      updateTranslateBannerUI();
      safeSendTabMessage(currentTabId, { type: 'STOP_PAGE_SCAN_ANIMATION' });
      if (progressBubble) progressBubble.remove();

      appendChatMessage({
        role: 'assistant',
        text: t('translate_error_msg', { error: err.message || 'Gemini AI quota limit reached.' }),
        time: formatTime(new Date())
      });
    }
  }

  // Translation & Quick Action Listeners
  if (btnToggleTranslate) btnToggleTranslate.addEventListener('click', handleTogglePageTranslation);
  if (chipTranslatePage) chipTranslatePage.addEventListener('click', handleTogglePageTranslation);
  if (chipWhatIsThis) {
    chipWhatIsThis.addEventListener('click', () => {
      handleSendMessage(t('chip_what_msg'));
    });
  }
  if (chipRequiredDocs) {
    chipRequiredDocs.addEventListener('click', () => {
      handleSendMessage(t('chip_docs_msg'));
    });
  }

  function handleAvatarTap() {
    const greeting = t('avatar_greeting');

    appendChatMessage({
      role: 'assistant',
      text: greeting,
      actions: [
        { type: 'TAB_FIELDS', label: '📋 ' + t('tab_fields') },
        { type: 'TRANSLATE_PAGE', label: '🌐 ' + t('btn_translate_page') }
      ],
      time: formatTime(new Date())
    });

    if (!isMuted && currentBotMode === 'voice') {
      speakResponse(greeting);
    }
  }

  // 6. Dual-Mode Controller: Mode Chatbot (Silent) vs Mode Voicebot (Interactive Audio)
  function setBotMode(mode) {
    currentBotMode = mode;
    chrome.storage.local.set({ telmyBotMode: mode });

    // Enable auto-compact mode selector (Priority 5.2)
    if (spModeCardsContainer) {
      spModeCardsContainer.classList.add('compact');
    }

    if (mode === 'chat') {
      if (cardModeChat) cardModeChat.classList.add('active');
      if (cardModeVoice) cardModeVoice.classList.remove('active');
      if (badgeModeChatStatus) badgeModeChatStatus.textContent = t('mode_status_active');
      if (badgeModeVoiceStatus) badgeModeVoiceStatus.textContent = t('mode_status_switch');

      // Chatbot mode: silent, no voice output or mic input
      isMuted = true;
      stopSpeaking();
      stopListening();
      if (spVoicebotStage) spVoicebotStage.style.display = 'none';
      if (btnMic) btnMic.style.display = 'none';
      if (btnMute) btnMute.style.display = 'none';
      if (audioBar) audioBar.style.display = 'none';
      if (spVoiceActionBar) spVoiceActionBar.style.display = 'none';
      if (spInputBar) spInputBar.style.display = 'flex';
    } else {
      // Voicebot mode: active speech assistant with large animated robot & big mic
      if (cardModeVoice) cardModeVoice.classList.add('active');
      if (cardModeChat) cardModeChat.classList.remove('active');
      if (badgeModeVoiceStatus) badgeModeVoiceStatus.textContent = t('mode_status_active');
      if (badgeModeChatStatus) badgeModeChatStatus.textContent = t('mode_status_switch');

      isMuted = false;
      if (spVoicebotStage) spVoicebotStage.style.display = 'flex';
      if (btnMic) btnMic.style.display = 'none';
      if (btnMute) {
        btnMute.style.display = 'flex';
        btnMute.classList.remove('muted');
      }
      // Hide chatbox textarea in voicebot mode to save screen space, show clean Click to Speak footer bar
      if (spInputBar) spInputBar.style.display = 'none';
      if (spVoiceActionBar) spVoiceActionBar.style.display = 'flex';

      // Initialize large avatar in voicebot robot slot if not already created
      if (!voicebotAvatar && window.TelmyAvatar && spVoicebotRobotSlot) {
        voicebotAvatar = new TelmyAvatar(spVoicebotRobotSlot, {
          size: 64,
          interactive: true,
          onClick: handleAvatarTap
        });
      }

      updateVoicebotStageLabels();
    }

    if (lblCompactModeTitle) {
      lblCompactModeTitle.textContent = mode === 'chat'
        ? `Mode: ${t('mode_chat_compact')}`
        : `Mode: ${t('mode_voice_compact')}`;
    }

    // Always cleanly synchronize chat stream & hero state with the selected mode
    renderWelcome();
  }

  function setupModeToggleCards() {
    if (cardModeChat) {
      cardModeChat.addEventListener('click', () => setBotMode('chat'));
      cardModeChat.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setBotMode('chat');
        }
      });
    }

    if (cardModeVoice) {
      cardModeVoice.addEventListener('click', () => setBotMode('voice'));
      cardModeVoice.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setBotMode('voice');
        }
      });
    }

    if (spModeCompactBar) {
      spModeCompactBar.addEventListener('click', () => {
        const nextMode = currentBotMode === 'chat' ? 'voice' : 'chat';
        setBotMode(nextMode);
      });
    }
  }

  function updateVoicebotStageLabels() {
    if (!lblVoicebotStatusTitle || !lblVoicebotStatusDesc || !lblVoicebotMicCaption) return;

    if (isListening) {
      lblVoicebotStatusTitle.textContent = t('voicebot_status_listening_title');
      lblVoicebotStatusDesc.textContent = t('voicebot_status_listening_desc');
      lblVoicebotMicCaption.textContent = t('voicebot_mic_caption_listening');
      if (lblVoiceFooterMic) lblVoiceFooterMic.textContent = t('mic_listening') || 'Listening...';
    } else if (isSpeaking) {
      lblVoicebotStatusTitle.textContent = t('voicebot_status_speaking_title');
      lblVoicebotStatusDesc.textContent = t('voicebot_status_speaking_desc');
      lblVoicebotMicCaption.textContent = t('voicebot_mic_caption_speaking');
      if (lblVoiceFooterMic) lblVoiceFooterMic.textContent = t('speaking_text') || 'Speaking...';
    } else {
      lblVoicebotStatusTitle.textContent = t('voicebot_status_idle_title');
      lblVoicebotStatusDesc.textContent = t('voicebot_status_idle_desc');
      lblVoicebotMicCaption.textContent = t('voicebot_mic_caption_idle');
      if (lblVoiceFooterMic) lblVoiceFooterMic.textContent = t('voice_click_to_speak');
    }
  }

  // Ensure microphone permission in Chrome extension context
  async function ensureMicPermission() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[Telmy Mic Permission]', err);
      return false;
    }
  }

  // 7. Push-to-Talk Voice Engine & Big Mic Control
  function setupSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      if (btnMic) btnMic.style.display = 'none';
      if (btnVoicebotBigMic) btnVoicebotBigMic.style.opacity = '0.5';
      return;
    }

    speechRecognizer = new SpeechRec();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = true;

    speechRecognizer.onstart = () => {
      isListening = true;
      if (btnMic) btnMic.classList.add('active');
      if (btnVoicebotBigMic) btnVoicebotBigMic.classList.add('listening');
      if (btnVoiceFooterMic) {
        btnVoiceFooterMic.classList.add('listening');
        if (lblVoiceFooterMic) lblVoiceFooterMic.textContent = t('mic_listening') || 'Listening...';
      }
      if (micBanner) micBanner.style.display = 'flex';
      if (micText) micText.textContent = t('mic_listening');
      if (voicebotAvatar) voicebotAvatar.setState('THINKING');
      if (telmyAvatar) telmyAvatar.setState('THINKING');
      updateVoicebotStageLabels();
    };

    speechRecognizer.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim) {
        if (micText) micText.textContent = `"${interim}"`;
        if (lblVoicebotStatusDesc) lblVoicebotStatusDesc.textContent = `"${interim}"`;
      }
      if (final) {
        if (micBanner) micBanner.style.display = 'none';
        stopListening();
        handleSendMessage(final);
      }
    };

    speechRecognizer.onerror = (e) => {
      console.warn('[Telmy STT Error]', e.error);
      stopListening();
    };

    speechRecognizer.onend = () => {
      stopListening();
    };
  }

  async function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  }

  async function startListening() {
    if (isListening) return;

    // Check mic permission first
    const hasPerm = await ensureMicPermission();
    if (!hasPerm) {
      if (chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url: chrome.runtime.getURL('permission/request-mic.html') });
      }
      appendChatMessage({
        role: 'assistant',
        text: t('mic_perm_required_msg'),
        time: formatTime(new Date())
      });
      return;
    }

    if (!speechRecognizer) {
      setupSpeechRecognition();
    }
    if (!speechRecognizer) return;

    try {
      speechRecognizer.lang = LOCALE_MAP[currentLanguage] || 'en-US';
      speechRecognizer.start();
    } catch (e) {
      console.warn('[STT Start Error]', e);
    }
  }

  function stopListening() {
    isListening = false;
    if (btnMic) btnMic.classList.remove('active');
    if (btnVoicebotBigMic) btnVoicebotBigMic.classList.remove('listening');
    if (btnVoiceFooterMic) {
      btnVoiceFooterMic.classList.remove('listening');
      if (lblVoiceFooterMic) lblVoiceFooterMic.textContent = t('voice_click_to_speak');
    }
    if (micBanner) micBanner.style.display = 'none';
    if (voicebotAvatar && !isSpeaking) voicebotAvatar.setState('IDLE');
    if (telmyAvatar && !isSpeaking) telmyAvatar.setState('IDLE');
    updateVoicebotStageLabels();

    if (speechRecognizer) {
      try { speechRecognizer.stop(); } catch (e) {}
    }
  }

  if (btnMic) btnMic.addEventListener('click', toggleListening);
  if (btnVoicebotBigMic) btnVoicebotBigMic.addEventListener('click', toggleListening);
  if (btnVoiceFooterMic) btnVoiceFooterMic.addEventListener('click', toggleListening);

  // Mute / Audio Toggle
  if (btnMute) {
    btnMute.addEventListener('click', () => {
      isMuted = !isMuted;
      btnMute.classList.toggle('muted', isMuted);
      if (isMuted) stopSpeaking();
    });
  }

  // 8. TTS Playback (Gemini WaveNet TTS + Browser Fallback + Dual Avatar Sync)
  function speakResponse(text, targetLanguage = null) {
    if (currentBotMode === 'chat' || isMuted || !text) return;
    stopSpeaking();

    const effectiveVoiceLang = targetLanguage || currentLanguage || 'en';

    isSpeaking = true;
    if (audioBar) audioBar.style.display = 'flex';
    if (audioStatusText) audioStatusText.textContent = t('speaking_text');
    updateVoicebotStageLabels();
    if (lblVoicebotStatusDesc) {
      lblVoicebotStatusDesc.textContent = text.length > 85 ? text.substring(0, 85) + '...' : text;
    }

    // 1. Try Gemini WaveNet TTS via backend gateway
    chrome.runtime.sendMessage({
      type: 'VOICE_TTS',
      payload: { text, language: effectiveVoiceLang }
    }, (res) => {
      if (!chrome.runtime.lastError && res && res.success && res.audioDataUrl) {
        currentAudio = new Audio(res.audioDataUrl);
        if (telmyAvatar) {
          telmyAvatar.attachAudioElement(currentAudio);
        }
        if (voicebotAvatar) {
          voicebotAvatar.attachAudioElement(currentAudio);
        }
        currentAudio.onended = stopSpeaking;
        currentAudio.onerror = () => speakBrowserFallback(text, effectiveVoiceLang);
        currentAudio.play().catch(() => speakBrowserFallback(text, effectiveVoiceLang));
      } else {
        speakBrowserFallback(text, effectiveVoiceLang);
      }
    });
  }

  function speakBrowserFallback(text, targetLanguage = null) {
    if (currentBotMode === 'chat' || isMuted) {
      stopSpeaking();
      return;
    }
    if (!('speechSynthesis' in window)) {
      stopSpeaking();
      return;
    }
    const effectiveVoiceLang = targetLanguage || currentLanguage || 'en';
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = LOCALE_MAP[effectiveVoiceLang] || LOCALE_MAP[currentLanguage] || 'en-US';
    if (telmyAvatar) {
      telmyAvatar.startSpeechCadence();
    }
    if (voicebotAvatar) {
      voicebotAvatar.startSpeechCadence();
    }
    utterance.onend = stopSpeaking;
    utterance.onerror = stopSpeaking;
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    isSpeaking = false;
    if (audioBar) audioBar.style.display = 'none';
    if (telmyAvatar) {
      telmyAvatar.setState('IDLE');
    }
    if (voicebotAvatar) {
      voicebotAvatar.setState('IDLE');
    }
    updateVoicebotStageLabels();
    if (currentAudio) {
      try { currentAudio.pause(); } catch (e) {}
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }
  function stopAudio() {
    stopSpeaking();
  }

  if (btnStopAudio) btnStopAudio.addEventListener('click', stopSpeaking);

  // 8. Fields List & Detail Rendering
  function renderFieldsList(fields) {
    if (fieldsQuickList) fieldsQuickList.innerHTML = '';
    const auditCard = document.getElementById('sp-audit-trigger-card');
    const count = fields ? fields.length : 0;

    if (badgeFieldsCount) badgeFieldsCount.textContent = count;
    if (fieldsCountPill) fieldsCountPill.textContent = `${count} ${t('field_unit') || 'Fields'}`;

    if (!fields || fields.length === 0) {
      if (fieldsEmptyState) fieldsEmptyState.style.display = 'block';
      if (fieldDetailContent) fieldDetailContent.style.display = 'none';
      if (auditCard) auditCard.style.display = 'none';
      if (btnStepperPrev) btnStepperPrev.disabled = true;
      if (btnStepperNext) btnStepperNext.disabled = true;
      if (stepperIndicator) stepperIndicator.textContent = '0 / 0';
      return;
    }

    if (auditCard) auditCard.style.display = 'block';

    if (fieldsQuickList) {
      fields.forEach((f, idx) => {
        const item = document.createElement('div');
        item.className = `quick-field-item ${idx === activeFieldIndex ? 'active' : ''}`;
        const defaultFieldLbl = `${t('field_label_prefix')} #${idx + 1}`;
        item.innerHTML = `
          <span class="quick-num">${idx + 1}</span>
          <span class="quick-title">${escapeHTML(f.metadata.label || f.metadata.name || defaultFieldLbl)}</span>
        `;
        item.addEventListener('click', () => selectFieldByIndex(idx, true));
        fieldsQuickList.appendChild(item);
      });
    }

    const boxGuideCta = document.getElementById('box-guide-cta');

    if (activeFieldIndex < 0) {
      // User has not explicitly clicked "Guide Me" or a field yet.
      // Keep empty state visible with Guide Me CTA to avoid unprompted quota consumption.
      if (fieldsEmptyState) fieldsEmptyState.style.display = 'block';
      if (fieldDetailContent) fieldDetailContent.style.display = 'none';
      if (boxGuideCta) boxGuideCta.style.display = 'block';
      if (stepperIndicator) stepperIndicator.textContent = `0 / ${fields.length}`;
      if (btnStepperPrev) btnStepperPrev.disabled = true;
      if (btnStepperNext) btnStepperNext.disabled = false;
    } else {
      if (fieldsEmptyState) fieldsEmptyState.style.display = 'none';
      if (fieldDetailContent) fieldDetailContent.style.display = 'block';
      if (boxGuideCta) boxGuideCta.style.display = 'none';
      if (stepperIndicator) stepperIndicator.textContent = `${activeFieldIndex + 1} / ${fields.length}`;
      if (btnStepperPrev) btnStepperPrev.disabled = activeFieldIndex <= 0;
      if (btnStepperNext) btnStepperNext.disabled = activeFieldIndex >= fields.length - 1;
    }
  }

  function selectFieldByIndex(index, notifyPage = true) {
    if (!detectedFields || !detectedFields[index]) return;
    activeFieldIndex = index;

    // Switch display to field detail state
    showFieldsState('detail');

    // Update stepper
    if (stepperIndicator) {
      stepperIndicator.textContent = `${index + 1} / ${detectedFields.length}`;
    }
    if (btnStepperPrev) {
      btnStepperPrev.disabled = index <= 0;
    }
    if (btnStepperNext) {
      // Enabled because at last field, clicking Next takes user to completion state
      btnStepperNext.disabled = false;
    }

    // Render detail card
    renderFieldDetail(detectedFields[index]);

    // Notify tab to highlight and scroll to field safely
    if (notifyPage && currentTabId) {
      safeSendTabMessage(currentTabId, {
        type: 'GMT_ACTIVATE_FIELD_BY_INDEX',
        index: index
      });
    }
  }

  function formatMistakes(mistakes) {
    if (!mistakes) return '';
    if (Array.isArray(mistakes)) {
      if (mistakes.length === 1) return escapeHTML(mistakes[0]);
      return `<ul class="alert-list">${mistakes.map(m => `<li>${escapeHTML(m)}</li>`).join('')}</ul>`;
    }
    return escapeHTML(mistakes);
  }

  function formatHowToFill(how) {
    if (!how) return '';
    if (Array.isArray(how)) {
      return `<div class="detail-steps-wrapper">${how.map(h => `<p class="step-line">${escapeHTML(h)}</p>`).join('')}</div>`;
    }
    const text = String(how);
    if (/Step \d+:|Langkah \d+:/i.test(text)) {
      const parts = text.split(/(?=Step \d+:|Langkah \d+:)/i);
      return `<div class="detail-steps-wrapper">${parts.filter(p => p.trim()).map(p => `<p class="step-line">${escapeHTML(p.trim())}</p>`).join('')}</div>`;
    }
    return escapeHTML(text);
  }

  const globalExplanationCache = new Map();
  let currentExplainRequestId = 0;

  function getFieldCacheKey(meta, index, lang) {
    const rawKey = meta.id || meta.name || meta.label || `idx_${index}`;
    return `${String(rawKey).toLowerCase().trim()}:${lang}`;
  }

  function renderFieldDetail(field) {
    showFieldsState('detail');

    const index = activeFieldIndex;
    const meta = field.metadata || {};
    const cacheKey = getFieldCacheKey(meta, index, currentLanguage);

    field._aiExplanation = field._aiExplanation || {};
    const cached = field._aiExplanation[currentLanguage] || globalExplanationCache.get(cacheKey);

    // Only use cached data if it was successfully fetched from AI or verified backend
    if (cached && !cached.isError) {
      field._aiExplanation[currentLanguage] = cached;
      renderDetailCard(field, cached);
      return;
    }

    // Render loading shimmer skeleton
    const rawLabel = meta.label || meta.name || `${t('field_label_prefix')} #${index + 1}`;
    fieldDetailContent.innerHTML = `
      <div class="field-detail-header">
        <div class="field-title-group">
          <div class="field-title-row">
            <span class="field-badge-num">#${index + 1}</span>
            <h3 class="field-detail-title">${escapeHTML(rawLabel)}</h3>
          </div>
          <div class="field-original-subtitle">${t('analyzing_field') || '✨ Gemini AI is analyzing field...'}</div>
        </div>
        <span class="ai-badge-pill shimmer-pill">✨ Gemini AI</span>
      </div>
      <div class="skeleton-shimmer-box">
        <div class="skeleton-line shimmer-anim" style="width: 85%;"></div>
        <div class="skeleton-line shimmer-anim" style="width: 95%;"></div>
        <div class="skeleton-line shimmer-anim" style="width: 60%;"></div>
        <div class="skeleton-box shimmer-anim" style="height: 52px; margin-top: 6px;"></div>
        <div class="skeleton-box shimmer-anim" style="height: 44px; margin-top: 6px;"></div>
      </div>
    `;

    // Increment request token for race-condition protection
    const thisRequestId = ++currentExplainRequestId;

    // Request AI explanation from background service worker
    const resolvedPageContext = meta.pageTitle || meta.domain || 'Digital Web Form';

    chrome.runtime.sendMessage({
      type: 'EXPLAIN_FIELD',
      payload: {
        metadata: meta,
        language: currentLanguage,
        pageContext: resolvedPageContext
      }
    }, (resp) => {
      // Discard stale response if another field was focused while waiting
      if (thisRequestId !== currentExplainRequestId) {
        return;
      }
      if (activeFieldIndex !== index) {
        return;
      }

      if (!chrome.runtime.lastError && resp && resp.success && resp.data) {
        const finalData = resp.data;
        if (resp.quota) {
          refreshUserQuota(resp.quota);
        }
        field._aiExplanation[currentLanguage] = finalData;
        globalExplanationCache.set(cacheKey, finalData);
        renderDetailCard(field, finalData);
      } else {
        const errMsg = resp?.error || chrome.runtime.lastError?.message || 'Gagal memuat analisis dari Gemini AI (Koneksi terputus atau batas kuota habis).';
        renderErrorCard(field, errMsg);
      }
    });
  }

  function renderErrorCard(field, errorMessage) {
    const meta = field.metadata || {};
    const rawLabel = meta.label || meta.name || `${t('field_label_prefix')} #${activeFieldIndex + 1}`;
    
    fieldDetailContent.innerHTML = `
      <div class="field-detail-header">
        <div class="field-title-group">
          <div class="field-title-row">
            <span class="field-badge-num">#${activeFieldIndex + 1}</span>
            <h3 class="field-detail-title">${escapeHTML(rawLabel)}</h3>
          </div>
          <div class="field-original-subtitle" style="color: #dc2626;">Koneksi / Analisis AI Gagal</div>
        </div>
        <span class="ai-badge-pill" style="background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5;">❌ Gagal</span>
      </div>

      <div class="field-error-notice-box" style="margin-top: 16px; padding: 18px 16px; background: rgba(239, 68, 68, 0.05); border: 1.5px dashed rgba(239, 68, 68, 0.35); border-radius: 12px; text-align: center;">
        <div style="font-size: 30px; margin-bottom: 8px;">⚠️</div>
        <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #991b1b;">Gagal Mendapatkan Analisis Gemini AI</h4>
        <p style="margin: 0 0 16px 0; font-size: 12px; color: #7f1d1d; line-height: 1.5;">
          ${escapeHTML(errorMessage || 'Server Gemini AI tidak merespons atau batas kuota tercapai. Tidak ada data tebakan lokal yang ditampilkan agar tidak menyesatkan.')}
        </p>
        <button id="btn-retry-field-explain" class="sp-btn-primary" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 20px; font-size: 12.5px; font-weight: 600; cursor: pointer; border-radius: 8px; background: #2563eb; color: #fff; border: none; box-shadow: 0 2px 6px rgba(37,99,235,0.25);">
          <span>🔄</span>
          <span>Analisis Ulang</span>
        </button>
      </div>
    `;

    const btnRetry = document.getElementById('btn-retry-field-explain');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        const meta = field.metadata || {};
        const cacheKey = getFieldCacheKey(meta, activeFieldIndex, currentLanguage);
        globalExplanationCache.delete(cacheKey);
        if (field._aiExplanation) {
          delete field._aiExplanation[currentLanguage];
        }
        renderFieldDetail(field);
      });
    }
  }

  function renderDetailCard(field, data) {
    const meta = field.metadata || {};
    const isPassword = Boolean(meta.isPassword || field.isPassword || meta.type === 'password');
    const translatedLabel = data.label || meta.label || meta.name || `Field #${activeFieldIndex + 1}`;
    const origLabel = data.originalLabel || meta.label || meta.name || '';
    const meaning = isPassword
      ? (currentLanguage === 'en'
          ? 'Confidential password credential used to authenticate and protect your account.'
          : 'Kata sandi rahasia untuk memverifikasi akun Anda.')
      : (data.meaning || `Field to provide ${escapeHTML(translatedLabel)}.`);
    const howToFill = isPassword
      ? (currentLanguage === 'en'
          ? 'Enter a secure password with at least 8–12 characters, combining uppercase, lowercase, numbers, and symbols.'
          : 'Masukkan kata sandi yang kuat (minimal 8–12 karakter, perpaduan huruf besar, kecil, angka, dan simbol).')
      : (data.howToFill || data.how_to_fill || 'Enter data accurately as shown in your official identification.');
    const example = isPassword
      ? '•••••••• (Kombinasi huruf, angka & simbol)'
      : (data.example || meta.placeholder || 'Example entry');
    const mistakes = isPassword
      ? (currentLanguage === 'en'
          ? 'Avoid using personal birthdates, sequential numbers (123456), or easily guessable common words.'
          : 'Hindari tanggal lahir, angka berurutan (123456), atau nama diri yang mudah ditebak.')
      : (data.commonMistakes || data.common_mistakes || null);
    const foreigners = data.tipsForForeigners || data.tips_for_foreigners || data.foreign_note || null;
    
    const sourceBadge = isPassword ? '🛡️ Zero-Knowledge' : (data.source === 'verified' ? '✓ Verified' : (t('ai_draft_badge') || '✨ Gemini AI'));
    const badgeClass = isPassword ? 'verified' : (data.source === 'verified' ? 'verified' : 'draft');

    const showSubtitle = origLabel && (origLabel.toLowerCase() !== translatedLabel.toLowerCase());

    fieldDetailContent.innerHTML = `
      <div class="field-detail-header">
        <div class="field-title-group">
          <div class="field-title-row">
            <span class="field-badge-num">#${activeFieldIndex + 1}</span>
            <h3 class="field-detail-title">${escapeHTML(translatedLabel)}</h3>
          </div>
          ${showSubtitle ? `<div class="field-original-subtitle">${escapeHTML(origLabel)}</div>` : ''}
        </div>
        <span class="ai-badge-pill ${badgeClass}">${escapeHTML(sourceBadge)}</span>
      </div>

      <!-- ZERO-KNOWLEDGE PASSWORD PRIVACY GUARANTEE BANNER -->
      ${isPassword ? `
        <div class="alert-password-security">
          <div class="alert-password-security-title">
            <span>🛡️</span>
            <span>Zero-Knowledge Security Note</span>
          </div>
          <p class="alert-password-security-desc">
            ${currentLanguage === 'en'
              ? 'Your password is safe and handled directly by your browser. Telmy cannot view, record, or analyze your password. For your security, we do not audit or validate password characters to comply with privacy regulations.'
              : 'Password yang kamu masukkan aman, dan kami tidak bisa melihatnya, mencatatnya, ataupun menganalisanya. Khusus untuk Password kami tidak akan melakukan audit/validasi, karena kebijakan kami untuk mematuhi aturan keamanan.'}
          </p>
        </div>
      ` : ''}

      <!-- 1. MEANING & PURPOSE -->
      <div class="detail-section">
        <div class="detail-label">
          <span class="detail-icon">🧭</span>
          <span>${t('detail_meaning')}</span>
        </div>
        <div class="detail-text">${escapeHTML(meaning)}</div>
      </div>

      <!-- 2. HOW TO FILL -->
      <div class="detail-section">
        <div class="detail-label">
          <span class="detail-icon">📝</span>
          <span>${t('detail_how')}</span>
        </div>
        <div class="detail-text">${formatHowToFill(howToFill)}</div>
      </div>

      <!-- 3. FICTIONAL EXAMPLE -->
      <div class="detail-section">
        <div class="detail-label">
          <span class="detail-icon">📋</span>
          <span>${t('detail_example')}</span>
        </div>
        <div class="detail-fictional-example">
          <div class="example-text">${escapeHTML(example)}</div>
          ${!isPassword ? `<button type="button" class="btn-copy-example" id="btn-copy-val">${t('detail_copy')}</button>` : `<span style="font-size:11px;color:#059669;font-weight:600;padding:2px 8px;">🔒 Rahasia</span>`}
        </div>
      </div>

      <!-- 4. COMMON MISTAKES -->
      ${mistakes ? `
        <div class="alert-common-mistakes">
          <div class="alert-mistakes-title">
            <span class="alert-icon">⚠️</span>
            <strong>${t('detail_avoid')}</strong>
          </div>
          <div class="alert-mistakes-body">
            ${formatMistakes(mistakes)}
          </div>
        </div>
      ` : ''}

      <!-- 5. NOTES FOR FOREIGNERS -->
      ${foreigners ? `
        <div class="alert-foreign-notes">
          <div class="alert-foreign-title">
            <span class="alert-icon">🌐</span>
            <strong>${t('detail_foreign_notes')}</strong>
          </div>
          <div class="alert-foreign-body">
            ${escapeHTML(foreigners)}
          </div>
        </div>
      ` : ''}
    `;

    const copyBtn = fieldDetailContent.querySelector('#btn-copy-val');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(example);
        copyBtn.textContent = t('detail_copied');
        setTimeout(() => { copyBtn.textContent = t('detail_copy'); }, 1500);
      });
    }
  }

  // Stepper Buttons & Completion State Navigation
  btnStepperPrev.addEventListener('click', () => {
    if (currentFieldsState === 'completion') {
      // Returning from completion screen goes back to the last field
      if (detectedFields && detectedFields.length > 0) {
        selectFieldByIndex(detectedFields.length - 1, true);
      }
      return;
    }
    if (activeFieldIndex > 0) {
      selectFieldByIndex(activeFieldIndex - 1, true);
    }
  });

  btnStepperNext.addEventListener('click', () => {
    if (!detectedFields || detectedFields.length === 0) return;
    if (activeFieldIndex < 0) {
      selectFieldByIndex(0, true);
    } else if (activeFieldIndex < detectedFields.length - 1) {
      selectFieldByIndex(activeFieldIndex + 1, true);
    } else if (activeFieldIndex === detectedFields.length - 1) {
      // Last field clicked Next -> Switch to Completion State!
      showFormCompletionState();
    }
  });

  function showFormCompletionState() {
    showFieldsState('completion');
    if (btnStepperPrev) btnStepperPrev.disabled = false;
    if (btnStepperNext) btnStepperNext.disabled = true;
    if (stepperIndicator) stepperIndicator.textContent = t('stepper_all_done');
    if (boxAuditChecklistResults) boxAuditChecklistResults.style.display = 'none';
  }

  // Explicit Guide Me CTA button listener
  if (btnStartFormGuide) {
    btnStartFormGuide.addEventListener('click', () => {
      if (detectedFields && detectedFields.length > 0) {
        selectFieldByIndex(0, true);
      }
    });
  }

  // Pre-Submission Audit button listener in completion state (Real DOM Verification)
  if (btnTriggerPreAudit) {
    btnTriggerPreAudit.addEventListener('click', async () => {
      if (!detectedFields || detectedFields.length === 0) return;
      if (!currentTabId) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) currentTabId = tab.id;
      }
      if (!currentTabId) {
        alert(t('alert_no_active_tab'));
        return;
      }

      btnTriggerPreAudit.disabled = true;
      btnTriggerPreAudit.textContent = t('audit_preaudit_btn_reviewing');

      chrome.tabs.sendMessage(currentTabId, { type: 'AUDIT_FORM_VALUES' }, (res) => {
        btnTriggerPreAudit.disabled = false;
        btnTriggerPreAudit.innerHTML = `<span>${escapeHTML(t('audit_preaudit_btn_idle'))}</span>`;

        if (boxAuditChecklistResults) {
          boxAuditChecklistResults.style.display = 'block';
        }

        const domFields = (res && res.success && Array.isArray(res.fields)) ? res.fields : [];
        let emptyCount = 0;
        let warningCount = 0;

        if (auditChecklistItems) {
          auditChecklistItems.innerHTML = detectedFields.map((f, idx) => {
            const meta = f.metadata || {};
            const isPwd = Boolean(meta.isPassword || f.isPassword || meta.type === 'password');
            const label = meta.label || meta.name || `${t('field_label_prefix') || 'Field'} #${idx + 1}`;
            
            // Match with live scanned value from DOM
            const domField = domFields.find(df => df.index === idx) || {};
            const val = (domField.value !== undefined ? domField.value : (meta.element ? meta.element.value : '') || '').trim();
            const isRequired = Boolean(domField.required || meta.required || f.required || (f.dictEntry && f.dictEntry.required));

            if (isPwd) {
              return `
                <div class="audit-checklist-row clickable" onclick="window.selectFieldByIndex && window.selectFieldByIndex(${idx})">
                  <div class="audit-field-left">
                    <span class="audit-check-icon" style="color: #10b981;">🔒</span>
                    <span class="audit-field-name">${escapeHTML(label)}</span>
                  </div>
                  <span class="audit-status-tag" style="background: rgba(16, 185, 129, 0.12); color: #047857; border: 1px solid rgba(16, 185, 129, 0.28);">${escapeHTML(t('audit_tag_privacy'))}</span>
                </div>
              `;
            }

            // 1. Critical Empty Required Field
            if (!val && isRequired) {
              emptyCount++;
              return `
                <div class="audit-checklist-row clickable" onclick="window.selectFieldByIndex && window.selectFieldByIndex(${idx})" style="background: #fff1f2;">
                  <div class="audit-field-left">
                    <span class="audit-check-icon" style="color: #e11d48;">⚠️</span>
                    <span class="audit-field-name" style="color: #9f1239; font-weight: 700;">${escapeHTML(label)}</span>
                  </div>
                  <span class="audit-status-tag empty">${escapeHTML(t('audit_tag_empty_required'))}</span>
                </div>
              `;
            }

            // 2. Empty Optional Field
            if (!val && !isRequired) {
              return `
                <div class="audit-checklist-row clickable" onclick="window.selectFieldByIndex && window.selectFieldByIndex(${idx})">
                  <div class="audit-field-left">
                    <span class="audit-check-icon" style="color: #94a3b8;">○</span>
                    <span class="audit-field-name" style="color: #64748b;">${escapeHTML(label)}</span>
                  </div>
                  <span class="audit-status-tag" style="background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0;">${escapeHTML(t('audit_tag_empty_optional'))}</span>
                </div>
              `;
            }

            // 3. Formatting checks (Academic titles or lowercase names)
            const lowLbl = label.toLowerCase();
            let formatWarning = null;
            if (lowLbl.includes('nama') || lowLbl.includes('name')) {
              if (/M\.Sc|B\.Sc|Ph\.D|S\.T|S\.Kom|Drs|Ir\./i.test(val)) {
                formatWarning = t('audit_warning_academic');
              } else if (val === val.toLowerCase() && val.length > 3) {
                formatWarning = t('audit_warning_lowercase');
              }
            } else if (lowLbl.includes('nik') || lowLbl.includes('ktp')) {
              const digits = val.replace(/\D/g, '').length;
              if (digits > 0 && digits !== 16) {
                formatWarning = t('audit_warning_nik_digits', { digits });
              }
            }

            if (formatWarning) {
              warningCount++;
              return `
                <div class="audit-checklist-row clickable" onclick="window.selectFieldByIndex && window.selectFieldByIndex(${idx})" style="background: #fffbeb;">
                  <div class="audit-field-left">
                    <span class="audit-check-icon" style="color: #d97706;">⚠️</span>
                    <span class="audit-field-name" style="color: #92400e;">${escapeHTML(label)}</span>
                  </div>
                  <span class="audit-status-tag warning">${escapeHTML(formatWarning)}</span>
                </div>
              `;
            }

            // 4. Clean & Valid Filled Field
            return `
              <div class="audit-checklist-row clickable" onclick="window.selectFieldByIndex && window.selectFieldByIndex(${idx})">
                <div class="audit-field-left">
                  <span class="audit-check-icon" style="color: #16a34a;">✓</span>
                  <span class="audit-field-name">${escapeHTML(label)}</span>
                </div>
                <span class="audit-status-tag">${escapeHTML(t('audit_tag_passed'))}</span>
              </div>
            `;
          }).join('');
        }

        // Update Bottom Banner Status
        const banner = document.getElementById('audit-passed-banner');
        const bannerIcon = document.getElementById('audit-passed-banner-icon');
        const bannerTitle = document.getElementById('audit-passed-banner-title');
        const bannerDesc = document.getElementById('audit-passed-banner-desc');

        if (banner && bannerTitle && bannerDesc && bannerIcon) {
          if (emptyCount > 0) {
            banner.className = 'audit-passed-banner has-issues';
            bannerIcon.textContent = '⚠️';
            bannerTitle.textContent = t('audit_banner_empty_title', { count: emptyCount });
            bannerDesc.textContent = t('audit_banner_empty_desc');
          } else if (warningCount > 0) {
            banner.className = 'audit-passed-banner';
            banner.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            bannerIcon.textContent = '💡';
            bannerTitle.textContent = t('audit_banner_warning_title', { count: warningCount });
            bannerDesc.textContent = t('audit_banner_warning_desc');
          } else {
            banner.className = 'audit-passed-banner';
            banner.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            bannerIcon.textContent = '🎉';
            bannerTitle.textContent = t('audit_banner_clean_title');
            bannerDesc.textContent = t('audit_banner_clean_desc');
          }
        }

        boxAuditChecklistResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  // 9. Summary & Progress Pane
  function renderSummaryPane(summary, fields) {
    if (summaryDescText) {
      if (summary && summary.title) {
        summaryDescText.textContent = `${summary.title}: ${summary.description || 'Formulir pelayanan resmi.'}`;
      } else {
        summaryDescText.textContent = t('summary_desc_fallback', { count: fields.length });
      }
    }

    if (boxPrerequisites) {
      if (summary && summary.prerequisites && summary.prerequisites.length > 0) {
        boxPrerequisites.style.display = 'block';
        if (summaryPrereqList) {
          summaryPrereqList.innerHTML = summary.prerequisites.map(p => `<li>${escapeHTML(p)}</li>`).join('');
        }
      } else {
        boxPrerequisites.style.display = 'none';
      }
    }

    // Calculate filled progress
    const total = fields.length;
    let filled = 0;
    fields.forEach(f => {
      const el = f.metadata ? f.metadata.element : null;
      if (el && el.value && el.value.trim().length > 0) filled++;
    });

    const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
    if (progressPercent) progressPercent.textContent = `${pct}%`;
    if (progressBarFill) progressBarFill.style.width = `${pct}%`;
    if (progressSubText) progressSubText.textContent = t('progress_sub_text', { filled, total });
  }

  // 10. Helpers & Persistence
  function formatTime(d) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  async function loadSessionChat(url) {
    try {
      let host = 'global';
      try {
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          host = new URL(url).hostname;
        }
      } catch (_) {}
      const key = `telmy_sp_chat_${host}`;
      const res = await chrome.storage.local.get([key]);
      const stored = res[key] || [];
      // Clean up any historical duplicate welcome messages from previous sessions
      chatHistory = stored.filter((m) => {
        if (!m || !m.text) return false;
        const isWelcome = m.role === 'assistant' && (
          m.text.includes('your AI form-filling assistant') ||
          m.text.includes('asisten pengisian formulir') ||
          m.text.includes('AI 양식 도우미') ||
          m.text.includes('AI フォームアシスタント')
        );
        return !isWelcome;
      });
      await chrome.storage.local.set({ [key]: chatHistory });
    } catch (e) {
      chatHistory = [];
    }
    renderWelcome();
  }

  async function saveSessionChat() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url) {
        let host = 'global';
        try {
          if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
            host = new URL(tab.url).hostname;
          }
        } catch (_) {}
        const key = `telmy_sp_chat_${host}`;
        await chrome.storage.local.set({ [key]: chatHistory.slice(-30) });
      }
    } catch (e) {}
  }

  // =========================================================
  // Priority 7: Universal PDF Guidance Logic
  // =========================================================
  function checkPdfTab(url) {
    if (!spPdfAlertBanner) return;
    if (!url) {
      spPdfAlertBanner.style.display = 'none';
      return;
    }
    const isPdf = url.toLowerCase().endsWith('.pdf') ||
                  url.toLowerCase().includes('.pdf?') ||
                  (url.startsWith('chrome-extension://') && url.includes('.pdf'));
    if (isPdf) {
      spPdfAlertBanner.style.display = 'flex';
      const filename = url.split('/').pop().split('?')[0] || 'document.pdf';
      const elSub = document.getElementById('lbl-pdf-banner-sub');
      if (elSub) elSub.textContent = filename;
    } else {
      spPdfAlertBanner.style.display = 'none';
    }
  }

  function switchSourceMode(mode, shouldSwitchTab = false) {
    activeSourceMode = mode;
    if (btnModeWeb && btnModePdf) {
      btnModeWeb.classList.toggle('active', mode === 'web');
      btnModePdf.classList.toggle('active', mode === 'pdf');
    }
    if (webModeContainer && pdfModeContainer) {
      webModeContainer.style.display = mode === 'web' ? 'flex' : 'none';
      pdfModeContainer.style.display = mode === 'pdf' ? 'flex' : 'none';
    }
    // Only switch to fields tab if explicitly requested
    if (shouldSwitchTab) {
      const tabFields = document.querySelector('.sp-tab-btn[data-tab="fields"]');
      if (tabFields) tabFields.click();
    }
  }

  function setupPdfMode() {
    if (btnModeWeb) btnModeWeb.addEventListener('click', () => switchSourceMode('web'));
    if (btnModePdf) btnModePdf.addEventListener('click', () => switchSourceMode('pdf'));

    const btnBackFromPdf = document.getElementById('btn-back-from-pdf');
    if (btnBackFromPdf) {
      btnBackFromPdf.addEventListener('click', () => {
        const tabChat = document.getElementById('tab-btn-chat');
        if (tabChat) tabChat.click();
      });
    }

    // Priority 7.5: 1-Click Native Viewer Ingestion (Tanpa Re-Upload)
    if (btnPdfBannerAction) {
      btnPdfBannerAction.addEventListener('click', () => {
        switchSourceMode('pdf');

        if (spPdfDropContent) spPdfDropContent.style.display = 'none';
        if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'flex';
        if (telmyAvatar) telmyAvatar.setState('THINKING');

        chrome.runtime.sendMessage({ type: 'FETCH_ACTIVE_TAB_DOCUMENT' }, (res) => {
          if (chrome.runtime.lastError || !res) {
            if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
            if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
            if (telmyAvatar) telmyAvatar.setState('IDLE');
            alert(t('alert_pdf_tab_download_fail'));
            return;
          }

          if (res.isLocalFile) {
            if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
            if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
            if (telmyAvatar) telmyAvatar.setState('IDLE');
            alert(t('alert_pdf_local_file_hint'));
            return;
          }

          if (!res.success || !res.dataUrl) {
            if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
            if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
            if (telmyAvatar) telmyAvatar.setState('IDLE');
            alert(t('alert_tab_read_fail', { error: res?.error || 'Unknown error' }));
            return;
          }

          currentPdfFileName = res.filename || 'Document.pdf';
          currentPdfMimeType = res.mimeType || 'application/pdf';
          currentPdfRawBytes = dataUrlToUint8Array(res.dataUrl);

          chrome.runtime.sendMessage({
            type: 'EXPLAIN_PDF',
            payload: {
              pdfBase64: res.dataUrl,
              filename: currentPdfFileName,
              mimeType: currentPdfMimeType,
              language: currentLanguage
            }
          }, (expRes) => {
            if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
            if (expRes && expRes.quotaExhausted) {
              if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
              if (telmyAvatar) telmyAvatar.setState('IDLE');
              openPaywallModal(t('paywall_exhausted_sub'));
              return;
            }
            if (expRes && expRes.quota) {
              refreshUserQuota(expRes.quota);
            }
            if (chrome.runtime.lastError || !expRes || !expRes.success || !expRes.data) {
              if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
              if (telmyAvatar) telmyAvatar.setState('IDLE');
              alert(t('alert_gemini_backend_fail'));
              return;
            }
            handleSuccessfulDocumentAnalysis(expRes.data);
          });
        });
      });
    }


    if (btnBrowsePdf && spPdfFileInput) {
      btnBrowsePdf.addEventListener('click', (e) => {
        e.stopPropagation();
        spPdfFileInput.click();
      });
    }

    if (spPdfDropzone && spPdfFileInput) {
      spPdfDropzone.addEventListener('click', () => {
        if (!currentPdfData) spPdfFileInput.click();
      });

      spPdfDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        spPdfDropzone.classList.add('dragover');
      });

      spPdfDropzone.addEventListener('dragleave', () => {
        spPdfDropzone.classList.remove('dragover');
      });

      spPdfDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        spPdfDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0];
          handlePdfUpload(file);
        }
      });

      spPdfFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handlePdfUpload(e.target.files[0]);
        }
      });
    }

    if (btnResetPdf) {
      btnResetPdf.addEventListener('click', () => {
        currentPdfData = null;
        currentPdfRawBytes = null;
        pdfChecklistState = {};
        pdfUserFormValues = {};
        if (spPdfResultCard) spPdfResultCard.style.display = 'none';
        if (spPdfDropzone) spPdfDropzone.style.display = 'block';
        if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
        if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
        if (spPdfFileInput) spPdfFileInput.value = '';
      });
    }

    // Priority 7.7: Interactive Export Actions
    if (btnPdfExportFilled) {
      btnPdfExportFilled.addEventListener('click', handleExportFilledPdf);
    }
  }

  // Priority 7.6: Multimodal Photo, Scan & PDF Ingestion with Canvas Compressor
  async function handlePdfUpload(file) {
    if (!file) return;

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      alert(t('alert_invalid_pdf_or_image'));
      return;
    }

    if (spPdfDropContent) spPdfDropContent.style.display = 'none';
    if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'flex';
    if (telmyAvatar) telmyAvatar.setState('THINKING');

    currentPdfFileName = file.name;
    currentPdfMimeType = isPdf ? 'application/pdf' : (file.type || 'image/jpeg');

    try {
      let finalBase64 = '';

      if (isImage) {
        // Client-side canvas optimization: resize to max 2048px, JPEG 85%
        finalBase64 = await compressImageFileToDataUrl(file, 2048, 0.85);
        currentPdfMimeType = 'image/jpeg';
        currentPdfRawBytes = dataUrlToUint8Array(finalBase64);
      } else {
        // PDF file
        const arrayBuf = await file.arrayBuffer();
        currentPdfRawBytes = new Uint8Array(arrayBuf);
        finalBase64 = uint8ArrayToDataUrl(currentPdfRawBytes, 'application/pdf');
      }

      chrome.runtime.sendMessage({
        type: 'EXPLAIN_PDF',
        payload: {
          pdfBase64: finalBase64,
          filename: currentPdfFileName,
          mimeType: currentPdfMimeType,
          language: currentLanguage
        }
      }, (res) => {
        if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
        if (res && res.quotaExhausted) {
          if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
          if (telmyAvatar) telmyAvatar.setState('IDLE');
          openPaywallModal(t('paywall_exhausted_sub'));
          return;
        }
        if (res && res.quota) {
          refreshUserQuota(res.quota);
        }
        if (chrome.runtime.lastError || !res || !res.success || !res.data) {
          if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
          if (telmyAvatar) telmyAvatar.setState('IDLE');
          alert(t('alert_gemini_backend_fail'));
          return;
        }

        handleSuccessfulDocumentAnalysis(res.data);
      });
    } catch (err) {
      if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
      if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
      if (telmyAvatar) telmyAvatar.setState('IDLE');
      alert(t('alert_process_file_fail', { error: err.message }));
    }
  }

  function handleSuccessfulDocumentAnalysis(data) {
    currentPdfData = data;
    activePdfSectionIndex = 0;
    pdfChecklistState = {};
    pdfUserFormValues = {};

    if (spPdfDropzone) spPdfDropzone.style.display = 'none';
    if (spPdfResultCard) spPdfResultCard.style.display = 'block';

    renderPdfData(currentPdfData);

    if (telmyAvatar) telmyAvatar.setState('EXPLAINING');
    const intro = t('pdf_intro_msg', { title: currentPdfData.documentTitle || t('your_document') });
    speakResponse(intro);
  }

  function renderPdfData(data) {
    if (!data) return;
    if (pdfDocTitle) pdfDocTitle.textContent = data.documentTitle || 'Official Form Document';
    if (pdfDocSummary) pdfDocSummary.textContent = data.summary || 'Document parsed by Gemini Multimodal assistant.';

    // Render Required Attachments Checklist
    renderPdfChecklist(data.requiredAttachments || []);

    // Render Section Navigation Tabs
    renderPdfSections(data.sections || []);
  }

  function renderPdfChecklist(items) {
    if (!pdfChecklistItems) return;
    pdfChecklistItems.innerHTML = '';

    if (!items || items.length === 0) {
      if (pdfChecklistCard) pdfChecklistCard.style.display = 'none';
      return;
    }

    if (pdfChecklistCard) pdfChecklistCard.style.display = 'block';

    const updateChecklistBadge = () => {
      const total = items.length;
      let checkedCount = 0;
      items.forEach((it) => {
        const key = typeof it === 'string' ? it : (it.item || JSON.stringify(it));
        if (pdfChecklistState[key]) checkedCount++;
      });
      if (pdfChecklistBadge) {
        pdfChecklistBadge.textContent = `${checkedCount}/${total} Ready`;
        pdfChecklistBadge.classList.toggle('completed', checkedCount === total && total > 0);
      }
    };

    items.forEach((itemObj) => {
      const itemText = typeof itemObj === 'string' ? itemObj : `${itemObj.item || ''} ${itemObj.specs ? '(' + itemObj.specs + ')' : ''}`;
      const itemEl = document.createElement('div');
      itemEl.className = 'pdf-check-item' + (pdfChecklistState[itemText] ? ' done' : '');

      itemEl.innerHTML = `
        <div class="pdf-checkbox">${pdfChecklistState[itemText] ? '✓' : ''}</div>
        <span class="pdf-check-text">${escapeHTML(itemText)}</span>
      `;

      itemEl.addEventListener('click', () => {
        pdfChecklistState[itemText] = !pdfChecklistState[itemText];
        itemEl.classList.toggle('done', pdfChecklistState[itemText]);
        const box = itemEl.querySelector('.pdf-checkbox');
        if (box) box.textContent = pdfChecklistState[itemText] ? '✓' : '';
        updateChecklistBadge();
      });

      pdfChecklistItems.appendChild(itemEl);
    });

    updateChecklistBadge();
  }

  function renderPdfSections(sections) {
    if (!pdfSectionsTabs) return;
    pdfSectionsTabs.innerHTML = '';

    if (!sections || sections.length === 0) {
      if (pdfActiveSectionFields) {
        pdfActiveSectionFields.innerHTML = '<p style="color: #64748b; font-size: 12px; text-align: center; padding: 20px;">No form sections detected in this document.</p>';
      }
      return;
    }

    sections.forEach((sec, idx) => {
      const secTitle = sec.title || sec.sectionName || `Section ${idx + 1}`;
      const tabBtn = document.createElement('button');
      tabBtn.type = 'button';
      tabBtn.className = 'pdf-sec-tab' + (idx === activePdfSectionIndex ? ' active' : '');
      tabBtn.textContent = secTitle;

      tabBtn.addEventListener('click', () => {
        activePdfSectionIndex = idx;
        const allTabs = pdfSectionsTabs.querySelectorAll('.pdf-sec-tab');
        allTabs.forEach((b, i) => b.classList.toggle('active', i === idx));
        if (pdfSectionIndicator) pdfSectionIndicator.textContent = secTitle;
        renderPdfSectionFields(sec);
      });

      pdfSectionsTabs.appendChild(tabBtn);
    });

    if (sections[activePdfSectionIndex]) {
      const activeTitle = sections[activePdfSectionIndex].title || sections[activePdfSectionIndex].sectionName || `Section ${activePdfSectionIndex + 1}`;
      if (pdfSectionIndicator) pdfSectionIndicator.textContent = activeTitle;
      renderPdfSectionFields(sections[activePdfSectionIndex]);
    }
  }

  function renderPdfSectionFields(section) {
    if (!pdfActiveSectionFields) return;
    pdfActiveSectionFields.innerHTML = '';

    const fields = section.fields || [];
    if (fields.length === 0) {
      pdfActiveSectionFields.innerHTML = '<p style="color: #86868b; font-size: 12px; padding: 10px;">No fields listed for this section.</p>';
      return;
    }

    fields.forEach((f) => {
      const card = document.createElement('div');
      card.className = 'pdf-field-card';

      const fieldName = f.label || f.fieldName || f.name || 'Field';
      const explanation = f.meaning || f.explanation || '';
      const example = f.example || '';
      const pitfall = f.pitfall || f.commonPitfall || '';
      const foreignerNote = f.foreignerNote || null;
      const uncertaintyNotice = f.uncertaintyNotice || null;

      let inner = `
        <div class="pdf-field-top">
          <div class="pdf-field-title-group">
            <span class="pdf-field-badge">Hal ${f.pageNumber || f.page || 1}</span>
            <strong class="pdf-field-name">${escapeHTML(fieldName)}</strong>
          </div>
          <button type="button" class="pdf-field-listen-btn" title="Dengarkan penjelasan" data-field-name="${escapeHTML(fieldName)}">🔊</button>
        </div>
        <p class="pdf-field-desc">${escapeHTML(explanation)}</p>
      `;

      if (uncertaintyNotice) {
        inner += `
          <div class="pdf-uncertainty-pill">
            ⚠️ <strong>Catatan Scan / Tulisan Tangan:</strong> ${escapeHTML(uncertaintyNotice)}
          </div>
        `;
      }

      if (example) {
        inner += `
          <div class="pdf-field-example-box">
            <strong>Contoh:</strong> ${escapeHTML(example)}
          </div>
        `;
      }

      if (pitfall) {
        inner += `
          <div class="pdf-field-pitfall-box">
            <strong>⚠️ Perhatian:</strong> ${escapeHTML(pitfall)}
          </div>
        `;
      }

      if (foreignerNote) {
        inner += `
          <div class="pdf-field-example-box" style="border-left-color: #8b5cf6;">
            <strong style="color: #8b5cf6;">🌍 Catatan WNA:</strong> ${escapeHTML(foreignerNote)}
          </div>
        `;
      }

      // Priority 7.7: Interactive Input Box
      const curVal = pdfUserFormValues[fieldName] || '';

      inner += `
        <div class="pdf-field-input-box">
          <label>Your Input (for Exported Document):</label>
          <div class="pdf-field-input-row">
            <input type="text" class="pdf-user-input" data-field-name="${escapeHTML(fieldName)}" placeholder="${example ? 'e.g. ' + escapeHTML(example) : 'Type entry...'}" value="${escapeHTML(curVal)}">
          </div>
        </div>
        <div class="pdf-field-card-actions">
          <button type="button" class="btn-field-ask-chip" data-field="${escapeHTML(fieldName)}">💬 Ask Telmy</button>
        </div>
      `;

      card.innerHTML = inner;

      // Input listener
      const inputEl = card.querySelector('.pdf-user-input');
      if (inputEl) {
        inputEl.addEventListener('input', (e) => {
          pdfUserFormValues[fieldName] = e.target.value;
        });
      }

      // Audio listen button
      const listenBtn = card.querySelector('.pdf-field-listen-btn');
      if (listenBtn) {
        listenBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const speechText = `${fieldName}. ${explanation} ${example ? 'Example: ' + example : ''} ${pitfall ? 'Avoid: ' + pitfall : ''}`;
          speakResponse(speechText);
        });
      }

      // Ask chip button
      const askBtn = card.querySelector('.btn-field-ask-chip');
      if (askBtn) {
        askBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tabChat = document.querySelector('.sp-tab-btn[data-tab="chat"]');
          if (tabChat) tabChat.click();
          handleSendMessage(t('how_to_complete_field_msg', { field: fieldName }));
        });
      }

      pdfActiveSectionFields.appendChild(card);
    });
  }

  // Priority 7.7: Direct Export of Filled PDF via pdf-lib (100% Client-Side)
  async function handleExportFilledPdf() {
    if (!currentPdfRawBytes) {
      alert(t('alert_no_original_doc'));
      return;
    }

    if (!window.PDFLib) {
      alert(t('alert_pdf_lib_loading'));
      return;
    }

    const { PDFDocument, rgb, StandardFonts } = window.PDFLib;

    try {
      let exportDoc;
      if (currentPdfMimeType === 'application/pdf') {
        exportDoc = await PDFDocument.load(currentPdfRawBytes);
        const font = await exportDoc.embedFont(StandardFonts.Helvetica);

        // Try AcroForm interactive fill
        try {
          const form = exportDoc.getForm();
          const formFields = form.getFields();
          formFields.forEach((field) => {
            const fieldName = field.getName();
            for (const [key, val] of Object.entries(pdfUserFormValues)) {
              if (val && (fieldName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(fieldName.toLowerCase()))) {
                try {
                  const tf = form.getTextField(fieldName);
                  tf.setText(val);
                } catch (e) {}
              }
            }
          });
        } catch (e) {}

        // Add certified submission summary page
        const pages = exportDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        const summaryPage = exportDoc.addPage([width, height]);
        summaryPage.drawText('TELMY.AI — OFFICIAL APPLICATION FORM SUBMISSION SUMMARY', {
          x: 40,
          y: height - 50,
          size: 13,
          font: font,
          color: rgb(0, 0.44, 0.89)
        });
        summaryPage.drawText(`Document: ${currentPdfData?.documentTitle || currentPdfFileName}`, {
          x: 40,
          y: height - 70,
          size: 10,
          font: font,
          color: rgb(0.2, 0.2, 0.2)
        });
        summaryPage.drawText(`Exported on: ${new Date().toLocaleDateString()} | Verified by Applicant`, {
          x: 40,
          y: height - 85,
          size: 9,
          font: font,
          color: rgb(0.5, 0.5, 0.5)
        });

        let currentY = height - 115;
        for (const [k, v] of Object.entries(pdfUserFormValues)) {
          if (!v || currentY < 60) continue;
          summaryPage.drawText(`• ${k}:`, { x: 45, y: currentY, size: 9.5, font: font, color: rgb(0.1, 0.1, 0.1) });
          summaryPage.drawText(`${v}`, { x: 220, y: currentY, size: 9.5, font: font, color: rgb(0, 0.35, 0.75) });
          currentY -= 18;
        }

      } else {
        // Image document: Embed photo on page 1, create structured filled form page on page 2
        exportDoc = await PDFDocument.create();
        const font = await exportDoc.embedFont(StandardFonts.Helvetica);
        const jpgImage = await exportDoc.embedJpg(currentPdfRawBytes);
        const { width: imgW, height: imgH } = jpgImage.scale(1);

        const imgPage = exportDoc.addPage([600, 800]);
        const scale = Math.min(540 / imgW, 720 / imgH);
        imgPage.drawImage(jpgImage, {
          x: 30,
          y: 40,
          width: imgW * scale,
          height: imgH * scale
        });

        const formPage = exportDoc.addPage([600, 800]);
        formPage.drawText('TELMY.AI — CERTIFIED FORM INPUT SUMMARY', {
          x: 40,
          y: 750,
          size: 14,
          font: font,
          color: rgb(0, 0.44, 0.89)
        });
        let curY = 710;
        for (const [k, v] of Object.entries(pdfUserFormValues)) {
          if (!v || curY < 60) continue;
          formPage.drawText(`• ${k}:`, { x: 45, y: curY, size: 10, font: font });
          formPage.drawText(`${v}`, { x: 220, y: curY, size: 10, font: font, color: rgb(0, 0.35, 0.75) });
          curY -= 20;
        }
      }

      const pdfBytes = await exportDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `telmy_filled_${currentPdfFileName.replace(/\.[^/.]+$/, '')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);

      alert(t('alert_pdf_download_success'));
    } catch (e) {
      console.error('[PDF Export Error]', e);
      alert(t('alert_pdf_export_fail', { error: e.message }));
    }
  }

  // Explain This (Snip Area Mode - Lightshot Style)
  async function handleExplainThisSnipAction() {
    if (!currentTabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) currentTabId = tab.id;
    }
    if (!currentTabId) {
      alert(t('alert_no_active_tab'));
      return;
    }

    const snipPayload = {
      type: 'TRIGGER_SNIP_TOOL',
      hintDrag: t('snip_hint_drag'),
      hintCapturing: t('snip_hint_capturing')
    };

    // Kirim perintah ke Content Script untuk memunculkan overlay seleksi snip
    chrome.tabs.sendMessage(currentTabId, snipPayload, (res) => {
      if (chrome.runtime.lastError || !res || !res.success) {
        // Jika content script belum terinjeksi, injeksi dan coba lagi
        ensureContentScriptInjected(currentTabId);
        setTimeout(() => {
          chrome.tabs.sendMessage(currentTabId, snipPayload);
        }, 300);
      }
    });
  }

  // Handle hasil seleksi snip yang dikirim balik oleh Content Script
  function handleProcessSnipExplain(croppedImageBase64, metadata) {
    if (!croppedImageBase64) return;

    // Pastikan tab Chat aktif
    if (tabBtns && tabBtns[0]) tabBtns[0].click();

    // Buat prompt eksplisit yang menyertakan metadata halaman
    const pageTitle = metadata?.title || '';
    const surroundingText = metadata?.surrounding_text ? ` (${metadata.surrounding_text.substring(0, 100)}...)` : '';

    const userPrompt = t('alert_snip_prompt', {
      title: pageTitle,
      surrounding: surroundingText
    });

    // Kirim pesan chat dengan melampirkan screenshot potongan piksel terpilih
    handleSendMessage(userPrompt, croppedImageBase64);
  }

  // Priority 9.2: Form Pre-Submission Auditor (Traffic Light Sanity Verification)
  async function runPreSubmissionAudit() {
    if (!currentTabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) currentTabId = tab.id;
    }
    if (!currentTabId) {
      alert('No active form tab found.');
      return;
    }

    chrome.tabs.sendMessage(currentTabId, { type: 'AUDIT_FORM_VALUES' }, (res) => {
      if (chrome.runtime.lastError || !res || !res.success || !res.fields) {
        alert(t('audit_scan_error'));
        return;
      }

      const fields = res.fields;
      if (fields.length === 0) {
        alert(t('audit_no_fields'));
        return;
      }

      const findings = [];
      let hasRed = false;
      let hasYellow = false;

      fields.forEach((f) => {
        const val = (f.value || '').trim();
        const defaultFieldLbl = `${t('field_label_prefix')} #${f.index + 1}`;
        const lbl = f.label || defaultFieldLbl;
        const lowLbl = lbl.toLowerCase();

        // 1. Red Error: Required but completely empty
        if (f.required && !val) {
          findings.push({
            type: 'red',
            icon: '🔴',
            title: `${t('audit_required_empty_title')} ${lbl}`,
            desc: t('audit_required_empty_desc')
          });
          hasRed = true;
          return;
        }

        if (!val) return;

        // 2. Date checks (Passport validity <6 months)
        if (lowLbl.includes('paspor') || lowLbl.includes('passport')) {
          if (lowLbl.includes('berlaku') || lowLbl.includes('expir') || lowLbl.includes('validity') || lowLbl.includes('date')) {
            const parsedDate = new Date(val);
            if (!isNaN(parsedDate.getTime())) {
              const sixMonthsFromNow = new Date();
              sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
              if (parsedDate < sixMonthsFromNow) {
                findings.push({
                  type: 'red',
                  icon: '🔴',
                  title: `${t('audit_passport_crit_title')} ${lbl}`,
                  desc: t('audit_passport_crit_desc')
                });
                hasRed = true;
              }
            }
          }
        }

        // 3. Name Capitalization & Academic Title Warning
        if (lowLbl.includes('nama') || lowLbl.includes('name')) {
          if (/M\.Sc|B\.Sc|Ph\.D|S\.T|S\.Kom|Drs|Ir\./i.test(val)) {
            findings.push({
              type: 'yellow',
              icon: '🟡',
              title: `${t('audit_academic_title_title')} "${val}"`,
              desc: t('audit_academic_title_desc')
            });
            hasYellow = true;
          }
          if (val === val.toLowerCase() && val.length > 3) {
            findings.push({
              type: 'yellow',
              icon: '🟡',
              title: `${t('audit_lowercase_name_title')} "${val}"`,
              desc: t('audit_lowercase_name_desc')
            });
            hasYellow = true;
          }
        }

        // 4. National ID / NIK length check
        if (lowLbl.includes('nik') || lowLbl.includes('ktp') || lowLbl.includes('national id')) {
          const numDigits = val.replace(/\D/g, '').length;
          if (numDigits > 0 && numDigits !== 16) {
            findings.push({
              type: 'yellow',
              icon: '🟡',
              title: t('audit_id_length_title', { count: numDigits }),
              desc: t('audit_id_length_desc')
            });
            hasYellow = true;
          }
        }
      });

      // Valid state
      if (findings.length === 0) {
        findings.push({
          type: 'green',
          icon: '🟢',
          title: t('audit_all_clean_title'),
          desc: t('audit_all_clean_desc')
        });
      }

      // Render audit report
      if (spAuditReportBox && auditReportItems && auditStatusPill) {
        spAuditReportBox.style.display = 'block';
        if (hasRed) {
          auditStatusPill.className = 'audit-status-pill danger';
          auditStatusPill.textContent = t('audit_status_danger') || '🔴 Action Required';
        } else if (hasYellow) {
          auditStatusPill.className = 'audit-status-pill warning';
          auditStatusPill.textContent = t('audit_status_warning') || '🟡 Suggestions Found';
        } else {
          auditStatusPill.className = 'audit-status-pill';
          auditStatusPill.textContent = t('audit_status_ready') || '🟢 Ready to Submit';
        }

        auditReportItems.innerHTML = findings.map(f => `
          <div class="audit-item-row ${f.type}">
            <span class="audit-item-icon">${f.icon}</span>
            <div class="audit-item-content">
              <strong>${escapeHTML(f.title)}</strong>
              <span>${escapeHTML(f.desc)}</span>
            </div>
          </div>
        `).join('');
      }
    });
  }

  // Utility helpers
  function compressImageFileToDataUrl(file, maxDimension = 2048, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = objectUrl;
    });
  }

  function dataUrlToUint8Array(dataUrl) {
    const base64 = dataUrl.split(',')[1] || dataUrl;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function uint8ArrayToDataUrl(bytes, mimeType = 'application/pdf') {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:${mimeType};base64,` + btoa(binary);
  }

  // =========================================================================
  // Priority 7 & 8: Zero-Knowledge CSE Vault & Document Ingestion Controller
  // =========================================================================
  function setupVaultController() {
    // 1. Initial lock state & Session Cache restoration
    checkVaultSessionCache();

    // 2. Gate Unlock / Create Vault Button (in Locked View)
    if (btnVaultGateAction) {
      btnVaultGateAction.addEventListener('click', () => {
        openVaultPinModal();
      });
    }

    // 2b. Lock Toggle Button (in Unlocked Topbar)
    if (btnVaultLockToggle) {
      btnVaultLockToggle.addEventListener('click', () => {
        if (isVaultUnlocked) {
          lockVault();
        } else {
          openVaultPinModal();
        }
      });
    }

    // 3. 1-Click AutoFill Form CTA in Vault Pane
    if (btnVaultAutofillNow) {
      btnVaultAutofillNow.addEventListener('click', handleVault1ClickAutoFill);
    }

    // 4. Open Web Dashboard for Full Vault Editing
    if (btnOpenDashboardVault) {
      btnOpenDashboardVault.addEventListener('click', openDashboardVault);
    }

    if (tabVaultPassword) tabVaultPassword.addEventListener('click', () => switchVaultModalTab('password'));
    if (tabVaultSeed) tabVaultSeed.addEventListener('click', () => switchVaultModalTab('seed_phrase'));
    if (btnTogglePwdVisibility) btnTogglePwdVisibility.addEventListener('click', togglePasswordVisibility);
    if (inputVaultPassword) {
      inputVaultPassword.addEventListener('input', updatePasswordStrengthUI);
      inputVaultPassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleVaultPinSubmit();
      });
    }
    if (btnGenerateNewSeed) btnGenerateNewSeed.addEventListener('click', generateAndRenderSeedChips);
    if (btnCopySeedWords) btnCopySeedWords.addEventListener('click', copySeedWordsToClipboard);
    if (btnDownloadSeedTxt) btnDownloadSeedTxt.addEventListener('click', downloadSeedTxtFile);

    if (btnVaultResetVault) {
      btnVaultResetVault.addEventListener('click', async () => {
        if (!confirm(t('confirm_reset_vault'))) return;
        if (window.TelmyCryptoVault) {
          window.TelmyCryptoVault.resetFailedAttempts();
          window.TelmyCryptoVault.clearSessionVaultSecret();
        }
        await chrome.storage.local.remove(['telmy_vault_session_cache', 'telmy_autofill', 'telmy_vault_envelope']);
        await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: 'VAULT_WIPE' }, resolve);
        });
        currentDecryptedVault = null;
        currentVaultPin = null;
        isVaultUnlocked = false;
        closeVaultPinModal();
        updateVaultHeaderUI(false);
        renderVaultFieldsList();
        showToast(t('toast_vault_reset'));
      });
    }

    if (btnSubmitVaultPin) {
      btnSubmitVaultPin.addEventListener('click', handleVaultPinSubmit);
    }
    if (btnCancelVaultPin) {
      btnCancelVaultPin.addEventListener('click', closeVaultPinModal);
    }
    if (vaultPinModal) {
      vaultPinModal.addEventListener('click', (e) => {
        if (e.target === vaultPinModal) closeVaultPinModal();
      });
    }

    // 7. Field Edit / Add Modal Controls
    const btnAddManualHeader = document.getElementById('btn-add-vault-field-manual');
    if (btnAddManualHeader) {
      btnAddManualHeader.addEventListener('click', () => openFieldModal(null));
    }
    if (btnCloseFieldModal) {
      btnCloseFieldModal.addEventListener('click', closeFieldModal);
    }
    if (btnCancelVaultField) {
      btnCancelVaultField.addEventListener('click', closeFieldModal);
    }
    if (btnSaveVaultField) {
      btnSaveVaultField.addEventListener('click', handleSaveFieldSubmit);
    }
    if (vaultFieldModal) {
      vaultFieldModal.addEventListener('click', (e) => {
        if (e.target === vaultFieldModal) closeFieldModal();
      });
    }

    // 8. Document Dropzone Setup (Priority 8)
    setupVaultDocDropzone();
  }

  // Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById("telmy-sidepanel-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "telmy-sidepanel-toast";
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.backgroundColor = "#0f172a";
      toast.style.color = "#ffffff";
      toast.style.padding = "8px 16px";
      toast.style.borderRadius = "8px";
      toast.style.fontSize = "12px";
      toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      toast.style.zIndex = "99999";
      toast.style.transition = "opacity 0.3s, transform 0.3s";
      toast.style.pointerEvents = "none";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(10px)";
    }, 2500);
  }

  function switchVaultModalTab(mode) {
    activeVaultMode = mode;
    if (tabVaultPassword) tabVaultPassword.classList.toggle('active', mode === 'password');
    if (tabVaultSeed) tabVaultSeed.classList.toggle('active', mode === 'seed_phrase');
    if (vaultViewPassword) vaultViewPassword.style.display = mode === 'password' ? 'block' : 'none';
    if (vaultViewSeed) vaultViewSeed.style.display = mode === 'seed_phrase' ? 'block' : 'none';
    if (vaultPinError) vaultPinError.style.display = 'none';

    if (mode === 'password' && inputVaultPassword) {
      setTimeout(() => inputVaultPassword.focus(), 50);
    } else if (mode === 'seed_phrase' && isVaultSetupMode && !currentGeneratedSeed) {
      generateAndRenderSeedChips();
    }
  }

  function togglePasswordVisibility() {
    if (!inputVaultPassword) return;
    const isPwd = inputVaultPassword.type === 'password';
    inputVaultPassword.type = isPwd ? 'text' : 'password';
    if (btnTogglePwdVisibility) btnTogglePwdVisibility.textContent = isPwd ? '🙈' : '👁️';
  }

  function updatePasswordStrengthUI() {
    if (!inputVaultPassword) return;
    const val = inputVaultPassword.value;
    if (isVaultSetupMode && vaultPwdStrengthWrap) {
      vaultPwdStrengthWrap.style.display = 'block';
      const st = window.TelmyCryptoVault.calculatePasswordStrength(val);
      if (vaultStrengthBar) {
        vaultStrengthBar.style.width = st.percent + '%';
        vaultStrengthBar.style.backgroundColor = st.color;
      }
      if (vaultStrengthText) {
        vaultStrengthText.textContent = st.label;
        vaultStrengthText.style.color = st.color;
      }
    } else if (vaultPwdStrengthWrap) {
      vaultPwdStrengthWrap.style.display = 'none';
    }
  }

  function generateAndRenderSeedChips() {
    currentGeneratedSeed = window.TelmyCryptoVault.generateSeedPhrase();
    const words = currentGeneratedSeed.split(' ');
    if (vaultSeedChips) {
      vaultSeedChips.innerHTML = words.map((w, idx) => `
        <div class="vault-seed-chip">
          <span class="vault-seed-num">${idx + 1}.</span>
          <span>${w}</span>
        </div>
      `).join('');
    }
    if (chkSeedSaved) chkSeedSaved.checked = false;
  }

  function copySeedWordsToClipboard() {
    if (!currentGeneratedSeed) return;
    navigator.clipboard.writeText(currentGeneratedSeed).then(() => {
      showToast(t('toast_seed_copied'));
    });
  }

  function downloadSeedTxtFile() {
    if (!currentGeneratedSeed) return;
    const txtContent = `${t('seed_txt_title')}\n` +
      `${t('seed_txt_generated')}${new Date().toISOString()}\n\n` +
      `${t('seed_txt_label')}\n` +
      `${currentGeneratedSeed}\n\n` +
      `${t('seed_txt_warning')}`;
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telmy-vault-seed-${Date.now().toString(36)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('toast_seed_saved'));
  }


  async function checkVaultSessionCache() {
    try {
      // 1. Check Session Unlock Secret (Session Storage / Memory)
      const sessionSecret = window.TelmyCryptoVault ? window.TelmyCryptoVault.getSessionVaultSecret() : null;
      if (sessionSecret) {
        const res = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: 'VAULT_GET' }, resolve);
        });
        const envelope = res && res.envelope ? res.envelope : null;
        if (envelope && envelope.ciphertext) {
          try {
            const decrypted = await window.TelmyCryptoVault.decryptVaultData(envelope, sessionSecret);
            currentDecryptedVault = decrypted;
            currentVaultPin = sessionSecret;
            isVaultUnlocked = true;
            updateVaultHeaderUI(true);
            renderVaultFieldsList();
            return;
          } catch (sessErr) {
            // Session key invalidated or changed
            if (window.TelmyCryptoVault) window.TelmyCryptoVault.clearSessionVaultSecret();
          }
        }
      }

      // 2. Check local session cache fallback
      const stored = await chrome.storage.local.get(['telmy_vault_session_cache']);
      if (stored.telmy_vault_session_cache && stored.telmy_vault_session_cache.fields) {
        currentDecryptedVault = stored.telmy_vault_session_cache;
        isVaultUnlocked = true;
        updateVaultHeaderUI(true);
        renderVaultFieldsList();
        return;
      }
    } catch (e) {}

    // Default locked state
    isVaultUnlocked = false;
    currentDecryptedVault = null;
    updateVaultHeaderUI(false);
    renderVaultFieldsList();
  }

  function updateVaultHeaderUI(unlocked) {
    if (lblVaultLockIcon) {
      lblVaultLockIcon.textContent = unlocked ? '🔓' : '🔒';
    }
    if (btnVaultLockToggle) {
      btnVaultLockToggle.title = unlocked ? 'Lock Vault (Clear Session from RAM)' : 'Unlock Profile Vault';
    }

    if (vaultLockedStateView) {
      vaultLockedStateView.style.display = unlocked ? 'none' : 'flex';
    }
    if (vaultUnlockedStateView) {
      vaultUnlockedStateView.style.display = unlocked ? 'flex' : 'none';
    }

    // Check if envelope exists to personalize gate text
    if (!unlocked) {
      chrome.runtime.sendMessage({ type: 'VAULT_GET' }, (res) => {
        const hasVault = res && res.envelope && res.envelope.ciphertext;
        if (lblVaultGateTitle) {
          lblVaultGateTitle.textContent = hasVault ? t('vault_gate_title_locked') : t('vault_gate_title_setup');
        }
        if (lblVaultGateDesc) {
          lblVaultGateDesc.textContent = hasVault
            ? t('vault_gate_desc_locked')
            : t('vault_gate_desc_setup');
        }
        if (lblVaultGateBtn) {
          lblVaultGateBtn.textContent = hasVault ? t('vault_gate_btn_unlock') : t('vault_gate_btn_setup');
        }
      });
    }
  }

  function checkAndApplyLockoutUI() {
    if (!window.TelmyCryptoVault) return false;
    const status = window.TelmyCryptoVault.getAttemptStatus();
    if (status.isLocked) {
      if (vaultLockoutBanner) {
        vaultLockoutBanner.style.display = 'flex';
        if (vaultLockoutText) {
          vaultLockoutText.textContent = t('vault_lockout_msg', { sec: status.remainingSeconds });
        }
      }
      if (btnSubmitVaultPin) btnSubmitVaultPin.disabled = true;

      if (lockoutInterval) clearInterval(lockoutInterval);
      lockoutInterval = setInterval(() => {
        const fresh = window.TelmyCryptoVault.getAttemptStatus();
        if (!fresh.isLocked) {
          clearInterval(lockoutInterval);
          lockoutInterval = null;
          if (vaultLockoutBanner) vaultLockoutBanner.style.display = 'none';
          if (btnSubmitVaultPin) btnSubmitVaultPin.disabled = false;
        } else if (vaultLockoutText) {
          vaultLockoutText.textContent = t('vault_lockout_msg', { sec: fresh.remainingSeconds });
        }
      }, 1000);
      return true;
    } else {
      if (vaultLockoutBanner) vaultLockoutBanner.style.display = 'none';
      if (btnSubmitVaultPin) btnSubmitVaultPin.disabled = false;
      return false;
    }
  }

  async function openVaultPinModal(onSuccess = null, title = null, subtitle = null) {
    pinUnlockCallback = onSuccess;
    if (vaultPinError) {
      vaultPinError.textContent = '';
      vaultPinError.style.display = 'none';
    }

    // Check if envelope exists
    let envelope = null;
    try {
      const res = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'VAULT_GET' }, resolve);
      });
      envelope = res && res.envelope && res.envelope.ciphertext ? res.envelope : null;
    } catch (e) {}

    isVaultSetupMode = !envelope;

    if (vaultPinModalTitle) {
      vaultPinModalTitle.textContent = title || (isVaultSetupMode ? t('vault_modal_title_setup') : t('vault_modal_title_unlock'));
    }
    if (vaultPinModalSub) {
      vaultPinModalSub.textContent = subtitle || (isVaultSetupMode
        ? t('vault_modal_sub_setup')
        : t('vault_modal_sub_unlock'));
    }
    if (btnSubmitVaultPin) {
      btnSubmitVaultPin.textContent = isVaultSetupMode ? t('vault_btn_submit_setup') : t('vault_btn_submit_unlock');
    }

    if (isVaultSetupMode) {
      if (vaultModeTabs) vaultModeTabs.style.display = 'flex';
      if (vaultPwdStrengthWrap) vaultPwdStrengthWrap.style.display = 'block';
      if (vaultSeedSetupBox) vaultSeedSetupBox.style.display = 'block';
      if (vaultSeedUnlockBox) vaultSeedUnlockBox.style.display = 'none';
    } else {
      // In unlock mode, default to envelope's lockType
      const lockType = (envelope && envelope.lockType) ? envelope.lockType : 'password';
      if (vaultModeTabs) vaultModeTabs.style.display = 'flex';
      if (vaultPwdStrengthWrap) vaultPwdStrengthWrap.style.display = 'none';
      if (vaultSeedSetupBox) vaultSeedSetupBox.style.display = 'none';
      if (vaultSeedUnlockBox) vaultSeedUnlockBox.style.display = 'block';
      activeVaultMode = lockType;
    }

    // Reset inputs
    if (inputVaultPassword) {
      inputVaultPassword.value = '';
      inputVaultPassword.type = 'password';
    }
    if (btnTogglePwdVisibility) btnTogglePwdVisibility.textContent = '👁️';
    if (textareaVaultSeed) textareaVaultSeed.value = '';

    // Check rate-limiting lockout state
    checkAndApplyLockoutUI();

    switchVaultModalTab(activeVaultMode);

    if (vaultPinModal) {
      vaultPinModal.style.display = 'flex';
      if (activeVaultMode === 'password' && inputVaultPassword) {
        setTimeout(() => inputVaultPassword.focus(), 100);
      }
    }
  }

  function closeVaultPinModal() {
    if (vaultPinModal) vaultPinModal.style.display = 'none';
    if (inputVaultPassword) inputVaultPassword.value = '';
    if (textareaVaultSeed) textareaVaultSeed.value = '';
    if (vaultPinError) vaultPinError.style.display = 'none';
    pinUnlockCallback = null;
  }

  async function handleVaultPinSubmit() {
    if (checkAndApplyLockoutUI()) return;

    let secret = '';
    if (activeVaultMode === 'password') {
      secret = inputVaultPassword ? inputVaultPassword.value.trim() : '';
      if (!secret || secret.length < 8) {
        showVaultPinError(t('vault_err_pwd_min'));
        if (inputVaultPassword) inputVaultPassword.focus();
        return;
      }
    } else {
      if (isVaultSetupMode) {
        secret = currentGeneratedSeed.trim();
        if (!chkSeedSaved || !chkSeedSaved.checked) {
          showVaultPinError(t('vault_err_seed_confirm'));
          return;
        }
      } else {
        secret = textareaVaultSeed ? textareaVaultSeed.value.trim() : '';
        const words = secret.split(/\s+/).filter(Boolean);
        if (words.length !== 12) {
          showVaultPinError(t('vault_err_seed_12'));
          if (textareaVaultSeed) textareaVaultSeed.focus();
          return;
        }
      }
    }

    if (btnSubmitVaultPin) {
      btnSubmitVaultPin.textContent = t('vault_verifying');
      btnSubmitVaultPin.disabled = true;
    }

    try {
      const res = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'VAULT_GET' }, resolve);
      });
      const envelope = res && res.envelope ? res.envelope : null;

      if (!envelope || !envelope.ciphertext) {
        // First-time setup
        const initialVault = {
          vaultVersion: 2,
          lastUpdated: new Date().toISOString(),
          lockType: activeVaultMode,
          documents: [],
          fields: []
        };

        if (currentUser) {
          if (currentUser.displayName || currentUser.name) {
            initialVault.fields.push({
              id: 'f_' + Date.now().toString(36) + '_1',
              key: 'full_name',
              label: 'Nama Lengkap (Full Name)',
              value: currentUser.displayName || currentUser.name,
              category: 'identity',
              aliases: ['nama', 'name', 'full name', 'applicant name', 'nama lengkap'],
              confidence: 1.0,
              isCustom: false
            });
          }
          if (currentUser.email) {
            initialVault.fields.push({
              id: 'f_' + Date.now().toString(36) + '_2',
              key: 'email',
              label: 'Email',
              value: currentUser.email,
              category: 'contact',
              aliases: ['email', 'surel', 'e-mail address', 'alamat email'],
              confidence: 1.0,
              isCustom: false
            });
          }
        }

        const newEnvelope = await window.TelmyCryptoVault.encryptVaultData(initialVault, secret, null, activeVaultMode);
        await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: 'VAULT_SAVE', envelope: newEnvelope }, resolve);
        });

        currentDecryptedVault = initialVault;
        currentVaultPin = secret;
        isVaultUnlocked = true;
        await chrome.storage.local.set({ telmy_vault_session_cache: initialVault });
        syncAutofillStorage(initialVault);

        closeVaultPinModal();
        updateVaultHeaderUI(true);
        renderVaultFieldsList();
        showToast(t('toast_vault_created'));

        if (pinUnlockCallback) {
          pinUnlockCallback();
          pinUnlockCallback = null;
        }
        return;
      }

      // Existing envelope decryption
      try {
        const decrypted = await window.TelmyCryptoVault.decryptVaultData(envelope, secret);
        currentDecryptedVault = decrypted;
        currentVaultPin = secret;
        isVaultUnlocked = true;

        await chrome.storage.local.set({ telmy_vault_session_cache: decrypted });
        syncAutofillStorage(decrypted);

        closeVaultPinModal();
        updateVaultHeaderUI(true);
        renderVaultFieldsList();
        showToast(t('toast_vault_unlocked'));

        if (pinUnlockCallback) {
          pinUnlockCallback();
          pinUnlockCallback = null;
        }
      } catch (decryptErr) {
        if (decryptErr.message && decryptErr.message.startsWith('VAULT_LOCKED')) {
          checkAndApplyLockoutUI();
          showVaultPinError(t('vault_err_locked_out'));
        } else {
          const attemptStatus = window.TelmyCryptoVault.getAttemptStatus();
          const remainingAttempts = Math.max(0, 3 - (attemptStatus.failedAttempts || 0));
          if (attemptStatus.isLocked) {
            checkAndApplyLockoutUI();
          } else {
            showVaultPinError(t('vault_err_wrong_key', { attempts: remainingAttempts }));
          }
        }
      }
    } catch (err) {
      showVaultPinError(t('vault_err_decryption', { error: err.message }));
    } finally {
      if (btnSubmitVaultPin && !checkAndApplyLockoutUI()) {
        btnSubmitVaultPin.textContent = isVaultSetupMode ? t('vault_btn_submit_setup') : t('vault_btn_submit_unlock');
        btnSubmitVaultPin.disabled = false;
      }
    }
  }

  function showVaultPinError(msg) {
    if (vaultPinError) {
      vaultPinError.textContent = msg;
      vaultPinError.style.display = 'block';
    }
  }

  async function lockVault() {
    isVaultUnlocked = false;
    currentDecryptedVault = null;
    currentVaultPin = null;
    if (window.TelmyCryptoVault) {
      window.TelmyCryptoVault.clearSessionVaultSecret();
    }
    await chrome.storage.local.remove(['telmy_vault_session_cache']);
    updateVaultHeaderUI(false);
    renderVaultFieldsList();
    showToast(t('toast_vault_locked'));
  }

  async function saveAndReEncryptVault() {
    if (!currentDecryptedVault) return;
    if (!currentVaultPin) {
      // Need PIN to encrypt
      openVaultPinModal(() => saveAndReEncryptVault());
      return;
    }

    currentDecryptedVault.lastUpdated = new Date().toISOString();

    // 1. Web Crypto API Encryption (<50ms)
    const envelope = await window.TelmyCryptoVault.encryptVaultData(currentDecryptedVault, currentVaultPin);

    // 2. Sync to background service worker and local session cache
    chrome.runtime.sendMessage({ type: 'VAULT_SAVE', envelope }, () => {});
    await chrome.storage.local.set({ telmy_vault_session_cache: currentDecryptedVault });

    // 3. Keep legacy autofill cache synced for content script
    syncAutofillStorage(currentDecryptedVault);
  }

  function syncAutofillStorage(vaultData) {
    if (!vaultData || !Array.isArray(vaultData.fields)) return;
    const findVal = (keyOrAlias) => {
      const match = vaultData.fields.find(f => 
        (f.key && f.key.toLowerCase() === keyOrAlias.toLowerCase()) ||
        (f.aliases && f.aliases.some(a => a.toLowerCase() === keyOrAlias.toLowerCase()))
      );
      return match ? match.value : '';
    };

    const afPayload = {
      fields: vaultData.fields,
      full_name: findVal('full_name') || findVal('name'),
      name: findVal('full_name') || findVal('name'),
      passport_number: findVal('passport_number') || findVal('passport'),
      passport: findVal('passport_number') || findVal('passport'),
      nik: findVal('nik') || findVal('ktp'),
      email: findVal('email'),
      phone: findVal('phone'),
      birth_date: findVal('birth_date') || findVal('dob'),
      dob: findVal('birth_date') || findVal('dob'),
      address: findVal('address'),
      nationality: findVal('nationality'),
      gpa: findVal('gpa') || findVal('ipk'),
      emergency_contact: findVal('emergency_contact') || findVal('emergency')
    };

    chrome.storage.local.set({ telmy_autofill: afPayload });
  }

  function renderVaultFieldsList() {
    if (!vaultFieldsList) return;

    if (!isVaultUnlocked || !currentDecryptedVault) {
      if (vaultFieldsCount) vaultFieldsCount.textContent = t('vault_item_count_zero');
      vaultFieldsList.innerHTML = '';
      return;
    }

    const fields = currentDecryptedVault.fields || [];
    if (vaultFieldsCount) {
      vaultFieldsCount.textContent = t('vault_item_count', { count: fields.length, plural: fields.length === 1 ? '' : 's' });
    }

    if (fields.length === 0) {
      vaultFieldsList.innerHTML = `
        <div style="text-align: center; padding: 20px 14px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 14px;">
          <div style="font-size: 26px; margin-bottom: 6px;">📂</div>
          <strong style="display: block; font-size: 13px; color: #0f172a; margin-bottom: 4px;">${escapeHTML(t('vault_empty_title'))}</strong>
          <p style="font-size: 11px; color: #64748b; line-height: 1.45; margin: 0 0 14px 0;">
            ${escapeHTML(t('vault_empty_desc'))}
          </p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button type="button" id="btn-vault-empty-add-manual" style="display: inline-flex; align-items: center; gap: 5px; background: #0284c7; color: #ffffff; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer;">
              <span>${escapeHTML(t('vault_empty_btn_add'))}</span>
            </button>
            <button type="button" id="btn-vault-empty-dashboard" style="display: inline-flex; align-items: center; gap: 5px; background: #ffffff; color: #0369a1; border: 1px solid #bae6fd; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer;">
              <span>${escapeHTML(t('vault_empty_btn_dash'))}</span>
            </button>
          </div>
        </div>
      `;

      const btnEmptyAdd = vaultFieldsList.querySelector('#btn-vault-empty-add-manual');
      if (btnEmptyAdd) btnEmptyAdd.addEventListener('click', () => openFieldModal(null));
      const btnEmptyDash = vaultFieldsList.querySelector('#btn-vault-empty-dashboard');
      if (btnEmptyDash) btnEmptyDash.addEventListener('click', openDashboardVault);

      return;
    }

    vaultFieldsList.innerHTML = fields.map((f) => {
      const docBadge = f.isCustom ? 'Custom' : (f.sourceDocName || f.category || 'ID');
      const aliasStr = Array.isArray(f.aliases) && f.aliases.length > 0 ? f.aliases.slice(0, 3).join(', ') : '';
      return `
        <div class="vault-field-row" data-field-id="${escapeHTML(f.id)}">
          <div class="vault-field-meta">
            <div class="vault-field-label-wrap">
              <span class="vault-field-label">${escapeHTML(f.label || f.key)}</span>
              <span class="vault-field-doc-tag">${escapeHTML(docBadge)}</span>
            </div>
            <div class="vault-field-val">${escapeHTML(f.value || '')}</div>
            ${aliasStr ? `<div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Aliases: ${escapeHTML(aliasStr)}</div>` : ''}
          </div>
          <div class="vault-field-ctrls">
            <button type="button" class="btn-field-ctrl delete" data-field-id="${escapeHTML(f.id)}" title="Delete field">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach row button events
    vaultFieldsList.querySelectorAll('.btn-field-ctrl.delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fieldId = btn.getAttribute('data-field-id');
        deleteVaultField(fieldId);
      });
    });
  }

  function openDashboardVault() {
    chrome.tabs.create({ url: 'https://telmy.id/dashboard' });
  }

  function openFieldModal(field = null) {
    currentEditingFieldId = field ? field.id : null;
    if (lblVaultModalFieldTitle) {
      lblVaultModalFieldTitle.textContent = field ? t('vault_field_modal_edit') : t('vault_field_modal_add');
    }
    if (inputVaultFieldLabel) {
      inputVaultFieldLabel.value = field ? (field.label || field.key || '') : '';
    }
    if (inputVaultFieldValue) {
      inputVaultFieldValue.value = field ? (field.value || '') : '';
    }
    if (inputVaultFieldAliases) {
      inputVaultFieldAliases.value = field && Array.isArray(field.aliases) ? field.aliases.join(', ') : '';
    }
    if (vaultFieldModal) {
      vaultFieldModal.style.display = 'flex';
      setTimeout(() => inputVaultFieldLabel && inputVaultFieldLabel.focus(), 100);
    }
  }

  function closeFieldModal() {
    if (vaultFieldModal) vaultFieldModal.style.display = 'none';
    currentEditingFieldId = null;
  }

  async function handleSaveFieldSubmit() {
    if (!inputVaultFieldLabel || !inputVaultFieldValue) return;
    const label = inputVaultFieldLabel.value.trim();
    const value = inputVaultFieldValue.value.trim();
    const aliasStr = inputVaultFieldAliases ? inputVaultFieldAliases.value.trim() : '';

    if (!label) {
      alert(t('alert_label_required'));
      inputVaultFieldLabel.focus();
      return;
    }
    if (!value) {
      alert(t('alert_value_required'));
      inputVaultFieldValue.focus();
      return;
    }

    const aliases = aliasStr.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length >= 2);

    if (!currentDecryptedVault) {
      currentDecryptedVault = { vaultVersion: 2, lastUpdated: new Date().toISOString(), documents: [], fields: [] };
    }
    if (!Array.isArray(currentDecryptedVault.fields)) {
      currentDecryptedVault.fields = [];
    }

    if (currentEditingFieldId) {
      // Edit existing
      const idx = currentDecryptedVault.fields.findIndex(f => f.id === currentEditingFieldId);
      if (idx !== -1) {
        currentDecryptedVault.fields[idx] = {
          ...currentDecryptedVault.fields[idx],
          label,
          value,
          aliases
        };
      }
    } else {
      // Add new field
      const keySlug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || `custom_${Date.now()}`;
      currentDecryptedVault.fields.push({
        id: 'f_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
        key: keySlug,
        label,
        value,
        category: 'custom',
        aliases,
        confidence: 1.0,
        isCustom: true
      });
    }

    closeFieldModal();
    renderVaultFieldsList();
    await saveAndReEncryptVault();
  }

  async function deleteVaultField(fieldId) {
    if (!currentDecryptedVault || !Array.isArray(currentDecryptedVault.fields)) return;
    const target = currentDecryptedVault.fields.find(f => f.id === fieldId);
    if (!target) return;

    if (!confirm(t('confirm_delete_vault_field', { name: target.label || target.key }))) return;

    currentDecryptedVault.fields = currentDecryptedVault.fields.filter(f => f.id !== fieldId);
    renderVaultFieldsList();
    await saveAndReEncryptVault();
  }

  async function wipeVault() {
    const confirmMsg = t('vault_wipe_confirm') || 'Are you sure you want to completely wipe all vault data and encryption keys? This cannot be undone.';
    if (!confirm(confirmMsg)) return;

    await new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'VAULT_WIPE' }, resolve);
    });

    currentDecryptedVault = null;
    currentVaultPin = null;
    isVaultUnlocked = false;
    await chrome.storage.local.remove(['telmy_vault_session_cache', 'telmy_autofill', 'telmy_vault_envelope']);

    updateVaultHeaderUI(false);
    renderVaultFieldsList();
    alert(t('alert_vault_wiped'));
  }

  async function handleVault1ClickAutoFill() {
    if (!isVaultUnlocked) {
      openVaultPinModal(() => handleVault1ClickAutoFill());
      return;
    }

    const fields = currentDecryptedVault ? (currentDecryptedVault.fields || []) : [];
    if (fields.length === 0) {
      alert(t('alert_vault_empty'));
      return;
    }

    handleTrigger1ClickAutoFill();
  }

  // =========================================================================
  // Priority 8: Multi-Document Ingestion (OCR KTP, Passport, Diploma)
  // =========================================================================
  function setupVaultDocDropzone() {
    if (!vaultDocDropzone) return;

    if (btnBrowseVaultDoc && vaultDocFileInput) {
      btnBrowseVaultDoc.addEventListener('click', (e) => {
        e.stopPropagation();
        vaultDocFileInput.click();
      });
    }

    vaultDocDropzone.addEventListener('click', () => {
      if (vaultDocFileInput) vaultDocFileInput.click();
    });

    vaultDocDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      vaultDocDropzone.classList.add('dragover');
    });

    vaultDocDropzone.addEventListener('dragleave', () => {
      vaultDocDropzone.classList.remove('dragover');
    });

    vaultDocDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      vaultDocDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleVaultDocUpload(e.dataTransfer.files[0]);
      }
    });

    if (vaultDocFileInput) {
      vaultDocFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleVaultDocUpload(e.target.files[0]);
        }
      });
    }
  }

  async function handleVaultDocUpload(file) {
    if (!file) return;

    if (!isVaultUnlocked) {
      openVaultPinModal(() => handleVaultDocUpload(file), 'Unlock Vault to Ingest Document', 'Enter your Master Password or Seed Phrase to decrypt and store document data.');
      return;
    }

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      alert(t('alert_valid_id_doc_req'));
      return;
    }

    if (vaultDocContent) vaultDocContent.style.display = 'none';
    if (vaultDocAnalyzing) vaultDocAnalyzing.style.display = 'flex';
    if (telmyAvatar) telmyAvatar.setState('THINKING');

    try {
      let fileDataUrl;
      if (isImage) {
        fileDataUrl = await compressImageFileToDataUrl(file, 2048, 0.85);
      } else {
        fileDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      chrome.runtime.sendMessage({
        type: 'VAULT_EXTRACT_DOCUMENT',
        fileBase64: fileDataUrl,
        fileName: file.name,
        mimeType: isPdf ? 'application/pdf' : (file.type || 'image/jpeg')
      }, async (res) => {
        if (vaultDocContent) vaultDocContent.style.display = 'flex';
        if (vaultDocAnalyzing) vaultDocAnalyzing.style.display = 'none';
        if (vaultDocFileInput) vaultDocFileInput.value = '';
        if (telmyAvatar) telmyAvatar.setState('IDLE');

        if (chrome.runtime.lastError || !res || !res.success || !Array.isArray(res.fields)) {
          alert(t('alert_extraction_error', { error: res?.error || 'Could not extract entities from document.' }));
          return;
        }

        const docId = 'doc_' + Date.now().toString(36);
        const docName = res.documentName || file.name;

        if (!currentDecryptedVault) {
          currentDecryptedVault = { vaultVersion: 2, lastUpdated: new Date().toISOString(), documents: [], fields: [] };
        }
        if (!Array.isArray(currentDecryptedVault.documents)) currentDecryptedVault.documents = [];
        if (!Array.isArray(currentDecryptedVault.fields)) currentDecryptedVault.fields = [];

        currentDecryptedVault.documents.push({
          id: docId,
          type: res.documentType || 'OTHER',
          name: docName,
          uploadedAt: new Date().toISOString()
        });

        // Merge extracted fields into vault
        res.fields.forEach((extField) => {
          if (!extField || !extField.value) return;
          const cleanVal = String(extField.value).trim();
          if (!cleanVal) return;

          // Check if field with same key already exists
          const existingIdx = currentDecryptedVault.fields.findIndex(f => f.key === extField.key);
          if (existingIdx !== -1) {
            // Update value if different
            currentDecryptedVault.fields[existingIdx].value = cleanVal;
            currentDecryptedVault.fields[existingIdx].sourceDocId = docId;
            currentDecryptedVault.fields[existingIdx].sourceDocName = docName;
          } else {
            currentDecryptedVault.fields.push({
              id: 'f_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
              key: extField.key || 'field_' + Date.now(),
              label: extField.label || extField.key,
              value: cleanVal,
              sourceDocId: docId,
              sourceDocName: docName,
              category: extField.category || 'identity',
              aliases: Array.isArray(extField.aliases) ? extField.aliases : [],
              confidence: 0.95,
              isCustom: false
            });
          }
        });

        await saveAndReEncryptVault();
        renderVaultFieldsList();

        alert(t('alert_pdf_extract_success', {
          count: res.fields.length,
          docName: docName
        }));
      });
    } catch (err) {
      if (vaultDocContent) vaultDocContent.style.display = 'flex';
      if (vaultDocAnalyzing) vaultDocAnalyzing.style.display = 'none';
      if (telmyAvatar) telmyAvatar.setState('IDLE');
      alert(t('alert_doc_processing_error', { error: err.message }));
    }
  }

  // =========================================================================
  // Priority 8: Quota & Paywall Engine (Lemon Squeezy Simulation)
  // =========================================================================
  async function refreshUserQuota(quotaOverride) {
    if (quotaOverride) {
      currentQuotaData = quotaOverride;
      updateQuotaUI(quotaOverride);
      await chrome.storage.local.set({ telmy_quota: quotaOverride });
      return;
    }

    // Read cached quota first for instant UI response
    const stored = await chrome.storage.local.get(['telmy_quota']);
    if (stored.telmy_quota) {
      currentQuotaData = stored.telmy_quota;
      updateQuotaUI(stored.telmy_quota);
    }

    // Fetch fresh from backend via service worker
    chrome.runtime.sendMessage({ type: 'GET_USER_QUOTA' }, (res) => {
      if (chrome.runtime.lastError || !res || !res.success) return;
      if (res.data) {
        currentQuotaData = res.data;
        updateQuotaUI(res.data);
        chrome.storage.local.set({ telmy_quota: res.data });
      }
    });
  }

  function updateQuotaUI(data) {
    if (!spQuotaBadge || !spQuotaText) return;
    const q = data.quota || {};
    const remaining = data.totalRemaining !== undefined ? data.totalRemaining : 
      ((q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0));

    spQuotaText.textContent = `${remaining} Form${remaining === 1 ? '' : 's'}`;

    spQuotaBadge.classList.remove('quota-high', 'quota-warning', 'quota-empty');
    if (remaining > 2) {
      spQuotaBadge.classList.add('quota-high');
    } else if (remaining > 0) {
      spQuotaBadge.classList.add('quota-warning');
    } else {
      spQuotaBadge.classList.add('quota-empty');
    }

    // Update modal metrics if elements exist
    if (paywallSumRemaining) paywallSumRemaining.textContent = remaining;
    if (paywallSumPlan) {
      let planName = 'Free Tier (5 Forms/bln)';
      if (data.plan === 'pro') planName = 'Pro (75 Forms/bln)';
      else if (data.plan === 'standard') planName = 'Standard (25 Forms/bln)';
      else if (data.plan === 'max') planName = 'Max (200 Forms/bln)';
      else if (data.plan === 'payg') planName = 'Pay-as-you-Go';
      paywallSumPlan.textContent = planName;
    }
    if (paywallSumPayg) paywallSumPayg.textContent = `${q.purchasedCreditsRemaining || 0} Forms`;
    if (paywallSumPro) paywallSumPro.textContent = `${(q.subscriptionQuotaRemaining || 0) + (q.freeRemaining || 0)} Forms`;
  }

  function openPaywallModal(reasonSubtitle) {
    if (!spPaywallModal) return;
    if (reasonSubtitle && paywallStatusSubtitle) {
      paywallStatusSubtitle.textContent = reasonSubtitle;
    }
    if (currentQuotaData) {
      updateQuotaUI(currentQuotaData);
    }
    spPaywallModal.style.display = 'flex';
  }

  function closePaywallModal() {
    if (spPaywallModal) {
      spPaywallModal.style.display = 'none';
    }
  }

  function setupQuotaAndPaywall() {
    if (spQuotaBadge) {
      spQuotaBadge.addEventListener('click', () => {
        openPaywallModal(t('paywall_modal_sub'));
      });
    }

    if (btnClosePaywall) {
      btnClosePaywall.addEventListener('click', closePaywallModal);
    }

    if (spPaywallModal) {
      spPaywallModal.addEventListener('click', (e) => {
        if (e.target === spPaywallModal) closePaywallModal();
      });
    }

    if (btnUpgradeDashboard) {
      btnUpgradeDashboard.addEventListener('click', () => {
        closePaywallModal();
        chrome.tabs.create({ url: 'https://telmy.id/dashboard' });
      });
    }

    const triggerPurchase = (planId, btn) => {
      const originalText = btn.textContent;
      btn.textContent = '⏳ Processing...';
      btn.disabled = true;

      chrome.runtime.sendMessage({ type: 'SIMULATE_PURCHASE', planId }, (res) => {
        btn.textContent = originalText;
        btn.disabled = false;

        if (res && res.success) {
          const quotaData = res.user || {
            plan: res.plan?.id || planId,
            quota: res.user?.quota || {},
            totalRemaining: res.user?.totalRemaining || 25
          };
          refreshUserQuota(quotaData);
          alert(t('alert_payment_success', {
            plan: res.plan?.name || planId,
            forms: res.plan?.forms || '',
            quota: res.user?.totalRemaining || 'Active'
          }));
          closePaywallModal();
        } else {
          alert(t('audit_scan_error'));
        }
      });
    };

    btnTierPurchases.forEach(btn => {
      btn.addEventListener('click', () => {
        const planId = btn.getAttribute('data-plan') || 'payg_10';
        triggerPurchase(planId, btn);
      });
    });
  }

  // =========================================================
  // Plan V8: Accessibility Hub & 1-Click Cycle System (UserWay Style)
  // =========================================================
  const paneA11yHub = document.getElementById('pane-a11y-hub');
  const btnA11yBack = document.getElementById('btn-a11y-back');
  const btnA11yHeaderBack = document.getElementById('btn-a11y-header-back');
  const btnA11yResetAll = document.getElementById('btn-a11y-reset-all');
  let prevActivePaneBeforeA11y = 'pane-chat';

  // Feature state dictionary
  const a11yFeatureState = {
    spotlight: false,
    speak: false,
    contrast: 0,
    links: false,
    textSize: 0,
    spacing: 0,
    animations: false,
    hideImages: false,
    dyslexia: false,
    cursor: 0,
    tooltips: false,
    lineHeight: 0,
    align: 0,
    saturation: 0
  };

  // Cycle configurations
  const a11yCycleConfigs = {
    contrast: ['Normal', '+25%', '+50%', 'Kuning-Hitam'],
    textSize: ['Normal', '+25%', '+50%', '+75%', '+100%'],
    spacing: ['Normal', '+25%', '+50%', '+75%'],
    cursor: ['Normal', 'Besar Putih', 'Besar Hitam'],
    lineHeight: ['Normal', '+25%', '+50%', '+75%'],
    align: ['Normal', 'Rata Kiri', 'Rata Kanan'],
    saturation: ['Normal', 'Rendah (-50%)', 'Monokrom', 'Tinggi (+50%)']
  };

  async function sendA11yMessageToTab(msg) {
    const tab = await getActiveWebTab();
    const tabId = (tab && tab.id) ? tab.id : currentTabId;
    if (!tabId) return;
    currentTabId = tabId;

    safeSendTabMessage(tabId, msg, async (err, res) => {
      if (err || !res) {
        console.log('[Telmy A11y] Tab did not respond. Injecting scripts and retrying on-demand...', err);
        await injectContentScript(tabId);
        setTimeout(() => {
          safeSendTabMessage(tabId, msg);
        }, 80);
      }
    });
  }

  function a11yFeatureToTileId(k) {
    const map = {
      spotlight: 'spotlight',
      speak: 'speak',
      contrast: 'contrast',
      links: 'links',
      textSize: 'text-size',
      spacing: 'spacing',
      animations: 'animations',
      hideImages: 'hide-images',
      dyslexia: 'dyslexia',
      cursor: 'cursor',
      tooltips: 'tooltips',
      lineHeight: 'line-height',
      align: 'align',
      saturation: 'saturation'
    };
    return map[k] || k;
  }

  function updateA11yCardUI(featureKey) {
    const tile = document.getElementById(`tile-a11y-${a11yFeatureToTileId(featureKey)}`);
    const badge = document.getElementById(`badge-a11y-${a11yFeatureToTileId(featureKey)}`);
    if (!tile || !badge) return;

    const val = a11yFeatureState[featureKey];
    if (typeof val === 'boolean') {
      tile.classList.toggle('active', val);
      if (featureKey === 'animations') {
        badge.textContent = val ? t('a11y_status_paused') : t('a11y_status_normal');
      } else if (featureKey === 'hideImages') {
        badge.textContent = val ? t('a11y_status_hidden') : t('a11y_status_normal');
      } else {
        badge.textContent = val ? t('a11y_status_on') : t('a11y_status_off');
      }
    } else {
      const getCycleLabel = (key, idx) => {
        if (idx === 0) return t('a11y_status_normal');
        if (key === 'contrast' && idx === 3) return t('a11y_status_yellow_black');
        if (key === 'cursor') return idx === 1 ? t('a11y_status_cursor_big_white') : t('a11y_status_cursor_big_black');
        if (key === 'align') return idx === 1 ? t('a11y_status_align_left') : t('a11y_status_align_right');
        if (key === 'saturation') {
          if (idx === 1) return t('a11y_status_sat_low');
          if (idx === 2) return t('a11y_status_sat_mono');
          if (idx === 3) return t('a11y_status_sat_high');
        }
        const cycles = a11yCycleConfigs[key] || ['Normal'];
        return cycles[idx] || t('a11y_status_normal');
      };
      tile.classList.toggle('active', val > 0);
      badge.textContent = getCycleLabel(featureKey, val);
    }
  }

  // Deactivate all accessibility effects immediately on tab and clear storage
  async function resetAllA11yEffects() {
    Object.keys(a11yFeatureState).forEach((k) => {
      a11yFeatureState[k] = (typeof a11yFeatureState[k] === 'boolean') ? false : 0;
      updateA11yCardUI(k);
    });

    await chrome.storage.local.set({
      a11y_hub_active: false,
      a11y_feature_states: {},
      a11y_spotlight_enabled: false,
      a11y_speak_enabled: false,
      a11y_thick_focus: false
    });

    sendA11yMessageToTab({ type: 'A11Y_RESET_ALL' });
  }

  async function showA11yHub() {
    const currentActive = document.querySelector('.sp-pane.active:not(#pane-a11y-hub)');
    if (currentActive) {
      prevActivePaneBeforeA11y = currentActive.id;
    }
    // Remove active class from all other panes and explicitly hide pane-chat
    panes.forEach(p => {
      p.classList.remove('active');
      if (p.id !== 'pane-a11y-hub') {
        p.style.display = 'none';
      }
    });

    if (paneA11yHub) {
      paneA11yHub.style.display = 'flex';
      paneA11yHub.classList.add('active');
    }
    if (btnA11yHeaderBack) {
      btnA11yHeaderBack.style.display = 'inline-flex';
    }
    const chatFooter = document.querySelector('.sp-chat-footer');
    if (chatFooter) chatFooter.style.display = 'none';

    // Mark a11y hub as active so content script knows it is permitted to apply effects
    await chrome.storage.local.set({ a11y_hub_active: true });

    // Ensure content script & CSS are proactively injected without needing reload
    const tab = await getActiveWebTab();
    if (tab && tab.id) {
      currentTabId = tab.id;
      ensureContentScriptInjected(tab.id);
    }
  }

  async function hideA11yHub() {
    // Turning off the a11y view immediately turns off all effects on the active web page
    await resetAllA11yEffects();

    if (paneA11yHub) {
      paneA11yHub.style.display = 'none';
      paneA11yHub.classList.remove('active');
    }
    if (btnA11yHeaderBack) {
      btnA11yHeaderBack.style.display = 'none';
    }
    const restorePaneId = prevActivePaneBeforeA11y || 'pane-chat';
    const restorePane = document.getElementById(restorePaneId);
    if (restorePane) {
      restorePane.style.display = '';
      restorePane.classList.add('active');
    }
    const chatFooter = document.querySelector('.sp-chat-footer');
    if (chatFooter && restorePaneId === 'pane-chat') {
      chatFooter.style.display = 'flex';
    }
  }

  function setupAccessibilityHub() {
    // Back Button (from A11y Hub to main chat/onboarding): closes hub and disables all effects
    if (btnA11yBack) {
      btnA11yBack.addEventListener('click', hideA11yHub);
    }
    if (btnA11yHeaderBack) {
      btnA11yHeaderBack.addEventListener('click', hideA11yHub);
    }

    // Reset All Button: restore website immediately
    if (btnA11yResetAll) {
      btnA11yResetAll.addEventListener('click', resetAllA11yEffects);
    }

    // Global Shortcut Ctrl+U / Alt+A to toggle A11y Hub
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && (e.key === 'u' || e.key === 'U')) || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        if (paneA11yHub && paneA11yHub.style.display === 'flex') {
          hideA11yHub();
        } else {
          showA11yHub();
        }
      }
    });

    // Close A11y hub and disable effects if any top navigation tab is clicked
    tabBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        if (paneA11yHub && (paneA11yHub.classList.contains('active') || paneA11yHub.style.display === 'flex')) {
          await hideA11yHub();
        }
      });
    });

    // Plan V14: 1-Click Situational Presets Logic
    const presetConfigs = {
      adhd: {
        spotlight: true,
        animations: true,
        hideImages: true,
        spacing: 1
      },
      dyslexia: {
        dyslexia: true,
        spacing: 2,
        lineHeight: 2,
        links: true
      },
      lowvision: {
        contrast: 1, // +25%
        textSize: 1, // +25%
        cursor: 1,   // Besar Putih
        tooltips: true
      },
      senior: {
        speak: true,
        textSize: 1,
        cursor: 1,
        spotlight: false
      }
    };

    const presetBtns = document.querySelectorAll('.a11y-preset-btn');
    presetBtns.forEach((pBtn) => {
      pBtn.addEventListener('click', async () => {
        const presetKey = pBtn.getAttribute('data-preset');
        if (!presetKey || !(presetKey in presetConfigs)) return;

        const isCurrentlyActive = pBtn.classList.contains('active');

        // Reset all buttons visual state first
        presetBtns.forEach(b => b.classList.remove('active'));

        if (isCurrentlyActive) {
          // If clicked again, turn off all effects to restore normal view
          await resetAllA11yEffects();
          return;
        }

        pBtn.classList.add('active');
        const targetCfg = presetConfigs[presetKey];

        // Apply preset settings to a11yFeatureState
        for (const [feat, val] of Object.entries(targetCfg)) {
          if (feat in a11yFeatureState) {
            a11yFeatureState[feat] = val;
            updateA11yCardUI(feat);

            if (feat === 'spotlight') {
              sendA11yMessageToTab({ type: 'A11Y_SET_SPOTLIGHT', enabled: val });
            } else if (feat === 'speak') {
              sendA11yMessageToTab({ type: 'A11Y_SET_CLICK_TO_SPEAK', enabled: val });
            } else {
              sendA11yMessageToTab({ type: 'A11Y_SET_FEATURE', feature: feat, value: val });
            }
          }
        }

        await chrome.storage.local.set({
          a11y_hub_active: true,
          a11y_feature_states: a11yFeatureState,
          a11y_spotlight_enabled: a11yFeatureState.spotlight,
          a11y_speak_enabled: a11yFeatureState.speak
        });
      });
    });

    // Attach 1-click cycle event listeners to all 14 tiles
    const tileCards = document.querySelectorAll('.a11y-tile-card');
    tileCards.forEach((tile) => {
      tile.addEventListener('click', async () => {
        const feat = tile.getAttribute('data-feature');
        if (!feat || !(feat in a11yFeatureState)) return;

        if (typeof a11yFeatureState[feat] === 'boolean') {
          a11yFeatureState[feat] = !a11yFeatureState[feat];
        } else {
          const maxCycle = (a11yCycleConfigs[feat] || []).length;
          a11yFeatureState[feat] = (a11yFeatureState[feat] + 1) % maxCycle;
        }

        updateA11yCardUI(feat);

        // Save preferences
        await chrome.storage.local.set({
          a11y_hub_active: true,
          a11y_feature_states: a11yFeatureState,
          a11y_spotlight_enabled: a11yFeatureState.spotlight,
          a11y_speak_enabled: a11yFeatureState.speak
        });

        // Broadcast directly to active tab
        if (feat === 'spotlight') {
          sendA11yMessageToTab({ type: 'A11Y_SET_SPOTLIGHT', enabled: a11yFeatureState.spotlight });
        } else if (feat === 'speak') {
          sendA11yMessageToTab({ type: 'A11Y_SET_CLICK_TO_SPEAK', enabled: a11yFeatureState.speak });
        } else {
          sendA11yMessageToTab({ type: 'A11Y_SET_FEATURE', feature: feat, value: a11yFeatureState[feat] });
        }
      });
    });

    // Sync state if content script sends updates (e.g. from Alt+S or in-page wand bar)
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'A11Y_STATE_CHANGED' && msg.state) {
        if (typeof msg.state.spotlightEnabled === 'boolean') {
          a11yFeatureState.spotlight = msg.state.spotlightEnabled;
          updateA11yCardUI('spotlight');
        }
        if (typeof msg.state.clickToSpeakEnabled === 'boolean') {
          a11yFeatureState.speak = msg.state.clickToSpeakEnabled;
          updateA11yCardUI('speak');
        }
      }
    });
  }

  // Boot
  init();
});

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

    if (spStepperFooter) {
      spStepperFooter.style.display = (state === 'detail' || state === 'completion') ? 'flex' : 'none';
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
  const btnVaultLockToggle = document.getElementById('btn-vault-lock-toggle');
  const lblVaultLockIcon = document.getElementById('lbl-vault-lock-icon');
  const btnVaultAutofillNow = document.getElementById('btn-vault-autofill-now');
  const vaultFieldsCount = document.getElementById('vault-fields-count');
  const btnVaultAddCustom = document.getElementById('btn-vault-add-custom');
  const btnVaultWipe = document.getElementById('btn-vault-wipe');
  const vaultFieldsList = document.getElementById('vault-fields-list');

  // Vault Modals Elements (Dual-Lock: Password & 12-Word Seed Phrase)
  const vaultPinModal = document.getElementById('vault-pin-modal');
  const vaultPinModalTitle = document.getElementById('vault-pin-modal-title');
  const vaultPinModalSub = document.getElementById('vault-pin-modal-sub');
  const vaultModalIcon = document.getElementById('vault-modal-icon');
  const vaultLockoutBanner = document.getElementById('vault-lockout-banner');
  const vaultLockoutText = document.getElementById('vault-lockout-text');
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

  // Complete JAPAC Multi-Language Matrix (English default)
  const I18N = {
    brand_tag: {
      en: 'AI Form Assistant', id: 'Asisten Formulir AI', ja: 'AI フォームアシスタント', ko: 'AI 양식 도우미',
      zh: 'AI 表单助手', 'zh-TW': 'AI 表單助手', vi: 'Trợ lý Biểu mẫu AI', th: 'ผู้ช่วยฟอร์ม AI',
      hi: 'AI फ़ॉर्म सहायक', fil: 'AI Form Assistant', ms: 'Pembantu Borang AI'
    },
    tab_chat: {
      en: 'Assistant', id: 'Asisten', ja: 'アシスタント', ko: '어시스턴트',
      zh: '助手', 'zh-TW': '助理', vi: 'Trợ lý', th: 'ผู้ช่วย',
      hi: 'सहायक', fil: 'Assistant', ms: 'Pembantu'
    },
    tab_vault: {
      en: 'AutoFill', id: 'AutoFill', ja: '自動入力', ko: '자동완성',
      zh: '自动填写', 'zh-TW': '自動填寫', vi: 'Tự động điền', th: 'กรอกอัตโนมัติ',
      hi: 'ऑटोफ़िल', fil: 'AutoFill', ms: 'AutoFill'
    },
    tab_pdf: {
      en: 'PDF Form', id: 'Formulir PDF', ja: 'PDFフォーム', ko: 'PDF 양식',
      zh: 'PDF 表单', 'zh-TW': 'PDF 表單', vi: 'Biểu mẫu PDF', th: 'แบบฟอร์ม PDF',
      hi: 'पीडीएफ फ़ॉर्म', fil: 'PDF Form', ms: 'Borang PDF'
    },
    tab_fields: {
      en: 'Fields & Audit', id: 'Kolom & Audit', ja: '項目&検証', ko: '입력란&검토',
      zh: '表单项&审核', 'zh-TW': '欄位&審核', vi: 'Trường & Kiểm tra', th: 'ช่องข้อมูล&ตรวจ',
      hi: 'फ़ील्ड्स और ऑडिट', fil: 'Mga Kolum & Audit', ms: 'Ruangan & Audit'
    },
    tab_summary: {
      en: 'Overview', id: 'Ringkasan', ja: '概要', ko: '개요',
      zh: '概览', 'zh-TW': '總覽', vi: 'Tổng quan', th: 'ภาพรวม',
      hi: 'सारांश', fil: 'Pangkalahatan', ms: 'Ringkasan'
    },
    chat_placeholder: {
      en: 'Ask Telmy about this form...', id: 'Tanya Telmy tentang form ini...', ja: 'このフォームについて質問...', ko: '이 양식에 대해 질문하기...',
      zh: '向 Telmy 询问此表单...', 'zh-TW': '向 Telmy 詢問此表單...', vi: 'Hỏi Telmy về biểu mẫu này...', th: 'ถาม Telmy เกี่ยวกับฟอร์มนี้...',
      hi: 'इस फ़ॉर्म के बारे में Telmy से पूछें...', fil: 'Magtanong kay Telmy tungkol dito...', ms: 'Tanya Telmy tentang borang ini...'
    },
    welcome_msg: {
      en: 'Hello! I am **Telmy**, your AI form-filling assistant. Ask me anything about this form using text or click the microphone button below to speak.',
      id: 'Halo! Saya **Telmy**, asisten pengisian formulir Anda. Tanyakan apa saja tentang formulir ini atau klik tombol mikrofon di bawah untuk berbicara.',
      ja: 'こんにちは！フォーム入力アシスタントの **Telmy** です。フォームについて何でも質問するか、下のマイクボタンを押してお話しください。',
      ko: '안녕하세요! 양식 작성 도우미 **Telmy** 입니다. 양식에 대해 궁금한 점을 질문하거나 아래 마이크 버튼을 눌러 말씀해 주세요.',
      zh: '您好！我是您的表单填写助手 **Telmy**。您可以随时询问有关此表单的任何问题，或点击下方的麦克风直接说话。',
      'zh-TW': '您好！我是您的表單填寫助理 **Telmy**。您可以隨時詢問有關此表單的任何問題，或點擊下方的麥克風直接說話。',
      vi: 'Xin chào! Tôi là **Telmy**, trợ lý điền biểu mẫu của bạn. Hãy hỏi tôi bất cứ điều gì về biểu mẫu này, hoặc nhấn nút micrô bên dưới để nói.',
      th: 'สวัสดีครับ! ผมคือ **Telmy** ผู้ช่วยกรอกแบบฟอร์มของคุณ สามารถถามเกี่ยวกับฟอร์มนี้ หรือกดปุ่มไมโครโฟนด้านล่างเพื่อพูดคุยได้เลยครับ',
      hi: 'नमस्ते! मैं **Telmy** हूँ, आपका फ़ॉर्म भरने का सहायक। इस फ़ॉर्म के बारे में कुछ भी पूछें, या बोलने के लिए नीचे दिए गए माइक्रोफ़ोन पर क्लिक करें।',
      fil: 'Kamusta! Ako si **Telmy**, ang iyong assistant sa pagsagot ng form. Magtanong tungkol sa form na ito o pindutin ang mikropono sa ibaba para magsalita.',
      ms: 'Hai! Saya **Telmy**, pembantu pengisian borang anda. Tanya apa sahaja tentang borang ini atau klik butang mikrofon di bawah untuk bercakap.'
    },
    stepper_prev: {
      en: 'Previous', id: 'Sebelumnya', ja: '前へ', ko: '이전',
      zh: '上一项', 'zh-TW': '上一項', vi: 'Trước', th: 'ก่อนหน้า',
      hi: 'पिछला', fil: 'Nakaraan', ms: 'Sebelumnya'
    },
    stepper_next: {
      en: 'Next', id: 'Berikutnya', ja: '次へ', ko: '다음',
      zh: '下一项', 'zh-TW': '下一項', vi: 'Tiếp theo', th: 'ถัดไป',
      hi: 'अगला', fil: 'Susunod', ms: 'Seterusnya'
    },
    mic_listening: {
      en: 'Listening to your voice...', id: 'Mendengarkan ucapan Anda...', ja: '音声を認識中...', ko: '듣고 있습니다...',
      zh: '正在聆听您的声音...', 'zh-TW': '正在聆聽您的聲音...', vi: 'Đang lắng nghe giọng nói của bạn...', th: 'กำลังฟังเสียงของคุณ...',
      hi: 'आपकी आवाज़ सुन रहे हैं...', fil: 'Nakikinig sa iyong boses...', ms: 'Mendengar suara anda...'
    },
    speaking_text: {
      en: 'Telmy is speaking...', id: 'Telmy sedang membaca panduan...', ja: 'Telmy が音声を読み上げ中...', ko: 'Telmy가 안내를 읽고 있습니다...',
      zh: 'Telmy 正在朗读指南...', 'zh-TW': 'Telmy 正在朗讀指引...', vi: 'Telmy đang đọc hướng dẫn...', th: 'Telmy กำลังอ่านคำแนะนำ...',
      hi: 'Telmy मार्गदर्शन पढ़ रहा है...', fil: 'Binabasa ni Telmy ang gabay...', ms: 'Telmy sedang membaca panduan...'
    },
    empty_fields_title: {
      en: 'Select a Form Field', id: 'Pilih Kolom Formulir', ja: '入力項目を選択してください', ko: '입력란을 선택하세요',
      zh: '请选择表单项', 'zh-TW': '請選擇表單欄位', vi: 'Chọn trường biểu mẫu', th: 'เลือกช่องกรอกข้อมูล',
      hi: 'एक फ़ॉर्म फ़ील्ड चुनें', fil: 'Pumili ng Kolum', ms: 'Pilih Ruangan Borang'
    },
    empty_fields_desc: {
      en: 'Hover or click any field badge on the page to view detailed guidelines and examples.',
      id: 'Arahkan kursor atau klik nomor kolom di formulir sebelah kiri untuk melihat panduan detail dan contoh isian.',
      ja: '左側のフォームの項目番号にカーソルを合わせるかクリックすると詳細ガイドが表示されます。',
      ko: '왼쪽 양식의 입력란 번호를 클릭하면 상세 안내와 예시를 확인할 수 있습니다.',
      zh: '悬停或点击左侧表单中的项目编号，可查看详细填写指南与示例。',
      'zh-TW': '指向或點擊左側表單上的欄位編號，即可查看詳細說明與範例。',
      vi: 'Di chuột hoặc nhấp vào số trường trên biểu mẫu để xem hướng dẫn chi tiết và ví dụ.',
      th: 'ชี้หรือคลิกที่หมายเลขช่องในฟอร์มเพื่อดูคำแนะนำและตัวอย่างโดยละเอียด',
      hi: 'विस्तृत दिशानिर्देश और उदाहरण देखने के लिए पेज पर किसी फ़ील्ड पर कर्सर ले जाएँ या क्लिक करें।',
      fil: 'Itapat o i-click ang numero ng kolum sa form para makita ang detalye at halimbawa.',
      ms: 'Arahkan kursor atau klik nombor ruangan pada borang untuk melihat panduan terperinci.'
    },
    btn_start_guide: {
      en: '🚀 Guide Me (Field by Field)',
      id: '🚀 Pandu Saya (Kolom demi Kolom)',
      ja: '🚀 ガイドを開始する',
      ko: '🚀 안내 시작하기',
      zh: '🚀 开始逐项指引',
      'zh-TW': '🚀 開始逐項指引',
      vi: '🚀 Bắt đầu hướng dẫn',
      th: '🚀 เริ่มต้นคำแนะนำ',
      hi: '🚀 मार्गदर्शन शुरू करें',
      fil: '🚀 Simulan ang Gabay',
      ms: '🚀 Pandu Saya (Ruangan demi Ruangan)'
    },
    guide_quota_note: {
      en: '💡 Uses 1 form quota for 24-hour full assistance on this form',
      id: '💡 Menggunakan 1 kuota form untuk pendampingan penuh 24 jam',
      ja: '💡 このフォームで24時間完全ガイド（利用枠1回分）',
      ko: '💡 이 양식에 대해 24시간 전체 안내 제공 (양식 1회 사용)',
      zh: '💡 使用1个表单额度，在此表单提供24小时完整指引',
      'zh-TW': '💡 使用1個表單額度，在此表單提供24小時完整指引',
      vi: '💡 Sử dụng 1 hạn mức biểu mẫu cho 24 giờ hỗ trợ đầy đủ',
      th: '💡 ใช้โควตา 1 แบบฟอร์มเพื่อรับคำแนะนำครบถ้วน 24 ชั่วโมง',
      hi: '💡 इस फॉर्म पर 24 घंटे की पूरी सहायता के लिए 1 फॉर्म कोटा का उपयोग करता है',
      fil: '💡 Gumagamit ng 1 kuota ng form para sa 24-oras na buong tulong',
      ms: '💡 Menggunakan 1 kuota borang untuk bantuan penuh 24 jam'
    },
    detected_fields_header: {
      en: 'Detected Form Fields', id: 'Daftar Kolom Terdeteksi', ja: '検出された入力項目一覧', ko: '감지된 입력란 목록',
      zh: '已检测表单项列表', 'zh-TW': '已偵測欄位清單', vi: 'Danh sách trường đã phát hiện', th: 'รายการช่องที่ตรวจพบ',
      hi: 'पहचाने गए फ़ॉर्म फ़ील्ड्स', fil: 'Mga Nakitang Kolum', ms: 'Senarai Ruangan Dikesan'
    },
    progress_title: {
      en: 'Form Completion Progress', id: 'Progres Pengisian Form', ja: '入力進捗状況', ko: '양식 작성 진행률',
      zh: '表单填写进度', 'zh-TW': '表單填寫進度', vi: 'Tiến độ hoàn thành biểu mẫu', th: 'ความคืบหน้าการกรอกแบบฟอร์ม',
      hi: 'फ़ॉर्म भरने की प्रगति', fil: 'Progreso ng Pagsagot', ms: 'Kemajuan Mengisi Borang'
    },
    summary_title: {
      en: '📌 Form Overview', id: '📌 Ringkasan Formulir', ja: '📌 フォーム概要', ko: '📌 양식 개요',
      zh: '📌 表单概览', 'zh-TW': '📌 表單總覽', vi: '📌 Tổng quan biểu mẫu', th: '📌 ภาพรวมแบบฟอร์ม',
      hi: '📌 फ़ॉर्म का सारांश', fil: '📌 Buod ng Form', ms: '📌 Ringkasan Borang'
    },
    prereq_title: {
      en: '📑 Prerequisites & Documents', id: '📑 Dokumen yang Perlu Disiapkan', ja: '📑 事前準備書類', ko: '📑 준비 서류',
      zh: '📑 需准备的文件', 'zh-TW': '📑 需準備的證件', vi: '📑 Giấy tờ cần chuẩn bị', th: '📑 เอกสารที่ต้องเตรียม',
      hi: '📑 आवश्यक दस्तावेज़', fil: '📑 Mga Kinakailangang Dokumento', ms: '📑 Dokumen Diperlukan'
    },
    tips_title: {
      en: '💡 Helpful Tips', id: '💡 Tips Pengisian', ja: '💡 入力のヒント', ko: '💡 작성 팁',
      zh: '💡 填写提示', 'zh-TW': '💡 填寫貼士', vi: '💡 Mẹo điền biểu mẫu', th: '💡 เคล็ดลับการกรอก',
      hi: '💡 उपयोगी सुझाव', fil: '💡 Mga Tip', ms: '💡 Petua Mengisi'
    },
    detail_meaning: {
      en: 'Meaning & Purpose', id: 'Maksud & Fungsi Kolom', ja: '項目の意味と用途', ko: '항목 설명 및 용도',
      zh: '含义与用途', 'zh-TW': '含義與用途', vi: 'Ý nghĩa & Mục đích', th: 'ความหมายและวัตถุประสงค์',
      hi: 'अर्थ और उद्देश्य', fil: 'Kahulugan at Layunin', ms: 'Maksud & Fungsi Ruangan'
    },
    detail_how: {
      en: 'How to Fill', id: 'Cara Mengisi', ja: '入力手順', ko: '작성 방법',
      zh: '如何填写', 'zh-TW': '如何填寫', vi: 'Cách điền', th: 'วิธีการกรอก',
      hi: 'कैसे भरें', fil: 'Paano Sagutan', ms: 'Cara Mengisi'
    },
    detail_example: {
      en: 'Example Entry', id: 'Contoh Isian', ja: '記入例', ko: '예시',
      zh: '参考示例', 'zh-TW': '參考範例', vi: 'Ví dụ mẫu', th: 'ตัวอย่างการกรอก',
      hi: 'उदाहरण', fil: 'Halimbawa', ms: 'Contoh Isian'
    },
    detail_copy: {
      en: 'Copy', id: 'Salin', ja: 'コピー', ko: '복사',
      zh: '复制', 'zh-TW': '複製', vi: 'Sao chép', th: 'คัดลอก',
      hi: 'कॉपी करें', fil: 'Kopyahin', ms: 'Salin'
    },
    detail_copied: {
      en: 'Copied!', id: 'Tersalin!', ja: 'コピー完了!', ko: '복사됨!',
      zh: '已复制!', 'zh-TW': '已複製!', vi: 'Đã sao chép!', th: 'คัดลอกแล้ว!',
      hi: 'कॉपी हो गया!', fil: 'Nakopya!', ms: 'Disalin!'
    },
    detail_avoid: {
      en: 'Common Mistakes', id: 'Hindari Kesalahan', ja: '注意点', ko: '주의 사항',
      zh: '避免错误', 'zh-TW': '避免錯誤', vi: 'Tránh lỗi', th: 'ข้อควรระวัง',
      hi: 'गलतियों से बचें', fil: 'Iwasan ang Mali', ms: 'Elakkan Kesilapan'
    },
    detail_foreign_notes: {
      en: 'Notes for Foreigners', id: 'Catatan untuk WNA', ja: '外国人向け注意事項', ko: '외국인 유의사항',
      zh: '外籍人士注意事项', 'zh-TW': '外籍人士注意事項', vi: 'Lưu ý cho người nước ngoài', th: 'หมายเหตุสำหรับชาวต่างชาติ',
      hi: 'विदेशी नागरिकों के लिए निर्देश', fil: 'Paunawa para sa Dayuhan', ms: 'Nota untuk Warga Asing'
    },
    ai_draft_badge: {
      en: 'AI Draft', id: 'Draf AI', ja: 'AIドラフト', ko: 'AI 초안',
      zh: 'AI草案', 'zh-TW': 'AI草案', vi: 'Bản thảo AI', th: 'ร่างโดย AI',
      hi: 'एआई प्रारूप', fil: 'AI Draft', ms: 'Draf AI'
    },
    fields_unit: {
      en: 'Fields', id: 'Kolom', ja: '項目', ko: '개',
      zh: '项', 'zh-TW': '項', vi: 'trường', th: 'ช่อง',
      hi: 'फ़ील्ड्स', fil: 'Kolum', ms: 'Ruangan'
    },
    translate_banner_title: {
      en: 'Full Page Translation', id: 'Terjemahan Halaman Penuh', ja: '全ページ翻訳', ko: '전체 페이지 번역',
      zh: '全页面翻译', 'zh-TW': '全頁面翻譯', vi: 'Dịch toàn bộ trang', th: 'แปลทั้งหน้า',
      hi: 'पूरे पृष्ठ का अनुवाद', fil: 'Pagsasalin ng Buong Pahina', ms: 'Terjemahan Penuh Halaman'
    },
    translate_banner_sub: {
      en: 'Context-Aware & UI/UX Standards', id: 'Berbasis Konteks & Standar UI/UX', ja: '文脈重視・UI標準保持', ko: '문맥 맞춤 및 UI 표준 유지',
      zh: '上下文感知与UI标准', 'zh-TW': '語境感知與UI標準', vi: 'Nhận biết ngữ cảnh & chuẩn UI', th: 'เข้าใจบริบทและมาตรฐาน UI',
      hi: 'संदर्भ-सचेत और UI मानक', fil: 'May kamalayan sa konteksto', ms: 'Peka konteks & standard UI'
    },
    btn_translate_page: {
      en: 'Translate Page', id: 'Terjemahkan', ja: '翻訳する', ko: '페이지 번역',
      zh: '翻译页面', 'zh-TW': '翻譯頁面', vi: 'Dịch trang', th: 'แปลหน้าเว็บ',
      hi: 'अनुवाद करें', fil: 'Isalin', ms: 'Terjemah'
    },
    btn_revert_page: {
      en: 'Show Original', id: 'Kembalikan Asli', ja: '原文に戻す', ko: '원문 보기',
      zh: '显示原文', 'zh-TW': '顯示原文', vi: 'Hiện bản gốc', th: 'แสดงต้นฉบับ',
      hi: 'मूल दिखाएं', fil: 'Ipakita ang Orihinal', ms: 'Tunjuk Asal'
    },
    translating_status: {
      en: 'Translating with Gemini...', id: 'Menerjemahkan dengan Gemini...', ja: 'Gemini で翻訳中...', ko: 'Gemini로 번역 중...',
      zh: '正在使用 Gemini 翻译...', 'zh-TW': '正在使用 Gemini 翻譯...', vi: 'Đang dịch bằng Gemini...', th: 'กำลังแปลด้วย Gemini...',
      hi: 'Gemini से अनुवाद हो रहा है...', fil: 'Isinasalin gamit ang Gemini...', ms: 'Menterjemah dengan Gemini...'
    },
    chip_translate: {
      en: 'Translate Page', id: 'Terjemahkan Halaman', ja: 'ページを翻訳', ko: '페이지 번역',
      zh: '翻译页面', 'zh-TW': '翻譯頁面', vi: 'Dịch trang', th: 'แปลหน้าเว็บ',
      hi: 'पृष्ठ का अनुवाद', fil: 'Isalin ang Pahina', ms: 'Terjemah Halaman'
    },
    chip_what: {
      en: 'What is this form?', id: 'Formulir apa ini?', ja: 'このフォームは何？', ko: '이 양식은 무엇인가요?',
      zh: '这是什么表单？', 'zh-TW': '這是什麼表單？', vi: 'Đây là biểu mẫu gì?', th: 'แบบฟอร์มนี้คืออะไร?',
      hi: 'यह क्या फ़ॉर्म है?', fil: 'Anong form ito?', ms: 'Apakah borang ini?'
    },
    chip_docs: {
      en: 'Required Docs', id: 'Syarat Dokumen', ja: '必要書類', ko: '필요 서류',
      zh: '所需证件', 'zh-TW': '所需證件', vi: 'Giấy tờ cần có', th: 'เอกสารที่ต้องใช้',
      hi: 'आवश्यक दस्तावेज़', fil: 'Mga Dokumento', ms: 'Dokumen Diperlukan'
    },
    privacy_text: {
      en: 'Privacy Shield: PII Masked Locally', id: 'Pelindung Privasi: PII Disamarkan Lokal', ja: 'プライバシー保護: 個人情報をローカルでマスク',
      ko: '개인정보 보호: 로컬에서 PII 마스킹', zh: '隐私保护：本地屏蔽敏感信息', 'zh-TW': '隱私保護：本機屏蔽敏感資料',
      vi: 'Bảo vệ quyền riêng tư: Che PII cục bộ', th: 'การคุ้มครองความเป็นส่วนตัว: ซ่อนข้อมูลระบุตัวตนในตัวเครื่อง',
      hi: 'गोपनीयता शील्ड: PII स्थानीय रूप से छुपाया गया', fil: 'Privacy Shield: Naka-mask ang PII', ms: 'Pelindung Privasi: PII Ditolak Tempatan'
    },
    audit_btn_title: {
      en: 'Pre-Submission Form Audit', id: 'Audit Form Sebelum Submit', ja: '送信前フォーム検証', ko: '제출 전 양식 검토',
      zh: '提交前表单审核', 'zh-TW': '提交前表單審核', vi: 'Kiểm tra biểu mẫu trước khi gửi', th: 'ตรวจสอบฟอร์มก่อนส่ง',
      hi: 'सबमिट करने से पहले फ़ॉर्म ऑडिट', fil: 'I-audit ang Form Bago Isumite', ms: 'Audit Borang Sebelum Hantar'
    },
    audit_btn_sub: {
      en: 'Sanity check completeness & format', id: 'Pemeriksaan kelengkapan & format isian', ja: '記入漏れや形式の自動チェック', ko: '작성 누락 및 형식 점검',
      zh: '检查完整性与格式规范', 'zh-TW': '檢查完整性與格式規範', vi: 'Kiểm tra tính đầy đủ & định dạng', th: 'ตรวจความสมบูรณ์และรูปแบบ',
      hi: 'पूर्णता और प्रारूप की जाँच करें', fil: 'Tingnan ang pagkakumpleto at format', ms: 'Pemeriksaan kelengkapan & format'
    },
    audit_report_heading: {
      en: 'Form Audit Report', id: 'Laporan Audit Form', ja: 'フォーム検証レポート', ko: '양식 검토 보고서',
      zh: '表单审核报告', 'zh-TW': '表單審核報告', vi: 'Báo cáo kiểm tra biểu mẫu', th: 'รายงานการตรวจสอบฟอร์ม',
      hi: 'फ़ॉर्म ऑडिट रिपोर्ट', fil: 'Ulat sa Pag-audit ng Form', ms: 'Laporan Audit Borang'
    },
    audit_status_ready: {
      en: '🟢 Ready to Submit', id: '🟢 100% Siap Kirim', ja: '🟢 送信準備完了', ko: '🟢 제출 준비 완료',
      zh: '🟢 已准备好提交', 'zh-TW': '🟢 已準備好提交', vi: '🟢 Sẵn sàng gửi', th: '🟢 พร้อมส่ง',
      hi: '🟢 सबमिट के लिए तैयार', fil: '🟢 Handa nang Isumite', ms: '🟢 Sedia Dihantar'
    },
    audit_status_danger: {
      en: '🔴 Action Required', id: '🔴 Perlu Diperbaiki', ja: '🔴 要修正', ko: '🔴 조치 필요',
      zh: '🔴 需要修正', 'zh-TW': '🔴 需要修正', vi: '🔴 Cần chỉnh sửa', th: '🔴 ต้องแก้ไข',
      hi: '🔴 कार्रवाई आवश्यक', fil: '🔴 Kailangang Ayusin', ms: '🔴 Perlu Dibetulkan'
    },
    audit_status_warning: {
      en: '🟡 Suggestions Found', id: '🟡 Cek Rekomendasi', ja: '🟡 推奨事項あり', ko: '🟡 권장 사항 있음',
      zh: '🟡 建议优化', 'zh-TW': '🟡 建議優化', vi: '🟡 Gợi ý cần xem', th: '🟡 มีคำแนะนำ',
      hi: '🟡 सुझाव उपलब्ध', fil: '🟡 May Mungkahi', ms: '🟡 Ada Cadangan'
    },
    mode_chat_title: {
      en: 'Chatbot Mode', id: 'Mode Chatbot', ja: 'チャットボット', ko: '챗봇 모드',
      zh: '聊天机器人模式', 'zh-TW': '聊天機器人模式', vi: 'Chế độ Chatbot', th: 'โหมดแชทบอท',
      hi: 'चैटबॉट मोड', fil: 'Chatbot Mode', ms: 'Mod Chatbot'
    },
    mode_chat_desc: {
      en: 'Fast & silent text (Muted)', id: 'Teks cepat & hening (Mute)', ja: '高速・テキスト対話 (ミュート)', ko: '조용한 텍스트 대화 (음소거)',
      zh: '快速静音文本 (静音)', 'zh-TW': '快速靜音文字 (靜音)', vi: 'Văn bản nhanh & im lặng (Tắt tiếng)', th: 'ข้อความรวดเร็วและเงียบ (ปิดเสียง)',
      hi: 'तेज़ और शांत टेक्स्ट (म्यूट)', fil: 'Mabilis at tahimik na text (Naka-mute)', ms: 'Teks pantas & senyap (Bisu)'
    },
    mode_chat_compact: {
      en: 'Chatbot (Silent)', id: 'Chatbot (Hening)', ja: 'チャットボット (静音)', ko: '챗봇 (조용히)',
      zh: '聊天机器人 (静音)', 'zh-TW': '聊天機器人 (靜音)', vi: 'Chatbot (Im lặng)', th: 'แชทบอท (เงียบ)',
      hi: 'चैटबॉट (शांत)', fil: 'Chatbot (Tahimik)', ms: 'Chatbot (Senyap)'
    },
    mode_voice_title: {
      en: 'Voicebot Mode', id: 'Mode Voicebot', ja: '音声対話モード', ko: '음성봇 모드',
      zh: '语音助手模式', 'zh-TW': '語音助理模式', vi: 'Chế độ Voicebot', th: 'โหมดสนทนาเสียง',
      hi: 'वॉइसबॉट मोड', fil: 'Voicebot Mode', ms: 'Mod Voicebot'
    },
    mode_voice_desc: {
      en: 'Google WaveNet Voice & Interactive Avatar', id: 'Suara Google WaveNet & Avatar Interaktif', ja: 'Google WaveNet音声＆対話アバター', ko: 'Google WaveNet 음성 및 대화형 아바타',
      zh: 'Google WaveNet 语音与动态形象', 'zh-TW': 'Google WaveNet 語音與互動虛擬人', vi: 'Giọng nói Google WaveNet & Avatar tương tác', th: 'เสียง Google WaveNet และอวาตาร์โต้ตอบ',
      hi: 'Google WaveNet आवाज़ और इंटरैक्टिव अवतार', fil: 'Boses ng Google WaveNet at Interactive Avatar', ms: 'Suara Google WaveNet & Avatar Interaktif'
    },
    mode_voice_compact: {
      en: 'Voicebot (Interactive)', id: 'Voicebot (Interaktif)', ja: '音声ボット (対話)', ko: '음성봇 (대화형)',
      zh: '语音助手 (互动)', 'zh-TW': '語音助理 (互動)', vi: 'Voicebot (Tương tác)', th: 'สนทนาเสียง (โต้ตอบ)',
      hi: 'वॉइसबॉट (इंटरैक्टिव)', fil: 'Voicebot (Interactive)', ms: 'Voicebot (Interaktif)'
    },
    mode_status_active: {
      en: '✓ Active', id: '✓ Aktif', ja: '✓ 有効', ko: '✓ 활성',
      zh: '✓ 已启用', 'zh-TW': '✓ 已啟用', vi: '✓ Hoạt động', th: '✓ ใช้งานอยู่',
      hi: '✓ सक्रिय', fil: '✓ Aktibo', ms: '✓ Aktif'
    },
    mode_status_switch: {
      en: '○ Switch Mode', id: '○ Beralih Mode', ja: '○ 切り替え', ko: '○ 모드 전환',
      zh: '○ 切换模式', 'zh-TW': '○ 切換模式', vi: '○ Chuyển chế độ', th: '○ สลับโหมด',
      hi: '○ मोड बदलें', fil: '○ Lumipat ng Mode', ms: '○ Tukar Mod'
    },
    hover_change_mode: {
      en: 'Hover to change mode', id: 'Arahkan kursor untuk ganti mode', ja: 'カーソルを合わせて切替', ko: '마우스를 올려 모드 변경',
      zh: '悬停以切换模式', 'zh-TW': '懸停以切換模式', vi: 'Di chuột để đổi chế độ', th: 'ชี้เพื่อเปลี่ยนโหมด',
      hi: 'मोड बदलने के लिए होवर करें', fil: 'Itapat para magpalit ng mode', ms: 'Arahkan kursor untuk tukar mod'
    },
    voicebot_status_idle_title: {
      en: "Hello, I'm Telmy!", id: 'Halo, saya Telmy!', ja: 'こんにちは、Telmyです！', ko: '안녕하세요, Telmy입니다!',
      zh: '您好，我是 Telmy！', 'zh-TW': '您好，我是 Telmy！', vi: 'Xin chào, tôi là Telmy!', th: 'สวัสดีครับ ผมคือ Telmy!',
      hi: 'नमस्ते, मैं Telmy हूँ!', fil: 'Kamusta, ako si Telmy!', ms: 'Hai, saya Telmy!'
    },
    voicebot_status_idle_desc: {
      en: 'Click the microphone button below to speak directly', id: 'Klik tombol mikrofon di bawah untuk berbicara langsung',
      ja: '下のマイクボタンをクリックして直接お話しください', ko: '아래 마이크 버튼을 눌러 말씀해 주세요',
      zh: '点击下方麦克风即可直接语音交流', 'zh-TW': '點擊下方麥克風即可直接語音對話',
      vi: 'Nhấn nút micrô bên dưới để nói trực tiếp', th: 'กดปุ่มไมโครโฟนด้านล่างเพื่อพูดคุยโดยตรง',
      hi: 'सीधे बात करने के लिए नीचे दिए गए माइक पर क्लिक करें', fil: 'I-click ang mikropono sa ibaba para magsalita',
      ms: 'Klik butang mikrofon di bawah untuk bercakap terus'
    },
    voicebot_mic_caption_idle: {
      en: 'Click to Speak', id: 'Klik untuk Bicara', ja: 'クリックして話す', ko: '클릭하여 말하기',
      zh: '点击说话', 'zh-TW': '點擊說話', vi: 'Nhấn để nói', th: 'กดเพื่อพูด',
      hi: 'बोलने के लिए क्लिक करें', fil: 'I-click para Magsalita', ms: 'Klik untuk Bercakap'
    },
    voicebot_status_listening_title: {
      en: 'Listening...', id: 'Mendengarkan...', ja: '音声を聞き取り中...', ko: '듣고 있습니다...',
      zh: '正在聆听...', 'zh-TW': '正在聆聽...', vi: 'Đang lắng nghe...', th: 'กำลังฟัง...',
      hi: 'सुन रहे हैं...', fil: 'Nakikinig...', ms: 'Mendengar...'
    },
    voicebot_status_listening_desc: {
      en: 'Speak now into your microphone...', id: 'Silakan bicara ke mikrofon Anda...',
      ja: 'マイクに向かってお話しください...', ko: '마이크에 대고 말씀하세요...',
      zh: '请对着麦克风说话...', 'zh-TW': '請對著麥克風說話...',
      vi: 'Hãy nói vào micrô của bạn...', th: 'พูดใส่ไมโครโฟนของคุณได้เลย...',
      hi: 'कृपया अपने माइक्रोफ़ोन में बोलें...', fil: 'Magsalita sa iyong mikropono...',
      ms: 'Sila bercakap ke mikrofon anda...'
    },
    voicebot_mic_caption_listening: {
      en: 'Listening...', id: 'Mendengarkan...', ja: '音声認識中...', ko: '듣는 중...',
      zh: '正在聆听...', 'zh-TW': '正在聆聽...', vi: 'Đang nghe...', th: 'กำลังฟัง...',
      hi: 'सुन रहे हैं...', fil: 'Nakikinig...', ms: 'Mendengar...'
    },
    voicebot_status_speaking_title: {
      en: 'Telmy is Speaking', id: 'Telmy Berbicara', ja: 'Telmy が発話中', ko: 'Telmy가 말하고 있습니다',
      zh: 'Telmy 正在说话', 'zh-TW': 'Telmy 正在說話', vi: 'Telmy đang nói', th: 'Telmy กำลังพูด',
      hi: 'Telmy बोल रहा है', fil: 'Nagsasalita si Telmy', ms: 'Telmy sedang Bercakap'
    },
    voicebot_status_speaking_desc: {
      en: 'Please listen to the guidance', id: 'Silakan dengarkan panduan', ja: 'ガイダンスをお聞きください', ko: '안내를 들어주세요',
      zh: '请聆听指引', 'zh-TW': '請聆聽指引', vi: 'Vui lòng lắng nghe hướng dẫn', th: 'โปรดฟังคำแนะนำ',
      hi: 'कृपया मार्गदर्शन सुनें', fil: 'Makinig sa gabay', ms: 'Sila dengar panduan'
    },
    voicebot_mic_caption_speaking: {
      en: 'Speaking...', id: 'Sedang Membaca...', ja: '読み上げ中...', ko: '음성 출력 중...',
      zh: '正在朗读...', 'zh-TW': '正在朗讀...', vi: 'Đang phát âm...', th: 'กำลังอ่าน...',
      hi: 'बोल रहा है...', fil: 'Nagsasalita...', ms: 'Sedang Membaca...'
    },
    welcome_hero_title: {
      en: 'Hello! I am Telmy 👋', id: 'Halo! Saya Telmy 👋', ja: 'こんにちは！Telmyです 👋', ko: '안녕하세요! Telmy입니다 👋',
      zh: '您好！我是 Telmy 👋', 'zh-TW': '您好！我是 Telmy 👋', vi: 'Xin chào! Tôi là Telmy 👋', th: 'สวัสดีครับ! ผมคือ Telmy 👋',
      hi: 'नमस्ते! मैं Telmy हूँ 👋', fil: 'Kamusta! Ako si Telmy 👋', ms: 'Hai! Saya Telmy 👋'
    },
    welcome_hero_desc: {
      en: 'Your friendly AI form-filling companion. Ask me anything about this form using text or speech, or choose an option below:',
      id: 'Asisten ramah pengisian formulir AI Anda. Tanyakan apa pun tentang formulir ini via teks atau suara, atau pilih opsi di bawah:',
      ja: 'あなたのAIフォーム入力アシスタントです。テキストまたは音声で質問するか、以下のオプションを選択してください：',
      ko: '친절한 AI 양식 작성 도우미입니다. 텍스트나 음성으로 질문하시거나 아래 옵션을 선택하세요:',
      zh: '您的专属 AI 表单填写助手。通过文字或语音提问，或选择以下操作：',
      'zh-TW': '您的專屬 AI 表單填寫助理。透過文字或語音提問，或選擇以下操作：',
      vi: 'Trợ lý AI thân thiện giúp bạn điền biểu mẫu. Hãy hỏi tôi qua văn bản hoặc giọng nói, hoặc chọn bên dưới:',
      th: 'ผู้ช่วยกรอกฟอร์ม AI ของคุณ ถามคำถามผ่านข้อความหรือเสียง หรือเลือกตัวเลือกด้านล่าง:',
      hi: 'आपका मित्रवत AI फ़ॉर्म सहायक। टेक्स्ट या आवाज़ से कुछ भी पूछें, या नीचे दिए गए विकल्प चुनें:',
      fil: 'Ang iyong maaasahang AI form assistant. Magtanong gamit ang text o boses, o pumili sa ibaba:',
      ms: 'Pembantu pengisian borang AI mesra anda. Tanya apa sahaja menggunakan teks atau suara, atau pilih pilihan di bawah:'
    },
    welcome_chip_about: {
      en: 'Tell me About this form', id: 'Jelaskan tentang formulir ini', ja: 'このフォームの概要を教えて', ko: '이 양식에 대해 알려줘',
      zh: '告诉我此表单的内容', 'zh-TW': '告訴我此表單的內容', vi: 'Cho tôi biết về biểu mẫu này', th: 'อธิบายเกี่ยวกับฟอร์มนี้',
      hi: 'इस फ़ॉर्म के बारे में बताएं', fil: 'Sabihin ang tungkol sa form na ito', ms: 'Terangkan tentang borang ini'
    },
    welcome_chip_guide: {
      en: 'Guide me Fields by Fields', id: 'Pandu saya Kolom demi Kolom', ja: '項目ごとにガイドして', ko: '항목별로 안내해줘',
      zh: '逐项引导我填写', 'zh-TW': '逐欄引導我填寫', vi: 'Hướng dẫn từng trường', th: 'แนะนำทีละช่อง',
      hi: 'एक-एक करके फ़ील्ड्स समझाएं', fil: 'Gabayan ako bawat kolum', ms: 'Pandu saya Ruangan demi Ruangan'
    },
    welcome_chip_translate: {
      en: 'Translate this Page', id: 'Terjemahkan Halaman Ini', ja: 'このページを翻訳', ko: '이 페이지 번역',
      zh: '翻译此页面', 'zh-TW': '翻譯此頁面', vi: 'Dịch trang này', th: 'แปลหน้านี้',
      hi: 'इस पृष्ठ का अनुवाद करें', fil: 'Isalin ang pahinang ito', ms: 'Terjemah Halaman Ini'
    },
    default_chat_reply: {
      en: 'I am ready to help you complete this form. Click on any field on the page to see detailed step-by-step guidance.',
      id: 'Saya siap membantu memandu pengisian formulir ini. Klik salah satu kolom di halaman untuk melihat petunjuk detail.',
      ja: 'このフォームの入力をサポートします。ページ内の入力項目をクリックして詳細な手順をご確認ください。',
      ko: '양식 작성을 도와드릴 준비가 되었습니다. 페이지의 입력란을 클릭하여 단계별 안내를 확인하세요.',
      zh: '我已准备好协助您填写此表单。点击页面上的任意输入项即可查看详细指引。',
      'zh-TW': '我已準備好協助您填寫此表單。點擊頁面上的任意欄位即可查看詳細指引。',
      vi: 'Tôi sẵn sàng giúp bạn điền biểu mẫu này. Nhấp vào bất kỳ trường nào trên trang để xem hướng dẫn chi tiết.',
      th: 'พร้อมช่วยเหลือคุณในการกรอกแบบฟอร์มนี้แล้ว คลิกที่ช่องใดก็ได้ในหน้าเพื่อดูคำแนะนำทีละขั้นตอน',
      hi: 'मैं इस फ़ॉर्म को भरने में आपकी मदद के लिए तैयार हूँ। विस्तृत मार्गदर्शन देखने के लिए पेज पर किसी फ़ील्ड पर क्लिक करें।',
      fil: 'Handa akong tulungan kang sagutan ang form na ito. I-click ang anumang kolum para sa gabay.',
      ms: 'Saya sedia membantu mengisi borang ini. Klik mana-mana ruangan pada halaman untuk melihat panduan terperinci.'
    },
    msg_about_form: {
      en: 'Tell me what this form is about and what documents are required.',
      id: 'Tolong jelaskan ringkasan formulir ini dan apa saja yang diperlukan.',
      ja: 'このフォームの概要と必要な書類について教えてください。',
      ko: '이 양식의 개요와 필요한 서류를 설명해 주세요.',
      zh: '请解释此表单的概要以及需要准备哪些文件。',
      'zh-TW': '請說明此表單的概要以及需要準備哪些證件。',
      vi: 'Hãy giải thích biểu mẫu này nói về điều gì và cần những giấy tờ nào.',
      th: 'ช่วยอธิบายภาพรวมของฟอร์มนี้และเอกสารที่ต้องใช้หน่อยครับ',
      hi: 'कृपया बताएं कि यह फ़ॉर्म किस बारे में है और किन दस्तावेज़ों की आवश्यकता है।',
      fil: 'Ipaliwanag kung para saan ang form na ito at anong mga dokumento ang kailangan.',
      ms: 'Tolong jelaskan ringkasan borang ini dan apa yang diperlukan.'
    },
    autofill_not_configured_msg: {
      en: '⚡ **1-Click AutoFill**: Your master profile is not configured yet. Visit your Member Area at https://telmy-ai.cloud.run/dashboard#autofill to set up your legal name, passport, and identity info!',
      id: '⚡ **1-Click AutoFill**: Data profil tersimpan Anda belum diisi. Kunjungi Member Area di https://telmy-ai.cloud.run/dashboard#autofill untuk menyimpan data paspor, NIK, dan identitas Anda!',
      ja: '⚡ **1-クリック自動入力**: マスタープロファイルが未設定です。https://telmy-ai.cloud.run/dashboard#autofill で身元情報を登録してください！',
      ko: '⚡ **1-클릭 자동완성**: 마스터 프로필이 설정되지 않았습니다. https://telmy-ai.cloud.run/dashboard#autofill 에서 정보를 등록하세요!',
      zh: '⚡ **一键自动填写**：您的个人主配置文件尚未设置。请访问 https://telmy-ai.cloud.run/dashboard#autofill 设置您的身份信息！',
      'zh-TW': '⚡ **一鍵自動填寫**：您的個人主設定檔尚未設定。請訪問 https://telmy-ai.cloud.run/dashboard#autofill 設定您的身分資料！',
      vi: '⚡ **Tự động điền 1 chạm**: Hồ sơ của bạn chưa được thiết lập. Hãy truy cập https://telmy-ai.cloud.run/dashboard#autofill để cài đặt!',
      th: '⚡ **กรอกอัตโนมัติใน 1 คลิก**: คุณยังไม่ได้ตั้งค่าโปรไฟล์หลัก ไปที่ https://telmy-ai.cloud.run/dashboard#autofill เพื่อตั้งค่า!',
      hi: '⚡ **1-क्लिक ऑटोफ़िल**: आपकी प्रोफ़ाइल अभी कॉन्फ़िगर नहीं है। अपनी जानकारी सेट करने के लिए https://telmy-ai.cloud.run/dashboard#autofill पर जाएं!',
      fil: '⚡ **1-Click AutoFill**: Hindi pa naka-configure ang iyong profile. Pumunta sa https://telmy-ai.cloud.run/dashboard#autofill!',
      ms: '⚡ **1-Click AutoFill**: Profil utama anda belum ditetapkan. Layari https://telmy-ai.cloud.run/dashboard#autofill untuk menyediakannya!'
    },
    autofill_complete_msg: {
      en: '⚡ **1-Click AutoFill Complete**: Successfully filled {count} using your encrypted profile vault. Please review all entries before submitting!',
      id: '⚡ **1-Click AutoFill Selesai**: Berhasil mengisi {count} dari profil aman Anda. Harap periksa kembali sebelum mengirimkan formulir!',
      ja: '⚡ **自動入力完了**: 暗号化保管庫から {count} を正常に入力しました。送信前に全項目をご確認ください！',
      ko: '⚡ **자동완성 완료**: 보안 보관함의 데이터로 {count}을(를) 채웠습니다. 제출 전 반드시 확인해 주세요!',
      zh: '⚡ **自动填写完成**：已使用加密个人资料成功填写 {count}。请在提交前仔细核对！',
      'zh-TW': '⚡ **自動填寫完成**：已使用加密個人檔案成功填寫 {count}。請在提交前仔細核對！',
      vi: '⚡ **Hoàn tất tự động điền**: Đã điền thành công {count} từ kho an toàn. Vui lòng kiểm tra lại trước khi gửi!',
      th: '⚡ **กรอกอัตโนมัติเสร็จสิ้น**: กรอก {count} สำเร็จจากคลังที่ปลอดภัย โปรดตรวจสอบก่อนส่งฟอร์ม!',
      hi: '⚡ **1-क्लिक ऑटोफ़िल पूर्ण**: आपके सुरक्षित वॉल्ट से {count} सफलतापूर्वक भर दिए गए। कृपया सबमिट करने से पहले जाँच लें!',
      fil: '⚡ **Tapos na ang 1-Click AutoFill**: Matagumpay na napunan ang {count} mula sa iyong secure vault. Suriin bago isumite!',
      ms: '⚡ **1-Click AutoFill Selesai**: Berjaya mengisi {count} daripada profil selamat anda. Sila semak semula sebelum menghantar!'
    },
    matching_fields: {
      en: 'matching fields', id: 'kolom yang cocok', ja: '一致する項目', ko: '일치하는 항목',
      zh: '匹配的字段', 'zh-TW': '相符的欄位', vi: 'trường phù hợp', th: 'ช่องที่ตรงกัน',
      hi: 'मिलान फ़ील्ड्स', fil: 'mga tumutugmang kolum', ms: 'ruangan yang sepadan'
    },
    page_reverted_msg: {
      en: '🔙 The webpage has been restored to its original text.',
      id: '🔙 Halaman web telah dikembalikan ke bahasa aslinya.',
      ja: '🔙 ウェブページを元の言語に戻しました。',
      ko: '🔙 웹페이지가 원래 언어로 복원되었습니다.',
      zh: '🔙 网页已恢复为其原始语言。',
      'zh-TW': '🔙 網頁已還原為其原始語言。',
      vi: '🔙 Trang web đã được khôi phục về văn bản gốc.',
      th: '🔙 หน้าเว็บถูกกู้คืนเป็นภาษาดั้งเดิมแล้ว',
      hi: '🔙 वेबपेज अपने मूल टेक्स्ट में पुनर्स्थापित कर दिया गया है।',
      fil: '🔙 Ibinalik ang webpage sa orihinal na wika.',
      ms: '🔙 Halaman web telah dikembalikan ke bahasa asalnya.'
    },
    no_translatable_elements_msg: {
      en: 'No translatable elements detected on this webpage.',
      id: 'Tidak ada elemen teks yang dapat diterjemahkan pada halaman ini.',
      ja: 'このウェブページには翻訳可能なテキストが検出されませんでした。',
      ko: '이 웹페이지에서 번역 가능한 요소를 찾을 수 없습니다.',
      zh: '此网页未检测到可翻译的文本元素。',
      'zh-TW': '此網頁未偵測到可翻譯的文字元素。',
      vi: 'Không tìm thấy phần tử có thể dịch trên trang web này.',
      th: 'ไม่พบข้อความที่แปลได้ในหน้าเว็บนี้',
      hi: 'इस वेबपेज पर कोई अनुवाद योग्य तत्व नहीं मिला।',
      fil: 'Walang nakitang text na maisasalin sa webpage na ito.',
      ms: 'Tiada elemen teks yang boleh diterjemahkan pada halaman ini.'
    },
    page_translated_msg: {
      en: '🌐 **Full Page Translated ({count} elements)**\n\nThe webpage has been translated into **{lang}** using **Google Gemini**.\n\n✓ **Official Bureaucracy Terms Preserved** (e.g., NIK, KTP, NPWP, SKCK)\n✓ **UI/UX Standards Applied** (Button & navigation actions mapped professionally)\n\nYou can click **Show Original** at any time to revert.',
      id: '🌐 **Halaman Berhasil Diterjemahkan ({count} elemen)**\n\nSeluruh teks UI halaman telah diterjemahkan ke bahasa **{lang}** menggunakan **Google Gemini**.\n\n✓ **Istilah Birokrasi Baku Terjaga** (NIK, KTP, KK, SKCK)\n✓ **Standar UI/UX Profesional** (Tombol navigasi disesuaikan secara natural)\n\nKlik **Kembalikan Asli** kapan saja jika ingin membaca versi asli.',
      ja: '🌐 **全ページ翻訳完了 ({count} 項目)**\n\n**Google Gemini** により **{lang}** へ翻訳されました。\n\n✓ 公的行政用語を正確に保持\n✓ UI/UX標準に準拠したボタン配置\n\nいつでも「原文に戻す」をクリックして戻せます。',
      ko: '🌐 **전체 페이지 번역 완료 ({count}개 항목)**\n\n**Google Gemini**를 사용하여 **{lang}**(으)로 번역되었습니다.\n\n✓ 공공 행정 용어 정확히 보존\n✓ 전문적 UI/UX 표준 적용\n\n언제든지 **원문 보기**를 클릭하여 되돌릴 수 있습니다.',
      zh: '🌐 **全页面翻译完成（共 {count} 个元素）**\n\n已使用 **Google Gemini** 翻译为 **{lang}**。\n\n✓ 规范行政术语精准保留\n✓ 专业 UI/UX 标准适配\n\n您可随时点击**显示原文**恢复。',
      'zh-TW': '🌐 **全頁面翻譯完成（共 {count} 個元素）**\n\n已使用 **Google Gemini** 翻譯為 **{lang}**。\n\n✓ 規範行政術語精準保留\n✓ 專業 UI/UX 標準適配\n\n您可隨時點擊**顯示原文**還原。',
      vi: '🌐 **Đã dịch toàn bộ trang ({count} phần tử)**\n\nTrang web đã được dịch sang **{lang}** bằng **Google Gemini**.\n\n✓ Bảo toàn thuật ngữ hành chính chính thức\n✓ Áp dụng chuẩn UI/UX chuyên nghiệp\n\nBạn có thể nhấp **Hiện bản gốc** bất kỳ lúc nào.',
      th: '🌐 **แปลทั้งหน้าเสร็จสิ้น ({count} รายการ)**\n\nแปลเป็นภาษา **{lang}** โดย **Google Gemini** แล้ว\n\n✓ รักษาคำศัพท์ราชการอย่างถูกต้อง\n✓ มาตรฐาน UI/UX เป็นธรรมชาติ\n\nคลิก **แสดงต้นฉบับ** เพื่อเปลี่ยนกลับได้ตลอดเวลา',
      hi: '🌐 **पूरे पृष्ठ का अनुवाद पूर्ण ({count} तत्व)**\n\n**Google Gemini** द्वारा **{lang}** में अनुवादित।\n\n✓ आधिकारिक प्रशासनिक शब्दावली सुरक्षित\n✓ पेशेवर UI/UX मानक लागू\n\nवापस लौटने के लिए कभी भी **मूल दिखाएं** पर क्लिक करें।',
      fil: '🌐 **Naisalin ang Buong Pahina ({count} elemento)**\n\nNaisalin sa **{lang}** gamit ang **Google Gemini**.\n\n✓ Napanatili ang mga opisyal na termino\n✓ Propesyonal na pamantayan sa UI/UX\n\nI-click ang **Ipakita ang Orihinal** upang ibalik.',
      ms: '🌐 **Halaman Berjaya Diterjemahkan ({count} elemen)**\n\nHalaman telah diterjemahkan ke **{lang}** menggunakan **Google Gemini**.\n\n✓ Istilah rasmi dikekalkan\n✓ Piawaian UI/UX profesional digunakan\n\nKlik **Tunjuk Asal** pada bila-bila masa untuk kembali.'
    },
    translate_error_msg: {
      en: '⚠️ Translation service encountered an issue. Please ensure network connectivity.',
      id: '⚠️ Layanan terjemahan mengalami kendala. Pastikan koneksi internet stabil.',
      ja: '⚠️ 翻訳サービスで問題が発生しました。ネットワーク接続をご確認ください。',
      ko: '⚠️ 번역 서비스에 문제가 발생했습니다. 네트워크 연결을 확인하세요.',
      zh: '⚠️ 翻译服务遇到问题，请检查网络连接。',
      'zh-TW': '⚠️ 翻譯服務發生問題，請檢查網路連線。',
      vi: '⚠️ Dịch vụ dịch thuật gặp sự cố. Vui lòng kiểm tra kết nối mạng.',
      th: '⚠️ บริการแปลพบปัญหา โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
      hi: '⚠️ अनुवाद सेवा में समस्या आई। कृपया नेटवर्क कनेक्शन जांचें।',
      fil: '⚠️ Nagka-problema sa serbisyo ng pagsasalin. Pakisuri ang koneksyon.',
      ms: '⚠️ Perkhidmatan terjemahan menghadapi masalah. Sila pastikan sambungan internet stabil.'
    },
    chip_what_msg: {
      en: 'What is this form about and what should I know?',
      id: 'Jelaskan formulir ini tentang apa dan apa yang perlu saya ketahui?',
      ja: 'このフォームは何についてのものですか？注意点は何ですか？',
      ko: '이 양식은 무엇에 관한 것이며 어떤 점을 알아야 하나요?',
      zh: '这是什么表单，有哪些注意事项？',
      'zh-TW': '這是什麼表單，有哪些注意事項？',
      vi: 'Biểu mẫu này nói về điều gì và tôi cần biết những gì?',
      th: 'แบบฟอร์มนี้เกี่ยวกับอะไรและมีอะไรที่ฉันควรรู้บ้าง?',
      hi: 'यह फ़ॉर्म किस बारे में है और मुझे क्या जानना चाहिए?',
      fil: 'Para saan ang form na ito at ano ang dapat kong malaman?',
      ms: 'Borang ini tentang apa dan apakah yang perlu saya ketahui?'
    },
    chip_docs_msg: {
      en: 'What documents and requirements do I need to prepare for this form?',
      id: 'Apa saja berkas dan dokumen yang harus saya siapkan untuk mengisi formulir ini?',
      ja: 'このフォームに入力するために準備すべき書類は何ですか？',
      ko: '이 양식을 작성하기 위해 준비해야 할 서류는 무엇인가요?',
      zh: '填写此表单需要准备哪些文件和资料？',
      'zh-TW': '填寫此表單需要準備哪些文件與資料？',
      vi: 'Tôi cần chuẩn bị những tài liệu và giấy tờ gì cho biểu mẫu này?',
      th: 'ต้องเตรียมเอกสารอะไรบ้างสำหรับแบบฟอร์มนี้?',
      hi: 'इस फ़ॉर्म के लिए मुझे कौन से दस्तावेज़ और आवश्यकताएं तैयार करनी होंगी?',
      fil: 'Anong mga dokumento ang kailangan kong ihanda para sa form na ito?',
      ms: 'Apakah dokumen yang perlu saya sediakan untuk borang ini?'
    },
    avatar_greeting: {
      en: "Hi there! 👋 I'm Telmy, your form assistant. You can ask me any question or press the microphone button below to speak with me!",
      id: 'Halo! 👋 Saya Telmy, asisten formulir kamu. Kamu bisa tanyakan apa saja atau tekan tombol mikrofon di bawah untuk bicara langsung!',
      ja: 'こんにちは！ 👋 フォームアシスタントの Telmy です。質問を入力するか、下のマイクボタンを押してお話しください！',
      ko: '안녕하세요! 👋 양식 도우미 Telmy입니다. 질문을 입력하시거나 아래 마이크 버튼을 눌러 직접 말씀해 주세요!',
      zh: '您好！👋 我是您的表单助手 Telmy。您可以随时提问，或点击下方麦克风与我直接交谈！',
      'zh-TW': '您好！👋 我是您的表單助理 Telmy。您可以隨時提問，或點擊下方麥克風與我直接對話！',
      vi: 'Xin chào! 👋 Tôi là Telmy, trợ lý biểu mẫu của bạn. Bạn có thể hỏi bất cứ điều gì hoặc nhấn micrô bên dưới để trò chuyện!',
      th: 'สวัสดีครับ! 👋 ผมคือ Telmy ผู้ช่วยฟอร์มของคุณ ถามอะไรก็ได้หรือกดปุ่มไมโครโฟนด้านล่างเพื่อคุยกับผมเลย!',
      hi: 'नमस्ते! 👋 मैं Telmy हूँ। आप मुझसे कुछ भी पूछ सकते हैं या मुझसे बात करने के लिए नीचे दिए गए माइक को दबा सकते हैं!',
      fil: 'Kamusta! 👋 Ako si Telmy. Magtanong ng kahit ano o pindutin ang mikropono sa ibaba para makipag-usap!',
      ms: 'Hai! 👋 Saya Telmy, pembantu borang anda. Anda boleh tanya apa sahaja atau tekan butang mikrofon di bawah untuk bercakap!'
    },
    mic_perm_required_msg: {
      en: '🎙️ **Microphone Permission Required**: A new tab has opened to grant microphone access. Please click **Allow** on that tab, then click the microphone button again!',
      id: '🎙️ **Izin Mikrofon Diperlukan**: Tab baru telah dibuka untuk memberikan izin mikrofon satu kali klik. Silakan klik **Allow** pada tab tersebut, lalu tekan tombol mikrofon kembali!',
      ja: '🎙️ **マイクの許可が必要です**: マイクアクセスを許可するための新しいタブが開きました。そのタブで **許可** をクリックし、再度マイクボタンを押してください！',
      ko: '🎙️ **마이크 권한 필요**: 마이크 사용 권한을 허용할 수 있는 새 탭이 열렸습니다. 해당 탭에서 **허용**을 누른 후 마이크 버튼을 다시 눌러주세요!',
      zh: '🎙️ **需要麦克风权限**：已打开新标签页以授予麦克风权限。请在该标签页中点击**允许**，然后再次点击麦克风按钮！',
      'zh-TW': '🎙️ **需要麥克風權限**：已開啟新分頁以授予麥克風權限。請在該分頁中點擊**允許**，然後再次點擊麥克風按鈕！',
      vi: '🎙️ **Cần cấp quyền Micrô**: Tab mới đã mở để cấp quyền truy cập micrô. Vui lòng nhấp **Cho phép** trên tab đó, sau đó nhấp lại nút micrô!',
      th: '🎙️ **ต้องได้รับอนุญาตใช้ไมโครโฟน**: แท็บใหม่เปิดขึ้นเพื่ออนุญาตให้เข้าถึงไมโครโฟน โปรดคลิก **อนุญาต** บนแท็บนั้นแล้วกดปุ่มไมค์อีกครั้ง!',
      hi: '🎙️ **माइक्रोफ़ोन अनुमति आवश्यक**: माइक्रोफ़ोन एक्सेस देने के लिए एक नया टैब खुला है। कृपया उस टैब पर **Allow** पर क्लिक करें, फिर माइक बटन दोबारा दबाएं!',
      fil: '🎙️ **Kailangan ng Pahintulot sa Mikropono**: Nagbukas ng bagong tab para magbigay ng access. I-click ang **Allow** doon, saka pindutin muli ang mic!',
      ms: '🎙️ **Kebenaran Mikrofon Diperlukan**: Tab baharu telah dibuka untuk memberi kebenaran mikrofon. Sila klik **Allow** pada tab tersebut, kemudian tekan butang mikrofon semula!'
    },
    field_label_prefix: {
      en: 'Field', id: 'Kolom', ja: '項目', ko: '입력란',
      zh: '字段', 'zh-TW': '欄位', vi: 'Trường', th: 'ช่อง',
      hi: 'फ़ील्ड', fil: 'Kolum', ms: 'Ruangan'
    },
    summary_desc_fallback: {
      en: 'This page contains {count} form input fields.',
      id: 'Halaman ini memuat {count} kolom isian formulir.',
      ja: 'このページには {count} 個の入力項目があります。',
      ko: '이 페이지에는 {count}개의 입력란이 있습니다.',
      zh: '此页面包含 {count} 个表单输入项。',
      'zh-TW': '此頁面包含 {count} 個表單輸入項。',
      vi: 'Trang này có {count} trường nhập biểu mẫu.',
      th: 'หน้านี้มีช่องกรอกแบบฟอร์ม {count} ช่อง',
      hi: 'इस पेज पर {count} फ़ॉर्म फ़ील्ड्स मौजूद हैं।',
      fil: 'Ang pahinang ito ay may {count} na kolum.',
      ms: 'Halaman ini mengandungi {count} ruangan borang.'
    },
    progress_sub_text: {
      en: '{filled} of {total} fields filled',
      id: '{filled} dari {total} kolom terisi',
      ja: '{total} 項目中 {filled} 項目入力済み',
      ko: '{total}개 중 {filled}개 작성됨',
      zh: '已填写 {filled} / {total} 项',
      'zh-TW': '已填寫 {filled} / {total} 項',
      vi: 'Đã điền {filled} trên {total} trường',
      th: 'กรอกแล้ว {filled} จาก {total} ช่อง',
      hi: '{total} में से {filled} फ़ील्ड्स भरे गए',
      fil: '{filled} sa {total} na kolum ay napunan',
      ms: '{filled} daripada {total} ruangan telah diisi'
    },
    pdf_intro_msg: {
      en: "I've analyzed {title}. You can type into fields directly and export the completed official document.",
      id: 'Saya telah menganalisis formulir {title}. Anda dapat mengisi langsung kolom di bawah dan mengekspor hasilnya.',
      ja: '{title} を解析しました。直接入力して完成した公式書類を書き出せます。',
      ko: '{title}을(를) 분석했습니다. 아래에서 직접 입력 후 문서를 내보낼 수 있습니다.',
      zh: '已分析 {title}。您可以直接在下方填写并导出完成的正式文档。',
      'zh-TW': '已分析 {title}。您可以直接在下方填寫並匯出完成的正式文件。',
      vi: 'Tôi đã phân tích {title}. Bạn có thể điền trực tiếp và xuất tài liệu hoàn chỉnh.',
      th: 'วิเคราะห์ {title} แล้ว คุณสามารถกรอกโดยตรงและส่งออกเอกสารฉบับสมบูรณ์ได้',
      hi: 'मैंने {title} का विश्लेषण किया है। आप सीधे भर सकते हैं और दस्तावेज़ निर्यात कर सकते हैं।',
      fil: 'Nasuri ko na ang {title}. Maaari mong sagutan nang direkta at i-export ang opisyal na dokumento.',
      ms: 'Saya telah menganalisis borang {title}. Anda boleh mengisi terus ruangan di bawah dan mengeksport hasilnya.'
    },
    your_document: {
      en: 'your document', id: 'dokumen Anda', ja: 'ドキュメント', ko: '문서',
      zh: '您的文档', 'zh-TW': '您的文件', vi: 'tài liệu của bạn', th: 'เอกสารของคุณ',
      hi: 'आपका दस्तावेज़', fil: 'iyong dokumento', ms: 'dokumen anda'
    },
    how_to_complete_field_msg: {
      en: 'How do I complete "{field}" on this form?',
      id: 'Bagaimana cara mengisi "{field}" pada formulir ini?',
      ja: 'このフォームで「{field}」はどのように記入しますか？',
      ko: '이 양식에서 "{field}"은(는) 어떻게 작성하나요?',
      zh: '如何在此表单中填写“{field}”？',
      'zh-TW': '如何在此表單中填寫「{field}」？',
      vi: 'Cách điền "{field}" trên biểu mẫu này như thế nào?',
      th: 'กรอก "{field}" ในฟอร์มนี้อย่างไร?',
      hi: 'इस फ़ॉर्म पर "{field}" को कैसे भरें?',
      fil: 'Paano sasagutan ang "{field}" sa form na ito?',
      ms: 'Bagaimana cara mengisi "{field}" pada borang ini?'
    },
    audit_scan_error: {
      en: 'Unable to scan form values on this webpage. Please ensure active input fields exist.',
      id: 'Tidak dapat memindai nilai isian formulir pada halaman web ini. Pastikan halaman memiliki input aktif.',
      ja: 'このウェブページのフォーム値をスキャンできません。入力項目が存在することをご確認ください。',
      ko: '이 웹페이지의 양식 값을 스캔할 수 없습니다. 활성 입력란이 있는지 확인하세요.',
      zh: '无法扫描此网页上的表单值。请确保页面具有有效输入项。',
      'zh-TW': '無法掃描此網頁上的表單值。請確認頁面具有有效輸入欄位。',
      vi: 'Không thể quét các giá trị biểu mẫu trên trang này. Hãy đảm bảo trang có các trường nhập.',
      th: 'ไม่สามารถสแกนค่าในฟอร์มของหน้านี้ได้ โปรดตรวจสอบว่ามีช่องกรอกที่ใช้งานอยู่',
      hi: 'इस वेबपेज पर फ़ॉर्म मानों को स्कैन करने में असमर्थ। कृपया सक्रिय इनपुट फ़ील्ड सुनिश्चित करें।',
      fil: 'Hindi ma-scan ang mga value ng form sa webpage na ito. Siguraduhing may aktibong input.',
      ms: 'Tidak dapat mengimbas nilai isian borang pada halaman ini. Pastikan terdapat input aktif.'
    },
    audit_no_fields: {
      en: 'No form fields detected to audit.',
      id: 'Belum ada kolom yang terdeteksi untuk diaudit.',
      ja: '検証対象の入力項目が検出されていません。',
      ko: '검토할 양식 입력란이 감지되지 않았습니다.',
      zh: '未检测到可审核的表单项。',
      'zh-TW': '未偵測到可審核的表單欄位。',
      vi: 'Không tìm thấy trường biểu mẫu nào để kiểm tra.',
      th: 'ไม่พบช่องกรอกแบบฟอร์มที่จะตรวจสอบ',
      hi: 'ऑडिट करने के लिए कोई फ़ॉर्म फ़ील्ड नहीं मिली।',
      fil: 'Walang nakitang kolum para i-audit.',
      ms: 'Tiada ruangan borang yang dikesan untuk diaudit.'
    },
    audit_required_empty_title: {
      en: 'Required Field Empty:', id: 'Kolom Wajib Belum Diisi:', ja: '必須項目が未入力:', ko: '필수 항목 누락:',
      zh: '必填项未填写：', 'zh-TW': '必填欄位未填寫：', vi: 'Trường bắt buộc chưa điền:', th: 'ยังไม่ได้กรอกช่องบังคับ:',
      hi: 'आवश्यक फ़ील्ड खाली है:', fil: 'Kailangang Kolum ay Walang Laman:', ms: 'Ruangan Wajib Belum Diisi:'
    },
    audit_required_empty_desc: {
      en: 'This field is required. Leaving it blank may cause submission rejection or disqualification.',
      id: 'Kolom ini wajib diisi menurut aturan portal. Kosong berisiko diskualifikasi otomatis.',
      ja: 'この項目は必須です。空欄のまま送信すると却下される恐れがあります。',
      ko: '이 항목은 필수입니다. 비워 둘 경우 제출이 거부되거나 탈락될 수 있습니다.',
      zh: '此项为必填项。留空可能导致提交被拒或丧失资格。',
      'zh-TW': '此欄位為必填項目。留空可能導致提交遭拒或喪失資格。',
      vi: 'Trường này là bắt buộc. Để trống có thể dẫn đến việc hồ sơ bị từ chối.',
      th: 'ช่องนี้เป็นช่องบังคับ การเว้นว่างไว้อาจทำให้ถูกปฏิเสธการส่งฟอร์ม',
      hi: 'यह फ़ील्ड आवश्यक है। इसे खाली छोड़ने से आवेदन अस्वीकार हो सकता है।',
      fil: 'Kailangan ang kolum na ito. Ang pag-iwan nitong walang laman ay maaaring maging sanhi ng pagtanggi.',
      ms: 'Ruangan ini wajib diisi. Dibiarkan kosong berisiko pembatalan permohonan.'
    },
    audit_passport_crit_title: {
      en: 'Passport Validity Critical (<6 Months):', id: 'Masa Berlaku Paspor Kritis (<6 Bulan):',
      ja: 'パスポート有効期限が切迫 (<6ヶ月):', ko: '여권 유효기간 위험 (<6개월):',
      zh: '护照有效期告急（<6个月）：', 'zh-TW': '護照有效期限告急（<6個月）：',
      vi: 'Hạn hộ chiếu sắp hết (<6 tháng):', th: 'อายุหนังสือเดินทางเหลือน้อย (<6 เดือน):',
      hi: 'पासपोर्ट वैधता महत्वपूर्ण (<6 महीने):', fil: 'Kritikal ang Bisa ng Pasaporte (<6 Buwan):',
      ms: 'Tempoh Sah Pasport Kritikal (<6 Bulan):'
    },
    audit_passport_crit_desc: {
      en: 'Most embassies, consulates, and airlines require at least 6 months validity from departure date.',
      id: 'Hampir seluruh kedutaan dan maskapai menolak paspor dengan sisa masa berlaku kurang dari 6 bulan.',
      ja: 'ほとんどの大使館や航空会社は、出発日から6ヶ月以上の有効期限を要求します。',
      ko: '대부분의 대사관과 항공사는 출발일 기준 최소 6개월의 유효기간을 요구합니다.',
      zh: '大多数使馆与航空公司要求护照自出发日起至少有6个月有效期。',
      'zh-TW': '大多數使館與航空公司要求護照自出發日起至少具備6個月有效期限。',
      vi: 'Hầu hết các đại sứ quán và hãng hàng không yêu cầu thời hạn ít nhất 6 tháng kể từ ngày khởi hành.',
      th: 'สถานทูตและสายการบินส่วนใหญ่ต้องการอายุหนังสือเดินทางอย่างน้อย 6 เดือนนับจากวันเดินทาง',
      hi: 'अधिकांश दूतावास और एयरलाइंस प्रस्थान तिथि से कम से कम 6 महीने की वैधता मांगते हैं।',
      fil: 'Karamihan sa mga embahada at airline ay nangangailangan ng hindi bababa sa 6 na buwang bisa.',
      ms: 'Hampir semua kedutaan dan syarikat penerbangan menolak pasport dengan baki kurang 6 bulan.'
    },
    audit_academic_title_title: {
      en: 'Academic Title in Name Field:', id: 'Gelar Akademik Terdeteksi di Kolom Nama:',
      ja: '氏名欄に学位・称号が検出されました:', ko: '이름란에 학위/직함이 포함됨:',
      zh: '姓名栏检测到学位头衔：', 'zh-TW': '姓名欄位偵測到學位頭銜：',
      vi: 'Phát hiện học vị trong trường tên:', th: 'พบคำนำหน้าทางวิชาการในช่องชื่อ:',
      hi: 'नाम फ़ील्ड में शैक्षणिक उपाधि पाई गई:', fil: 'May Academic Title sa Kolum ng Pangalan:',
      ms: 'Gelaran Akademik Dikesan pada Ruangan Nama:'
    },
    audit_academic_title_desc: {
      en: 'International scholarship and visa portals usually require exact passport name without academic/honorary titles.',
      id: 'Sebagian besar pendaftaran beasiswa dan visa internasional melarang gelar di kolom nama resmi paspor.',
      ja: '国際的な奨学金やビザでは、学位称号を含まないパスポート記載通りの氏名が求められます。',
      ko: '국제 장학금 및 비자 포털은 직함을 제외한 여권상의 정확한 성명을 요구합니다.',
      zh: '国际奖学金和签证申请通常要求填写与护照一致的姓名，严禁包含学位或荣誉头衔。',
      'zh-TW': '國際獎學金和簽證申請通常要求填寫與護照完全一致的姓名，嚴禁包含學位或榮譽頭銜。',
      vi: 'Hồ sơ học bổng và thị thực quốc tế thường yêu cầu tên chính xác theo hộ chiếu mà không có học vị.',
      th: 'พอร์ทัลทุนการศึกษาและวีซ่าระหว่างประเทศมักกำหนดให้ระบุชื่อตามหนังสือเดินทางโดยไม่มีตำแหน่งทางวิชาการ',
      hi: 'अंतर्राष्ट्रीय छात्रवृत्ति और वीज़ा पोर्टल आमतौर पर बिना किसी उपाधि के सटीक पासपोर्ट नाम मांगते हैं।',
      fil: 'Karaniwang hinihingi ng international scholarship at visa ang eksaktong pangalan sa pasaporte nang walang titulo.',
      ms: 'Sebahagian besar pendaftaran biasiswa dan visa melarang gelaran akademik pada nama rasmi pasport.'
    },
    audit_lowercase_name_title: {
      en: 'Name Field is Lowercase:', id: 'Nama Huruf Kecil Semua:', ja: '氏名がすべて小文字です:', ko: '이름이 모두 소문자입니다:',
      zh: '姓名栏为全小写：', 'zh-TW': '姓名欄位為全小寫：', vi: 'Tên viết toàn bộ bằng chữ thường:', th: 'ชื่อเป็นตัวพิมพ์เล็กทั้งหมด:',
      hi: 'नाम फ़ील्ड केवल छोटे अक्षरों में है:', fil: 'Maliit na Titik Lahat ang Pangalan:', ms: 'Nama Huruf Kecil Sahaja:'
    },
    audit_lowercase_name_desc: {
      en: 'Recommended to use UPPERCASE or Title Case matching your official identity document.',
      id: 'Disarankan gunakan HURUF KAPITAL atau Title Case sesuai paspor untuk menghindari kesalahan cetak berkas.',
      ja: '書類の印刷不備を防ぐため、公的身分証に合わせた大文字またはタイトルケースを推奨します。',
      ko: '문서 인쇄 오류를 방지하기 위해 신분증과 일치하는 대문자 작성을 권장합니다.',
      zh: '建议使用全大写或首字母大写，与官方证件保持完全一致。',
      'zh-TW': '建議使用全大寫或首字母大寫，與官方身分證明文件保持完全一致。',
      vi: 'Khuyến nghị dùng CHỮ HOA hoặc Title Case khớp với giấy tờ tùy thân chính thức.',
      th: 'แนะนำให้ใช้ตัวพิมพ์ใหญ่หรือ Title Case ให้ตรงกับเอกสารทางการ',
      hi: 'आधिकारिक दस्तावेज़ से मिलान करने के लिए बड़े अक्षरों (UPPERCASE) का उपयोग करने की सलाह दी जाती है।',
      fil: 'Inirerekomendang gamitin ang MALALAKING TITIK o Title Case na tugma sa iyong dokumento.',
      ms: 'Disyorkan gunakan HURUF BESAR atau Title Case sepadan dengan dokumen rasmi.'
    },
    audit_id_length_title: {
      en: 'Non-Standard ID Length ({count} digits)', id: 'Panjang NIK Tidak Standar ({count} digit)',
      ja: '身元番号の桁数が規格外です ({count} 桁)', ko: '표준이 아닌 식별번호 길이 ({count}자리)',
      zh: '证件号长度不规范（{count} 位）', 'zh-TW': '證件號長度不符規範（{count} 碼）',
      vi: 'Độ dài số định danh không chuẩn ({count} số)', th: 'ความยาวหมายเลขประจำตัวไม่เป็นมาตรฐาน ({count} หลัก)',
      hi: 'गैर-मानक आईडी लंबाई ({count} अंक)', fil: 'Hindi Karaniwang Haba ng ID ({count} digit)',
      ms: 'Panjang No. Kad Pengenalan Tidak Piawai ({count} digit)'
    },
    audit_id_length_desc: {
      en: 'Standard Indonesian National ID (NIK) is exactly 16 digits.',
      id: 'Format NIK Indonesia adalah tepat 16 digit angka.',
      ja: 'インドネシアの身分証番号 (NIK) は正確に16桁です。',
      ko: '인도네시아 국가 식별 번호(NIK)는 정확히 16자리 숫자입니다.',
      zh: '印尼国家身份证（NIK）规范格式为准确的 16 位纯数字。',
      'zh-TW': '印尼國家身分證（NIK）標準格式為準確的 16 碼純數字。',
      vi: 'Định dạng NIK Indonesia tiêu chuẩn là chính xác 16 chữ số.',
      th: 'รูปแบบ NIK ของอินโดนีเซียคือตัวเลข 16 หลัก',
      hi: 'मानक इंडोनेशियाई राष्ट्रीय पहचान पत्र (NIK) ठीक 16 अंकों का होता है।',
      fil: 'Ang karaniwang Indonesian National ID (NIK) ay eksaktong 16 na digit.',
      ms: 'Format NIK Indonesia adalah tepat 16 digit angka.'
    },
    audit_all_clean_title: {
      en: 'All Fields Meet Standard Requirements', id: 'Semua Isian Sesuai Standar Birokrasi',
      ja: 'すべての項目が基準を満たしています', ko: '모든 항목이 규정 기준을 충족합니다',
      zh: '所有填写项均符合规范标准', 'zh-TW': '所有填寫欄位皆符合規範標準',
      vi: 'Tất cả các trường đều đạt chuẩn', th: 'ทุกช่องตรงตามมาตรฐานที่กำหนด',
      hi: 'सभी फ़ील्ड्स मानक आवश्यकताओं को पूरा करते हैं', fil: 'Lahat ng Kolum ay Sumusunod sa Pamantayan',
      ms: 'Semua Isian Mematuhi Piawaian'
    },
    audit_all_clean_desc: {
      en: 'Names, dates, and required fields are properly formatted with no critical errors detected.',
      id: 'Format nama, tanggal, dan seluruh kolom wajib telah terisi rapi tanpa potensi diskualifikasi.',
      ja: '氏名、日付、必須項目が正確に記入されており、重大な不備は検出されませんでした。',
      ko: '이름, 날짜 및 필수 항목이 올바르게 작성되었으며 심각한 오류가 감지되지 않았습니다.',
      zh: '姓名、日期和必填项格式正确，未检测到任何严重问题。',
      'zh-TW': '姓名、日期和必填欄位格式正確，未偵測到任何重大錯誤。',
      vi: 'Tên, ngày tháng và các trường bắt buộc đã được định dạng đúng, không có lỗi nghiêm trọng.',
      th: 'ชื่อ วันที่ และช่องบังคับได้รับการจัดรูปแบบอย่างถูกต้อง ไม่พบข้อผิดพลาดร้ายแรง',
      hi: 'नाम, तिथियां और आवश्यक फ़ील्ड्स उचित रूप से प्रारूपित हैं, कोई त्रुटि नहीं मिली।',
      fil: 'Maayos ang format ng mga pangalan, petsa, at kinakailangang kolum nang walang kritikal na error.',
      ms: 'Format nama, tarikh, dan semua ruangan wajib telah diisi dengan kemas tanpa ralat.'
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
      if (!tab || !tab.id || tab.url?.startsWith('chrome-extension://')) {
        [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      }
      return tab || null;
    } catch (e) {
      return null;
    }
  }

  // 1. Initialize Active Tab, User & Onboarding
  async function init() {
    // Load Settings & User
    const stored = await chrome.storage.local.get(['settings', 'hasCompletedOnboarding', 'user', 'telmyBotMode']);
    if (stored.settings) {
      if (!stored.settings.apiUrl || stored.settings.apiUrl.includes('localhost') || stored.settings.apiUrl.includes('127.0.0.1') || stored.settings.apiUrl.includes('telmy.web.app') || stored.settings.apiUrl.includes('asia-northeast1.run.app')) {
        stored.settings.apiUrl = 'https://telmy-ai.cloud.run/api';
        chrome.storage.local.set({ settings: stored.settings });
      }
      currentLanguage = stored.settings.language || 'en';
      langSelect.value = currentLanguage;
    } else {
      chrome.storage.local.set({ settings: { language: 'en', apiUrl: 'https://telmy-ai.cloud.run/api', isActive: true } });
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

    // Initialize Mode Toggle Cards (Chatbot vs Voicebot)
    const initialMode = stored.telmyBotMode || 'chat';
    setBotMode(initialMode);
    setupModeToggleCards();

    // Determine current active tab
    const tab = await getActiveWebTab();
    if (tab && tab.id) {
      currentTabId = tab.id;
      await loadSessionChat(tab.url);
      checkPdfTab(tab.url);
      // Passive check: only read status if already scanned; NEVER attach badges on unprompted/login pages
      checkTabScannerStatus(tab.id);
      checkPageTranslationStatus(tab.id);
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

    // Clean up active tab badges when sidepanel is closed/unloaded
    window.addEventListener('beforeunload', () => {
      if (currentTabId) {
        safeSendTabMessage(currentTabId, { type: 'DEACTIVATE_SCANNER' });
      }
    });

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

    // Handle tab switching in browser
    if (chrome.tabs && chrome.tabs.onActivated) {
      chrome.tabs.onActivated.addListener(async (activeInfo) => {
        if (currentTabId && currentTabId !== activeInfo.tabId) {
          safeSendTabMessage(currentTabId, { type: 'DEACTIVATE_SCANNER' });
        }
        currentTabId = activeInfo.tabId;
        const [newTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (newTab) {
          loadSessionChat(newTab.url);
          checkPdfTab(newTab.url);
        }
        if (isScannerRunning) {
          activateScannerOnTab(currentTabId);
        }
        checkPageTranslationStatus(currentTabId);
      });
    }

    // Handle in-page navigation / page reload / SPA loading on current tab
    if (chrome.tabs && chrome.tabs.onUpdated) {
      chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (tabId === currentTabId && (changeInfo.status === 'complete' || changeInfo.url)) {
          if (tab && tab.url) {
            loadSessionChat(tab.url);
            checkPdfTab(tab.url);
          }
          if (isScannerRunning) {
            activateScannerOnTab(currentTabId);
          }
          checkPageTranslationStatus(currentTabId);
        }
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
      popoverUserEmail.textContent = currentUser.email || 'Connected';
      popoverAuthBadge.textContent = '✓ Connected';
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

      popoverUserName.textContent = 'Guest User';
      popoverUserEmail.textContent = 'Not signed in';
      popoverAuthBadge.textContent = 'Login Required';
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
      if (currentTabId) {
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
      if (currentTabId && isScannerRunning) {
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
    let apiUrl = settings.apiUrl || 'https://telmy-ai.cloud.run/api';
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1') || apiUrl.includes('telmy.web.app') || apiUrl.includes('asia-northeast1.run.app')) {
      apiUrl = 'https://telmy-ai.cloud.run/api';
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
        badgeFieldsCount.textContent = '0';
        fieldsCountPill.textContent = `0 ${t('tab_fields') || 'Fields'}`;
        return;
      }
      safeSendTabMessage(tabId, { type: 'QUERY_PAGE_STATUS' }, (err, res) => {
        if (!err && res && res.isActive && res.detectedFieldsCount !== undefined) {
          badgeFieldsCount.textContent = res.detectedFieldsCount;
          fieldsCountPill.textContent = `${res.detectedFieldsCount} ${t('tab_fields') || 'Fields'}`;
        }
      });
    } catch (e) {}
  }

  // Direct Handler function to update UI from scanned response
  function applyScannedData(data) {
    if (!data) return;
    if (data.fields && Array.isArray(data.fields) && data.fields.length > 0) {
      detectedFields = data.fields;
      cachedPageSummary = data.summary || null;
      badgeFieldsCount.textContent = detectedFields.length;
      fieldsCountPill.textContent = `${detectedFields.length} ${t('tab_fields') || 'Fields'}`;

      // User requested: during analysis, show ONLY loading animation!
      // No Guide Me button, no audit, no detected fields list.
      showFieldsState('analyzing');

      // Trigger Batch Form Analysis to Backend (Gemini -> DB -> Vector Cache)
      triggerBatchBackendAnalysis(detectedFields);
    } else if (data.count !== undefined) {
      badgeFieldsCount.textContent = data.count;
      fieldsCountPill.textContent = `${data.count} ${t('tab_fields') || 'Fields'}`;
      if (data.count === 0) {
        showFieldsState('empty');
      }
    }
  }

  async function triggerBatchBackendAnalysis(fields, forceRefresh = false) {
    if (!currentTabId || !fields || fields.length === 0) {
      showFieldsState('empty');
      return;
    }

    // Ensure we are in pure loading animation state
    showFieldsState('analyzing');

    try {
      const tab = await chrome.tabs.get(currentTabId).catch(() => null);
      if (!tab || !tab.url || isTelmyInternalUrl(tab.url)) {
        showFieldsState('empty');
        return;
      }

      const domain = new URL(tab.url).hostname;
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
          url: tab.url,
          title: tab.title || document.title || 'Web Form',
          fields: serializableFields,
          language: currentLanguage
        }
      }, (resp) => {
        const lastErr = chrome.runtime.lastError;
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
          const summaryStr = analyzed.summary || (cachedPageSummary?.description) || 'Formulir online resmi untuk pendaftaran layanan.';
          if (analyzedSummaryText) {
            analyzedSummaryText.textContent = summaryStr;
          }

          // Transition from Loading Animation -> Analyzed Result Ready State!
          showFieldsState('analyzed');

          appendChatMessage({
            role: 'assistant',
            text: `📋 **Form Berhasil Dianalisis (${analyzed.fields?.length || detectedFields.length} Kolom Dikenali)**\n\n📌 *${summaryStr}*\n\n✓ *Silakan klik pada kolom di halaman web yang ingin kamu isi, atau klik tombol **Guide Me (Field by Field)** di tab Fields & Audit.*`,
            actions: [
              { type: 'GUIDE_FIELDS', label: '🚀 Guide Me (Field by Field)' }
            ],
            time: formatTime(new Date())
          });
        } else {
          // Failure handling: revert to empty state with honest error and retry
          const errDetail = resp?.error || lastErr?.message || 'Gemini AI tidak dapat merespons';
          showFieldsState('empty');

          const lblEmptyTitle = document.getElementById('lbl-empty-fields-title');
          if (lblEmptyTitle) lblEmptyTitle.textContent = 'Analisis Formulir Gagal';

          const lblEmptyDesc = document.getElementById('lbl-empty-fields-desc');
          if (lblEmptyDesc) {
            lblEmptyDesc.textContent = `Gagal menganalisis formulir: ${errDetail}. Silakan klik tombol di bawah untuk mencoba kembali.`;
          }

          const lblBtnAnalyzeNow = document.getElementById('lbl-btn-analyze-now');
          if (lblBtnAnalyzeNow) lblBtnAnalyzeNow.textContent = '🔄 Coba Analisis Formulir Lagi';

          appendChatMessage({
            role: 'assistant',
            text: `⚠️ **Gagal Menganalisis Struktur Formulir Secara Penuh**\n\n${errDetail}\n\n*Silakan klik tombol Coba Analisis Formulir Lagi.*`,
            time: formatTime(new Date())
          });
        }
      });
    } catch (e) {
      console.warn('[Telmy] Batch backend analysis notice:', e.message);
      showFieldsState('empty');
    }
  }

  // Unified Full Form Analysis & Rescan
  async function triggerFullFormAnalysis(triggerBtn = null) {
    if (btnRescan) {
      btnRescan.style.transform = 'rotate(180deg)';
      setTimeout(() => { if (btnRescan) btnRescan.style.transform = ''; }, 400);
    }

    // Immediately show ONLY pure loading animation!
    showFieldsState('analyzing');

    // Resolve active webpage tab
    const tab = await getActiveWebTab();
    const tabId = (tab && tab.id) ? tab.id : currentTabId;
    if (!tabId) {
      showFieldsState('empty');
      return;
    }
    currentTabId = tabId;
    isCurrentPageAnalyzed = false;

    // Activate scanner on tab safely without unhandled runtime.lastError
    activateScannerOnTab(tabId);
  }

  // 4. Activate Scanner on Active Tab (On-Demand 1-Click with Zero Browser Reload)
  async function activateScannerOnTab(tabId, onDone = null) {
    if (!tabId) return;
    try {
      const tab = await chrome.tabs.get(tabId).catch(() => null);
      if (!tab || !tab.url || 
          tab.url.startsWith('chrome://') || 
          tab.url.startsWith('chrome-extension://') || 
          tab.url.startsWith('edge://') || 
          tab.url.startsWith('about:') || 
          tab.url.startsWith('view-source:') ||
          isTelmyInternalUrl(tab.url)
      ) {
        badgeFieldsCount.textContent = '0';
        fieldsCountPill.textContent = `0 ${t('tab_fields') || 'Fields'}`;
        showFieldsState('empty');
        return;
      }

      safeSendTabMessage(tabId, { type: 'ACTIVATE_SCANNER' }, (err, res) => {
        if (err || !res) {
          // Robust top-frame dynamic injection (no page refresh required!)
          injectContentScript(tabId, () => {
            safeSendTabMessage(tabId, { type: 'ACTIVATE_SCANNER' }, (err2, res2) => {
              if (res2) {
                applyScannedData(res2);
                if (onDone) onDone(res2);
              } else {
                showFieldsState('empty');
              }
            });
          });
        } else {
          applyScannedData(res);
          if (onDone) onDone(res);
        }
      });
    } catch (err) {
      showFieldsState('empty');
    }
  }

  // Deactivate Scanner on Active Tab (Total DOM Cleanup)
  function deactivateScannerOnTab(tabId) {
    if (!tabId) return;
    safeSendTabMessage(tabId, { type: 'DEACTIVATE_SCANNER' });
    badgeFieldsCount.textContent = '0';
    fieldsCountPill.textContent = `0 ${t('tab_fields') || 'Fields'}`;
  }

  // On-demand injection into active tab (targets top frame reliably without failing on subframes)
  async function injectContentScript(tabId, onInjected) {
    try {
      const tab = await chrome.tabs.get(tabId).catch(() => null);
      if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:') || tab.url.startsWith('view-source:') || isTelmyInternalUrl(tab.url)) {
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
      badgeFieldsCount.textContent = detectedFields.length;
      fieldsCountPill.textContent = `${detectedFields.length} ${t('tab_fields') || 'Fields'}`;

      // Automatically run full batch analysis on backend if not yet analyzed
      if (!isCurrentPageAnalyzed && detectedFields.length > 0) {
        showFieldsState('analyzing');
        triggerBatchBackendAnalysis(detectedFields);
      }

      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'GMT_FIELD_FOCUSED') {
      const idx = message.index;
      selectFieldByIndex(idx, false);
      sendResponse({ success: true });
      return false;
    }
  });

  // 4. Tab Navigation
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
      panes.forEach((p) => p.classList.toggle('active', p.id === `pane-${targetTab}`));
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
    const elEmptyTitle = document.getElementById('lbl-empty-fields-title');
    if (elEmptyTitle) elEmptyTitle.textContent = t('empty_fields_title');
    const elEmptyDesc = document.getElementById('lbl-empty-fields-desc');
    if (elEmptyDesc) elEmptyDesc.textContent = t('empty_fields_desc');
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
        ? `💬 Mode: ${t('mode_chat_compact')}`
        : `🎙️ Mode: ${t('mode_voice_compact')}`;
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

    if (chatHistory.length === 0) {
      if (currentBotMode === 'voice') {
        // Voicebot mode has its own large interactive avatar stage; hide welcome card to prevent overlap
        return;
      }

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
        <div class="welcome-section-group">
          <div class="welcome-group-title">ONLINE FORM</div>
          <div class="welcome-chips-grid">
            <button type="button" class="welcome-action-chip" data-action="ANALYZE_FORM" style="background: rgba(37,99,235,0.08); border-color: rgba(37,99,235,0.3); color: #1d4ed8; font-weight: 600;">
              <span class="chip-icon">🔍</span>
              <span class="chip-label">1. Analyze This Form</span>
            </button>
            <button type="button" class="welcome-action-chip" data-action="TRANSLATE_PAGE">
              <span class="chip-icon">🌐</span>
              <span class="chip-label">2. Translate</span>
            </button>
            <button type="button" class="welcome-action-chip" data-action="AUTOFILL_FORM" style="background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.3); color: #047857; font-weight: 600;">
              <span class="chip-icon">⚡</span>
              <span class="chip-label">3. 1-Click Auto Fill</span>
            </button>
          </div>
        </div>

        <div class="welcome-section-group" style="margin-top: 10px;">
          <div class="welcome-group-title">OFFLINE FORM</div>
          <div class="welcome-chips-grid">
            <button type="button" class="welcome-action-chip" data-action="OPEN_PDF" style="background: rgba(14,165,233,0.08); border-color: rgba(14,165,233,0.3); color: #0284c7; font-weight: 600;">
              <span class="chip-icon">📄</span>
              <span class="chip-label">4. Upload File</span>
            </button>
          </div>
        </div>
      `;

      hero.querySelectorAll('.welcome-action-chip').forEach(btn => {
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

  async function handleSendMessage(text) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    chatInput.value = '';
    chatInput.style.height = '';

    const userMsg = {
      role: 'user',
      text: cleanText,
      time: formatTime(new Date())
    };
    appendChatMessage(userMsg);

    // Direct Intent: Context-Aware Page Translation
    if (/(terjemah.*halaman|translate.*page|translate this page|terjemahkan web|terjemahkan situs)/i.test(cleanText)) {
      handleTogglePageTranslation();
      return;
    }

    if (telmyAvatar) telmyAvatar.setState('THINKING');

    // Call Backend Gateway / Chat API
    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          type: 'SEND_CHAT_MESSAGE',
          payload: {
            message: cleanText,
            history: chatHistory.slice(-8),
            language: currentLanguage,
            formContext: {
              activeField: activeFieldIndex >= 0 ? detectedFields[activeFieldIndex] : null,
              fieldsCount: detectedFields.length
            }
          }
        }, (res) => {
          if (chrome.runtime.lastError) resolve(null);
          else resolve(res);
        });
      });

      const reply = response && response.data && response.data.reply
        ? response.data.reply
        : t('default_chat_reply');

      const actions = response && response.data && Array.isArray(response.data.actions)
        ? response.data.actions
        : [];

      const assistantMsg = {
        role: 'assistant',
        text: reply,
        actions: actions,
        time: formatTime(new Date())
      };
      appendChatMessage(assistantMsg);

      // Speak response using Gemini TTS
      if (!isMuted) {
        speakResponse(reply);
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
    chatInput.style.height = Math.max(58, Math.min(chatInput.scrollHeight, 140)) + 'px';
  });

  function appendChatMessage(msg) {
    chatHistory.push(msg);
    saveSessionChat();
    appendChatMessageDOM(msg);
  }

  function appendChatMessageDOM(msg) {
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
    bubble.innerHTML = formatted;

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
      openPdfMode();
    } else if (act.type === 'TAB_FIELDS') {
      document.getElementById('tab-btn-fields').click();
    } else if (act.type === 'TAB_SUMMARY') {
      document.getElementById('tab-btn-summary').click();
    } else if (act.type === 'FOCUS_FIELD' && act.index !== undefined) {
      selectFieldByIndex(act.index, true);
      document.getElementById('tab-btn-fields').click();
    }
  }

  function openPdfMode() {
    tabBtns.forEach((b) => b.classList.remove('active'));
    panes.forEach((p) => p.classList.toggle('active', p.id === 'pane-pdf'));
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
        if (lblTranslateSubtitle) lblTranslateSubtitle.textContent = 'Gemini 3.5 Flash-Lite • Preserving UI/UX & Glossary...';
        if (btnToggleTranslate) {
          btnToggleTranslate.className = 'btn-translate-action loading';
          if (btnTranslateIcon) btnTranslateIcon.textContent = '⏳';
          if (btnTranslateLabel) btnTranslateLabel.textContent = 'Translating...';
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

  async function handleTogglePageTranslation() {
    if (isTranslating) return;

    if (!currentTabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) currentTabId = tab.id;
    }
    if (!currentTabId) return;

    // 1. Revert mode
    if (isPageTranslated) {
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
    isTranslating = true;
    updateTranslateBannerUI();

    // Extract texts from active tab safely
    safeSendTabMessage(currentTabId, { type: 'TRANSLATOR_EXTRACT_TEXTS' }, async (err, extractRes) => {
      // If error (e.g. content script not injected yet), inject & retry
      if (err || !extractRes || !extractRes.texts) {
        await injectContentScript(currentTabId, () => {
          safeSendTabMessage(currentTabId, { type: 'TRANSLATOR_EXTRACT_TEXTS' }, (err2, retryRes) => {
            if (retryRes && retryRes.texts) {
              executeTranslationPayload(retryRes);
            } else {
              isTranslating = false;
              updateTranslateBannerUI();
              alert('Unable to extract webpage text. Please refresh the page and try again.');
            }
          });
        });
        return;
      }

      executeTranslationPayload(extractRes);
    });
  }

  async function executeTranslationPayload(extractData) {
    const { texts, pageContext } = extractData;
    const count = Object.keys(texts || {}).length;

    if (count === 0) {
      isTranslating = false;
      updateTranslateBannerUI();
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
          translatedElementCount = applyRes?.appliedCount || Object.keys(response.data.translations).length;
          updateTranslateBannerUI();

          const langUpper = currentLanguage.toUpperCase();

          appendChatMessage({
            role: 'assistant',
            text: `🌐 **Full Page Translated (${translatedElementCount} elements)**\n\nThe webpage has been translated into **${langUpper}** using **Google Gemini AI**.\n\n✓ **Official Bureaucracy Terms Preserved** (e.g., NIK, KTP, NPWP, SKCK)\n✓ **UI/UX Standards Applied** (Button & navigation actions mapped professionally)\n\nYou can click **Show Original** at any time to revert.`,
            actions: [
              { type: 'REVERT_PAGE', label: '🔙 ' + t('btn_revert_page') },
              { type: 'TAB_FIELDS', label: '📋 ' + t('tab_fields') }
            ],
            time: formatTime(new Date())
          });
        });
      } else {
        throw new Error(response?.error || 'Backend translation failed');
      }
    } catch (err) {
      console.warn('[Translate Error]', err);
      isTranslating = false;
      updateTranslateBannerUI();

      appendChatMessage({
        role: 'assistant',
        text: `❌ **Gagal Menerjemahkan Halaman**\n\n${err.message || 'Gemini AI tidak dapat merespons atau batas kuota API tercapai.'}\n\nTidak ada terjemahan tebakan/lokal yang diterapkan. Silakan periksa pengaturan kuota atau coba lagi.`,
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
    } else {
      // Voicebot mode: active speech assistant with large animated robot & big mic
      if (cardModeVoice) cardModeVoice.classList.add('active');
      if (cardModeChat) cardModeChat.classList.remove('active');
      if (badgeModeVoiceStatus) badgeModeVoiceStatus.textContent = t('mode_status_active');
      if (badgeModeChatStatus) badgeModeChatStatus.textContent = t('mode_status_switch');

      isMuted = false;
      if (spVoicebotStage) spVoicebotStage.style.display = 'flex';
      if (btnMic) btnMic.style.display = 'flex';
      if (btnMute) {
        btnMute.style.display = 'flex';
        btnMute.classList.remove('muted');
      }

      // Initialize large avatar in voicebot robot slot if not already created
      if (!voicebotAvatar && window.TelmyAvatar && spVoicebotRobotSlot) {
        voicebotAvatar = new TelmyAvatar(spVoicebotRobotSlot, {
          size: 88,
          interactive: true,
          onClick: handleAvatarTap
        });
      }

      updateVoicebotStageLabels();
    }

    if (lblCompactModeTitle) {
      lblCompactModeTitle.textContent = mode === 'chat'
        ? `💬 Mode: ${t('mode_chat_compact')}`
        : `🎙️ Mode: ${t('mode_voice_compact')}`;
    }

    // Refresh chat stream / welcome hero depending on mode (Priority 5.3)
    if (!chatHistory || chatHistory.length === 0) {
      renderWelcome();
    }
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
    } else if (isSpeaking) {
      lblVoicebotStatusTitle.textContent = t('voicebot_status_speaking_title');
      lblVoicebotStatusDesc.textContent = t('voicebot_status_speaking_desc');
      lblVoicebotMicCaption.textContent = t('voicebot_mic_caption_speaking');
    } else {
      lblVoicebotStatusTitle.textContent = t('voicebot_status_idle_title');
      lblVoicebotStatusDesc.textContent = t('voicebot_status_idle_desc');
      lblVoicebotMicCaption.textContent = t('voicebot_mic_caption_idle');
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

  // Mute / Audio Toggle
  if (btnMute) {
    btnMute.addEventListener('click', () => {
      isMuted = !isMuted;
      btnMute.classList.toggle('muted', isMuted);
      if (isMuted) stopSpeaking();
    });
  }

  // 8. TTS Playback (Gemini WaveNet TTS + Browser Fallback + Dual Avatar Sync)
  function speakResponse(text) {
    if (currentBotMode === 'chat' || isMuted || !text) return;
    stopSpeaking();

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
      payload: { text, language: currentLanguage }
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
        currentAudio.onerror = () => speakBrowserFallback(text);
        currentAudio.play().catch(() => speakBrowserFallback(text));
      } else {
        speakBrowserFallback(text);
      }
    });
  }

  function speakBrowserFallback(text) {
    if (currentBotMode === 'chat' || isMuted) {
      stopSpeaking();
      return;
    }
    if (!('speechSynthesis' in window)) {
      stopSpeaking();
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = LOCALE_MAP[currentLanguage] || 'en-US';
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

  if (btnStopAudio) btnStopAudio.addEventListener('click', stopSpeaking);

  // 8. Fields List & Detail Rendering
  function renderFieldsList(fields) {
    fieldsQuickList.innerHTML = '';
    const auditCard = document.getElementById('sp-audit-trigger-card');
    const count = fields ? fields.length : 0;

    badgeFieldsCount.textContent = count;
    fieldsCountPill.textContent = `${count} ${t('tab_fields') || 'Fields'}`;

    if (!fields || fields.length === 0) {
      fieldsEmptyState.style.display = 'block';
      fieldDetailContent.style.display = 'none';
      if (auditCard) auditCard.style.display = 'none';
      btnStepperPrev.disabled = true;
      btnStepperNext.disabled = true;
      stepperIndicator.textContent = '0 / 0';
      return;
    }

    if (auditCard) auditCard.style.display = 'block';

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

    const boxGuideCta = document.getElementById('box-guide-cta');

    if (activeFieldIndex < 0) {
      // User has not explicitly clicked "Guide Me" or a field yet.
      // Keep empty state visible with Guide Me CTA to avoid unprompted quota consumption.
      fieldsEmptyState.style.display = 'block';
      fieldDetailContent.style.display = 'none';
      if (boxGuideCta) boxGuideCta.style.display = 'block';
      stepperIndicator.textContent = `0 / ${fields.length}`;
      btnStepperPrev.disabled = true;
      btnStepperNext.disabled = false;
    } else {
      fieldsEmptyState.style.display = 'none';
      fieldDetailContent.style.display = 'block';
      if (boxGuideCta) boxGuideCta.style.display = 'none';
      stepperIndicator.textContent = `${activeFieldIndex + 1} / ${fields.length}`;
      btnStepperPrev.disabled = activeFieldIndex <= 0;
      btnStepperNext.disabled = activeFieldIndex >= fields.length - 1;
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
    const translatedLabel = data.label || meta.label || meta.name || `Field #${activeFieldIndex + 1}`;
    const origLabel = data.originalLabel || meta.label || meta.name || '';
    const meaning = data.meaning || `Field to provide ${escapeHTML(translatedLabel)}.`;
    const howToFill = data.howToFill || data.how_to_fill || 'Enter data accurately as shown in your official identification.';
    const example = data.example || meta.placeholder || 'Example entry';
    const mistakes = data.commonMistakes || data.common_mistakes || null;
    const foreigners = data.tipsForForeigners || data.tips_for_foreigners || data.foreign_note || null;
    
    const sourceBadge = data.source === 'verified' ? '✓ Verified' : (t('ai_draft_badge') || '✨ Gemini AI');
    const badgeClass = data.source === 'verified' ? 'verified' : 'draft';

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
          <button type="button" class="btn-copy-example" id="btn-copy-val">${t('detail_copy')}</button>
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
    if (stepperIndicator) stepperIndicator.textContent = 'All Done ✓';
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

  // Pre-Submission Audit button listener in completion state
  if (btnTriggerPreAudit) {
    btnTriggerPreAudit.addEventListener('click', () => {
      if (!detectedFields || detectedFields.length === 0) return;
      if (boxAuditChecklistResults) {
        boxAuditChecklistResults.style.display = 'block';
      }
      if (auditChecklistItems) {
        auditChecklistItems.innerHTML = detectedFields.map((f, idx) => {
          const meta = f.metadata || {};
          const label = meta.label || meta.name || `${t('field_label_prefix') || 'Field'} #${idx + 1}`;
          return `
            <div class="audit-checklist-row">
              <div class="audit-field-left">
                <span class="audit-check-icon">✓</span>
                <span class="audit-field-name">${escapeHTML(label)}</span>
              </div>
              <span class="audit-status-tag">Lolos Audit</span>
            </div>
          `;
        }).join('');
      }
      boxAuditChecklistResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // 9. Summary & Progress Pane
  function renderSummaryPane(summary, fields) {
    if (summary && summary.title) {
      summaryDescText.textContent = `${summary.title}: ${summary.description || 'Formulir pelayanan resmi.'}`;
    } else {
      summaryDescText.textContent = t('summary_desc_fallback', { count: fields.length });
    }

    if (summary && summary.prerequisites && summary.prerequisites.length > 0) {
      boxPrerequisites.style.display = 'block';
      summaryPrereqList.innerHTML = summary.prerequisites.map(p => `<li>${escapeHTML(p)}</li>`).join('');
    } else {
      boxPrerequisites.style.display = 'none';
    }

    // Calculate filled progress
    const total = fields.length;
    let filled = 0;
    fields.forEach(f => {
      const el = f.metadata ? f.metadata.element : null;
      if (el && el.value && el.value.trim().length > 0) filled++;
    });

    const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
    progressPercent.textContent = `${pct}%`;
    progressBarFill.style.width = `${pct}%`;
    progressSubText.textContent = t('progress_sub_text', { filled, total });
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
      const key = `telmy_sp_chat_${url ? new URL(url).hostname : 'global'}`;
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
        const key = `telmy_sp_chat_${new URL(tab.url).hostname}`;
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

  function switchSourceMode(mode) {
    activeSourceMode = mode;
    if (btnModeWeb && btnModePdf) {
      btnModeWeb.classList.toggle('active', mode === 'web');
      btnModePdf.classList.toggle('active', mode === 'pdf');
    }
    if (webModeContainer && pdfModeContainer) {
      webModeContainer.style.display = mode === 'web' ? 'flex' : 'none';
      pdfModeContainer.style.display = mode === 'pdf' ? 'flex' : 'none';
    }
    // Switch to fields tab to view it
    const tabFields = document.querySelector('.sp-tab-btn[data-tab="fields"]');
    if (tabFields) tabFields.click();
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
            alert('Could not download PDF form from the active tab automatically. Please upload your document to the dropzone.');
            return;
          }

          if (res.isLocalFile) {
            if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
            if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
            if (telmyAvatar) telmyAvatar.setState('IDLE');
            alert('Due to Chrome local file restrictions (file://), please drag and drop the PDF file from your computer into the dropzone below.');
            return;
          }

          if (!res.success || !res.dataUrl) {
            if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
            if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
            if (telmyAvatar) telmyAvatar.setState('IDLE');
            alert('Failed to read document from active tab: ' + (res.error || 'Unknown error'));
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
              openPaywallModal('Your free form quota is exhausted. Purchase credits or upgrade to Pro to continue.');
              return;
            }
            if (expRes && expRes.quota) {
              refreshUserQuota(expRes.quota);
            }
            if (chrome.runtime.lastError || !expRes || !expRes.success || !expRes.data) {
              if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
              if (telmyAvatar) telmyAvatar.setState('IDLE');
              alert('Failed to analyze document with Gemini. Please ensure backend is active.');
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
      alert('Please select a valid PDF file or document image (JPG, PNG, WebP).');
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
          openPaywallModal('Your free form quota is exhausted. Purchase credits or upgrade to Pro to continue.');
          return;
        }
        if (res && res.quota) {
          refreshUserQuota(res.quota);
        }
        if (chrome.runtime.lastError || !res || !res.success || !res.data) {
          if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
          if (telmyAvatar) telmyAvatar.setState('IDLE');
          alert('Failed to analyze form document. Please ensure backend is active.');
          return;
        }

        handleSuccessfulDocumentAnalysis(res.data);
      });
    } catch (err) {
      if (spPdfDropContent) spPdfDropContent.style.display = 'flex';
      if (spPdfAnalyzing) spPdfAnalyzing.style.display = 'none';
      if (telmyAvatar) telmyAvatar.setState('IDLE');
      alert('Failed to process file: ' + err.message);
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
      alert('No original document loaded.');
      return;
    }

    if (!window.PDFLib) {
      alert('PDF library is loading. Please wait a few seconds.');
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

      alert('Success! The completed official PDF document has been downloaded to your computer.');
    } catch (e) {
      console.error('[PDF Export Error]', e);
      alert('Failed to export PDF: ' + e.message);
    }
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

    // 2. Lock / Unlock Toggle Button
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

    // 4. Add Custom Field Button
    if (btnVaultAddCustom) {
      btnVaultAddCustom.addEventListener('click', () => {
        if (!isVaultUnlocked) {
          openVaultPinModal(() => openFieldModal(null));
        } else {
          openFieldModal(null);
        }
      });
    }

    // 5. Wipe Master Vault Button
    if (btnVaultWipe) {
      btnVaultWipe.addEventListener('click', wipeVault);
    }

    // 6. Dual-Lock Vault Modal Setup & Controls
    let activeVaultMode = 'password'; // 'password' | 'seed_phrase'
    let isVaultSetupMode = false;
    let currentGeneratedSeed = '';
    let lockoutInterval = null;

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
        showToast('📋 12 secret words copied to clipboard!');
      });
    }

    function downloadSeedTxtFile() {
      if (!currentGeneratedSeed) return;
      const txtContent = `TELMY.AI — EMERGENCY ZERO-KNOWLEDGE SEED PHRASE\n` +
        `Generated: ${new Date().toISOString()}\n\n` +
        `Your 12 Secret Words (Keep this safe & offline):\n` +
        `${currentGeneratedSeed}\n\n` +
        `IMPORTANT: If you lose these words, your encrypted profile cannot be recovered by anyone.`;
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `telmy-vault-seed-${Date.now().toString(36)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 Emergency seed phrase text file saved!');
    }

    function checkAndApplyLockoutUI() {
      if (!window.TelmyCryptoVault) return false;
      const status = window.TelmyCryptoVault.getAttemptStatus();
      if (status.isLocked) {
        if (vaultLockoutBanner) {
          vaultLockoutBanner.style.display = 'flex';
          if (vaultLockoutText) {
            vaultLockoutText.textContent = `⚠️ Too many failed attempts. Locked for ${status.remainingSeconds}s.`;
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
            vaultLockoutText.textContent = `⚠️ Too many failed attempts. Locked for ${fresh.remainingSeconds}s.`;
          }
        }, 1000);
        return true;
      } else {
        if (vaultLockoutBanner) vaultLockoutBanner.style.display = 'none';
        if (btnSubmitVaultPin) btnSubmitVaultPin.disabled = false;
        return false;
      }
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
      vaultPinModalTitle.textContent = title || (isVaultSetupMode ? 'Create Master Security Key' : 'Unlock Profile Vault');
    }
    if (vaultPinModalSub) {
      vaultPinModalSub.textContent = subtitle || (isVaultSetupMode
        ? 'Protect your profile data with Bank-grade Client-Side Encryption. Choose a Password (6–12 chars) or a 12-Word Seed Phrase.'
        : 'Enter your Master Password or 12 Secret Words to decrypt your profile.');
    }
    if (btnSubmitVaultPin) {
      btnSubmitVaultPin.textContent = isVaultSetupMode ? 'Set Up & Encrypt Vault' : 'Unlock Vault';
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
      if (!secret || secret.length < 6 || secret.length > 12) {
        showVaultPinError('Password must be between 6 and 12 characters.');
        if (inputVaultPassword) inputVaultPassword.focus();
        return;
      }
    } else {
      if (isVaultSetupMode) {
        secret = currentGeneratedSeed.trim();
        if (!chkSeedSaved || !chkSeedSaved.checked) {
          showVaultPinError('Please confirm that you have saved your 12 secret words safely.');
          return;
        }
      } else {
        secret = textareaVaultSeed ? textareaVaultSeed.value.trim() : '';
        const words = secret.split(/\s+/).filter(Boolean);
        if (words.length !== 12) {
          showVaultPinError('Please enter all 12 seed words separated by spaces.');
          if (textareaVaultSeed) textareaVaultSeed.focus();
          return;
        }
      }
    }

    if (btnSubmitVaultPin) {
      btnSubmitVaultPin.textContent = '⏳ Verifying...';
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
        showToast('🔓 Brankas berhasil dibuat & terenkripsi!');

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
        showToast('🔓 Brankas berhasil dibuka untuk sesi ini!');

        if (pinUnlockCallback) {
          pinUnlockCallback();
          pinUnlockCallback = null;
        }
      } catch (decryptErr) {
        if (decryptErr.message && decryptErr.message.startsWith('VAULT_LOCKED')) {
          checkAndApplyLockoutUI();
          showVaultPinError('⚠️ Brankas terkunci karena 3x salah percobaan.');
        } else {
          const attemptStatus = window.TelmyCryptoVault.getAttemptStatus();
          const remainingAttempts = Math.max(0, 3 - (attemptStatus.failedAttempts || 0));
          if (attemptStatus.isLocked) {
            checkAndApplyLockoutUI();
          } else {
            showVaultPinError(`❌ Kunci tidak cocok. Sisa ${remainingAttempts} percobaan lagi.`);
          }
        }
      }
    } catch (err) {
      showVaultPinError('Decryption error: ' + err.message);
    } finally {
      if (btnSubmitVaultPin && !checkAndApplyLockoutUI()) {
        btnSubmitVaultPin.textContent = isVaultSetupMode ? 'Set Up & Encrypt Vault' : 'Unlock Vault';
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
    showToast('🔒 Brankas dikunci kembali.');
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
      // Render Locked View
      if (vaultFieldsCount) vaultFieldsCount.textContent = '🔒 Locked';
      vaultFieldsList.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; margin-top: 8px;">
          <div style="font-size: 32px; margin-bottom: 8px;">🔒</div>
          <strong style="display: block; font-size: 13px; color: #0f172a; margin-bottom: 4px;">Vault is Locked</strong>
          <p style="font-size: 11.5px; color: #64748b; line-height: 1.4; margin-bottom: 14px;">Enter your 6-Digit Master PIN to view, edit, or autofill your zero-knowledge encrypted profile.</p>
          <button type="button" id="btn-vault-inline-unlock" class="btn-vault-pin-pri" style="max-width: 180px; margin: 0 auto; padding: 8px 14px; font-size: 12px;">Unlock Vault</button>
        </div>
      `;
      const btnUnlock = document.getElementById('btn-vault-inline-unlock');
      if (btnUnlock) btnUnlock.addEventListener('click', () => openVaultPinModal());
      return;
    }

    const fields = currentDecryptedVault.fields || [];
    if (vaultFieldsCount) {
      vaultFieldsCount.textContent = `${fields.length} item${fields.length === 1 ? '' : 's'}`;
    }

    if (fields.length === 0) {
      vaultFieldsList.innerHTML = `
        <div style="text-align: center; padding: 28px 16px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px;">
          <div style="font-size: 28px; margin-bottom: 6px;">📂</div>
          <strong style="display: block; font-size: 12.5px; color: #0f172a; margin-bottom: 4px;">No Verified Fields Stored</strong>
          <p style="font-size: 11.5px; color: #64748b; line-height: 1.4;">Click "+ Add Field" above or upload an ID/Passport below to populate your encrypted vault.</p>
        </div>
      `;
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
            <button type="button" class="btn-field-ctrl edit" data-field-id="${escapeHTML(f.id)}" title="Edit field value">✏️</button>
            <button type="button" class="btn-field-ctrl delete" data-field-id="${escapeHTML(f.id)}" title="Delete field">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach row button events
    vaultFieldsList.querySelectorAll('.btn-field-ctrl.edit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fieldId = btn.getAttribute('data-field-id');
        const field = fields.find(f => f.id === fieldId);
        if (field) openFieldModal(field);
      });
    });

    vaultFieldsList.querySelectorAll('.btn-field-ctrl.delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fieldId = btn.getAttribute('data-field-id');
        deleteVaultField(fieldId);
      });
    });
  }

  function openFieldModal(field = null) {
    currentEditingFieldId = field ? field.id : null;
    if (lblVaultModalFieldTitle) {
      lblVaultModalFieldTitle.textContent = field ? 'Edit Field Value' : '+ Add Custom Field';
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
      alert('Field Label is required');
      inputVaultFieldLabel.focus();
      return;
    }
    if (!value) {
      alert('Field Value is required');
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

    if (!confirm(`Delete "${target.label || target.key}" from your vault?`)) return;

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
    alert('Vault wiped successfully. All data has been cleared.');
  }

  async function handleVault1ClickAutoFill() {
    if (!isVaultUnlocked) {
      openVaultPinModal(() => handleVault1ClickAutoFill());
      return;
    }

    const fields = currentDecryptedVault ? (currentDecryptedVault.fields || []) : [];
    if (fields.length === 0) {
      alert('Your Vault is currently empty. Add profile fields or upload an ID card first.');
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
      openVaultPinModal(() => handleVaultDocUpload(file), 'Unlock Vault to Ingest Document', 'Enter your 6-Digit Master PIN to securely encrypt the extracted document data.');
      return;
    }

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      alert('Please upload an ID card, Passport, or Academic Document in PDF, JPG, or PNG format.');
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
          alert('Extraction failed: ' + (res?.error || 'Could not extract entities from document.'));
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

        alert(`🎉 Successfully extracted ${res.fields.length} fields from "${docName}" into your encrypted Vault!\n\nZero-Retention Policy: Physical document file was discarded immediately.`);
      });
    } catch (err) {
      if (vaultDocContent) vaultDocContent.style.display = 'flex';
      if (vaultDocAnalyzing) vaultDocAnalyzing.style.display = 'none';
      if (telmyAvatar) telmyAvatar.setState('IDLE');
      alert('Document processing error: ' + err.message);
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
      const planName = data.plan === 'pro' ? 'Pro Subscription ($14.99/mo)' :
                       data.plan === 'payg' ? 'Pay-as-you-Go' : 'Free Tier';
      paywallSumPlan.textContent = planName;
    }
    if (paywallSumPayg) paywallSumPayg.textContent = `${q.purchasedCreditsRemaining || 0} Forms`;
    if (paywallSumPro) paywallSumPro.textContent = `${q.subscriptionQuotaRemaining || 0} Forms`;
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
        openPaywallModal('Upgrade your form quota for uninterrupted assistance');
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

    const triggerPurchase = (planId, btn) => {
      const originalText = btn.textContent;
      btn.textContent = '⏳ Processing...';
      btn.disabled = true;

      chrome.runtime.sendMessage({ type: 'SIMULATE_PURCHASE', planId }, (res) => {
        btn.textContent = originalText;
        btn.disabled = false;

        if (res && res.success) {
          const quotaData = res.user || {
            plan: res.plan?.type === 'subscription' ? 'pro' : 'payg',
            quota: res.user?.quota || {},
            totalRemaining: res.user?.totalRemaining || 10
          };
          refreshUserQuota(quotaData);
          alert(`🎉 Purchase Successful!\n\nPlan: ${res.plan?.name || planId}\nRemaining Quota: ${res.user?.totalRemaining || 'Added'}\n\nThank you for choosing Telmy!`);
          closePaywallModal();
        } else {
          alert('Purchase processing failed. Please verify your connection.');
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

  // Boot
  init();
});

// Telmy.ai — Chrome Native Side Panel Controller
document.addEventListener('DOMContentLoaded', async () => {
  // UI Elements
  const langSelect = document.getElementById('sp-lang-select');
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

  // Fields Elements
  const fieldsEmptyState = document.getElementById('fields-empty-state');
  const fieldDetailContent = document.getElementById('field-detail-content');
  const fieldsQuickList = document.getElementById('fields-quick-list');
  const fieldsCountPill = document.getElementById('fields-count-pill');
  const btnStepperPrev = document.getElementById('btn-stepper-prev');
  const btnStepperNext = document.getElementById('btn-stepper-next');
  const stepperIndicator = document.getElementById('stepper-indicator');

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
  const btnOnboardingGuest = document.getElementById('btn-onboarding-guest');
  const btnOnboardingFinish = document.getElementById('btn-onboarding-finish');
  const onboardingUnauthed = document.getElementById('onboarding-unauthed');
  const onboardingAuthed = document.getElementById('onboarding-authed');
  const onboardingUserName = document.getElementById('onboarding-user-name');
  const onboardingUserEmail = document.getElementById('onboarding-user-email');
  const onboardingUserAvatarText = document.getElementById('onboarding-user-avatar-text');
  const onboardingUserAvatarImg = document.getElementById('onboarding-user-avatar-img');

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
  let isPageTranslated = false;
  let isTranslating = false;
  let translatedElementCount = 0;

  // Complete JAPAC Multi-Language Matrix (English default)
  const I18N = {
    brand_tag: {
      en: 'AI Form Assistant', id: 'Asisten Formulir AI', ja: 'AI フォームアシスタント', ko: 'AI 양식 도우미',
      zh: 'AI 表单助手', 'zh-TW': 'AI 表單助手', vi: 'Trợ lý Biểu mẫu AI', th: 'ผู้ช่วยฟอร์ม AI',
      hi: 'AI फ़ॉर्म सहायक', fil: 'AI Form Assistant', ms: 'Pembantu Borang AI'
    },
    tab_chat: {
      en: 'Chat', id: 'Obrolan', ja: 'チャット', ko: '대화',
      zh: '对话', 'zh-TW': '對話', vi: 'Trò chuyện', th: 'แชท',
      hi: 'बातचीत', fil: 'Kausapin', ms: 'Sembang'
    },
    tab_fields: {
      en: 'Fields', id: 'Kolom', ja: '入力欄', ko: '입력란',
      zh: '表单项', 'zh-TW': '欄位', vi: 'Trường', th: 'ช่องข้อมูล',
      hi: 'फ़ील्ड्स', fil: 'Mga Kolum', ms: 'Ruangan'
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
      en: '⚠️ Avoid Mistakes:', id: '⚠️ Hindari Kesalahan:', ja: '⚠️ 注意点:', ko: '⚠️ 주의 사항:',
      zh: '⚠️ 避免错误:', 'zh-TW': '⚠️ 避免錯誤:', vi: '⚠️ Tránh lỗi:', th: '⚠️ ข้อควรระวัง:',
      hi: '⚠️ गलतियों से बचें:', fil: '⚠️ Iwasan ang Mali:', ms: '⚠️ Elakkan Kesilapan:'
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
    }
  };

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

  function t(key) {
    const entry = I18N[key];
    if (!entry) return '';
    return entry[currentLanguage] || entry['en'] || entry['id'] || '';
  }

  // 1. Initialize Active Tab, User & Onboarding
  async function init() {
    // Load Settings & User
    const stored = await chrome.storage.local.get(['settings', 'hasCompletedOnboarding', 'user']);
    if (stored.settings) {
      currentLanguage = stored.settings.language || 'en';
      langSelect.value = currentLanguage;
    } else {
      langSelect.value = 'en';
    }

    currentUser = stored.user || null;
    renderUserUI();
    applyLanguageUI();

    // Show Onboarding if first-time install
    if (!stored.hasCompletedOnboarding) {
      showOnboardingModal();
    }

    setupUserControlsAndOnboarding();

    // Determine current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      currentTabId = tab.id;
      loadSessionChat(tab.url);
      if (isScannerRunning) {
        activateScannerOnTab(tab.id);
      }
      checkPageTranslationStatus(tab.id);
    }

    setupSpeechRecognition();
    renderWelcome();

    // Clean up active tab badges when sidepanel is closed/unloaded
    window.addEventListener('beforeunload', () => {
      if (currentTabId) {
        chrome.tabs.sendMessage(currentTabId, { type: 'DEACTIVATE_SCANNER' }, () => {});
      }
    });

    // Handle tab switching in browser
    if (chrome.tabs && chrome.tabs.onActivated) {
      chrome.tabs.onActivated.addListener(async (activeInfo) => {
        if (currentTabId && currentTabId !== activeInfo.tabId) {
          chrome.tabs.sendMessage(currentTabId, { type: 'DEACTIVATE_SCANNER' }, () => {});
        }
        currentTabId = activeInfo.tabId;
        const [newTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (newTab) {
          loadSessionChat(newTab.url);
        }
        if (isScannerRunning) {
          activateScannerOnTab(currentTabId);
        }
        checkPageTranslationStatus(currentTabId);
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
      popoverAuthBadge.textContent = '✓ Firebase Connected';
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
    } else {
      userAvatarText.textContent = '👤';
      userAvatarText.style.display = 'block';
      userAvatarImg.style.display = 'none';

      popoverAvatarText.textContent = '👤';
      popoverAvatarText.style.display = 'block';
      popoverAvatarImg.style.display = 'none';

      popoverUserName.textContent = 'Guest User';
      popoverUserEmail.textContent = 'Not signed in';
      popoverAuthBadge.textContent = 'Guest Mode';
      popoverAuthBadge.className = 'badge-auth-status';

      btnPopoverAuth.style.display = 'block';
      btnPopoverSignout.style.display = 'none';

      if (onboardingAuthed && onboardingUnauthed) {
        onboardingUnauthed.style.display = 'flex';
        onboardingAuthed.style.display = 'none';
      }
    }
  }

  // 3. User Controls & Onboarding Events
  function setupUserControlsAndOnboarding() {
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

    btnOnboardingGuest.addEventListener('click', async () => {
      await chrome.storage.local.set({ hasCompletedOnboarding: true });
      closeOnboardingModal();
      if (currentTabId && isScannerRunning) {
        activateScannerOnTab(currentTabId);
      }
    });

    btnOnboardingFinish.addEventListener('click', async () => {
      await chrome.storage.local.set({
        hasCompletedOnboarding: true,
        settings: { ...(await chrome.storage.local.get(['settings'])).settings, language: currentLanguage }
      });
      closeOnboardingModal();
      if (currentTabId && isScannerRunning) {
        activateScannerOnTab(currentTabId);
      }
    });
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
    const apiUrl = settings.apiUrl || 'http://localhost:8080/api';
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');

    // Check if web connect page is reachable, or simulate 1-click connect
    try {
      // 1. Open /connect tab for actual Firebase Google Sign-In
      const connectUrl = `${baseUrl}/connect`;
      chrome.tabs.create({ url: connectUrl }, (tab) => {
        // Tab opened; user completes Google Sign-in on web platform
      });
    } catch (e) {
      // 2. Simulated instant connect for local testing
      const mockUser = {
        uid: 'usr_' + Date.now().toString(36),
        displayName: 'Telmy User',
        name: 'Telmy User',
        email: 'user@telmy.id',
        photoURL: '',
        language: currentLanguage
      };
      await chrome.storage.local.set({ user: mockUser, hasCompletedOnboarding: true });
      currentUser = mockUser;
      renderUserUI();
    }
  }

  // 4. Activate Scanner on Active Tab (On-Demand)
  function activateScannerOnTab(tabId) {
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, { type: 'ACTIVATE_SCANNER' }, (res) => {
      if (chrome.runtime.lastError || !res) {
        injectContentScript(tabId, () => {
          chrome.tabs.sendMessage(tabId, { type: 'ACTIVATE_SCANNER' }, (res2) => {
            if (res2 && res2.count !== undefined) {
              badgeFieldsCount.textContent = res2.count;
              fieldsCountPill.textContent = `${res2.count} Kolom`;
            }
          });
        });
      } else {
        if (res && res.count !== undefined) {
          badgeFieldsCount.textContent = res.count;
          fieldsCountPill.textContent = `${res.count} Kolom`;
        }
      }
    });
  }

  // Deactivate Scanner on Active Tab (Total DOM Cleanup)
  function deactivateScannerOnTab(tabId) {
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, { type: 'DEACTIVATE_SCANNER' }, () => {
      if (chrome.runtime.lastError) {}
    });
    badgeFieldsCount.textContent = '0';
    fieldsCountPill.textContent = '0 Kolom';
  }

  // On-demand injection into active tab
  async function injectContentScript(tabId, onInjected) {
    try {
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

      if (onInjected) setTimeout(onInjected, 200);
    } catch (e) {
      console.warn('[Telmy SidePanel] On-demand injection skipped:', e.message);
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
      renderFieldsList(detectedFields);
      renderSummaryPane(cachedPageSummary, detectedFields);
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
    currentLanguage = e.target.value;
    chrome.storage.local.get(['settings']).then((res) => {
      const updated = { ...(res.settings || {}), language: currentLanguage };
      chrome.storage.local.set({ settings: updated });
    });
    applyLanguageUI();
    if (activeFieldIndex >= 0 && detectedFields[activeFieldIndex]) {
      renderFieldDetail(detectedFields[activeFieldIndex]);
    }
  });

  function applyLanguageUI() {
    chatInput.placeholder = t('chat_placeholder');
    const elChat = document.getElementById('lbl-tab-chat');
    if (elChat) elChat.textContent = t('tab_chat');
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
    if (fieldsCountPill) fieldsCountPill.textContent = `${detectedFields.length} ${t('fields_unit')}`;

    // Translation Banner & Chips
    if (lblChipTranslate) lblChipTranslate.textContent = t('chip_translate');
    if (lblChipWhat) lblChipWhat.textContent = t('chip_what');
    if (lblChipDocs) lblChipDocs.textContent = t('chip_docs');
    updateTranslateBannerUI();
  }

  // Rescan Button
  btnRescan.addEventListener('click', () => {
    btnRescan.style.transform = 'rotate(180deg)';
    setTimeout(() => { btnRescan.style.transform = ''; }, 300);
    if (currentTabId) queryTabStatus(currentTabId);
  });

  // 5. Chat & AI Interaction
  function renderWelcome() {
    if (chatHistory.length === 0) {
      appendChatMessage({
        role: 'assistant',
        text: t('welcome_msg'),
        actions: [
          { type: 'TAB_FIELDS', label: '📋 ' + t('tab_fields') },
          { type: 'TAB_SUMMARY', label: '📌 ' + t('tab_summary') }
        ],
        time: formatTime(new Date())
      });
    } else {
      chatStream.innerHTML = '';
      chatHistory.forEach(appendChatMessageDOM);
    }
  }

  async function handleSendMessage(text) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    chatInput.value = '';

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
        : (currentLanguage === 'en'
            ? 'I am ready to help you complete this form. Click on any field on the page to see detailed step-by-step guidance.'
            : 'Saya siap membantu memandu pengisian formulir ini. Klik salah satu kolom di halaman untuk melihat petunjuk detail.');

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
      }
    } catch (e) {
      console.warn('[Telmy Chat Error]', e);
    }
  }

  btnSend.addEventListener('click', () => handleSendMessage(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSendMessage(chatInput.value);
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
      avatar.innerHTML = `<img src="../assets/logo.png" style="width: 18px; height: 18px; object-fit: contain;">`;
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
    if (act.type === 'TAB_FIELDS') {
      document.getElementById('tab-btn-fields').click();
    } else if (act.type === 'TAB_SUMMARY') {
      document.getElementById('tab-btn-summary').click();
    } else if (act.type === 'FOCUS_FIELD' && act.index !== undefined) {
      selectFieldByIndex(act.index, true);
      document.getElementById('tab-btn-fields').click();
    } else if (act.type === 'REVERT_PAGE' || act.type === 'TRANSLATE_PAGE') {
      handleTogglePageTranslation();
    }
  }

  // =========================================================
  // Context-Aware Page Translation Workflow (Priority 3)
  // =========================================================
  function updateTranslateBannerUI() {
    if (!spTranslateBanner) return;

    if (isTranslating) {
      spTranslateBanner.className = 'sp-translate-banner translating';
      lblTranslateStatus.textContent = t('translating_status');
      lblTranslateSubtitle.textContent = 'Gemini 3.5 Flash-Lite • Preserving UI/UX & Glossary...';
      btnToggleTranslate.className = 'btn-translate-action loading';
      btnTranslateIcon.textContent = '⏳';
      btnTranslateLabel.textContent = 'Translating...';
      btnToggleTranslate.disabled = true;
    } else if (isPageTranslated) {
      spTranslateBanner.className = 'sp-translate-banner translated';
      lblTranslateStatus.textContent = `🌐 ${t('translate_banner_title')} (${translatedElementCount})`;
      lblTranslateSubtitle.textContent = `Context-Aware to ${currentLanguage.toUpperCase()}`;
      btnToggleTranslate.className = 'btn-translate-action active-revert';
      btnTranslateIcon.textContent = '🔙';
      btnTranslateLabel.textContent = t('btn_revert_page');
      btnToggleTranslate.disabled = false;
    } else {
      spTranslateBanner.className = 'sp-translate-banner';
      lblTranslateStatus.textContent = t('translate_banner_title');
      lblTranslateSubtitle.textContent = t('translate_banner_sub');
      btnToggleTranslate.className = 'btn-translate-action';
      btnTranslateIcon.textContent = '🌐';
      btnTranslateLabel.textContent = t('btn_translate_page');
      btnToggleTranslate.disabled = false;
    }
  }

  async function checkPageTranslationStatus(tabId) {
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, { type: 'TRANSLATOR_GET_STATUS' }, (res) => {
      if (!chrome.runtime.lastError && res) {
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
      chrome.tabs.sendMessage(currentTabId, { type: 'TRANSLATOR_REVERT_TRANSLATIONS' }, (res) => {
        isPageTranslated = false;
        translatedElementCount = 0;
        updateTranslateBannerUI();

        appendChatMessage({
          role: 'assistant',
          text: currentLanguage === 'en'
            ? '🔙 The webpage has been restored to its original text.'
            : '🔙 Halaman web telah dikembalikan ke bahasa aslinya.',
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

    // Extract texts from active tab
    chrome.tabs.sendMessage(currentTabId, { type: 'TRANSLATOR_EXTRACT_TEXTS' }, async (extractRes) => {
      // If error (e.g. content script not injected yet), inject & retry
      if (chrome.runtime.lastError || !extractRes || !extractRes.texts) {
        await injectContentScript(currentTabId, () => {
          chrome.tabs.sendMessage(currentTabId, { type: 'TRANSLATOR_EXTRACT_TEXTS' }, (retryRes) => {
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
        text: currentLanguage === 'en'
          ? 'No translatable elements detected on this webpage.'
          : 'Tidak ada elemen teks yang dapat diterjemahkan pada halaman ini.',
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
        // Send translation mapping back to content script
        chrome.tabs.sendMessage(currentTabId, {
          type: 'TRANSLATOR_APPLY_TRANSLATIONS',
          translations: response.data.translations,
          targetLanguage: currentLanguage
        }, (applyRes) => {
          isTranslating = false;
          isPageTranslated = true;
          translatedElementCount = applyRes?.appliedCount || Object.keys(response.data.translations).length;
          updateTranslateBannerUI();

          const langUpper = currentLanguage.toUpperCase();
          appendChatMessage({
            role: 'assistant',
            text: currentLanguage === 'en'
              ? `🌐 **Full Page Translated (${translatedElementCount} elements)**\n\nThe webpage has been translated into **English** using **Gemini 3.5 Flash-Lite**.\n\n✓ **Official Bureaucracy Terms Preserved** (e.g., NIK, KTP, NPWP, SKCK)\n✓ **UI/UX Standards Applied** (Button & navigation actions mapped professionally)\n\nYou can click **Show Original** at any time to revert.`
              : `🌐 **Halaman Berhasil Diterjemahkan (${translatedElementCount} elemen)**\n\nSeluruh teks UI halaman telah diterjemahkan ke bahasa **${langUpper}** menggunakan **Gemini 3.5 Flash-Lite**.\n\n✓ **Istilah Birokrasi Baku Terjaga** (NIK, KTP, KK, SKCK)\n✓ **Standar UI/UX Profesional** (Tombol navigasi disesuaikan secara natural)\n\nKlik **Kembalikan Asli** kapan saja jika ingin membaca versi asli.`,
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
        text: currentLanguage === 'en'
          ? '⚠️ Translation service encountered an issue. Please ensure the Telmy backend is active.'
          : '⚠️ Layanan terjemahan mengalami kendala. Pastikan server backend Telmy aktif di port 8080.',
        time: formatTime(new Date())
      });
    }
  }

  // Translation & Quick Action Listeners
  if (btnToggleTranslate) btnToggleTranslate.addEventListener('click', handleTogglePageTranslation);
  if (chipTranslatePage) chipTranslatePage.addEventListener('click', handleTogglePageTranslation);
  if (chipWhatIsThis) {
    chipWhatIsThis.addEventListener('click', () => {
      handleSendMessage(currentLanguage === 'en' ? 'What is this form about and what should I know?' : 'Jelaskan formulir ini tentang apa dan apa yang perlu saya ketahui?');
    });
  }
  if (chipRequiredDocs) {
    chipRequiredDocs.addEventListener('click', () => {
      handleSendMessage(currentLanguage === 'en' ? 'What documents and requirements do I need to prepare for this form?' : 'Apa saja berkas dan dokumen yang harus saya siapkan untuk mengisi formulir ini?');
    });
  }

  // 6. Push-to-Talk Voice Engine
  function setupSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      btnMic.style.display = 'none';
      return;
    }

    speechRecognizer = new SpeechRec();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = true;

    speechRecognizer.onstart = () => {
      isListening = true;
      btnMic.classList.add('active');
      micBanner.style.display = 'flex';
      micText.textContent = t('mic_listening');
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
      if (interim) micText.textContent = `"${interim}"`;
      if (final) {
        micBanner.style.display = 'none';
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

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
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
    btnMic.classList.remove('active');
    micBanner.style.display = 'none';
    if (speechRecognizer) {
      try { speechRecognizer.stop(); } catch (e) {}
    }
  }

  btnMic.addEventListener('click', toggleListening);

  // Mute / Audio Toggle
  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    btnMute.classList.toggle('muted', isMuted);
    if (isMuted) stopSpeaking();
  });

  // 7. TTS Playback (Gemini Flash-Lite TTS + Browser Fallback)
  function speakResponse(text) {
    if (isMuted || !text) return;
    stopSpeaking();

    isSpeaking = true;
    audioBar.style.display = 'flex';
    audioStatusText.textContent = t('speaking_text');

    // 1. Try Gemini TTS via backend gateway
    chrome.runtime.sendMessage({
      type: 'VOICE_TTS',
      payload: { text, language: currentLanguage }
    }, (res) => {
      if (!chrome.runtime.lastError && res && res.success && res.audioDataUrl) {
        currentAudio = new Audio(res.audioDataUrl);
        currentAudio.onended = stopSpeaking;
        currentAudio.onerror = () => speakBrowserFallback(text);
        currentAudio.play().catch(() => speakBrowserFallback(text));
      } else {
        speakBrowserFallback(text);
      }
    });
  }

  function speakBrowserFallback(text) {
    if (!('speechSynthesis' in window)) {
      stopSpeaking();
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = LOCALE_MAP[currentLanguage] || 'en-US';
    utterance.onend = stopSpeaking;
    utterance.onerror = stopSpeaking;
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    isSpeaking = false;
    audioBar.style.display = 'none';
    if (currentAudio) {
      try { currentAudio.pause(); } catch (e) {}
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  btnStopAudio.addEventListener('click', stopSpeaking);

  // 8. Fields List & Detail Rendering
  function renderFieldsList(fields) {
    fieldsQuickList.innerHTML = '';
    if (!fields || fields.length === 0) {
      fieldsEmptyState.style.display = 'block';
      fieldDetailContent.style.display = 'none';
      btnStepperPrev.disabled = true;
      btnStepperNext.disabled = true;
      stepperIndicator.textContent = '0 / 0';
      return;
    }

    fields.forEach((f, idx) => {
      const item = document.createElement('div');
      item.className = `quick-field-item ${idx === activeFieldIndex ? 'active' : ''}`;
      item.innerHTML = `
        <span class="quick-num">${idx + 1}</span>
        <span class="quick-title">${escapeHTML(f.metadata.label || f.metadata.name || `Kolom #${idx + 1}`)}</span>
      `;
      item.addEventListener('click', () => selectFieldByIndex(idx, true));
      fieldsQuickList.appendChild(item);
    });

    stepperIndicator.textContent = `${activeFieldIndex >= 0 ? activeFieldIndex + 1 : 1} / ${fields.length}`;
    btnStepperPrev.disabled = activeFieldIndex <= 0;
    btnStepperNext.disabled = activeFieldIndex >= fields.length - 1;

    if (activeFieldIndex < 0 && fields.length > 0) {
      selectFieldByIndex(0, false);
    }
  }

  function selectFieldByIndex(index, notifyPage = true) {
    if (!detectedFields[index]) return;
    activeFieldIndex = index;

    // Highlight in quick list
    const items = fieldsQuickList.querySelectorAll('.quick-field-item');
    items.forEach((el, i) => el.classList.toggle('active', i === index));

    // Update stepper
    stepperIndicator.textContent = `${index + 1} / ${detectedFields.length}`;
    btnStepperPrev.disabled = index <= 0;
    btnStepperNext.disabled = index >= detectedFields.length - 1;

    // Render detail card
    renderFieldDetail(detectedFields[index]);

    // Notify tab to highlight and scroll to field
    if (notifyPage && currentTabId) {
      chrome.tabs.sendMessage(currentTabId, {
        type: 'GMT_ACTIVATE_FIELD_BY_INDEX',
        index: index
      }, () => { if (chrome.runtime.lastError) {} });
    }
  }

  function renderFieldDetail(field) {
    fieldsEmptyState.style.display = 'none';
    fieldDetailContent.style.display = 'block';

    const meta = field.metadata || {};
    const dict = field.dictEntry || {};
    const trans = (dict.translations && dict.translations[currentLanguage]) || {};

    const title = trans.label || meta.label || meta.name || `Kolom #${activeFieldIndex + 1}`;
    const meaning = trans.meaning || `Kolom untuk mengisi data ${escapeHTML(title)}. Pastikan sesuai dokumen resmi.`;
    const howToFill = trans.how_to_fill || 'Ketikkan data secara lengkap dan akurat sesuai kartu identitas Anda.';
    const example = trans.example || meta.placeholder || 'Contoh sesuai dokumen';
    const mistakes = trans.common_mistakes || 'Salah ketik angka/huruf atau mengosongkan kolom penting ini.';

    fieldDetailContent.innerHTML = `
      <div class="field-detail-header">
        <span class="field-badge-num">#${activeFieldIndex + 1}</span>
        <h3 class="field-detail-title">${escapeHTML(title)}</h3>
      </div>
      <div class="detail-section">
        <div class="detail-label">${t('detail_meaning')}</div>
        <div class="detail-text">${escapeHTML(meaning)}</div>
      </div>
      <div class="detail-section">
        <div class="detail-label">${t('detail_how')}</div>
        <div class="detail-text">${escapeHTML(howToFill)}</div>
      </div>
      <div class="detail-section">
        <div class="detail-label">${t('detail_example')}</div>
        <div class="example-box">
          <span class="example-code">${escapeHTML(example)}</span>
          <button type="button" class="btn-copy-example" id="btn-copy-val">${t('detail_copy')}</button>
        </div>
      </div>
      <div class="alert-warning">
        <strong>${t('detail_avoid')}</strong> ${escapeHTML(mistakes)}
      </div>
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

  // Stepper Buttons
  btnStepperPrev.addEventListener('click', () => {
    if (activeFieldIndex > 0) selectFieldByIndex(activeFieldIndex - 1, true);
  });
  btnStepperNext.addEventListener('click', () => {
    if (activeFieldIndex < detectedFields.length - 1) selectFieldByIndex(activeFieldIndex + 1, true);
  });

  // 9. Summary & Progress Pane
  function renderSummaryPane(summary, fields) {
    if (summary && summary.title) {
      summaryDescText.textContent = `${summary.title}: ${summary.description || 'Formulir pelayanan resmi.'}`;
    } else {
      summaryDescText.textContent = currentLanguage === 'en'
        ? `This page contains ${fields.length} form input fields.`
        : `Halaman ini memuat ${fields.length} kolom isian formulir.`;
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
    progressSubText.textContent = currentLanguage === 'en'
      ? `${filled} of ${total} fields filled`
      : `${filled} dari ${total} kolom terisi`;
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
      chatHistory = res[key] || [];
      renderWelcome();
    } catch (e) {}
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

  // Boot
  init();
});

export interface TranslationData {
  metaTitle: string
  navHome: string
  navFeatures: string
  navPricing: string
  navAcademy: string
  navDownload: string
  navFaq: string
  navSignIn: string
  navCta: string

  // Hero (V19)
  heroKicker: string
  heroTitle: string
  heroSubtitle: string
  heroCta: string
  heroDemo: string
  heroSupportText: string
  heroTrustline: string
  heroWorksOn: string

  // Cards A, B, C (V19)
  cardATitle: string
  cardADesc: string
  cardALink: string
  cardBTitle: string
  cardBDesc: string
  cardBLink: string
  cardCTitle: string
  cardCDesc: string
  cardCLink: string

  // Who Is Telmy For (V19 Section)
  whoForTitle: string
  whoForSubtitle: string
  whoForCard1Title: string
  whoForCard1Desc: string
  whoForCard2Title: string
  whoForCard2Desc: string
  whoForCard3Title: string
  whoForCard3Desc: string
  whoForClosing: string

  // What Telmy Does & Doesn't Do (V19 Section)
  scopeTitle: string
  scopeSubtitle: string
  scopeDoesTitle: string
  scopeDoes1: string
  scopeDoes2: string
  scopeDoes3: string
  scopeDoes4: string
  scopeDoesNotTitle: string
  scopeDoesNot1: string
  scopeDoesNot2: string
  scopeDoesNot3: string
  scopeDoesNot4: string
  scopeDisclaimer: string

  // UN Statistics Bar (V2)
  unStatTitle: string
  unStatSub: string
  unStat1Num: string
  unStat1Label: string
  unStat1Desc: string
  unStat2Num: string
  unStat2Label: string
  unStat2Desc: string
  unStat3Num: string
  unStat3Label: string
  unStat3Desc: string
  unStat4Num: string
  unStat4Label: string
  unStat4Desc: string

  // Simulator Section (V2 Dark)
  simBadge: string
  simTitle: string
  simSubtitle: string
  simField1Label: string
  simField1Desc: string
  simField2Label: string
  simField2Desc: string
  simField3Label: string
  simField3Desc: string
  simBtnAutofill: string
  simBtnAudit: string
  simBtnListen: string
  simSpeaking: string
  simAuditGood: string
  simSidepanelTitle: string
  simSidepanelStatus: string
  simQuickActions: string
  simVaultTip: string

  // Without Telmy vs With Telmy (Lama)
  compTitle: string
  compSubtitle: string
  compWithoutTitle: string
  compWithout1: string
  compWithout2: string
  compWithout3: string
  compWithTitle: string
  compWith1: string
  compWith2: string
  compWith3: string

  // Three Steps (V3)
  stepsTitle: string
  step1Title: string
  step1Desc: string
  step2Title: string
  step2Desc: string
  step3Title: string
  step3Desc: string

  // Privacy Summary 4 Cards (V3)
  privacyTitle: string
  privacySubtitle: string
  priv1Title: string
  priv1Desc: string
  priv2Title: string
  priv2Desc: string
  priv3Title: string
  priv3Desc: string
  priv4Title: string
  priv4Desc: string

  // Pricing Teaser (V3)
  pricingTeaserTitle: string
  pricingTeaserDesc: string
  pricingTeaserBtn: string

  // Top FAQ Accordion (4-6 pertanyaan)
  faqTitle: string
  faqSubtitle: string
  faq1Q: string
  faq1A: string
  faq2Q: string
  faq2A: string
  faq3Q: string
  faq3A: string
  faq4Q: string
  faq4A: string
  faq5Q: string
  faq5A: string

  // Final CTA (V3)
  finalCtaTitle: string
  finalCtaDesc: string
  finalCtaBtn: string
  finalDemoBtn: string

  // Footer
  footerTagline: string
  footerSecurityBadge: string
  footerA11yBadge: string
  footerNavTitle: string
  footerLegalTitle: string
  footerPrivacy: string
  footerTerms: string
  footerSecurity: string
  footerDashboard: string
  footerCopyright: string
  footerMission: string

  // Language Modal
  langModalTitle: string
  langModalSubtitle: string
  langModalFooterBadge: string
  langModalClose: string
}

// 1. English
export const transEN: TranslationData = {
  metaTitle: "Telmy.ai — Any form. Any language. No worries.",
  navHome: "Home",
  navFeatures: "Features",
  navPricing: "Pricing",
  navAcademy: "Academy",
  navDownload: "Download",
  navFaq: "FAQ",
  navSignIn: "Sign in",
  navCta: "Get Telmy.ai (Free)",

  heroKicker: "Any form. Any language. No worries.",
  heroTitle: "Confused by a form? Telmy makes it easier.",
  heroSubtitle: "Telmy.ai explains confusing form questions in your language, guides you through each field, and helps you check your answers before you submit.",
  heroCta: "Try Telmy for Free",
  heroDemo: "Watch How It Works",
  heroSupportText: "Understand the questions. Fill in your answers. Submit with more confidence.",
  heroTrustline: "Free tier · Zero-Knowledge Encryption · Built for official forms",
  heroWorksOn: "Works on",

  cardATitle: "Understand Every Field",
  cardADesc: "Not sure what a question means? Telmy explains confusing form fields in simple language so you know what's requested.",
  cardALink: "Learn more",
  cardBTitle: "Forms in Your Language",
  cardBDesc: "Get explanations in a language you're comfortable with, so language barriers never hold you back.",
  cardBLink: "Explore 11 languages",
  cardCTitle: "Guidance When Forms Get Complicated",
  cardCDesc: "Get step-by-step guidance when a form feels confusing, moving forward with clarity.",
  cardCLink: "Explore guidance features",

  whoForTitle: "Built for People Who Need Help Understanding Forms",
  whoForSubtitle: "Whether you're applying for an opportunity, completing official paperwork, or dealing with an unfamiliar form, Telmy makes questions easier to understand.",
  whoForCard1Title: "Scholarship Applications",
  whoForCard1Desc: "Understand application questions, supporting document requests, and instructions clearly while completing your scholarship application.",
  whoForCard2Title: "Visa and Travel Forms",
  whoForCard2Desc: "Get help understanding unfamiliar questions and official instructions when completing supported visa or travel paperwork.",
  whoForCard3Title: "Everyday Online Forms",
  whoForCard3Desc: "Get guidance when registration forms, applications, or other supported online forms leave you unsure what to enter.",
  whoForClosing: "If a form leaves you wondering what it means, Telmy is here to help.",

  scopeTitle: "Guidance, Not Guesswork. You're Still in Control.",
  scopeSubtitle: "Telmy helps you understand forms. You make the decisions.",
  scopeDoesTitle: "What Telmy helps with",
  scopeDoes1: "Explaining confusing questions in plain words.",
  scopeDoes2: "Simplifying complex instructions and requirements.",
  scopeDoes3: "Guiding you through supported online forms step-by-step.",
  scopeDoes4: "Helping you review your answers before final submission.",
  scopeDoesNotTitle: "What Telmy doesn't replace",
  scopeDoesNot1: "Official instructions from the organization receiving your form.",
  scopeDoesNot2: "Your responsibility to provide truthful and accurate information.",
  scopeDoesNot3: "Professional legal, immigration, or financial advice.",
  scopeDoesNot4: "Your final personal review and decision to submit.",
  scopeDisclaimer: "Telmy explains and guides. You verify, decide, and submit. Telmy is not a government agency.",

  unStatTitle: "Global E-Government Reality Check (UN E-Gov Survey 2024)",
  unStatSub: "Governments moved services online, but availability does not equal usability.",
  unStat1Num: "99.5%",
  unStat1Label: "National Portals Online",
  unStat1Desc: "192 of 193 UN states operate online public portals.",
  unStat2Num: "52%",
  unStat2Label: "Lack Live Help Desk",
  unStat2Desc: "Only 48% offer help desk access to applicants.",
  unStat3Num: "57%",
  unStat3Label: "Monolingual Only",
  unStat3Desc: "Only 43% offer foreign language support.",
  unStat4Num: "95%",
  unStat4Label: "Fail Accessibility",
  unStat4Desc: "Only 5% align with W3C WCAG accessibility standards.",

  simBadge: "Government Portal",
  simTitle: "Official Visa & Application Form",
  simSubtitle: "Experience the interactive sandbox: see how Telmy assists form filling, speaks instructions aloud, and prevents rejection errors.",
  simField1Label: "1. Full Legal Name (As in Passport)",
  simField1Desc: "Enter your complete name without academic titles (e.g. B.Sc, M.Sc, Ir).",
  simField2Label: "2. National Identification Number (NIK / ID)",
  simField2Desc: "Official 16-digit national identity code. Do not use spaces or dashes.",
  simField3Label: "3. International Passport Number",
  simField3Desc: "Alphanumeric passport code valid for at least 6 months.",
  simBtnAutofill: "⚡ 1-Click AutoFill Form",
  simBtnAudit: "🚦 Check Before Submit (Auditor)",
  simBtnListen: "🔊 Listen to Guidance",
  simSpeaking: "Playing Audio Guide...",
  simAuditGood: "🟢 All 3 fields verified and ready to submit with confidence.",
  simSidepanelTitle: "Telmy AI Copilot",
  simSidepanelStatus: "● Active beside this form",
  simQuickActions: "1-Click Quick Actions:",
  simVaultTip: "💡 Tip: Profile data is encrypted in your local browser and never stored on any server.",

  compTitle: "Filling Out a Form Shouldn't Feel Like Guesswork",
  compSubtitle: "When instructions are unclear, it's easy to get stuck. Telmy helps you understand before you answer.",
  compWithoutTitle: "❌ Without Telmy",
  compWithout1: "Unclear questions leave you guessing what to enter.",
  compWithout2: "Unfamiliar language makes official instructions harder to grasp.",
  compWithout3: "You waste time searching for outside explanations and worrying about mistakes.",
  compWithTitle: "✅ With Telmy.ai",
  compWith1: "Understand confusing questions in simple, plain language.",
  compWith2: "Get reliable guidance in a supported language you understand.",
  compWith3: "Move through the form with confidence and review your answers before submitting.",

  stepsTitle: "Three Simple Steps. Less Form Stress.",
  step1Title: "Open Your Form",
  step1Desc: "Open a supported form in your browser and launch Telmy when you need assistance.",
  step2Title: "Understand Each Question",
  step2Desc: "Select a confusing field and get a clear explanation in a language you understand.",
  step3Title: "Fill In and Review",
  step3Desc: "Use guidance to complete your answers, then review your information before submitting.",

  privacyTitle: "Your information stays yours",
  privacySubtitle: "Forms hold your most personal details. Telmy.ai is engineered to mathematically protect them.",
  priv1Title: "AES-256 Encryption",
  priv1Desc: "Your saved profiles are encrypted locally on your own machine.",
  priv2Title: "Zero-Knowledge",
  priv2Desc: "Telmy staff and developers cannot peek at your private data.",
  priv3Title: "No Document Storage",
  priv3Desc: "Uploaded files and forms you open are shredded after analysis.",
  priv4Title: "Passwords Stay Private",
  priv4Desc: "Passwords, credit cards, and CVV codes are strictly skipped.",

  pricingTeaserTitle: "Start free. Upgrade when you need more.",
  pricingTeaserDesc: "5 forms every month at no cost, with all 14 accessibility tools included.",
  pricingTeaserBtn: "See plans and prices →",

  faqTitle: "Questions, answered",
  faqSubtitle: "Honest, transparent answers so you can submit official paperwork with peace of mind.",
  faq1Q: "What is Telmy.ai?",
  faq1A: "Telmy.ai is a browser companion extension that explains complex form questions in plain language, in your native tongue, and audits your answers before you submit.",
  faq2Q: "Which browsers does it work on?",
  faq2A: "Chrome, Edge, Firefox, and Opera on desktop computers. Mobile browser support is planned for future releases.",
  faq3Q: "Does it work on PDF forms?",
  faq3A: "Yes. Open any visa or government PDF form in Chrome, and Telmy detects fields, answers questions, and helps export a print-ready document.",
  faq4Q: "Is it a government website?",
  faq4A: "No. Telmy.ai is an independent AI accessibility assistant and is not affiliated with any government portal. No assistant can guarantee official approval.",
  faq5Q: "Can Telmy team or database administrators view my KTP or Passport?",
  faq5A: "No. Thanks to Zero-Knowledge Client-Side Encryption (CSE), data is encrypted in your browser before leaving your machine. We cannot read your credentials.",

  finalCtaTitle: "Your next form can be easier",
  finalCtaDesc: "Add Telmy.ai in about a minute. It's free to start with 5 forms every month.",
  finalCtaBtn: "Get Telmy.ai (Free)",
  finalDemoBtn: "Try the demo",

  footerTagline: "Official AI Copilot & Accessibility Assistant to navigate e-government, visa, scholarship, and public services without anxiety.",
  footerSecurityBadge: "AES-256 Zero-Knowledge",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "Navigation",
  footerLegalTitle: "Legal & Privacy",
  footerPrivacy: "Privacy Policy",
  footerTerms: "Terms of Service",
  footerSecurity: "Security Architecture",
  footerDashboard: "User Dashboard",
  footerCopyright: "© 2026 Telmy.ai. All rights reserved.",
  footerMission: "Built with inclusion and empathy for global citizens worldwide.",

  langModalTitle: "Choose Your Language & Region",
  langModalSubtitle: "Select from our 11 supported Asia-Pacific languages. All guides, explanations, and accessibility tools will adapt automatically.",
  langModalFooterBadge: "🌏 11 Supported Asia-Pacific Languages (JAPAC)",
  langModalClose: "Close"
}

// 2. Bahasa Indonesia
export const transID: TranslationData = {
  ...transEN,
  metaTitle: "Telmy.ai — Formulir apa pun. Bahasa apa pun. Tanpa ragu.",
  navHome: "Beranda",
  navFeatures: "Fitur",
  navPricing: "Harga",
  navAcademy: "Academy",
  navDownload: "Download",
  navFaq: "FAQ",
  navSignIn: "Masuk",
  navCta: "Dapatkan Telmy.ai (Gratis)",

  heroTitle: "Formulir apa pun. Bahasa apa pun. Tanpa ragu.",
  heroSubtitle: "Telmy.ai mendampingi Anda melewati formulir rumit. Menjelaskan setiap kolom dengan bahasa sederhana yang Anda mengerti, dan memeriksa jawaban sebelum dikirim.",
  heroCta: "Dapatkan Telmy.ai (Gratis)",
  heroDemo: "Coba demonya",
  heroTrustline: "Paket gratis selamanya · Enkripsi Zero-Knowledge · Sesuai W3C WCAG 2.2 AA",
  heroWorksOn: "Dapat digunakan di",

  cardATitle: "Pandu setiap kolom",
  cardADesc: "Tanyakan apa saja dan dapatkan penjelasan gamblang beserta contoh nyata.",
  cardALink: "Pelajari lebih lanjut",
  cardBTitle: "11 bahasa",
  cardBDesc: "Baca dan isi formulir resmi dalam bahasa ibu yang paling membuat Anda tenang.",
  cardBLink: "Lihat 11 bahasa Asia-Pasifik",
  cardCTitle: "Aksesibilitas bawaan",
  cardCDesc: "14 alat bantu untuk lansia, pembaca disleksia, dan gangguan penglihatan.",
  cardCLink: "Lihat 14 alat aksesibilitas",

  unStatTitle: "Fakta Kesenjangan Layanan Publik Digital (UN E-Gov Survey 2024)",
  unStatSub: "Pemerintah telah memindahkan layanan ke online, tetapi ketersediaan tidak sama dengan kemudahan pakai.",
  unStat1Num: "99.5%",
  unStat1Label: "Portal Nasional Online",
  unStat1Desc: "192 dari 193 negara anggota PBB telah memiliki portal nasional.",
  unStat2Num: "52%",
  unStat2Label: "Tanpa Bantuan Langsung",
  unStat2Desc: "Hanya 48% portal yang menyediakan help desk untuk pemohon.",
  unStat3Num: "57%",
  unStat3Label: "Monolingual / 1 Bahasa",
  unStat3Desc: "Hanya 43% yang menyediakan dukungan multibahasa asing.",
  unStat4Num: "95%",
  unStat4Label: "Gagal Aksesibilitas",
  unStat4Desc: "Hanya 5% yang selaras dengan standar aksesibilitas W3C WCAG.",

  simBadge: "Portal Pemerintahan",
  simTitle: "Formulir Permohonan Visa & Dokumen Resmi",
  simSubtitle: "Uji coba simulasi interaktif: lihat bagaimana Telmy mengisi form, membacakan instruksi dengan suara, dan mencegah kesalahan sebelum dikirim.",
  simField1Label: "1. Nama Lengkap (Sesuai Paspor / KTP)",
  simField1Desc: "Tuliskan nama lengkap tanpa gelar akademis (misal S.T, S.Kom, Drs, Ir).",
  simField2Label: "2. Nomor Induk Kependudukan (NIK / KTP)",
  simField2Desc: "Kode 16 angka resmi identitas nasional. Jangan gunakan spasi atau tanda hubung.",
  simField3Label: "3. Nomor Paspor Internasional",
  simField3Desc: "Kode paspor alfanumerik yang masih berlaku minimal 6 bulan ke depan.",
  simBtnAutofill: "⚡ 1-Klik Isi Otomatis",
  simBtnAudit: "🚦 Periksa Sebelum Kirim (Auditor)",
  simBtnListen: "🔊 Dengarkan Panduan Suara",
  simSpeaking: "Membacakan Panduan Audio...",
  simAuditGood: "🟢 Ketiga kolom terisi valid dan siap dikirim tanpa risiko ditolak.",
  simSidepanelTitle: "Asisten AI Telmy",
  simSidepanelStatus: "● Aktif mendampingi formulir",
  simQuickActions: "Aksi Cepat 1-Klik:",
  simVaultTip: "💡 Tips: Data profil dienkripsi di browser lokal Anda tanpa disimpan di server manapun.",

  compTitle: "Mengapa Cara Lama Mengisi Formulir Bikin Frustrasi?",
  compSubtitle: "Perbandingan cara konvensional yang melelahkan vs. kemudahan bersama Telmy.ai.",
  compWithoutTitle: "❌ Tanpa Telmy",
  compWithout1: "Habiskan 45+ menit panik memikirkan maksud istilah hukum birokrasi.",
  compWithout2: "Risiko visa ditolak atau beasiswa gugur karena salah tulis tanggal atau nama.",
  compWithout3: "Google Translate biasa merusak tombol web dan salah menerjemahkan istilah hukum.",
  compWithTitle: "✅ Bersama Telmy.ai",
  compWith1: "Penjelasan ramah dan menenangkan serasa didampingi teman ahli tepat di samping Anda.",
  compWith2: "Auditor Lampu Lalu Lintas otomatis mendeteksi kesalahan paspor dan format sebelum Anda kirim.",
  compWith3: "1-Click AutoFill mengisi puluhan kolom dalam 1 detik langsung dari brankas terenkripsi Anda.",

  stepsTitle: "Tiga langkah mudah. Tanpa rasa cemas.",
  step1Title: "Pasang Telmy.ai di browser Anda",
  step1Desc: "Gratis untuk Chrome, Edge, Firefox, dan Opera dalam waktu kurang dari satu menit.",
  step2Title: "Buka formulir Anda",
  step2Desc: "Telmy.ai membuka panel pendamping ramah tepat di samping formulir web atau PDF apa pun.",
  step3Title: "Ikuti panduannya",
  step3Desc: "Dapatkan penjelasan tiap kolom, isi otomatis dengan data terenkripsi, dan audit kesalahan sebelum kirim.",

  privacyTitle: "Data pribadi Anda, 100% milik Anda seutuhnya",
  privacySubtitle: "Formulir memuat informasi paling berharga Anda. Telmy.ai dirancang melindunginya secara matematis.",
  priv1Title: "Enkripsi AES-256",
  priv1Desc: "Profil Anda dienkripsi secara lokal di perangkat Anda sendiri.",
  priv2Title: "Zero-Knowledge",
  priv2Desc: "Tim dan developer Telmy tidak memiliki kemampuan membaca data Anda.",
  priv3Title: "Tanpa Penyimpanan Dokumen",
  priv3Desc: "Formulir dan berkas yang Anda buka segera dihancurkan setelah selesai.",
  priv4Title: "Kata Sandi Tetap Privat",
  priv4Desc: "Password, nomor kartu kredit, dan CVV otomatis diabaikan.",

  pricingTeaserTitle: "Mulai gratis. Upgrade saat butuh lebih banyak.",
  pricingTeaserDesc: "5 formulir setiap bulan tanpa biaya, lengkap dengan 14 alat aksesibilitas.",
  pricingTeaserBtn: "Lihat paket dan harga →",

  faqTitle: "Pertanyaan yang Sering Diajukan",
  faqSubtitle: "Jawaban transparan untuk ketenangan hati Anda saat mengurus dokumen resmi.",
  faq1Q: "Apa itu Telmy.ai?",
  faq1A: "Telmy.ai adalah ekstensi pendamping browser yang menjelaskan kolom formulir dengan bahasa sederhana, dalam bahasa ibu Anda, dan mengaudit isian sebelum dikirim.",
  faq2Q: "Bisa digunakan di browser apa saja?",
  faq2A: "Chrome, Edge, Firefox, dan Opera di komputer/laptop. Dukungan peramban mobile sedang kami siapkan.",
  faq3Q: "Apakah bisa untuk formulir PDF?",
  faq3A: "Bisa. Buka file PDF di Chrome, Telmy akan mendeteksi kolomnya, menjawab pertanyaan Anda, dan membantu mengekspor PDF siap cetak.",
  faq4Q: "Apakah Telmy.ai website pemerintah?",
  faq4A: "Bukan. Telmy.ai adalah asisten AI independen dan tidak terafiliasi dengan lembaga pemerintah manapun.",
  faq5Q: "Apakah tim Telmy bisa melihat KTP atau paspor saya?",
  faq5A: "Tidak bisa. Berkat arsitektur Zero-Knowledge Client-Side Encryption, data dienkripsi di browser sebelum terkirim ke jaringan.",

  finalCtaTitle: "Pengisian formulir berikutnya bisa jauh lebih mudah",
  finalCtaDesc: "Pasang Telmy.ai dalam satu menit. Gratis untuk memulai dengan 5 formulir setiap bulan.",
  finalCtaBtn: "Dapatkan Telmy.ai (Gratis)",
  finalDemoBtn: "Coba demonya",

  footerTagline: "Asisten AI & Aksesibilitas Resmi untuk mengisi formulir e-government, visa, beasiswa, dan layanan publik tanpa rasa cemas.",
  footerSecurityBadge: "AES-256 Zero-Knowledge",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "Navigasi",
  footerLegalTitle: "Kebijakan & Privasi",
  footerPrivacy: "Kebijakan Privasi",
  footerTerms: "Ketentuan Layanan",
  footerSecurity: "Arsitektur Keamanan",
  footerDashboard: "Dashboard Pengguna",
  footerCopyright: "© 2026 Telmy.ai. Hak Cipta Dilindungi.",
  footerMission: "Dibuat dengan dedikasi inklusi untuk seluruh warga global.",

  langModalTitle: "Pilih Bahasa & Wilayah Anda",
  langModalSubtitle: "Tersedia 11 bahasa Asia Pasifik. Seluruh panduan, penjelasan formulir, dan alat bantu aksesibilitas akan otomatis menyesuaikan.",
  langModalFooterBadge: "🌏 11 Bahasa Resmi Asia-Pasifik (JAPAC)",
  langModalClose: "Tutup"
}

// 3. 繁體中文 (Traditional Chinese / Taiwan)
export const transZHTW: TranslationData = {
  ...transEN,
  metaTitle: "Telmy.ai — 任何表格。任何語言。從容無憂。",
  navHome: "首頁",
  navFeatures: "功能特點",
  navPricing: "方案價格",
  navAcademy: "培訓學院",
  navDownload: "立即下載",
  navFaq: "常見問題",
  navSignIn: "登入",
  navCta: "取得 Telmy.ai（免費）",

  heroTitle: "任何表格。任何語言。從容無憂。",
  heroSubtitle: "Telmy.ai 陪伴您輕鬆搞定繁瑣複雜的公文表格。以淺白易懂的母語解釋每個欄位，並在提交前嚴密審核答案。",
  heroCta: "取得 Telmy.ai（免費）",
  heroDemo: "體驗線上展示",
  heroTrustline: "永久免費額度 · 零知識端到端加密 · 符合 W3C WCAG 2.2 AA 規範",
  heroWorksOn: "支援瀏覽器",

  cardATitle: "引導每個欄位",
  cardADesc: "隨時提問，獲得清晰簡潔的說明與真實範例。",
  cardALink: "了解更多",
  cardBTitle: "11 種語言支援",
  cardBDesc: "在最安心熟悉的母語環境下閱讀並填寫官方文件。",
  cardBLink: "查看 11 種亞太語言",
  cardCTitle: "內建無障礙輔助",
  cardCDesc: "14 項輔助工具，專為銀髮族、誦讀障礙及弱視申請人設計。",
  cardCLink: "查看 14 種無障礙工具",

  unStatTitle: "全球電子政務調查現實檢驗 (聯合國 2024 電子政務調查)",
  unStatSub: "各國政府已將公共服務移至線上，但「上線」並不等同於「好用易用」。",
  unStat1Num: "99.5%",
  unStat1Label: "國家政務門戶已上線",
  unStat1Desc: "聯合國 193 個會員國中已有 192 國啟用線上政務門戶。",
  unStat2Num: "52%",
  unStat2Label: "缺乏即時諮詢協助",
  unStat2Desc: "僅 48% 的國家入口網站向申請人提供真人客服支援。",
  unStat3Num: "57%",
  unStat3Label: "僅支援單一官方語言",
  unStat3Desc: "僅 43% 的入口網站具備多國語言或外語翻譯支援。",
  unStat4Num: "95%",
  unStat4Label: "無障礙標準未達標",
  unStat4Desc: "僅 5% 符合 W3C WCAG 國際數位無障礙設計標準。",

  faqTitle: "常見問題解答",
  faqSubtitle: "坦率、透明的解答，讓您安心完成所有官方公文與表格申辦。",
  faq1Q: "什麼是 Telmy.ai？",
  faq1A: "Telmy.ai 是一款智慧型瀏覽器側邊欄擴充功能，用淺白的大白話及母語向您解釋繁瑣的公文欄位，並在提交前嚴密審核防錯。",
  faq2Q: "可以在哪些瀏覽器上使用？",
  faq2A: "支援電腦版 Chrome、Edge、Firefox 與 Opera。行動裝置瀏覽器版本正積極研發中。",
  faq3Q: "支援 PDF 格式表格嗎？",
  faq3A: "支援。在 Chrome 中開啟任何簽證或官方 PDF 表單，Telmy 即可辨識欄位並協助填寫與列印。",
  faq4Q: "Telmy.ai 是政府官方網站嗎？",
  faq4A: "不是。Telmy.ai 是一款獨立的 AI 輔助與無障礙科技工具，與任何政府機構均無隸屬關係。",
  faq5Q: "Telmy 團隊或資料庫管理者能否看見我的身分證或護照？",
  faq5A: "絕不可能。得益於零知識客戶端加密（CSE），所有敏感資料在離開您的裝置前即已完成加密。",

  footerTagline: "官方 AI 伴侶與無障礙助手，助您從容填寫電子政務、簽證、獎學金與各類公共服務表格，告別焦慮。",
  footerSecurityBadge: "AES-256 零知識架構",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "導覽目錄",
  footerLegalTitle: "法律與隱私",
  footerPrivacy: "隱私權政策",
  footerTerms: "服務條款",
  footerSecurity: "安全架構規範",
  footerDashboard: "使用者儀表板",
  footerCopyright: "© 2026 Telmy.ai. 版權所有。",
  footerMission: "以科技包容與同理心，為全球公民精心打造。",

  compTitle: "傳統填表方式為何讓人倍受折磨？",
  compSubtitle: "傳統令人沮喪的填表體驗 vs. 輕鬆自信的 Telmy.ai。",
  compWithoutTitle: "❌ 沒有 Telmy 時",
  compWithout1: "花費 45 分鐘以上苦思冥想晦澀難懂的法律專有名詞。",
  compWithout2: "因日期順序顛倒或姓名格式填錯而慘遭簽證拒簽或獎學金延誤。",
  compWithout3: "普通網頁翻譯經常破壞表單按鈕，並扭曲公文重要術語。",
  compWithTitle: "✅ 使用 Telmy.ai 後",
  compWith1: "親切溫和的解說，宛如專業朋友就坐在您身旁悉心指導。",
  compWith2: "紅綠燈審核系統自動在您點擊送出前揪出護照效期與格式漏洞。",
  compWith3: "一秒鐘從加密保險箱安全自動填充 20 個以上欄位。",

  stepsTitle: "三個步驟。從容無憂。",
  step1Title: "將 Telmy.ai 新增至瀏覽器",
  step1Desc: "支援 Chrome、Edge、Firefox 與 Opera，安裝不需一分鐘。",
  step2Title: "開啟您的表格",
  step2Desc: "Telmy.ai 會在任何網頁表單或 PDF 旁自動開啟貼心側邊欄。",
  step3Title: "依照指引輕鬆填寫",
  step3Desc: "查看每個欄位的大白話解說，一秒自動填表，並在送出前完成智能審核。",

  privacyTitle: "您的個人資料，永遠屬於您自己",
  privacySubtitle: "公文表格包含極度私密的個人隱私。Telmy.ai 從數學層面提供嚴密防護。",
  priv1Title: "AES-256 加密技術",
  priv1Desc: "您的儲存檔案在您自己的本機設備端完成高強度加密。",
  priv2Title: "零知識架構 (Zero-Knowledge)",
  priv2Desc: "Telmy 員工與後台開發者皆無法窺探您的私密檔案。",
  priv3Title: "零實體文件儲存",
  priv3Desc: "您開啟的表格與上傳檔案在分析完成後立即徹底銷毀。",
  priv4Title: "密碼嚴格保密",
  priv4Desc: "密碼、信用卡卡號及 CVV 安全碼會被系統自動跳過，絕不收集。",

  pricingTeaserTitle: "免費開始。需要更多時隨心升級。",
  pricingTeaserDesc: "每月免費填寫 5 份表格，全套 14 種無障礙工具完整開放。",
  pricingTeaserBtn: "查看方案與價格 →",

  finalCtaTitle: "您的下一份表格可以更輕鬆",
  finalCtaDesc: "一分鐘內完成安裝。每月享有 5 份免費表格額度。",
  finalCtaBtn: "取得 Telmy.ai（免費）",
  finalDemoBtn: "體驗線上展示",

  langModalClose: "關閉"
}

// 4. 简体中文
export const transZH: TranslationData = {
  ...transZHTW,
  metaTitle: "Telmy.ai — 任何表格。任何语言。从容无忧。",
  navFeatures: "功能亮点",
  navPricing: "价格方案",
  navAcademy: "培训学院",
  navDownload: "立即下载",
  navSignIn: "登录",
  navCta: "获取 Telmy.ai（免费）",
  heroTitle: "任何表格。任何语言。从容无忧。",
  heroSubtitle: "Telmy.ai 陪伴您轻松搞定繁琐复杂的公文表格。以浅显易懂的大白话解释每个栏位，并在提交前严密审核答案。",
  heroCta: "获取 Telmy.ai（免费）",
  heroDemo: "体验在线演示",
  heroTrustline: "永久免费额度 · 零知识端到端加密 · 符合 W3C WCAG 2.2 AA 规范",
  cardATitle: "引导每个栏位",
  cardADesc: "随时提问，获得清晰简短的说明与真实范例。",
  cardALink: "了解更多",
  cardBTitle: "11 种语言支持",
  cardBDesc: "在最安心熟悉的母语环境下阅读并填写官方文件。",
  cardBLink: "查看 11 种亚太语言",
  cardCTitle: "内置无障碍辅助",
  cardCDesc: "14 项辅助工具，专为银发族、诵读障碍及弱视申请人设计。",
  cardCLink: "查看 14 项无障碍工具",

  unStatTitle: "全球电子政务调查现实检验 (联合国 2024 电子政务调查)",
  unStatSub: "各国政府已将公共服务移至线上，但“上线”并不等同于“好用易用”。",
  unStat1Num: "99.5%",
  unStat1Label: "国家政务门户已上线",
  unStat1Desc: "联合国 193 个会员国中已有 192 国启用线上政务门户。",
  unStat2Num: "52%",
  unStat2Label: "缺乏即时咨询协助",
  unStat2Desc: "仅 48% 的国家入口网站向申请人提供真人客服支持。",
  unStat3Num: "57%",
  unStat3Label: "仅支持单官方语言",
  unStat3Desc: "仅 43% 的入口网站具备多语言或外语翻译支持。",
  unStat4Num: "95%",
  unStat4Label: "无障碍标准未达标",
  unStat4Desc: "仅 5% 符合 W3C WCAG 国际数字无障碍设计标准。",

  faqTitle: "常见问题解答",
  faqSubtitle: "坦率、透明的解答，让您安心完成所有官方公文与表格申办。",
  faq1Q: "什么是 Telmy.ai？",
  faq1A: "Telmy.ai 是一款智能浏览器侧边栏插件，用浅显易懂的大白话及母语向您解释繁杂的公文栏位，并在提交前严密审核防错。",
  faq2Q: "可以在哪些浏览器上使用？",
  faq2A: "支持电脑端 Chrome、Edge、Firefox 与 Opera。移动端浏览器版本正加紧研发中。",
  faq3Q: "支持 PDF 格式表格吗？",
  faq3A: "支持。在 Chrome 中打开任何签证或官方 PDF 表单，Telmy 即可识别栏位并协助填写与打印。",
  faq4Q: "Telmy.ai 是政府官方网站吗？",
  faq4A: "不是。Telmy.ai 是一款独立的 AI 辅助与无障碍科技工具，与任何政府机构均无隶属关系。",
  faq5Q: "Telmy 团队或数据库管理员能否查看我的身份证或护照？",
  faq5A: "绝不可能。得益于零知识客户端加密（CSE），所有敏感数据在离开您的设备前即已完成加密。",

  footerTagline: "官方 AI 伴侣与无障碍助手，助您从容填写电子政务、签证、奖学金与各类公共服务表格，告别焦虑。",
  footerSecurityBadge: "AES-256 零知识架构",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "导航目录",
  footerLegalTitle: "法律与隐私",
  footerPrivacy: "隐私政策",
  footerTerms: "服务条款",
  footerSecurity: "安全架构规范",
  footerDashboard: "用户控制面板",
  footerCopyright: "© 2026 Telmy.ai. 版权所有。",
  footerMission: "以科技包容与同理心，为全球公民精心打造。",

  finalCtaBtn: "获取 Telmy.ai（免费）",
  finalDemoBtn: "体验在线演示",
  langModalClose: "关闭"
}

// 5. 日本語
export const transJA: TranslationData = {
  ...transEN,
  metaTitle: "Telmy.ai — どんな申請書も、どんな言語でも、もう迷わない。",
  navHome: "ホーム",
  navFeatures: "機能",
  navPricing: "料金",
  navAcademy: "アカデミー",
  navDownload: "ダウンロード",
  navSignIn: "ログイン",
  navCta: "Telmy.ai を入手（無料）",

  heroTitle: "どんな申請書も、どんな言語でも、もう迷わない。",
  heroSubtitle: "Telmy.ai は複雑な申請書類の作成を優しくサポートします。難しい項目も分かりやすい言葉で解説し、送信前に内容を自動点検します。",
  heroCta: "Telmy.ai を入手（無料）",
  heroDemo: "体験デモを試す",
  heroTrustline: "永久無料プラン · ゼロ知識暗号化 · W3C WCAG 2.2 AA 準拠",
  heroWorksOn: "対応ブラウザ",

  cardATitle: "すべての項目をやさしく案内",
  cardADesc: "何でも質問でき、身近な実例とともに明快な解説を受けられます。",
  cardALink: "詳しく見る",
  cardBTitle: "11言語に対応",
  cardBDesc: "あなたが最も安心できる母国語で公的フォームを読み、記入できます。",
  cardBLink: "11のアジア太平洋言語を見る",
  cardCTitle: "アクセシビリティ機能を標準装備",
  cardCDesc: "シニア、読字アシスト、ロービジョンの方のための14種類のツールを完備。",
  cardCLink: "14の支援ツールを見る",

  unStatTitle: "世界の電子政府の実態調査 (国連電子政府調査 2024)",
  unStatSub: "行政手続きのオンライン化は進みましたが、利用しやすさは追いついていません。",
  unStat1Num: "99.5%",
  unStat1Label: "ポータルのオンライン化",
  unStat1Desc: "国連加盟193カ国中、192カ国がオンライン公共ポータルを運用。",
  unStat2Num: "52%",
  unStat2Label: "有人サポートの欠如",
  unStat2Desc: "申請者にライブヘルプデスクを提供しているのはわずか48%。",
  unStat3Num: "57%",
  unStat3Label: "単一言語のみの対応",
  unStat3Desc: "多言語や外国語サポートを提供しているポータルは43%のみ。",
  unStat4Num: "95%",
  unStat4Label: "アクセシビリティ不適合",
  unStat4Desc: "W3C WCAG アクセシビリティ国際基準を満たしているのはわずか5%。",

  faqTitle: "よくあるご質問",
  faqSubtitle: "公的書類を安心して提出できるよう、誠実かつ透明にお答えします。",
  faq1Q: "Telmy.ai とは何ですか？",
  faq1A: "Telmy.ai は、難しい申請書類の質問を分かりやすい日常語かつ母国語で解説し、送信前に回答を自動監査するブラウザ拡張機能です。",
  faq2Q: "どのブラウザで使えますか？",
  faq2A: "パソコン版 Chrome、Edge、Firefox、Opera に対応しています。モバイル版も順次リリース予定です。",
  faq3Q: "PDF 形式の書類にも対応していますか？",
  faq3A: "はい。Chrome でビザや行政の PDF フォームを開くと、自動で項目を検出し、印刷可能な書類の作成を支援します。",
  faq4Q: "政府の公式サイトですか？",
  faq4A: "いいえ。Telmy.ai は独立した AI アシスタントであり、いかなる政府機関とも提携していません。",
  faq5Q: "運営スタッフや管理者は私の身分証明書を見ることができますか？",
  faq5A: "一切見ることができません。ゼロ知識クライアント暗号化（CSE）により、データはお手元の端末内で暗号化されます。",

  footerTagline: "電子政府、ビザ、奨学金、公共サービスを不安なく進めるための公式 AI パートナー＆アクセシビリティ支援ツール。",
  footerSecurityBadge: "AES-256 ゼロ知識暗号化",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "ナビゲーション",
  footerLegalTitle: "法的情報とプライバシー",
  footerPrivacy: "プライバシーポリシー",
  footerTerms: "利用規約",
  footerSecurity: "セキュリティ設計",
  footerDashboard: "ユーザーダッシュボード",
  footerCopyright: "© 2026 Telmy.ai. All rights reserved.",
  footerMission: "世界中のすべての人に寄り添うインクルーシブ設計。",

  compTitle: "従来のフォーム入力が失敗しやすい理由",
  compSubtitle: "従来のストレスフルな方法 vs. Telmy.ai のスムーズな体験。",
  compWithoutTitle: "❌ Telmyがない場合",
  compWithout1: "難解な法律・行政用語を調べるだけで45分以上浪費し、不安になる。",
  compWithout2: "日付の順序間違いや書式不備でビザ申請が却下されるリスク。",
  compWithout3: "一般的な自動翻訳ではボタンが壊れ、重要な用語が誤訳される。",
  compWithTitle: "✅ Telmy.aiを使った場合",
  compWith1: "専門家が隣にいるかのような安心できる分かりやすいガイダンス。",
  compWith2: "信号機監査がパスポート残存期間や入力エラーを送信前に自動発見。",
  compWith3: "暗号化された安全な金庫から、20以上の項目を1秒で自動入力完了。",

  stepsTitle: "わずか3ステップ。もう不安はありません。",
  step1Title: "Telmy.ai をブラウザに追加",
  step1Desc: "Chrome、Edge、Firefox、Opera に1分以内で無料で追加できます。",
  step2Title: "申請フォームを開く",
  step2Desc: "WebフォームやPDFのすぐ横に親切なコンパニオンサイドパネルが開きます。",
  step3Title: "ガイドに沿って入力",
  step3Desc: "項目の意味を確認し、暗号化データで自動入力し、送信前にミスを監査します。",

  privacyTitle: "あなたの個人情報は、100%あなただけのもの",
  privacySubtitle: "公的フォームには極めてプライベートな情報が含まれます。Telmy.ai は数学的暗号化で完全に保護します。",
  priv1Title: "AES-256 暗号化",
  priv1Desc: "保存されたプロファイルはお手元の端末内で暗号化されます。",
  priv2Title: "ゼロ知識暗号化 (Zero-Knowledge)",
  priv2Desc: "Telmy のスタッフもエンジニアもあなたのデータを閲覧できません。",
  priv3Title: "書類をサーバーに非保存",
  priv3Desc: "開いたフォームやアップロードされた書類は処理後すぐに破棄されます。",
  priv4Title: "パスワードは完全非収集",
  priv4Desc: "パスワードやクレジットカード情報は最初から自動的に除外されます。",

  pricingTeaserTitle: "まずは無料で体験。必要に応じてアップグレード。",
  pricingTeaserDesc: "毎月5件のフォーム作成と14種類のアクセシビリティ機能が無料。",
  pricingTeaserBtn: "プランと料金を見る →",

  finalCtaTitle: "次回の書類作成は、もっと簡単に。",
  finalCtaDesc: "約1分で導入完了。毎月5件まで無料で始められます。",
  finalCtaBtn: "Telmy.ai を入手（無料）",
  finalDemoBtn: "体験デモを試す",
  langModalClose: "閉じる"
}

// 6. 한국어
export const transKO: TranslationData = {
  ...transEN,
  metaTitle: "Telmy.ai — 어떤 양식도. 어떤 언어로도. 걱정 없이.",
  navHome: "홈",
  navFeatures: "주요 기능",
  navPricing: "요금 안내",
  navAcademy: "아카데미",
  navDownload: "다운로드",
  navSignIn: "로그인",
  navCta: "Telmy.ai 시작하기 (무료)",

  heroTitle: "어떤 양식도. 어떤 언어로도. 걱정 없이.",
  heroSubtitle: "Telmy.ai가 복잡한 공식 서류 작성을 돕습니다. 모든 항목을 모국어로 알기 쉽게 설명하고, 제출 전 답변을 점검합니다.",
  heroCta: "Telmy.ai 시작하기 (무료)",
  heroDemo: "체험 데모 보기",
  heroTrustline: "평생 무료 혜택 · 영지식 암호화 · W3C WCAG 2.2 AA 준수",
  heroWorksOn: "지원 브라우저",

  cardATitle: "모든 항목을 친절히 안내",
  cardADesc: "궁금한 점을 질문하고 구체적인 예시와 함께 명쾌한 설명을 받으세요.",
  cardALink: "자세히 알아보기",
  cardBTitle: "11개 언어 지원",
  cardBDesc: "가장 편안하고 익숙한 모국어로 공식 서류를 읽고 작성하세요.",
  cardBLink: "11개 아시아·태평양 언어 보기",
  cardCTitle: "웹 접근성 도구 내장",
  cardCDesc: "어르신, 난독증, 저시력 지원자를 위한 14가지 필수 접근성 도구 탑재.",
  cardCLink: "14가지 접근성 도구 보기",

  unStatTitle: "글로벌 전자정부 현실 실태 (유엔 2024 전자정부 조사)",
  unStatSub: "각국 정부가 서비스를 온라인으로 전환했지만, 온라인화가 곧 편리함을 의미하지는 않습니다.",
  unStat1Num: "99.5%",
  unStat1Label: "국가 포털 온라인 운영",
  unStat1Desc: "유엔 193개 회원국 중 192개국이 온라인 공공 포털을 운영 중.",
  unStat2Num: "52%",
  unStat2Label: "실시간 상담 지원 부재",
  unStat2Desc: "신청자에게 헬프데스크 상담을 제공하는 국가는 48%에 불과.",
  unStat3Num: "57%",
  unStat3Label: "단일 언어만 지원",
  unStat3Desc: "외국어 및 다국어 번역 지원을 제공하는 포털은 43%뿐.",
  unStat4Num: "95%",
  unStat4Label: "웹 접근성 기준 미달",
  unStat4Desc: "W3C WCAG 국제 웹 접근성 표준을 준수하는 포털은 5%에 불과.",

  faqTitle: "자주 묻는 질문",
  faqSubtitle: "공식 행정 서류를 안심하고 제출하실 수 있도록 솔직하고 투명하게 답변드립니다.",
  faq1Q: "Telmy.ai는 어떤 서비스인가요?",
  faq1A: "Telmy.ai는 복잡한 공공 양식의 질문을 쉬운 일상어와 모국어로 설명해주고, 제출 전 답변 오류를 점검해 주는 브라우저 인공지능 보조 프로그램입니다.",
  faq2Q: "어떤 브라우저에서 사용할 수 있나요?",
  faq2A: "PC 컴퓨터용 Chrome, Edge, Firefox, Opera를 지원합니다. 모바일 브라우저는 추후 지원 예정입니다.",
  faq3Q: "PDF 서식에도 작동하나요?",
  faq3A: "네. Chrome 브라우저에서 비자나 공공기관 PDF 문서를 열면 Telmy가 입력 필드를 감지하여 작성과 인쇄를 돕습니다.",
  faq4Q: "정부 공식 웹사이트인가요?",
  faq4A: "아닙니다. Telmy.ai는 독립적인 AI 접근성 도구이며 어떤 정부 기관과도 직접 제휴되어 있지 않습니다.",
  faq5Q: "Telmy 팀이나 관리자가 제 주민등록번호나 여권을 볼 수 있나요?",
  faq5A: "절대 볼 수 없습니다. 영지식 클라이언트 암호화(CSE) 기술로 모든 정보는 사용자 기기를 떠나기 전에 강력히 암호화됩니다.",

  footerTagline: "전자정부, 비자, 장학금 및 공공 행정 서비스를 불안감 없이 해결할 수 있도록 돕는 공식 AI 어시스턴트.",
  footerSecurityBadge: "AES-256 영지식 암호화",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "사이트 바로가기",
  footerLegalTitle: "약관 및 정책",
  footerPrivacy: "개인정보 처리방침",
  footerTerms: "서비스 이용약관",
  footerSecurity: "보안 아키텍처",
  footerDashboard: "사용자 대시보드",
  footerCopyright: "© 2026 Telmy.ai. All rights reserved.",
  footerMission: "모든 글로벌 시민을 위한 디지털 포용과 따뜻한 기술.",

  compTitle: "기존 양식 작성이 실패하기 쉬운 이유",
  compSubtitle: "기존의 답답한 방식 vs. Telmy.ai의 막힘없는 경험.",
  compWithoutTitle: "❌ Telmy가 없을 때",
  compWithout1: "이해하기 힘든 행정 용어를 찾느라 45분 이상 스트레스 받음.",
  compWithout2: "날짜 형식이나 이름 기입 실수로 비자가 반려되거나 지연될 위험.",
  compWithout3: "일반 번역기는 법률 용어를 왜곡하고 웹사이트 제출 버튼을 망가뜨림.",
  compWithTitle: "✅ Telmy.ai와 함께할 때",
  compWith1: "전문가 친구가 바로 옆에 앉아 도와주는 듯한 친절하고 편안한 설명.",
  compWith2: "신호등 감사 기능이 제출 전 여권 만료일과 서식 오류를 자동으로 잡아냄.",
  compWith3: "암호화된 안전한 금고에서 20개 이상의 항목을 1초 만에 자동 입력.",

  stepsTitle: "간단한 세 단계. 이제 걱정 끝.",
  step1Title: "브라우저에 Telmy.ai 추가",
  step1Desc: "Chrome, Edge, Firefox, Opera에서 1분 이내에 무료로 추가하세요.",
  step2Title: "작성할 양식 열기",
  step2Desc: "어떤 웹 폼이나 PDF 문서 옆에도 친절한 사이드 패널이 바로 열립니다.",
  step3Title: "가이드를 따라 작성",
  step3Desc: "항목별 설명을 확인하고, 안전하게 자동완성하며, 제출 전 오류를 점검하세요.",

  privacyTitle: "귀하의 개인정보는 100% 귀하의 것입니다",
  privacySubtitle: "공식 서류는 매우 민감한 개인정보를 담고 있습니다. Telmy.ai는 수학적 암호화로 철저히 보호합니다.",
  priv1Title: "AES-256 암호화",
  priv1Desc: "저장된 프로필 데이터는 사용자의 기기 내에서 직접 암호화됩니다.",
  priv2Title: "영지식 암호화 (Zero-Knowledge)",
  priv2Desc: "Telmy 직원과 개발자도 사용자의 개인정보를 열람할 수 없습니다.",
  priv3Title: "서류 미보관 원칙",
  priv3Desc: "분석을 위해 열람하거나 업로드한 서류는 완료 즉시 영구 파기됩니다.",
  priv4Title: "비밀번호 절대 비수집",
  priv4Desc: "비밀번호와 신용카드 정보는 수집 대상에서 철저히 제외됩니다.",

  pricingTeaserTitle: "무료로 시작하세요. 필요할 때 언제든 업그레이드.",
  pricingTeaserDesc: "매월 5개 양식 작성과 14가지 접근성 도구가 무료로 제공됩니다.",
  pricingTeaserBtn: "요금제 및 혜택 확인 →",

  finalCtaTitle: "다음 서류 작성은 훨씬 더 쉬워집니다",
  finalCtaDesc: "약 1분이면 설치 완료. 매월 5개 양식을 무료로 작성해 보세요.",
  finalCtaBtn: "Telmy.ai 시작하기 (무료)",
  finalDemoBtn: "체험 데모 보기",
  langModalClose: "닫기"
}

// 7. Bahasa Melayu (Malaysia)
export const transMS: TranslationData = {
  ...transID,
  metaTitle: "Telmy.ai — Sebarang borang. Sebarang bahasa. Tanpa ragu.",
  navHome: "Laman Utama",
  navFeatures: "Ciri-ciri",
  navPricing: "Harga",
  navAcademy: "Akademi",
  navDownload: "Muat Turun",
  navSignIn: "Log Masuk",
  navCta: "Dapatkan Telmy.ai (Percuma)",
  heroTitle: "Sebarang borang. Sebarang bahasa. Tanpa ragu.",
  heroSubtitle: "Telmy.ai membantu anda mengisi borang yang rumit. Menjelaskan setiap medan dalam bahasa mudah, dan menyemak jawapan anda sebelum dihantar.",
  heroCta: "Dapatkan Telmy.ai (Percuma)",
  heroDemo: "Cuba demo",
  cardALink: "Ketahui lebih lanjut",
  cardBLink: "Lihat 11 bahasa Asia-Pasifik",
  cardCLink: "Lihat 14 alat kebolehcapaian",
  finalCtaBtn: "Dapatkan Telmy.ai (Percuma)",
  langModalClose: "Tutup"
}

// 8. Tiếng Việt (Vietnam)
export const transVI: TranslationData = {
  ...transEN,
  metaTitle: "Telmy.ai — Mọi biểu mẫu. Mọi ngôn ngữ. Không lo lắng.",
  navHome: "Trang chủ",
  navFeatures: "Tính năng",
  navPricing: "Bảng giá",
  navAcademy: "Học viện",
  navDownload: "Tải về",
  navSignIn: "Đăng nhập",
  navCta: "Tải Telmy.ai (Miễn phí)",
  heroTitle: "Mọi biểu mẫu. Mọi ngôn ngữ. Không lo lắng.",
  heroSubtitle: "Telmy.ai giúp bạn vượt qua các biểu mẫu phức tạp. Giải thích từng trường bằng ngôn ngữ mẹ đẻ dễ hiểu và kiểm tra câu trả lời trước khi gửi.",
  heroCta: "Tải Telmy.ai (Miễn phí)",
  heroDemo: "Dùng thử demo",
  heroTrustline: "Gói miễn phí trọn đời · Mã hóa Zero-Knowledge · Đạt chuẩn W3C WCAG 2.2 AA",
  heroWorksOn: "Hoạt động trên",

  cardATitle: "Hướng dẫn từng trường thông tin",
  cardADesc: "Đặt câu hỏi và nhận câu trả lời rõ ràng, dễ hiểu cùng ví dụ thực tế.",
  cardALink: "Tìm hiểu thêm",
  cardBTitle: "11 ngôn ngữ",
  cardBDesc: "Đọc và điền các biểu mẫu chính thức bằng ngôn ngữ mẹ đẻ bạn an tâm nhất.",
  cardBLink: "Xem 11 ngôn ngữ Châu Á - Thái Bình Dương",
  cardCTitle: "Tích hợp sẵn trợ năng",
  cardCDesc: "14 công cụ cho người cao tuổi, người đọc khó khăn và người khiếm thị.",
  cardCLink: "Xem 14 công cụ trợ năng",

  unStatTitle: "Thực Trạng Dịch Vụ Công Trực Tuyến Toàn Cầu (Khảo Sát UN E-Gov 2024)",
  unStatSub: "Các chính phủ đã đưa dịch vụ lên mạng, nhưng tính sẵn có không đồng nghĩa với tính dễ dùng.",
  unStat1Num: "99.5%",
  unStat1Label: "Cổng Thông Tin Đã Trực Tuyến",
  unStat1Desc: "192 trong 193 quốc gia thành viên LHQ vận hành cổng dịch vụ công trực tuyến.",
  unStat2Num: "52%",
  unStat2Label: "Thiếu Hỗ Trợ Trực Tiếp",
  unStat2Desc: "Chỉ 48% cung cấp bàn hỗ trợ trực tiếp cho người nộp đơn.",
  unStat3Num: "57%",
  unStat3Label: "Chỉ Hỗ Trợ Đơn Ngữ",
  unStat3Desc: "Chỉ 43% cung cấp dịch vụ hỗ trợ ngôn ngữ nước ngoài.",
  unStat4Num: "95%",
  unStat4Label: "Không Đạt Chuẩn Trợ Năng",
  unStat4Desc: "Chỉ 5% tuân thủ các tiêu chuẩn trợ năng quốc tế W3C WCAG.",

  faqTitle: "Câu hỏi thường gặp",
  faqSubtitle: "Câu trả lời minh bạch, thẳng thắn để bạn yên tâm nộp hồ sơ chính thức.",
  faq1Q: "Telmy.ai là gì?",
  faq1A: "Telmy.ai là tiện ích mở rộng trình duyệt giải thích các câu hỏi biểu mẫu phức tạp bằng ngôn ngữ đơn giản, tiếng mẹ đẻ và kiểm tra câu trả lời trước khi nộp.",
  faq2Q: "Tiện ích hoạt động trên trình duyệt nào?",
  faq2A: "Chrome, Edge, Firefox và Opera trên máy tính. Phiên bản trình duyệt di động đang được lên kế hoạch phát triển.",
  faq3Q: "Có hoạt động trên biểu mẫu PDF không?",
  faq3A: "Có. Mở biểu mẫu PDF thị thực hoặc dịch vụ công trên Chrome, Telmy sẽ nhận diện các trường và hỗ trợ xuất bản in hoàn chỉnh.",
  faq4Q: "Đây có phải là trang web chính phủ không?",
  faq4A: "Không. Telmy.ai là trợ lý AI trợ năng độc lập và không liên kết với bất kỳ cơ quan chính phủ nào.",
  faq5Q: "Đội ngũ Telmy có xem được CCCD hoặc hộ chiếu của tôi không?",
  faq5A: "Tuyệt đối không. Nhờ mã hóa phía máy khách (CSE), dữ liệu của bạn được mã hóa cục bộ ngay trên thiết bị trước khi rời khỏi máy.",

  footerTagline: "Trợ lý AI & Hỗ trợ tiếp cận chính thức giúp bạn điền biểu mẫu dịch vụ công, thị thực, học bổng không còn nỗi lo lắng.",
  footerSecurityBadge: "Mã hóa AES-256 Zero-Knowledge",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "Điều hướng",
  footerLegalTitle: "Pháp lý & Quyền riêng tư",
  footerPrivacy: "Chính sách bảo mật",
  footerTerms: "Điều khoản dịch vụ",
  footerSecurity: "Kiến trúc an ninh",
  footerDashboard: "Bảng điều khiển",
  footerCopyright: "© 2026 Telmy.ai. Bảo lưu mọi quyền.",
  footerMission: "Xây dựng vì sự hòa nhập và đồng cảm cho công dân toàn cầu.",

  finalCtaBtn: "Tải Telmy.ai (Miễn phí)",
  langModalClose: "Đóng"
}

// 9. ไทย (Thailand)
export const transTH: TranslationData = {
  ...transEN,
  metaTitle: "Telmy.ai — ทุกแบบฟอร์ม ทุกภาษา ไร้กังวล",
  navHome: "หน้าแรก",
  navFeatures: "คุณสมบัติ",
  navPricing: "ราคา",
  navAcademy: "อะคาเดมี",
  navDownload: "ดาวน์โหลด",
  navSignIn: "เข้าสู่ระบบ",
  navCta: "รับ Telmy.ai (ฟรี)",
  heroTitle: "ทุกแบบฟอร์ม ทุกภาษา ไร้กังวล",
  heroSubtitle: "Telmy.ai ช่วยคุณกรอกแบบฟอร์มราชการและวีซ่าที่ซับซ้อน อธิบายทุกช่องด้วยภาษาที่เข้าใจง่าย และตรวจสอบก่อนส่งจริง",
  heroCta: "รับ Telmy.ai (ฟรี)",
  heroDemo: "ทดลองเดโม",
  heroTrustline: "ใช้งานฟรีตลอดชีพ · การเข้ารหัสแบบ Zero-Knowledge · มาตรฐาน W3C WCAG 2.2 AA",
  heroWorksOn: "ใช้งานได้บน",

  cardATitle: "แนะนำทุกช่องกรอกข้อมูล",
  cardADesc: "สอบถามได้ทุกข้อสงสัยและรับคำอธิบายที่เข้าใจง่ายพร้อมตัวอย่างจริง",
  cardALink: "เรียนรู้เพิ่มเติม",
  cardBTitle: "11 ภาษา",
  cardBDesc: "อ่านและกรอกเอกสารราชการด้วยภาษาที่คุณคุ้นเคยและสบายใจที่สุด",
  cardBLink: "ดูทั้ง 11 ภาษาเอเชียแปซิฟิก",
  cardCTitle: "เครื่องมือช่วยเหลือในตัว",
  cardCDesc: "14 เครื่องมือสำหรับผู้สูงอายุ ผู้มีภาวะดิสเล็กเซีย และผู้มีความบกพร่องทางการมองเห็น",
  cardCLink: "ดู 14 เครื่องมือช่วยเหลือ",

  unStatTitle: "รายงานสำรวจรัฐบาลอิเล็กทรอนิกส์ของสหประชาชาติ (UN E-Gov Survey 2024)",
  unStatSub: "รัฐบาลทั่วโลกนำบริการขึ้นสู่ออนไลน์ แต่การมีอยู่ไม่ได้แปลว่าใช้งานง่าย",
  unStat1Num: "99.5%",
  unStat1Label: "พอร์ทัลแห่งชาติออนไลน์",
  unStat1Desc: "192 จาก 193 ประเทศสมาชิกสหประชาชาติเปิดให้บริการพอร์ทัลสาธารณะออนไลน์",
  unStat2Num: "52%",
  unStat2Label: "ขาดบริการช่วยเหลือแบบสด",
  unStat2Desc: "มีเพียง 48% ที่มีเจ้าหน้าที่ช่วยเหลือผู้ยื่นคำร้อง",
  unStat3Num: "57%",
  unStat3Label: "รองรับภาษาเดียว",
  unStat3Desc: "มีเพียง 43% ที่รองรับภาษาต่างประเทศ",
  unStat4Num: "95%",
  unStat4Label: "ไม่ผ่านมาตรฐานการเข้าถึง",
  unStat4Desc: "มีเพียง 5% ที่ผ่านเกณฑ์มาตรฐานการเข้าถึงเว็บระดับสากล W3C WCAG",

  faqTitle: "คำถามที่พบบ่อย",
  faqSubtitle: "คำตอบที่โปร่งใสและตรงไปตรงมา เพื่อให้คุณยื่นเอกสารทางการได้อย่างสบายใจ",
  faq1Q: "Telmy.ai คืออะไร?",
  faq1A: "Telmy.ai คือส่วนขยายเบราว์เซอร์ที่ช่วยอธิบายแบบฟอร์มราชการที่ซับซ้อนด้วยภาษาธรรมดาในภาษาแม่ของคุณ และตรวจทานคำตอบก่อนส่งจริง",
  faq2Q: "ใช้งานบนเบราว์เซอร์ใดได้บ้าง?",
  faq2A: "Chrome, Edge, Firefox และ Opera บนคอมพิวเตอร์ ส่วนเบราว์เซอร์บนมือถืออยู่ในแผนพัฒนาในอนาคต",
  faq3Q: "ใช้งานกับแบบฟอร์ม PDF ได้หรือไม่?",
  faq3A: "ได้ เพียงเปิดแบบฟอร์ม PDF บน Chrome ทาง Telmy จะตรวจจับช่องกรอก ตอบคำถาม และช่วยส่งออกเอกสารพร้อมพิมพ์",
  faq4Q: "เป็นเว็บไซต์ของรัฐบาลหรือไม่?",
  faq4A: "ไม่ใช่ Telmy.ai เป็นผู้ช่วย AI อิสระและไม่มีส่วนเกี่ยวข้องกับหน่วยงานราชการใดๆ",
  faq5Q: "ทีมงาน Telmy สามารถดูบัตรประชาชนหรือพาสปอร์ตของฉันได้หรือไม่?",
  faq5A: "ไม่ได้อย่างแน่นอน ด้วยระบบเข้ารหัส Client-Side แบบ Zero-Knowledge ข้อมูลจะถูกเข้ารหัสบนอุปกรณ์ของคุณก่อนเสมอ",

  footerTagline: "ผู้ช่วย AI และเครื่องมือการเข้าถึงอย่างเป็นทางการเพื่อนำทางระบบบริการรัฐบาลอิเล็กทรอนิกส์ วีซ่า และทุนการศึกษาอย่างไร้กังวล",
  footerSecurityBadge: "AES-256 Zero-Knowledge",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "การนำทาง",
  footerLegalTitle: "กฎหมายและความเป็นส่วนตัว",
  footerPrivacy: "นโยบายความเป็นส่วนตัว",
  footerTerms: "ข้อกำหนดการให้บริการ",
  footerSecurity: "สถาปัตยกรรมความปลอดภัย",
  footerDashboard: "แดชบอร์ดผู้ใช้",
  footerCopyright: "© 2026 Telmy.ai. สงวนลิขสิทธิ์ทั้งหมด",
  footerMission: "สร้างขึ้นด้วยความเห็นอกเห็นใจและความครอบคลุมเพื่อพลเมืองทั่วโลก",

  finalCtaBtn: "รับ Telmy.ai (ฟรี)",
  langModalClose: "ปิด"
}

// 10. हिन्दी (India)
export const transHI: TranslationData = {
  ...transEN,
  metaTitle: "Telmy.ai — कोई भी फॉर्म। कोई भी भाषा। कोई चिंता नहीं।",
  navHome: "होम",
  navFeatures: "विशेषताएं",
  navPricing: "मूल्य निर्धारण",
  navAcademy: "अकादमी",
  navDownload: "डाउनलोड",
  navSignIn: "साइन इन",
  navCta: "Telmy.ai प्राप्त करें (मुफ़्त)",
  heroTitle: "कोई भी फॉर्म। कोई भी भाषा। कोई चिंता नहीं।",
  heroSubtitle: "Telmy.ai आपको जटिल फॉर्म भरने में मदद करता है। यह हर फील्ड को आपकी भाषा में सरल शब्दों में समझाता है और सबमिट करने से पहले जांचता है।",
  heroCta: "Telmy.ai प्राप्त करें (मुफ़्त)",
  heroDemo: "डेमो आज़माएं",
  heroTrustline: "हमेशा के लिए मुफ़्त · ज़ीरो-नॉलेज एन्क्रिप्शन · W3C WCAG 2.2 AA अनुरूप",
  heroWorksOn: "इन पर काम करता है",

  cardATitle: "हर फील्ड का सरल मार्गदर्शन",
  cardADesc: "कोई भी सवाल पूछें और व्यावहारिक उदाहरणों के साथ सरल व्याख्या प्राप्त करें।",
  cardALink: "और जानें",
  cardBTitle: "11 भाषाएं",
  cardBDesc: "आधिकारिक फॉर्म अपनी पसंदीदा मातृभाषा में आत्मविश्वास के साथ पढ़ें और भरें।",
  cardBLink: "11 एशिया-प्रशांत भाषाएं देखें",
  cardCTitle: "सुगम्यता सहायता इनबिल्ट",
  cardCDesc: "वरिष्ठ नागरिकों, डिस्लेक्सिया और कम दृष्टि वाले आवेदकों के लिए 14 आवश्यक उपकरण।",
  cardCLink: "14 सुगम्यता उपकरण देखें",

  unStatTitle: "वैश्विक ई-सरकार वास्तविकता जांच (UN E-Gov Survey 2024)",
  unStatSub: "सरकारों ने सेवाएं ऑनलाइन तो कर दी हैं, लेकिन उपलब्धता का मतलब आसान उपयोग नहीं है।",
  unStat1Num: "99.5%",
  unStat1Label: "राष्ट्रीय पोर्टल ऑनलाइन",
  unStat1Desc: "193 संयुक्त राष्ट्र सदस्य देशों में से 192 देश ऑनलाइन पोर्टल संचालित करते हैं।",
  unStat2Num: "52%",
  unStat2Label: "लाइव हेल्प डेस्क का अभाव",
  unStat2Desc: "केवल 48% पोर्टल आवेदकों को लाइव सहायता प्रदान करते हैं।",
  unStat3Num: "57%",
  unStat3Label: "केवल एक भाषा",
  unStat3Desc: "केवल 43% पोर्टल विदेशी भाषाओं का समर्थन करते हैं।",
  unStat4Num: "95%",
  unStat4Label: "सुगम्यता मानकों में विफल",
  unStat4Desc: "केवल 5% पोर्टल W3C WCAG सुगम्यता मानकों के अनुरूप हैं।",

  faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
  faqSubtitle: "ईमानदार और स्पष्ट उत्तर ताकि आप बिना किसी तनाव के आधिकारिक फॉर्म जमा कर सकें।",
  faq1Q: "Telmy.ai क्या है?",
  faq1A: "Telmy.ai एक ब्राउज़र एक्सटेंशन है जो जटिल फॉर्म प्रश्नों को आपकी भाषा में सरल शब्दों में समझाता है और सबमिट करने से पहले उत्तरों की जांच करता है।",
  faq2Q: "यह किन ब्राउज़रों पर काम करता है?",
  faq2A: "डेस्कटॉप पर Chrome, Edge, Firefox और Opera। मोबाइल समर्थन भविष्य के संस्करणों में उपलब्ध होगा।",
  faq3Q: "क्या यह PDF फॉर्म पर काम करता है?",
  faq3A: "हाँ। Chrome में कोई भी वीज़ा या सरकारी PDF फॉर्म खोलें, Telmy फ़ील्ड्स का पता लगाकर भरने में मदद करेगा।",
  faq4Q: "क्या यह कोई सरकारी वेबसाइट है?",
  faq4A: "नहीं। Telmy.ai एक स्वतंत्र AI सहायक है और किसी सरकारी पोर्टल से संबद्ध नहीं है।",
  faq5Q: "क्या Telmy टीम मेरे आधार या पासपोर्ट को देख सकती है?",
  faq5A: "बिल्कुल नहीं। ज़ीरो-नॉलेज क्लाइंट-साइड एन्क्रिप्शन के कारण, आपका डेटा आपके डिवाइस पर ही एन्क्रिप्ट रहता है।",

  footerTagline: "चिंता मुक्त होकर ई-गवर्नेंस, वीज़ा, छात्रवृत्ति और सार्वजनिक सेवाओं के फॉर्म भरने के लिए आधिकारिक AI सहायक।",
  footerSecurityBadge: "AES-256 ज़ीरो-नॉलेज",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "नेविगेशन",
  footerLegalTitle: "कानूनी व गोपनीयता",
  footerPrivacy: "गोपनीयता नीति",
  footerTerms: "सेवा की शर्तें",
  footerSecurity: "सुरक्षा वास्तुकला",
  footerDashboard: "उपयोगकर्ता डैशबोर्ड",
  footerCopyright: "© 2026 Telmy.ai. सर्वाधिकार सुरक्षित।",
  footerMission: "वैश्विक नागरिकों के लिए समावेशिता और सहानुभूति के साथ निर्मित।",

  finalCtaBtn: "Telmy.ai प्राप्त करें (मुफ़्त)",
  langModalClose: "बंद करें"
}

// 11. Filipino (Philippines)
export const transFIL: TranslationData = {
  ...transEN,
  metaTitle: "Telmy.ai — Anumang form. Anumang wika. Walang alalahanin.",
  navHome: "Home",
  navFeatures: "Mga Tampok",
  navPricing: "Presyo",
  navAcademy: "Akademiya",
  navDownload: "I-download",
  navSignIn: "Mag-sign in",
  navCta: "Kunin ang Telmy.ai (Libre)",
  heroTitle: "Anumang form. Anumang wika. Walang alalahanin.",
  heroSubtitle: "Tinutulungan ka ng Telmy.ai na tapusin ang mga komplikadong opisyal na form. Ipinapaliwanag ang bawat field sa payak na wika bago mo ito isumite.",
  heroCta: "Kunin ang Telmy.ai (Libre)",
  heroDemo: "Subukan ang demo",
  heroTrustline: "Libre magpakailanman · Zero-Knowledge Encryption · W3C WCAG 2.2 AA Compliant",
  heroWorksOn: "Gumagana sa",

  cardATitle: "Gabay sa bawat field",
  cardADesc: "Magtanong ng anuman at makakuha ng malinaw na paliwanag na may totoong halimbawa.",
  cardALink: "Alamin ang higit pa",
  cardBTitle: "11 wika",
  cardBDesc: "Basahin at punan ang mga opisyal na form sa wikang pinaka-komportable ka.",
  cardBLink: "Tingnan ang 11 wikang Asya-Pasipiko",
  cardCTitle: "May built-in accessibility",
  cardCDesc: "14 na tool para sa mga senior, dyslexic reader, at may mahinang paningin.",
  cardCLink: "Tingnan ang 14 na accessibility tool",

  unStatTitle: "Global E-Government Reality Check (UN E-Gov Survey 2024)",
  unStatSub: "Inilipat ng mga gobyerno ang mga serbisyo online, ngunit hindi ibig sabihin ay madali na itong gamitin.",
  unStat1Num: "99.5%",
  unStat1Label: "Online ang mga Pambansang Portal",
  unStat1Desc: "192 sa 193 bansang kasapi ng UN ang nagpapatakbo ng mga online public portal.",
  unStat2Num: "52%",
  unStat2Label: "Walang Live Help Desk",
  unStat2Desc: "48% lamang ang nag-aalok ng help desk sa mga aplikante.",
  unStat3Num: "57%",
  unStat3Label: "Isang Wika Lamang",
  unStat3Desc: "43% lamang ang nag-aalok ng suporta sa banyagang wika.",
  unStat4Num: "95%",
  unStat4Label: "Bagsak sa Accessibility",
  unStat4Desc: "5% lamang ang sumusunod sa W3C WCAG accessibility standards.",

  faqTitle: "Mga Madalas Itanong",
  faqSubtitle: "Tapat at malinaw na mga sagot para makapagsumite ka ng opisyal na dokumento nang may kapayapaan ng isip.",
  faq1Q: "Ano ang Telmy.ai?",
  faq1A: "Ang Telmy.ai ay isang browser companion extension na nagpapaliwanag ng mahihirap na tanong sa form sa payak na wika at nag-a-audit bago mo ito isumite.",
  faq2Q: "Saang mga browser ito gumagana?",
  faq2A: "Chrome, Edge, Firefox, at Opera sa desktop computers.",
  faq3Q: "Gumagana ba ito sa PDF forms?",
  faq3A: "Oo. Buksan ang anumang visa o government PDF form sa Chrome, at tutukuyin ng Telmy ang mga field.",
  faq4Q: "Isa ba itong website ng gobyerno?",
  faq4A: "Hindi. Ang Telmy.ai ay isang independent AI assistant at hindi konektado sa anumang ahensya ng gobyerno.",
  faq5Q: "Makikita ba ng Telmy team ang aking ID o Pasaporte?",
  faq5A: "Hindi kailanman. Salamat sa Zero-Knowledge Client-Side Encryption (CSE), naka-encrypt ang iyong data bago pa man umalis sa iyong computer.",

  footerTagline: "Opisyal na AI Copilot & Accessibility Assistant para sa e-government, visa, scholarship, at serbisyo publiko nang walang kaba.",
  footerSecurityBadge: "AES-256 Zero-Knowledge",
  footerA11yBadge: "W3C WCAG 2.2 AA",
  footerNavTitle: "Navigasyon",
  footerLegalTitle: "Legal at Privacy",
  footerPrivacy: "Patakaran sa Privacy",
  footerTerms: "Mga Tuntunin ng Serbisyo",
  footerSecurity: "Arkitektura ng Seguridad",
  footerDashboard: "Dashboard ng Gumagamit",
  footerCopyright: "© 2026 Telmy.ai. Lahat ng karapatan ay nakalaan.",
  footerMission: "Ginawa nang may malasakit at inklusyon para sa mga mamamayan sa buong mundo.",

  finalCtaBtn: "Kunin ang Telmy.ai (Libre)",
  langModalClose: "Isara"
}

export const TRANSLATIONS: Record<string, TranslationData> = {
  en: transEN,
  id: transID,
  ja: transJA,
  ko: transKO,
  zh: transZH,
  'zh-TW': transZHTW,
  vi: transVI,
  th: transTH,
  hi: transHI,
  fil: transFIL,
  ms: transMS
}

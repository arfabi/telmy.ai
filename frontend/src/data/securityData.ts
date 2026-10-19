export interface SecurityPillar {
  title: string;
  desc: string;
}

export interface SecurityPageTranslation {
  badge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroBadges: [string, string, string];
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillars: [SecurityPillar, SecurityPillar, SecurityPillar, SecurityPillar];
  playgroundBadge: string;
  playgroundTitle: string;
  playgroundSubtitle: string;
  rawFormHeader: string;
  resetBtn: string;
  runSanitizerBtn: string;
  cleanOutputHeader: string;
  statusBadgeActive: string;
  statusBadgeWaiting: string;
  vaultSimTitle: string;
  vaultSimSubtitle: string;
  vaultInputHeader: string;
  inputNameLabel: string;
  inputPassportLabel: string;
  inputPasswordLabel: string;
  inputPasswordHint: string;
  encryptBtn: string;
  dbPayloadHeader: string;
  dbPayloadTag: string;
  dbPayloadHint: string;
  complianceTitle: string;
  complianceSubtitle: string;
  privacyLinkText: string;
  termsLinkText: string;
}

export const SECURITY_TRANSLATIONS: Record<string, SecurityPageTranslation> = {
  en: {
    badge: "Zero-Knowledge & Privacy-First Architecture",
    heroTitle: "How Telmy protects your",
    heroTitleHighlight: "most sensitive data",
    heroSubtitle: "We mathematically ensure your identity credentials, passwords, and passport documents can never be read by Telmy engineers, database servers, or third-party brokers.",
    heroBadges: ["AES-256-GCM Client Encryption", "Zero Document Retention", "Client-Side PII Masking"],
    pillarsTitle: "Our 4 Non-Negotiable Security Commitments",
    pillarsSubtitle: "Official forms demand total trust. Here is the technical breakdown of how Telmy handles each layer of information.",
    pillars: [
      {
        title: "1. Client-Side Vault Encryption (AES-256-GCM)",
        desc: "Your stored profile data (name, address, date of birth) is encrypted right inside your browser using the native Web Crypto API with PBKDF2 (100,000 iterations) and AES-256-GCM. The decryption keys never leave your device. Telmy servers only store ciphertext."
      },
      {
        title: "2. Zero Document Storage (Ephemeral OCR)",
        desc: "When you upload an ID card, diploma, or passport for smart extraction, the document is processed in temporary browser memory. Once canonical fields are extracted into your encrypted vault, the original binary file is permanently erased. No document archives exist."
      },
      {
        title: "3. Client-Side PII Masking Before Cloud AI",
        desc: "To explain a confusing form question, Telmy only transmits the question label, surrounding instructions, and page structure to Google Gemini. All personal identity values (passport numbers, phone numbers, NIK) are masked client-side before any network packet is dispatched."
      },
      {
        title: "4. Strict Exclusion of Passwords & Financial Inputs",
        desc: "Telmy is hard-coded to ignore authentication fields. Input tags with type=\"password\", CVV codes, credit card numbers, OTPs, and bank PINs are never captured, never suggested for AutoFill, and never logged."
      }
    ],
    playgroundBadge: "Interactive Security Playground",
    playgroundTitle: "Test the Telmy Client-Side Sanitizer",
    playgroundSubtitle: "Try running our client-side regex and PII filter below. See how private identifiers and credentials get stripped before anything can ever reach an AI model.",
    rawFormHeader: "RAW INCOMING WEB FORM (IN YOUR BROWSER)",
    resetBtn: "Reset Sample",
    runSanitizerBtn: "Run Client-Side Sanitizer",
    cleanOutputHeader: "CLEAN SANITIZED PAYLOAD (SENT TO GEMINI AI)",
    statusBadgeActive: "Masked & Safe",
    statusBadgeWaiting: "Ready to Test",
    vaultSimTitle: "Experience Zero-Knowledge Database Storage",
    vaultSimSubtitle: "See how your credentials look inside Telmy Firestore database compared to your browser screen.",
    vaultInputHeader: "1. YOUR BROWSER CLIENT (PLAIN SIGHT)",
    inputNameLabel: "Full Name",
    inputPassportLabel: "Passport Number",
    inputPasswordLabel: "Your Master Password",
    inputPasswordHint: "Never sent across the network. Used solely for PBKDF2 key derivation.",
    encryptBtn: "Encrypt & Sync to Cloud DB →",
    dbPayloadHeader: "2. GOOGLE CLOUD FIRESTORE VAULT PAYLOAD",
    dbPayloadTag: "Pure AES-256-GCM Ciphertext",
    dbPayloadHint: "Zero Plaintext: Neither Telmy administrators nor Google Cloud engineers can read your name, ID, or passport numbers from this payload. The decryption key exists solely on your local device.",
    complianceTitle: "Compliant with Chrome Web Store & Mozilla AMO Policies",
    complianceSubtitle: "Telmy adheres to the Principle of Least Privilege. We request only the permissions strictly required to read field labels and assist your typing.",
    privacyLinkText: "Read Full Privacy Policy",
    termsLinkText: "Read Terms of Service"
  },
  id: {
    badge: "Arsitektur Zero-Knowledge & Privasi Utama",
    heroTitle: "Bagaimana Telmy melindungi",
    heroTitleHighlight: "data Anda yang paling sensitif",
    heroSubtitle: "Secara matematis kami menjamin data identitas, kata sandi, dan dokumen paspor Anda tidak akan pernah bisa dibaca oleh tim Telmy, server database, maupun pihak ketiga.",
    heroBadges: ["Enkripsi Klien AES-256-GCM", "Nol Penyimpanan Dokumen", "Penyamaran PII Sisi Klien"],
    pillarsTitle: "4 Komitmen Keamanan Mutlak Kami",
    pillarsSubtitle: "Formulir resmi menuntut kepercayaan total. Inilah rincian teknis bagaimana Telmy melindungi setiap lapisan informasi Anda.",
    pillars: [
      {
        title: "1. Enkripsi Brankas Sisi Klien (AES-256-GCM)",
        desc: "Data profil Anda (nama, alamat, tanggal lahir) dienkripsi langsung di browser menggunakan Web Crypto API dengan PBKDF2 (100.000 iterasi) dan AES-256-GCM. Kunci dekripsi tidak pernah keluar dari perangkat Anda. Server Telmy hanya menyimpan ciphertext yang tak terbaca."
      },
      {
        title: "2. Nol Penyimpanan Dokumen (OCR Fana)",
        desc: "Saat Anda mengunggah KTP, ijazah, atau paspor untuk ekstraksi data, dokumen diproses di memori RAM sementara. Setelah bidang tersimpan ke brankas terenkripsi, file asli langsung dimusnahkan secara permanen tanpa arsip apa pun."
      },
      {
        title: "3. Penyamaran Identitas Sebelum Mengirim ke AI",
        desc: "Untuk menjelaskan pertanyaan formulir yang rumit, Telmy hanya mengirimkan label pertanyaan dan konteks umum ke Google Gemini. Seluruh nilai pribadi (nomor paspor, NIK, nomor telepon) otomatis disamarkan di sisi klien sebelum paket data dikirim."
      },
      {
        title: "4. Pengecualian Mutlak Password & Data Finansial",
        desc: "Telmy dirancang dengan kode keras untuk mengabaikan kolom rahasia. Tag input type=\"password\", nomor kartu kredit, kode CVV, OTP, dan PIN perbankan tidak akan pernah dibaca, tidak pernah disimpan, dan tidak pernah dicatat."
      }
    ],
    playgroundBadge: "Playground Keamanan Interaktif",
    playgroundTitle: "Uji Pembersih Data Sisi Klien Telmy",
    playgroundSubtitle: "Coba jalankan filter regex dan sensor PII kami di bawah ini. Saksikan bagaimana data rahasia disingkirkan sebelum mencapai model AI.",
    rawFormHeader: "DATA FORMULIR MENTAH DI BROWSER ANDA",
    resetBtn: "Reset Data Sampel",
    runSanitizerBtn: "Jalankan Pembersih Sisi Klien",
    cleanOutputHeader: "HASIL DATA AMAN (YANG DIKIRIM KE AI GEMINI)",
    statusBadgeActive: "Tersamarkan & Aman",
    statusBadgeWaiting: "Siap Diuji",
    vaultSimTitle: "Rasakan Penyimpanan Database Zero-Knowledge",
    vaultSimSubtitle: "Bandingkan apa yang Anda lihat di layar browser dengan apa yang sebenarnya tersimpan di server database Telmy Firestore.",
    vaultInputHeader: "1. PERANGKAT BROWSER ANDA (TEKS ASLI)",
    inputNameLabel: "Nama Lengkap",
    inputPassportLabel: "Nomor Paspor",
    inputPasswordLabel: "Kata Sandi Master Anda",
    inputPasswordHint: "Tidak pernah dikirim lewat internet. Hanya dipakai untuk turunan kunci lokal PBKDF2.",
    encryptBtn: "Enkripsi & Sinkronkan ke Database Cloud →",
    dbPayloadHeader: "2. DATA YANG TERSIMPAN DI GOOGLE CLOUD FIRESTORE",
    dbPayloadTag: "Ciphertext Murni AES-256-GCM",
    dbPayloadHint: "Nol Teks Asli: Tim administrator Telmy maupun insinyur Google Cloud tidak dapat membaca nama, ID, atau nomor paspor Anda. Kunci dekripsi hanya ada di perangkat lokal Anda.",
    complianceTitle: "Sesuai Standar Chrome Web Store & Kebijakan Mozilla AMO",
    complianceSubtitle: "Telmy menerapkan Prinsip Hak Akses Terendah (Least Privilege). Kami hanya meminta izin yang mutlak diperlukan untuk membaca label formulir.",
    privacyLinkText: "Baca Kebijakan Privasi Lengkap",
    termsLinkText: "Baca Syarat Layanan"
  },
  ms: {
    badge: "Seni Bina Sifar Pengetahuan & Privasi Didahulukan",
    heroTitle: "Bagaimana Telmy melindungi",
    heroTitleHighlight: "data paling sensitif anda",
    heroSubtitle: "Kami memastikan data pengenalan, kata laluan dan dokumen pasport anda tidak dapat dibaca oleh jurutera Telmy, pelayan pangkalan data, atau pihak ketiga.",
    heroBadges: ["Penyulitan Pelanggan AES-256-GCM", "Sifar Simpanan Dokumen", "Penyamaran PII Setempat"],
    pillarsTitle: "4 Komitmen Keselamatan Mutlak Kami",
    pillarsSubtitle: "Borang rasmi memerlukan kepercayaan penuh. Ini perincian teknikal bagaimana Telmy mengendalikan data anda.",
    pillars: [
      {
        title: "1. Penyulitan Peti Sisi Pelanggan (AES-256-GCM)",
        desc: "Data profil anda disulitkan dalam penyemak imbas menggunakan Web Crypto API dengan PBKDF2 dan AES-256-GCM. Kunci penyahsulitan tidak pernah meninggalkan peranti anda."
      },
      {
        title: "2. Sifar Simpanan Dokumen (OCR Sementara)",
        desc: "Dokumen yang dimuat naik diproses dalam memori RAM sementara. Setelah selesai, fail asal dipadam kekal tanpa sebarang salinan arkib."
      },
      {
        title: "3. Penyamaran Data Peribadi Sebelum AI Awan",
        desc: "Telmy hanya menghantar teks soalan umum kepada AI. Segala maklumat peribadi seperti kad pengenalan dan pasport disamarkan secara setempat."
      },
      {
        title: "4. Pengecualian Ketat Kata Laluan & Data Kewangan",
        desc: "Medan kata laluan, kad kredit, CVV dan nombor OTP disekat sepenuhnya secara kekal dan tidak pernah direkodkan."
      }
    ],
    playgroundBadge: "Kawasan Ujian Keselamatan Interaktif",
    playgroundTitle: "Uji Penapis Data Telmy",
    playgroundSubtitle: "Lihat bagaimana penapis regex kami menyingkirkan nombor kad pengenalan dan kata laluan sebelum data dihantar ke model AI.",
    rawFormHeader: "DATA BORANG ASAL PADA PENYEMAK IMBAS ANDA",
    resetBtn: "Tetapkan Semula Sampel",
    runSanitizerBtn: "Jalankan Penapis Sisi Pelanggan",
    cleanOutputHeader: "DATA BERSIH DISARING (DIHANTAR KE AI)",
    statusBadgeActive: "Disamarkan & Selamat",
    statusBadgeWaiting: "Sedia Diuji",
    vaultSimTitle: "Alami Storan Pangkalan Data Sifar Pengetahuan",
    vaultSimSubtitle: "Bandingkan apa yang kelihatan pada skrin anda dengan teks tersulit yang disimpan di pelayan Telmy.",
    vaultInputHeader: "1. PENYEMAK IMBAS ANDA (TEKS BIASA)",
    inputNameLabel: "Nama Penuh",
    inputPassportLabel: "Nombor Pasport",
    inputPasswordLabel: "Kata Laluan Induk Anda",
    inputPasswordHint: "Tidak pernah dihantar ke internet. Digunakan secara setempat untuk kunci PBKDF2.",
    encryptBtn: "Sulitkan & Segerakkan ke Pangkalan Data →",
    dbPayloadHeader: "2. DATA TERSIMPAN DALAM GOOGLE CLOUD FIRESTORE",
    dbPayloadTag: "Teks Tersulit AES-256-GCM Tulen",
    dbPayloadHint: "Sifar Teks Biasa: Tiada sesiapa yang boleh membaca nama atau dokumen anda daripada muatan tersulit ini.",
    complianceTitle: "Mematuhi Dasar Chrome Web Store & Mozilla AMO",
    complianceSubtitle: "Telmy mengamalkan Prinsip Keistimewaan Paling Sedikit untuk memastikan privasi anda terpelihara.",
    privacyLinkText: "Baca Dasar Privasi Penuh",
    termsLinkText: "Baca Syarat Perkhidmatan"
  },
  ja: {
    badge: "ゼロノレッジ＆プライバシー重視のセキュリティ設計",
    heroTitle: "Telmyがお客様の",
    heroTitleHighlight: "最も重要な個人情報を保護する仕組み",
    heroSubtitle: "お客様の身分証明書情報、パスワード、パスポート番号は、Telmyのエンジニア、サーバー管理者、第三者機関であっても数学的に解読できない仕組みになっています。",
    heroBadges: ["端末内AES-256-GCM暗号化", "書類データの即時破棄", "端末側PIIマスキング"],
    pillarsTitle: "妥協のない4つのセキュリティ公約",
    pillarsSubtitle: "公式申請には絶対的な安心が求められます。Telmyがどのように各レイヤーで情報を保護しているかを解説します。",
    pillars: [
      {
        title: "1. 端末内完結の保管庫暗号化 (AES-256-GCM)",
        desc: "お客様のプロフィール情報は、端末内のWeb Crypto APIを用いてPBKDF2（10万回計算）およびAES-256-GCMで暗号化されます。復号鍵が端末外へ送信されることはなく、サーバーには暗号文のみが保存されます。"
      },
      {
        title: "2. 書類データの即時破棄 (オンメモリOCR)",
        desc: "身分証やパスポートをアップロードして読み取る際、処理はブラウザの一時メモリ内でのみ実行されます。暗号化保管庫への保存が完了した瞬間、元のファイルデータは永久に消去されます。"
      },
      {
        title: "3. クラウドAI送信前の個人識別情報マスキング",
        desc: "難解な設問の解説を生成する際、Telmyは質問文と画面上の説明文のみをGoogle Geminiへ送信します。パスポート番号や電話番号などの実データは、送信前に端末側で自動的にマスクされます。"
      },
      {
        title: "4. パスワードおよび金融情報の完全除外",
        desc: "type=\"password\"属性の入力欄、クレジットカード番号、CVV、暗証番号、ワンタイムパスワード（OTP）はハードコードされた規則により自動的に除外され、記録されることはありません。"
      }
    ],
    playgroundBadge: "インタラクティブ・セキュリティ体験",
    playgroundTitle: "クライアントサイド・サニタイザーの動作テスト",
    playgroundSubtitle: "ブラウザ上で動作する正規表現フィルターをお試しください。個人情報や認証情報がAIモデルへ送信される前にどのように除去されるかをご確認いただけます。",
    rawFormHeader: "ブラウザ上の生データ（元のウェブフォーム）",
    resetBtn: "サンプルをリセット",
    runSanitizerBtn: "クライアント側サニタイザーを実行",
    cleanOutputHeader: "サニタイズ済みデータ（Gemini AIへの送信内容）",
    statusBadgeActive: "マスキング完了・安全",
    statusBadgeWaiting: "テスト可能",
    vaultSimTitle: "ゼロノレッジ・データベース保存の仕組み",
    vaultSimSubtitle: "お客様の画面に表示されている情報と、TelmyのFirestoreデータベースに実際に保存される暗号文の違いをご覧ください。",
    vaultInputHeader: "1. お客様のブラウザ上（平文表示）",
    inputNameLabel: "氏名",
    inputPassportLabel: "パスポート番号",
    inputPasswordLabel: "マスターパスワード",
    inputPasswordHint: "ネットワーク経由で送信されることはありません。端末内でのPBKDF2鍵生成にのみ使用されます。",
    encryptBtn: "暗号化してクラウドDBに同期 →",
    dbPayloadHeader: "2. GOOGLE CLOUD FIRESTOREに保存されるデータ",
    dbPayloadTag: "完全なAES-256-GCM暗号文",
    dbPayloadHint: "平文データゼロ: Telmyの開発者であっても、この暗号文から氏名やパスポート番号を読み取ることは不可能です。復号鍵はお客様の端末にのみ存在します。",
    complianceTitle: "Chrome ウェブストアおよび Mozilla AMO ポリシー準拠",
    complianceSubtitle: "Telmyは最小権限の原則を徹底し、入力欄の読み取りに必要な最小限の権限のみを要求します。",
    privacyLinkText: "プライバシーポリシー全文を読む",
    termsLinkText: "利用規約を読む"
  },
  ko: {
    badge: "영지식(Zero-Knowledge) 및 프라이버시 우선 아키텍처",
    heroTitle: "Telmy가 고객의",
    heroTitleHighlight: "가장 민감한 데이터를 보호하는 방법",
    heroSubtitle: "사용자의 신원 정보, 비밀번호, 여권 문서는 Telmy 엔지니어, 데이터베이스 서버, 제3자 중개업체 그 누구도 수학적으로 열람할 수 없도록 설계되었습니다.",
    heroBadges: ["기기 내 AES-256-GCM 암호화", "서류 데이터 즉시 영구 삭제", "기기 측 PII 마스킹"],
    pillarsTitle: "Telmy의 타협 없는 4대 보안 원칙",
    pillarsSubtitle: "공식 서식 작성에는 절대적인 신뢰가 필요합니다. Telmy가 각 단계에서 정보를 안전하게 처리하는 기술적 방식을 소개합니다.",
    pillars: [
      {
        title: "1. 클라이언트 기기 내 보관함 암호화 (AES-256-GCM)",
        desc: "프로필 데이터는 브라우저 내부 Web Crypto API를 통해 PBKDF2 및 AES-256-GCM으로 암호화됩니다. 복호화 키는 절대 기기 밖으로 유출되지 않으며 서버에는 암호문만 저장됩니다."
      },
      {
        title: "2. 문서 보관 제로 (일회성 메모리 OCR)",
        desc: "신분증이나 여권을 업로드할 때 파일은 브라우저 임시 메모리에서만 처리됩니다. 암호화 보관함에 항목이 입력되는 즉시 원본 파일은 흔적 없이 영구 삭제됩니다."
      },
      {
        title: "3. 클라우드 AI 전송 전 기기 내 개인식별정보 마스킹",
        desc: "어려운 질문을 해설하기 위해 Telmy는 문항 텍스트만 Google Gemini에 전송합니다. 여권번호, 주민등록번호, 연락처 등 고유 식별자는 전송 전 기기 내부에서 자동 가림 처리됩니다."
      },
      {
        title: "4. 비밀번호 및 금융 데이터 완벽 차단",
        desc: "type=\"password\" 속성의 필드, 신용카드 번호, CVC/CVV, 금융 OTP는 하드코딩된 규칙에 의해 원천적으로 무시되며 결코 기록되지 않습니다."
      }
    ],
    playgroundBadge: "인터랙티브 보안 체험관",
    playgroundTitle: "Telmy 클라이언트 필터링 시뮬레이터",
    playgroundSubtitle: "브라우저에서 작동하는 실시간 개인정보 필터를 직접 실행해 보세요. 민감한 정보가 AI에 전송되기 전 어떻게 안전하게 제거되는지 확인할 수 있습니다.",
    rawFormHeader: "브라우저 화면의 원본 서식 데이터",
    resetBtn: "샘플 초기화",
    runSanitizerBtn: "클라이언트 필터 실행",
    cleanOutputHeader: "정제된 안전 데이터 (Gemini AI 전송 데이터)",
    statusBadgeActive: "마스킹 완료 및 안전",
    statusBadgeWaiting: "테스트 준비 완료",
    vaultSimTitle: "영지식 데이터베이스 저장 체험",
    vaultSimSubtitle: "브라우저 화면에 보이는 내용과 Telmy Firestore 데이터베이스에 실제로 저장되는 암호문 데이터를 비교해 보세요.",
    vaultInputHeader: "1. 사용자 브라우저 클라이언트 (평문)",
    inputNameLabel: "성명",
    inputPassportLabel: "여권 번호",
    inputPasswordLabel: "마스터 비밀번호",
    inputPasswordHint: "네트워크로 전송되지 않으며 로컬 기기의 PBKDF2 키 생성에만 사용됩니다.",
    encryptBtn: "암호화 및 클라우드 DB 동기화 →",
    dbPayloadHeader: "2. GOOGLE CLOUD FIRESTORE 저장 데이터",
    dbPayloadTag: "순수 AES-256-GCM 암호문",
    dbPayloadHint: "평문 제로: Telmy 관리자나 클라우드 엔지니어도 이 암호문에서 실제 정보를 읽어낼 수 없습니다. 복호화 키는 사용자의 로컬 기기에만 존재합니다.",
    complianceTitle: "Chrome 웹 스토어 및 Mozilla AMO 정책 준수",
    complianceSubtitle: "Telmy는 최소 권한 원칙을 준수하여 필요한 권한만을 투명하게 요청합니다.",
    privacyLinkText: "개인정보 처리방침 전문 보기",
    termsLinkText: "이용약관 보기"
  },
  zh: {
    badge: "零知识（Zero-Knowledge）与隐私至上架构",
    heroTitle: "Telmy 如何守护您",
    heroTitleHighlight: "最为敏感的核心资料",
    heroSubtitle: "我们从数学层面确保您的身份凭证、密码与护照文件绝不会被 Telmy 工程师、数据库服务器或第三方机构窥探。",
    heroBadges: ["客户端 AES-256-GCM 加密", "零文件留存粉碎机制", "本地 PII 敏感信息脱敏"],
    pillarsTitle: "我们绝不妥协的 4 大安全承诺",
    pillarsSubtitle: "官方申报需要百分之百的信任。以下是 Telmy 保护各层级信息的具体技术细节。",
    pillars: [
      {
        title: "1. 客户端保险箱本地加密 (AES-256-GCM)",
        desc: "您的档案资料在浏览器中直接通过 Web Crypto API 调用 PBKDF2（10万次运算）与 AES-256-GCM 进行端到端加密。解密密钥永不离机，Telmy 服务器仅保存无法解读的密文。"
      },
      {
        title: "2. 零文件留存 (内存即时 OCR)",
        desc: "上传证件或护照时，解析过程仅在浏览器临时内存中进行。识别项写入加密保险箱后，原始文件即刻在物理层面彻底擦除，绝不建立任何文件归档。"
      },
      {
        title: "3. 发往云端 AI 前的本地敏感信息脱敏",
        desc: "为解读复杂问题，Telmy 仅向 Google Gemini 传输字段标题与说明文本。护照号、身份证号、手机号等所有真实隐私值在数据发出前均已在本地完成自动脱敏遮盖。"
      },
      {
        title: "4. 硬编码屏蔽密码与金融敏感输入",
        desc: "type=\"password\" 密码框、信用卡号、CVV 安全码、网银 PIN 码及动态验证码均在底层规则中被直接忽略，绝不捕获，绝不建议，绝不记录。"
      }
    ],
    playgroundBadge: "交互式安全实验台",
    playgroundTitle: "测试 Telmy 客户端敏感数据脱敏器",
    playgroundSubtitle: "亲身体验在本地运行的正则脱敏机制。观察私密证件与敏感字段如何在触及 AI 之前被安全剔除。",
    rawFormHeader: "您浏览器中的原始网页表单数据",
    resetBtn: "重置示例",
    runSanitizerBtn: "运行本地脱敏过滤器",
    cleanOutputHeader: "脱敏后的安全数据（发往 Gemini AI）",
    statusBadgeActive: "已脱敏且安全",
    statusBadgeWaiting: "准备测试",
    vaultSimTitle: "零知识数据库存储体验",
    vaultSimSubtitle: "对比您屏幕上看到的真实明文，与 Telmy Firestore 数据库中实际存储的端到端密文。",
    vaultInputHeader: "1. 您的本地浏览器客户端（明文视窗）",
    inputNameLabel: "姓名",
    inputPassportLabel: "护照号码",
    inputPasswordLabel: "您的主控密码",
    inputPasswordHint: "绝不通过网络发送。仅在本地用于派生 PBKDF2 解密密钥。",
    encryptBtn: "加密并同步到云端数据库 →",
    dbPayloadHeader: "2. GOOGLE CLOUD FIRESTORE 中的实际存储载荷",
    dbPayloadTag: "纯粹的 AES-256-GCM 密文字符串",
    dbPayloadHint: "零明文：无论 Telmy 管理员还是 Google Cloud 工程师，均无法从此载荷反推您的真实资料。解密密钥仅存在于您的个人设备上。",
    complianceTitle: "严格遵循 Chrome 应用商店及 Mozilla 开发者安全规范",
    complianceSubtitle: "Telmy 恪守最小权限原则，仅申请读取表单字段说明所必需的核心权限。",
    privacyLinkText: "阅读完整隐私权政策",
    termsLinkText: "阅读服务条款"
  },
  'zh-TW': {
    badge: "零知識（Zero-Knowledge）與隱私第一安全架構",
    heroTitle: "Telmy 如何嚴格保護您",
    heroTitleHighlight: "最為敏感的核心個人隱私",
    heroSubtitle: "我們從數學演算法層面確保您的身分憑證、密碼與護照文件絕不會被 Telmy 工程師、資料庫主機或第三方機構窺探。",
    heroBadges: ["用戶端 AES-256-GCM 加密", "零檔案留存粉碎機制", "本機 PII 機敏資訊遮蔽"],
    pillarsTitle: "我們絕不妥協的 4 大資安承諾",
    pillarsSubtitle: "官方申請需要百分之百的信任。以下為 Telmy 守護每一層資訊流的技術解析。",
    pillars: [
      {
        title: "1. 用戶端保險箱本機加密 (AES-256-GCM)",
        desc: "您的常用檔案在瀏覽器中直接透過 Web Crypto API 採用 PBKDF2（10萬次運算）與 AES-256-GCM 進行本機端加密。解密金鑰絕不離開裝置，Telmy 伺服器僅儲存無法解讀的密文。"
      },
      {
        title: "2. 零檔案留存 (記憶體暫存 OCR)",
        desc: "上傳證件或護照時，解析僅於暫存記憶體中執行。欄位萃取並存入加密保險箱後，原始圖檔立即徹底永久粉碎，絕無備份檔案。"
      },
      {
        title: "3. 傳送至雲端 AI 前之本機隱私去識別化",
        desc: "為解說複雜題目，Telmy 僅將題目與提示字串傳送給 Google Gemini。護照號碼、身分證字號、電話等機敏數值在送出前均已於本機自動替換遮蔽。"
      },
      {
        title: "4. 硬編碼嚴密屏蔽密碼與金融輸入欄位",
        desc: "type=\"password\" 欄位、信用卡號、CVV 檢查碼、網銀 PIN 碼與動態驗證碼（OTP）均受底層架構完全忽略，絕不擷取、絕不記錄。"
      }
    ],
    playgroundBadge: "互動式資安體驗區",
    playgroundTitle: "測試 Telmy 用戶端資料過濾器",
    playgroundSubtitle: "親自體驗於瀏覽器運行的過濾機制。觀察身分字號與密碼如何在接觸 AI 前被徹底剔除。",
    rawFormHeader: "瀏覽器中的原始表單資料",
    resetBtn: "重設範本",
    runSanitizerBtn: "執行本機過濾器",
    cleanOutputHeader: "過濾後之安全酬載（傳送至 Gemini AI）",
    statusBadgeActive: "已遮蔽且安全",
    statusBadgeWaiting: "隨時可測試",
    vaultSimTitle: "零知識資料庫儲存體驗",
    vaultSimSubtitle: "比較您螢幕上的明文顯示，與 Telmy Firestore 資料庫中實際存放的密文差異。",
    vaultInputHeader: "1. 您的本地瀏覽器用戶端（明文顯示）",
    inputNameLabel: "姓名",
    inputPassportLabel: "護照號碼",
    inputPasswordLabel: "您的主控密碼",
    inputPasswordHint: "絕不傳輸至網際網路。僅於本機用於 PBKDF2 金鑰衍生。",
    encryptBtn: "加密並同步至雲端資料庫 →",
    dbPayloadHeader: "2. GOOGLE CLOUD FIRESTORE 實際儲存酬載",
    dbPayloadTag: "純粹之 AES-256-GCM 密文字串",
    dbPayloadHint: "零明文：無論 Telmy 開發團隊或雲端工程師，皆無法從此密文中解讀您的身分資料。解密金鑰僅存在於您的裝置中。",
    complianceTitle: "嚴格遵循 Chrome 線上應用程式商店與 Mozilla AMO 規範",
    complianceSubtitle: "Telmy 恪遵最小權限原則，僅請求輔助填表所不可或缺的權限。",
    privacyLinkText: "閱讀完整隱私權政策",
    termsLinkText: "閱讀服務條款"
  },
  vi: {
    badge: "Kiến trúc Không-Tri-Thức (Zero-Knowledge) & Ưu tiên Quyền riêng tư",
    heroTitle: "Cách Telmy bảo vệ",
    heroTitleHighlight: "dữ liệu nhạy cảm nhất của bạn",
    heroSubtitle: "Chúng tôi đảm bảo thông tin danh tính, mật khẩu và hộ chiếu của bạn không bao giờ có thể bị đọc bởi kỹ sư Telmy, máy chủ cơ sở dữ liệu hay bên thứ ba.",
    heroBadges: ["Mã hóa Thiết bị AES-256-GCM", "Không lưu trữ Tài liệu", "Mặt nạ PII phía Thiết bị"],
    pillarsTitle: "4 Cam kết Bảo mật Không Thể Thỏa hiệp",
    pillarsSubtitle: "Biểu mẫu chính thức đòi hỏi sự tin tưởng tuyệt đối. Dưới đây là cơ chế kỹ thuật cách Telmy xử lý thông tin của bạn.",
    pillars: [
      {
        title: "1. Mã hóa Két sắt Phía Thiết bị (AES-256-GCM)",
        desc: "Dữ liệu hồ sơ của bạn được mã hóa ngay trong trình duyệt bằng Web Crypto API và AES-256-GCM. Khóa giải mã không bao giờ rời khỏi máy của bạn. Máy chủ Telmy chỉ lưu trữ văn bản mã hóa."
      },
      {
        title: "2. Không lưu trữ Tài liệu (OCR Tạm thời)",
        desc: "Khi tải lên hộ chiếu hoặc chứng chỉ, tài liệu chỉ được xử lý trong RAM tạm. Khi hoàn tất trích xuất, tệp gốc bị hủy vĩnh viễn ngay lập tức."
      },
      {
        title: "3. Che giấu Định danh trước khi gửi tới AI",
        desc: "Telmy chỉ gửi nhãn câu hỏi đến AI. Toàn bộ số định danh cá nhân (số hộ chiếu, CMND, số điện thoại) được che phủ cục bộ trước khi truyền đi."
      },
      {
        title: "4. Loại trừ Tuyệt đối Mật khẩu & Thẻ Ngân hàng",
        desc: "Các ô mật khẩu, thẻ tín dụng, CVV và mã OTP được lập trình bỏ qua tuyệt đối và không bao giờ được ghi lại."
      }
    ],
    playgroundBadge: "Khu vực Thử nghiệm Bảo mật Tương tác",
    playgroundTitle: "Kiểm tra Bộ Lọc Dữ liệu Cục bộ Telmy",
    playgroundSubtitle: "Trải nghiệm bộ lọc regex chạy ngay trên trình duyệt để thấy thông tin cá nhân được làm sạch như thế nào.",
    rawFormHeader: "DỮ LIỆU BIỂU MẪU GỐC TRÊN TRÌNH DUYỆT CỦA BẠN",
    resetBtn: "Đặt lại Mẫu",
    runSanitizerBtn: "Chạy Bộ Lọc Cục Bộ",
    cleanOutputHeader: "DỮ LIỆU AN TOÀN ĐÃ LÀM SẠCH (GỬI ĐẾN GEMINI AI)",
    statusBadgeActive: "Đã Che giấu & An toàn",
    statusBadgeWaiting: "Sẵn sàng Thử nghiệm",
    vaultSimTitle: "Trải nghiệm Lưu trữ Cơ sở Dữ liệu Zero-Knowledge",
    vaultSimSubtitle: "Xem dữ liệu của bạn hiển thị thế nào trên màn hình so với những gì lưu trên máy chủ Telmy.",
    vaultInputHeader: "1. TRÌNH DUYỆT CỦA BẠN (VĂN BẢN GỐC)",
    inputNameLabel: "Họ và Tên",
    inputPassportLabel: "Số Hộ chiếu",
    inputPasswordLabel: "Mật khẩu Chính của Bạn",
    inputPasswordHint: "Không bao giờ gửi qua internet. Chỉ dùng để tạo khóa mã hóa cục bộ.",
    encryptBtn: "Mã hóa & Đồng bộ lên Cloud DB →",
    dbPayloadHeader: "2. DỮ LIỆU LƯU TẠI GOOGLE CLOUD FIRESTORE",
    dbPayloadTag: "Văn bản Mã hóa AES-256-GCM",
    dbPayloadHint: "Không Văn bản Gốc: Không ai có thể đọc tên hoặc hộ chiếu của bạn từ dữ liệu mã hóa này.",
    complianceTitle: "Tuân thủ Chính sách Chrome Web Store & Mozilla AMO",
    complianceSubtitle: "Telmy áp dụng nguyên tắc cấp quyền tối thiểu nghiêm ngặt.",
    privacyLinkText: "Đọc Chính sách Quyền riêng tư",
    termsLinkText: "Đọc Điều khoản Dịch vụ"
  },
  th: {
    badge: "สถาปัตยกรรม Zero-Knowledge และความเป็นส่วนตัวสูงสุด",
    heroTitle: "วิธีที่ Telmy ปกป้อง",
    heroTitleHighlight: "ข้อมูลสำคัญที่สุดของคุณ",
    heroSubtitle: "เรารับประกันด้วยหลักคณิตศาสตร์ว่าข้อมูลประจำตัว รหัสผ่าน และเอกสารของคุณจะไม่สามารถอ่านได้โดยทีมงาน Telmy หรือบุคคลที่สาม",
    heroBadges: ["การเข้ารหัส AES-256-GCM บนอุปกรณ์", "ไม่เก็บเอกสารต้นฉบับ", "การซ่อนข้อมูลส่วนบุคคลบนอุปกรณ์"],
    pillarsTitle: "4 คำมั่นสัญญาด้านความปลอดภัยที่ไม่อาจต่อรองได้",
    pillarsSubtitle: "แบบฟอร์มทางการต้องการความไว้วางใจสูงสุด นี่คือรายละเอียดทางเทคนิคในการปกป้องข้อมูลของคุณ",
    pillars: [
      {
        title: "1. การเข้ารหัสตู้นิรภัยบนอุปกรณ์ (AES-256-GCM)",
        desc: "ข้อมูลโปรไฟล์ของคุณได้รับการเข้ารหัสภายในเบราว์เซอร์ด้วย Web Crypto API และ AES-256-GCM กุญแจถอดรหัสจะไม่มีวันออกจากอุปกรณ์ของคุณ เซิร์ฟเวอร์จะเก็บเฉพาะข้อความที่เข้ารหัสแล้วเท่านั้น"
      },
      {
        title: "2. ไม่เก็บเอกสารต้นฉบับ (OCR ในหน่วยความจำชั่วคราว)",
        desc: "เมื่ออัปโหลดเอกสาร ข้อมูลจะถูกประมวลผลใน RAM ชั่วคราว เมื่อดึงข้อมูลเสร็จสิ้น ไฟล์ต้นฉบับจะถูกลบทิ้งถาวรทันที"
      },
      {
        title: "3. ซ่อนข้อมูลส่วนบุคคลก่อนส่งไปยังระบบ AI",
        desc: "Telmy ส่งเฉพาะข้อความคำถามไปยัง Google Gemini ข้อมูลส่วนบุคคลทั้งหมดจะถูกปกปิดในเครื่องก่อนส่งข้อมูลเสมอ"
      },
      {
        title: "4. ละเว้นรหัสผ่านและข้อมูลทางการเงินอย่างเด็ดขาด",
        desc: "ช่องรหัสผ่าน บัตรเครดิต CVV และรหัส OTP จะถูกข้ามและไม่ถูกบันทึกอย่างแน่นอน"
      }
    ],
    playgroundBadge: "สนามทดลองความปลอดภัยเชิงโต้ตอบ",
    playgroundTitle: "ทดสอบตัวกรองข้อมูลส่วนบุคคลของ Telmy",
    playgroundSubtitle: "ทดลองใช้งานตัวกรองบนเบราว์เซอร์เพื่อดูว่าข้อมูลส่วนบุคคลถูกลบออกอย่างปลอดภัยก่อนถึงโมเดล AI อย่างไร",
    rawFormHeader: "ข้อมูลแบบฟอร์มดิบบนเบราว์เซอร์ของคุณ",
    resetBtn: "รีเซ็ตตัวอย่าง",
    runSanitizerBtn: "เรียกใช้ตัวกรองบนอุปกรณ์",
    cleanOutputHeader: "ข้อมูลที่ผ่านการกรองอย่างปลอดภัย (ส่งไปยัง Gemini AI)",
    statusBadgeActive: "ปกปิดและปลอดภัย",
    statusBadgeWaiting: "พร้อมทดสอบ",
    vaultSimTitle: "สัมผัสประสบการณ์การจัดเก็บแบบ Zero-Knowledge",
    vaultSimSubtitle: "เปรียบเทียบสิ่งที่คุณเห็นบนหน้าจอกับสิ่งที่ถูกบันทึกจริงในฐานข้อมูล Telmy",
    vaultInputHeader: "1. เบราว์เซอร์ของคุณ (ข้อความจริง)",
    inputNameLabel: "ชื่อ-นามสกุล",
    inputPassportLabel: "หมายเลขหนังสือเดินทาง",
    inputPasswordLabel: "รหัสผ่านหลักของคุณ",
    inputPasswordHint: "ไม่เคยส่งผ่านอินเทอร์เน็ต ใช้สำหรับสร้างกุญแจในเครื่องเท่านั้น",
    encryptBtn: "เข้ารหัสและซิงค์ไปยัง Cloud DB →",
    dbPayloadHeader: "2. ข้อมูลที่บันทึกใน GOOGLE CLOUD FIRESTORE",
    dbPayloadTag: "ข้อความเข้ารหัส AES-256-GCM ล้วน",
    dbPayloadHint: "ไม่มีข้อความจริง: ไม่มีใครสามารถอ่านชื่อหรือหนังสือเดินทางของคุณจากข้อมูลนี้ได้",
    complianceTitle: "ปฏิบัติตามนโยบายของ Chrome Web Store และ Mozilla AMO",
    complianceSubtitle: "Telmy ยึดมั่นในหลักการให้สิทธิ์ขั้นต่ำที่จำเป็นเท่านั้น",
    privacyLinkText: "อ่านนโยบายความเป็นส่วนตัวฉบับเต็ม",
    termsLinkText: "อ่านข้อกำหนดในการให้บริการ"
  },
  hi: {
    badge: "शून्य-ज्ञान (Zero-Knowledge) और गोपनीयता-प्रथम वास्तुकला",
    heroTitle: "Telmy कैसे सुरक्षित रखता है आपका",
    heroTitleHighlight: "सबसे संवेदनशील डेटा",
    heroSubtitle: "हम गणितीय रूप से सुनिश्चित करते हैं कि आपकी पहचान, पासवर्ड और पासपोर्ट दस्तावेज़ Telmy इंजीनियरों या किसी तीसरे पक्ष द्वारा कभी नहीं पढ़े जा सकते।",
    heroBadges: ["क्लाइंट-साइड AES-256-GCM एन्क्रिप्शन", "शून्य दस्तावेज़ प्रतिधारण", "डिवाइस-साइड PII मास्किंग"],
    pillarsTitle: "हमारी 4 गैर-परक्राम्य सुरक्षा प्रतिबद्धताएं",
    pillarsSubtitle: "आधिकारिक फॉर्मों के लिए पूर्ण विश्वास की आवश्यकता होती है। यहाँ इसका तकनीकी विवरण दिया गया है।",
    pillars: [
      {
        title: "1. क्लाइंट-साइड वॉल्ट एन्क्रिप्शन (AES-256-GCM)",
        desc: "आपका प्रोफ़ाइल डेटा सीधे आपके ब्राउज़र में Web Crypto API और AES-256-GCM का उपयोग करके एन्क्रिप्ट किया जाता है। डिक्रिप्शन कुंजी आपके डिवाइस को कभी नहीं छोड़ती।"
      },
      {
        title: "2. शून्य दस्तावेज़ प्रतिधारण (अस्थायी OCR)",
        desc: "दस्तावेज़ अस्थायी रैम में संसाधित होते हैं। निष्कर्षण पूरा होने के बाद, मूल फ़ाइल स्थायी रूप से हटा दी जाती है।"
      },
      {
        title: "3. क्लाउड एआई से पहले व्यक्तिगत पहचान मास्किंग",
        desc: "Telmy केवल गैर-संवेदनशील प्रश्न टेक्स्ट भेजता है। सभी व्यक्तिगत पहचान डेटा भेजने से पहले स्थानीय रूप से मास्क कर दिए जाते हैं।"
      },
      {
        title: "4. पासवर्ड और वित्तीय इनपुट का सख्त बहिष्करण",
        desc: "पासवर्ड, क्रेडिट कार्ड नंबर, सीवीवी और ओटीपी फ़ील्ड को पूरी तरह से अनदेखा किया जाता है और कभी रिकॉर्ड नहीं किया जाता।"
      }
    ],
    playgroundBadge: "इंटरैक्टिव सुरक्षा परीक्षण क्षेत्र",
    playgroundTitle: "Telmy क्लाइंट-साइड सैनिटाइज़र का परीक्षण करें",
    playgroundSubtitle: "देखें कि कैसे संवेदनशील डेटा एआई मॉडल तक पहुंचने से पहले सुरक्षित रूप से हटा दिया जाता है।",
    rawFormHeader: "आपके ब्राउज़र में कच्चा फॉर्म डेटा",
    resetBtn: "रीसेट करें",
    runSanitizerBtn: "सैनिटाइज़र चलाएँ",
    cleanOutputHeader: "सैनिटाइज़ किया गया सुरक्षित डेटा (AI को भेजा गया)",
    statusBadgeActive: "सुरक्षित और मास्क किया गया",
    statusBadgeWaiting: "परीक्षण के लिए तैयार",
    vaultSimTitle: "शून्य-ज्ञान डेटाबेस संग्रहण का अनुभव करें",
    vaultSimSubtitle: "देखें कि आपकी स्क्रीन पर दिखने वाला डेटा डेटाबेस में संग्रहीत डेटा से कैसे भिन्न होता है।",
    vaultInputHeader: "1. आपका ब्राउज़र (साधारण पाठ)",
    inputNameLabel: "पूरा नाम",
    inputPassportLabel: "पासपोर्ट संख्या",
    inputPasswordLabel: "आपका मास्टर पासवर्ड",
    inputPasswordHint: "नेटवर्क पर कभी नहीं भेजा जाता। केवल स्थानीय कुंजी के लिए उपयोग किया जाता है।",
    encryptBtn: "एन्क्रिप्ट करें और क्लाउड डीबी में सिंक करें →",
    dbPayloadHeader: "2. GOOGLE CLOUD FIRESTORE में संग्रहीत डेटा",
    dbPayloadTag: "शुद्ध AES-256-GCM सिफरटेक्स्ट",
    dbPayloadHint: "शून्य सादा पाठ: कोई भी इस डेटा से आपका नाम या पासपोर्ट नहीं पढ़ सकता है।",
    complianceTitle: "Chrome Web Store और Mozilla AMO नीतियों के अनुरूप",
    complianceSubtitle: "Telmy कम से कम विशेषाधिकार के सिद्धांत का पालन करता है।",
    privacyLinkText: "पूरी गोपनीयता नीति पढ़ें",
    termsLinkText: "सेवा की शर्तें पढ़ें"
  },
  fil: {
    badge: "Zero-Knowledge & Privacy-First Architecture",
    heroTitle: "Paano pinoprotektahan ng Telmy ang iyong",
    heroTitleHighlight: "pinakasensitibong impormasyon",
    heroSubtitle: "Tinitiyak namin sa matematika na ang iyong mga kredensyal, password, at pasaporte ay hindi kailanman mababasa ng mga inhinyero ng Telmy o ng mga third-party broker.",
    heroBadges: ["Client-Side AES-256-GCM Encryption", "Zero Document Retention", "Local PII Masking"],
    pillarsTitle: "Ang Aming 4 na Pangunahing Pangako sa Seguridad",
    pillarsSubtitle: "Nangangailangan ng buong tiwala ang mga opisyal na form. Narito ang teknikal na paraan kung paano pinoprotektahan ng Telmy ang iyong data.",
    pillars: [
      {
        title: "1. Client-Side Vault Encryption (AES-256-GCM)",
        desc: "Ang data ng iyong profile ay naka-encrypt mismo sa iyong browser gamit ang Web Crypto API at AES-256-GCM. Ang decryption key ay hindi kailanman umaalis sa iyong device."
      },
      {
        title: "2. Walang Imbak na Dokumento (Pansamantalang OCR)",
        desc: "Pinoproseso ang mga na-upload na dokumento sa pansamantalang RAM. Kapag na-extract na ang data, ang orihinal na file ay agad at permanenteng binubura."
      },
      {
        title: "3. Pagtatago ng Personal na Data Bago ang Cloud AI",
        desc: "Ipinapadala lamang ng Telmy ang mga teksto ng tanong sa AI. Ang lahat ng personal na ID ay awtomatikong itinatago bago ipadala."
      },
      {
        title: "4. Mahigpit na Pagbubukod sa mga Password at Pinansyal na Input",
        desc: "Ang mga field ng password, credit card, CVV, at OTP ay ganap na hindi pinapansin at hindi kailanman nire-record."
      }
    ],
    playgroundBadge: "Interactive Security Playground",
    playgroundTitle: "Subukan ang Telmy Client-Side Sanitizer",
    playgroundSubtitle: "Tingnan kung paano tinatanggal ang mga pribadong ID bago pa man umabot ang data sa isang modelo ng AI.",
    rawFormHeader: "ORIHINAL NA FORM SA IYONG BROWSER",
    resetBtn: "I-reset ang Sample",
    runSanitizerBtn: "Patakbuhin ang Sanitizer",
    cleanOutputHeader: "LIGTAS NA DATA (IPINADALA SA GEMINI AI)",
    statusBadgeActive: "Naitago & Ligtas",
    statusBadgeWaiting: "Handa nang Subukan",
    vaultSimTitle: "Damhin ang Zero-Knowledge Database Storage",
    vaultSimSubtitle: "Paghambingin ang nakikita mo sa iyong screen at ang aktwal na naka-encrypt na data sa server ng Telmy.",
    vaultInputHeader: "1. IYONG BROWSER (PLAIN TEXT)",
    inputNameLabel: "Buong Pangalan",
    inputPassportLabel: "Numero ng Pasaporte",
    inputPasswordLabel: "Iyong Master Password",
    inputPasswordHint: "Hindi ipinapadala sa network. Ginagamit lamang sa iyong device.",
    encryptBtn: "I-encrypt & I-sync sa Cloud DB →",
    dbPayloadHeader: "2. NAKA-ENCRYPT NA DATA SA GOOGLE CLOUD FIRESTORE",
    dbPayloadTag: "Puro AES-256-GCM Ciphertext",
    dbPayloadHint: "Zero Plaintext: Walang sinuman ang makakabasa ng iyong pangalan o ID mula sa naka-encrypt na data na ito.",
    complianceTitle: "Sumusunod sa Mga Patakaran ng Chrome Web Store at Mozilla AMO",
    complianceSubtitle: "Sumusunod ang Telmy sa Prinsipyo ng Least Privilege para sa iyong kaligtasan.",
    privacyLinkText: "Basahin ang Buong Patakaran sa Privacy",
    termsLinkText: "Basahin ang Mga Tuntunin ng Serbisyo"
  }
};

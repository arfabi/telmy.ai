import { LucideIcon } from 'lucide-react'

export interface CoreCardStep {
  title: string
  desc: string
}

export interface CoreCardTexts {
  badge: string
  mainTitle: string
  mainSubtitle: string
  clickExpand: string
  clickFullDemo: string
  p1Badge: string
  p1Title: string
  p1Desc: string
  p1Footer: string
  p2Badge: string
  p2Title: string
  p2Desc: string
  p2Footer: string
  p3Badge: string
  p3Title: string
  p3Desc: string
  p3Footer: string
  tl1: string
  tl2: string
  tl3: string
  bannerTitle: string
  bannerDesc: string
  bannerBtn: string
  modalHowTitle: string
  modalPrivTitle: string
  modalCta: string
  modalRecording: string
  p1ModalTitle: string
  p1ModalSub: string
  p1ModalBadge: string
  p1Steps: CoreCardStep[]
  p1Security: string
  p2ModalTitle: string
  p2ModalSub: string
  p2ModalBadge: string
  p2Steps: CoreCardStep[]
  p2Security: string
  p3ModalTitle: string
  p3ModalSub: string
  p3ModalBadge: string
  p3Steps: CoreCardStep[]
  p3Security: string
}

export const CORE_CARDS_I18N: Record<string, CoreCardTexts> = {
  en: {
    badge: "Core Pillars",
    mainTitle: "One companion. Three jobs.",
    mainSubtitle: "Click any card to inspect the full interactive demonstration and security details.",
    clickExpand: "Click to expand",
    clickFullDemo: "Click to view full demonstration",
    p1Badge: "Pillar 1",
    p1Title: "Understand",
    p1Desc: "Get a plain-language explanation of every field, with examples, legal definitions, and common pitfalls — written or spoken aloud in your native language.",
    p1Footer: "Forms Guide & Context Explainer",
    p2Badge: "Pillar 2",
    p2Title: "Complete",
    p2Desc: "Upload your ID, passport, or certificate once. Telmy reads it client-side into an encrypted vault and auto-fills matching fields across complex portals in 1 click.",
    p2Footer: "Smart Vault & 1-Click AutoFill",
    p3Badge: "Pillar 3",
    p3Title: "Check",
    p3Desc: "Before you click submit on the official portal, Telmy flags missed mandatory fields, inconsistent dates, and high-risk errors to prevent costly rejections.",
    p3Footer: "Built-in Form Auditor & Pre-check",
    tl1: "Name matches passport identity",
    tl2: "Date format: change DD/MM to YYYY/MM/DD",
    tl3: "Mandatory signature field is required",
    bannerTitle: "Looking for Voice Mode, Accessibility Hub & PDF Imports?",
    bannerDesc: "Discover all 14 accessibility profiles, client-side encryption, and complete feature matrix.",
    bannerBtn: "Explore All Features",
    modalHowTitle: "How it works in your browser:",
    modalPrivTitle: "Privacy & Zero Retention Guarantee",
    modalCta: "Get Telmy Extension Free",
    modalRecording: "Real interactive recording from Telmy Chrome Side Panel",
    p1ModalTitle: "Pillar 1: Understand Every Field in Context",
    p1ModalSub: "Eliminate anxiety with plain-language explanations, official legal definitions, examples, and native voice audio.",
    p1ModalBadge: "Form Explainer & Voice Guidance",
    p1Steps: [
      { title: "1. Click or Focus on Any Field", desc: "Telmy identifies the field context, official embassy guideline, and surrounding labels automatically." },
      { title: "2. Plain Language Explanation", desc: "Ambiguous legal terms (e.g., 'Apostille', 'Stay Period', 'Inviting Party') are translated into simple, everyday language." },
      { title: "3. Real Examples & Common Pitfalls", desc: "See exactly what a valid entry looks like (Latin letters vs Katakana, date order YYYY/MM/DD) to avoid immediate rejections." },
      { title: "4. Voice Assistance Mode", desc: "Listen to explanations spoken aloud in your native language (11 JAPAC neural voices available)." }
    ],
    p1Security: "Only field instructions and labels are parsed. Personal values entered are masked client-side before any contextual request is made.",
    p2ModalTitle: "Pillar 2: Complete Complex Forms with 1-Click AutoFill",
    p2ModalSub: "Upload identity documents once. Extract canonical data into your local encrypted vault and auto-fill multi-step forms in seconds.",
    p2ModalBadge: "Smart Vault & Canonical Autofill",
    p2Steps: [
      { title: "1. One-Time Identity OCR", desc: "Upload your Passport, National ID, or Diploma. AI extracts verified details and deletes the original file immediately from memory." },
      { title: "2. Client-Side Vault Encryption", desc: "Your profile is sealed with AES-256-GCM. The encryption key lives strictly on your device." },
      { title: "3. 1-Click Smart Matching", desc: "Telmy matches 20+ canonical fields (given name, surname, passport expiry, issuance country) across government portals." },
      { title: "4. Zero Authentication Capture", desc: "Passwords, credit card CVVs, and banking PINs are strictly blacklisted and never captured or filled." }
    ],
    p2Security: "Zero-knowledge storage: Telmy servers only store encrypted ciphertext. Decryption occurs strictly inside your browser session.",
    p3ModalTitle: "Pillar 3: Pre-Submission Traffic Light Auditor",
    p3ModalSub: "A thorough pre-flight audit that catches typos, missed mandatory fields, and format errors before you press submit.",
    p3ModalBadge: "Pre-flight Validator & Safety Audit",
    p3Steps: [
      { title: "1. Mandatory Field Verification (Red Flag)", desc: "Flags blank required fields and unsigned declaration checkboxes before the portal rejects your application." },
      { title: "2. Date & Format Mismatch (Yellow Warning)", desc: "Warns you when a date is entered in DD/MM instead of the requested YYYY/MM/DD, or when passport numbers include spaces." },
      { title: "3. Name & Identity Consistency (Green Check)", desc: "Verifies that the spelling of your full name matches your official passport identity record." },
      { title: "4. Confidence Before Final Submission", desc: "Telmy gives you peace of mind so you never have to pay repeat fees or suffer visa processing delays." }
    ],
    p3Security: "Audits run locally in the browser DOM. No human review or manual data inspection takes place."
  },
  id: {
    badge: "Pilar Utama",
    mainTitle: "Satu pendamping. Tiga tugas penting.",
    mainSubtitle: "Klik kartu mana saja untuk melihat simulasi interaktif lengkap dan jaminan keamanan.",
    clickExpand: "Klik untuk perbesar",
    clickFullDemo: "Klik untuk melihat demonstrasi penuh",
    p1Badge: "Pilar 1",
    p1Title: "Pahami",
    p1Desc: "Dapatkan penjelasan bahasa sehari-hari untuk setiap kolom, contoh pengisian, istilah hukum, dan kesalahan umum — tertulis atau disuarakan dalam bahasa ibu Anda.",
    p1Footer: "Panduan Formulir & Penjelas Konteks",
    p2Badge: "Pilar 2",
    p2Title: "Lengkapi",
    p2Desc: "Unggah KTP, paspor, atau ijazah sekali saja. AI mengekstrak data ke brankas terenkripsi lokal dan mengisi formulir multi-langkah dalam 1 kali klik.",
    p2Footer: "Brankas Cerdas & 1-Klik AutoFill",
    p3Badge: "Pilar 3",
    p3Title: "Periksa",
    p3Desc: "Sebelum klik kirim pada portal resmi, Telmy memeriksa kolom wajib yang terlewat, format tanggal tidak cocok, dan potensi kesalahan fatal.",
    p3Footer: "Auditor Formulir & Pemeriksaan Awal",
    tl1: "Nama cocok dengan identitas paspor",
    tl2: "Format tanggal: sesuaikan HH/BB ke TTTT/BB/HH",
    tl3: "Kolom tanda tangan wajib diisi",
    bannerTitle: "Mencari Mode Suara, Pusat Aksesibilitas & Impor PDF?",
    bannerDesc: "Temukan 14 profil aksesibilitas, enkripsi di sisi klien, dan matriks fitur lengkap.",
    bannerBtn: "Jelajahi Semua Fitur",
    modalHowTitle: "Cara kerjanya di browser Anda:",
    modalPrivTitle: "Jaminan Privasi & Tanpa Penyimpanan Dokumen",
    modalCta: "Pasang Ekstensi Telmy Gratis",
    modalRecording: "Rekaman interaktif asli dari Chrome Side Panel Telmy",
    p1ModalTitle: "Pilar 1: Pahami Setiap Kolom Berdasarkan Konteks",
    p1ModalSub: "Hilangkan kecemasan dengan penjelasan bahasa lugas, definisi resmi, contoh nyata, dan panduan suara lokal.",
    p1ModalBadge: "Penjelas Formulir & Panduan Suara",
    p1Steps: [
      { title: "1. Klik atau Arahkan Kursor ke Kolom Mana Saja", desc: "Telmy secara otomatis mengidentifikasi konteks pertanyaan, panduan resmi kedutaan, dan instruksi di sekitarnya." },
      { title: "2. Penjelasan Bahasa Sederhana", desc: "Istilah birokrasi rumit (misal 'Apostille', 'Masa Tinggal', 'Pihak Pengundang') diterjemahkan ke dalam bahasa sehari-hari yang mudah dimengerti." },
      { title: "3. Contoh Nyata & Kesalahan Umum", desc: "Ketahui format penulisan yang benar (huruf Latin vs karakter khusus, urutan tanggal) agar tidak langsung ditolak sistem." },
      { title: "4. Mode Suara Alami", desc: "Dengarkan penjelasan dibacakan dengan suara alami dalam bahasa ibu Anda (tersedia 11 suara resmi Asia-Pasifik)." }
    ],
    p1Security: "Hanya teks instruksi dan nama kolom yang diproses. Nilai data pribadi Anda disamarkan di browser sebelum dikirim untuk analisis AI.",
    p2ModalTitle: "Pilar 2: Lengkapi Formulir Rumit dengan 1-Klik AutoFill",
    p2ModalSub: "Cukup unggah dokumen identitas sekali. Data tersimpan di brankas terenkripsi perangkat Anda dan mengisi puluhan kolom dalam sekejap.",
    p2ModalBadge: "Brankas Pintar & Pengisian Otomatis",
    p2Steps: [
      { title: "1. Ekstraksi Dokumen Sekali Jalan (OCR)", desc: "Unggah paspor, KTP, atau ijazah. AI mengekstrak data penting dan langsung menghapus file asli secara permanen dari memori." },
      { title: "2. Enkripsi Lokal Berstandar Militer", desc: "Data profil Anda disegel dengan enkripsi AES-256-GCM. Kunci dekripsi hanya tersimpan di perangkat lokal Anda." },
      { title: "3. Pencocokan Cerdas 1-Klik", desc: "Telmy mencocokkan 20+ bidang data standar pada portal pemerintah secara otomatis." },
      { title: "4. Perlindungan Kata Sandi & Finansial", desc: "Password, CVV kartu kredit, dan PIN rekening secara otomatis diabaikan dan tidak pernah disimpan." }
    ],
    p2Security: "Penyimpanan Zero-Knowledge: Server cloud Telmy hanya menyimpan ciphertext yang terkunci rapat.",
    p3ModalTitle: "Pilar 3: Auditor Lampu Lalu Lintas Sebelum Submit",
    p3ModalSub: "Pemeriksaan pra-pengiriman mendalam untuk mencegah penolakan dokumen, penundaan visa, atau biaya pengajuan ulang.",
    p3ModalBadge: "Pemeriksa Pra-Kirim & Audit Keamanan",
    p3Steps: [
      { title: "1. Verifikasi Kolom Wajib (Lampu Merah)", desc: "Mendeteksi kolom penting yang masih kosong atau persetujuan yang belum dicentang sebelum Anda mengirimkannya." },
      { title: "2. Format Tanggal & Angka (Lampu Kuning)", desc: "Memberi peringatan jika format tanggal terbalik (misal format AS vs Asia) atau nomor identitas mengandung spasi." },
      { title: "3. Keselarasan Nama Paspor (Lampu Hijau)", desc: "Memastikan ejaan nama lengkap cocok persis dengan dokumen resmi paspor Anda." },
      { title: "4. Ketenangan Saat Mengirim", desc: "Kirim formulir resmi Anda dengan rasa percaya diri tanpa takut salah ketik." }
    ],
    p3Security: "Proses audit berjalan langsung di browser pengguna tanpa ada pemeriksaan manual oleh pihak ketiga."
  },
  ms: {
    badge: "Teras Utama",
    mainTitle: "Satu pendamping. Tiga tugas utama.",
    mainSubtitle: "Klik mana-mana kad untuk melihat demonstrasi interaktif penuh dan jaminan keselamatan.",
    clickExpand: "Klik untuk besarkan",
    clickFullDemo: "Klik untuk lihat demonstrasi penuh",
    p1Badge: "Teras 1",
    p1Title: "Fahami",
    p1Desc: "Dapatkan penerangan bahasa harian yang mudah untuk setiap medan, contoh pengisian, dan istilah undang-undang dalam bahasa ibunda anda.",
    p1Footer: "Panduan Borang & Penerang Konteks",
    p2Badge: "Teras 2",
    p2Title: "Lengkapkan",
    p2Desc: "Muat naik MyKad, pasport, atau sijil sekali sahaja. Telmy mengekstrak ke peti selamat tersulit dan mengisi borang dalam 1 klik.",
    p2Footer: "Peti Pintar & 1-Klik AutoFill",
    p3Badge: "Teras 3",
    p3Title: "Semak",
    p3Desc: "Sebelum klik hantar pada portal rasmi, Telmy memeriksa medan wajib yang tertinggal, tarikh tidak sepadan, dan kesilapan berisiko.",
    p3Footer: "Juruaudit Borang & Pra-Semakan",
    tl1: "Nama sepadan dengan identiti pasport",
    tl2: "Format tarikh: tukar HH/BB kepada TTTT/BB/HH",
    tl3: "Medan tandatangan mandatori diperlukan",
    bannerTitle: "Mencari Mod Suara, Pusat Kebolehcapaian & Import PDF?",
    bannerDesc: "Temui kesemua 14 profil kebolehcapaian, penyulitan sisi pelanggan, dan matriks ciri penuh.",
    bannerBtn: "Terokai Semua Ciri",
    modalHowTitle: "Bagaimana ia berfungsi dalam penyemak imbas anda:",
    modalPrivTitle: "Jaminan Privasi & Sifar Simpanan Dokumen",
    modalCta: "Dapatkan Sambungan Telmy Percuma",
    modalRecording: "Rakaman interaktif sebenar daripada Panel Sisi Chrome Telmy",
    p1ModalTitle: "Teras 1: Fahami Setiap Medan Mengikut Konteks",
    p1ModalSub: "Hilangkan keraguan dengan penjelasan bahasa mudah, takrifan rasmi, contoh sebenar, dan panduan suara.",
    p1ModalBadge: "Penerang Borang & Panduan Suara",
    p1Steps: [
      { title: "1. Klik Mana-mana Medan", desc: "Telmy mengenal pasti konteks soalan dan panduan rasmi secara automatik." },
      { title: "2. Penerangan Bahasa Mudah", desc: "Istilah undang-undang yang rumit diterjemahkan ke dalam bahasa harian yang ringkas." },
      { title: "3. Contoh Nyata & Kesilapan Biasa", desc: "Ketahui format yang betul untuk mengelakkan permohonan ditolak serta-merta." },
      { title: "4. Mod Bantuan Suara", desc: "Dengar penjelasan dibacakan dalam bahasa ibunda anda secara semula jadi." }
    ],
    p1Security: "Hanya arahan dan label medan diproses. Maklumat peribadi disamarkan terlebih dahulu di peringkat tempatan.",
    p2ModalTitle: "Teras 2: Lengkapkan Borang Rumit dengan 1-Klik AutoFill",
    p2ModalSub: "Muat naik dokumen pengenalan sekali. Data disimpan dalam peti selamat tersulit anda untuk mengisi berpuluh medan sepantas kilat.",
    p2ModalBadge: "Peti Pintar & Pengisian Automatik",
    p2Steps: [
      { title: "1. OCR Dokumen Sekali Sahaja", desc: "Muat naik pasport atau kad pengenalan. AI mengekstrak data penting dan memadam fail asal serta-merta." },
      { title: "2. Penyulitan Peti Sisi Pelanggan", desc: "Profil anda dilindungi dengan AES-256-GCM. Kunci penyahsulitan hanya ada pada peranti anda." },
      { title: "3. Padanan Pintar 1-Klik", desc: "Telmy memadankan 20+ medan data piawai pada portal rasmi secara automatik." },
      { title: "4. Tiada Tangkapan Kata Laluan", desc: "Kata laluan dan kad kredit disekat secara mutlak dan tidak pernah disimpan." }
    ],
    p2Security: "Storan Sifar Pengetahuan: Pelayan Telmy hanya menyimpan data tersulit yang tidak boleh dibaca.",
    p3ModalTitle: "Teras 3: Juruaudit Lampu Isyarat Sebelum Hantar",
    p3ModalSub: "Pemeriksaan rapi sebelum penghantaran bagi mengelakkan penolakan dokumen dan bayaran permohonan semula.",
    p3ModalBadge: "Pengesah Pra-Hantar & Audit Keselamatan",
    p3Steps: [
      { title: "1. Pengesahan Medan Wajib (Lampu Merah)", desc: "Mengesan medan wajib yang masih kosong sebelum portal rasmi menolak permohonan anda." },
      { title: "2. Ketidakpadanan Tarikh (Lampu Kuning)", desc: "Memberi amaran jika format tarikh terbalik atau nombor dokumen mengandungi ruang." },
      { title: "3. Ketepatan Ejaan Nama (Lampu Hijau)", desc: "Mengesahkan ejaan nama penuh anda sepadan tepat dengan dokumen pasport." },
      { title: "4. Keyakinan Sebelum Menghantar", desc: "Hantar permohonan anda dengan tenang tanpa rasa bimbang tentang kesilapan kecil." }
    ],
    p3Security: "Audit dijalankan secara setempat dalam penyemak imbas tanpa sebarang pemeriksaan manual pihak ketiga."
  },
  ja: {
    badge: "コア機能",
    mainTitle: "ひとつの拡張機能で、3つの安心。",
    mainSubtitle: "各カードをクリックして、拡大デモと安全設計の詳細をご確認ください。",
    clickExpand: "クリックして拡大",
    clickFullDemo: "クリックして全体デモを表示",
    p1Badge: "柱 1",
    p1Title: "理解する",
    p1Desc: "難解な公的用語や申請項目の意味を、分かりやすい母国語のテキストや音声で解説します。",
    p1Footer: "フォーム項目ガイド＆文脈解説",
    p2Badge: "柱 2",
    p2Title: "入力する",
    p2Desc: "身分証明書を一度アップロードするだけで、端末内暗号化保管庫から安全に1クリック自動入力します。",
    p2Footer: "スマート保管庫＆ワンクリック自動入力",
    p3Badge: "柱 3",
    p3Title: "確認する",
    p3Desc: "公的ポータルで最終送信する前に、必須項目の抜け漏れや日付フォーマットの誤りを信号機カラーで監査します。",
    p3Footer: "提出前スマート監査機能",
    tl1: "パスポートの氏名表記と一致",
    tl2: "日付形式：YYYY/MM/DDに変更を推奨",
    tl3: "署名確認欄が未入力です",
    bannerTitle: "音声モードや14のアクセシビリティツールをお探しですか？",
    bannerDesc: "全14種類の閲覧支援機能、端末内暗号化、詳細な機能比較をご確認いただけます。",
    bannerBtn: "全機能を見る",
    modalHowTitle: "ブラウザでの動作手順：",
    modalPrivTitle: "プライバシーとデータ非保持の約束",
    modalCta: "Telmy 拡張機能を無料入手",
    modalRecording: "Chrome サイドパネルでの実際の画面録画",
    p1ModalTitle: "柱 1：あらゆる入力項目を分かりやすく理解",
    p1ModalSub: "難解な公式要件を、身近な母国語の解説とクリアな音声案内で解決します。",
    p1ModalBadge: "項目解説＆音声ガイド",
    p1Steps: [
      { title: "1. 任意の項目をクリック", desc: "大使館や行政機関の公式ガイドラインをもとに、その項目の目的をAIが自動把握します。" },
      { title: "2. 平易な言葉で解説", desc: "「アポスティーユ」や「在留資格理由」などの専門法律用語をかみ砕いて説明します。" },
      { title: "3. 記入例と注意点", desc: "ローマ字表記の順序や日付の書式など、リジェクトを防ぐ正しい記入例を表示します。" },
      { title: "4. 自然な音声アシスト", desc: "アジア太平洋11言語の自然なニューラル音声で読み上げが可能です。" }
    ],
    p1Security: "指示文と項目ラベルのみを解析します。個人情報は端末側でマスクされた後でのみ処理されます。",
    p2ModalTitle: "柱 2：複雑なフォームも1クリックで正確に入力",
    p2ModalSub: "公的証明書から情報を抽出し、ブラウザ内のAES-256暗号化保管庫から瞬時に自動入力します。",
    p2ModalBadge: "スマート暗号保管庫＆自動入力",
    p2Steps: [
      { title: "1. 1回限りの書類読み取り (OCR)", desc: "パスポートや身分証を読み取り後、元ファイルはメモリから即座に完全消去されます。" },
      { title: "2. 端末内 AES-256-GCM 暗号化", desc: "データはお客様のパソコン内でのみ暗号化・復号され、外部に平文が漏れることはありません。" },
      { title: "3. 20項目以上のスマート照合", desc: "氏名、生年月日、有効期限などの主要項目を行政ポータルに一括入力します。" },
      { title: "4. パスワード等の完全除外", desc: "パスワードやクレジットカード番号、暗証番号は一切取得・入力されません。" }
    ],
    p2Security: "ゼロ知識設計：Telmyサーバーには暗号化された文字データのみが保存されます。",
    p3ModalTitle: "柱 3：提出前の信号機エラー監査",
    p3ModalSub: "記入漏れやフォーマットの不一致を提出前にチェックし、再申請の手間や手数料の無駄を防ぎます。",
    p3ModalBadge: "提出前セーフティ監査",
    p3Steps: [
      { title: "1. 必須項目の未入力検知（赤ランプ）", desc: "必須入力漏れや同意チェックボックスの未選択を送信前に警告します。" },
      { title: "2. 書式・日付形式の検証（黄ランプ）", desc: "年/月/日の並び順の違いやパスポート番号の空白文字を検知します。" },
      { title: "3. パスポート名との一致確認（緑ランプ）", desc: "登録データと証明書のスペルが完全に一致しているかを照合します。" },
      { title: "4. 自信を持って申請完了", desc: "記入ミスによる却下の不安を解消し、安心して申請手続きを完了できます。" }
    ],
    p3Security: "監査処理はお使いのブラウザ内で行われ、第三者による手動閲覧は一切ありません。"
  },
  ko: {
    badge: "핵심 기능",
    mainTitle: "하나의 AI 조력자. 3가지 완벽한 지원.",
    mainSubtitle: "각 카드를 클릭하여 대화형 시뮬레이션과 보안 세부사항을 확인하세요.",
    clickExpand: "클릭하여 자세히 보기",
    clickFullDemo: "전체 시연 보기",
    p1Badge: "핵심 1",
    p1Title: "이해",
    p1Desc: "모든 항목을 쉬운 일상 언어로 설명받고, 작성 예시와 유의사항을 모국어 텍스트나 음성으로 명확히 안내받으세요.",
    p1Footer: "서식 항목 가이드 & 문맥 해설",
    p2Badge: "핵심 2",
    p2Title: "작성",
    p2Desc: "신분증이나 여권을 한 번만 업로드하면 기기 내 암호화 보관함에서 1클릭으로 복잡한 공공 서식을 자동 입력합니다.",
    p2Footer: "스마트 보관함 & 원클릭 자동완성",
    p3Badge: "핵심 3",
    p3Title: "검토",
    p3Desc: "공식 사이트에서 제출 버튼을 누르기 전, 누락된 필수 항목이나 날짜 서식 오류를 감지하여 서류 반려를 예방합니다.",
    p3Footer: "사전 점검 스마트 감사 기능",
    tl1: "여권 표기 영문 성명과 일치",
    tl2: "날짜 형식: YYYY/MM/DD 형태로 변경 권장",
    tl3: "필수 서명란 누락 확인",
    bannerTitle: "음성 모드 및 14가지 웹 접근성 도구를 찾으시나요?",
    bannerDesc: "모든 14개 접근성 프로필, 기기 내 완벽 암호화, 상세 기능 비교를 확인하세요.",
    bannerBtn: "모든 기능 살펴보기",
    modalHowTitle: "브라우저 작동 방식:",
    modalPrivTitle: "개인정보 보호 및 문서 보관 제로 보장",
    modalCta: "Telmy 확장 프로그램 무료 설치",
    modalRecording: "Chrome 사이드 패널 실제 구동 화면",
    p1ModalTitle: "핵심 1: 모든 서식 항목을 문맥에 맞게 이해",
    p1ModalSub: "어려운 행정 용어를 쉬운 일상어 설명과 자연스러운 음성 안내로 명쾌하게 풀어드립니다.",
    p1ModalBadge: "항목 해설 & 음성 안내",
    p1Steps: [
      { title: "1. 임의의 항목 클릭", desc: "대사관 및 정부 기관의 가이드라인을 바탕으로 AI가 항목의 목적을 파악합니다." },
      { title: "2. 쉬운 일상어 해설", desc: "아포스티유, 체류자격 사유서 등 복잡한 법적 용어를 쉬운 말로 바꿉니다." },
      { title: "3. 모범 입력 예시", desc: "영문 표기 순서나 날짜 형식 등 오기입으로 인한 반려를 방지합니다." },
      { title: "4. 자연스러운 음성 지원", desc: "아시아 태평양 11개 주요 언어로 문항 설명을 음성으로 들려줍니다." }
    ],
    p1Security: "화면 지침과 항목 이름만 분석하며, 입력값은 기기에서 가림 처리된 후 전송됩니다.",
    p2ModalTitle: "핵심 2: 복잡한 양식도 1클릭 자동완성",
    p2ModalSub: "증명 서류에서 정보를 추출해 브라우저 내부 AES-256 보관함에서 즉각 서식을 채웁니다.",
    p2ModalBadge: "스마트 암호 보관함 & 자동 입력",
    p2Steps: [
      { title: "1. 1회성 서류 판독 (OCR)", desc: "여권 및 신분증 판독 후 원본 파일은 임시 메모리에서 즉시 영구 삭제됩니다." },
      { title: "2. 기기 내 AES-256-GCM 암호화", desc: "데이터는 사용자의 컴퓨터 안에서만 암호화/복호화됩니다." },
      { title: "3. 20개 이상 항목 스마트 매칭", desc: "성명, 생년월일, 여권 만료일 등 주요 항목을 정부 사이트에 일괄 입력합니다." },
      { title: "4. 비밀번호 등 금융 정보 배제", desc: "비밀번호, 신용카드 번호, OTP는 절대 감지하거나 저장하지 않습니다." }
    ],
    p2Security: "영지식 보관: Telmy 서버에는 암호화된 문자열만 보관됩니다.",
    p3ModalTitle: "핵심 3: 제출 전 신호등 오류 감사",
    p3ModalSub: "누락이나 서식 오류를 사전에 발견하여 재신청 수수료 낭비와 비자 지연을 방지합니다.",
    p3ModalBadge: "사전 점검 안전 감사",
    p3Steps: [
      { title: "1. 필수 입력 누락 감지 (빨간불)", desc: "필수 항목 미기입이나 동의 체크박스 누락을 제출 전에 경고합니다." },
      { title: "2. 서식 및 날짜 불일치 (노란불)", desc: "년/월/일 순서 오류나 여권번호 공백을 사전에 감지합니다." },
      { title: "3. 여권 성명 일치 확인 (초록불)", desc: "등록된 데이터와 증명서 스펠링이 일치하는지 정밀 대조합니다." },
      { title: "4. 확신을 가진 서류 제출", desc: "작성 오류로 인한 탈락 불안감 없이 안심하고 접수를 마칠 수 있습니다." }
    ],
    p3Security: "모든 검사는 브라우저 내부에서 진행되며 제3자의 열람은 전혀 없습니다."
  },
  zh: {
    badge: "核心三大支柱",
    mainTitle: "一位智能助手。三大核心使命。",
    mainSubtitle: "点击任意卡片，查看完整互动演示与严格的隐私安全保障。",
    clickExpand: "点击展开详情",
    clickFullDemo: "点击查看完整演示",
    p1Badge: "支柱 1",
    p1Title: "透彻理解",
    p1Desc: "用浅白亲切的母语解读每个输入框，配备真实范例、术语释义与易错点提示，支持朗读播放。",
    p1Footer: "表单指南与文脉解说",
    p2Badge: "支柱 2",
    p2Title: "高效填报",
    p2Desc: "仅需上传一次证件，AI 将资料存入本地加密保险箱，跨页面一键智能自动填充繁琐字段。",
    p2Footer: "智能保险箱与一键填表",
    p3Badge: "支柱 3",
    p3Title: "智能审核",
    p3Desc: "在点击官方最终提交前，Telmy 会严密检查必填漏项、日期次序错误与高风险疏漏，防止被拒。",
    p3Footer: "提交前智能红绿灯核验",
    tl1: "姓名拼写与护照身份完全一致",
    tl2: "日期格式建议：调整为 YYYY/MM/DD",
    tl3: "法定必填签名项尚未完成",
    bannerTitle: "正在寻找语音模式、14项无障碍工具及PDF支持？",
    bannerDesc: "探索全套 14 种视觉与认知辅助工具、客户端高强度加密及完整功能对比。",
    bannerBtn: "探索全部功能",
    modalHowTitle: "浏览器工作原理：",
    modalPrivTitle: "隐私安全与零文件留存承诺",
    modalCta: "免费获取 Telmy 浏览器扩展",
    modalRecording: "Chrome 侧边栏实景操作录像",
    p1ModalTitle: "支柱 1：置身情境透彻理解每个栏位",
    p1ModalSub: "告别填表焦虑，获得通俗解说、权威官方释义、真实填报范例与母语语音指引。",
    p1ModalBadge: "表单解说与语音指引",
    p1Steps: [
      { title: "1. 点击任意输入框", desc: "Telmy 自动根据使领馆及官方指南识别该字段的填报目的与要求。" },
      { title: "2. 通俗白话文解说", desc: "将公文认证、居留事由等繁复法律专有名词化为易懂的生活语言。" },
      { title: "3. 填报示范与避坑提示", desc: "清晰展示合规书写格式，避免因拼写或格式不符遭系统直接退件。" },
      { title: "4. 自然语音辅助", desc: "支持亚太 11 种官方语言的自然 AI 语音朗读播放。" }
    ],
    p1Security: "仅提取说明文字。您键入的私密信息在发出前均已在本地完成脱敏遮盖。",
    p2ModalTitle: "支柱 2：一键智能填充复杂公文表格",
    p2ModalSub: "一次性提取证件核心信息，保存在本地 AES-256 加密保险箱中，数秒内录入多步表单。",
    p2ModalBadge: "智能加密保险箱与自动填表",
    p2Steps: [
      { title: "1. 单次证件 OCR 识别", desc: "提取护照或身份证要点后，原始文件在临时内存中被永久物理粉碎。" },
      { title: "2. 客户端高强度加密", desc: "您的个人档案采用 AES-256-GCM 封存，密钥始终保留在您的设备本地。" },
      { title: "3. 一键智能跨表匹配", desc: "自动对应政府门户中的姓名、证件号、有效期等 20+ 个核心字段。" },
      { title: "4. 密码等金融凭据完全排除", desc: "密码框、银行卡号与动态验证码完全忽略，绝不捕获记录。" }
    ],
    p2Security: "零知识存储：Telmy 云端仅保存无法解读的密文，解密只发生在您个人电脑中。",
    p3ModalTitle: "支柱 3：提交前红绿灯安全审核",
    p3ModalSub: "深度预审必填漏项与格式颠倒，杜绝因微小笔误导致的签证拒签与重申费用损失。",
    p3ModalBadge: "提交前智能防错审核",
    p3Steps: [
      { title: "1. 必填遗漏核查（红灯）", desc: "在您送出前准确预警遗漏的必填框与未勾选的声明项。" },
      { title: "2. 日期格式与格式校验（黄灯）", desc: "提示年/月/日颠倒或证件号码中夹带的异常空格。" },
      { title: "3. 护照姓名拼音一致性（绿灯）", desc: "核实填报的英文全名与护照官方记录是否完全相符。" },
      { title: "4. 胸有成竹完成提交", desc: "让您彻底告别因填错细节带来的忐忑不安，从容递交申请。" }
    ],
    p3Security: "审核全程在您本地浏览器中运行，绝无任何人工查阅流程。"
  },
  'zh-TW': {
    badge: "核心三大支柱",
    mainTitle: "一位智慧夥伴。三大核心任務。",
    mainSubtitle: "點擊任意卡片，查看完整互動示範與嚴格的資安隱私保障。",
    clickExpand: "點擊展開細節",
    clickFullDemo: "點擊檢視完整示範",
    p1Badge: "支柱 1",
    p1Title: "透徹理解",
    p1Desc: "以白話親切的母語解讀每個欄位，具備範例、官方定義與易錯提醒，支援語音朗讀。",
    p1Footer: "表單指引與文脈解說",
    p2Badge: "支柱 2",
    p2Title: "高效填寫",
    p2Desc: "僅需上傳一次證件，AI 將資料存入本機加密保險箱，跨頁面一鍵自動填入繁瑣欄位。",
    p2Footer: "智慧保險箱與一鍵填表",
    p3Badge: "支柱 3",
    p3Title: "送出前查核",
    p3Desc: "在點擊官方最終送出前，Telmy 嚴格檢查必填漏項、日期次序錯誤與格式疏漏，杜絕退件。",
    p3Footer: "送出前智慧紅綠燈審查",
    tl1: "姓名拼寫與護照身分完全相符",
    tl2: "日期格式建議：調整為 YYYY/MM/DD",
    tl3: "法定必填簽名欄尚未完成",
    bannerTitle: "正在尋找語音模式、14項無障礙工具及PDF支援？",
    bannerDesc: "探索全套 14 種視覺與認知輔助工具、用戶端高強度加密及完整功能比較表。",
    bannerBtn: "探索全部功能",
    modalHowTitle: "瀏覽器運作原理：",
    modalPrivTitle: "隱私安全與零檔案留存承諾",
    modalCta: "免費取得 Telmy 瀏覽器擴充功能",
    modalRecording: "Chrome 側邊欄實景操作錄影",
    p1ModalTitle: "支柱 1：置身情境透徹理解每個欄位",
    p1ModalSub: "告別填表焦慮，獲得白話解說、權威官方釋義、真實填報範例與母語語音引導。",
    p1ModalBadge: "表單解說與語音引導",
    p1Steps: [
      { title: "1. 點擊任意輸入框", desc: "Telmy 自動依據使領館及官方指引辨識該欄位的填寫目的與規定。" },
      { title: "2. 白話文解說", desc: "將海牙認證、居留事由等繁複法律名詞化為易懂的生活語言。" },
      { title: "3. 填寫範例與避坑提示", desc: "清楚呈現合規書寫格式，避免因拼寫或格式不符遭系統直接退件。" },
      { title: "4. 自然語音輔助", desc: "支援亞太 11 種官方語言的自然 AI 語音朗讀播放。" }
    ],
    p1Security: "僅擷取說明文字。您輸入的機敏資訊在送出前均已於本機自動去識別化。",
    p2ModalTitle: "支柱 2：一鍵智慧填寫複雜公文表格",
    p2ModalSub: "一次性擷取證件核心資訊，保存在本機 AES-256 加密保險箱中，數秒內填妥多步驟表單。",
    p2ModalBadge: "智慧加密保險箱與自動填表",
    p2Steps: [
      { title: "1. 單次證件 OCR 辨識", desc: "擷取護照或身分證重點後，原始檔案在暫存記憶體中立即被實體銷毀。" },
      { title: "2. 用戶端高強度加密", desc: "您的個人檔案採用 AES-256-GCM 密封，金鑰始終留存在您的裝置本機。" },
      { title: "3. 一鍵智慧跨表比對", desc: "自動對應政府入口網站中的姓名、證件號碼、效期等 20+ 個核心欄位。" },
      { title: "4. 密碼等金融憑證完全排除", desc: "密碼欄、信用卡號與動態驗證碼完全忽略，絕不擷取或記錄。" }
    ],
    p2Security: "零知識儲存：Telmy 雲端僅保存無法解讀的密文，解密只發生在您的個人電腦中。",
    p3ModalTitle: "支柱 3：送出前紅綠燈安全審查",
    p3ModalSub: "深度預先審查必填漏項與格式顛倒，杜絕因微小筆誤導致的簽證拒簽與重辦規費損失。",
    p3ModalBadge: "送出前智慧防錯審查",
    p3Steps: [
      { title: "1. 必填遺漏核查（紅燈）", desc: "在您送出前精準預警遺漏的必填欄位與未勾選的聲明項。" },
      { title: "2. 日期格式校驗（黃燈）", desc: "提示年/月/日顛倒或證件號碼中夾帶的異常空格。" },
      { title: "3. 護照姓名拼音一致性（綠燈）", desc: "核實填報的英文全名與護照官方記錄是否完全相符。" },
      { title: "4. 胸有成竹完成送出", desc: "讓您徹底告別因填錯細節帶來的忐忑不安，從容遞交申請。" }
    ],
    p3Security: "審查全程在您的本機瀏覽器中運作，絕無任何人工查閱程序。"
  },
  vi: {
    badge: "Trụ Cột Cốt Lõi",
    mainTitle: "Một trợ lý. Ba nhiệm vụ toàn diện.",
    mainSubtitle: "Nhấp vào từng thẻ để xem mô phỏng tương tác đầy đủ và chi tiết bảo mật.",
    clickExpand: "Nhấp để mở rộng",
    clickFullDemo: "Nhấp để xem bản mô phỏng đầy đủ",
    p1Badge: "Trụ cột 1",
    p1Title: "Hiểu rõ",
    p1Desc: "Nhận giải thích bằng ngôn ngữ hàng ngày cho từng trường, ví dụ minh họa và từ ngữ pháp lý bằng tiếng mẹ đẻ của bạn.",
    p1Footer: "Hướng dẫn & Giải thích Ngữ cảnh",
    p2Badge: "Trụ cột 2",
    p2Title: "Hoàn tất",
    p2Desc: "Tải giấy tờ một lần. Telmy lưu vào két mã hóa cục bộ và tự động điền các biểu mẫu phức tạp trong 1 chạm.",
    p2Footer: "Két Thông Minh & Điền Tự Động",
    p3Badge: "Trụ cột 3",
    p3Title: "Kiểm tra",
    p3Desc: "Trước khi nộp trên cổng chính thức, Telmy kiểm tra các trường bắt buộc bị bỏ sót và lỗi định dạng để tránh bị từ chối.",
    p3Footer: "Kiểm tra An toàn Trước khi Nộp",
    tl1: "Tên khớp với hộ chiếu",
    tl2: "Định dạng ngày: đổi thành YYYY/MM/DD",
    tl3: "Trường chữ ký bắt buộc",
    bannerTitle: "Tìm kiếm Chế độ Giọng nói & Công cụ Trợ năng?",
    bannerDesc: "Khám phá toàn bộ 14 cấu hình trợ năng, mã hóa cục bộ và các tính năng đầy đủ.",
    bannerBtn: "Khám phá Tất cả Tính năng",
    modalHowTitle: "Cách thức hoạt động trên trình duyệt:",
    modalPrivTitle: "Cam kết Quyền riêng tư & Không Lưu trữ Tài liệu",
    modalCta: "Cài Đặt Tiện Ích Telmy Miễn Phí",
    modalRecording: "Bản ghi hình thực tế từ thanh bên Chrome của Telmy",
    p1ModalTitle: "Trụ cột 1: Hiểu rõ từng trường theo ngữ cảnh",
    p1ModalSub: "Loại bỏ nỗi lo sợ với giải thích ngôn ngữ dễ hiểu, ví dụ thực tế và giọng đọc bản ngữ.",
    p1ModalBadge: "Giải thích Biểu mẫu & Giọng đọc",
    p1Steps: [
      { title: "1. Nhấp vào bất kỳ ô nào", desc: "Telmy tự động xác định ngữ cảnh câu hỏi và hướng dẫn của đại sứ quán." },
      { title: "2. Giải thích Đơn giản", desc: "Các thuật ngữ phức tạp được dịch thành từ ngữ hàng ngày dễ hiểu." },
      { title: "3. Ví dụ & Lỗi Thường gặp", desc: "Xem chính xác cách nhập hợp lệ để tránh bị từ chối hồ sơ ngay lập tức." },
      { title: "4. Chế độ Giọng đọc Âm thanh", desc: "Lắng nghe giải thích được đọc bằng ngôn ngữ mẹ đẻ của bạn." }
    ],
    p1Security: "Chỉ xử lý chỉ dẫn và nhãn trường. Dữ liệu cá nhân luôn được che giấu trên máy của bạn.",
    p2ModalTitle: "Trụ cột 2: Hoàn thành Biểu mẫu Phức tạp bằng Tự động Điền 1 Chạm",
    p2ModalSub: "Tải giấy tờ một lần. Trích xuất dữ liệu vào két mã hóa cục bộ AES-256 và tự động điền trong vài giây.",
    p2ModalBadge: "Két Thông Minh & Tự Động Điền Chuẩn",
    p2Steps: [
      { title: "1. Quét OCR Giấy tờ Một lần", desc: "Tải hộ chiếu hoặc CCCD. AI trích xuất thông tin và xóa ngay tập tin gốc khỏi bộ nhớ tạm thời." },
      { title: "2. Mã hóa Két Cục bộ", desc: "Hồ sơ của bạn được niêm phong bằng chuẩn AES-256-GCM. Khóa mã hóa chỉ lưu trên thiết bị của bạn." },
      { title: "3. Tự động Khớp 1 Chạm", desc: "Telmy tự động đối chiếu hơn 20 trường chuẩn (họ tên, ngày cấp, số hộ chiếu) trên các cổng dịch vụ công." },
      { title: "4. Loại trừ Tuyệt đối Mật khẩu", desc: "Mật khẩu, mã OTP và mã thẻ CVV ngân hàng hoàn toàn bị chặn và không bao giờ bị ghi lại." }
    ],
    p2Security: "Bảo mật Zero-Knowledge: Máy chủ Telmy chỉ chứa dữ liệu đã mã hóa không thể giải mã, chỉ máy bạn mới có khóa mở.",
    p3ModalTitle: "Trụ cột 3: Kiểm tra An toàn Bằng Đèn Giao thông Trước khi Nộp",
    p3ModalSub: "Kiểm tra kỹ lưỡng các trường bắt buộc bị bỏ sót, ngăn ngừa hồ sơ bị từ chối và tốn phí nộp lại.",
    p3ModalBadge: "Kiểm Tra Tránh Lỗi Trước Khi Nộp",
    p3Steps: [
      { title: "1. Cảnh báo Mục Bỏ sót (Đỏ)", desc: "Phát hiện chính xác các ô bắt buộc chưa điền hoặc các điều khoản chưa tích chọn." },
      { title: "2. Kiểm tra Định dạng & Ngày (Vàng)", desc: "Nhắc nhở đảo lộn ngày/tháng/năm hoặc khoảng trắng lạ trong số giấy tờ." },
      { title: "3. Khớp Tên Hộ chiếu (Xanh)", desc: "Xác minh tên không dấu khớp hoàn toàn với hồ sơ đăng ký chính thức." },
      { title: "4. Tự Tin Nộp Hồ Sơ", desc: "Giúp bạn hoàn toàn yên tâm khi gửi đơn mà không còn nỗi lo sai sót nhỏ gây hậu quả lớn." }
    ],
    p3Security: "Toàn bộ quá trình kiểm tra diễn ra cục bộ trong trình duyệt của bạn, không có bất kỳ ai xem dữ liệu."
  },
  th: {
    badge: "เสาหลักสำคัญ",
    mainTitle: "หนึ่งผู้ช่วย สามหน้าที่หลักที่สมบูรณ์แบบ",
    mainSubtitle: "คลิกการ์ดใดก็ได้เพื่อดูตัวอย่างเชิงโต้ตอบแบบเต็มและรายละเอียดความปลอดภัย",
    clickExpand: "คลิกเพื่อขยาย",
    clickFullDemo: "คลิกเพื่อดูการสาธิตแบบเต็ม",
    p1Badge: "เสาหลัก 1",
    p1Title: "เข้าใจ",
    p1Desc: "รับคำอธิบายภาษาพูดที่เข้าใจง่ายสำหรับทุกช่อง พร้อมตัวอย่าง คำจำกัดความ และข้อผิดพลาดที่พบบ่อยในภาษาแม่ของคุณ",
    p1Footer: "คู่มือแบบฟอร์มและคำอธิบายบริบท",
    p2Badge: "เสาหลัก 2",
    p2Title: "กรอกข้อมูล",
    p2Desc: "อัปโหลดบัตรประชาชนหรือหนังสือเดินทางเพียงครั้งเดียว AI จะบันทึกไว้ในตู้นิรภัยที่เข้ารหัสและกรอกข้อมูลอัตโนมัติในคลิกเดียว",
    p2Footer: "ตู้นิรภัยอัจฉริยะและการกรอกอัตโนมัติ",
    p3Badge: "เสาหลัก 3",
    p3Title: "ตรวจสอบ",
    p3Desc: "ก่อนที่คุณจะกดส่ง Telmy จะแจ้งเตือนช่องบังคับที่ยังไม่ได้กรอก และข้อผิดพลาดร้ายแรงเพื่อป้องกันการถูกปฏิเสธ",
    p3Footer: "ระบบตรวจสอบก่อนส่ง",
    tl1: "ชื่อตรงกับหนังสือเดินทาง",
    tl2: "รูปแบบวันที่: แนะนำให้เปลี่ยนเป็น YYYY/MM/DD",
    tl3: "จำเป็นต้องระบุช่องลายมือชื่อ",
    bannerTitle: "กำลังมองหาโหมดเสียงและเครื่องมือการเข้าถึงใช่หรือไม่?",
    bannerDesc: "สำรวจโปรไฟล์การเข้าถึงทั้ง 14 แบบ การเข้ารหัสบนอุปกรณ์ และรายการฟีเจอร์ที่สมบูรณ์",
    bannerBtn: "สำรวจฟีเจอร์ทั้งหมด",
    modalHowTitle: "วิธีการทำงานบนเบราว์เซอร์ของคุณ:",
    modalPrivTitle: "การรับประกันความเป็นส่วนตัวและไม่เก็บเอกสาร",
    modalCta: "รับส่วนขยาย Telmy ฟรี",
    modalRecording: "บันทึกหน้าจอจริงจากแถบด้านข้างของ Chrome",
    p1ModalTitle: "เสาหลัก 1: เข้าใจทุกช่องตามบริบท",
    p1ModalSub: "ขจัดความวิตกกังวลด้วยคำอธิบายที่เข้าใจง่าย ตัวอย่างจริง และเสียงอ่านภาษาท้องถิ่น",
    p1ModalBadge: "คำอธิบายแบบฟอร์มและเสียงนำทาง",
    p1Steps: [
      { title: "1. คลิกที่ช่องใดก็ได้", desc: "Telmy จะระบุบริบทของคำถามและแนวทางของสถานทูตโดยอัตโนมัติ" },
      { title: "2. คำอธิบายภาษาเรียบง่าย", desc: "แปลข้อความทางการที่ซับซ้อนให้เป็นภาษาที่เข้าใจง่าย" },
      { title: "3. ตัวอย่างจริงและข้อควรระวัง", desc: "ดูรูปแบบการกรอกที่ถูกต้องเพื่อหลีกเลี่ยงการถูกปฏิเสธ" },
      { title: "4. โหมดเสียงแนะนำ", desc: "ฟังคำอธิบายที่อ่านออกเสียงอย่างเป็นธรรมชาติในภาษาของคุณ" }
    ],
    p1Security: "ประมวลผลเฉพาะคำสั่งและป้ายกำกับเท่านั้น ข้อมูลส่วนบุคคลจะถูกซ่อนไว้ในเครื่องเสมอ",
    p2ModalTitle: "เสาหลัก 2: กรอกแบบฟอร์มซับซ้อนให้เสร็จสิ้นใน 1 คลิก",
    p2ModalSub: "อัปโหลดเอกสารเพียงครั้งเดียว บันทึกข้อมูลลงในตู้นิรภัย AES-256 ในเครื่องของคุณ และกรอกข้อมูลอัตโนมัติในไม่กี่วินาที",
    p2ModalBadge: "ตู้นิรภัยอัจฉริยะและการกรอกอัตโนมัติ",
    p2Steps: [
      { title: "1. สแกน OCR เอกสารครั้งเดียว", desc: "อัปโหลดหนังสือเดินทางหรือบัตรประชาชน AI ดึงข้อมูลสำคัญและลบไฟล์ต้นฉบับออกจากหน่วยความจำทันที" },
      { title: "2. เข้ารหัสตู้นิรภัยในเครื่อง", desc: "โปรไฟล์ของคุณถูกปิดผนึกด้วย AES-256-GCM คีย์จะถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น" },
      { title: "3. จับคู่ช่องข้อมูลอัจฉริยะใน 1 คลิก", desc: "Telmy จับคู่ช่องข้อมูลมาตรฐานกว่า 20 รายการข้ามพอร์ทัลรัฐบาลต่างๆ" },
      { title: "4. ปลอดภัยจากรหัสผ่านและข้อมูลการเงิน", desc: "ไม่บันทึกหรือกรอกรหัสผ่าน รหัสบัตรเครดิต หรือรหัส PIN ใดๆ ทั้งสิ้น" }
    ],
    p2Security: "พื้นที่เก็บข้อมูล Zero-Knowledge: เซิร์ฟเวอร์ Telmy เก็บเฉพาะข้อความเข้ารหัส มีเพียงคุณเท่านั้นที่ถอดรหัสได้",
    p3ModalTitle: "เสาหลัก 3: ตรวจสอบความปลอดภัยแบบสัญญาณไฟจราจรก่อนส่ง",
    p3ModalSub: "ตรวจสอบช่องบังคับที่ตกหล่นและรูปแบบที่ผิดพลาด ป้องกันการถูกปฏิเสธวีซ่าและการเสียค่าธรรมเนียมซ้ำซ้อน",
    p3ModalBadge: "ระบบตรวจสอบก่อนส่งเอกสาร",
    p3Steps: [
      { title: "1. ตรวจสอบช่องที่พลาด (ไฟแดง)", desc: "เตือนช่องบังคับที่ยังไม่ได้กรอกหรือข้อกำหนดที่ยังไม่ได้ติ๊กเลือก" },
      { title: "2. ตรวจสอบรูปแบบวันที่ (ไฟเหลือง)", desc: "แจ้งเตือนการสลับ วัน/เดือน/ปี หรือช่องว่างที่ผิดปกติในหมายเลขเอกสาร" },
      { title: "3. ตรวจสอบความถูกต้องของชื่อ (ไฟเขียว)", desc: "ยืนยันว่าชื่อภาษาอังกฤษตรงกับหนังสือเดินทางอย่างสมบูรณ์" },
      { title: "4. ยื่นใบสมัครด้วยความมั่นใจ", desc: "หมดกังวลเรื่องข้อผิดพลาดเล็กๆ น้อยๆ ที่อาจทำให้เอกสารล่าช้า" }
    ],
    p3Security: "การตรวจสอบทั้งหมดทำงานภายในเบราว์เซอร์ของคุณ ไม่มีใครสามารถมองเห็นข้อมูลได้"
  },
  hi: {
    badge: "मुख्य स्तंभ",
    mainTitle: "एक साथी। तीन महत्वपूर्ण काम।",
    mainSubtitle: "पूर्ण इंटरैक्टिव प्रदर्शन और सुरक्षा विवरण देखने के लिए किसी भी कार्ड पर क्लिक करें।",
    clickExpand: "विस्तार करने के लिए क्लिक करें",
    clickFullDemo: "पूर्ण प्रदर्शन देखने के लिए क्लिक करें",
    p1Badge: "स्तंभ 1",
    p1Title: "समझें",
    p1Desc: "हर फ़ील्ड का सरल भाषा में स्पष्टीकरण, उदाहरण, कानूनी परिभाषाएं और सामान्य गलतियां अपनी मातृभाषा में जानें।",
    p1Footer: "फॉर्म गाइड और संदर्भ व्याख्या",
    p2Badge: "स्तंभ 2",
    p2Title: "भरें",
    p2Desc: "एक बार अपनी आईडी या पासपोर्ट अपलोड करें। Telmy इसे एन्क्रिप्टेड वॉल्ट में सहेजता है और 1-क्लिक में फॉर्म भरता है।",
    p2Footer: "स्मार्ट वॉल्ट और 1-क्लिक ऑटो-फिल",
    p3Badge: "स्तंभ 3",
    p3Title: "जांचें",
    p3Desc: "सबमिट करने से पहले, Telmy छूटे हुए अनिवार्य फ़ील्ड और गलतियों को इंगित करता है ताकि अस्वीकृति से बचा जा सके।",
    p3Footer: "अंतर्निहित फॉर्म ऑडिटर",
    tl1: "नाम पासपोर्ट से मेल खाता है",
    tl2: "दिनांक प्रारूप: YYYY/MM/DD में बदलें",
    tl3: "हस्ताक्षर फ़ील्ड अनिवार्य है",
    bannerTitle: "वॉयस मोड और एक्सेसिबिलिटी हब खोज रहे हैं?",
    bannerDesc: "सभी 14 एक्सेसिबिलिटी प्रोफाइल, क्लाइंट-साइड एन्क्रिप्शन और पूरी सुविधा सूची देखें।",
    bannerBtn: "सभी सुविधाएं देखें",
    modalHowTitle: "यह आपके ब्राउज़र में कैसे काम करता है:",
    modalPrivTitle: "गोपनीयता और शून्य दस्तावेज़ प्रतिधारण गारंटी",
    modalCta: "Telmy एक्सटेंशन मुफ्त में प्राप्त करें",
    modalRecording: "Chrome साइड पैनल से वास्तविक रिकॉर्डिंग",
    p1ModalTitle: "स्तंभ 1: संदर्भ में हर फ़ील्ड को समझें",
    p1ModalSub: "सरल भाषा में व्याख्या, आधिकारिक परिभाषाओं और मूल भाषा ऑडियो के साथ अपनी चिंता समाप्त करें।",
    p1ModalBadge: "फॉर्म व्याख्या और आवाज मार्गदर्शन",
    p1Steps: [
      { title: "1. किसी भी फ़ील्ड पर क्लिक करें", desc: "Telmy स्वचालित रूप से आधिकारिक दिशानिर्देशों की पहचान करता है।" },
      { title: "2. सरल भाषा में व्याख्या", desc: "कठिन कानूनी शब्दों को सरल रोजमर्रा की भाषा में बदलें।" },
      { title: "3. वास्तविक उदाहरण", desc: "अस्वीकृति से बचने के लिए देखें कि सही प्रविष्टि कैसी दिखती है।" },
      { title: "4. वॉयस मोड", desc: "अपनी भाषा में बोलकर सुनाए गए स्पष्टीकरण सुनें।" }
    ],
    p1Security: "केवल निर्देशों को संसाधित किया जाता है। व्यक्तिगत डेटा भेजने से पहले हमेशा मास्क किया जाता है।",
    p2ModalTitle: "स्तंभ 2: 1-क्लिक ऑटो-फिल के साथ जटिल फॉर्म पूरा करें",
    p2ModalSub: "दस्तावेज़ एक बार अपलोड करें। डेटा को अपने स्थानीय AES-256 एन्क्रिप्टेड वॉल्ट में रखें और सेकंडों में फॉर्म भरें।",
    p2ModalBadge: "स्मार्ट वॉल्ट और 1-क्लिक ऑटो-फिल",
    p2Steps: [
      { title: "1. वन-टाइम आईडी ओसीआर", desc: "पासपोर्ट या आईडी अपलोड करें। एआई विवरण निकालता है और मूल फ़ाइल तुरंत मेमोरी से हटा देता है।" },
      { title: "2. क्लाइंट-साइड वॉल्ट एन्क्रिप्शन", desc: "आपकी प्रोफ़ाइल AES-256-GCM से सुरक्षित है। एन्क्रिप्शन कुंजी केवल आपके डिवाइस पर रहती है।" },
      { title: "3. 1-क्लिक स्मार्ट मिलान", desc: "Telmy सरकारी पोर्टलों पर 20+ फ़ील्ड्स (नाम, उपनाम, समाप्ति तिथि) का मिलान करता है।" },
      { title: "4. कोई पासवर्ड कैप्चर नहीं", desc: "पासवर्ड, क्रेडिट कार्ड सीवीवी और बैंकिंग पिन कभी भी कैप्चर या सेव नहीं किए जाते हैं।" }
    ],
    p2Security: "शून्य-ज्ञान भंडारण: Telmy सर्वर केवल सिफरटेक्स्ट रखता है, डिक्रिप्शन केवल आपके कंप्यूटर पर होता है।",
    p3ModalTitle: "स्तंभ 3: सबमिशन से पहले ट्रैफिक लाइट सुरक्षा ऑडिट",
    p3ModalSub: "छूटे हुए अनिवार्य फ़ील्ड और गलतियों की गहन जांच करें ताकि वीजा अस्वीकृति और नुकसान से बचा जा सके।",
    p3ModalBadge: "सबमिशन से पहले ऑडिट",
    p3Steps: [
      { title: "1. छूटे हुए अनिवार्य फ़ील्ड (रेड लाइट)", desc: "सबमिट करने से पहले छूटे हुए अनिवार्य फ़ील्ड की सटीक चेतावनी देता है।" },
      { title: "2. दिनांक प्रारूप सत्यापन (येलो लाइट)", desc: "वर्ष/माह/दिन की विसंगतियों या असामान्य रिक्त स्थानों की चेतावनी देता है।" },
      { title: "3. पासपोर्ट नाम की अनुरूपता (ग्रीन लाइट)", desc: "सत्यापित करता है कि दर्ज नाम पासपोर्ट रिकॉर्ड से पूरी तरह मेल खाता है।" },
      { title: "4. पूरे आत्मविश्वास के साथ सबमिट करें", desc: "विवरण की गलतियों की चिंता से पूरी तरह मुक्त होकर अपना फॉर्म जमा करें।" }
    ],
    p3Security: "पूरा ऑडिट आपके स्थानीय ब्राउज़र में चलता है, कोई मानवीय समीक्षा शामिल नहीं है।"
  },
  fil: {
    badge: "Pangunahing Haligi",
    mainTitle: "Isang katulong. Tatlong mahalagang tungkulin.",
    mainSubtitle: "I-click ang anumang card upang suriin ang buong interactive na demonstrasyon at mga detalye ng seguridad.",
    clickExpand: "I-click para palakihin",
    clickFullDemo: "I-click para makita ang buong demo",
    p1Badge: "Haligi 1",
    p1Title: "Unawain",
    p1Desc: "Kumuha ng simpleng paliwanag sa bawat field, na may mga halimbawa at karaniwang pagkakamali sa iyong wika.",
    p1Footer: "Gabay sa Form at Tagapaliwanag",
    p2Badge: "Haligi 2",
    p2Title: "Kumpletuhin",
    p2Desc: "I-upload ang iyong ID o pasaporte nang isang beses. Naka-encrypt ito sa lokal na vault at awtomatikong pinupunan sa 1-click.",
    p2Footer: "Smart Vault at 1-Click AutoFill",
    p3Badge: "Haligi 3",
    p3Title: "Suriin",
    p3Desc: "Bago ka magsumite sa opisyal na portal, tinutukoy ng Telmy ang mga napalampas na field at maling format.",
    p3Footer: "Form Auditor at Pagsusuri Bago Isumite",
    tl1: "Tugma ang pangalan sa pasaporte",
    tl2: "Format ng petsa: palitan sa YYYY/MM/DD",
    tl3: "Kailangan ang mandatoryong pirma",
    bannerTitle: "Naghahanap ng Voice Mode at Accessibility Hub?",
    bannerDesc: "Tuklasin ang lahat ng 14 na profile sa accessibility at client-side encryption.",
    bannerBtn: "Galugarin ang Lahat ng Tampok",
    modalHowTitle: "Paano ito gumagana sa iyong browser:",
    modalPrivTitle: "Garantiya sa Privacy at Zero Retention",
    modalCta: "Kumuha ng Telmy Extension nang Libre",
    modalRecording: "Aktwal na recording mula sa Chrome Side Panel ng Telmy",
    p1ModalTitle: "Haligi 1: Unawain ang Bawat Field sa Konteksto",
    p1ModalSub: "Alisin ang kaba gamit ang simpleng mga salita, opisyal na kahulugan, at gabay sa boses.",
    p1ModalBadge: "Tagapaliwanag ng Form at Boses",
    p1Steps: [
      { title: "1. I-click ang Anumang Field", desc: "Awtomatikong tinutukoy ng Telmy ang konteksto ng field." },
      { title: "2. Simpleng Paliwanag", desc: "Isinasalin ang mga legal na termino sa simpleng salita." },
      { title: "3. Mga Totoong Halimbawa", desc: "Tingnan ang tamang format upang maiwasan ang pagkaantala." },
      { title: "4. Mode ng Boses", desc: "Makinig sa mga paliwanag na binabasa sa iyong sariling wika." }
    ],
    p1Security: "Tanging mga tagubilin sa field ang pinoproseso. Ligtas na nakatago ang mga personal na detalye.",
    p2ModalTitle: "Haligi 2: Kumpletuhin ang Mga Form sa 1-Click AutoFill",
    p2ModalSub: "I-upload ang mga dokumento nang isang beses. I-save sa lokal na AES-256 encrypted vault at punan sa loob ng ilang segundo.",
    p2ModalBadge: "Smart Vault at Canonical Autofill",
    p2Steps: [
      { title: "1. Isang Beses na OCR ng Dokumento", desc: "I-upload ang Pasaporte o ID. Kinukuha ng AI ang mga detalye at agad na binubura ang orihinal na file sa memory." },
      { title: "2. Client-Side Vault Encryption", desc: "Ang iyong profile ay selyado ng AES-256-GCM. Ang susi sa pag-encrypt ay nananatili sa iyong device." },
      { title: "3. 1-Click Smart Matching", desc: "Itinutugma ng Telmy ang 20+ karaniwang field sa mga portal ng gobyerno." },
      { title: "4. Ligtas sa Mga Password", desc: "Ang mga password at credit card CVV ay ganap na hindi kinukuha o naitatala kailanman." }
    ],
    p2Security: "Zero-Knowledge Storage: Tanging ciphertext ang nasa server, ang pag-decrypt ay sa computer mo lamang nangyayari.",
    p3ModalTitle: "Haligi 3: Traffic Light Security Audit Bago Magsumite",
    p3ModalSub: "Masusing sinusuri ang mga nawawalang mandatory field at maling format upang maiwasan ang pagkaantala.",
    p3ModalBadge: "Pagsusuri Bago Magsumite",
    p3Steps: [
      { title: "1. Pagsusuri sa Kulang na Field (Red Light)", desc: "Tumpak na nagbababala sa mga napalampas na mandatory field bago isumite." },
      { title: "2. Format ng Petsa (Yellow Light)", desc: "Nagpapaalala sa mga maling pagkasunod-sunod ng petsa o kakaibang espasyo." },
      { title: "3. Katugman sa Pasaporte (Green Light)", desc: "Tinitiyak na ang buong pangalan ay eksaktong tugma sa opisyal na rekord." },
      { title: "4. Magsumite nang may Kumpiyansa", desc: "Ganap na alisin ang takot sa mga maling detalye at kumpiyansang magsumite." }
    ],
    p3Security: "Ang buong pagsusuri ay tumatakbo sa loob ng iyong browser nang walang interbensyon ng tao."
  }
}

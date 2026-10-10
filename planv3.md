# 🚀 TELMY.AI — PLAN V3: REDESAIN LANDING PAGE, MEMBER AREA & SPESIFIKASI TEKNIS GOOGLE EXPERT

Dokumen ini adalah cetak biru eksekusi untuk **Fase 3 Telmy.ai**. Fokus utama Plan V3 adalah menyajikan seluruh kecanggihan fitur yang telah dibangun di Plan V2 (Voicebot, Zero-Knowledge 6-Digit PIN Vault, Ingest KTP/Paspor/Ijazah, 1-Click AutoFill, Pre-Submission Auditor, PDF Certified Exporter) ke dalam **Landing Page** dan **Member Area (Dashboard)** dengan antarmuka yang sangat ramah, hangat, dan mudah dipahami oleh pengguna non-teknis, serta menyusun **README.md** teknis komprehensif berstandar evaluasi Google Expert.

---

## 🎯 Sasaran Utama Plan V3

1. **Landing Page yang Memukau & Manusiawi (Human-Centric & Non-Tech Friendly):**
   - Mengubah persepsi formulir birokrasi yang rumit, menakutkan, dan membosankan menjadi pengalaman yang santai, terpandu, dan menenangkan.
   - Menyajikan analogi visual yang gamblang untuk fitur canggih (misal: Zero-Knowledge CSE diibaratkan brankas digital pribadi dengan kunci hanya dipegang pengguna).
   - **Simulator Interaktif Live di Halaman Depan**: Pengunjung dapat langsung mencoba demo interaktif bagaimana Telmy mendampingi pengisian form di samping layar tanpa perlu install terlebih dahulu.

2. **Dukungan 11 Bahasa Ibu (Full JAPAC Multilingual Switcher):**
   - Menghadirkan pemilih bahasa elegan berbendera SVG di header landing page.
   - Menerjemahkan 100% konten Landing Page ke dalam 11 bahasa (English, Indonesia, 日本語, 한국어, 简体中文, 繁體中文, Tiếng Việt, ไทย, हिन्दी, Filipino, Melayu).
   - Memastikan pengguna dari Jepang, Korea, India, Thailand, atau Vietnam dapat membaca dan memahami setiap fitur dalam bahasa ibu mereka dengan istilah lokal yang akurat.

3. **Redesain Member Area / Web Dashboard (`dashboard.html`):**
   - Menghubungkan arsitektur Zero-Knowledge CSE ke Web Portal: Pengguna dapat membuka dan mengelola Profile Vault mereka di web menggunakan 6-Digit Master PIN via Web Crypto API.
   - Manajemen dokumen tersimpan (KTP, Paspor, Ijazah, Transkrip) dengan kartu visual yang bersih.
   - Indikator kuota formulir, riwayat formulir yang tersimpan, dan integrasi deteksi instalasi ekstensi Chrome (`chrome.runtime.sendMessageExternal`).

4. **Spesifikasi Teknis Lengkap di `README.md` (Untuk Evaluasi Google Expert):**
   - Mendokumentasikan secara rinci arsitektur *Client-Side* dan *Server-Side*.
   - Menguraikan pemanfaatan maksimal dari seluruh API Google Chrome (Manifest V3, `chrome.sidePanel`, `chrome.scripting`, `chrome.tabs`, `chrome.storage`, `chrome.runtime`, `Web Crypto API`, `Web Audio API`).
   - Menguraikan integrasi ekosistem Google Cloud & AI (Google Cloud Run serverless, Google Gemini 2.5 Flash-Lite Multimodal, Google Cloud WaveNet TTS, Firebase Auth & Firestore Zero-Knowledge sync).

---

## 📋 DAFTAR PRIORITAS EKSEKUSI PLAN V3

---

### 🎨 PRIORITAS 1: Redesain Total Landing Page (`backend/public/index.html` & `style.css`)
> **Tujuan:** Menciptakan pengalaman visual berkelas dunia (Apple Cupertino / Linear aesthetic) yang menyambut pengguna awam dengan hangat dan memperagakan kecanggihan fitur Telmy secara visual.

- [x] **1.1. Visual Identity & Hero Section Hangat**:
  - **Headline Bersahabat:** *"Pengisian Formulir Resmi Kini Tak Lagi Menakutkan"* / *"Fill Out Any Official Form Without Stress"*.
  - **Subheadline Humanis:** Menjelaskan bahwa Telmy adalah asisten ramah yang duduk manis di samping browser Anda, menjelaskan setiap pertanyaan dalam kata-kata sederhana, satu demi satu.
  - **Mascot Avatar Teaser:** Visual avatar robot Telmy yang ramah dengan gelombang suara WaveNet menyapa pengguna.
  - **Tombol CTA Ganda:**
    * Tombol Utama: `[ ⚡ Pasang di Chrome — Gratis ]` (Link ke download / webstore).
    * Tombol Sekunder: `[ 🎮 Coba Demo Interaktif Langsung ]` (Scroll halus ke simulator form).

- [x] **1.2. Interactive Live Sidepanel Simulator (Taman Bermain Pengisian Form)**:
  - Kotak simulasi interaktif berdampingan (*Split-View Canvas*):
    * **Sisi Kiri:** Cuplikan formulir resmi (misal: Formulir Permohonan Visa / Beasiswa Internasional) dengan field nyata: *Full Legal Name*, *Passport Number*, *Date of Birth*, *Emergency Contact*.
    * **Sisi Kanan:** Tampilan simulasi Chrome Sidepanel Telmy aktif yang dapat diklik pengguna:
      - Menampilkan lencana nomor kolom 1, 2, 3.
      - Klik kolom untuk melihat penjelasan ramah Telmy dan contoh data.
      - Tombol simulasi `[ 🎙️ Dengarkan Suara Telmy ]` yang memutar audio sambutan TTS nyata.
      - Tombol `[ ⚡ 1-Click AutoFill ]` yang mengisi simulasi formulir secara instan.
      - Tombol `[ 🚦 Audit Form ]` yang menampilkan lampu hijau/kuning/merah Traffic Light.

- [x] **1.3. Showcase 6 Fitur Pilar Utama (Kartu Visual Modern)**:
  1. **🎙️ Voicebot & Avatar Bicara:** Penjelasan lisan dengan suara Google WaveNet alami dalam 11 bahasa, cocok untuk mereka yang lelah membaca teks panjang.
  2. **🛡️ Brankas Zero-Knowledge (6-Digit PIN):** Data profil Anda digembok di laptop Anda sebelum pernah disentuh internet (setara standar keamanan Bitcoin/Perbankan).
  3. **📤 Ekstraksi Dokumen Cerdas (KTP, Paspor, Ijazah):** Upload foto atau PDF dokumen identitas Anda; AI Gemini mengekstrak data penting secara otomatis dengan garansi file fisik segera dihancurkan permanen (*Zero Document Retention*).
  4. **⚡ 1-Click AutoFill Form:** Isi formulir puluhan kolom dalam 1 detik dengan pencocokan alias cerdas dan perlindungan lewati password/CVV secara ketat.
  5. **🚦 Traffic Light Pre-Submission Auditor:** Pengecekan otomatis sebelum kirim form; mendeteksi masa berlaku paspor kurang dari 6 bulan, salah tulis gelar, atau kesalahan format.
  6. **📄 Panduan Formulir PDF & Certified Exporter:** Buka formulir PDF resmi kedutaan langsung di Chrome, pandu pengisian, dan unduh hasil formulir terisi rapi siap cetak.

- [x] **1.4. Tabel Komparasi: Cara Tradisional vs. Bersama Telmy.ai**:
  - Kolom *"Tanpa Telmy"*: Bingung istilah hukum (Apostille/TIN), salah ketik berakibat penolakan visa, panik sendirian tengah malam, form terjemahan Google Translate hancur.
  - Kolom *"Dengan Telmy"*: Panduan langkah-demi-langkah ramah, validasi otomatis, data terisi 1 detik, aman terenkripsi 100%.

- [x] **1.5. FAQ Komprehensif untuk Orang Awam**:
  - Pertanyaan seputar keamanan data: *"Apakah admin Telmy bisa melihat KTP saya?"* (Jawaban: Tidak, berkat enkripsi Zero-Knowledge dan Zero Retention).
  - *"Apakah Telmy menyimpan nomor kartu kredit atau password?"* (Jawaban: Tidak pernah, seluruh kolom sensitif secara ketat dilewati oleh sistem).
  - *"Apakah bisa dipakai untuk formulir bahasa asing?"* (Jawaban: Ya, Telmy memahami formulir dalam bahasa apapun dan menjelaskan dalam 11 bahasa ibu).

---

### 🌐 PRIORITAS 2: Sistem Switcher 11 Bahasa JAPAC di Landing Page
> **Tujuan:** Memastikan pengguna dari seluruh kawasan Asia Pasifik dan global (Jepang, Korea, Cina, Vietnam, Thailand, India, Filipina, Malaysia, Indonesia, Global English) dapat menikmati landing page dalam bahasa ibu mereka secara fasih.

- [x] **2.1. Dropdown Bahasa Berbendera SVG Elegan**:
  - Dropdown navigasi mini responsif dengan ikon bendera SVG asli (konsisten dengan Sidepanel di P5).
  - Opsi:
    1. 🇬🇧 English (`en`)
    2. 🇮🇩 Indonesia (`id`)
    3. 🇯🇵 日本語 (`ja`)
    4. 🇰🇷 한국어 (`ko`)
    5. 🇨🇳 简体中文 (`zh`)
    6. 🇹🇼 繁體中文 (`zh-TW`)
    7. 🇻🇳 Tiếng Việt (`vi`)
    8. 🇹🇭 ไทย (`th`)
    9. 🇮🇳 हिन्दी (`hi`)
    10. 🇵🇭 Filipino (`fil`)
    11. 🇲🇾 Melayu (`ms`)

- [x] **2.2. Kamus Translasi Lengkap Landing Page (`landing-i18n.js`)**:
  - Membuat modular script translasi khusus landing page yang memuat seluruh teks antarmuka:
    * Menu Navigasi (Home, How it Works, Features, Security, Pricing, FAQ, Demo, Sign In, CTA).
    * Hero headline, subheadline, badges.
    * Fitur-fitur pilar dan deskripsi ramahnya.
    * Komponen simulasi form interaktif.
    * Janji keamanan privasi Zero-Knowledge.
    * Pertanyaan & Jawaban FAQ.
    * Teks footer dan hak cipta.
  - Penyimpanan preferensi bahasa pengguna di `localStorage` sehingga ketika halaman di-refresh, bahasa tetap konsisten.

---

### 💼 PRIORITAS 3: Redesain Member Area & Web Vault (`backend/public/dashboard.html`)
> **Tujuan:** Menyediakan portal dashboard pengguna yang bersih dan fungsional, di mana pengguna dapat mengelola data profil terenkripsi Zero-Knowledge, melihat riwayat formulir, dan memeriksa kuota.

- [x] **3.1. Web Client-Side Encryption (CSE) Vault di Dashboard**:
  - Mengintegrasikan modul `crypto-vault.js` langsung ke dalam halaman dashboard web.
  - **Modal Buka Kunci Brankas Web:**
    * Saat pengguna membuka tab *Profile & Documents*, muncul kotak gembok elegan: *"Masukkan 6-Digit Master PIN Anda"*.
    * Web Crypto API (`window.crypto.subtle`) mendekripsi ciphertext envelope yang diunduh dari Firestore langsung di browser pengguna.
    * Server Cloud Run maupun database tetap *Zero-Knowledge* (hanya mentransfer blob terenkripsi).
  - **Manajemen Kartu Identitas & Dokumen:**
    * Pratinjau dokumen terdaftar (KTP, Paspor, Ijazah).
    * Daftar field profil terverifikasi dengan fitur Edit Nilai, Hapus, dan Tambah Field Kustom.
    * Tombol *Wipe Vault* untuk menghapus bersih data cloud dan lokal kapan saja.

- [x] **3.2. Form History & Saved Drafts Manager**:
  - Tab riwayat formulir menampilkan daftar formulir yang pernah dibantu oleh Telmy.
  - Kemampuan mengunduh ringkasan pengisian atau membuka kembali formulir terkait.

- [x] **3.3. Pelacak Kuota & Langganan Transparan**:
  - Kartu visual kuota: Menampilkan sisa form gratis, kredit Pay-as-you-go, atau status Pro Subscription.
  - Tombol upgrade yang terhubung dengan simulasi checkout atau integrasi pembayaran.

- [x] **3.4. Detektor Ekstensi Telmy di Browser**:
  - Dashboard secara otomatis mengirim pesan eksternal (`chrome.runtime.sendMessageExternal`) untuk memeriksa apakah ekstensi Telmy sudah terpasang.
  - Jika belum terpasang: Tampilkan banner ramah *[ ⬇️ Pasang Ekstensi Telmy untuk Mengaktifkan Asisten di Web Ini ]*.
  - Jika sudah terpasang: Tampilkan lencana hijau *[ ✓ Ekstensi Telmy Aktif & Terhubung ]*.

---

### 📖 PRIORITAS 4: Penyusunan Spesifikasi Teknis Komprehensif di `README.md`
> **Tujuan:** Menyusun dokumentasi kelas satu (Google Hackathon & Google Expert Grade) yang mendemonstrasikan secara transparan, mendalam, dan meyakinkan bagaimana Telmy.ai mengeksploitasi seluruh potensi teknologi Google secara maksimal.

- [x] **4.1. Ekosistem Google Chrome Extension (Manifest V3 Deep-Dive)**:
  - **`chrome.sidePanel` API:** Pemanfaatan `setPanelBehavior({ openPanelOnActionClick: true })` untuk menghadirkan pengalaman asisten mendampingi tab pengguna secara native tanpa merusak layout CSS halaman portal web tujuan.
  - **`chrome.scripting` API:** Pemuatan skrip ladder on-demand (`scanner.js`, `highlighter.js`, `translator.js`, `content-main.js`) secara non-destruktif ke halaman utama dan seluruh subframe (iframe kedutaan).
  - **`chrome.tabs` & `chrome.runtime` Messaging Architecture:** Pola komunikasi asynchronous 3-arah yang andal antara Active Tab DOM, Extension Background Service Worker, dan Sidepanel Controller.
  - **`chrome.storage.local` Security Partitioning:** Penyimpanan data lokal untuk ciphertext envelope dan session caching terisolasi.
  - **`chrome.runtime.onMessageExternal`:** Jembatan autentikasi aman tanpa refresh (*seamless handoff*) antara member area web (`https://telmy.web.app` / localhost) dengan ekstensi browser.
  - **Native Browser Web Crypto API (`window.crypto.subtle`):** Standar kriptografi hardware-accelerated murni (PBKDF2 100.000 iterasi SHA-256 + AES-GCM 256-bit) tanpa dependensi eksternal pihak ketiga yang berat.
  - **Web Audio API & Native Speech Recognition:** Pengolahan audio mikrofon Push-to-Talk dan analisis frekuensi audio untuk sinkronisasi bibir (*lip-sync*) maskot avatar SVG interaktif secara real-time.

- [x] **4.2. Arsitektur Google Cloud Run & Serverless Backend**:
  - Konfigurasi stateless containerized Express.js di Cloud Run (`https://telmy-ai.cloud.run`).
  - Auto-scaling 0 hingga N instances dengan latensi rendah di kawasan JAPAC.
  - Kebijakan *Zero Physical Document Retention*: Dokumen identitas fisik (KTP/Paspor) hanya disimpan sementara di buffer memori RAM saat diproses, lalu segera dihancurkan permanen dengan penghapusan buffer memori.

- [x] **4.3. Implementasi Model Google Generative AI (Gemini Multimodal)**:
  - **Multimodal Document Understanding:** Pemanfaatan Gemini 2.5 Flash-Lite untuk membaca dokumen formulir PDF multihalaman, scan KTP buram, paspor miring, hingga formulir bertuliskan tangan dengan penanda *Uncertainty Notice* yang jujur.
  - **Zero-Shot Bureaucratic Entity Extraction:** Prompt terstruktur menghasilkan payload JSON kanonikal dengan skema key-value dan sinonim aliases.
  - **Context-Aware Form Translation:** Penerjemahan formulir dengan menjaga glosarium istilah resmi agar tidak salah arti (misal: *Apostille*, *TIN*, *NIK* tidak diterjemahkan sembarangan).

- [x] **4.4. Google Cloud Text-to-Speech (WaveNet Neural Voice)**:
  - Pemanfaatan sintesis suara neural WaveNet dalam 11 bahasa JAPAC (`en-US-Wavenet-F`, `id-ID-Wavenet-A`, `ja-JP-Wavenet-B`, `ko-KR-Wavenet-A`, dll.) dengan modulasi pitch dan speaking rate yang menenangkan pengguna.

- [x] **4.5. Google Firebase (Authentication & Cloud Firestore)**:
  - Firebase Google Sign-In untuk identitas akun lintas perangkat.
  - Cloud Firestore untuk sinkronisasi *ciphertext envelope* brankas Zero-Knowledge (database hanya melihat hash dan string terenkripsi, tidak pernah melihat plaintext nama atau NIK).

- [x] **4.6. Diagram Arsitektur Interaktif & Panduan Instalasi Lokal**:
  - Diagram alur Mermaid terkini yang mencerminkan pembaruan Plan V2 dan V3.
  - Panduan instalasi langkah-demi-langkah bagi evaluator (cara clone, install dependensi, menjalankan backend lokal, dan memuat ekstensi di `chrome://extensions`).

- [x] **4.7. Dokumentasi Rinci Alur 5 Fitur Utama (End-to-End Technical Breakdown)**:
  - **1. Telmy Voice Bot**: Input suara Push-to-Talk $\rightarrow$ Alur izin mikrofon tab `request-mic.html` $\rightarrow$ Background Service Worker $\rightarrow$ Cloud Run `POST /api/chat` $\rightarrow$ Gemini 2.5 Flash-Lite $\rightarrow$ Google Cloud WaveNet TTS 11 bahasa $\rightarrow$ Web Audio API AnalyserNode $\rightarrow$ Lip-sync avatar robot SVG 60 FPS.
  - **2. Telmy Chat Bot**: Text input di Sidepanel $\rightarrow$ Ekstraksi konteks DOM aktif via `scanner.js` $\rightarrow$ Vektorisasi `gemini-embedding-001` (3.072d) $\rightarrow$ Cosine similarity match di Firestore ($\ge 0.90$ bebas biaya token) $\rightarrow$ Gemini 2.5 reasoning $\rightarrow$ Partisi penyimpanan per-domain di `chrome.storage.local`.
  - **3. Official PDF Form & Certified Exporter**: Deteksi tab PDF aktif via `FETCH_ACTIVE_TAB_DOCUMENT` atau dropzone $\rightarrow$ Kompresor kanvas klien $\rightarrow$ Cloud Run $\rightarrow$ Gemini Multimodal Vision membaca tabel, stempel, tulisan tangan $\rightarrow$ Checklist dan panduan seksi di sidepanel $\rightarrow$ Kompilasi 100% offline via `pdf-lib` menghasilkan PDF resmi terisi.
  - **4. 1-Click Smart AutoFill & Zero-Knowledge Vault**: Upload KTP/Paspor/Ijazah $\rightarrow$ Ekstraksi memori Cloud Run & Gemini Multimodal dengan kebijakan *Zero Physical Document Retention* (RAM segera dihancurkan) $\rightarrow$ Enkripsi lokal Web Crypto API (PBKDF2 100.000 iterasi + AES-GCM 256-bit) dengan 6-Digit Master PIN $\rightarrow$ Simpan ciphertext di Firestore $\rightarrow$ Saat tombol AutoFill ditekan: dekripsi di RAM $\rightarrow$ Content script fuzzy & alias matching $\rightarrow$ Trigger event DOM `input` & `change` $\rightarrow$ Lewati password/CVV secara ketat.
  - **5. Cross-Device & Cross-Browser Sync via Auth**: Multi-browser (Chrome, Firefox, Edge, Web Dashboard) $\rightarrow$ Firebase Google Sign-In $\rightarrow$ Jembatan `onMessageExternal` $\rightarrow$ Ambil ciphertext envelope dari Firestore $\rightarrow$ Masukkan 6-Digit PIN $\rightarrow$ Web Crypto API dekripsi di memori perangkat $\rightarrow$ Terbukti *Zero-Knowledge* (server & database tidak pernah memegang kunci).

---

## 🚦 Status Alur Kerja Eksekusi Plan V3 (100% SELESAI ✅)

1. [x] **Langkah 1 (Selesai):** Redesain struktur dan konten Landing Page ([index.html](file:///d:/webdev/laragon/www/telmy/backend/public/index.html) dan [style.css](file:///d:/webdev/laragon/www/telmy/backend/public/style.css)) berestetika Apple Cupertino yang bersahabat, manusiawi, dan dilengkapi Interactive Live Split-View Simulator (Field 1-3, simulasi audio WaveNet, 1-Click AutoFill, dan Pre-Submission Auditor).
2. [x] **Langkah 2 (Selesai):** Membangun modular sistem multi-bahasa ([landing-i18n.js](file:///d:/webdev/laragon/www/telmy/backend/public/landing-i18n.js)) untuk 11 bahasa JAPAC di landing page beserta pemilih bendera SVG elegan.
3. [x] **Langkah 3 (Selesai):** Memperbarui Member Area ([dashboard.html](file:///d:/webdev/laragon/www/telmy/backend/public/dashboard.html)) dengan fungsionalitas Web Zero-Knowledge Vault (6-Digit PIN via [crypto-vault.js](file:///d:/webdev/laragon/www/telmy/backend/public/crypto-vault.js)), manajemen kartu dokumen terverifikasi (KTP, Paspor, Ijazah), dan detektor ekstensi Chrome.
4. [x] **Langkah 4 (Selesai):** Memperbarui [README.md](file:///d:/webdev/laragon/www/telmy/README.md) secara menyeluruh dengan dokumentasi spesifikasi teknis mendalam dan 5 diagram alur Mermaid yang menguraikan siklus end-to-end (User Input $\rightarrow$ Chrome Native MV3 $\rightarrow$ Google Cloud Run $\rightarrow$ Gemini 2.5 Multimodal $\rightarrow$ Firebase RAG $\rightarrow$ Google Cloud TTS $\rightarrow$ Firebase Auth).

---

## 🏆 KESIMPULAN STATUS: 100% FINISHED & READY FOR GOOGLE EXPERT EVALUATION
Seluruh checklist Prioritas 1, 2, 3, dan 4 pada Plan V3 telah tuntas diimplementasikan, diuji, dan disinkronkan ke seluruh repositori.


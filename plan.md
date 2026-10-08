# Implementation Plan: Telmy.ai (Google Hackathon & Chrome Web Store Roadmap)
> **Dokumen Strategi, Rencana Prioritas Kerja & Pelacak Kemajuan**  
> **Target Kompetisi:** Google AI Hackathon (Kepatuhan 100% Ekosistem Google)  
> **Target Rilis:** Chrome Web Store (Jalur Kilat < 10 Hari) & Live Prototype Firebase (`telmy.id` / `telmyai.com`)  
> **Terakhir Diperbarui:** 7 Oktober 2026  

---

## 🎯 Ringkasan Eksekutif & Kepatuhan Arsitektur

1. **Stack Resmi Firebase (Google Cloud Native):**
   * **Firebase Hosting:** Menyajikan Landing Page, Kebijakan Privasi, Demo, dan Download dari folder `/backend/public` via Global CDN + SSL otomatis gratis di `https://telmy.web.app` (dan `https://telmy.firebaseapp.com`). Bebas biaya pembelian domain kustom.
   * **Firebase Functions (2nd Gen) / Cloud Run:** Backend API serverless Express.js di region `asia-southeast2` (Jakarta) dengan kuota gratis 2 juta request/bulan.
   * **Cloud Firestore:** Database penyimpanan kamus istilah resmi birokrasi, prompt cache, dan umpan balik pengguna.
   * **Firebase Storage:** Object storage penyimpanan foto profil pengguna (5 GB free tier, kompresi otomatis WebP).
   * **Firebase Authentication:** Login 1-klik dengan Google Sign-In & Email/Password.
2. **API Eksternal (Google AI & Voice Engine):**
   * **Gemini 3.5 Flash-Lite:** Model Gemini **paling murah & efisien** ($0.30 input / $2.50 output per 1M token) untuk analisis form instan dan chat co-pilot dengan latensi kilat (<800ms).
   * **Google Cloud TTS (WaveNet):** Sintesis suara berkualitas tinggi dengan jatah **Free Tier 4.000.000 (4 Juta) Karakter/Bulan GRATIS** yang mencakup 11 bahasa area JAPAC.
   * **Estimasi Biaya Operasional:** **Rp 0 / 100% GRATIS** dengan memanfaatkan domain bawaan Firebase (`*.web.app`) serta kuota gratis Firebase & Google Cloud.
3. **Strategi Fast-Track Menuju Rilis (Online Testing First):**
   * **Tahap 1 (Deploy Online Cepat):** Deploy ke domain gratis `telmy.web.app` agar backend dan landing page segera online di internet global.
   * **Tahap 2 (Sinkronisasi & Akses Ekstensi):** Sambungkan ekstensi Chrome ke endpoint API online `https://telmy.web.app/api`.
   * **Tahap 3 (Uji Coba Menyeluruh):** Lakukan testing end-to-end (form scanner, PDF guidance, voice TTS, translasi) secara langsung di internet.
   * **Tahap 4 (Submit Chrome Web Store):** Setelah seluruh pengujian online terbukti lancar dan stabil, baru fokus submit berkas `telmy-cws-clean.zip` ke Chrome Developer Dashboard.

---

## 🏆 Matriks Prioritas Kerja (Urutan Eksekusi Baru: Full AI First)

```
[Prioritas 1: Aktivasi On-Demand & Onboarding] (✅ Selesai)
                       │
                       ▼
[Prioritas 3: Translate Full Page Context-Aware] (✅ Selesai)
                       │
                       ▼
[Prioritas 2: Talking Avatar Robot & Brand UI/UX] (✅ Selesai)
                       │
                       ▼
[Prioritas 5: User Dashboard & Web Platform] ──► [Prioritas 6: Final Packaging CWS & Submit]
                                                               │
                                                               ▼
                                                [Prioritas 4: Glossary Firestore] (Di Akhir)
```

---

### 🥇 PRIORITAS 1: Perbaikan Lifecycle Aktivasi (On-Demand Only) & Onboarding Ekstensi
*Target: Ekstensi HANYA aktif saat sengaja dibuka oleh pengguna (bebas dari floating liar di background) dan memiliki layar penyambutan (onboarding).*

- [x] **1.1. Perilaku Aktivasi On-Demand (Bebas Floating Liar):**
  - **Prinsip Utama:** Ekstensi HANYA aktif ketika ikon ekstensi di toolbar diklik (atau shortcut `Alt + G`).
  - Hapus/cegah skrip content menyuntikkan badge atau floating bar secara otomatis saat halaman baru dibuka.
  - Saat mode NONAKTIF (user klik tombol [X] / Close di side panel atau klik ikon ekstensi lagi):
    * Hapus semua badge penomoran di DOM.
    * Nonaktifkan MutationObserver halaman.
    * Bersihkan seluruh visual overlay.
  - Saat mode AKTIF: Buka side panel secara eksklusif dan mulai pemindaian formulir.
- [x] **1.2. Onboarding Flow Saat Pertama Kali Install:**
  - Layar sambutan (*Welcome Wizard*) yang muncul pertama kali side panel dibuka setelah instalasi.
  - Memandu pengguna untuk:
    1. Memilih bahasa utama preferensi bawaan (English default atau salah satu dari 11 bahasa JAPAC).
    2. Login / Daftar akun melalui **Firebase Authentication** (Google 1-Click Sign-In atau Email).
    3. Memuat data profil secara otomatis: Nama, Email, Foto Profil (dari Firebase Storage / Google Auth), dan status *"Connected"*.
  - Tombol *"Mulai Jelajah Form"* untuk menyelesaikan onboarding.

---

### 🥈 PRIORITAS 2: Interactive Talking Avatar Companion (Master SVG + WaveNet Lip-Sync)
*Target: Menghadirkan asisten visual beranimasi mulut natural yang tersinkronisasi audio TTS secara real-time.*

- [x] **2.1. Master SVG Asset & Viseme Layer Architecture:**
  - File Master SVG vector murni (`telmy-avatar.svg`) berbasis maskot robot `telmy_icon.png` dengan layer terpisah:
    * `<g id="av-viseme-idle">` : Mulut tersenyum ramah santai (saat hening/jeda).
    * `<g id="av-viseme-aei">` : Terbuka lebar (vokal A, E, I / amplitudo tinggi).
    * `<g id="av-viseme-ou">` : Membulat ke depan (vokal O, U / amplitudo menengah).
    * `<g id="av-viseme-mbp">` : Terkatup rapat (konsonan M, B, P).
    * `<g id="av-viseme-wide">` : Terbuka lebar saat nada tinggi / tertawa.
    * `<g id="av-eyes-blink">` : Kedipan mata independen dengan timer acak (tiap 3–5.5 detik).
- [x] **2.2. Audio-Driven Lip-Sync via Web Audio API:**
  - Menerima audio stream MP3 dari endpoint Google Cloud TTS WaveNet.
  - Menggunakan `AudioContext` dan `AnalyserNode` (FFT) di frontend (`avatar-controller.js`) untuk membaca data frekuensi & amplitudo audio per frame (`requestAnimationFrame`).
  - Memetakan amplitudo langsung ke viseme layer SVG secara dinamis dan mulus (dengan fallback cadence synthesizer untuk browser SpeechSynthesis).
- [x] **2.3. Avatar State Machine & Tampilan UX:**
  - Tiga Status Avatar:
    * **Idle:** Ekspresi ramah netral, mata berkedip santai.
    * **Thinking:** Gestur berpikir + antena berdenyut (*pulse*) saat Gemini memproses respons chat/form.
    * **Speaking:** Animasi viseme mulut aktif mengikuti audio WaveNet TTS.
  - Integrasi UX & Branding Baru:
    * Slot avatar interaktif di header Side Panel dengan micro-interaction klik (bisa diklik untuk sapaan ramah).
    * Aset resmi `telmy_icon.png` dan `telmy_text.png` diintegrasikan ke Header, Onboarding, Chat Bubble, dan icon ekstensi (16, 32, 48, 128 px).

---

### 🥉 PRIORITAS 3: Fitur Ekstra "Context-Aware Full Page Translation" di Chatbot
*Target: Melengkapi kemampuan core Form Explainer dengan fitur terjemahan halaman utuh berbasis konteks UI/UX profesional.*

- [x] **3.1. Penegasan Core vs Fitur Tambahan:**
  - **Fungsi Utama Tetap:** AI Form Explainer per kolom (deteksi field, panduan step-by-step, contoh isian fiktif realistis, tips untuk WNA).
  - **Fitur Tambahan di Chatbot:** Terdapat tombol/penawaran aksi *"Translate Full Page (Context-Aware)"* & quick chip di Side Panel.
- [x] **3.2. Efficient DOM Batch Extraction & JSON Payload:**
  - Mengumpulkan seluruh teks label UI, navigasi, dan tombol ke dalam 1 struktur JSON ringkas (*key-value pairs*) untuk efisiensi token ekstrem.
- [x] **3.3. Hierarki Prompt Engineering Gemini (Context & UI/UX Preservation):**
  - Mengirim prompt dengan 4 lapis aturan ke `gemini-3.5-flash-lite`:
    1. *Context Statement:* Analisis domain dan topik utama halaman.
    2. *Glossary Rules Injection:* Terapkan kata `DO_NOT_TRANSLATE` dan `FORCE_TRANSLATE` (menjaga singkatan resmi NIK, KTP, NPWP, SKCK, Apostille).
    3. *UI/UX Standard Enforcement:* Pastikan elemen tombol/navigasi diterjemahkan sesuai standar industri (*"Daftar"* $\rightarrow$ *"Register / Sign Up"*, bukan *"List"*).
    4. *Structured Output:* Mengembalikan JSON berpasangan untuk penggantian teks DOM langsung di halaman secara mulus + tombol Revert ("Show Original").

---

### 🎖️ PRIORITAS 4: Domain-Based Glossary System (Firestore & Role Management)
*Target: Database glosarium per domain untuk mencegah kesalahan istilah birokrasi baku.*

- [ ] **4.1. Skema Dokumen Firestore `glossaries/{domain}`:**
  - `domain`: Nama domain web target (misal: `layanan.kemenkumham.go.id`).
  - `glossary_items`: Array aturan istilah (`term`, `action`: `DO_NOT_TRANSLATE` | `FORCE_TRANSLATE`, `target_term`).
  - `user_suggestions`: Array masukan istilah dari pengguna (`user_id`, `suggested_term`, `status`: `PENDING`).
- [ ] **4.2. Pengelolaan Hak Akses (Role Management):**
  - **Admin:** Verifikasi & pengesahan istilah glosarium resmi dari dashboard.
  - **User:** Tombol *"Ajukan Glosarium"* langsung dari panel ekstensi saat menemukan istilah lokal/khusus.

---

### 🏅 PRIORITAS 5: User Dashboard & Firebase Web Platform
*Target: Web platform terintegrasi di `telmy.id` dengan akun pengguna dan manajemen aset.*

- [x] **5.1. Firebase Authentication & Storage:**
  - Login 1-klik dengan Google Sign-In & Email.
  - Upload & kompresi foto profil pengguna ke Firebase Storage (dengan format WebP otomatis).
  - API sync `/api/user/sync` dan `/api/user/avatar`.
- [x] **5.2. Web Dashboard (`/dashboard`) Berfilosofi Desain Apple:**
  - Desain Human Interface ala Apple Cupertino (Bento Grid, frosted glass navbar, ambient radial lighting, SF Pro / Inter typography).
  - Mengelola preferensi bahasa bawaan 11 negara JAPAC secara interaktif.
  - Riwayat sesi form terpandu (Apostille Kemenkumham, e-VoA Visa) dan simulator langsung.
  - Tombol *"Sync Profile to Extension"* via `externally_connectable` & `SET_USER_SESSION`.

---

### 🏁 PRIORITAS 6: Chrome Web Store Submission Checklist & Verification
*Target: Ekstensi 100% patuh regulasi Chrome Web Store (CWS Policy 2026), lolos review otomatis tanpa memicu Manual Review.*

#### 1. File manifest.json & Hak Akses (Permissions)
- [x] **Terapkan Least Privilege Principle:** HANYA menggunakan izin yang benar-benar dipakai saat itu juga: `["storage", "activeTab", "scripting", "sidePanel"]`.
- [x] **Andalkan activeTab:** Menghindari izin luas seperti `<all_urls>`, `*://*/*`, atau `tabs`. Akses DOM hanya terjadi saat pengguna mengaktifkan ekstensi.
- [x] **Kosongkan host_permissions:** Array `host_permissions` **dikosongkan total (dihapus)**. Tidak ada host wildcard, meminimalkan skor risiko bot peninjau Google.
- [x] **Hindari Izin Berisiko Tinggi:** Nol izin berisiko tinggi (tidak ada `cookies`, `webRequest`, `declarativeNetRequest`, `management`, `desktopCapture`).
- [x] **Restriksi web_accessible_resources:** Tidak ada wildcard `matches: ["<all_urls>"]`. Dibatasi hanya untuk aset grafis spesifik (`assets/icons/*.png`, `assets/telmy-avatar.svg`, `assets/telmy_icon.png`, `assets/telmy_text.png`) pada target `["https://*/*", "http://*/*"]`.
- [x] **Jangan Ubah CSP Default:** Tidak ada modifikasi `content_security_policy`, tidak ada `unsafe-eval`, dan tidak ada izin domain eksternal.

#### 2. Kode & Arsitektur (Code Hygiene)
- [x] **Bundling 100% Berkas Lokal:** Seluruh pustaka, script, stylesheet, dan aset ikon berada 100% lokal di dalam folder ekstensi. Dilarang memuat script dari CDN (`https://...` di tag script: **0 temuan**).
- [x] **Nol Eksekusi Kode Dinamis:** Bebas 100% dari `eval()`, `new Function()`, atau `setTimeout("string_code")` (**0 temuan** di seluruh codebase).
- [x] **Jangan Menggunakan Obfuscator:** Kode ditulis dalam JavaScript bersih (un-obfuscated), mudah dibaca dan diaudit langsung oleh bot peninjau otomatis Google.
- [x] **Registrasi Event Synchronous:** Di `background/service-worker.js`, listener `chrome.runtime.onInstalled.addListener` dan `chrome.runtime.onMessage.addListener` terdaftar secara langsung di top-level (bukan di dalam fungsi async/callback).
- [x] **Bebas Unhandled Error:** Seluruh promise ditangani dengan `.catch()` atau `try/catch`. Tidak ada `Uncaught TypeError` saat ikon diklik.

#### 3. Interaksi DOM & Privasi Data
- [x] **Abaikan Bidang Input Sensitif:** Di `content/scanner.js`, selector secara eksplisit mengecualikan `:not([type="password"])` dan menerapkan fungsi filter `isSensitiveField` yang memblokir nomor kartu kredit (`cc-*`), kode CVV/CVC, OTP, token sandi, dan PIN.
- [x] **Gunakan Manipulasi DOM Standar:** Menggunakan penyuntingan CSS lokal (outline ring `.gmt-highlighted-field` dan badge numerik `.gmt-field-badge`), bukan mengubah struktur dasar HTML situs target secara destruktif.

#### 4. Panduan Pengisian Dashboard Developer Chrome
- [x] **URL Privacy Policy yang Aktif:** URL aktif di `https://telmy.id/privacy` (dan lokal `/privacy.html`) dengan penjelasan transparan mengenai data sesi pengguna.
- [x] **Permissions Justification yang Spesifik:**
  * `activeTab` & `scripting`: *"Used strictly to inject form field highlight badges and guide the user through web forms step-by-step only when the user explicitly opens the extension."*
  * `storage`: *"Used to persist user interface language preference and form guidance settings locally on the device."*
  * `sidePanel`: *"Used to provide an accessible, non-intrusive side-by-side co-pilot interface while the user fills out web forms."*
- [x] **Jujur di Formulir Privacy Practices:** Kategori data dicentang sesuai fungsi (Website Content untuk analisis field formulir; tidak mengumpulkan histori penjelajahan / web browsing history di luar tab aktif).
- [x] **Fokus Single Purpose Policy:** Ekstensi konsisten berfokus pada 1 tujuan tunggal: *"AI Form Filling Assistant & Conversational Co-pilot"*.

#### 5. Aset Visual & Branding
- [x] **Ukuran Ikon Sesuai:** Ikon PNG transparan tersedia lengkap di `assets/icons/` dalam ukuran `16x16 px`, `32x32 px`, `48x48 px`, dan `128x128 px`.
- [x] **Screenshot Jelas:** Halaman uji coba `test-page/demo_apostille.html` dan `dashboard.html` siap diambil screenshot resolusi 1280x800 px.
- [x] **Kepatuhan Merek Dagang:** Nama ekstensi adalah `"Telmy.ai: Form Filling Assistant"` (TIDAK diawali kata "Chrome", dan tidak menggunakan logo resmi Google/Chrome).

*(Catatan: Paket ZIP siap submit `telmy-cws-clean.zip` (2.1 MB) telah dibundle di root).*

---

### 📄 PRIORITAS 7: Universal PDF Form Guidance (Gemini Multimodal Document Processing)
*Target: Mengubah berkas formulir PDF pasif (unduhan visa kedutaan, beasiswa, perizinan, imigrasi) menjadi panduan interaktif step-by-step yang hangat, berdampingan (side-by-side), dan mudah dipahami.*

#### 7.1. Deteksi Ganda PDF (Tab Viewer Detection & Local Drop Zone)
- [x] **Deteksi Tab PDF Otomatis di Chrome:**
  - Saat tab Chrome aktif membuka berkas PDF (URL berakhiran `.pdf`), Side Panel Telmy otomatis memunculkan banner pemandu: *"📄 PDF Document Detected: [filename] — Open side-by-side Gemini guidance"*.
- [x] **Drop Zone Drag-and-Drop Lokal:**
  - Kotak drop zone intuitif di Side Panel (Tab Fields) dan di Web Dashboard (`/dashboard`) untuk file PDF unduhan.
  - Bersifat *User-Initiated File Upload* (bebas dari izin filesystem invasif di Chrome Web Store, 100% aman dan lolos review instan).

#### 7.2. Backend Gemini Multimodal Document Engine (`POST /api/explain-pdf`)
- [x] **Endpoint Multipart / Base64 PDF Ingestion:**
  - Terintegrasi di `backend/src/services/pdfService.js` dan route `backend/src/routes/pdf.js`.
  - Mengirim berkas langsung ke model `gemini-3.5-flash-lite` dengan MIME type `application/pdf` memanfaatkan native multimodal document understanding Google.
  - Body parser Express dikonfigurasi hingga 25MB untuk menangani formulir PDF beresolusi tinggi.
- [x] **Structured Extraction JSON Schema:**
  - Ekstraksi akurat: `documentTitle`, `summary`, `requiredAttachments`, `sections`, dan kolom terperinci (`fieldName`, `page`, `explanation`, `example`, `commonPitfall`, `foreignerNote`).
  - Dilengkapi mekanisme fallback teruji jika dokumen tidak memiliki teks terstruktur.

#### 7.3. Antarmuka Co-Pilot Berdampingan di Side Panel (Side-by-Side UX)
- [x] **Tampilan Berdampingan (Zero-Tab Switching):**
  - Sisi Kiri layar: Tab browser menampilkan formulir PDF aslinya.
  - Sisi Kanan layar: Side Panel Telmy menyajikan segmented toggle `[ 🌐 Web Page ]` dan `[ 📄 PDF Document ]` dengan panduan per bagian.
- [x] **Interactive Stepper & Voice Narration:**
  - Stepper tombol seksi/bab formulir per halaman PDF.
  - Tombol narasi audio `🔊` per kolom yang memicu TTS dengan sinkronisasi gerak bibir avatar robot Telmy.
  - Tombol cepat *"💬 Ask Telmy"* yang langsung berpindah ke tab Chat untuk tanya jawab kontekstual kolom tersebut.
  - Checklist lampiran pendukung (*#### 7.4. PDF Preparation Hub di Web Dashboard (`/dashboard`)
- [x] **Arena Persiapan & Riwayat Dokumen:**
  - Bento Card *"Universal PDF Form Guidance Hub"* di Web Dashboard (`/dashboard`) dengan Drag-and-Drop Drop Zone.
  - Visualisasi checklist berkas lampiran dengan centang interaktif dan kalkulasi kesiapan.
  - Tampilan grid responsif untuk kolom-kolom tiap seksi lengkap dengan tombol audio TTS Web Speech API.

---

## 📅 Jadwal Pelaksanaan (Timeline 10 Hari Menuju Submission)

| Hari | Fokus Utama | Target Luaran |
| :---: | :--- | :--- |
| **Hari 1** | Perbaikan Lifecycle Aktivasi (On-Demand Only, No Floating Liar) | Ekstensi bersih, hanya aktif saat ikon diklik |
| **Hari 2** | Onboarding Flow Ekstensi + Firebase Auth (Login, Profil & Connect) | Welcome wizard, Google login, load avatar foto & bahasa |
| **Hari 3** | Rancang Master SVG Talking Avatar + Layer Viseme Mulut | File SVG ringan dengan kontrol layer viseme & kedip |
| **Hari 4** | Web Audio API Lip-Sync (Sinkronisasi Audio WaveNet TTS Real-time) | Mulut avatar bergerak natural mengikuti frekuensi suara |
| **Hari 5** | Fitur Tambahan di Chatbot: "Translate Full Page (Context-Aware)" | Batch JSON payload ke Gemini 3.5 Flash-Lite & DOM swap |
| **Hari 6** | Universal PDF Form Guidance (Gemini Multimodal Document Processing) | Upload PDF kedutaan/visa di Side Panel & panduan interaktif |
| **Hari 7** | Domain-Based Glossary System di Firestore + Saran Pengguna | Koleksi Firestore `glossaries/{domain}` & role admin/user |
| **Hari 8** | **DEPLOY FIREBASE PLATFORM (DOMAIN GRATIS `telmy.web.app`)** | Segera online publik dengan SSL otomatis tanpa biaya domain |
| **Hari 9** | **END-TO-END TESTING ONLINE DENGAN EKSTENSI** | Uji coba fitur live form scanner, PDF explainer, dan voice TTS |
| **Hari 10** | **SUBMIT CHROME WEB STORE & FINAL HACKATHON SUBMISSION** | Submit ZIP bersih ke Google Developer Console & submit juri |

---

## 📝 Catatan Teknis & Parameter Konfigurasi
 
 ### Model Gemini & Suara
 * **Chat / Form Explainer:** `gemini-3.5-flash-lite` (Paling hemat biaya & latency terendah)
   * Input: $0.30 per 1M token
   * Output: $2.50 per 1M token
 * **Text-to-Speech:** `Google Cloud TTS (WaveNet)`
   * Kuota Gratis: 4.000.000 karakter / bulan GRATIS
   * Tarif overage: $4.00 per 1M karakter
   * Voice Engine Fallback: Web Speech API Browser (Client-side 100% Free)
 
 ### Layanan Firebase
 * **Hosting:** Firebase Hosting (`backend/public/`)
 * **Backend API:** Firebase Functions 2nd Gen (Express.js wrapper, region `asia-southeast2`)
 * **Database:** Cloud Firestore (`asia-southeast2`)
 * **Object Storage:** Firebase Storage (Foto profil & attachment)
 * **Auth:** Firebase Authentication (Google 1-Click + Email/Password)
 
 ### Domain & Endpoints (Strategi Gratis Bawaan Firebase)
 * **Website & Hosting Primer (Subdomain Gratis Firebase):** `https://telmy.web.app` (dan `https://telmy.firebaseapp.com`) — 100% Gratis, Global CDN, SSL aktif otomatis
 * **Domain Kustom (Opsional Masa Depan):** `https://telmy.id` atau `https://telmyai.com`
 * **API Gateway Live:** `https://telmy.web.app/api/**` (Firebase Functions / Cloud Run)
 * **Privacy Policy URL Live:** `https://telmy.web.app/privacy`
 * **Live Demo URL:** `https://telmy.web.app/demo`
 * **Dashboard URL:** `https://telmy.web.app/dashboard`
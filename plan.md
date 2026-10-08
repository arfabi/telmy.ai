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
[Prioritas 5: User Dashboard & Web Platform] ──► [Prioritas 7: Universal PDF & Interactive Writer] (⚡ PRIORITAS TINGGI)
                       │                                       │
                       ▼                                       ▼
[Prioritas 8: Monetization & Quota Engine] ─────► [Prioritas 9: Smart Fill, Auditor & Privacy Shield] (⚡ PRIORITAS TINGGI)
                       │                                       │
                       ▼                                       ▼
[Prioritas 4: Hybrid KB & Vector Search] ───────► [Prioritas 6: Final Packaging CWS & Submit]
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

### 🎖️ PRIORITAS 4: Hybrid Knowledge Base & Firestore Vector Search Engine
*Target: Mengubah basis data kamus statis menjadi sistem memori cerdas berbasis Firestore + Vector Search (`text-embedding-004`). Menghemat biaya token Gemini, memangkas latensi (<100ms), dan menjaga konsistensi istilah birokrasi & beasiswa di seluruh fitur (Web Form, Translation, dan PDF/Image).*

#### 4.1. Fondasi Firestore Live yang Telah Berjalan (Production-Ready)
- [x] **Koleksi `entries` (Kamus Kolom Formulir):**
  - Menyimpan penjelasan kolom multi-bahasa dengan status `source: "ai_draft"` atau `"verified"`.
  - Berhasil terhubung ke Cloud Firestore live (`guidemeto-bdf36`) via `backend/src/config/firebase.js`.
  - Dilengkapi metadata: `domain`, `originalLabel`, `inputType`, `section`, `officialDocUrl`, dan `reviewerNotes`.
- [x] **Koleksi Umpan Balik Pengguna (`suggestions`, `ratings`, `unmatched`):**
  - `suggestions`: Penampung koreksi/masukan pengguna dari ekstensi (`pending`, `reviewed`, `approved`).
  - `ratings`: Pelacak rating kegunaan kolom (`isHelpful: boolean`).
  - `unmatched`: Penghitung frekuensi kolom baru yang belum terverifikasi (`FieldValue.increment(1)`).
- [x] **REST API & Resolusi Ganda di Backend:**
  - Route aktif: `GET /api/dictionary?domain=...` dan `PUT /api/dictionary/:id/verify`.
  - Strategi resolusi dinamis di `.env`: `EXPLAIN_STRATEGY=AI_FIRST` (otomatis simpan draft AI ke Firestore) dan `DB_FIRST` (cek cache Firestore terlebih dahulu).

#### 4.2. Firestore Vector Search Engine (Cross-Domain Semantic Cache)
- [ ] **Firestore Vector Indexing (`text-embedding-004`):**
  - Mengatasi keterbatasan *exact string matching* (`domain:field_label`) yang sering *cache miss* akibat variasi penamaan DOM antar situs web.
  - Tambahkan field `embedding` (vektor 768 dimensi) di koleksi `entries` menggunakan Google Cloud Vertex / Gemini Embeddings API.
  - Query penelusuran semantik native Firestore:
    `db.collection('entries').findNearest('embedding', queryVector, { limit: 1, distanceMeasure: 'COSINE' })`.
  - **Threshold Similarity $\ge 0.90$:** Jika kolom memiliki arti semantik yang sama (contoh: *"Full Name in Passport"* vs *"Nama Lengkap (sesuai Paspor)"*), langsung sajikan panduan terverifikasi dari Firestore tanpa memanggil Gemini API lagi (Latensi <100ms, biaya $0).

#### 4.3. Bureaucratic & Scholarship Term Dictionary (Context-Aware RAG untuk Translasi)
- [ ] **Koleksi `bureaucratic_terms` (Aturan Preservasi Istilah Resmi):**
  - Menyimpan istilah resmi beasiswa & birokrasi internasional (contoh: NIK, SKCK, Apostille, ToR / Transcript of Records, Affidavit of Support, Schengen Visa, Alien Registration).
  - Skema data: `term`, `category`, `rule` (`DO_NOT_TRANSLATE` | `FORCE_TRANSLATE` | `EXPLAIN_IN_PARENTHESES`), `targetTranslations`, dan vektor embedding frasa.
- [ ] **Dynamic In-Context Injection di `translateService.js`:**
  - Saat menerjemahkan halaman web beasiswa/visa, lakukan vector search ringkas untuk menemukan Top-5 istilah birokrasi yang relevan di halaman tersebut.
  - Suntikkan hanya 5 istilah tersebut ke prompt Gemini sebagai aturan kamus resmi. Prompt tetap ringkas dan hemat token, namun terjemahan 100% akurat dan baku.

#### 4.4. Universal Document & PDF Template Cache (Zero-Token Re-Use)
- [ ] **Koleksi `document_templates` (Cache Formulir Populer):**
  - Menyimpan struktur hasil analisis formulir PDF/Scan beasiswa dan visa resmi (MEXT, LPDP, AAS, visa kedutaan).
  - Skema data: `templateId`, `documentTitle`, `issuingAuthority`, `fileHashSha256`, `sections`, `checklistAttachments`, dan vektor embedding judul/header.
- [ ] **Pencarian Bertingkat (Hash First, Vector Fallback):**
  - **Tingkat 1 (Exact SHA-256 Hash):** Jika berkas PDF yang diunggah memiliki hash identik dengan berkas yang pernah diproses sebelumnya, langsung kembalikan panduan lengkap secara instan tanpa memanggil Gemini (100% Zero-Token).
  - **Tingkat 2 (Semantic Vector Match):** Untuk formulir hasil foto kamera miring atau scan resolusi berbeda, cocokkan embedding header form dengan template resmi yang ada untuk memberikan panduan standar.

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
  - [x] **Checklist Lampiran Pendukung:**
    * Visualisasi checklist berkas lampiran pendukung (pasfoto, rekening koran, sponsor) dengan centang interaktif dan kalkulasi kesiapan.

#### 7.4. PDF Preparation Hub di Web Dashboard (`/dashboard`)
- [x] **Arena Persiapan & Riwayat Dokumen:**
  - Bento Card *"Universal PDF Form Guidance Hub"* di Web Dashboard (`/dashboard`) dengan Drag-and-Drop Drop Zone.
  - Visualisasi checklist berkas lampiran dengan centang interaktif dan kalkulasi kesiapan.
  - Tampilan grid responsif untuk kolom-kolom tiap seksi lengkap dengan tombol audio TTS Web Speech API.

#### 7.5. [⚡ PRIORITAS TINGGI] 1-Click Native Viewer Ingestion (Tanpa Re-Upload)
- [ ] **Auto-Fetch PDF Langsung dari Tab Aktif:**
  - Banner di Side Panel mendeteksi URL PDF aktif (`https://.../form.pdf`).
  - Tombol aksi *"⚡ Analisis Form Ini Langsung (1-Klik)"*: Background script langsung mengunduh stream PDF via `fetch(tab.url)` ➔ konversi ke Base64 ➔ kirim ke Gemini API.
  - Pengguna tidak perlu lagi mendownload PDF ke komputer lalu drag-and-drop manual.
- [ ] **Smart Fallback untuk Berkas Lokal (`file:///`):**
  - Jika URL berawalan `file:///`, berikan panduan drag-and-drop yang ramah ke drop zone Side Panel (sesuai restriksi keamanan Chrome).

#### 7.6. [⚡ PRIORITAS TINGGI] Multimodal Photo, Scan & Handwritten Document Engine
- [ ] **Dukungan Format Gambar Ekstensif:**
  - Backend `/api/explain-pdf` diperluas menjadi Universal Document Explainer yang menerima `application/pdf`, `image/jpeg`, `image/png`, dan `image/webp`.
  - Satu pipeline tunggal memanfaatkan Native Multimodal Document Understanding Gemini 3.5 Flash-Lite (tanpa butuh OCR terpisah).
- [ ] **Client-Side Image Resizer/Compressor (Canvas Optimization):**
  - Kompresi foto jepretan kamera ponsel (dari 10-15MB menjadi ~500KB) menggunakan HTML5 `<canvas>` (maksimal 2048px, JPEG 85%) sebelum Base64 di-generate. Upload instan dan hemat bandwidth.
- [ ] **Handwriting & Visual Layout Prompt Enhancement:**
  - Prompt Gemini Multimodal dioptimasi khusus untuk membaca formulir hasil scan miring, coretan tulisan tangan (handwriting recognition), stempel resmi, dan kotak centang fisik.
  - Deteksi ketidakpastian tulisan tangan: Tandai isian ambigu dengan flag `uncertaintyNotice` pada JSON response.

#### 7.7. [⚡ PRIORITAS TINGGI] Interactive PDF Form Writer & Direct Export (pdf-lib Integration)
- [ ] **Interactive Field Input di Side Panel & Dashboard:**
  - Selain melihat panduan seksi-per-seksi, pengguna dapat langsung mengisi jawaban kolom formulir pada panel Telmy.
  - Opsi *"✨ Fill from Profile"* untuk memasukkan data yang tersimpan di Profile Vault langsung ke isian PDF.
- [ ] **Client-Side PDF Text Overlay Injection (`pdf-lib`):**
  - Menggunakan library `pdf-lib` yang berjalan 100% lokal di browser pengguna.
  - Memetakan teks jawaban ke koordinat kolom PDF tanpa memerlukan server pengolah PDF berbayar (aman privasi & biaya $0).
- [ ] **1-Click Official PDF Export:**
  - Tombol aksi *"📥 Unduh PDF Terisi Resmi"*: menghasilkan file PDF asli yang telah terisi rapi dengan format font dan alignment standar dokumen kedutaan/beasiswa, siap langsung dicetak atau diunggah.

---

### 💎 PRIORITAS 8: Monetization & Usage Quota Engine (Freemium, Pay-as-you-Go, & Subscription)
*Target: Menyiapkan model bisnis SaaS yang berkelanjutan dengan unit economics tinggi (>85% net margin) melalui skema 5 form gratis awal, Pay-as-you-Go $5 (5 form tanpa batas waktu), serta Pro Subscription $9.99/bulan (50 form/bulan) dengan aturan pemotongan kuota berbatas waktu terlebih dahulu.*

#### 8.1. Skema Tingkatan Harga & Kuota (Pricing Tiers)
- [ ] **Free Tier (Gratis 5 Form Awal):**
  - Setiap pengguna baru (terautentikasi via Firebase Auth) otomatis mendapatkan kuota 5 kali analisis form gratis (*no credit card required*).
  - Cukup untuk menyelesaikan dan menguji coba pendaftaran beasiswa, visa, atau formulir portal pemerintah tanpa friksi awal.
- [ ] **Pay-as-you-Go ($5 untuk 5 Form / $1 per Form - Tanpa Kadaluwarsa):**
  - Pembelian kredit fleksibel setelah kuota gratis habis ($5 untuk 5 form).
  - **Tanpa batas waktu / tidak pernah kedaluwarsa (No Expiration).**
  - Opsi paling ramah dan ideal bagi pengguna musiman (pendaftar beasiswa luar negeri, pelancong visa, pengurus birokrasi pemerintah) yang menghindari beban komitmen langganan bulanan.
- [ ] **Pro Subscription ($9.99 per Bulan untuk Kuota 50 Form per Bulan):**
  - Kuota 50 formulir per bulan yang diperbarui (*reset/refreshed*) setiap siklus tagihan bulanan.
  - Ditargetkan untuk pengguna rutin, konsultan beasiswa/studi luar negeri, agen visa/travel, dan profesional legal.

#### 8.2. Arsitektur Data Firestore & Logika Konsumsi Kuota (Expiring-First Priority)
- [ ] **Aturan Prioritas Pemotongan Kuota (Subscription First, then PAYG):**
  - Jika pengguna memiliki kombinasi kuota (misal: pernah membeli paket PAYG lalu kemudian berlangganan Pro):
    1. **Prioritas 1 (Habiskan Kuota Berbatas Waktu):** Sistem WAJIB memotong kuota langganan Pro terlebih dahulu (`subscriptionQuotaRemaining`) karena memiliki batas waktu aktif bulanan.
    2. **Prioritas 2 (Kredit Permanen):** Kuota PAYG (`purchasedCreditsRemaining`) baru dipotong setelah kuota Pro pada bulan berjalan telah habis (0).
    3. **Prioritas 3 (Free Tier Awal):** Kuota gratis (`freeRemaining`) hanya dikonsumsi di awal bagi pengguna baru sebelum bertransaksi.
- [ ] **Skema Dokumen `users/{uid}` di Firestore:**
  - Menyimpan status kuota pengguna:
    ```json
    {
      "plan": "free", // "free" | "payg" | "pro"
      "quota": {
        "freeRemaining": 5,
        "purchasedCreditsRemaining": 0, // Kuota PAYG (Permanen/No Expiration)
        "subscriptionQuotaRemaining": 0, // Kuota Pro (50/bulan)
        "subscriptionStatus": "none", // "none" | "active" | "canceled"
        "subscriptionExpiresAt": null
      },
      "usageStats": {
        "totalFormsProcessed": 0,
        "lastActiveAt": "2026-10-08T..."
      }
    }
    ```
- [ ] **Backend Quota Verification Middleware (`backend/src/middleware/quotaMiddleware.js`):**
  - Memverifikasi kuota pengguna sebelum mengeksekusi analisis form (Web Form & PDF/Image):
    1. Periksa apakah `subscriptionQuotaRemaining > 0` dan langganan aktif: potong kuota Pro secara atomik (`FieldValue.increment(-1)`).
    2. Jika kuota Pro kosong (0) atau tidak berlangganan: periksa apakah `purchasedCreditsRemaining > 0`, lalu potong kuota PAYG (`FieldValue.increment(-1)`).
    3. Jika tidak ada PAYG: periksa apakah `freeRemaining > 0`, lalu potong kuota free (`FieldValue.increment(-1)`).
    4. Jika seluruh kuota habis (0): Kembalikan HTTP `402 Payment Required` dengan payload status kuota dan URL checkout.

#### 8.3. Antarmuka Paywall & Integrasi Payment Gateway
- [ ] **Paywall Modal di Side Panel & Web Dashboard:**
  - Saat sisa kuota menipis (sisa 1 form) atau habis (0 form), tampilkan modal penawaran yang elegan:
    * *"Pay-as-you-Go: $5 / 5 Forms ($1/form, Tanpa Batas Waktu)"*
    * *"Pro Subscription: $9.99 / Bulan (50 Forms/bulan, Refresh Otomatis)"*
  - Badge kuota live di header Side Panel menampilkan sisa kuota aktif secara transparan.
- [ ] **Payment Gateway Integration (Stripe / Lemon Squeezy):**
  - Integrasi Checkout Webhook untuk update kuota otomatis di Firestore saat pembayaran berhasil (tambah kredit PAYG atau aktivasi Pro 50 form).
  - Mendukung kartu kredit global, Apple Pay, dan Google Pay.

---

### 🛡️ PRIORITAS 9: Scholarship & Government Assistance Suite (Smart Fill, Pre-Submission Auditor, & Privacy Shield)
*Target: Menjadikan Telmy asisten menyeluruh yang aktif membantu pengisian secara aman, memvalidasi isian sebelum disubmit untuk menghindari diskualifikasi beasiswa/visa, dan menjaga privasi data sensitif 100% patuh regulasi Chrome Web Store.*

#### 9.1. [⚡ PRIORITAS TINGGI] Encrypted Profile Vault & User-Initiated 1-Click Smart Fill
- [ ] **Penyimpanan Master Profil Terenkripsi:**
  - Pengguna mengisi master profil terverifikasi sekali di Web Dashboard (`/dashboard`) atau Side Panel.
  - Data yang disimpan: Nama Paspor, No Paspor, Tanggal Terbit/Habis, NIK, Tempat/Tanggal Lahir, Nama Ibu Kandung, Kewarganegaraan, Riwayat Pendidikan, IPK (skala 4.0 & skala 100), Kontak Darurat.
  - Disimpan lokal di `chrome.storage.local` dan disinkronkan aman ke Firestore `users/{uid}/profile`.
- [ ] **User-Initiated 1-Click Smart Fill (Kepatuhan Penuh CWS Policy):**
  - **Prinsip Utama:** Tidak ada auto-fill liar/otomatis di background. Manipulasi DOM hanya terjadi saat pengguna mengklik tombol secara sadar (*explicit user gesture*).
  - Saat scanner mengenali kolom input (misal: "Nama Lengkap sesuai Paspor"), tampilkan chip tombol ramah di Side Panel: `[ ✨ Isi dengan Nama Paspor ]`.
  - Sekali klik, nilai langsung terisi ke elemen input web.
  - **Whitelist Filter Aman:** Hanya mengizinkan pengisian field demografi/profil beasiswa; mutlak memblokir field `password`, nomor kartu kredit, CVV, dan kode OTP.

#### 9.2. [⚡ PRIORITAS TINGGI] AI Pre-Submission Form Auditor (Pemeriksa Kesalahan Sebelum Submit)
- [ ] **Pemindaian Isian Formulir Menyeluruh (One-Click Audit):**
  - Tombol aksi *"🔍 Audit Form Sebelum Submit"* di header Side Panel.
  - Skrip membaca seluruh nilai yang sudah diketik pengguna pada formulir web atau isian PDF.
  - Dikirim ke endpoint `/api/audit-form` (Gemini 3.5 Flash-Lite) bersama konteks aturan resmi beasiswa/portal tersebut.
- [ ] **Laporan Audit Visual "Traffic Light" (Zero-Disqualification):**
  - 🟢 **Format Valid (Green):** Isian sudah sesuai standar (kapitalisasi nama paspor, urutan nama keluarga, format tanggal DD/MM/YYYY).
  - 🟡 **Peringatan Ambigu (Yellow Warning):** Peringatan potensi diskualifikasi (contoh: *"Anda memasukkan gelar 'M.Sc' pada kolom nama belakang; universitas Jerman biasanya menolak gelar di kolom nama"* atau *"Alamat tidak menyertakan kode pos internasional"*).
  - 🔴 **Kesalahan Fatal (Red Error):** Kesalahan fatal yang memicu penolakan (contoh: masa berlaku paspor kurang dari 6 bulan dari estimasi tanggal mulai kuliah, atau format tanggal lahir terbalik antara tanggal dan bulan).

#### 9.3. [⚡ PRIORITAS TINGGI] Privacy Shield & Client-Side PII Auto-Masking
- [ ] **Client-Side PII Masker (Local Redaction):**
  - Sebelum label form, placeholder, atau cuplikan konteks dikirim dari browser ke backend API Gemini, modul sensor lokal di `content/scanner.js` memfilter dan menyamarkan data sensitif pengguna.
  - Masking otomatis menggunakan Regex pattern: Nomor KTP $\rightarrow$ `[MASKED_NATIONAL_ID]`, Nomor Paspor $\rightarrow$ `[MASKED_PASSPORT]`, Nomor Telepon $\rightarrow$ `[MASKED_PHONE]`.
- [ ] **Indikator Transparansi Privasi di UI:**
  - Badge proteksi aktif di header Side Panel: `🛡️ Privacy Shield Active (PII Masked Locally)`.
  - Memberikan rasa aman mutlak bagi pendaftar beasiswa dan pengurus dokumen resmi, sekaligus memastikan kepatuhan 100% terhadap Chrome Web Store Privacy Policy & regulasi data global (GDPR).

---

## 📅 Jadwal Pelaksanaan (Timeline 10 Hari Menuju Submission)

| Hari | Fokus Utama | Target Luaran |
| :---: | :--- | :--- |
| **Hari 1** | Perbaikan Lifecycle Aktivasi (On-Demand Only, No Floating Liar) | Ekstensi bersih, hanya aktif saat ikon diklik |
| **Hari 2** | Onboarding Flow Ekstensi + Firebase Auth (Login, Profil & Connect) | Welcome wizard, Google login, load avatar foto & bahasa |
| **Hari 3** | Rancang Master SVG Talking Avatar + Layer Viseme Mulut | File SVG ringan dengan kontrol layer viseme & kedip |
| **Hari 4** | Web Audio API Lip-Sync (Sinkronisasi Audio WaveNet TTS Real-time) | Mulut avatar bergerak natural mengikuti frekuensi suara |
| **Hari 5** | Fitur Tambahan di Chatbot: "Translate Full Page (Context-Aware)" | Batch JSON payload ke Gemini 3.5 Flash-Lite & DOM swap |
| **Hari 6** | Universal PDF Guidance & Interactive Writer (`pdf-lib`) | Upload PDF kedutaan/visa, isi kolom interaktif & ekspor PDF |
| **Hari 7** | Hybrid Knowledge Base & Firestore Vector Search Engine | Semantic caching field form, RAG kamus istilah, & zero-token PDF |
| **Hari 8** | Scholarship Suite (Smart Fill, Auditor & Privacy Shield) | 1-Click profil fill, sanity error checker, & PII masking |
| **Hari 9** | **DEPLOY FIREBASE & END-TO-END ONLINE TESTING** | Deploy `telmy.web.app` & pengujian live ekstensi di internet |
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
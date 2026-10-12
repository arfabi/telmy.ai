# 🌟 PLAN V7: User-Controlled Accessibility Bridge
## Solusi Nyata WCAG 2.1/2.2 AA untuk Formulir E-Government (Form Spotlight, Click-to-Speak, & Visual Scale)

> **Dokumen Referensi:** UN E-Government Survey 2024 & PRD Telmy.ai (Pemandu Layanan)  
> **Status:** ✅ IMPLEMENTED & PRODUCTION READY  
> **Komponen:** `extension/content/`, `extension/sidepanel/`, `extension/styles/`  
> **Target Filosofi:** *Empowering the Citizen, Not Patching the Server.* Telmy hadir sebagai lapisan adaptif di sisi klien (*Client-Side Adaptive Layer*) yang memberdayakan lansia, penderita disabilitas, dan warga marginal agar dapat menaklukkan formulir birokrasi yang tidak aksesibel secara mandiri.

---

## 🧭 1. Latar Belakang & Rasional Desain (Mengapa Fitur Ini Ada?)

Laporan **UN E-Government Survey 2024** mengungkap fakta memprihatinkan:
1. **Hanya 5% portal lokal global yang patuh standar aksesibilitas**, menjadikannya kriteria teknologi dengan skor terburuk di dunia.
2. **Overlay Plugin Otomatis Terbukti Gagal & Dikecam**: Vendor overlay (seperti accessiBe) dituntut denda FTC hingga $1 juta karena hanya memberikan janji kepatuhan palsu tanpa menyelesaikan masalah interaksi form nyata.
3. **Mode Baca Browser Biasa Tidak Bisa Dipakai**: Chrome Reading Mode & Edge Immersive Reader secara otomatis **menghapus semua elemen `<form>` dan tombol input**, membuat portal perizinan/visa tidak bisa digunakan di mode tersebut.

### Solusi Strategis Telmy:
Alih-alih mengadopsi tumpukan fitur baca akademis dari Helperbird (*dyslexia ruler*, *kamus bergambar*, *pemecahan suku kata*), Telmy menyaring **3 Fitur Paling Esensial & Berdampak Tinggi** yang dirombak khusus untuk **penyelesaian formulir interaktif (Transactional Forms)**:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                     TELMY CLIENT-SIDE ACCESSIBILITY BRIDGE                    │
├────────────────────────┬─────────────────────────────┬────────────────────────┤
│  1. FORM SPOTLIGHT     │  2. CLICK-TO-SPEAK (TTS)    │  3. DYNAMIC SCALE &    │
│     (IN-PAGE FOCUS)    │     (ON-DEMAND AUDIO)       │     CONTRAST ENGINE    │
│                        │                             │                        │
│ Mengeliminasi distraksi│ Membacakan label & error    │ Memperbesar teks &     │
│ & cognitive overload   │ tanpa perlu screen reader   │ memperjelas kontras    │
│ visual pada form rumit │ tradisional yang rumit      │ target form seketika   │
└────────────────────────┴─────────────────────────────┴────────────────────────┘
```

---

## 🔍 2. Fitur 1: Form Spotlight (In-Page Field Dimmer & Focus)

*Diadaptasi dan ditingkatkan dari konsep "Line Focus" Helperbird, tetapi dioptimalkan khusus untuk alur formulir web birokrasi.*

### A. Konsep & Cara Kerja
Ketika pengguna mengaktifkan **Form Spotlight**:
1. **Latar Belakang Diredupkan (*Dimmed Backdrop*)**: Seluruh halaman website pemerintah ditutupi lapisan gelap semi-transparan (tingkat kegelapan 65% - 80% dengan sedikit efek blur lembut).
2. **Lubang Cahaya (*Spotlight Cutout*)**: Elemen formulir yang sedang aktif diisi (beserta label pertanyaan dan teks petunjuknya) "dilubangi" dan disorot terang benderang dengan batas cahaya (*glowing focus ring*) berukuran 3px (warna biru Telmy / kuning kontras).
3. **Auto-Advance Spotlight**: Saat pengguna selesai mengisi satu kolom dan menekan `Tab` atau klik *"Next Field"* di Telmy, lubang spotlight berpindah secara halus (*smooth scrolling & transition*) ke kolom berikutnya.

### B. Siapa yang Terbantu & Dampak Nyata
* **Lansia (Penurunan Fungsi Kognitif & Konsentrasi):**
  - *Masalah:* Lansia sering merasa kewalahan (*cognitive overload*) dan panik melihat formulir panjang dengan puluhan baris, banner pemerintah yang ramai, dan sidebar yang membingungkan.
  - *Solusi:* Dengan Spotlight, mata lansia hanya fokus pada 1 pertanyaan di depan mata. Mereka tidak terintimidasi oleh sisa form yang masih panjang.
* **Pengguna Neurodivergent (ADHD & Disleksia):**
  - Mencegah pandangan mata melompat-lompat (*eye wandering*) ke baris lain atau salah mengisi kolom yang berdekatan.
* **Pengguna Low-Vision (Mata Silau & Kursor Hilang):**
  - Mengurangi silau layar (*glare reduction*) dari latar belakang putih website pemerintah dan memastikan kursor tidak pernah hilang dari pandangan.
* **Kepatuhan WCAG Terkait:**
  - **SC 2.4.7 Focus Visible (Level AA)** — Indikator fokus yang sangat jelas dan tidak ambigu.
  - **SC 2.2.4 Interruptions (Level AAA)** — Mengeliminasi distraksi visual sekunder saat menyelesaikan tugas penting.

### C. Di Mana Fitur Ini Ditaruh (Lokasi UI & Kontrol)
1. **Di Side Panel Telmy (Quick Accessibility Bar - Bagian Atas):**
   - Terdapat ikon senter: `[ 🔦 Spotlight ]` dengan status Toggle Switch (ON / OFF).
   - Penggeser Intensitas Redup: Slider `[ 40% — 80% ]` untuk mengatur seberapa gelap background di sekitarnya.
2. **Di In-Page Floating Quick Pill:**
   - Tombol mini mengambang di pojok kanan bawah halaman web: `[ 🔦 Focus Mode ]`.
3. **Pintasan Keyboard (*Accessibility Shortcut*):**
   - Tekan `Alt + S` (S = Spotlight) untuk mengaktifkan/menonaktifkan seketika.

---

## 🗣️ 3. Fitur 2: Text-to-Speech On-Demand ("Click-to-Speak / Pointer Audio")

*Memberikan kemudahan lisan bagi warga yang tidak mahir atau tidak memiliki screen reader khusus seperti NVDA/VoiceOver.*

### A. Konsep & Cara Kerja
Screen reader profesional (NVDA, JAWS) sangat canggih tetapi memiliki kurva belajar yang sangat curam—memerlukan hafalan puluhan kombinasi tombol keyboard yang membingungkan bagi lansia.

Dengan **Click-to-Speak Telmy**:
1. Pengguna mengaktifkan mode suara on-demand. Kursor mouse berubah menjadi bentuk **Tongkat Audio / Speaker 🔊**.
2. Pengguna cukup **mengarahkan kursor (hover) atau mengklik sekali** pada bagian teks mana pun di halaman website (label input, catatan kaki, istilah hukum, maupun pesan error merah).
3. Telmy mengekstrak teks tersebut dan langsung membacakannya secara jernih menggunakan sintesis suara alami Google Cloud Voice API / Web Speech API lokal dalam bahasa pilihan pengguna.
4. Teks yang sedang dibacakan akan diberikan *word-by-word visual highlight* (warna kuning lembut) agar pengguna bisa menyinkronkan pendengaran dan penglihatan.

### B. Siapa yang Terbantu & Dampak Nyata
* **Lansia & Warga Berliterasi Rendah:**
  - *Masalah:* Banyak orang tua yang matanya lelah membaca teks syarat & ketentuan berukuran 10px berwarna abu-abu pudar di portal pemerintah.
  - *Solusi:* Cukup klik kalimat tersebut, Telmy membacakannya dengan nada ramah layaknya petugas loket yang berbicara di depan mereka.
* **Penyandang Gangguan Penglihatan Ringan hingga Sedang (Low-Vision):**
  - Tidak perlu bergantung pada screen reader sistem yang kaku dan sering membaca markup kode sampah (*"div class col-md-6 form-group"*). Telmy menyaring hanya teks manusia yang dibacakan.
* **Kepatuhan WCAG Terkait:**
  - **SC 1.2.1 Audio-only and Video-only (Level A)** — Alternatif audio langsung untuk konten tekstual.
  - **SC 3.1.5 Reading Level (Level AAA)** — Mendukung ketercernaan informasi melalui modalitas pendengaran.

### C. Di Mana Fitur Ini Ditaruh (Lokasi UI & Kontrol)
1. **Di Header Side Panel & Floating Assistant:**
   - Tombol `[ 🔊 Click & Listen ]` (Ikon speaker dengan efek pulsing hijau saat aktif).
2. **In-Page Floating Mini Player (Muncul di Bawah Layar Saat Membaca):**
   - Mini pill berisi kontrol sederhana: `[ ⏸️ Pause ]` `[ ⏹️ Stop ]` `[ 🔁 Replay ]` dan pengatur kecepatan suara `[ 0.75x | 1.0x | 1.25x ]` (sangat berguna bagi lansia yang butuh tempo bicara lambat).
3. **Opsi "Auto-Read Focused Field":**
   - Checkbox di pengaturan Telmy: *"Otomatis bacakan kolom saat berpindah kursor"* (sehingga pengguna bahkan tidak perlu mengklik tombol speaker lagi).

---

## 🎚️ 4. Fitur 3: Dynamic Visual Scale & Contrast Engine

*Penyesuaian visual dua lapis (Dual-Layer) yang menjamin keterbacaan tanpa merusak struktur dan tata letak formulir pemerintah.*

### A. Konsep & Cara Kerja
Ekstensi pembesar halaman biasa sering kali merusak tata letak web (*layout broken*), membuat tombol submit terdorong ke luar layar. Telmy membagi adaptasi visual menjadi **Dua Lapis Terisolasi**:

#### Lapis 1: In-Page Target Magnifier (Khusus Kolom Aktif)
* Ketika sebuah kolom formulir difokuskan, label teks dan kotak input tersebut diperbesar secara proporsional (+25% hingga +75%) dengan balon pembesar (*magnification bubble*).
* Menambahkan *Focus Outline* kontras tinggi (Border tebal 3px hitam di atas kuning, atau putih di atas biru) sesuai standar WCAG 2.2.

#### Lapis 2: Side Panel High-Contrast & Typography Themes (Panel Kendali Utama)
Menyediakan tema tampilan khusus di dalam Side Panel Telmy:
1. **Theme 1: Default Modern** (Slate & White — estetika bersih).
2. **Theme 2: High Contrast Yellow on Black** (Standar internasional untuk katarak & low-vision parah: latar belakang hitam pekat `#000000`, teks kuning terang `#FFEB3B`, rasio kontras > 15:1).
3. **Theme 3: Soft Sepia Reading** (Latar hangat `#FAF4E8` dan teks arang `#2D2B28` untuk lansia yang matanya sensitif terhadap cahaya biru / silau).
4. **Theme 4: Super Large Text Mode** (Font dasar 18px - 22px dengan jarak spasi baris 1.8x).

### B. Siapa yang Terbantu & Dampak Nyata
* **Lansia dengan Penyakit Mata (Katarak, Presbiopi, Degenerasi Makula):**
  - Mampu membaca petunjuk tanpa harus memicingkan mata atau menggunakan kaca pembesar fisik di depan monitor.
* **Penderita Buta Warna (Color Vision Deficiency):**
  - Portal pemerintah kerap menandai kesalahan hanya dengan warna merah pudar. Telmy menggabungkan kontras tajam dengan ikon visual tegas (`⚠️` dan `❌`) sehingga tidak bergantung pada persepsi warna semata.
* **Kepatuhan WCAG Terkait:**
  - **SC 1.4.3 Contrast (Minimum) (Level AA)** — Rasio kontras minimal 4.5:1.
  - **SC 1.4.6 Contrast (Enhanced) (Level AAA)** — Rasio kontras di atas 7:1 (Telmy mencapai 15:1 di tema Yellow/Black).
  - **SC 1.4.4 Resize Text (Level AA)** — Pembesaran teks hingga 200% tanpa kehilangan konten.
  - **SC 1.4.12 Text Spacing (Level AA)** — Spasi baris dan kata yang dapat diatur secara adaptif.

### C. Di Mana Fitur Ini Ditaruh (Lokasi UI & Kontrol)
1. **Di Pojok Kanan Atas Side Panel (Ikon Aksesibilitas Internasional `[ ♿ ]`):**
   - Mengklik ikon ini membuka **Accessibility Quick-Drawer**:
     - **Ukuran Huruf:** Slider dengan 3 preset `[ A- Standar | A Sedang (+25%) | A+ Ekstra Besar (+50%) ]`.
     - **Mode Kontras:** 4 lingkaran pilihan warna: `⚪ Normal` `🟡 Kontras Tinggi (Kuning-Hitam)` `📜 Sepia Lembut` `🌙 Dark Mode`.
     - **Toggle "Super Thick Focus Ring":** Checkbox untuk mengaktifkan garis penyorot tebal di formulir website.
2. **Persistent Storage:**
   - Semua pengaturan disimpan di `chrome.storage.local`. Sekali lansia mengatur ukuran "A+ Besar" dan tema "Kuning-Hitam", Telmy akan selalu mengingatnya di setiap situs web pemerintah yang mereka kunjungi.

---

## 🏗️ 5. Matriks Penempatan Antarmuka (UI Placement Architecture)

Bagaimana ketiga fitur ini diletakkan secara harmonis tanpa membuat antarmuka terasa penuh (*cluttered*):

```
┌──────────────────────────────────────────────────────────────────┐
│                   CHROME NATIVE SIDE PANEL                       │
├──────────────────────────────────────────────────────────────────┤
│ [ Telmy.ai Logo ]                  [ 🔦 Spotlight ]  [ ♿ Display]│ <-- HEADER TOOLBAR
├──────────────────────────────────────────────────────────────────┤
│ 🤖 TALKING AVATAR (LIP-SYNC & REAKSI EMOSIONAL)                  │
│ "Halo Ibu Mariam! Jangan khawatir, saya bantu isi formulir ini." │
├──────────────────────────────────────────────────────────────────┤
│ 🔊 QUICK AUDIO CONTROL                                           │
│ [ 📢 Bacakan Halaman ]   [ 👆 Klik & Dengar Elemen ]              │ <-- AUDIO ACTION CHIPS
├──────────────────────────────────────────────────────────────────┤
│ 📋 ACTIVE FIELD CO-PILOT (KOLOM AKTIF)                           │
│                                                                  │
│ Kolom #3: Tempat Lahir (Sesuai KTP)                              │
│ • Arti: Kota tempat Anda dilahirkan, jangan tulis nama rumah sakit│
│ • Contoh Benar: "SURABAYA"                                       │
│                                                                  │
│ [ ⚡ 1-Click AutoFill dari KTP ]   [ 🔊 Dengarkan Penjelasan ]   │
├──────────────────────────────────────────────────────────────────┤
│ 🚦 PRE-SUBMISSION AUDITOR (WCAG SC 3.3.4)                        │
│ [ 🟢 12 Kolom Aman ]   [ 🟡 1 Perlu Diperiksa ]                  │
└──────────────────────────────────────────────────────────────────┘
```

### In-Page Overlay Architecture (Di Halaman Web Pemerintah):
Semua elemen visual in-page disuntikkan (*injected*) melalui **Shadow DOM (`#telmy-a11y-root`)** agar CSS website pemerintah tidak merusak styling Telmy:
1. `#telmy-spotlight-overlay`: Elemen SVG mask / CSS clip-path yang meredupkan background dan menyorot input yang aktif.
2. `#telmy-audio-wand`: Indikator kursor speaker saat mode *Click-to-Speak* aktif.
3. `#telmy-inpage-pill`: Tombol mengambang di sudut layar untuk akses cepat tanpa harus selalu menatap sidepanel.

---

## 📊 6. Lembar Perbandingan: Helperbird vs Telmy.ai

| Parameter Evaluasi | Helperbird | **Telmy.ai (Plan V7)** |
| :--- | :--- | :--- |
| **Fokus Utama** | Membaca dokumen panjang & disleksia umum | **Menyelesaikan transaksi & formulir birokrasi e-gov** |
| **Fokus Visual** | Line Focus (Penggaris baris teks 1-3 baris) | **Form Spotlight (Meredupkan web & menyorot input aktif)** |
| **Bantuan Audio** | TTS umum membaca artikel dari atas ke bawah | **Contextual Field TTS + Click-to-Speak + Avatar Lisan** |
| **Dukungan Lansia** | Pasif (pengaturan font & warna) | **Proaktif (AI membimbing arti kolom & menolak form salah)** |
| **Interaksi Input** | Hanya prediksi kata saat mengetik manual | **1-Click AutoFill dari KTP/Paspor + Voice Input** |
| **Pencegahan Galat** | ❌ Tidak ada fitur audit formulir | **Pre-Submission Auditor (WCAG 3.3.4 Zero-Disqualification)** |
| **Beban Kognitif** | ⚠️ Puluhan menu kompleks di toolbar | **3 Kontrol Inti Terpadu di Header Side Panel** |

---

## 🎯 7. Rencana Eksekusi Teknis (Roadmap File Codebase)

1. **Modul Spotlight & Visual Dimmer:**
   - Path: `extension/content/spotlight.js` & `extension/content/spotlight.css`
   - Menggunakan `Element.getBoundingClientRect()` untuk menghitung koordinat lubang cahaya dinamis.
2. **Modul Click-to-Speak:**
   - Path: `extension/content/click-to-speak.js`
   - Menangkap `mouseover` dan `click` pada elemen teks/label, mengirim teks ke `service-worker.js` / Web Speech synthesis.
3. **Modul Visual Contrast & Typography:**
   - Path: `extension/sidepanel/accessibility-drawer.html`, `accessibility.css`, `accessibility.js`
   - Mengatur variabel CSS root (`--a11y-font-size`, `--a11y-bg-color`, `--a11y-text-color`).
4. **Dokumentasi & Demo:**
   - Masukkan visualisasi 3 fitur ini ke dalam demo video storyboard (`plan_story.md` Scene 04 & 06) untuk memukau juri kompetisi.

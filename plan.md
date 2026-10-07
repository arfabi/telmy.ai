# Implementation Plan & Tracking: Telmy.ai v2.0
> **Dokumen Pelacak Kemajuan & Rencana Kerja Implementasi**  
> Sumber Acuan: [PRD_ AI Form Explainer.md](file:///d:/webdev/laragon/www/telmy/PRD_%20AI%20Form%20Explainer.md)  
> Terakhir Diperbarui: 7 Oktober 2026

---

## 📊 Status Ringkasan Eksekutif

| Komponen / Kategori | Total Item | Selesai | Belum Dikerjakan | Status Progres |
| :--- | :---: | :---: | :---: | :---: |
| **Fondasi MVP (FR-1 s/d FR-15)** | 15 | 15 | 0 | 🟢 100% (Selesai) |
| **Pilar 1: Voice Engine & STT (FR-16, FR-17)** | 6 | 6 | 0 | 🟢 100% (Selesai) |
| **Pilar 2: Side Panel Chat Stream (FR-18)** | 5 | 5 | 0 | 🟢 100% (Selesai) |
| **Pilar 3: Animated Avatar & Lip-Sync (FR-19)** | 5 | 0 | 5 | 🔴 0% (Pending) |
| **Pilar 4: Robot Cursor & Automation (FR-20, FR-21, FR-22)** | 6 | 0 | 6 | 🔴 0% (Pending) |
| **Tahap Pengujian & Polishing (Sprint Tahap 4)** | 3 | 0 | 3 | 🔴 0% (Pending) |
| **Total Keseluruhan** | **40** | **26** | **14** | 🟢 **65.0%** |

---

## 1. Matriks Kebutuhan Fungsional (Functional Requirements)

### A. Fondasi MVP Telmy (FR-1 s/d FR-15) — ✅ Selesai
- [x] **FR-1: Pemindaian DOM Formulir:** Deteksi otomatis form, input, select, textarea, radio, checkbox, dan Google Form via `scanner.js`.
- [x] **FR-2: Pemetaan Metadata Kolom:** Ekstraksi label, placeholder, aria-label, name, id, dan context container tanpa mengambil nilai masukan pribadi.
- [x] **FR-3: Kamus Formulir Terverifikasi:** Integrasi database kamus istilah Firestore & Mock (`mock/mock-dictionary.json`).
- [x] **FR-4: AI Explainer Fallback:** Layanan backend Node.js + Gemini Flash (`aiService.js` / `geminiService.js`) untuk menghasilkan panduan otomatis jika tidak ada di kamus.
- [x] **FR-5: Penanda Badge Nomor:** Injeksi lencana nomor berwarna neon di samping setiap field (`highlighter.js`).
- [x] **FR-6: Spotlight & Focus:** Penyorotan visual saat field aktif atau diklik dari daftar.
- [x] **FR-7: Side Panel Antarmuka:** Panel samping 380px terintegrasi di browser dengan fitur push-page (`panel.js`, `overlay.css`).
- [x] **FR-8: Penjelasan Kontekstual & Contoh Isian:** Menampilkan deskripsi mudah dipahami, contoh isian realistis, dan format data yang diharapkan.
- [x] **FR-9: Peringatan Kesalahan Umum (*Common Pitfalls*):** Notifikasi peringatan dokumen/syarat khusus per kolom.
- [x] **FR-10: Salin Contoh Isian (*Copy Example*):** Tombol 1-klik untuk menyalin contoh teks ke clipboard.
- [x] **FR-11: Dukungan 5 Bahasa:** Dukungan translasi UI & panduan (Indonesia, English, Mandarin, Japanese, Korean).
- [x] **FR-12: Fitur Feedback & Rating:** Tombol jempol atas/bawah dan formulir saran perbaikan kolom (`feedback.js`).
- [x] **FR-13: Panel Peringkasan Halaman (*Page Summary*):** Ringkasan tujuan formulir, estimasi waktu pengisian, dan daftar dokumen yang harus disiapkan.
- [x] **FR-14: Progress Tracker Pengisian:** Indikator visual progres pengisian form (misal: 3/10 kolom terisi).
- [x] **FR-15: Pengaturan Ekstensi (Popup Settings):** Kontrol aktif/nonaktif ekstensi dan pemilihan bahasa via `popup.html`.

---

### B. Fitur Baru v2.0 (FR-16 s/d FR-22)

#### Pilar 1: Suara Interaktif (Voice Guidance & STT) — ✅ Selesai
- [x] **FR-16.1: ElevenLabs Voice TTS Gateway:** Endpoint streaming suara ElevenLabs di backend (`/api/voice/tts`) sehingga API key aman di server.
- [x] **FR-16.2: Auto-Audio Guidance Playback:** Pemutaran audio otomatis jawaban/panduan AI via `TelmyVoice.speak` dengan fallback browser Web Speech API.
- [x] **FR-16.3: Multilingual Voice Switching:** Otomatis menyesuaikan aksen dan suara sesuai 5 bahasa aktif (ID/EN/ZH/JA/KO).
- [x] **FR-17.1: Two-Way Conversational Voice Mode:** Tombol mikrofon responsif di input panel dan penangkapan suara real-time via `webkitSpeechRecognition`.
- [x] **FR-17.2: Auto-Silence Detection & Push-to-Talk:** Deteksi hening otomatis untuk mengirimkan ucapan pengguna langsung ke percakapan AI.
- [x] **FR-17.3: Background Audio Persistence:** Dukungan fallback cerdas dan koordinasi pesan via background service worker.

#### Pilar 2: Live Chat Stream di Side Panel — ✅ Selesai
- [x] **FR-18.1: Redesain Antarmuka Chat Side Panel:** Tab bar baru di panel (`💬 Obrolan`, `📋 Kolom`, `📌 Ringkasan`) dengan bubble chat dua arah (*User bubble* & *Assistant bubble*).
- [x] **FR-18.2: Live Speech Transcript Streaming:** Menampilkan bubble transkrip suara pengguna secara langsung saat berbicara (*interim text* ke *final text*).
- [x] **FR-18.3: Action Pills / Execution Chips:** Kartu aksi interaktif di dalam bubble AI (contoh: `[🎯 NIK]`, `[📋 Salin Format]`, `[📌 Ringkasan]`).
- [x] **FR-18.4: Hybrid Chat Input:** Pengguna bebas mengetik pesan teks manual di input field bawah atau berbicara menggunakan mikrofon.
- [x] **FR-18.5: Chat Session Persistence:** Riwayat pesan tersimpan persisten di `chrome.storage.local` per domain halaman.

#### Pilar 3: Avatar Interaktif (3 Dynamic States) — ⏳ Belum Dikerjakan
- [ ] **FR-19.1: Aset Visual Vektor Avatar:** Karakter robot pemandu ringan SVG/Canvas (< 50 KB) dengan layer tubuh, mata berkedip, mulut, dan tangan penunjuk.
- [ ] **FR-19.2: Web Audio Analyser (Audio-Reactive Lip Sync):** Pembacaan amplitudo RMS stream ElevenLabs secara real-time via `AudioContext` + `AnalyserNode` untuk menggerakkan mulut avatar.
- [ ] **FR-19.3: Avatar State 1 (Idle / Listening):** Animasi napas lembut, kedipan mata natural (tiap 3-5 detik), dan *listening pulse ring* saat mic aktif mendengarkan.
- [ ] **FR-19.4: Avatar State 2 (Speaking):** Sinkronisasi gerak mulut audio-reactive + sedikit anggukan kepala saat membacakan penjelasan umum.
- [ ] **FR-19.5: Avatar State 3 (Speaking + Pointing):** Gestur tubuh condong ke kiri dan tangan menunjuk ke arah formulir saat kursor robot / spotlight field aktif.

#### Pilar 4: Kursor Robot Virtual & Otomasi Formulir — ⏳ Belum Dikerjakan
- [ ] **FR-20.1: Virtual Robot Cursor (`#telmy-robot-cursor`):** Porting kursor neon visual dari `gmt-extension-old` dengan animasi jalur lengkung (*ease-in-out cubic-bezier*) dan jeda 800-1000ms.
- [ ] **FR-20.2: Smooth Auto-Scroll & Field Focusing:** Kursor meluncur ke elemen target, halaman otomatis melakukan `scrollIntoView({ behavior: 'smooth', block: 'center' })`, dan elemen menyala dengan spotlight neon.
- [ ] **FR-21.1: Automated Element Click:** Animasi tekan kursor + efek riak (*click ripple*) + pemicuan event mouse/pointer pada tombol navigasi (*Next*, *Simpan*), radio, dan checkbox.
- [ ] **FR-21.2: Resilient Form Input Setter:** Pengisian nilai form otomatis menggunakan *native setter injection* dan dispatch event input.
- [ ] **FR-21.3: Multi-step URL Navigator:** Panduan navigasi membuka URL tahapan form baru via service worker `chrome.tabs.update`.
- [ ] **FR-22.1: Safety Guardrails (Human-in-the-Loop):** Konfirmasi eksplisit (dialog suara / modal persetujuan) sebelum mengeklik aksi kritis (seperti tombol *Final Submit*, hapus, atau bayar).

---

## 2. Rencana Eksekusi Berdasarkan Sprint (Roadmap Sprints)

### 🚀 Sprint Tahap 1: Integrasi Voice Engine & Side Panel Chat (Hari 1 - 3) — ✅ Selesai
*Fokus: Membangun komunikasi suara ElevenLabs, STT browser, dan tampilan obrolan interaktif di side panel.*
- [x] **Task 1.1:** Setup service ElevenLabs TTS di backend (`backend/src/services/voiceService.js` dan route `/api/voice/tts` & `/api/voice/status`).
- [x] **Task 1.2:** Implementasi modul Web Speech STT (`extension/content/voice-manager.js`) untuk mendengarkan perintah pengguna dua arah.
- [x] **Task 1.3:** Redesain HTML & CSS `panel.js` & `overlay.css` untuk layout chat stream bertab (`💬 Obrolan`, `📋 Kolom`, `📌 Ringkasan`), mic pulse, dan text input bar.
- [x] **Task 1.4:** Integrasi pengiriman pesan chat ke LLM backend (`backend/src/routes/chat.js` & `chatService.js`) dan render bubble respon AI + action chips interaktif.
- [x] **Task 1.5:** Implementasi penyimpanan riwayat obrolan sesi ke `chrome.storage.local`.

---

### 🎨 Sprint Tahap 2: Animasi Avatar & Audio-Reactive Lip Sync (Hari 4 - 6)
*Fokus: Menghidupkan maskot robot Telmy dengan sinkronisasi suara real-time dan gestur dinamis.*
- [ ] **Task 2.1:** Pembuatan aset SVG avatar ramah teknologi (layer: body, eyes, mouth morph/height, arm pointing) yang disematkan ke header side panel.
- [ ] **Task 2.2:** Integrasi Web Audio API (`AudioContext` + `AnalyserNode`) untuk mengekstrak frekuensi & volume audio ElevenLabs yang sedang diputar.
- [ ] **Task 2.3:** Implementasi State Machine Controller Avatar (`idle`, `listening`, `speaking`, `pointing`).
- [ ] **Task 2.4:** Sinkronisasi state pointing saat ada instruksi penunjukan field formulir.

---

### 🤖 Sprint Tahap 3: Virtual Robot Cursor & Browser Automation Engine (Hari 7 - 9)
*Fokus: Mengadopsi teknologi kursor robot dari `gmt-extension-old` ke dalam arsitektur modern Telmy.*
- [ ] **Task 3.1:** Pembuatan modul kursor robot `extension/content/robot-cursor.js` (DOM element, CSS trails, glow, ripple).
- [ ] **Task 3.2:** Integrasi interpolasi koordinat dan animasi pergerakan kursor ke elemen form + auto-scroll.
- [ ] **Task 3.3:** Pemetaan output AI Action Router:
  - `HIGHLIGHT_FIELD(index / selector)`
  - `MOVE_CURSOR(x, y)`
  - `CLICK_ELEMENT(selector)`
  - `NAVIGATE_URL(url)`
- [ ] **Task 3.4:** Implementasi Safety Guardrails: Pencegahan klik otomatis pada elemen sensitif tanpa izin pengguna (*Human-in-the-Loop*).

---

### 🧪 Sprint Tahap 4: Pengujian Terpadu, Validasi, & Demo Polishing (Hari 10 - 12)
*Fokus: Pengujian skenario end-to-end, optimasi kecepatan respon, dan persiapan demo.*
- [ ] **Task 4.1:** Uji coba skenario lengkap pada halaman simulasi lokal (`demo_apostille.html`, `test-page`) dan Google Form asli.
- [ ] **Task 4.2:** Optimasi latensi (model ElevenLabs Turbo, streaming respons, audio buffering).
- [ ] **Task 4.3:** Pembersihan aset, penulisan dokumentasi demo, dan penyusunan panduan penggunaan juri/pengguna.

---

## 3. Langkah Berikutnya yang Siap Dikerjakan (Immediate Next Steps)
1. **Memulai Sprint Tahap 1 - Task 1.1 & 1.2:**  
   Menyiapkan integrasi suara: backend ElevenLabs gateway + Web Speech STT klien.
2. **Sprint Tahap 1 - Task 1.3:**  
   Merombak tampilan UI Side Panel di `panel.js` agar menjadi antarmuka conversational chat yang modern dan responsif.

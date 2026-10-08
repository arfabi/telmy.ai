# Telmy.ai Backend API

Backend service untuk ekstensi Chrome **Telmy.ai: Your AI form-filling assistant**, siap dijalankan di lokal dengan Node.js dan siap di-deploy langsung ke **Google Cloud Run**.

---

## 🛠️ Persiapan & Menjalankan di Lokal

### 1. Masuk ke folder backend & pastikan dependensi terinstal
```bash
cd backend
npm install
```

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi variabel berikut:
```env
PORT=8080
GEMINI_API_KEY=AIzaSy... # Dapatkan gratis di https://aistudio.google.com/
```

### 3. Setup Firebase Firestore (Opsi A)
1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat project baru (atau gunakan yang sudah ada).
2. Aktifkan **Cloud Firestore** di menu Build -> Firestore Database (pilih mode Test atau Production).
3. Buka **Project Settings** (ikon gerigi) -> tab **Service accounts**.
4. Klik **Generate new private key** (akan terunduh file `.json`).
5. Ubah nama file tersebut menjadi `serviceAccountKey.json` dan letakkan di dalam folder `backend/`:
   ```text
   backend/
   ├── serviceAccountKey.json   <-- Letakkan di sini (sudah masuk .gitignore)
   ├── src/
   ├── package.json
   └── ...
   ```

### 4. Seed Kamus Awal ke Firestore (Opsional tapi Direkomendasikan)
Untuk mengunggah seluruh data formulir Apostille AHU (5 bahasa) ke Firestore secara otomatis:
```bash
npm run seed
```

### 5. Jalankan Server di Lokal
```bash
npm run dev
```
Server akan aktif di: `http://localhost:8080`  
Cek kesehatan server di: `http://localhost:8080/health`

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/health` | Health check server, status Firestore, dan Gemini API |
| `POST` | `/api/explain` | Menjelaskan kolom form (cek Firestore dulu, jika belum ada panggil Gemini AI) |
| `POST` | `/api/feedback/suggestion` | Pengguna mengirimkan saran perbaikan / koreksi |
| `POST` | `/api/feedback/rating` | Pengguna memberikan rating (membantu / tidak) |
| `GET` | `/api/feedback/suggestions` | Daftar saran untuk Dashboard Peninjau |
| `GET` | `/api/dictionary` | Mengambil seluruh entri kamus terverifikasi |
| `PUT` | `/api/dictionary/:id/verify` | Menyetujui draf AI menjadi kamus terverifikasi |

---

## ☁️ Production URL di Google Cloud Run
Backend ini saat ini telah aktif di Google Cloud Run:
* **Production Endpoint:** `https://telmy-ai.cloud.run`
* **Health Check:** `https://telmy-ai.cloud.run/health`
* **Region:** `asia-northeast1` (Tokyo)

---

## 🛠️ Google Technology Stack (100% Google AI & Cloud Native)
1. **Google Gemini API (`gemini-3.1-flash-lite`)**: Core LLM untuk analisis formulir, chat, dan translasi.
2. **Google Gemini Embedding (`gemini-embedding-001`)**: Vektor semantik 3.072 dimensi untuk zero-token cache matching.
3. **Google Cloud Text-to-Speech (TTS WaveNet)**: Sintesis suara alami multibahasa.
4. **Google Cloud Run**: Serverless container host produksi (`https://telmy-ai.cloud.run`).
5. **Google Cloud Build**: Otomatisasi CI/CD dari repositori GitHub.
6. **Firebase Cloud Firestore**: Basis data NoSQL real-time.
7. **Firebase Vector Search**: Pencarian kemiripan vektor cosine similarity $\ge 0.90$.
8. **Firebase Authentication**: Google Identity / OAuth 2.0.
9. **Firebase Storage / Google Cloud Storage**: Penyimpanan blob dokumen form & scan.
10. **Chrome Extensions API (Manifest V3)**: Google Chrome Native Side Panel (`chrome.sidePanel`).

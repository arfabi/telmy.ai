# 🌐 Telmy.ai: Your AI Form Filling Assistant & Conversational Co-pilot

<p align="center">
  <img src="logo.png" alt="Telmy.ai Brand Logo" width="280" />
</p>

<p align="center">
  <strong>Empowering anyone to confidently understand, navigate, and complete complex bureaucracy, visa, legal, and public service web forms with an intuitive, conversational, and multilingual AI assistant.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Gemini-3.5%20Flash--Lite-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Google%20Cloud-WaveNet%20TTS-34A853?logo=googlecloud&logoColor=white" alt="Google TTS WaveNet" />
  <img src="https://img.shields.io/badge/Firebase-Firestore%20%7C%20Storage%20%7C%20Hosting-FFCA28?logo=firebase&logoColor=black" alt="Firebase Platform" />
  <img src="https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3%20Native-0071e3?logo=googlechrome&logoColor=white" alt="Chrome MV3" />
  <img src="https://img.shields.io/badge/Design-Apple%20Human%20Interface-000000?logo=apple&logoColor=white" alt="Apple HIG" />
  <img src="https://img.shields.io/badge/JAPAC%20Languages-11%20Regions-FF6F00" alt="11 JAPAC Languages" />
</p>

---

## 📌 1. The Real-World Problem

Navigating digital bureaucracy and public administration portals across Asia-Pacific (JAPAC) is frequently an intimidating, error-prone, and frustrating experience:

* 📉 **High Form Abandonment & Rejection Rates:** Public administration research indicates that **over 67% of complex online forms suffer from abandonment** or document rejection due to confusion over specialized administrative terminology (e.g., misinterpreting *Hague Apostille* vs *Embassy Legalization*, confusing *National Identity Number (NIK)* with *Family Card Number (No KK)*, or misunderstanding *Power of Attorney / Substitution Clauses*).
* 🌍 **The JAPAC Language Barrier:** Over **50 million expatriates, international students, migrant workers, and tourists** in the Asia-Pacific region struggle to access immigration portals (e-VoA, KITAS visas), business registration systems (OSS), and tax portals because government websites are written strictly in local languages.
* ❌ **Misleading Generic Machine Translators:** Standard browser translation engines often break official abbreviations or alter meaning disastrously (e.g., mistranslating official ID numbers into random nouns, or rendering critical action buttons like *"Daftar"* as *"List"* instead of *"Register / Sign Up"*), leading to immediate rejection by automated government verification pipelines.
* 👵 **Digital Divide for Non-Tech & Senior Citizens:** Lengthy administrative portals rarely provide step-by-step guidance, offer no realistic format examples, and lack natural audio assistance for elderly or visually impaired users.

---

## 💡 2. The Solution & Who It Serves

### The Solution: Telmy.ai
**Telmy.ai** is an on-demand, non-intrusive **AI Form Filling Assistant & Conversational Co-pilot** built directly into the browser's native **Chrome Side Panel**. Telmy operates seamlessly alongside web pages to:
1. **Intelligently scan and label form fields** with non-destructive guide badges without breaking the target website's original CSS or DOM.
2. Provide **field-by-field plain language explanations**, realistic input examples, common error warnings, and foreign passport guidelines.
3. Bring to life an **interactive talking robot mascot** featuring real-time audio-driven mouth viseme lip-sync powered by Google Cloud WaveNet TTS.
4. Deliver **Context-Aware Full Page Translation** across **11 Asia-Pacific (JAPAC) languages**, preserving critical legal terminology and standard UI/UX conventions.

### Who It Serves
* **Everyday Citizens & Senior Users:** Enjoy a stress-free, conversational guide that walks them through paperwork without fear of making costly mistakes.
* **Expatriates, Tourists, & International Students:** Confidently navigate local visa, residence permit, and university forms in their native language while keeping legal terminology intact.
* **Small Business Owners (SMEs):** Breeze through complex digital business licenses and tax registrations without hiring expensive legal intermediaries.
* **Low-Vision & Accessible Tech Users:** Benefit from natural voice explanations (*Text-to-Speech*) and high-contrast visual focus rings that guide the eye.

---

## ⚡ 3. Comprehensive Features

### 🎯 A. Step-by-Step Universal Form Explainer
* **Universal Form Detection:** Scans standard HTML5 inputs, Google Forms, government portals, and complex ARIA widgets (`role="radiogroup"`, `role="textbox"`, `role="combobox"`).
* **Non-Destructive Number Badges & Spotlight Rings:** Injects numbered badges next to questions and highlights the active field with an Apple-style focus ring.
* **Multi-Layer Field Guidance:**
  - *Purpose:* Explains what the field asks for in everyday human language.
  - *Realistic Example:* Provides properly formatted dummy values (e.g., 16-digit ID number, passport expiry dates).
  - *Pitfalls to Avoid:* Warns against common mistakes that trigger rejection.
  - *Notes for Foreigners:* Custom instructions for foreign passport holders / KITAS holders.

### 🤖 B. Interactive Talking Avatar Companion (Master SVG + WaveNet Lip-Sync)
* **Master Vector SVG Mascot:** Built upon Telmy’s robot mascot with independent viseme layers (`idle`, `aei`, `ou`, `mbp`, `wide`) and random organic blinking cycles.
* **Audio-Driven Lip-Sync via Web Audio API:** Utilizes `AudioContext` and `AnalyserNode` (FFT frequency analysis) in the frontend to dynamically animate the avatar's mouth in real-time matching the voice waveform of Google Cloud WaveNet TTS.
* **Playful Micro-Interactions:** Clicking the mascot triggers an Apple-style gentle bounce, friendly voice greeting, and helpful contextual tips.

### 🌐 C. Context-Aware Full Page Translation
* **Gemini 3.5 Flash-Lite 4-Layer Prompt Architecture:**
  1. *Context Statement:* Infers the page domain and bureaucratic intent (e.g., Legalization & Apostille Portal).
  2. *Glossary Preservation:* Enforces `DO_NOT_TRANSLATE` rules for legal terms (NIK, KTP, NPWP, SKCK, Apostille).
  3. *UI/UX Standard Enforcement:* Guarantees professional button conventions (*"Daftar"* $\rightarrow$ *"Register"*, not *"List"*).
  4. *In-Place DOM Swap & One-Click Revert:* Replaces text instantly while providing a 1-click *"Show Original"* button.

### 🎙️ D. Natural Voice Guidance & Privacy-First Push-to-Talk
* **Google Cloud TTS WaveNet:** Delivers ultra-natural, human-grade voice narration across regional JAPAC accents.
* **Strict Push-to-Talk:** The microphone is only active when the user explicitly holds or clicks the mic button. No background listening (*zero always-listening*), ensuring 100% user privacy and strict Chrome Web Store compliance.

### 🍎 E. User Dashboard & Web Platform (Apple Human Interface Philosophy)
* **Cupertino Bento Grid Layout:** Live at `http://localhost:8080/dashboard` (or `telmy.id`) with frosted glass navigation (`backdrop-filter: blur(20px)`), ambient radial light, and SF Pro / Inter typography.
* **11 JAPAC Languages Matrix:** Interactive selection grid with crisp vector circular SVG flag badges (eliminating Windows emoji font bugs).
* **Client-Side WebP Avatar Compressor:** Instant photo upload with automatic HTML5 Canvas compression to lightweight WebP before cloud storage.
* **One-Click Extension Sync:** Seamlessly synchronizes user profile, preferences, and language to the extension via `externally_connectable` and backend APIs.

### 🔒 F. Privacy-First Architecture & Chrome Web Store Ready
* **Strict Sensitive Field Exclusion:** Form scanner explicitly ignores `input[type="password"]`, credit card numbers (`cc-*`), CVV/CVC codes, OTPs, and authentication tokens.
* **Zero Host Permissions:** Completely omits `<all_urls>` from `host_permissions` to prevent high-risk automated review flags by Google CWS bots.
* **Zero Remote Code:** 100% of JavaScript and styling files are bundled locally without third-party CDN scripts or `eval()`.

---

## 🛠️ 4. Tech Stack (Google AI & Firebase Ecosystem)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CORE TECHNOLOGIES                                │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ 🤖 AI Reasoning & Copilot   │ Google Gemini LLM API (gemini-3.5-flash-lite)│
│ 🔊 Voice Synthesis Engine    │ Google Cloud Text-to-Speech (WaveNet MP3)    │
│ 🗄️ Cloud Database           │ Firebase Firestore (User Prefs & Glossary)   │
│ 🪣 Cloud Storage             │ Firebase Storage (WebP User Avatars)         │
│ 🚀 Serverless & Hosting      │ Firebase Hosting & Google Cloud Run          │
│ 🧩 Frontend Browser Client   │ Chrome Extension Manifest V3 Native SidePanel│
│ 🎨 User Interface Design     │ Apple Human Interface Guidelines (Cupertino) │
│ 🎵 Audio DSP & Lip-Sync      │ Web Audio API (AudioContext Analyser FFT)    │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

### Deep Dive into Technologies:
1. **Google Gemini LLM API (`gemini-3.5-flash-lite`):**
   Google's next-generation cost-efficient flagship model ($0.30 per 1M tokens, latency <800ms). Handles semantic form understanding, field explaining, conversational queries, and structured key-value translation.
2. **Google Cloud TTS WaveNet:**
   High-fidelity neural voice synthesis that produces realistic pronunciation and cadence across Asian-Pacific regional languages.
3. **Firebase Firestore:**
   High-performance NoSQL cloud database storing user profiles, form guidance sessions, and verified administrative domain glossaries.
4. **Firebase Storage:**
   Scalable object storage housing compressed WebP user profile pictures.
5. **Firebase Hosting & Google Cloud Run:**
   Serves the static web platform (`telmy.id`, Dashboard, Simulator) and handles the Node.js Express API gateway.
6. **Chrome Extension (Manifest V3):**
   Engineered using native `chrome.sidePanel`, `chrome.storage.local`, and `chrome.activeTab` for near-zero memory footprint when idle.

---

## 📂 5. Repository Directory Structure

```text
telmy/
├── logo.png                     # Official Telmy.ai Brand Logo
├── telmy_icon.png               # Telmy Robot Mascot Icon
├── telmy_text.png               # Official Telmy.ai Logotype
├── telmy-cws-clean.zip          # Production-ready Chrome Web Store package
├── plan.md                      # Development roadmap & submission checklist
├── PRD_ AI Form Explainer.md    # Product Requirement Document (PRD)
├── README.md                    # Official repository documentation (this file)
│
├── extension/                   # Manifest V3 Chrome Extension
│   ├── manifest.json            # MV3 configuration (Least Privilege, 0 host_permissions)
│   ├── background/
│   │   └── service-worker.js    # Service worker & tab synchronization
│   ├── content/
│   │   ├── content-main.js      # DOM observer & content script orchestrator
│   │   ├── scanner.js           # Form scanner (with strict sensitive input exclusion)
│   │   ├── highlighter.js       # Visual number badges & focus spotlight rings
│   │   ├── translator.js        # In-place DOM key-value text swapper & revert engine
│   │   └── overlay.css          # Number badge styling & focus animations
│   ├── sidepanel/
│   │   ├── sidepanel.html       # Apple Cupertino-styled side panel markup
│   │   ├── sidepanel.css        # Frosted glass, segmented tabs & iMessage bubbles
│   │   ├── sidepanel.js         # Chat orchestrator, form stepper & i18n controller
│   │   └── avatar-controller.js # Web Audio API FFT lip-sync & SVG viseme engine
│   └── assets/
│       ├── icons/               # Standard CWS icons (16x16, 32x32, 48x48, 128x128 px)
│       └── telmy-avatar.svg     # Master Vector SVG Talking Mascot (5 viseme layers)
│
├── backend/                     # Backend API Service (Google AI & Firebase)
│   ├── src/
│   │   ├── index.js             # Express API entry point & static file routing
│   │   ├── config/              # Firebase Admin SDK & Storage initialization
│   │   ├── routes/              # /api/explain, /api/chat, /api/translate-page, /api/user
│   │   └── services/            # geminiService.js, voiceService.js, translateService.js
│   ├── public/                  # Web Platform (Firebase Hosting)
│   │   ├── index.html           # Multilingual landing page
│   │   ├── dashboard.html       # Apple-style Cupertino Bento Grid User Dashboard
│   │   ├── connect.html         # One-click Google Sign-in & extension bridge
│   │   ├── demo.html            # Interactive live simulation playground
│   │   └── privacy.html         # Official Privacy Policy page
│   └── package.json             # Node.js backend dependencies
│
└── test-page/
    └── demo_apostille.html      # Authentic government document legalization test portal
```

---

## 🚀 6. Installation & Quick Start Guide

### Prerequisites
* **Node.js**: Version `20.0.0` or higher
* **Browser**: Google Chrome version `114+` (Supports native Chrome Side Panel)
* **API Key**: Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Launch Backend Gateway
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create or verify your `.env` file in the `backend/` folder:
   ```env
   PORT=8080
   GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
   GEMINI_MODEL=gemini-3.5-flash-lite
   GOOGLE_TTS_API_KEY=AIzaSyYourGeminiApiKeyHere
   ```
3. Start the development server:
   ```bash
   npm run dev
   # Or: node src/index.js
   ```
4. Verify server health in your browser:
   * **User Dashboard:** `http://localhost:8080/dashboard`
   * **API Health Check:** `http://localhost:8080/health`
   * **Web Landing Page:** `http://localhost:8080/`

---

### Step 2: Install Extension in Google Chrome
1. Open Google Chrome and navigate to:
   ```text
   chrome://extensions/
   ```
2. Toggle on **Developer mode** using the switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the **`extension`** directory from this repository (or extract `telmy-cws-clean.zip`).
5. **Telmy.ai: Form Filling Assistant** will appear on your Chrome toolbar.

---

### Step 3: Experience Telmy.ai on Web Forms
1. Open any web form in your browser:
   * Live Simulator: `http://localhost:8080/demo`
   * Or open the test page: [`test-page/demo_apostille.html`](file:///d:/webdev/laragon/www/telmy/test-page/demo_apostille.html)
2. Open the Telmy Side Panel by pressing **`Alt + G`** or clicking the Telmy icon on the Chrome toolbar.
3. **Explore Features:**
   * **Number Badges:** Click any numbered badge beside an input field to see an instant explanation, format examples, and hear voice guidance.
   * **Talking Avatar:** Watch the Telmy mascot mouth move in sync with the audio frequency in real time.
   * **Translate Page:** Click the *"Translate Page"* button on the top banner to translate the entire form into your preferred language while preserving official abbreviations.
   * **Interactive Chat:** Ask any question using text or press the mic button (*Push-to-Talk*).
   * **User Dashboard:** Open `http://localhost:8080/dashboard` to manage your primary language and sync profile settings to your extension in 1 click.

---

## 🛡️ 7. Chrome Web Store Compliance (CWS Policy 2026 Ready)

Telmy.ai strictly adheres to Google's **Least Privilege Principle** and automated store review criteria:

| Evaluation Criteria | Telmy.ai Implementation | CWS Review Benefit |
| :--- | :--- | :--- |
| **Host Permissions** | **Zero `host_permissions`** (Completely omitted) | Eliminates high-risk automated flags; qualifies for instant review |
| **Permissions** | `activeTab`, `scripting`, `storage`, `sidePanel` | Minimal permissions; only active when opened by the user |
| **Data Privacy** | Strictly skips passwords, credit cards, CVVs, OTPs | Fully complies with User Data Privacy policies |
| **Code Hygiene** | 100% local JS, CSS, and visual assets (Zero CDN) | Passes strict *No Remote Code Execution* security checks |
| **Dynamic Execution** | Zero `eval()`, zero `new Function()` | Eliminates security vulnerabilities |
| **Submission Package** | [`telmy-cws-clean.zip`](file:///d:/webdev/laragon/www/telmy/telmy-cws-clean.zip) (2.12 MB) | `manifest.json` located at the root of the ZIP file |

---

## 🌐 8. Multilingual Coverage across 11 JAPAC Regions

Telmy.ai supports native comprehension and interface localization for:
* 🇬🇧 **English (Global Default)**
* 🇮🇩 **Bahasa Indonesia**
* 🇯🇵 **日本語 (Japanese)**
* 🇰🇷 **한국어 (Korean)**
* 🇨🇳 **简体中文 (Simplified Chinese)**
* 🇹🇼 **繁體中文 (Traditional Chinese)**
* 🇻🇳 **Tiếng Việt (Vietnamese)**
* 🇹🇭 **ไทย (Thai)**
* 🇮🇳 **हिन्दी (Hindi)**
* 🇵🇭 **Filipino**
* 🇲🇾 **Bahasa Melayu**

---

## 📄 License & Copyright
Copyright © 2026 **Telmy.ai Team**.  
Built for the **Google AI Hackathon 2026**. All rights reserved.

# 🌐 Telmy.ai: The Friendly AI Form-Filling Companion

<p align="center">
  <img src="logo.png" alt="Telmy.ai Brand Logo" width="280" />
</p>

<p align="center">
  <strong>Transforming confusing government paperwork, visa applications, and digital bureaucracy into a warm, conversational, and stress-free journey for everyone.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20By-Google%20Gemini%20AI-4285F4?logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Natural%20Voice-Google%20Cloud%20WaveNet-34A853?logo=googlecloud&logoColor=white" alt="Google Cloud WaveNet" />
  <img src="https://img.shields.io/badge/Cloud%20Platform-Firebase%20Ecosystem-FFCA28?logo=firebase&logoColor=black" alt="Firebase Ecosystem" />
  <img src="https://img.shields.io/badge/Browser%20Extension-Google%20Chrome-0071e3?logo=googlechrome&logoColor=white" alt="Google Chrome" />
  <img src="https://img.shields.io/badge/Languages-11%20Global%20%26%20Regional-FF6F00" alt="11 Languages" />
</p>

---

## 📖 The Story: Why We Built Telmy.ai

Imagine this scenario:

> *You are sitting in front of your laptop late at night, trying to submit an urgent international visa application, a scholarship document, or a business registration. The clock is ticking.*
>
> *You are confronted with 25 intimidating input fields filled with dense legal jargon. Words like "Apostille Authentication", "Substituted Power of Attorney", or "Tax Identification Number / TIN".*
>
> *You hesitate. Does this question ask for your permanent home address or your temporary residential address? What happens if you format your ID number incorrectly? A single mistake could mean an immediate rejection, lost fees, weeks of delay, or ruined travel plans.*
>
> *You try using a generic browser translator, but it turns official legal terms into confusing gibberish and breaks critical buttons. You feel anxious, overwhelmed, and alone.*

This is not an isolated frustration. Across the world, **more than 67% of people abandon or make critical mistakes on digital public forms**. For international travelers, elderly citizens, students, and everyday individuals who aren't lawyers or tech experts, online paperwork feels like a barrier rather than a service.

### Meet Telmy: Your Patient, Friendly Co-Pilot
**Telmy.ai** was created with a simple belief: **No one should ever feel stressed or helpless when filling out a digital form.**

Telmy is a warm, smart companion that lives quietly in your browser’s side panel. When you encounter a complicated form, Telmy gently steps in alongside your page. Like a knowledgeable friend sitting right next to you, Telmy points to each field, explains what it means in plain everyday words, shows you realistic examples of how to fill it out, and even speaks the answers aloud in a natural, soothing voice.

---

## 💡 Who Is Telmy.ai For?

* ✈️ **International Travelers & Expats:** Applying for electronic visas (e-Visa), travel authorisations, or work permits abroad without getting lost in unfamiliar foreign regulations.
* 🎓 **Students & Scholarship Applicants:** Applying to international universities and foreign exchange programs where documents must be verified with precision.
* 🏢 **Small Business Owners & Entrepreneurs:** Filing business licenses, tax forms, and official permits without paying exorbitant fees to third-party consultants.
* 👴 **Senior Citizens & Non-Tech Users:** Navigating healthcare and pension portals with the comfort of voice guidance and clear, numbered visual badges.

---

## ✨ What Makes Telmy.ai Feel Magical?

### 1. 🎯 Step-by-Step Field Explainer (No More Guesswork)
* **Spotlight on What Matters:** Telmy places gentle number badges next to each question on your form and highlights the active field so you always know where you are.
* **Plain-Language Answers:** Instead of reciting dry legal definitions, Telmy answers four simple questions for each field:
  - *What does this actually mean?*
  - *What should a correct answer look like? (Realistic dummy examples)*
  - *What is the most common mistake people make here?*
  - *Is there a special rule if you are a foreign national or non-resident?*

### 2. 🤖 The Interactive Talking Avatar (A Companion with a Heart)
* Rather than looking at a cold chatbot window, you are greeted by Telmy’s friendly mascot.
* **Realistic Lip-Sync:** When Telmy speaks, its mouth moves in real-time cadence matching the voice. 
* **Expressive & Comforting:** Telmy blinks naturally, reacts when you click it, and offers reassuring words to ease form-filling anxiety.

### 3. 🌐 Smart Context-Aware Page Translation (Preserving Legal Accuracy)
* Standard translators break official terms. Telmy uses intelligent context analysis to translate entire web pages while **safeguarding official terms** (such as *Passport Number*, *Tax ID*, *Apostille Verification*, or *Civil Registry*).
* Essential buttons remain crystal clear (e.g., ensuring *"Register Now"* isn't mistranslated as *"Make a List"*).
* Prefer your original language? A single click on **"Show Original"** restores the text instantly.

### 4. 🔊 Natural Voice Companion & Push-to-Talk
* Don’t want to read dense text? Telmy reads guidance aloud using human-like, natural voice synthesis.
* Have a question? Simply click the microphone button (*Push-to-Talk*) and ask: *"What document do I need for field number 3?"* Telmy listens and replies immediately.
* **Zero Hidden Listening:** The microphone is only active when you deliberately click it. Your privacy is 100% sacred.

### 5. 🛡️ Uncompromising Privacy by Design
* **Telmy Never Touches Your Private Data:** Telmy strictly scans field labels and instructions. It is hardcoded to completely ignore and never read passwords, credit card numbers, CVVs, OTP security codes, or personal secret keys.
* **On-Demand Only:** Telmy only works when you open it. It never monitors your web browsing in the background.

---

## 🛠️ The Technology Behind the Magic

Telmy.ai leverages Google’s cutting-edge AI and cloud technologies to deliver lightning-fast, secure, and human-centered assistance:

* **🤖 Google Gemini LLM API (`gemini-3.5-flash-lite`):**  
  Provides the deep reasoning, semantic understanding, and cultural context needed to decode complex bureaucratic forms in under a second with remarkably natural language.
* **🔊 Google Cloud Text-to-Speech (WaveNet Neural Voices):**  
  Brings Telmy to life with fluid, human-grade voice narration across regional accents and multiple global languages (including English, Hindi, Japanese, and more).
* **🗄️ Firebase Firestore:**  
  Acts as the secure, real-time cloud database preserving user language preferences, form history, and verified terminology glossaries.
* **🪣 Firebase Storage:**  
  Securely stores optimized user profile avatars with zero overhead.
* **🚀 Firebase Hosting & Google Cloud Run:**  
  Powers the high-availability web platform, responsive user dashboard, and serverless backend API.
* **🧩 Google Chrome Extension (Manifest V3 Native Side Panel):**  
  Embeds the co-pilot right into the browser side-by-side with any webpage, requiring minimal system memory and zero invasive permissions.

---

## 🚀 How to Install and Experience Telmy.ai

You don't need any technical skills to try Telmy.ai!

### Step 1: Run the Backend Service
1. Open your terminal in the `backend` directory:
   ```bash
   cd backend
   npm install
   ```
2. Set your Google AI Key in `.env`:
   ```env
   PORT=8080
   GEMINI_API_KEY=your-gemini-api-key
   GEMINI_MODEL=gemini-3.5-flash-lite
   GOOGLE_TTS_API_KEY=your-gemini-api-key
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   *(The server will be ready at `http://localhost:8080`)*

---

### Step 2: Add Telmy to Google Chrome
1. Open Google Chrome and type `chrome://extensions/` in your address bar.
2. Turn on **Developer mode** (switch in the top-right corner).
3. Click the **Load unpacked** button (top-left corner).
4. Select the **`extension`** folder from this project (or load [`telmy-cws-clean.zip`](file:///d:/webdev/laragon/www/telmy/telmy-cws-clean.zip)).
5. Telmy’s friendly blue icon will appear in your Chrome toolbar!

---

### Step 3: Try It on a Real Form!
1. Open any online form, or explore our built-in simulator:
   * **Live Form Simulator:** `http://localhost:8080/demo`
   * **User Dashboard:** `http://localhost:8080/dashboard`
2. Open Telmy by pressing **`Alt + G`** or clicking the Telmy icon on your Chrome toolbar.
3. **See the Magic in Action:**
   * **Click a Number Badge:** See clear explanations and format examples appear instantly in the side panel.
   * **Listen to Telmy:** Hear the voice guide and watch the avatar's lips sync with what it says.
   * **Translate Page:** Click the top *"Translate Page"* button to view the entire form in your preferred language without losing official terms.
   * **Speak with Telmy:** Tap the microphone icon and ask a question in everyday English!

---

## 🌍 Supported Global & Regional Languages

Telmy speaks and understands 11 major languages across the Asia-Pacific region and the globe:
* 🇬🇧 **English (Global Default)**
* 🇮🇳 **हिन्दी (Hindi)**
* 🇯🇵 **日本語 (Japanese)**
* 🇰🇷 **한국어 (Korean)**
* 🇨🇳 **简体中文 (Simplified Chinese)**
* 🇹🇼 **繁體中文 (Traditional Chinese)**
* 🇻🇳 **Tiếng Việt (Vietnamese)**
* 🇹🇭 **ไทย (Thai)**
* 🇵🇭 **Filipino**
* 🇲🇾 **Bahasa Melayu**
* 🇮🇩 **Bahasa Indonesia**

---

## 🏆 Project Impact Summary

| What People Faced Before | How Telmy.ai Changes Everything |
| :--- | :--- |
| **Confusing legal jargon** causing fear and hesitation. | **Everyday human explanations** with realistic examples. |
| **High risk of application rejection** due to misinterpretation. | **Proactive warning tips** highlighting common pitfalls. |
| **Broken machine translations** destroying official abbreviations. | **Context-aware translation** keeping critical legal terms intact. |
| **Impersonal, cold web forms** with zero live support. | **A warm, friendly talking avatar companion** with natural voice. |
| **Privacy concerns** with intrusive browser extensions. | **100% privacy-first design** with zero access to passwords or cards. |

---

## 📄 License & Attribution
Created with ❤️ by the **Telmy.ai Team** for the **Google AI Hackathon 2026**.  
*Empowering digital accessibility and cross-border paperwork for all.*

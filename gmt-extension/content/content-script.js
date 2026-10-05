// GMT Content Script — Injected into every page
// Handles: floating bubble UI, overlay/spotlight, step execution, DOM summary, session persistence

(function() {
  'use strict';

  if (window.__gmtLoaded) return;
  window.__gmtLoaded = true;

  // ─── State ───
  const state = {
    panelOpen: false,
    settingsOpen: false,
    steps: [],
    currentStep: -1,
    lang: 'id',
    isListening: false,
    isProcessing: false,
    chatHistory: [],
    // Jayu additions:
    mode: 'guide', // 'guide' | 'autopilot'
    watchMode: false,
    wakeWordActive: false,
    gestureActive: false,
    audioEnabled: true,
    memory: {},
  };

  let currentHighlightedEl = null;

  // ─── SVG Icons ───
  const ICONS = {
    compass: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13l-2 5.5 5.5-2L16 5l-5 .5zM12 11c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>`,
    send: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
    stop: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v4h-4z"/></svg>`,
    check: '✓',
    settings: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`,
  };

  // ─── Build UI ───
  function buildUI() {
    const root = document.createElement('div');
    root.id = 'gmt-root';
    root.innerHTML = `
      <!-- Sleek Right-Edge Dock Tab (Replaces bottom-right floating bubble) -->
      <div id="gmt-dock-tab" title="Buka GMT (Guide Me To)">
        ${ICONS.compass}
        <span class="gmt-dock-label">GMT</span>
      </div>

      <!-- Main Panel (Expands to Right Side) -->
      <div id="gmt-panel" class="gmt-hidden">
        <div id="gmt-header">
          <div id="gmt-header-logo">${ICONS.compass}</div>
          <div id="gmt-header-title">
            <h3>Guide Me To</h3>
            <p id="gmt-status-text">Siap membantu · Ready to guide</p>
          </div>
          <button id="gmt-clear-btn" title="Chat Baru / Clear Chat" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:8px;cursor:pointer;padding:5px 8px;color:rgba(255,255,255,0.7);font-size:13px;line-height:1;transition:background 0.2s;">🧹</button>
          <button id="gmt-settings-btn" title="Settings" style="background:rgba(108,63,255,0.2);border:1px solid rgba(108,63,255,0.4);border-radius:8px;cursor:pointer;padding:5px 8px;color:white;font-size:15px;line-height:1;transition:background 0.2s;">⚙️</button>
          <button id="gmt-close-btn" title="Tutup">✕</button>
        </div>

        <!-- Control Center (User-Friendly Toggles & Mode Switcher) -->
        <div id="gmt-controls-container">
          <!-- Mode Switcher -->
          <div class="gmt-mode-selector">
            <div class="gmt-mode-switch">
              <button class="gmt-mode-pill active" id="gmt-mode-guide">
                <span class="gmt-mode-icon">🧭</span>
                <span class="gmt-mode-text">Guide Me</span>
              </button>
              <button class="gmt-mode-pill" id="gmt-mode-autopilot">
                <span class="gmt-mode-icon">⚡</span>
                <span class="gmt-mode-text">Help Me</span>
              </button>
            </div>
            <div id="gmt-mode-desc">Mode Panduan: AI menunjukkan tombol, Anda yang klik sendiri</div>
          </div>

          <!-- Feature Toggles 2x2 Grid -->
          <div class="gmt-toggle-grid">
            <!-- 1. Gesture Toggle -->
            <div class="gmt-toggle-card" id="gmt-card-gesture" title="Scroll halaman dengan lambaian tangan di kamera">
              <div class="gmt-toggle-info">
                <span class="gmt-toggle-icon">🖐️</span>
                <span class="gmt-toggle-name">Gestur</span>
              </div>
              <div class="gmt-switch" id="gmt-switch-gesture">
                <span class="gmt-switch-status">OFF</span>
                <div class="gmt-switch-knob"></div>
              </div>
            </div>

            <!-- 2. Mic / Wake Word Toggle -->
            <div class="gmt-toggle-card" id="gmt-card-wake" title="Aktifkan panggilan suara 'Halo GMT'">
              <div class="gmt-toggle-info">
                <span class="gmt-toggle-icon">🎙️</span>
                <span class="gmt-toggle-name">Mikrofon</span>
              </div>
              <div class="gmt-switch" id="gmt-switch-wake">
                <span class="gmt-switch-status">OFF</span>
                <div class="gmt-switch-knob"></div>
              </div>
            </div>

            <!-- 3. Audio / Speech Output Toggle -->
            <div class="gmt-toggle-card active" id="gmt-card-audio" title="Aktifkan / bisukan suara instruksi AI">
              <div class="gmt-toggle-info">
                <span class="gmt-toggle-icon">🔊</span>
                <span class="gmt-toggle-name">Audio</span>
              </div>
              <div class="gmt-switch active" id="gmt-switch-audio">
                <span class="gmt-switch-status">ON</span>
                <div class="gmt-switch-knob"></div>
              </div>
            </div>

            <!-- 4. Smart Watch Mode Toggle -->
            <div class="gmt-toggle-card" id="gmt-card-watch" title="Pemandu otomatis saat berpindah halaman web">
              <div class="gmt-toggle-info">
                <span class="gmt-toggle-icon">👁️</span>
                <span class="gmt-toggle-name">Watch</span>
              </div>
              <div class="gmt-switch" id="gmt-switch-watch">
                <span class="gmt-switch-status">OFF</span>
                <div class="gmt-switch-knob"></div>
              </div>
            </div>
          </div>

          <!-- Working Memory Strip -->
          <div id="gmt-memory-strip">
            <div class="gmt-memory-title" id="gmt-memory-toggle-btn">
              <span>🧠 Memori Konteks (<span id="gmt-memory-count">0</span>)</span>
              <span id="gmt-memory-arrow">▾</span>
            </div>
            <div id="gmt-memory-drawer" style="display:none;">
              <div class="gmt-memory-items" id="gmt-memory-list">
                <span style="color:rgba(255,255,255,0.3);font-size:10px;font-style:italic;">Belum ada catatan memori tersimpan...</span>
              </div>
              <button id="gmt-memory-clear-btn" class="gmt-mini-btn">Bersihkan Memori</button>
            </div>
          </div>
        </div>

        <div id="gmt-chat">
          <div class="gmt-msg gmt-ai gmt-fade-in">
            <div class="gmt-msg-avatar">🧭</div>
            <div class="gmt-msg-bubble">Halo! Saya GMT. Mau saya panduan kamu kemana? / Hi! I'm GMT. Where would you like me to guide you?</div>
          </div>

          <div class="gmt-quick-options gmt-fade-in">
            <button class="gmt-quick-btn" data-prompt="Jelaskan halaman web yang sedang saya buka ini secara detail dalam Bahasa Indonesia: Ini situs apa, apa fungsi utamanya, apa saja menu penting di sini, dan pandu saya apa saja yang bisa dilakukan di sini.">
              <span style="font-size:18px;">🌐</span>
              <div style="flex:1;">
                <div style="font-weight:600;color:#00D4FF;font-size:12.5px;">Jelaskan Halaman Ini (Explain Page)</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.5);">Pahami situs asing (China, dsb.) dalam B. Indonesia</div>
              </div>
              <span style="color:rgba(0,212,255,0.7);font-size:13px;font-weight:700;">➔</span>
            </button>

            <button class="gmt-quick-btn" data-prompt="Bantu saya cara membuat dan mengirim email di Gmail">
              <span style="font-size:18px;">✉️</span>
              <div style="flex:1;">
                <div style="font-weight:600;color:#00D4FF;font-size:12.5px;">Guide me to write email</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.5);">Panduan buat & kirim email di Gmail</div>
              </div>
              <span style="color:rgba(0,212,255,0.7);font-size:13px;font-weight:700;">➔</span>
            </button>

            <button class="gmt-quick-btn" data-prompt="Bantu saya mencari informasi di Google Search">
              <span style="font-size:18px;">🔍</span>
              <div style="flex:1;">
                <div style="font-weight:600;color:#00D4FF;font-size:12.5px;">Guide me to search on Google</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.5);">Panduan mencari info di Google</div>
              </div>
              <span style="color:rgba(0,212,255,0.7);font-size:13px;font-weight:700;">➔</span>
            </button>

            <button class="gmt-quick-btn" data-prompt="Bantu saya mencari dan menonton video di YouTube">
              <span style="font-size:18px;">🎥</span>
              <div style="flex:1;">
                <div style="font-weight:600;color:#00D4FF;font-size:12.5px;">Guide me to watch YouTube</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.5);">Panduan cari & tonton video di YouTube</div>
              </div>
              <span style="color:rgba(0,212,255,0.7);font-size:13px;font-weight:700;">➔</span>
            </button>
          </div>

          <div id="gmt-setup-row" style="text-align:center;margin-top:10px;">
            <button id="gmt-setup-btn" style="background:rgba(108,63,255,0.15);border:1px dashed rgba(108,63,255,0.5);border-radius:10px;padding:7px 14px;color:rgba(255,255,255,0.6);font-size:11px;cursor:pointer;transition:all 0.2s;">
              ⚙️ Setup API Key dulu / Setup API Key first
            </button>
          </div>
        </div>

        <div id="gmt-steps" style="display:none;"></div>

        <div id="gmt-actions" style="display:none;">
          <button class="gmt-action-btn" id="gmt-skip-btn">⏭ Skip</button>
          <button class="gmt-action-btn" id="gmt-stop-btn">⏹ Berhenti</button>
          <button class="gmt-action-btn gmt-primary" id="gmt-repeat-btn">🔁 Ulangi</button>
        </div>

        <div id="gmt-input-area">
          <input type="text" id="gmt-text-input" placeholder="Minta saya panduan... / Ask me to guide..." />
          <button id="gmt-mic-btn" title="Voice input">${ICONS.mic}</button>
          <button id="gmt-send-btn" title="Send">${ICONS.send}</button>
        </div>
      </div>

      <!-- Settings Panel -->
      <div id="gmt-settings" class="gmt-hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:12px;">
          <h4 style="margin:0;color:white;font-size:15px;font-weight:700;">⚙️ GMT Settings</h4>
          <button id="gmt-settings-close-x" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.07);border:none;color:rgba(255,255,255,0.6);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;">✕</button>
        </div>

        <div class="gmt-settings-field">
          <label>🤖 AI Provider</label>
          <select id="gmt-provider-select" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px 12px;color:white;font-size:12px;outline:none;cursor:pointer;">
            <option value="sumopod">Sumopod — DeepSeek Flash (Recommended)</option>
            <option value="gemini">Google Gemini (Fallback)</option>
          </select>
        </div>

        <div class="gmt-settings-field">
          <label>Sumopod API Key <span style="color:#00D4FF;font-size:10px;">ai.sumopod.com</span></label>
          <input type="password" id="gmt-sumopod-key-input" placeholder="sk-..." />
        </div>

        <div class="gmt-settings-field">
          <label>Gemini API Key <span style="color:rgba(255,255,255,0.3);font-size:10px;">(fallback)</span></label>
          <input type="password" id="gmt-gemini-key-input" placeholder="AIza..." />
        </div>

        <div class="gmt-settings-field">
          <label>ElevenLabs API Key <span style="color:rgba(255,255,255,0.3);font-size:10px;">(suara)</span></label>
          <input type="password" id="gmt-elevenlabs-key-input" placeholder="sk_..." />
        </div>
        <div class="gmt-settings-field">
          <label>ElevenLabs Voice ID</label>
          <input type="text" id="gmt-voice-id-input" placeholder="21m00Tcm4TlvDq8ikWAM" />
        </div>

        <div class="gmt-settings-field" style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;">
          <label style="margin:0;">🖐️ Gestur Kamera (Scroll Tangan)</label>
          <input type="checkbox" id="gmt-gesture-check" style="cursor:pointer;" />
        </div>

        <button class="gmt-save-btn" id="gmt-save-settings">Simpan / Save</button>
        <button class="gmt-save-btn" id="gmt-close-settings" style="background:rgba(255,255,255,0.1);margin-top:4px;">Tutup / Close</button>
      </div>

      <!-- Spotlight overlay -->
      <div id="gmt-spotlight" class="gmt-hidden"></div>

      <!-- Vision Reticle (Jayu Visual Bounding Box Grounding) -->
      <div id="gmt-vision-box" class="gmt-vision-reticle gmt-hidden"></div>

      <!-- Autopilot Robot Cursor -->
      <div id="gmt-robot-cursor" class="gmt-hidden">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 2L13 22L17.5 15.5L25 15L7 2Z" fill="#00D4FF" stroke="#6C3FFF" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Safety Confirmation Modal for Autopilot -->
      <div id="gmt-safety-modal" class="gmt-hidden">
        <div class="gmt-safety-title">
          <span>⚠️ Konfirmasi Aksi Penting</span>
        </div>
        <div class="gmt-safety-desc" id="gmt-safety-msg">
          AI akan melakukan aksi sensitif. Lanjutkan?
        </div>
        <div class="gmt-safety-btns">
          <button class="gmt-safety-btn confirm" id="gmt-safety-confirm">✓ Lanjutkan</button>
          <button class="gmt-safety-btn cancel" id="gmt-safety-cancel">✕ Lewati</button>
        </div>
      </div>

      <!-- Gesture Floating Indicator -->
      <div id="gmt-gesture-indicator" class="gmt-hidden">
        <span>🖐️</span> <span id="gmt-gesture-text">Gestur Tangan Aktif</span>
      </div>

      <!-- Tooltip -->
      <div id="gmt-tooltip" class="gmt-hidden">
        <div id="gmt-tooltip-step"></div>
        <div id="gmt-tooltip-text"></div>
      </div>
    `;
    document.body.appendChild(root);
  }

  // Draggable bubble replaced by right-edge dock tab #gmt-dock-tab

  // ─── Session Persistence ───
  function saveSession() {
    try {
      chrome.storage.local.set({
        gmt_session: {
          panelOpen: state.panelOpen,
          chatHistory: state.chatHistory,
          steps: state.steps,
          currentStep: state.currentStep,
          lang: state.lang,
          mode: state.mode || 'guide',
          watchMode: !!state.watchMode,
          wakeWordActive: !!state.wakeWordActive,
          gestureActive: !!state.gestureActive,
          audioEnabled: state.audioEnabled !== false,
          memory: state.memory || {},
          isGuiding: state.steps.length > 0 && state.currentStep >= 0 && state.currentStep < state.steps.length,
          lastUpdated: Date.now(),
        }
      });
    } catch (e) {
      console.warn('[GMT] saveSession error:', e);
    }
  }

  function saveSessionAsync() {
    return new Promise(resolve => {
      try {
        chrome.storage.local.set({
          gmt_session: {
            panelOpen: state.panelOpen,
            chatHistory: state.chatHistory,
            steps: state.steps,
            currentStep: state.currentStep,
            lang: state.lang,
            mode: state.mode || 'guide',
            watchMode: !!state.watchMode,
            wakeWordActive: !!state.wakeWordActive,
            gestureActive: !!state.gestureActive,
            audioEnabled: state.audioEnabled !== false,
            memory: state.memory || {},
            isGuiding: state.steps.length > 0 && state.currentStep >= 0 && state.currentStep < state.steps.length,
            lastUpdated: Date.now(),
          }
        }, resolve);
      } catch (e) {
        resolve();
      }
    });
  }

  function clearSession() {
    try {
      chrome.storage.local.remove(['gmt_session']);
    } catch (e) {}
  }

  async function restoreSession() {
    try {
      const data = await new Promise(r => chrome.storage.local.get(['gmt_session'], r));
      const session = data?.gmt_session;
      if (!session) return;

      // Ignore sessions older than 2 hours
      if (session.lastUpdated && Date.now() - session.lastUpdated > 2 * 60 * 60 * 1000) {
        clearSession();
        return;
      }

      state.lang = session.lang || 'id';
      state.panelOpen = !!session.panelOpen;
      state.chatHistory = session.chatHistory || [];
      state.steps = session.steps || [];
      state.currentStep = session.currentStep !== undefined ? session.currentStep : -1;
      state.mode = session.mode || 'guide';
      state.watchMode = !!session.watchMode;
      state.wakeWordActive = !!session.wakeWordActive;
      state.gestureActive = !!session.gestureActive;
      state.audioEnabled = session.audioEnabled !== false;
      state.memory = session.memory || {};

      // Restore mode UI and toggle card states
      setMode(state.mode, false);
      updateToggleCard('watch', state.watchMode);
      updateToggleCard('wake', state.wakeWordActive);
      updateToggleCard('audio', state.audioEnabled);
      updateToggleCard('gesture', state.gestureActive);

      if (state.watchMode) {
        initWatchMode();
      }
      if (state.wakeWordActive) {
        startWakeWordListener();
      }
      if (state.gestureActive) {
        toggleGestureControl();
      }
      updateMemoryUI();

      // 1. Restore chat messages
      if (state.chatHistory.length > 0) {
        const chat = document.getElementById('gmt-chat');
        chat.innerHTML = '';
        for (const msg of state.chatHistory) {
          const div = document.createElement('div');
          div.className = `gmt-msg gmt-${msg.role === 'user' ? 'user' : 'ai'}`;
          div.innerHTML = `
            <div class="gmt-msg-avatar">${msg.role === 'user' ? '👤' : '🧭'}</div>
            <div class="gmt-msg-bubble">${msg.text}</div>
          `;
          chat.appendChild(div);
        }
        chat.scrollTop = chat.scrollHeight;
      }

      // 2. Restore panel state (and push web view to the left)
      if (state.panelOpen) {
        document.getElementById('gmt-panel')?.classList.remove('gmt-hidden');
        document.getElementById('gmt-dock-tab')?.classList.add('gmt-panel-open');
        document.documentElement.classList.add('gmt-panel-open');
        document.body.classList.add('gmt-panel-open');
      }

      // 3. Restore guidance if active
      if (session.isGuiding && state.steps.length > 0 && state.currentStep >= 0 && state.currentStep < state.steps.length) {
        renderSteps();
        document.getElementById('gmt-actions').style.display = 'flex';
        document.getElementById('gmt-steps').style.display = 'flex';
        setStatus(state.lang === 'id' ? 'Melanjutkan panduan...' : 'Resuming guidance...');
        setBubbleState('guiding');

        // Allow page/SPA elements (e.g. Gmail) to render
        setTimeout(() => {
          executeCurrentStep();
        }, 1500);
      }
    } catch (err) {
      console.warn('[GMT] restoreSession error:', err);
    }
  }

  function clearChat() {
    clearHighlight();
    state.steps = [];
    state.currentStep = -1;
    state.chatHistory = [];
    document.getElementById('gmt-steps').style.display = 'none';
    document.getElementById('gmt-actions').style.display = 'none';
    setBubbleState('idle');
    setStatus(state.lang === 'id' ? 'Siap membantu · Ready to guide' : 'Ready to guide');

    const chat = document.getElementById('gmt-chat');
    chat.innerHTML = `
      <div class="gmt-msg gmt-ai gmt-fade-in">
        <div class="gmt-msg-avatar">🧭</div>
        <div class="gmt-msg-bubble">Halo! Saya GMT. Mau saya panduan kamu kemana? / Hi! I'm GMT. Where would you like me to guide you?</div>
      </div>

      <div class="gmt-quick-options gmt-fade-in">
        <button class="gmt-quick-btn" data-prompt="Jelaskan halaman web yang sedang saya buka ini secara detail dalam Bahasa Indonesia: Ini situs apa, apa fungsi utamanya, apa saja menu penting di sini, dan pandu saya apa saja yang bisa dilakukan di sini.">
          <span style="font-size:18px;">🌐</span>
          <div style="flex:1;">
            <div style="font-weight:600;color:#00D4FF;font-size:12.5px;">Jelaskan Halaman Ini (Explain Page)</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">Pahami situs asing (China, dsb.) dalam B. Indonesia</div>
          </div>
          <span style="color:rgba(0,212,255,0.7);font-size:13px;font-weight:700;">➔</span>
        </button>

        <button class="gmt-quick-btn" data-prompt="Bantu saya cara membuat dan mengirim email di Gmail">
          <span style="font-size:18px;">✉️</span>
          <div style="flex:1;">
            <div style="font-weight:600;color:#00D4FF;font-size:12.5px;">Guide me to write email</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">Panduan buat & kirim email di Gmail</div>
          </div>
          <span style="color:rgba(0,212,255,0.7);font-size:13px;font-weight:700;">➔</span>
        </button>

        <button class="gmt-quick-btn" data-prompt="Bantu saya mencari informasi di Google Search">
          <span style="font-size:18px;">🔍</span>
          <div style="flex:1;">
            <div style="font-weight:600;color:#00D4FF;font-size:12.5px;">Guide me to search on Google</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">Panduan mencari info di Google</div>
          </div>
          <span style="color:rgba(0,212,255,0.7);font-size:13px;font-weight:700;">➔</span>
        </button>

        <button class="gmt-quick-btn" data-prompt="Bantu saya mencari dan menonton video di YouTube">
          <span style="font-size:18px;">🎥</span>
          <div style="flex:1;">
            <div style="font-weight:600;color:#00D4FF;font-size:12.5px;">Guide me to watch YouTube</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);">Panduan cari & tonton video di YouTube</div>
          </div>
          <span style="color:rgba(0,212,255,0.7);font-size:13px;font-weight:700;">➔</span>
        </button>
      </div>

      <div id="gmt-setup-row" style="text-align:center;margin-top:10px;">
        <button id="gmt-setup-btn" style="background:rgba(108,63,255,0.15);border:1px dashed rgba(108,63,255,0.5);border-radius:10px;padding:7px 14px;color:rgba(255,255,255,0.6);font-size:11px;cursor:pointer;transition:all 0.2s;">
          ⚙️ Setup API Key dulu / Setup API Key first
        </button>
      </div>
    `;
    const setupBtn = document.getElementById('gmt-setup-btn');
    if (setupBtn) setupBtn.addEventListener('click', openSettings);
    clearSession();
  }

  // ─── Events ───
  function attachEvents() {
    // Dock tab toggle (opens/closes panel from right edge)
    const dockTab = document.getElementById('gmt-dock-tab');
    if (dockTab) dockTab.addEventListener('click', togglePanel);

    // Close panel
    document.getElementById('gmt-close-btn')?.addEventListener('click', closePanel);

    // Clear chat
    document.getElementById('gmt-clear-btn')?.addEventListener('click', clearChat);

    // Send button
    document.getElementById('gmt-send-btn')?.addEventListener('click', sendCommand);

    // Enter key in input
    document.getElementById('gmt-text-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendCommand();
      }
    });

    // Mic button (in chat input area)
    document.getElementById('gmt-mic-btn')?.addEventListener('click', toggleListening);

    // Action buttons
    document.getElementById('gmt-skip-btn')?.addEventListener('click', skipStep);
    document.getElementById('gmt-stop-btn')?.addEventListener('click', stopGuiding);
    document.getElementById('gmt-repeat-btn')?.addEventListener('click', repeatStep);

    // Settings
    document.getElementById('gmt-settings-btn')?.addEventListener('click', openSettings);
    document.getElementById('gmt-close-settings')?.addEventListener('click', closeSettings);
    const closeX = document.getElementById('gmt-settings-close-x');
    if (closeX) closeX.addEventListener('click', closeSettings);
    document.getElementById('gmt-save-settings')?.addEventListener('click', saveSettings);

    // Escape key to close panel
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (state.panelOpen || state.settingsOpen)) {
        closePanel();
        closeSettings();
      }
    });

    // Chat delegated events (quick options & setup button)
    document.getElementById('gmt-chat')?.addEventListener('click', (e) => {
      const quickBtn = e.target.closest('.gmt-quick-btn');
      if (quickBtn) {
        const prompt = quickBtn.getAttribute('data-prompt');
        if (prompt) sendCommand(prompt);
        return;
      }
      const setupBtn = e.target.closest('#gmt-setup-btn');
      if (setupBtn) {
        openSettings();
        return;
      }
    });

    // Mode Switcher (Guide Me vs Help Me)
    document.getElementById('gmt-mode-guide')?.addEventListener('click', () => setMode('guide'));
    document.getElementById('gmt-mode-autopilot')?.addEventListener('click', () => setMode('autopilot'));

    // Feature Toggles (Gesture, Mic/Wake, Audio, Smart Watch)
    document.getElementById('gmt-card-gesture')?.addEventListener('click', toggleGestureControl);
    document.getElementById('gmt-card-wake')?.addEventListener('click', toggleWakeWord);
    document.getElementById('gmt-card-audio')?.addEventListener('click', toggleAudio);
    document.getElementById('gmt-card-watch')?.addEventListener('click', toggleWatchMode);

    // Working Memory Drawer
    document.getElementById('gmt-memory-toggle-btn')?.addEventListener('click', toggleMemoryDrawer);
    document.getElementById('gmt-memory-clear-btn')?.addEventListener('click', clearMemory);

    // Gesture control checkbox in settings (syncs with toggle card)
    document.getElementById('gmt-gesture-check')?.addEventListener('change', toggleGestureControl);

    // Load saved settings into fields
    loadSettingsIntoForm();
  }

  function togglePanel() {
    state.panelOpen = !state.panelOpen;
    const panel = document.getElementById('gmt-panel');
    const dockTab = document.getElementById('gmt-dock-tab');
    const settings = document.getElementById('gmt-settings');
    if (state.panelOpen) {
      panel?.classList.remove('gmt-hidden');
      settings?.classList.add('gmt-hidden');
      dockTab?.classList.add('gmt-panel-open');
      document.documentElement.classList.add('gmt-panel-open');
      document.body.classList.add('gmt-panel-open');
      setTimeout(() => document.getElementById('gmt-text-input')?.focus(), 150);
    } else {
      panel?.classList.add('gmt-hidden');
      dockTab?.classList.remove('gmt-panel-open');
      document.documentElement.classList.remove('gmt-panel-open');
      document.body.classList.remove('gmt-panel-open');
    }
    saveSession();
  }

  function closePanel() {
    state.panelOpen = false;
    document.getElementById('gmt-panel')?.classList.add('gmt-hidden');
    document.getElementById('gmt-dock-tab')?.classList.remove('gmt-panel-open');
    document.documentElement.classList.remove('gmt-panel-open');
    document.body.classList.remove('gmt-panel-open');
    saveSession();
  }

  // ─── Command Processing ───
  async function sendCommand(overrideCommand) {
    const input = document.getElementById('gmt-text-input');
    const command = (typeof overrideCommand === 'string' ? overrideCommand : input.value).trim();
    if (!command || state.isProcessing) return;

    input.value = '';
    addMessage('user', command);
    setStatus('Memproses... / Processing...');
    state.isProcessing = true;
    setBubbleState('processing');

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GMT_PROCESS_COMMAND',
        command: command,
        currentUrl: window.location.href,
        language: detectLanguage(command),
      });

      if (response.error) {
        if (response.error.includes('API key')) {
          addMessage('ai', '⚙️ ' + (detectLanguage(command) === 'id'
            ? 'Silakan atur API Key dulu di pengaturan (ikon gear).'
            : 'Please set your API Key in settings (gear icon) first.'));
          openSettings();
        } else {
          addMessage('ai', '❌ Error: ' + response.error);
        }
        return;
      }

      const plan = response.plan;
      state.lang = plan.language || 'id';
      state.steps = plan.steps || [];
      state.currentStep = 0;

      // Jayu Memory scratchpad update
      if (plan.memory_update && typeof plan.memory_update === 'object') {
        Object.assign(state.memory, plan.memory_update);
        updateMemoryUI();
      }

      addMessage('ai', plan.greeting || (state.lang === 'id' ? 'Baik! Saya akan panduan kamu...' : 'Sure! Let me guide you...'));

      renderSteps();
      document.getElementById('gmt-actions').style.display = 'flex';
      document.getElementById('gmt-steps').style.display = 'flex';
      saveSession();

      // If navigation needed, speak via background TTS, save session, then navigate smoothly!
      if (plan.navigate_to && plan.navigate_to !== window.location.href) {
        setStatus(state.lang === 'id' ? 'Membuka halaman...' : 'Opening page...');
        addMessage('ai', state.lang === 'id'
          ? `📂 Membuka ${plan.navigate_to}...`
          : `📂 Opening ${plan.navigate_to}...`);
        
        // Speak using background chrome.tts so redirect doesn't stop it!
        speak(state.lang === 'id' ? 'Membuka halaman, mohon tunggu' : 'Opening page, please wait');

        state.panelOpen = true;
        document.documentElement.classList.add('gmt-panel-open');
        document.body.classList.add('gmt-panel-open');
        await saveSessionAsync();

        // Brief delay so user hears announcement naturally before page redirect
        setTimeout(() => {
          chrome.runtime.sendMessage({ type: 'GMT_NAVIGATE', url: plan.navigate_to });
        }, 1200);
        return;
      } else {
        await executeCurrentStep();
      }

    } catch (err) {
      addMessage('ai', '❌ ' + err.message);
    } finally {
      state.isProcessing = false;
      setBubbleState('idle');
      setStatus(state.lang === 'id' ? 'Panduan aktif' : 'Guiding active');
    }
  }

  // ─── Step Execution ───
  async function executeCurrentStep() {
    if (state.currentStep >= state.steps.length) {
      finishGuiding();
      return;
    }

    const step = state.steps[state.currentStep];
    renderSteps();
    setBubbleState('guiding');
    saveSession();

    // Speak the instruction
    await speak(step.voice || step.instruction);

    let el = null;
    let visionBox = null;

    // 1. Try finding by selector with timeout
    if (step.selector) {
      setStatus(state.lang === 'id' ? `Mencari elemen (${step.label})...` : `Locating (${step.label})...`);
      el = await waitForElement(step.selector, 4000);
    }

    // 2. Jayu Visual Bounding Box Grounding Fallback
    if (!el && (step.label || step.instruction)) {
      setStatus(state.lang === 'id' ? `Selektor belum ketemu. Memeriksa visual (Gemini Vision)...` : `Selector missed. Scanning visually (Gemini Vision)...`);
      try {
        const vRes = await chrome.runtime.sendMessage({
          type: 'GMT_FIND_ELEMENT_VISION',
          label: step.label,
          description: step.instruction
        });
        if (vRes?.ok && vRes.box) {
          visionBox = vRes.box;
        }
      } catch (e) {
        console.warn('[GMT] Vision grounding error:', e);
      }
    }

    // 3. Action / Highlighting based on Mode (Guide Me vs Help Me)
    if (state.mode === 'autopilot') {
      await executeAutopilotStep(el, visionBox, step);
    } else {
      if (el) {
        highlightTargetElement(el, step.id, state.steps.length, step.instruction);
      } else if (visionBox) {
        highlightVisionBox(visionBox, step.id, state.steps.length, step.instruction);
      } else {
        console.warn('[GMT] Element not found after wait & vision:', step.selector);
        setStatus(state.lang === 'id' ? `Elemen tidak ditemukan. Klik manual atau Skip.` : `Element not found. Click manually or Skip.`);
      }
    }
  }

  function skipStep() {
    clearHighlight();
    state.currentStep++;
    saveSession();
    executeCurrentStep();
  }

  function repeatStep() {
    clearHighlight();
    executeCurrentStep();
  }

  function stopGuiding() {
    clearHighlight();
    state.steps = [];
    state.currentStep = -1;
    document.getElementById('gmt-steps').style.display = 'none';
    document.getElementById('gmt-actions').style.display = 'none';
    setBubbleState('idle');
    setStatus(state.lang === 'id' ? 'Siap membantu' : 'Ready to guide');
    addMessage('ai', state.lang === 'id' ? 'Panduan dihentikan. Ada yang lain?' : 'Guidance stopped. Anything else?');
    stopSpeaking();
    saveSession();
  }

  function finishGuiding() {
    clearHighlight();
    setBubbleState('idle');
    const msg = state.lang === 'id' ? '✅ Selesai! Semua langkah sudah dilakukan. Ada yang lain?' : '✅ Done! All steps completed. Anything else?';
    addMessage('ai', msg);
    speak(state.lang === 'id' ? 'Selesai! Semua langkah sudah dilakukan.' : 'Done! All steps completed.');
    setStatus(state.lang === 'id' ? 'Selesai! ✓' : 'Completed! ✓');
    state.steps = [];
    state.currentStep = -1;
    document.getElementById('gmt-steps').style.display = 'none';
    document.getElementById('gmt-actions').style.display = 'none';
    saveSession();
  }

  function findElementByText(text) {
    if (!text) return null;
    const clean = text.trim().toLowerCase();
    const candidates = document.querySelectorAll('button, a, [role="button"], input[type="submit"], input[type="button"], span, div');
    for (const el of candidates) {
      if (isElementVisible(el)) {
        const t = (el.innerText || el.textContent || '').trim().toLowerCase();
        if (t === clean || (t.length <= 40 && t.includes(clean))) {
          return el;
        }
      }
    }
    return null;
  }

  // ─── Highlight / Spotlight ───
  function isElementVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function findElement(selector) {
    if (!selector) return null;
    try {
      // 1. Try comma-separated selectors in order
      const parts = selector.split(',').map(s => s.trim()).filter(Boolean);
      for (const sel of parts) {
        try {
          const el = document.querySelector(sel);
          if (el && isElementVisible(el)) return el;
        } catch (e) {}
      }

      // 2. Text-based selector (e.g. :has-text('...') or text matching for Chinese/foreign words)
      if (selector.includes(':has-text(')) {
        const match = selector.match(/:has-text\(['"]([^'"]+)['"]\)/);
        if (match && match[1]) {
          const found = findElementByText(match[1]);
          if (found) return found;
        }
      }

      // 3. Direct selector
      try {
        const direct = document.querySelector(selector);
        if (direct && isElementVisible(direct)) return direct;
      } catch (e) {}

      // 3. Fallbacks for common Gmail / app keywords
      if (/compose|tulis|gh="cm"|T-I-KE/i.test(selector)) {
        const composeFallbacks = [
          'div[role="button"][gh="cm"]',
          '[aria-label*="Tulis" i]',
          '[aria-label*="Compose" i]',
          '.T-I-KE',
          'div[gh="cm"]',
          'div[role="button"][data-tooltip*="Tulis" i]',
          'div[role="button"][data-tooltip*="Compose" i]',
          '.aic .z0 > div[role="button"]'
        ];
        for (const fb of composeFallbacks) {
          try {
            const found = document.querySelector(fb);
            if (found && isElementVisible(found)) return found;
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('[GMT] findElement query error:', e);
    }
    return null;
  }

  function waitForElement(selector, timeoutMs = 12000, intervalMs = 400) {
    return new Promise((resolve) => {
      let el = findElement(selector);
      if (el) return resolve(el);

      const startTime = Date.now();
      const timer = setInterval(() => {
        el = findElement(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if (Date.now() - startTime >= timeoutMs) {
          clearInterval(timer);
          resolve(null);
        }
      }, intervalMs);
    });
  }

  function highlightTargetElement(el, stepNum, totalSteps, instruction) {
    try {
      clearHighlight();
      currentHighlightedEl = el;

      // Auto-detect click to advance
      el.addEventListener('click', onUserClickedTarget, { once: true });

      // Scroll element into view smoothly
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const rect = el.getBoundingClientRect();
      const padding = 8;

      // Spotlight cutout
      const spotlight = document.getElementById('gmt-spotlight');
      spotlight.innerHTML = `<div class="gmt-cutout" style="
        top: ${rect.top - padding}px;
        left: ${rect.left - padding}px;
        width: ${rect.width + padding*2}px;
        height: ${rect.height + padding*2}px;
      "></div>`;
      spotlight.classList.remove('gmt-hidden');

      // Pulse rings
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'gmt-pulse-ring';
        ring.style.cssText = `
          top: ${rect.top - padding}px;
          left: ${rect.left - padding}px;
          width: ${rect.width + padding*2}px;
          height: ${rect.height + padding*2}px;
          animation-delay: ${i * 0.4}s;
        `;
        spotlight.appendChild(ring);
      }

      // Tooltip
      showTooltip(rect, stepNum, totalSteps, instruction);

    } catch (e) {
      console.error('[GMT] Highlight error:', e);
    }
  }

  function updateHighlightPosition() {
    if (!currentHighlightedEl) return;
    const rect = currentHighlightedEl.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const padding = 8;
    const cutout = document.querySelector('#gmt-spotlight .gmt-cutout');
    if (cutout) {
      cutout.style.top = `${rect.top - padding}px`;
      cutout.style.left = `${rect.left - padding}px`;
      cutout.style.width = `${rect.width + padding * 2}px`;
      cutout.style.height = `${rect.height + padding * 2}px`;
    }

    const rings = document.querySelectorAll('.gmt-pulse-ring');
    rings.forEach((ring) => {
      ring.style.top = `${rect.top - padding}px`;
      ring.style.left = `${rect.left - padding}px`;
      ring.style.width = `${rect.width + padding * 2}px`;
      ring.style.height = `${rect.height + padding * 2}px`;
    });

    const tooltip = document.getElementById('gmt-tooltip');
    if (tooltip && !tooltip.classList.contains('gmt-hidden')) {
      const tooltipH = tooltip.offsetHeight || 80;
      let top = rect.top - tooltipH - 14;
      if (top < 10) top = rect.bottom + 12;
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${Math.max(10, Math.min(rect.left, window.innerWidth - 270))}px`;
    }
  }

  function onUserClickedTarget() {
    clearHighlight();
    state.currentStep++;
    saveSession();
    setTimeout(() => executeCurrentStep(), 800);
  }

  function showTooltip(rect, stepNum, totalSteps, text) {
    const tooltip = document.getElementById('gmt-tooltip');
    document.getElementById('gmt-tooltip-step').textContent = `Step ${stepNum} / ${totalSteps}`;
    document.getElementById('gmt-tooltip-text').textContent = text;

    const tooltipH = 80;
    let top = rect.top - tooltipH - 16;
    if (top < 10) top = rect.bottom + 12;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${Math.max(10, Math.min(rect.left, window.innerWidth - 270))}px`;
    tooltip.classList.remove('gmt-hidden');
  }

  function clearHighlight() {
    currentHighlightedEl = null;
    const spotlight = document.getElementById('gmt-spotlight');
    if (spotlight) {
      spotlight.classList.add('gmt-hidden');
      spotlight.innerHTML = '';
    }
    const reticle = document.getElementById('gmt-vision-box');
    if (reticle) reticle.classList.add('gmt-hidden');
    const tooltip = document.getElementById('gmt-tooltip');
    if (tooltip) {
      tooltip.classList.add('gmt-hidden');
    }
    const cursor = document.getElementById('gmt-robot-cursor');
    if (cursor) cursor.classList.add('gmt-hidden');
  }

  // ─── Dual Mode Switcher (Guide Me vs Help Me Autopilot) ───
  function setMode(mode, save = true) {
    state.mode = mode;
    const guideBtn = document.getElementById('gmt-mode-guide');
    const autoBtn = document.getElementById('gmt-mode-autopilot');
    const modeDesc = document.getElementById('gmt-mode-desc');
    if (guideBtn && autoBtn) {
      guideBtn.classList.toggle('active', mode === 'guide');
      autoBtn.classList.toggle('active', mode === 'autopilot');
    }
    if (modeDesc) {
      modeDesc.textContent = mode === 'guide'
        ? 'Mode Panduan: AI menunjukkan tombol, Anda yang klik sendiri'
        : 'Mode Help Me: AI langsung mengklik & mengisi halaman untuk Anda';
    }
    if (save) {
      saveSession();
      addMessage('ai', mode === 'autopilot'
        ? (state.lang === 'id' ? '⚡ Mode Help Me (Autopilot) aktif! AI akan langsung mengeksekusi langkah di browser Anda.' : '⚡ Help Me (Autopilot) active! AI will execute steps directly.')
        : (state.lang === 'id' ? '🧭 Mode Guide Me aktif! AI akan memandu dengan sorotan visual.' : '🧭 Guide Me active! AI will guide you with visual highlights.'));
    }
  }

  // ─── Jayu Visual Bounding Box Highlighter ───
  function highlightVisionBox(box, stepNum, totalSteps, instruction) {
    clearHighlight();
    const reticle = document.getElementById('gmt-vision-box');
    if (!reticle) return;

    const x = box.xmin * window.innerWidth;
    const y = box.ymin * window.innerHeight;
    const w = Math.max(30, (box.xmax - box.xmin) * window.innerWidth);
    const h = Math.max(24, (box.ymax - box.ymin) * window.innerHeight);

    reticle.style.left = `${x}px`;
    reticle.style.top = `${y}px`;
    reticle.style.width = `${w}px`;
    reticle.style.height = `${h}px`;
    reticle.classList.remove('gmt-hidden');

    showTooltip({ top: y, left: x, bottom: y + h, width: w, height: h }, stepNum, totalSteps, instruction);
  }

  // ─── Jayu Autopilot Execution Engine ───
  async function executeAutopilotStep(el, visionBox, step) {
    clearHighlight();

    // Check sensitive action safety confirmation
    if (step.is_sensitive) {
      const confirmed = await promptSafetyConfirmation(step);
      if (!confirmed) {
        skipStep();
        return;
      }
    }

    let targetX = 0, targetY = 0;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(400);
      const rect = el.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
      highlightTargetElement(el, step.id, state.steps.length, `⚡ Autopilot: ${step.instruction}`);
    } else if (visionBox) {
      targetX = visionBox.cx * window.innerWidth;
      targetY = visionBox.cy * window.innerHeight;
      highlightVisionBox(visionBox, step.id, state.steps.length, `⚡ Autopilot (Vision Grounding): ${step.instruction}`);
    }

    // Move robot cursor
    const cursor = document.getElementById('gmt-robot-cursor');
    if (cursor) {
      cursor.classList.remove('gmt-hidden');
      cursor.style.left = `${targetX - 7}px`;
      cursor.style.top = `${targetY - 2}px`;
    }

    // 1-second pause so the user can observe the action clearly
    await sleep(1000);

    // Perform action
    if (step.action === 'input') {
      const inputVal = step.input_value || "GMT Input";
      if (el) {
        el.focus();
        el.value = inputVal;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else {
      // Click action
      if (cursor) cursor.classList.add('clicking');
      spawnClickRipple(targetX, targetY);

      if (el) {
        el.click();
      } else {
        const pointEl = document.elementFromPoint(targetX, targetY);
        if (pointEl) pointEl.click();
      }

      await sleep(200);
      if (cursor) cursor.classList.remove('clicking');
    }

    // Advance automatically
    await sleep(1200);
    if (cursor) cursor.classList.add('gmt-hidden');
    clearHighlight();
    state.currentStep++;
    saveSession();
    executeCurrentStep();
  }

  function promptSafetyConfirmation(step) {
    return new Promise((resolve) => {
      const modal = document.getElementById('gmt-safety-modal');
      const msg = document.getElementById('gmt-safety-msg');
      const confirmBtn = document.getElementById('gmt-safety-confirm');
      const cancelBtn = document.getElementById('gmt-safety-cancel');

      msg.textContent = `Aksi penting: "${step.label}". Apakah Anda yakin ingin AI mengeksekusinya secara otomatis?`;
      modal.classList.remove('gmt-hidden');

      function onConfirm() {
        modal.classList.add('gmt-hidden');
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        resolve(true);
      }
      function onCancel() {
        modal.classList.add('gmt-hidden');
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        resolve(false);
      }

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
    });
  }

  function spawnClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'gmt-click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '60px';
    ripple.style.height = '60px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ─── External Working Memory (Jayu Scratchpad) ───
  function toggleMemoryDrawer() {
    const drawer = document.getElementById('gmt-memory-drawer');
    const arrow = document.getElementById('gmt-memory-arrow');
    if (!drawer) return;
    const isClosed = drawer.style.display === 'none';
    drawer.style.display = isClosed ? 'flex' : 'none';
    if (arrow) arrow.textContent = isClosed ? '▴' : '▾';
  }

  function updateMemoryUI() {
    const list = document.getElementById('gmt-memory-list');
    const count = document.getElementById('gmt-memory-count');
    const entries = Object.entries(state.memory || {});
    if (count) count.textContent = entries.length;
    if (!list) return;
    if (entries.length === 0) {
      list.innerHTML = '<span style="color:rgba(255,255,255,0.3);font-size:10px;font-style:italic;">Belum ada data memori...</span>';
      return;
    }
    list.innerHTML = entries.map(([k, v]) => `
      <div class="gmt-memory-pill" title="${k}: ${v}">
        <span class="key">${k}:</span>
        <span>${String(v).slice(0, 20)}</span>
      </div>
    `).join('');
  }

  function clearMemory() {
    state.memory = {};
    updateMemoryUI();
    saveSession();
    addMessage('ai', state.lang === 'id' ? '🧠 Memori sesi telah dibersihkan.' : '🧠 Session memory cleared.');
  }

  // ─── Toggle Cards UI Helper ───
  function updateToggleCard(name, isActive) {
    const card = document.getElementById(`gmt-card-${name}`);
    const sw = document.getElementById(`gmt-switch-${name}`);
    if (card) card.classList.toggle('active', !!isActive);
    if (sw) {
      sw.classList.toggle('active', !!isActive);
      const statusText = sw.querySelector('.gmt-switch-status');
      if (statusText) statusText.textContent = isActive ? 'ON' : 'OFF';
    }
  }

  // ─── Audio Toggle (Speech Output Mute/Unmute) ───
  function toggleAudio() {
    state.audioEnabled = !state.audioEnabled;
    updateToggleCard('audio', state.audioEnabled);
    if (!state.audioEnabled) {
      stopSpeaking();
      addMessage('ai', state.lang === 'id' ? '🔇 Suara AI dimatikan (Muted).' : '🔇 AI voice output muted.');
    } else {
      addMessage('ai', state.lang === 'id' ? '🔊 Suara AI diaktifkan.' : '🔊 AI voice output enabled.');
      speak(state.lang === 'id' ? 'Suara AI aktif' : 'AI voice active');
    }
    saveSession();
  }

  // ─── Smart Watch Mode (Jayu-style Debounced Page Monitor) ───
  let watchObserver = null;
  let watchDebounceTimer = null;

  function toggleWatchMode() {
    state.watchMode = !state.watchMode;
    updateToggleCard('watch', state.watchMode);

    if (state.watchMode) {
      initWatchMode();
      addMessage('ai', state.lang === 'id'
        ? '👁️ Watch Mode aktif! GMT akan memantau layar dan memberi panduan proaktif saat Anda berpindah halaman/tahapan.'
        : '👁️ Watch Mode active! GMT will monitor the page and guide proactively.');
    } else {
      if (watchObserver) { watchObserver.disconnect(); watchObserver = null; }
      addMessage('ai', state.lang === 'id' ? '👁️ Watch Mode dinonaktifkan.' : '👁️ Watch Mode disabled.');
    }
    saveSession();
  }

  function initWatchMode() {
    if (watchObserver) watchObserver.disconnect();
    watchObserver = new MutationObserver(() => {
      clearTimeout(watchDebounceTimer);
      watchDebounceTimer = setTimeout(triggerProactiveCheck, 1200);
    });
    watchObserver.observe(document.body, { childList: true, subtree: true });
  }

  async function triggerProactiveCheck() {
    if (!state.watchMode || state.isProcessing || state.steps.length > 0) return;

    const headings = Array.from(document.querySelectorAll('h1, h2'))
      .map(h => h.innerText?.trim())
      .filter(Boolean)
      .slice(0, 4)
      .join(' | ');

    try {
      const res = await chrome.runtime.sendMessage({
        type: 'GMT_PROACTIVE_PAGE_CHECK',
        url: window.location.href,
        title: document.title,
        headings: headings,
      });

      if (res?.ok && res.data?.summary) {
        addMessage('ai', `👁️ **Watch Mode:** ${res.data.summary}\n💡 *Saran:* ${res.data.suggested_action || ''}`);
        speak(res.data.summary);
      }
    } catch (e) {}
  }

  // ─── Hands-free Wake Word ("Halo GMT" / "Hey GMT") ───
  let wakeRecognition = null;

  function toggleWakeWord() {
    state.wakeWordActive = !state.wakeWordActive;
    updateToggleCard('wake', state.wakeWordActive);

    if (state.wakeWordActive) {
      startWakeWordListener();
      addMessage('ai', state.lang === 'id'
        ? '🎙️ Mikrofon Wake Word aktif! Ucapkan "Halo GMT" atau "Hey GMT" diikuti permintaan Anda.'
        : '🎙️ Microphone Wake Word active! Say "Hey GMT" followed by your request.');
    } else {
      stopWakeWordListener();
      addMessage('ai', state.lang === 'id' ? '🎙️ Mikrofon Wake Word dimatikan.' : '🎙️ Microphone Wake Word disabled.');
    }
    saveSession();
  }

  function startWakeWordListener() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    try {
      wakeRecognition = new SpeechRecognition();
      wakeRecognition.continuous = true;
      wakeRecognition.interimResults = true;
      wakeRecognition.lang = state.lang === 'id' ? 'id-ID' : 'en-US';

      wakeRecognition.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript.toLowerCase();
          if (transcript.includes('halo gmt') || transcript.includes('hey gmt') || transcript.includes('hai gmt')) {
            const matchIndex = transcript.indexOf('gmt');
            const userPrompt = transcript.slice(matchIndex + 3).trim();
            if (userPrompt.length > 2) {
              sendCommand(userPrompt);
            } else {
              speak(state.lang === 'id' ? 'Iya, saya mendengarkan...' : 'Yes, I am listening...');
              toggleListening();
            }
          }
        }
      };

      wakeRecognition.onerror = () => {
        if (state.wakeWordActive) setTimeout(startWakeWordListener, 2000);
      };
      wakeRecognition.onend = () => {
        if (state.wakeWordActive) startWakeWordListener();
      };
      wakeRecognition.start();
    } catch (e) {
      console.warn('[GMT Wake] Error:', e);
    }
  }

  function stopWakeWordListener() {
    if (wakeRecognition) {
      wakeRecognition.onend = null;
      wakeRecognition.stop();
      wakeRecognition = null;
    }
  }

  // ─── Hands-free Hand Gesture Scroll (Local Optical Flow) ───
  let gestureStream = null;
  let gestureInterval = null;
  let prevFrameData = null;

  async function toggleGestureControl() {
    state.gestureActive = !state.gestureActive;
    const indicator = document.getElementById('gmt-gesture-indicator');
    const check = document.getElementById('gmt-gesture-check');
    if (check) check.checked = state.gestureActive;
    updateToggleCard('gesture', state.gestureActive);

    if (state.gestureActive) {
      try {
        gestureStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 160, height: 120, frameRate: 10 }
        });
        indicator?.classList.remove('gmt-hidden');
        startGestureTracking();
        addMessage('ai', '🖐️ Gestur Kamera aktif! Gerakkan tangan ke atas/bawah untuk scroll halaman secara hands-free.');
      } catch (err) {
        state.gestureActive = false;
        indicator?.classList.add('gmt-hidden');
        if (check) check.checked = false;
        updateToggleCard('gesture', false);
        addMessage('ai', '⚠️ Izin kamera diperlukan untuk fitur gestur tangan.');
      }
    } else {
      stopGestureTracking();
      indicator?.classList.add('gmt-hidden');
    }
    saveSession();
  }

  function startGestureTracking() {
    const video = document.createElement('video');
    video.srcObject = gestureStream;
    video.play();

    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');

    gestureInterval = setInterval(() => {
      if (!gestureStream || !video.videoWidth) return;
      ctx.drawImage(video, 0, 0, 80, 60);
      const frame = ctx.getImageData(0, 0, 80, 60);
      const currentData = frame.data;

      if (prevFrameData) {
        let diffY = 0;
        let changeCount = 0;
        for (let y = 0; y < 60; y += 2) {
          for (let x = 0; x < 80; x += 2) {
            const idx = (y * 80 + x) * 4;
            const diff = Math.abs(currentData[idx] - prevFrameData[idx]);
            if (diff > 35) {
              diffY += (y - 30);
              changeCount++;
            }
          }
        }

        if (changeCount > 50) {
          if (diffY < -300) {
            window.scrollBy({ top: -140, behavior: 'smooth' });
            updateGestureText('Scroll Ke Atas ⬆️');
          } else if (diffY > 300) {
            window.scrollBy({ top: 140, behavior: 'smooth' });
            updateGestureText('Scroll Ke Bawah ⬇️');
          }
        }
      }
      prevFrameData = currentData;
    }, 150);
  }

  function updateGestureText(txt) {
    const t = document.getElementById('gmt-gesture-text');
    if (t) {
      t.textContent = txt;
      setTimeout(() => { if (t) t.textContent = 'Gestur Tangan Aktif'; }, 800);
    }
  }

  function stopGestureTracking() {
    if (gestureInterval) clearInterval(gestureInterval);
    if (gestureStream) {
      gestureStream.getTracks().forEach(t => t.stop());
      gestureStream = null;
    }
    prevFrameData = null;
  }

  // ─── Step Checklist Renderer (Section 2.4 show_checklist) ───
  function renderSteps() {
    const container = document.getElementById('gmt-steps');
    if (!state.steps || state.steps.length === 0) {
      container.style.display = 'none';
      return;
    }
    container.style.display = 'flex';

    const total = state.steps.length;
    const completed = Math.max(0, state.currentStep);
    const percent = Math.min(100, Math.round((completed / total) * 100));

    container.innerHTML = `
      <div class="gmt-checklist-header">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:11px;font-weight:700;color:#00D4FF;text-transform:uppercase;letter-spacing:0.5px;">
            📋 Checklist Tahapan
          </span>
          <span style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);">
            ${completed} / ${total} Selesai (${percent}%)
          </span>
        </div>
        <div class="gmt-progress-track">
          <div class="gmt-progress-fill" style="width: ${percent}%;"></div>
        </div>
      </div>

      <div class="gmt-steps-list">
        ${state.steps.map((step, i) => {
          let itemClass = 'gmt-step-item';
          let iconContent = step.id;
          let statusBadge = '';

          if (i < state.currentStep) {
            itemClass += ' gmt-step-done';
            iconContent = '✓';
            statusBadge = '<span class="gmt-step-badge gmt-badge-done">Selesai</span>';
          } else if (i === state.currentStep) {
            itemClass += ' gmt-step-active';
            statusBadge = '<span class="gmt-step-badge gmt-badge-active">Aktif</span>';
          } else {
            statusBadge = '<span class="gmt-step-badge gmt-badge-pending">Antre</span>';
          }

          return `
            <div class="${itemClass}" data-step-index="${i}" title="Klik untuk fokus pada langkah ini">
              <div class="gmt-step-num">${iconContent}</div>
              <div style="flex:1;min-width:0;">
                <div class="gmt-step-label">${step.label}</div>
              </div>
              ${statusBadge}
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Step item click to jump
    container.querySelectorAll('.gmt-step-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-step-index'), 10);
        if (!isNaN(idx) && idx >= 0 && idx < state.steps.length) {
          clearHighlight();
          state.currentStep = idx;
          executeCurrentStep();
        }
      });
    });
  }

  // ─── Voice / Speech ───
  let currentAudio = null;

  async function speak(text) {
    if (!state.audioEnabled) return;
    stopSpeaking();
    const elevenlabsKey = await getStorageValue('gmt_elevenlabs_key');
    const voiceId = (await getStorageValue('gmt_voice_id')) || '21m00Tcm4TlvDq8ikWAM';

    if (elevenlabsKey) {
      try {
        await speakElevenLabs(text, elevenlabsKey, voiceId);
        return;
      } catch (e) {
        console.warn('[GMT] ElevenLabs failed, falling back to background TTS:', e);
      }
    }

    // Use chrome.tts in background service worker — NEVER cuts off on page navigation!
    try {
      chrome.runtime.sendMessage({
        type: 'GMT_SPEAK',
        text: text,
        lang: state.lang,
      });
    } catch (e) {
      speakWebSpeech(text);
    }
  }

  function speakWebSpeech(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.lang === 'id' ? 'id-ID' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang));
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }

  async function speakElevenLabs(text, apiKey, voiceId) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
      }),
    });

    if (!res.ok) throw new Error(`ElevenLabs error: ${res.status}`);

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    currentAudio = new Audio(url);
    await currentAudio.play();
  }

  function stopSpeaking() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    try {
      chrome.runtime.sendMessage({ type: 'GMT_STOP_SPEAK' }).catch(() => {});
    } catch (e) {}
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  // ─── Speech Recognition (Voice Input) ───
  let recognition = null;

  function toggleListening() {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMessage('ai', 'Fitur voice input tidak didukung browser ini. Gunakan Chrome.');
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = state.lang === 'id' ? 'id-ID' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      const isFinal = e.results[0].isFinal;
      document.getElementById('gmt-text-input').value = transcript;
      if (isFinal) {
        stopListening();
        sendCommand();
      }
    };

    recognition.onerror = () => stopListening();
    recognition.onend = () => { state.isListening = false; updateMicBtn(); };

    recognition.start();
    state.isListening = true;
    updateMicBtn();
    document.getElementById('gmt-dock-tab')?.classList.add('gmt-listening');
    setStatus(state.lang === 'id' ? '🎙️ Mendengarkan...' : '🎙️ Listening...');
  }

  function stopListening() {
    if (recognition) { recognition.stop(); recognition = null; }
    state.isListening = false;
    updateMicBtn();
    document.getElementById('gmt-dock-tab')?.classList.remove('gmt-listening');
  }

  function updateMicBtn() {
    const btn = document.getElementById('gmt-mic-btn');
    btn.classList.toggle('gmt-active', state.isListening);
  }

  // ─── Settings ───
  function openSettings() {
    document.getElementById('gmt-settings')?.classList.remove('gmt-hidden');
    document.getElementById('gmt-panel')?.classList.add('gmt-hidden');
    document.getElementById('gmt-dock-tab')?.classList.add('gmt-panel-open');
    state.settingsOpen = true;
  }

  function closeSettings() {
    document.getElementById('gmt-settings')?.classList.add('gmt-hidden');
    if (state.panelOpen) {
      document.getElementById('gmt-panel')?.classList.remove('gmt-hidden');
    } else {
      document.getElementById('gmt-dock-tab')?.classList.remove('gmt-panel-open');
    }
    state.settingsOpen = false;
  }

  function saveSettings() {
    const sumopodKey = document.getElementById('gmt-sumopod-key-input').value.trim();
    const geminiKey  = document.getElementById('gmt-gemini-key-input').value.trim();
    const elKey      = document.getElementById('gmt-elevenlabs-key-input').value.trim();
    const voiceId    = document.getElementById('gmt-voice-id-input').value.trim();
    const provider   = document.getElementById('gmt-provider-select').value;

    chrome.storage.local.set({
      gmt_sumopod_key:    sumopodKey,
      gmt_gemini_key:     geminiKey,
      gmt_elevenlabs_key: elKey,
      gmt_voice_id:       voiceId || '21m00Tcm4TlvDq8ikWAM',
      gmt_provider:       provider,
    }, () => {
      closeSettings();
      state.panelOpen = true;
      document.getElementById('gmt-panel')?.classList.remove('gmt-hidden');
      addMessage('ai', state.lang === 'id'
        ? `✅ Pengaturan tersimpan! Provider: ${provider === 'sumopod' ? 'Sumopod (DeepSeek)' : 'Google Gemini'}`
        : `✅ Settings saved! Provider: ${provider === 'sumopod' ? 'Sumopod (DeepSeek)' : 'Google Gemini'}`);
    });
  }

  async function loadSettingsIntoForm() {
    const keys = ['gmt_sumopod_key', 'gmt_gemini_key', 'gmt_elevenlabs_key', 'gmt_voice_id', 'gmt_provider'];
    const result = await new Promise(r => chrome.storage.local.get(keys, r));
    if (result.gmt_sumopod_key)    document.getElementById('gmt-sumopod-key-input').value    = result.gmt_sumopod_key;
    if (result.gmt_gemini_key)     document.getElementById('gmt-gemini-key-input').value     = result.gmt_gemini_key;
    if (result.gmt_elevenlabs_key) document.getElementById('gmt-elevenlabs-key-input').value = result.gmt_elevenlabs_key;
    if (result.gmt_voice_id)       document.getElementById('gmt-voice-id-input').value       = result.gmt_voice_id;
    if (result.gmt_provider)       document.getElementById('gmt-provider-select').value      = result.gmt_provider;
  }

  // ─── Helpers ───
  function addMessage(role, text) {
    const chat = document.getElementById('gmt-chat');
    const div = document.createElement('div');
    div.className = `gmt-msg gmt-${role === 'user' ? 'user' : 'ai'} gmt-fade-in`;
    div.innerHTML = `
      <div class="gmt-msg-avatar">${role === 'user' ? '👤' : '🧭'}</div>
      <div class="gmt-msg-bubble">${text}</div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    state.chatHistory.push({ role, text });
    saveSession();
  }

  function setStatus(text) {
    const el = document.getElementById('gmt-status-text');
    if (el) el.textContent = text;
  }

  function setBubbleState(state_) {
    const dockTab = document.getElementById('gmt-dock-tab');
    if (dockTab) {
      dockTab.classList.remove('gmt-listening', 'gmt-guiding');
      if (state_ === 'listening') dockTab.classList.add('gmt-listening');
      if (state_ === 'guiding') dockTab.classList.add('gmt-guiding');
    }
  }

  function detectLanguage(text) {
    const idWords = /\b(saya|aku|bantu|buat|buka|pergi|cari|minta|tolong|gimana|bagaimana|ingin|mau)\b/i;
    return idWords.test(text) ? 'id' : 'en';
  }

  function getStorageValue(key) {
    return new Promise(resolve => chrome.storage.local.get(key, r => resolve(r[key] || null)));
  }

  function getDOMSummary() {
    const summary = [];
    summary.push(`Page Title: "${document.title}"`);
    summary.push(`Current URL: ${window.location.href}`);
    summary.push(`Page Language: ${document.documentElement.lang || 'auto'}`);

    // Main headings to understand page purpose
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map(h => h.innerText?.trim())
      .filter(Boolean)
      .slice(0, 8);
    if (headings.length > 0) {
      summary.push(`Main Headings: ${headings.join(' | ')}`);
    }

    summary.push('Interactive Elements (Buttons, Inputs, Links):');
    const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"]');

    elements.forEach((el, index) => {
      if (index > 100) return;
      if (!isElementVisible(el)) return;

      const tag = el.tagName.toLowerCase();
      const text = (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('placeholder') || '').trim().slice(0, 60);
      const id = el.id ? `#${el.id}` : '';
      const classes = Array.from(el.classList).slice(0, 2).map(c => `.${c}`).join('');
      const role = el.getAttribute('role') ? `[role="${el.getAttribute('role')}"]` : '';

      const selector = id || `${tag}${classes}${role}` || tag;
      if (text || id) {
        summary.push(`- <${tag}> text: "${text}" selector: ${selector}`);
      }
    });

    return summary.join('\n');
  }

  // ─── Chrome message listener ───
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'GMT_TOGGLE_PANEL') {
      togglePanel();
      sendResponse({ ok: true, panelOpen: state.panelOpen });
      return true;
    }
    if (msg.type === 'GMT_GET_DOM_SUMMARY') {
      sendResponse(getDOMSummary());
      return true;
    }
    if (msg.type === 'GMT_PAGE_LOADED') {
      // Page finished loading, execute step if guiding is active
      if (state.steps.length > 0 && state.currentStep >= 0 && state.currentStep < state.steps.length) {
        setTimeout(() => executeCurrentStep(), 1000);
      }
      return true;
    }
  });

  // ─── Init ───
  buildUI();
  attachEvents();
  restoreSession();

  window.addEventListener('scroll', updateHighlightPosition, { passive: true });
  window.addEventListener('resize', updateHighlightPosition, { passive: true });

  // Notify service worker
  chrome.runtime.sendMessage({ type: 'GMT_INIT' }).catch(() => {});

  console.log('[GMT] Content script loaded on:', window.location.href);
})();

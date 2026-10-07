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
    isExecutingStep: false,
    isFinishingGuiding: false,
    isAdvancingStep: false,
    pageLoadExecTimeout: null,
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
          <button id="gmt-brain-btn" title="Otak & Glosarium Pintar (Simpanan Link/Info)" style="background:rgba(0,113,227,0.1);border:1px solid rgba(0,113,227,0.25);border-radius:8px;cursor:pointer;padding:5px 8px;color:#0071E3;font-size:13px;line-height:1;transition:background 0.2s;">🧠<span id="gmt-brain-badge" style="font-size:10px;font-weight:700;display:none;">0</span></button>
          <button id="gmt-hub-btn" title="Buka GMT Launchpad / Hub" style="background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.35);border-radius:8px;cursor:pointer;padding:5px 8px;color:#00D4FF;font-size:13px;line-height:1;transition:background 0.2s;">🚀</button>
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
          <textarea id="gmt-text-input" rows="3" placeholder="Minta saya panduan... / Ask me to guide..."></textarea>
          <div id="gmt-input-toolbar">
            <span class="gmt-input-hint">↵ Kirim · Shift+↵ Baris baru</span>
            <div class="gmt-input-buttons">
              <button id="gmt-mic-btn" title="Voice input">${ICONS.mic}</button>
              <button id="gmt-send-btn" title="Send">${ICONS.send}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Brain & Personal Glossary Panel (Apple Light Style) -->
      <div id="gmt-brain-panel" class="gmt-hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,0.08);padding-bottom:12px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">🧠</span>
            <div>
              <h4 style="margin:0;color:#1D1D1F;font-size:16px;font-weight:700;">Otak & Glosarium Pintar</h4>
              <p style="margin:0;color:#86868B;font-size:11.5px;">Kamus personal link & catatan Anda</p>
            </div>
          </div>
          <button id="gmt-brain-close-x" style="width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.05);border:none;color:#86868B;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;">✕</button>
        </div>

        <!-- Quick Add Section -->
        <div class="gmt-brain-add-box">
          <div style="font-size:12.5px;font-weight:700;color:#1D1D1F;margin-bottom:6px;">➕ Tambah Simpanan Baru</div>
          <input type="text" id="gmt-brain-input-key" placeholder="Nama / Panggilan (cth: profil facebook kanwil)" style="margin-bottom:8px;" />
          <input type="text" id="gmt-brain-input-val" placeholder="Link URL atau Catatan (cth: https://facebook.com/...)" style="margin-bottom:10px;" />
          <div style="display:flex;gap:6px;">
            <button id="gmt-brain-save-btn" class="gmt-save-btn" style="padding:8px 12px;font-size:12.5px;margin-top:0;">Simpan ke Otak</button>
            <button id="gmt-brain-use-cur-btn" class="gmt-mini-btn" style="font-size:11px;padding:8px;" title="Gunakan link tab saat ini">Pakai Link Tab Ini</button>
          </div>
        </div>

        <!-- Search Bar -->
        <div style="margin:4px 0 10px 0;position:relative;">
          <input type="text" id="gmt-brain-search" placeholder="🔍 Cari di kamus otak..." />
        </div>

        <!-- Stored Items List -->
        <div id="gmt-brain-list" style="overflow-y:auto;max-height:calc(100vh - 350px);display:flex;flex-direction:column;gap:8px;padding-right:2px;flex:1;">
          <!-- Rendered via JS -->
        </div>

        <!-- Tip Box -->
        <div style="margin-top:14px;padding:10px 12px;background:#F5F5F7;border-radius:10px;border:1px solid rgba(0,0,0,0.06);font-size:11.5px;color:#86868B;line-height:1.4;">
          💡 <strong>Tips:</strong> Anda juga bisa suruh AI lewat chat: <em>"Tolong simpan link facebook kanwil https://..."</em> dan panggil <em>"Tolong cek facebook kanwil"</em>.
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

      <!-- Safety Confirmation Modal for Autopilot (Disembunyikan dulu) -->
      <div id="gmt-safety-modal" class="gmt-hidden" style="display: none !important;">
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

      <!-- Gesture Floating Indicator (Kiri Atas, Ukuran Besar) -->
      <div id="gmt-gesture-indicator" class="gmt-hidden">
        <div class="gmt-gesture-header">
          <div class="gmt-gesture-header-title">
            <span class="gmt-gesture-live-dot"></span>
            <span style="font-weight:700;font-size:12px;color:#fff;">Kamera Gestur</span>
            <span id="gmt-gesture-ai-badge" style="font-size:9px;background:rgba(0,229,255,0.18);color:#00E5FF;padding:1px 5px;border-radius:4px;border:1px solid rgba(0,229,255,0.4);font-weight:700;">⚡ MediaPipe AI</span>
            <span id="gmt-gesture-night-badge" class="gmt-hidden" style="font-size:9px;background:rgba(255,152,0,0.25);color:#FFA726;padding:1px 5px;border-radius:4px;border:1px solid rgba(255,152,0,0.4);">🌙 Malam</span>
          </div>
          <div class="gmt-gesture-header-actions">
            <button class="gmt-gesture-btn-icon" id="gmt-gesture-toggle-size" title="Perkecil / Perbesar Ukuran Kamera">🗖</button>
            <button class="gmt-gesture-btn-icon" id="gmt-gesture-off" title="Matikan Gestur">✕</button>
          </div>
        </div>

        <div class="gmt-gesture-canvas-wrap">
          <canvas id="gmt-gesture-preview" width="240" height="180" title="Kamera Gestur"></canvas>
          <div id="gmt-gesture-feed-hud" class="gmt-gesture-feed-hud">
            <span id="gmt-gesture-hud-badge">🖐️ Buka Tangan (Scroll)</span>
          </div>
        </div>

        <div class="gmt-gesture-footer">
          <div style="display:flex;align-items:center;gap:6px;">
            <span id="gmt-gesture-icon" style="font-size:15px;">🖐️</span>
            <span id="gmt-gesture-text" style="font-weight:700;font-size:11.5px;color:#fff;">Gestur Aktif</span>
          </div>
          <span id="gmt-gesture-subtext" style="font-size:9.5px;color:rgba(255,255,255,0.7);line-height:1.3;">🖐️ Naik/Turun = Scroll • ✊ Kepal = Stop</span>
        </div>
      </div>

      <!-- Virtual Gesture Mouse Cursor -->
      <div id="gmt-gesture-cursor" class="gmt-hidden">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 2L11 20L14 13L21 10L4 2Z" fill="#00D4FF" stroke="#001827" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
        <div class="gmt-cursor-ring" id="gmt-cursor-ring"></div>
        <div class="gmt-cursor-badge" id="gmt-cursor-badge">1 Jari</div>
      </div>

      <!-- Tooltip -->
      <div id="gmt-tooltip" class="gmt-hidden">
        <div id="gmt-tooltip-step"></div>
        <div id="gmt-tooltip-text"></div>
        <div id="gmt-tooltip-actions">
          <button id="gmt-tooltip-next-btn">Lanjut ➔</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
  }

  // Draggable bubble replaced by right-edge dock tab #gmt-dock-tab

  // ─── Session Persistence ───
  function isExtensionValid() {
    try {
      return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
    } catch (e) {
      return false;
    }
  }

  function saveSession() {
    if (!isExtensionValid()) return;
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
      // Quietly ignore if context was invalidated during reload
      if (!e.message?.includes('Extension context invalidated')) {
        console.warn('[GMT] saveSession error:', e);
      }
    }
  }

  function saveSessionAsync() {
    return new Promise(resolve => {
      if (!isExtensionValid()) return resolve();
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
    if (!isExtensionValid()) return;
    try {
      chrome.storage.local.remove(['gmt_session']);
    } catch (e) {}
  }

  async function restoreSession() {
    if (!isExtensionValid()) return;
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
        toggleWakeWord(true);
      }
      if (state.gestureActive) {
        toggleGestureControl(true);
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

        // Allow page/SPA elements (e.g. YouTube, Gmail) to render without double execution
        clearTimeout(state.pageLoadExecTimeout);
        state.pageLoadExecTimeout = setTimeout(() => {
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

    // Open Hub Launchpad
    document.getElementById('gmt-hub-btn')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'GMT_OPEN_HUB' }).catch(() => {});
    });

    // Send button
    document.getElementById('gmt-send-btn')?.addEventListener('click', sendCommand);

    // Enter key in textarea (Enter to send, Shift+Enter for new line)
    const textInput = document.getElementById('gmt-text-input');
    textInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendCommand();
      }
    });

    // Auto-expand textarea on typing
    textInput?.addEventListener('input', () => {
      textInput.style.height = 'auto';
      textInput.style.height = Math.min(textInput.scrollHeight, 160) + 'px';
    });

    // Mic button (in chat input area)
    document.getElementById('gmt-mic-btn')?.addEventListener('click', toggleListening);

    // Action buttons
    document.getElementById('gmt-skip-btn')?.addEventListener('click', skipStep);
    document.getElementById('gmt-stop-btn')?.addEventListener('click', stopGuiding);
    document.getElementById('gmt-repeat-btn')?.addEventListener('click', repeatStep);

    // Tooltip next button
    document.getElementById('gmt-tooltip-next-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      onUserClickedTarget();
    });

    // Settings
    document.getElementById('gmt-settings-btn')?.addEventListener('click', openSettings);
    document.getElementById('gmt-close-settings')?.addEventListener('click', closeSettings);
    const closeX = document.getElementById('gmt-settings-close-x');
    if (closeX) closeX.addEventListener('click', closeSettings);
    document.getElementById('gmt-save-settings')?.addEventListener('click', saveSettings);

    // Brain & Glossary
    document.getElementById('gmt-brain-btn')?.addEventListener('click', openBrain);
    document.getElementById('gmt-brain-close-x')?.addEventListener('click', closeBrain);
    document.getElementById('gmt-brain-save-btn')?.addEventListener('click', handleAddBrainManual);
    document.getElementById('gmt-brain-use-cur-btn')?.addEventListener('click', () => {
      const valInput = document.getElementById('gmt-brain-input-val');
      if (valInput) valInput.value = window.location.href;
    });
    document.getElementById('gmt-brain-search')?.addEventListener('input', (e) => {
      renderBrainList(e.target.value);
    });
    document.getElementById('gmt-brain-list')?.addEventListener('click', (e) => {
      const openBtn = e.target.closest('.gmt-brain-action-open');
      if (openBtn) {
        const key = openBtn.getAttribute('data-key');
        const val = openBtn.getAttribute('data-val');
        const isUrl = openBtn.getAttribute('data-is-url') === 'true';
        handleUseBrainItem(key, val, isUrl);
        return;
      }
      const delBtn = e.target.closest('.gmt-brain-action-delete');
      if (delBtn) {
        const key = delBtn.getAttribute('data-key');
        handleDeleteBrainItem(key);
        return;
      }
    });

    // Escape key to close panel
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (state.panelOpen || state.settingsOpen || state.brainOpen)) {
        closePanel();
        closeSettings();
        closeBrain();
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
    document.getElementById('gmt-gesture-off')?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleGestureControl();
    });
    document.getElementById('gmt-gesture-toggle-size')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('gmt-gesture-indicator')?.classList.toggle('gmt-compact');
    });

    // Load saved settings & brain items into UI
    loadSettingsIntoForm();
    loadBrainItems();
  }

  function togglePanel() {
    state.panelOpen = !state.panelOpen;
    const panel = document.getElementById('gmt-panel');
    const dockTab = document.getElementById('gmt-dock-tab');
    const settings = document.getElementById('gmt-settings');
    const brain = document.getElementById('gmt-brain-panel');
    if (state.panelOpen) {
      panel?.classList.remove('gmt-hidden');
      settings?.classList.add('gmt-hidden');
      brain?.classList.add('gmt-hidden');
      state.settingsOpen = false;
      state.brainOpen = false;
      dockTab?.classList.add('gmt-panel-open');
      document.documentElement.classList.add('gmt-panel-open');
      document.body.classList.add('gmt-panel-open');
      setTimeout(() => document.getElementById('gmt-text-input')?.focus(), 150);
    } else {
      panel?.classList.add('gmt-hidden');
      settings?.classList.add('gmt-hidden');
      brain?.classList.add('gmt-hidden');
      state.settingsOpen = false;
      state.brainOpen = false;
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
    input.style.height = '';
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
        mode: state.mode || 'guide',
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

      // Brain update (Personal Glossary)
      if (plan.brain_update) {
        loadBrainItems();
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
    if (!state.steps || state.steps.length === 0) return;

    if (state.currentStep >= state.steps.length) {
      finishGuiding();
      return;
    }

    if (state.isExecutingStep) {
      console.log('[GMT] Step already in progress, ignoring duplicate call.');
      return;
    }
    state.isExecutingStep = true;

    try {
      const step = state.steps[state.currentStep];
      if (!step) {
        finishGuiding();
        return;
      }

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
        el = await waitForElement(step.selector, 7000);
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
    } finally {
      state.isExecutingStep = false;
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
    if (state.isFinishingGuiding) return;
    if (!state.steps || state.steps.length === 0) return;

    state.isFinishingGuiding = true;
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

    setTimeout(() => {
      state.isFinishingGuiding = false;
    }, 1500);
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
          if (found) {
            // If found element is a container or label, check if it contains a form control
            const directInput = found.querySelector?.('input, textarea, select, [role="radio"], [role="checkbox"]');
            if (directInput && isElementVisible(directInput)) return directInput;
            const container = found.closest?.('div[role="listitem"], .Qr7Oae, .geS5n, .form-group, label');
            if (container) {
              const cInput = container.querySelector('input, textarea, select, [role="radio"], [role="checkbox"]');
              if (cInput && isElementVisible(cInput)) return cInput;
            }
            return found;
          }
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

      // Auto-detect click or typing to advance ONLY in Guide Mode (NOT in Autopilot)
      if (state.mode !== 'autopilot') {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          try { el.focus(); } catch (e) {}
          const onInputDone = (e) => {
            if (e.type === 'keydown' && e.key !== 'Enter') return;
            cleanup();
            onUserClickedTarget();
          };
          const cleanup = () => {
            el.removeEventListener('change', onInputDone);
            el.removeEventListener('keydown', onInputDone);
          };
          currentTargetCleanup = cleanup;
          el.addEventListener('change', onInputDone);
          el.addEventListener('keydown', onInputDone);
        } else {
          const onClickDone = () => {
            currentTargetCleanup = null;
            onUserClickedTarget();
          };
          currentTargetCleanup = () => el.removeEventListener('click', onClickDone);
          el.addEventListener('click', onClickDone, { once: true });
        }
      }

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
    if (state.isAdvancingStep || state.mode === 'autopilot') return;
    state.isAdvancingStep = true;
    clearHighlight();
    state.currentStep++;
    saveSession();
    setTimeout(() => {
      state.isAdvancingStep = false;
      executeCurrentStep();
    }, 800);
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

  let currentTargetCleanup = null;
  function clearHighlight() {
    if (currentTargetCleanup) {
      try { currentTargetCleanup(); } catch (e) {}
      currentTargetCleanup = null;
    }
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

    // Check sensitive action safety confirmation (Disembunyikan dulu)
    /*
    if (step.is_sensitive) {
      const confirmed = await promptSafetyConfirmation(step);
      if (!confirmed) {
        skipStep();
        return;
      }
    }
    */

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
        try {
          const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
          const nativeTextareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
          if (el.tagName === 'INPUT' && nativeInputSetter) {
            nativeInputSetter.call(el, inputVal);
          } else if (el.tagName === 'TEXTAREA' && nativeTextareaSetter) {
            nativeTextareaSetter.call(el, inputVal);
          } else {
            el.value = inputVal;
          }
        } catch (e) {
          el.value = inputVal;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        // If it's a search field, also dispatch Enter key
        if (el.matches?.('input[type="search"], input[name="q"], input#search, input[name="search_query"]')) {
          el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
        }
      }
    } else {
      // Click action
      if (cursor) cursor.classList.add('clicking');
      spawnClickRipple(targetX, targetY);

      if (el) {
        try { el.focus(); } catch (e) {}
        const opts = { bubbles: true, cancelable: true, view: window };
        el.dispatchEvent(new PointerEvent('pointerdown', opts));
        el.dispatchEvent(new MouseEvent('mousedown', opts));
        el.dispatchEvent(new PointerEvent('pointerup', opts));
        el.dispatchEvent(new MouseEvent('mouseup', opts));
        el.click();

        // If it's an anchor tag or inside one (e.g. YouTube video title/thumbnail)
        const anchor = el.tagName === 'A' ? el : el.closest('a');
        if (anchor && anchor.href && !anchor.href.startsWith('javascript:')) {
          const currentUrlNow = window.location.href;
          setTimeout(() => {
            if (window.location.href === currentUrlNow && anchor.href) {
              anchor.click();
            }
          }, 350);
        }
      } else {
        const pointEl = document.elementFromPoint(targetX, targetY);
        if (pointEl) {
          const opts = { bubbles: true, cancelable: true, view: window };
          pointEl.dispatchEvent(new MouseEvent('mousedown', opts));
          pointEl.dispatchEvent(new MouseEvent('mouseup', opts));
          pointEl.click();
        }
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
    // Disembunyikan dulu: otomatis lolos / resolve true tanpa memunculkan modal
    return Promise.resolve(true);
    /*
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
    */
  }

  function spawnClickRipple(x, y, color = '#00D4FF') {
    const ripple = document.createElement('div');
    ripple.className = 'gmt-click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '60px';
    ripple.style.height = '60px';
    if (color && color !== '#00D4FF') {
      ripple.style.background = `radial-gradient(circle, ${color} 0%, rgba(255, 152, 0, 0.4) 50%, transparent 75%)`;
    }
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
  function toggleWakeWord(forceState = null) {
    if (typeof forceState === 'boolean') {
      state.wakeWordActive = forceState;
    } else {
      state.wakeWordActive = !state.wakeWordActive;
    }
    updateToggleCard('wake', state.wakeWordActive);

    if (state.wakeWordActive) {
      chrome.runtime.sendMessage({ type: 'GMT_ENABLE_WAKE_WORD', lang: state.lang }, (res) => {
        if (res?.needPermission) {
          addMessage('ai', '🎙️ Silakan izinkan akses mikrofon pada tab baru yang terbuka agar wake word dapat aktif di semua website tanpa terputus.');
        } else {
          if (forceState === null) {
            addMessage('ai', state.lang === 'id'
              ? '🎙️ **Mikrofon Wake Word Aktif!**\nUcapkan *"Halo GMT"* atau *"Hey GMT"* kapan saja, bahkan saat berpindah ke website lain (seperti kompas.com).'
              : '🎙️ **Microphone Wake Word Active!**\nSay *"Hey GMT"* anytime across all websites.');
          }
        }
      });
    } else {
      chrome.runtime.sendMessage({ type: 'GMT_DISABLE_WAKE_WORD' }).catch(() => {});
      if (forceState === null) {
        addMessage('ai', state.lang === 'id' ? '🎙️ Mikrofon Wake Word dimatikan.' : '🎙️ Microphone Wake Word disabled.');
      }
    }
    saveSession();
  }

  // ─── Hands-free Hand Gesture Vision Engine (Dedicated to Scroll Only) ───
  // Mode Gestur: Murni Hanya Untuk Scroll Halaman Bebas Tangan (Hands-Free Scroll)
  // • 🖐️ Buka Tangan (Naik / Turun): Scroll halaman ke atas / bawah ⬆️⬇️
  // • ✊ Kepalkan Tangan (Genggam): Hentikan scroll seketika ⏹️
  // (Semua gestur klik mouse & pergeseran kursor telah dinonaktifkan demi akurasi scroll)

  let gestureStream = null;
  let gestureInterval = null;
  let prevCentroidY = null;
  let prevTipY = null;

  // ─── Google MediaPipe Hands Neural Engine State ───
  let mpHandsInstance = null;
  let isMediaPipeActive = false;
  let mediaPipeInitFailed = false;
  let prevMpCentroidY = null;
  let isSendingMpFrame = false;

  const MP_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],        // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],        // Index
    [5, 9], [9, 10], [10, 11], [11, 12],   // Middle
    [9, 13], [13, 14], [14, 15], [15, 16], // Ring
    [13, 17], [0, 17], [17, 18], [18, 19], [19, 20] // Pinky & Palm base
  ];

  async function toggleGestureControl(forceState = null) {
    if (typeof forceState === 'boolean') {
      state.gestureActive = forceState;
    } else {
      state.gestureActive = !state.gestureActive;
    }

    const indicator = document.getElementById('gmt-gesture-indicator');
    const check = document.getElementById('gmt-gesture-check');
    const cursor = document.getElementById('gmt-gesture-cursor');
    if (check) check.checked = state.gestureActive;
    updateToggleCard('gesture', state.gestureActive);

    if (state.gestureActive) {
      try {
        gestureStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: 24 }
        });
        indicator?.classList.remove('gmt-hidden');
        cursor?.classList.add('gmt-hidden');
        if (indicator) {
          indicator.style.cursor = 'default';
          indicator.onclick = null;
        }
        startGestureTracking();
        if (forceState === null) {
          addMessage('ai', '🖐️ **Mode Hands-Free Scroll Aktif!**\n\n• 🖐️ **Buka Tangan:** Gerakkan tangan ke atas / bawah untuk scroll halaman ⬆️⬇️\n• ✊ **Kepalkan Tangan (Genggam):** Hentikan scroll seketika ⏹️\n\n*(Semua gestur lain dinonaktifkan — 100% didedikasikan untuk kenyamanan scrolling)*');
        }
      } catch (err) {
        console.warn('[GMT] Gesture getUserMedia permission notice:', err);
        if (forceState === true) {
          indicator?.classList.remove('gmt-hidden');
          updateGestureStatus('🖐️', 'Klik untuk izinkan kamera di halaman ini');
          if (indicator) {
            indicator.style.cursor = 'pointer';
            indicator.title = 'Klik di sini untuk mengaktifkan izin kamera di halaman ini';
            indicator.onclick = (e) => {
              e.stopPropagation();
              toggleGestureControl(true);
            };
          }
        } else {
          state.gestureActive = false;
          indicator?.classList.add('gmt-hidden');
          cursor?.classList.add('gmt-hidden');
          if (check) check.checked = false;
          updateToggleCard('gesture', false);
          addMessage('ai', '⚠️ Izin kamera diperlukan untuk fitur kontrol gestur tangan.');
        }
      }
    } else {
      stopGestureTracking();
      indicator?.classList.add('gmt-hidden');
      cursor?.classList.add('gmt-hidden');
    }
    saveSession();
  }

  // ─── Universal Smart Page Scroll Engine (Bekerja di YouTube, SPA, Virtual DOM) ───
  let lastScrollTriggerTime = 0;

  function performSmartPageScroll(distance) {
    const now = Date.now();
    // Beri jeda minimal 110ms agar animasi scroll di Chromium tidak dibatalkan oleh frame berikutnya
    if (now - lastScrollTriggerTime < 110) {
      return;
    }
    lastScrollTriggerTime = now;

    // 1. Standar window scroll
    try {
      window.scrollBy({ top: distance, behavior: 'smooth' });
    } catch (e) {}

    // 2. document.scrollingElement / documentElement / body
    const scrollEl = document.scrollingElement || document.documentElement || document.body;
    if (scrollEl) {
      try {
        scrollEl.scrollBy({ top: distance, behavior: 'smooth' });
      } catch (e) {}
    }

    // 3. Kontainer spesifik YouTube (#content, ytd-app, #page-manager, ytd-watch-flexy, #primary)
    const ytSelectors = [
      'ytd-app',
      '#content',
      '#page-manager',
      'ytd-watch-flexy',
      '#primary',
      '#columns',
      '#secondary',
      '#contents',
      'ytd-playlist-video-list-renderer',
      'main',
      '[role="main"]',
      '#root',
      '#app'
    ];

    for (const sel of ytSelectors) {
      try {
        const el = document.querySelector(sel);
        if (el && el.scrollHeight > el.clientHeight) {
          el.scrollBy({ top: distance, behavior: 'smooth' });
        }
      } catch (e) {}
    }

    // 4. Cari kontainer scrollable aktif di tengah viewport
    try {
      const midX = Math.round(window.innerWidth / 2);
      const midY = Math.round(window.innerHeight / 2);
      let curr = document.elementFromPoint(midX, midY);
      while (curr && curr !== document.body && curr !== document.documentElement) {
        const style = window.getComputedStyle(curr);
        if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && curr.scrollHeight > curr.clientHeight) {
          curr.scrollBy({ top: distance, behavior: 'smooth' });
          break;
        }
        curr = curr.parentElement;
      }
    } catch (e) {}

    // 5. Dispatch synthetic WheelEvent ke elemen di tengah layar
    // Ini adalah kunci agar halaman YouTube (Polymer SPA / Virtual List) merespons gerakan scroll!
    try {
      const midX = Math.round(window.innerWidth / 2);
      const midY = Math.round(window.innerHeight / 2);
      const targetEl = document.elementFromPoint(midX, midY) || document.body;
      if (targetEl) {
        const wheelEv = new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: midX,
          clientY: midY,
          deltaY: distance,
          deltaMode: 0 // DOM_DELTA_PIXEL
        });
        targetEl.dispatchEvent(wheelEv);
      }
    } catch (e) {}
  }

  function performInstantStopScroll() {
    try {
      window.scrollTo({ top: window.scrollY, behavior: 'auto' });
    } catch (e) {}

    const scrollEl = document.scrollingElement || document.documentElement || document.body;
    if (scrollEl) {
      try {
        scrollEl.scrollTo({ top: scrollEl.scrollTop, behavior: 'auto' });
      } catch (e) {}
    }

    const ytSelectors = ['ytd-app', '#content', '#page-manager', 'ytd-watch-flexy', '#primary', 'main'];
    for (const sel of ytSelectors) {
      try {
        const el = document.querySelector(sel);
        if (el) {
          el.scrollTo({ top: el.scrollTop, behavior: 'auto' });
        }
      } catch (e) {}
    }
  }

  function handleMediaPipeResults(results, video) {
    const previewCanvas = document.getElementById('gmt-gesture-preview');
    if (!previewCanvas) return;
    const previewCtx = previewCanvas.getContext('2d');
    const CW = previewCanvas.width;
    const CH = previewCanvas.height;
    const hudBadge = document.getElementById('gmt-gesture-hud-badge');

    // 1. Render mirrored live camera feed
    previewCtx.save();
    previewCtx.translate(CW, 0);
    previewCtx.scale(-1, 1);
    previewCtx.drawImage(video, 0, 0, CW, CH);
    previewCtx.restore();

    // 2. Check detected hands
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      prevMpCentroidY = null;
      updateGestureStatus('🖐️', 'Arahkan tangan ke kamera...');
      if (hudBadge) {
        hudBadge.textContent = '🔍 Arahkan Tangan...';
        hudBadge.style.color = '#FFA726';
        hudBadge.style.borderColor = 'rgba(255, 167, 38, 0.4)';
      }
      return;
    }

    const lm = results.multiHandLandmarks[0];

    // 3. Render 21-point MediaPipe futuristic cyber skeleton
    // Bones connections
    previewCtx.strokeStyle = 'rgba(0, 229, 255, 0.75)';
    previewCtx.lineWidth = 2.2;
    for (let i = 0; i < MP_CONNECTIONS.length; i++) {
      const [i1, i2] = MP_CONNECTIONS[i];
      const p1 = lm[i1];
      const p2 = lm[i2];
      previewCtx.beginPath();
      previewCtx.moveTo((1 - p1.x) * CW, p1.y * CH);
      previewCtx.lineTo((1 - p2.x) * CW, p2.y * CH);
      previewCtx.stroke();
    }

    // Joints
    for (let i = 0; i < lm.length; i++) {
      const px = (1 - lm[i].x) * CW;
      const py = lm[i].y * CH;
      const isTip = (i === 4 || i === 8 || i === 12 || i === 16 || i === 20);

      previewCtx.beginPath();
      previewCtx.arc(px, py, isTip ? 5 : 3, 0, Math.PI * 2);
      previewCtx.fillStyle = isTip ? '#00FF66' : '#00E5FF';
      previewCtx.fill();
      previewCtx.strokeStyle = '#052A12';
      previewCtx.lineWidth = 1;
      previewCtx.stroke();
    }

    // 4. Analyze hand pose (Finger extension & curl)
    const isIndexExtended = lm[8].y < lm[6].y;
    const isMiddleExtended = lm[12].y < lm[10].y;
    const isRingExtended = lm[16].y < lm[14].y;
    const isPinkyExtended = lm[20].y < lm[18].y;

    // Thumb extension check
    const thumbDist = Math.hypot(lm[4].x - lm[17].x, lm[4].y - lm[17].y);
    const thumbMcpDist = Math.hypot(lm[2].x - lm[17].x, lm[2].y - lm[17].y);
    const isThumbExtended = thumbDist > thumbMcpDist * 1.15;

    let openFingers = 0;
    if (isIndexExtended) openFingers++;
    if (isMiddleExtended) openFingers++;
    if (isRingExtended) openFingers++;
    if (isPinkyExtended) openFingers++;
    if (isThumbExtended) openFingers++;

    // 5. Fist detection (All 4 main fingers curled) -> Immediate Stop Scroll
    const isFist = (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended);

    if (isFist) {
      performInstantStopScroll();
      prevMpCentroidY = null;
      updateGestureStatus('✊', 'Genggam: Scroll Berhenti ⏹️');
      if (hudBadge) {
        hudBadge.textContent = '✊ Genggam (Stop Scroll)';
        hudBadge.style.color = '#FF453A';
        hudBadge.style.borderColor = 'rgba(255, 69, 58, 0.5)';
      }
      logGestureChat('stop_scroll', '✊ <b>Menggenggam:</b> Menghentikan (stop) scroll halaman ⏹️', 2000);
      return;
    }

    // 6. Open hand detection -> Direction-based smooth scroll
    if (openFingers >= 3) {
      const palmY = (lm[0].y + lm[9].y) / 2;

      if (prevMpCentroidY !== null) {
        const deltaY = palmY - prevMpCentroidY;

        if (deltaY < -0.012 || palmY < 0.35) {
          performSmartPageScroll(-200);
          updateGestureStatus('🖐️', 'Buka Tangan: Scroll Ke Atas ⬆️');
          if (hudBadge) {
            hudBadge.textContent = '⬆️ Scroll Ke Atas';
            hudBadge.style.color = '#00FF66';
            hudBadge.style.borderColor = 'rgba(0, 255, 102, 0.5)';
          }
          logGestureChat('scroll_up', '🖐️ <b>Buka Tangan:</b> Scroll halaman ke atas ⬆️', 2000);
        } else if (deltaY > 0.012 || palmY > 0.65) {
          performSmartPageScroll(200);
          updateGestureStatus('🖐️', 'Buka Tangan: Scroll Ke Bawah ⬇️');
          if (hudBadge) {
            hudBadge.textContent = '⬇️ Scroll Ke Bawah';
            hudBadge.style.color = '#00FF66';
            hudBadge.style.borderColor = 'rgba(0, 255, 102, 0.5)';
          }
          logGestureChat('scroll_down', '🖐️ <b>Buka Tangan:</b> Scroll halaman ke bawah ⬇️', 2000);
        } else {
          updateGestureStatus('🖐️', 'Buka Tangan: Siap Scroll (Gerak Naik/Turun)');
          if (hudBadge) {
            hudBadge.textContent = '🖐️ Buka Tangan (Siap Scroll)';
            hudBadge.style.color = '#00E5FF';
            hudBadge.style.borderColor = 'rgba(0, 229, 255, 0.5)';
          }
        }
      }
      prevMpCentroidY = palmY;
      return;
    }

    updateGestureStatus('🖐️', 'Buka Tangan untuk Scroll / Genggam untuk Stop');
  }

  async function startGestureTracking() {
    const video = document.createElement('video');
    video.srcObject = gestureStream;
    video.setAttribute('playsinline', 'true');
    video.muted = true;
    video.play().catch(() => {});

    // 1. Try Google MediaPipe Hands Neural Engine
    if (typeof window.Hands !== 'undefined' && !mediaPipeInitFailed) {
      try {
        if (!mpHandsInstance) {
          mpHandsInstance = new window.Hands({
            locateFile: (file) => chrome.runtime.getURL(`lib/mediapipe/${file}`)
          });
          mpHandsInstance.setOptions({
            maxNumHands: 1,
            modelComplexity: 0,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          mpHandsInstance.onResults((results) => handleMediaPipeResults(results, video));
          await mpHandsInstance.initialize();
        }

        isMediaPipeActive = true;
        const aiBadge = document.getElementById('gmt-gesture-ai-badge');
        if (aiBadge) {
          aiBadge.textContent = '⚡ MediaPipe AI';
          aiBadge.style.display = 'inline-block';
        }

        if (gestureInterval) clearInterval(gestureInterval);
        gestureInterval = setInterval(async () => {
          if (!gestureStream || !video.videoWidth || !mpHandsInstance) return;
          if (isSendingMpFrame) return;
          isSendingMpFrame = true;
          try {
            await mpHandsInstance.send({ image: video });
          } catch (err) {
            console.warn('[GMT] MediaPipe frame send notice:', err);
          } finally {
            isSendingMpFrame = false;
          }
        }, 40);
        return;
      } catch (err) {
        console.warn('[GMT] MediaPipe initialization notice, switching to fallback engine:', err);
        mediaPipeInitFailed = true;
        isMediaPipeActive = false;
        const aiBadge = document.getElementById('gmt-gesture-ai-badge');
        if (aiBadge) {
          aiBadge.textContent = '📐 Canvas Engine';
          aiBadge.style.color = '#FFA726';
          aiBadge.style.borderColor = 'rgba(255, 167, 38, 0.4)';
        }
      }
    }

    // 2. Fallback to Canvas Engine
    startCanvasFallbackTracking(video);
  }

  function startCanvasFallbackTracking(video) {
    const VW = 160;
    const VH = 120;
    const canvas = document.createElement('canvas');
    canvas.width = VW;
    canvas.height = VH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const cursorEl = document.getElementById('gmt-gesture-cursor');
    const cursorRing = document.getElementById('gmt-cursor-ring');
    const cursorBadge = document.getElementById('gmt-cursor-badge');
    const previewCanvas = document.getElementById('gmt-gesture-preview');
    const previewCtx = previewCanvas ? previewCanvas.getContext('2d') : null;
    const nightBadge = document.getElementById('gmt-gesture-night-badge');
    const hudBadge = document.getElementById('gmt-gesture-hud-badge');

    let prevRawData = null;
    const gestureBuffer = [];

    function testIfFaceCluster(cl, frameData, mask, width, height) {
      const w = cl.maxX - cl.minX;
      const h = cl.maxY - cl.minY;
      if (w < 20 || h < 24) return false;

      const midX = Math.round((cl.minX + cl.maxX) / 2);
      const midY = Math.round((cl.minY + cl.maxY) / 2);

      // 1. Check for dark hair above the top edge (forehead boundary)
      let darkHairCount = 0;
      let hairSamples = 0;
      for (let dy = 2; dy <= 14; dy += 2) {
        const hy = cl.minY - dy;
        if (hy < 0) break;
        for (let dx = -14; dx <= 14; dx += 4) {
          const hx = midX + dx;
          if (hx < 0 || hx >= width) continue;
          const idx = (hy * width + hx) * 4;
          const luma = 0.299 * frameData[idx] + 0.587 * frameData[idx + 1] + 0.114 * frameData[idx + 2];
          hairSamples++;
          if (luma < 75 && mask[hy * width + hx] === 0) {
            darkHairCount++;
          }
        }
      }
      const hasDarkHairAbove = hairSamples > 0 && (darkHairCount / hairSamples) > 0.35;

      // 2. Eye region contrast check
      const eyeY = Math.round(cl.minY + h * 0.38);
      const noseX = midX;
      const leftEyeX = Math.round(midX - w * 0.26);
      const rightEyeX = Math.round(midX + w * 0.26);

      const getLuma = (px, py) => {
        if (px < 0 || px >= width || py < 0 || py >= height) return 128;
        const idx = (py * width + px) * 4;
        return 0.299 * frameData[idx] + 0.587 * frameData[idx + 1] + 0.114 * frameData[idx + 2];
      };

      const noseLuma = getLuma(noseX, eyeY);
      const leftEyeLuma = getLuma(leftEyeX, eyeY);
      const rightEyeLuma = getLuma(rightEyeX, eyeY);

      const hasEyeContrast = (noseLuma - leftEyeLuma > 12) || (noseLuma - rightEyeLuma > 12) ||
                             (mask[eyeY * width + leftEyeX] === 0 && mask[eyeY * width + rightEyeX] === 0);

      // 3. Central position check
      const isCentered = (midX > width * 0.2 && midX < width * 0.8 && midY < height * 0.72);

      if (hasDarkHairAbove && (hasEyeContrast || isCentered)) return true;
      if (hasEyeContrast && isCentered && w > 26 && h > 30) return true;
      return false;
    }

    gestureInterval = setInterval(() => {
      if (!gestureStream || !video.videoWidth) return;

      // 1. Draw raw video frame to processing canvas
      ctx.filter = 'none';
      ctx.drawImage(video, 0, 0, VW, VH);
      const rawFrame = ctx.getImageData(0, 0, VW, VH);
      const rawData = rawFrame.data;

      // 2. Measure ambient luminance (check if nighttime / low-light)
      let sampleLuma = 0;
      let sampleCount = 0;
      for (let i = 0; i < rawData.length; i += 32) {
        sampleLuma += 0.299 * rawData[i] + 0.587 * rawData[i + 1] + 0.114 * rawData[i + 2];
        sampleCount++;
      }
      const avgBrightness = sampleLuma / (sampleCount || 1);
      const isNightMode = avgBrightness < 45;

      // 3. Auto-Gain Night Boost (Only in truly dark environments)
      let data = rawData;
      if (isNightMode) {
        if (nightBadge) nightBadge.classList.remove('gmt-hidden');
        const gain = Math.min(2.0, Math.max(1.2, 75 / (avgBrightness || 1)));
        ctx.filter = `brightness(${gain.toFixed(1)}) contrast(1.25)`;
        ctx.drawImage(video, 0, 0, VW, VH);
        ctx.filter = 'none';
        data = ctx.getImageData(0, 0, VW, VH).data;
      } else {
        if (nightBadge) nightBadge.classList.add('gmt-hidden');
      }

      // 4. Strict Human Skin Chromaticity Segmentation
      // Human skin has strong hemoglobin red dominance (R > G > B), which eliminates aluminum frames and white/beige walls
      const skinMask = new Uint8Array(VW * VH);
      let totalSkin = 0;
      let minX = VW, maxX = 0, minY = VH, maxY = 0;

      for (let y = 0; y < VH; y += 2) {
        for (let x = 0; x < VW; x += 2) {
          const idx = (y * VW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Strict skin RGB bounds
          if (r < 55 || g < 28 || b < 18) continue;
          if ((r - g) < 11 || (r - b) < 18) continue;

          // YCrCb color space
          const Y  =  0.299 * r + 0.587 * g + 0.114 * b;
          const Cr = (r - Y) * 0.713 + 128;
          const Cb = (b - Y) * 0.564 + 128;

          // Strict human skin chromaticity: Cr must be well above Cb
          const isMatch = (Cr >= 133 && Cr <= 175 && Cb >= 78 && Cb <= 126 && (Cr - Cb) >= 8);

          if (isMatch) {
            skinMask[y * VW + x] = 1;
            skinMask[(y + 1) * VW + x] = 1;
            skinMask[y * VW + (x + 1)] = 1;
            skinMask[(y + 1) * VW + (x + 1)] = 1;
            totalSkin += 4;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      prevRawData = rawData;

      // 5. Render Large Mirrored Camera Preview
      const CW = previewCanvas ? previewCanvas.width : 240;
      const CH = previewCanvas ? previewCanvas.height : 180;
      const sx = CW / VW;
      const sy = CH / VH;

      if (previewCtx) {
        previewCtx.save();
        previewCtx.translate(CW, 0);
        previewCtx.scale(-1, 1); // Mirror horizontally
        previewCtx.drawImage(video, 0, 0, CW, CH);
        previewCtx.restore();

        if (isNightMode) {
          previewCtx.fillStyle = 'rgba(255, 167, 38, 0.9)';
          previewCtx.font = 'bold 10px sans-serif';
          previewCtx.fillText('🌙 Malam', 8, 16);
        }
      }

      // Check if any skin pixels exist in frame
      const minPixels = isNightMode ? 120 : 180;
      if (totalSkin < minPixels) {
        cursorEl?.classList.add('gmt-hidden');
        prevCentroidY = null;
        prevTipY = null;
        updateGestureStatus('🖐️', isNightMode ? 'Malam: Dekatkan tangan ke kamera...' : 'Arahkan tangan ke kamera...');
        if (hudBadge) {
          hudBadge.textContent = '🔍 Arahkan Tangan...';
          hudBadge.style.color = '#FFA726';
          hudBadge.style.borderColor = 'rgba(255, 167, 38, 0.4)';
        }
        return;
      }

      // 6. Cluster Skin Pixels to Differentiate Face from Hand
      const GW = 16, GH = 12;
      const cellGrid = new Uint8Array(GW * GH);
      for (let y = 0; y < VH; y++) {
        const gy = Math.floor(y / 10);
        for (let x = 0; x < VW; x++) {
          if (skinMask[y * VW + x] === 1) {
            cellGrid[gy * GW + Math.floor(x / 10)]++;
          }
        }
      }

      const visited = new Uint8Array(GW * GH);
      const clusters = [];
      for (let gy = 0; gy < GH; gy++) {
        for (let gx = 0; gx < GW; gx++) {
          const gidx = gy * GW + gx;
          if (cellGrid[gidx] < 15 || visited[gidx]) continue;

          const queue = [[gx, gy]];
          visited[gidx] = 1;
          let blobMinX = gx * 10, blobMaxX = (gx + 1) * 10;
          let blobMinY = gy * 10, blobMaxY = (gy + 1) * 10;
          let blobSkinCount = 0;

          while (queue.length > 0) {
            const [cx_c, cy_c] = queue.shift();
            blobSkinCount += cellGrid[cy_c * GW + cx_c];
            blobMinX = Math.min(blobMinX, cx_c * 10);
            blobMaxX = Math.max(blobMaxX, (cx_c + 1) * 10);
            blobMinY = Math.min(blobMinY, cy_c * 10);
            blobMaxY = Math.max(blobMaxY, (cy_c + 1) * 10);

            const neighbors = [
              [cx_c + 1, cy_c], [cx_c - 1, cy_c],
              [cx_c, cy_c + 1], [cx_c, cy_c - 1]
            ];
            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < GW && ny >= 0 && ny < GH) {
                const nidx = ny * GW + nx;
                if (!visited[nidx] && cellGrid[nidx] >= 15) {
                  visited[nidx] = 1;
                  queue.push([nx, ny]);
                }
              }
            }
          }

          if (blobSkinCount >= 100) {
            clusters.push({
              minX: blobMinX,
              maxX: Math.min(VW - 1, blobMaxX),
              minY: blobMinY,
              maxY: Math.min(VH - 1, blobMaxY),
              skinCount: blobSkinCount
            });
          }
        }
      }

      // Classify clusters into Face vs Hand
      const handClusters = [];
      let detectedFace = null;
      for (const cl of clusters) {
        if (testIfFaceCluster(cl, data, skinMask, VW, VH)) {
          detectedFace = cl;
        } else {
          // A hand must extend into the active lower/middle workspace (cannot float near ceiling)
          if (cl.maxY >= Math.round(VH * 0.40) && cl.skinCount >= 140) {
            handClusters.push(cl);
          }
        }
      }

      let activeHand = null;
      if (handClusters.length > 0) {
        // Pick the most prominent hand cluster
        handClusters.sort((a, b) => b.skinCount - a.skinCount);
        activeHand = handClusters[0];
      }

      // If NO hand cluster is found (only face is in view, or face alone):
      if (!activeHand) {
        cursorEl?.classList.add('gmt-hidden');
        prevCentroidY = null;
        prevTipY = null;

        if (detectedFace) {
          updateGestureStatus('👤', 'Wajah Terdeteksi — Angkat Tangan untuk Gestur');
          if (hudBadge) {
            hudBadge.textContent = '👤 Wajah Terdeteksi (Angkat Tangan)';
            hudBadge.style.color = '#FFA726';
            hudBadge.style.borderColor = 'rgba(255, 167, 38, 0.5)';
          }

          // Draw subtle dashed face frame
          if (previewCtx) {
            const fLeft = CW - (detectedFace.maxX * sx);
            const fTop = detectedFace.minY * sy;
            const fWidth = (detectedFace.maxX - detectedFace.minX) * sx;
            const fHeight = (detectedFace.maxY - detectedFace.minY) * sy;

            previewCtx.strokeStyle = 'rgba(255, 167, 38, 0.45)';
            previewCtx.lineWidth = 1.5;
            previewCtx.setLineDash([4, 3]);
            previewCtx.strokeRect(fLeft, fTop, fWidth, fHeight);
            previewCtx.setLineDash([]);
          }
        } else {
          updateGestureStatus('🖐️', isNightMode ? 'Malam: Dekatkan tangan ke kamera...' : 'Arahkan tangan ke kamera...');
          if (hudBadge) {
            hudBadge.textContent = '🔍 Arahkan Tangan...';
            hudBadge.style.color = '#FFA726';
            hudBadge.style.borderColor = 'rgba(255, 167, 38, 0.4)';
          }
        }
        return;
      }

      // 7. Find True Palm Center inside activeHand cluster (Distance Transform)
      let bestDist = 0;
      let cx = Math.round((activeHand.minX + activeHand.maxX) / 2);
      let cy = Math.round((activeHand.minY + activeHand.maxY) / 2);

      const stepGrid = 3;
      for (let y = activeHand.minY + 4; y <= activeHand.maxY - 4; y += stepGrid) {
        for (let x = activeHand.minX + 4; x <= activeHand.maxX - 4; x += stepGrid) {
          if (skinMask[y * VW + x] !== 1) continue;

          let d = 2;
          const maxCheck = 28;
          let hitEdge = false;
          while (d < maxCheck && !hitEdge) {
            d += 2;
            const dDiag = Math.round(d * 0.707);
            const offsets = [
              [d, 0], [-d, 0], [0, d], [0, -d],
              [dDiag, dDiag], [-dDiag, dDiag], [dDiag, -dDiag], [-dDiag, -dDiag]
            ];
            for (let k = 0; k < 8; k++) {
              const nx = x + offsets[k][0];
              const ny = y + offsets[k][1];
              if (nx < 0 || nx >= VW || ny < 0 || ny >= VH || skinMask[ny * VW + nx] === 0) {
                hitEdge = true;
                break;
              }
            }
          }
          if (d > bestDist) {
            bestDist = d;
            cx = x;
            cy = y;
          }
        }
      }
      const palmRadius = Math.max(10, Math.min(26, bestDist));

      // 8. High-Resolution Multi-Ray Scanning (64 Rays across 210° Arc)
      const numRays = 64;
      const rayDists = new Float32Array(numRays);
      const rayTipsX = new Float32Array(numRays);
      const rayTipsY = new Float32Array(numRays);

      const startAngle = -Math.PI * 0.98; // ~ -176°
      const endAngle = Math.PI * 0.18;    // ~ +32°
      const stepAngle = (endAngle - startAngle) / (numRays - 1);
      const maxRayReach = Math.min(75, palmRadius * 3.8);

      for (let i = 0; i < numRays; i++) {
        const angle = startAngle + i * stepAngle;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        let maxD = palmRadius;
        let tipX = cx + Math.round(cosA * palmRadius);
        let tipY = cy + Math.round(sinA * palmRadius);
        let exitGap = 0;

        for (let d = palmRadius; d < maxRayReach; d += 2) {
          const px = Math.round(cx + cosA * d);
          const py = Math.round(cy + sinA * d);
          if (px < 0 || px >= VW || py < 0 || py >= VH) break;

          if (skinMask[py * VW + px] === 1) {
            maxD = d;
            tipX = px;
            tipY = py;
            exitGap = 0;
          } else {
            exitGap++;
            if (exitGap > 2) break; // Exited finger boundary into space
          }
        }
        rayDists[i] = maxD;
        rayTipsX[i] = tipX;
        rayTipsY[i] = tipY;
      }

      // Smooth ray distances to eliminate minor pixel aliasing without merging fingers
      const smoothed = new Float32Array(numRays);
      for (let i = 0; i < numRays; i++) {
        const prev = i > 0 ? rayDists[i - 1] : rayDists[i];
        const next = i < numRays - 1 ? rayDists[i + 1] : rayDists[i];
        smoothed[i] = prev * 0.2 + rayDists[i] * 0.6 + next * 0.2;
      }

      // Measure protrusion metrics
      const fingerMinThresh = palmRadius * 1.18;
      let protrusionRayCount = 0;
      let maxDistFound = palmRadius;
      for (let i = 0; i < numRays; i++) {
        if (smoothed[i] > fingerMinThresh) protrusionRayCount++;
        if (smoothed[i] > maxDistFound) maxDistFound = smoothed[i];
      }

      // Detect finger peaks (local maxima) with skin fingertip verification
      const peaks = [];
      const peakThresh = palmRadius * 1.20;
      for (let i = 1; i < numRays - 1; i++) {
        const d = smoothed[i];
        if (d > peakThresh && d >= smoothed[i - 1] && d >= smoothed[i + 1]) {
          const leftVal = Math.min(smoothed[Math.max(0, i - 2)], smoothed[i - 1]);
          const rightVal = Math.min(smoothed[Math.min(numRays - 1, i + 2)], smoothed[i + 1]);
          const prominence = d - Math.max(leftVal, rightVal);

          if (prominence >= 1.2 || (d > palmRadius * 1.32)) {
            // Verify fingertip is real skin, not hair or dark background
            const tipIdx = (rayTipsY[i] * VW + rayTipsX[i]) * 4;
            const tipLuma = 0.299 * data[tipIdx] + 0.587 * data[tipIdx + 1] + 0.114 * data[tipIdx + 2];
            const isSkinTip = (skinMask[rayTipsY[i] * VW + rayTipsX[i]] === 1) && (tipLuma > 35);

            if (isSkinTip) {
              if (peaks.length === 0 || (i - peaks[peaks.length - 1].idx) >= 4) {
                peaks.push({ idx: i, dist: d, x: rayTipsX[i], y: rayTipsY[i] });
              } else if (d > peaks[peaks.length - 1].dist) {
                peaks[peaks.length - 1] = { idx: i, dist: d, x: rayTipsX[i], y: rayTipsY[i] };
              }
            }
          }
        }
      }

      // 8. Hands-Free Gesture Classification (100% Reliable: Buka Tangan = Scroll, Genggam = Stop)
      let rawGesture = 'buka';
      if (maxDistFound < palmRadius * 1.18 || protrusionRayCount <= 2 || peaks.length === 0) {
        rawGesture = 'genggam';
      } else {
        rawGesture = 'buka';
      }

      // Temporal smoothing (Majority vote across 4 frames)
      gestureBuffer.push(rawGesture);
      if (gestureBuffer.length > 4) gestureBuffer.shift();

      let genggamVotes = 0;
      for (const g of gestureBuffer) {
        if (g === 'genggam') genggamVotes++;
      }
      const gesture = (genggamVotes >= 2) ? 'genggam' : 'buka';

      // 9. Render HUD Visual Overlays on Large Preview Canvas
      if (previewCtx) {
        const mirrCx = CW - (cx * sx);
        const mirrCy = cy * sy;

        // Palm circle
        previewCtx.beginPath();
        previewCtx.arc(mirrCx, mirrCy, palmRadius * sx, 0, Math.PI * 2);
        previewCtx.strokeStyle = 'rgba(0, 229, 255, 0.75)';
        previewCtx.lineWidth = 2;
        previewCtx.stroke();

        // Palm centroid dot
        previewCtx.fillStyle = '#00E5FF';
        previewCtx.beginPath();
        previewCtx.arc(mirrCx, mirrCy, 3.5, 0, Math.PI * 2);
        previewCtx.fill();

        // Rays and Fingertip tracking dots
        peaks.forEach(p => {
          const mirrTipX = CW - (p.x * sx);
          const mirrTipY = p.y * sy;

          previewCtx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
          previewCtx.lineWidth = 1.5;
          previewCtx.setLineDash([3, 2]);
          previewCtx.beginPath();
          previewCtx.moveTo(mirrCx, mirrCy);
          previewCtx.lineTo(mirrTipX, mirrTipY);
          previewCtx.stroke();
          previewCtx.setLineDash([]);

          previewCtx.fillStyle = '#00FF66';
          previewCtx.beginPath();
          previewCtx.arc(mirrTipX, mirrTipY, 4.5, 0, Math.PI * 2);
          previewCtx.fill();
          previewCtx.strokeStyle = '#052A12';
          previewCtx.lineWidth = 1;
          previewCtx.stroke();
        });
      }

      // Ensure virtual mouse cursor stays hidden to prevent false clicks
      cursorEl?.classList.add('gmt-hidden');

      // ─── 1. MENGGENGGAM (Stop Scroll) ───
      if (gesture === 'genggam') {
        performInstantStopScroll();
        prevCentroidY = null;
        updateGestureStatus('✊', 'Genggam: Scroll Berhenti ⏹️');
        if (hudBadge) {
          hudBadge.textContent = '✊ Genggam (Stop Scroll)';
          hudBadge.style.color = '#FF453A';
          hudBadge.style.borderColor = 'rgba(255, 69, 58, 0.5)';
        }
        logGestureChat('stop_scroll', '✊ <b>Menggenggam:</b> Menghentikan (stop) scroll halaman ⏹️', 2000);
        return;
      }

      // ─── 2. BUKA TANGAN (Scroll Ke Atas / Ke Bawah) ───
      if (gesture === 'buka') {
        if (prevCentroidY !== null) {
          const deltaY = cy - prevCentroidY;
          if (deltaY < -1.4) {
            performSmartPageScroll(-200);
            updateGestureStatus('🖐️', 'Buka Tangan: Scroll Ke Atas ⬆️');
            if (hudBadge) {
              hudBadge.textContent = '⬆️ Scroll Ke Atas';
              hudBadge.style.color = '#00FF66';
              hudBadge.style.borderColor = 'rgba(0, 255, 102, 0.5)';
            }
            logGestureChat('scroll_up', '🖐️ <b>Buka Tangan:</b> Scroll halaman ke atas ⬆️', 2000);
          } else if (deltaY > 1.4) {
            performSmartPageScroll(200);
            updateGestureStatus('🖐️', 'Buka Tangan: Scroll Ke Bawah ⬇️');
            if (hudBadge) {
              hudBadge.textContent = '⬇️ Scroll Ke Bawah';
              hudBadge.style.color = '#00FF66';
              hudBadge.style.borderColor = 'rgba(0, 255, 102, 0.5)';
            }
            logGestureChat('scroll_down', '🖐️ <b>Buka Tangan:</b> Scroll halaman ke bawah ⬇️', 2000);
          } else {
            updateGestureStatus('🖐️', 'Buka Tangan: Siap Scroll (Gerak Naik/Turun)');
            if (hudBadge) {
              hudBadge.textContent = '🖐️ Buka Tangan (Siap Scroll)';
              hudBadge.style.color = '#00E5FF';
              hudBadge.style.borderColor = 'rgba(0, 229, 255, 0.5)';
            }
          }
        }
        prevCentroidY = cy;
        return;
      }
    }, 40);
  }

  const lastGestureLogTime = {};
  function logGestureChat(key, text, minIntervalMs = 2500) {
    const now = Date.now();
    if (lastGestureLogTime[key] && (now - lastGestureLogTime[key] < minIntervalMs)) {
      return;
    }
    lastGestureLogTime[key] = now;
    addMessage('gesture', text);
  }

  function getElementDescription(el) {
    if (!el || el === document.body || el === document.documentElement) return 'halaman';
    const text = (el.innerText || el.textContent || el.getAttribute('aria-label') || el.title || el.placeholder || '').trim();
    if (text) return text.length > 25 ? text.slice(0, 22) + '...' : text;
    const tag = el.tagName.toLowerCase();
    if (el.id) return `#${el.id}`;
    if (el.className && typeof el.className === 'string') return `.${el.className.split(' ')[0]}`;
    return `<${tag}>`;
  }

  // Gestur klik kiri / kanan telah dinonaktifkan total: sistem kamera kini murni 100% untuk scroll & stop.

  function updateGestureStatus(icon, text) {
    const iconEl = document.getElementById('gmt-gesture-icon');
    const textEl = document.getElementById('gmt-gesture-text');
    if (iconEl && icon) iconEl.textContent = icon;
    if (textEl && text) textEl.textContent = text;
  }

  function stopGestureTracking() {
    if (gestureInterval) {
      clearInterval(gestureInterval);
      gestureInterval = null;
    }
    if (gestureStream) {
      gestureStream.getTracks().forEach(t => t.stop());
      gestureStream = null;
    }
    virtualCursorX = null;
    virtualCursorY = null;
    prevCentroidY = null;
    prevTipY = null;
    prevMpCentroidY = null;
    isSendingMpFrame = false;
    isMediaPipeActive = false;
    steadyCount = 0;
    document.getElementById('gmt-gesture-cursor')?.classList.add('gmt-hidden');
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

    recognition.onerror = (e) => {
      console.warn('[GMT] Mic error:', e);
      stopListening();
      if (e?.error === 'not-allowed') {
        addMessage('ai', '⚠️ Izin mikrofon browser belum aktif. <a href="#" id="gmt-req-mic" style="color:#00D4FF;text-decoration:underline;font-weight:600;">Klik di sini untuk mengaktifkan izin mikrofon global GMT</a>.');
        setTimeout(() => {
          document.getElementById('gmt-req-mic')?.addEventListener('click', (ev) => {
            ev.preventDefault();
            chrome.runtime.sendMessage({ type: 'GMT_REQUEST_MIC_PERMISSION' });
          });
        }, 150);
      }
    };
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

  // ─── Personal Brain & Smart Glossary ───
  let userBrainCache = [];

  function openBrain() {
    document.getElementById('gmt-brain-panel')?.classList.remove('gmt-hidden');
    document.getElementById('gmt-panel')?.classList.add('gmt-hidden');
    document.getElementById('gmt-settings')?.classList.add('gmt-hidden');
    document.getElementById('gmt-dock-tab')?.classList.add('gmt-panel-open');
    state.brainOpen = true;
    loadBrainItems();
  }

  function closeBrain() {
    document.getElementById('gmt-brain-panel')?.classList.add('gmt-hidden');
    if (state.panelOpen) {
      document.getElementById('gmt-panel')?.classList.remove('gmt-hidden');
    } else {
      document.getElementById('gmt-dock-tab')?.classList.remove('gmt-panel-open');
    }
    state.brainOpen = false;
  }

  async function loadBrainItems() {
    if (!isExtensionValid()) return;
    try {
      const res = await chrome.runtime.sendMessage({ type: 'GMT_GET_BRAIN' });
      userBrainCache = res?.brain || [];
      updateBrainBadge();
      const searchVal = document.getElementById('gmt-brain-search')?.value || '';
      renderBrainList(searchVal);
    } catch (e) {
      // Quietly ignore if runtime context reloaded
    }
  }

  function updateBrainBadge() {
    const badge = document.getElementById('gmt-brain-badge');
    if (badge) {
      if (userBrainCache.length > 0) {
        badge.textContent = userBrainCache.length;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderBrainList(query = '') {
    const listEl = document.getElementById('gmt-brain-list');
    if (!listEl) return;

    const q = (query || '').trim().toLowerCase();
    const items = q 
      ? userBrainCache.filter(item => (item.key || '').toLowerCase().includes(q) || (item.value || '').toLowerCase().includes(q))
      : userBrainCache;

    if (items.length === 0) {
      if (q) {
        listEl.innerHTML = `<div style="text-align:center;padding:24px 10px;color:#86868B;font-size:12.5px;">Tidak ditemukan item untuk "<strong>${escapeHtml(q)}</strong>"</div>`;
      } else {
        listEl.innerHTML = `
          <div style="text-align:center;padding:28px 12px;background:#FBFBFD;border:1px dashed #D2D2D7;border-radius:12px;margin:6px 0;">
            <div style="font-size:26px;margin-bottom:6px;">🧠</div>
            <div style="font-weight:600;color:#1D1D1F;font-size:13.5px;margin-bottom:4px;">Otak & Glosarium Masih Kosong</div>
            <div style="color:#86868B;font-size:11.5px;line-height:1.4;">Simpan link atau info penting di atas, atau minta lewat chat AI:<br><em>"Tolong simpan link facebook kanwil https://..."</em></div>
          </div>
        `;
      }
      return;
    }

    listEl.innerHTML = items.map((item) => {
      const isUrl = item.type === 'url' || String(item.value).startsWith('http://') || String(item.value).startsWith('https://');
      const safeKey = escapeHtml(item.key);
      const safeVal = escapeHtml(item.value);
      return `
        <div class="gmt-brain-card">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
                <span style="font-size:13px;">${isUrl ? '🌐' : '📝'}</span>
                <span class="gmt-brain-card-key" title="${safeKey}">${safeKey}</span>
              </div>
              <div class="gmt-brain-card-val" title="${safeVal}">${safeVal}</div>
            </div>
            <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
              <button class="gmt-brain-action-open" title="${isUrl ? 'Buka Link / Pandu ke sini' : 'Gunakan Info'}" data-key="${safeKey}" data-val="${safeVal}" data-is-url="${isUrl}">
                ${isUrl ? 'Buka ↗' : 'Gunakan'}
              </button>
              <button class="gmt-brain-action-delete" title="Hapus dari Otak" data-key="${safeKey}">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async function handleAddBrainManual() {
    const keyInput = document.getElementById('gmt-brain-input-key');
    const valInput = document.getElementById('gmt-brain-input-val');
    const key = keyInput?.value.trim();
    const val = valInput?.value.trim();

    if (!key || !val) {
      alert('Mohon isi nama/panggilan dan link URL atau catatannya.');
      return;
    }

    try {
      const res = await chrome.runtime.sendMessage({
        type: 'GMT_SAVE_BRAIN_ITEM',
        key: key,
        value: val
      });
      userBrainCache = res?.brain || [];
      if (keyInput) keyInput.value = '';
      if (valInput) valInput.value = '';
      updateBrainBadge();
      renderBrainList();
      addMessage('ai', `🧠 Tersimpan di otak: <strong>${escapeHtml(key)}</strong> ➔ <em>${escapeHtml(val)}</em>`);
    } catch (e) {
      console.warn('[GMT] handleAddBrainManual error:', e);
    }
  }

  async function handleDeleteBrainItem(key) {
    if (!confirm(`Hapus "${key}" dari ingatan otak GMT?`)) return;
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'GMT_DELETE_BRAIN_ITEM',
        key: key
      });
      userBrainCache = res?.brain || [];
      updateBrainBadge();
      renderBrainList();
    } catch (e) {
      console.warn('[GMT] handleDeleteBrainItem error:', e);
    }
  }

  function handleUseBrainItem(key, val, isUrl) {
    closeBrain();
    state.panelOpen = true;
    document.getElementById('gmt-panel')?.classList.remove('gmt-hidden');
    document.getElementById('gmt-dock-tab')?.classList.add('gmt-panel-open');
    if (isUrl) {
      sendCommand(`Tolong buka ${key}`);
    } else {
      sendCommand(`Info tentang ${key}`);
    }
  }

  // ─── Helpers ───
  function addMessage(role, text) {
    const chat = document.getElementById('gmt-chat');
    const div = document.createElement('div');
    const isUser = role === 'user';
    const isGesture = role === 'gesture';
    div.className = `gmt-msg gmt-${isUser ? 'user' : (isGesture ? 'gesture' : 'ai')} gmt-fade-in`;
    const avatar = isUser ? '👤' : (isGesture ? '🖐️' : '🧭');
    div.innerHTML = `
      <div class="gmt-msg-avatar">${avatar}</div>
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
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, div[role="heading"]'))
      .map(h => h.innerText?.trim())
      .filter(Boolean)
      .slice(0, 8);
    if (headings.length > 0) {
      summary.push(`Main Headings: ${headings.join(' | ')}`);
    }

    // ─── 1. Specialized Detection for Google Forms & Structured Forms ───
    const formItems = document.querySelectorAll('div[role="listitem"], .Qr7Oae, .geS5n');
    let qIndex = 0;

    if (formItems.length > 0) {
      summary.push('\n=== DETECTED FORM QUESTIONS (Field by Field) ===');
      formItems.forEach((item) => {
        if (!isElementVisible(item)) return;

        // Extract Question Title / Label
        const titleEl = item.querySelector('.M7eMe, [role="heading"], .exportItemTitle, .HoXoMd, .c2gzEf, span.Hvn9Fb');
        let questionTitle = (titleEl?.innerText || '').trim();
        if (!questionTitle) {
          const firstSpan = item.querySelector('span, label');
          questionTitle = (firstSpan?.innerText || '').trim();
        }
        if (!questionTitle) return;

        const isRequired = !!item.querySelector('.vnumgf, [aria-label*="wajib" i], [aria-label*="required" i], [aria-required="true"]');
        const reqStr = isRequired ? ' [Wajib/Required]' : '';

        // Locate the input control inside this question item
        const textInput = item.querySelector('input.whsOnd, input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="url"], input[type="date"], input:not([type])');
        const textarea = item.querySelector('textarea.KHxj8b, textarea');
        const radiogroup = item.querySelector('[role="radiogroup"]');
        const checkboxes = item.querySelectorAll('[role="checkbox"]');
        const listbox = item.querySelector('[role="listbox"]');

        qIndex++;
        const fieldKey = `q-${qIndex}`;

        if (textInput) {
          textInput.setAttribute('data-gmt-field', fieldKey);
          summary.push(`- Question ${qIndex}: "${questionTitle}"${reqStr} -> Type: Short Text Input -> Selector: [data-gmt-field="${fieldKey}"]`);
        } else if (textarea) {
          textarea.setAttribute('data-gmt-field', fieldKey);
          summary.push(`- Question ${qIndex}: "${questionTitle}"${reqStr} -> Type: Long Textarea -> Selector: [data-gmt-field="${fieldKey}"]`);
        } else if (radiogroup) {
          radiogroup.setAttribute('data-gmt-field', fieldKey);
          const options = Array.from(item.querySelectorAll('[role="radio"]'))
            .map(r => (r.getAttribute('aria-label') || r.innerText || '').trim())
            .filter(Boolean);
          const optStr = options.length > 0 ? ` (Pilihan: ${options.slice(0, 6).join(', ')})` : '';
          summary.push(`- Question ${qIndex}: "${questionTitle}"${reqStr} -> Type: Radio Group${optStr} -> Selector: [data-gmt-field="${fieldKey}"]`);
        } else if (checkboxes.length > 0) {
          item.setAttribute('data-gmt-field', fieldKey);
          const options = Array.from(checkboxes)
            .map(c => (c.getAttribute('aria-label') || c.innerText || '').trim())
            .filter(Boolean);
          const optStr = options.length > 0 ? ` (Pilihan: ${options.slice(0, 6).join(', ')})` : '';
          summary.push(`- Question ${qIndex}: "${questionTitle}"${reqStr} -> Type: Checkboxes${optStr} -> Selector: [data-gmt-field="${fieldKey}"]`);
        } else if (listbox) {
          listbox.setAttribute('data-gmt-field', fieldKey);
          summary.push(`- Question ${qIndex}: "${questionTitle}"${reqStr} -> Type: Dropdown / Listbox -> Selector: [data-gmt-field="${fieldKey}"]`);
        } else {
          item.setAttribute('data-gmt-field', fieldKey);
          summary.push(`- Question ${qIndex}: "${questionTitle}"${reqStr} -> Type: Form Item -> Selector: [data-gmt-field="${fieldKey}"]`);
        }
      });

      // Submit Button Detection for Google Forms
      const submitCandidates = document.querySelectorAll('div[role="button"], button[type="submit"], button, .uArJ5e');
      for (const btn of submitCandidates) {
        if (!isElementVisible(btn)) continue;
        const btnText = (btn.innerText || btn.getAttribute('aria-label') || '').trim();
        if (/^(kirim|submit|next|berikutnya|selesai)$/i.test(btnText) || btnText.toLowerCase().includes('kirim') || btnText.toLowerCase().includes('submit')) {
          btn.setAttribute('data-gmt-field', 'submit-btn');
          summary.push(`- Submit Action: "${btnText}" -> Selector: [data-gmt-field="submit-btn"]`);
          break;
        }
      }
      summary.push('=== END OF FORM QUESTIONS ===\n');
    }

    // ─── 2. Generic Web Forms (non-Google or additional inputs) ───
    const genericInputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
    let genericCount = 0;
    genericInputs.forEach((inp) => {
      if (inp.hasAttribute('data-gmt-field')) return;
      if (!isElementVisible(inp)) return;
      if (genericCount >= 25) return;

      let labelText = inp.getAttribute('aria-label') || inp.getAttribute('placeholder') || '';
      if (!labelText && inp.getAttribute('aria-labelledby')) {
        const ids = inp.getAttribute('aria-labelledby').split(' ');
        labelText = ids.map(id => document.getElementById(id)?.innerText?.trim()).filter(Boolean).join(' ');
      }
      if (!labelText && inp.id) {
        const l = document.querySelector(`label[for="${inp.id}"]`);
        if (l) labelText = l.innerText.trim();
      }
      if (!labelText) {
        const parentLabel = inp.closest('label');
        if (parentLabel) labelText = parentLabel.innerText.trim();
      }
      if (!labelText) {
        const group = inp.closest('.form-group, .field, .form-row, td, tr');
        if (group) {
          const groupLabel = group.querySelector('label, .control-label, span');
          if (groupLabel && groupLabel !== inp) labelText = groupLabel.innerText.trim();
        }
      }
      if (!labelText) {
        labelText = inp.name || inp.type || 'Input Field';
      }

      genericCount++;
      const fieldKey = `field-${genericCount}`;
      inp.setAttribute('data-gmt-field', fieldKey);
      summary.push(`- Form Input ${genericCount}: "${labelText.slice(0, 50)}" (${inp.tagName.toLowerCase()}) -> Selector: [data-gmt-field="${fieldKey}"]`);
    });

    // ─── 3. Other Interactive Elements (Buttons, Links, Nav) ───
    summary.push('\nOther Interactive Elements (Buttons, Navigation):');
    const elements = document.querySelectorAll('button, a, [role="button"], [role="link"], [role="tab"], [role="menuitem"]');

    let otherCount = 0;
    elements.forEach((el) => {
      if (el.hasAttribute('data-gmt-field')) return;
      if (otherCount > 60) return;
      if (!isElementVisible(el)) return;

      const tag = el.tagName.toLowerCase();
      let text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 50);
      if (!text && el.querySelector('img')) {
        text = el.querySelector('img').getAttribute('alt') || 'Icon';
      }
      const id = el.id ? `#${el.id}` : '';
      const classes = Array.from(el.classList).slice(0, 2).map(c => `.${c}`).join('');
      const role = el.getAttribute('role') ? `[role="${el.getAttribute('role')}"]` : '';

      const selector = id || `${tag}${classes}${role}` || tag;
      if (text || id) {
        otherCount++;
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
        clearTimeout(state.pageLoadExecTimeout);
        state.pageLoadExecTimeout = setTimeout(() => executeCurrentStep(), 1000);
      }
      return true;
    }
    if (msg.type === 'GMT_WAKE_WORD_TRIGGERED') {
      console.log('[GMT] Wake word triggered via persistent background bridge:', msg);
      if (msg.userPrompt && msg.userPrompt.length > 2) {
        sendCommand(msg.userPrompt);
      } else {
        speak(state.lang === 'id' ? 'Iya, saya mendengarkan...' : 'Yes, I am listening...');
        toggleListening();
      }
      return true;
    }
    if (msg.type === 'GMT_SPEECH_INTERIM') {
      const input = document.getElementById('gmt-text-input');
      if (input && state.isListening) {
        input.value = msg.transcript;
        if (msg.isFinal) {
          stopListening();
          sendCommand();
        }
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

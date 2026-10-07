// GMT Launchpad & Hub Script

(function () {
  'use strict';

  // State
  const state = {
    currentMode: 'guide', // 'guide' | 'autopilot'
    provider: 'sumopod',
    speechRecognition: null,
    isRecording: false,
    activePlan: null,
    countdownTimer: null,
  };

  // DOM Elements
  const commandInput = document.getElementById('hub-command-input');
  const btnClearInput = document.getElementById('btn-clear-input');
  const btnSubmit = document.getElementById('btn-hub-submit');
  const btnMic = document.getElementById('btn-hub-mic');
  const voiceBar = document.getElementById('hub-voice-bar');
  const voiceText = document.getElementById('hub-voice-text');
  const btnCancelVoice = document.getElementById('btn-cancel-voice');

  const greetingText = document.getElementById('hero-greeting-text');
  const providerNameDisplay = document.getElementById('provider-name-display');
  const btnToggleProvider = document.getElementById('btn-toggle-provider');

  const modeGuideBtn = document.getElementById('hub-mode-guide');
  const modeAutopilotBtn = document.getElementById('hub-mode-autopilot');

  const planSection = document.getElementById('plan-preview-section');
  const planStatusPill = document.getElementById('plan-status-pill');
  const planStatusText = document.getElementById('plan-status-text');
  const planGreetingText = document.getElementById('plan-greeting-text');
  const planDestText = document.getElementById('plan-dest-text');
  const planDestBadge = document.getElementById('plan-dest-url-badge');
  const planStepsList = document.getElementById('plan-steps-list');
  const planCountdownBar = document.getElementById('plan-countdown-bar');
  const countdownProgressFill = document.getElementById('countdown-progress-fill');
  const btnExecPlan = document.getElementById('btn-exec-plan');
  const btnEditPlan = document.getElementById('btn-edit-plan');
  const btnCancelPlan = document.getElementById('btn-cancel-plan');

  const modalSettings = document.getElementById('modal-settings');
  const btnOpenSettings = document.getElementById('btn-open-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  const btnTestConnection = document.getElementById('btn-test-connection');
  const settingsStatusMsg = document.getElementById('settings-status-msg');

  const modalMemory = document.getElementById('modal-memory');
  const btnOpenMemory = document.getElementById('btn-open-memory');
  const btnCloseMemory = document.getElementById('btn-close-memory');
  const btnDoneMemory = document.getElementById('btn-done-memory');
  const btnClearMemory = document.getElementById('btn-clear-memory');
  const memoryItemsList = document.getElementById('memory-items-list');
  const memoryCountBadge = document.getElementById('hub-memory-count');

  const toastEl = document.getElementById('hub-toast');

  // ─── Initialization ───
  init();

  async function init() {
    updateDynamicGreeting();
    await loadSettings();
    await loadMemoryCount();
    setupEventListeners();
    setupSpeechRecognition();
  }

  // ─── Dynamic Greeting ───
  function updateDynamicGreeting() {
    const hour = new Date().getHours();
    let greet = 'Selamat Datang';
    if (hour >= 4 && hour < 11) greet = 'Selamat Pagi 🌅';
    else if (hour >= 11 && hour < 15) greet = 'Selamat Siang ☀️';
    else if (hour >= 15 && hour < 18) greet = 'Selamat Sore 🌇';
    else greet = 'Selamat Malam 🌙';

    greetingText.textContent = `${greet}, Mau dipandu ke mana?`;
  }

  // ─── Load Settings ───
  async function loadSettings() {
    try {
      const stored = await chrome.storage.local.get([
        'gmt_provider',
        'gmt_sumopod_key',
        'gmt_gemini_key',
        'gmt_elevenlabs_key',
        'gmt_wake_word_active',
        'gmt_audio_enabled',
      ]);

      state.provider = stored.gmt_provider || 'sumopod';
      updateProviderUI();

      // Populate settings form
      if (stored.gmt_provider === 'gemini') {
        document.getElementById('radio-gemini').checked = true;
      } else {
        document.getElementById('radio-sumopod').checked = true;
      }

      document.getElementById('setting-sumopod-key').value = stored.gmt_sumopod_key || '';
      document.getElementById('setting-gemini-key').value = stored.gmt_gemini_key || '';
      document.getElementById('setting-elevenlabs-key').value = stored.gmt_elevenlabs_key || '';
      document.getElementById('setting-wake-word').checked = !!stored.gmt_wake_word_active;
      document.getElementById('setting-audio-enabled').checked = stored.gmt_audio_enabled !== false;

      // Status badge check
      const badge = document.getElementById('hub-ai-badge');
      if (!stored.gmt_sumopod_key && !stored.gmt_gemini_key) {
        badge.textContent = '⚠️ API Key Belum Diatur';
        badge.style.background = 'rgba(255, 184, 0, 0.15)';
        badge.style.borderColor = 'rgba(255, 184, 0, 0.4)';
        badge.style.color = '#FFB800';
      } else {
        badge.textContent = '🟢 Ready to Guide';
        badge.style.background = 'rgba(0, 255, 136, 0.12)';
        badge.style.borderColor = 'rgba(0, 255, 136, 0.3)';
        badge.style.color = '#00FF88';
      }
    } catch (e) {
      console.warn('[GMT Hub] Load settings error:', e);
    }
  }

  function updateProviderUI() {
    if (state.provider === 'gemini') {
      providerNameDisplay.textContent = 'Google Gemini';
      btnToggleProvider.querySelector('.provider-icon').textContent = '✨';
    } else {
      providerNameDisplay.textContent = 'Sumopod (DeepSeek)';
      btnToggleProvider.querySelector('.provider-icon').textContent = '⚡';
    }
  }

  // ─── Memory count (Otak & Glosarium) ───
  async function loadMemoryCount() {
    try {
      const data = await chrome.storage.local.get(['gmt_user_brain']);
      const list = Array.isArray(data?.gmt_user_brain) ? data.gmt_user_brain : [];
      if (list.length > 0) {
        memoryCountBadge.textContent = list.length;
        memoryCountBadge.style.display = 'flex';
      } else {
        memoryCountBadge.style.display = 'none';
      }
    } catch (e) {}
  }

  // ─── Event Listeners ───
  function setupEventListeners() {
    // Input typing & clear button
    commandInput.addEventListener('input', () => {
      btnClearInput.style.display = commandInput.value.trim() ? 'block' : 'none';
    });

    commandInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitCommand();
      }
    });

    btnClearInput.addEventListener('click', () => {
      commandInput.value = '';
      btnClearInput.style.display = 'none';
      commandInput.focus();
    });

    btnSubmit.addEventListener('click', handleSubmitCommand);

    // Mode switch
    modeGuideBtn.addEventListener('click', () => setMode('guide'));
    modeAutopilotBtn.addEventListener('click', () => setMode('autopilot'));

    // Quick prompt chips
    document.querySelectorAll('.prompt-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          commandInput.value = cmd;
          btnClearInput.style.display = 'block';
          handleSubmitCommand();
        }
      });
    });

    // Quick launch cards
    document.querySelectorAll('.quick-card').forEach((card) => {
      card.addEventListener('click', () => {
        if (card.id === 'card-open-custom-url') {
          handleCustomUrlPrompt();
          return;
        }
        const cmd = card.getAttribute('data-cmd');
        const url = card.getAttribute('data-url');
        if (cmd) {
          commandInput.value = cmd;
          btnClearInput.style.display = 'block';
          handleSubmitCommand(cmd, url);
        }
      });
    });

    // Plan execution actions
    btnExecPlan.addEventListener('click', executeActivePlan);
    btnCancelPlan.addEventListener('click', cancelActivePlan);
    btnEditPlan.addEventListener('click', () => {
      cancelActivePlan();
      commandInput.focus();
    });

    // Modals
    btnOpenSettings.addEventListener('click', () => openModal(modalSettings));
    btnCloseSettings.addEventListener('click', () => closeModal(modalSettings));
    document.getElementById('btn-footer-settings')?.addEventListener('click', () => openModal(modalSettings));

    btnOpenMemory.addEventListener('click', openMemoryModal);
    btnCloseMemory.addEventListener('click', () => closeModal(modalMemory));
    btnDoneMemory.addEventListener('click', () => closeModal(modalMemory));
    btnClearMemory.addEventListener('click', handleClearMemory);

    document.getElementById('btn-hub-add-brain')?.addEventListener('click', handleAddBrainFromHub);
    document.getElementById('hub-brain-search-input')?.addEventListener('input', (e) => {
      renderHubBrainItems(e.target.value);
    });
    memoryItemsList.addEventListener('click', (e) => {
      const openBtn = e.target.closest('.btn-hub-brain-open');
      if (openBtn) {
        const key = openBtn.getAttribute('data-key');
        const val = openBtn.getAttribute('data-val');
        const isUrl = openBtn.getAttribute('data-is-url') === 'true';
        handleUseBrainItemHub(key, val, isUrl);
        return;
      }
      const delBtn = e.target.closest('.btn-hub-brain-del');
      if (delBtn) {
        const key = delBtn.getAttribute('data-key');
        handleDeleteBrainFromHub(key);
        return;
      }
    });

    btnToggleProvider.addEventListener('click', async () => {
      const newProvider = state.provider === 'sumopod' ? 'gemini' : 'sumopod';
      state.provider = newProvider;
      await chrome.storage.local.set({ gmt_provider: newProvider });
      updateProviderUI();
      showToast(`Provider diubah ke ${newProvider === 'gemini' ? 'Google Gemini' : 'Sumopod DeepSeek'}`);
    });

    // Settings actions
    btnSaveSettings.addEventListener('click', handleSaveSettings);
    btnTestConnection.addEventListener('click', handleTestConnection);

    // Show/Hide password toggles
    document.querySelectorAll('.btn-toggle-eye').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-for');
        const input = document.getElementById(targetId);
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
        }
      });
    });

    // Mic permission footer button
    document.getElementById('btn-footer-mic')?.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('voice/permission.html') });
    });

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== commandInput && !isModalOpen()) {
        e.preventDefault();
        commandInput.focus();
      }
      if (e.key === 'Escape') {
        if (isModalOpen()) {
          closeModal(modalSettings);
          closeModal(modalMemory);
        } else if (state.activePlan) {
          cancelActivePlan();
        }
      }
    });

    // Message from background
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'GMT_FOCUS_INPUT') {
        commandInput.focus();
      }
    });
  }

  function setMode(mode) {
    state.currentMode = mode;
    if (mode === 'guide') {
      modeGuideBtn.classList.add('active');
      modeAutopilotBtn.classList.remove('active');
    } else {
      modeAutopilotBtn.classList.add('active');
      modeGuideBtn.classList.remove('active');
    }
  }

  // ─── Command Submission ───
  async function handleSubmitCommand(explicitCommand, explicitUrl) {
    const rawCommand = (explicitCommand || commandInput.value).trim();
    if (!rawCommand) return;

    // Check if user entered a plain direct URL (e.g. "tokopedia.com", "https://github.com", "wikipedia.org")
    if (isDirectUrl(rawCommand)) {
      const targetUrl = formatUrl(rawCommand);
      showToast(`🚀 Membuka ${targetUrl}...`);
      await startDirectNavigation(targetUrl, `Panduan untuk ${targetUrl}`);
      return;
    }

    // Check API Keys before proceeding
    const stored = await chrome.storage.local.get(['gmt_sumopod_key', 'gmt_gemini_key', 'gmt_provider']);
    const provider = stored.gmt_provider || 'sumopod';
    const key = provider === 'sumopod' ? stored.gmt_sumopod_key : stored.gmt_gemini_key;

    if (!key) {
      showToast('⚠️ Silakan atur API Key terlebih dahulu di Pengaturan');
      openModal(modalSettings);
      return;
    }

    // Display Plan Preview with Thinking state
    showPlanThinking(rawCommand);

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GMT_PROCESS_COMMAND',
        command: rawCommand,
        currentUrl: explicitUrl || 'https://www.google.com',
        language: 'id',
        mode: state.currentMode || 'guide',
      });

      if (!response || response.error) {
        throw new Error(response?.error || 'Tidak ada respon dari AI co-pilot');
      }

      const plan = response.plan;
      displayPlanResult(plan, rawCommand, explicitUrl);

    } catch (err) {
      console.error('[GMT Hub] Command error:', err);
      showPlanError(err.message);
    }
  }

  function showPlanThinking(command) {
    state.activePlan = null;
    clearCountdown();

    planSection.style.display = 'block';
    planStatusPill.innerHTML = `
      <span class="spinner"></span>
      <span>🧠 Menganalisis perintah: "${escapeHtml(command)}"</span>
    `;
    planGreetingText.textContent = 'Menyiapkan rute navigasi dan langkah panduan...';
    planDestText.style.display = 'none';
    planStepsList.innerHTML = `
      <div style="padding: 16px; text-align: center; color: var(--text-dim); font-size: 13px;">
        AI sedang memproses DOM dan mempersiapkan panduan langkah demi langkah...
      </div>
    `;
    planCountdownBar.style.display = 'none';
    btnExecPlan.disabled = true;

    // Scroll to plan preview smoothly
    planSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function displayPlanResult(plan, originalCommand, fallbackUrl) {
    state.activePlan = { plan, originalCommand };

    const navUrl = plan.navigate_to || fallbackUrl || 'https://www.google.com';
    plan.navigate_to = navUrl;

    planStatusPill.innerHTML = `
      <span style="color: var(--success); font-size: 15px;">✓</span>
      <span style="color: var(--success);">Rencana Panduan Siap!</span>
    `;

    planGreetingText.textContent = plan.greeting || 'Panduan siap dijalankan.';
    planDestText.style.display = 'block';
    planDestBadge.textContent = navUrl;

    // Render Steps
    planStepsList.innerHTML = '';
    const steps = plan.steps || [];

    if (steps.length === 0) {
      planStepsList.innerHTML = `
        <div style="padding: 12px; color: var(--text-muted); font-size: 13px;">
          Buka halaman tujuan untuk melihat instruksi interaktif langsung di situs.
        </div>
      `;
    } else {
      steps.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = 'plan-step-item';
        item.innerHTML = `
          <div class="step-num-badge">${idx + 1}</div>
          <div class="step-details">
            <div class="step-label">${escapeHtml(step.label || `Langkah ${idx + 1}`)}</div>
            <div class="step-instruction">${escapeHtml(step.instruction || '')}</div>
          </div>
        `;
        planStepsList.appendChild(item);
      });
    }

    btnExecPlan.disabled = false;

    // Start auto-launch countdown (3 seconds)
    startCountdown(navUrl, plan, originalCommand);
  }

  function startCountdown(navUrl, plan, originalCommand) {
    planCountdownBar.style.display = 'block';
    countdownProgressFill.style.width = '0%';

    let progress = 0;
    const durationMs = 3000;
    const intervalMs = 50;
    const increment = (intervalMs / durationMs) * 100;

    btnExecPlan.innerHTML = `<span>Buka Sekarang (3s) ➔</span>`;

    state.countdownTimer = setInterval(() => {
      progress += increment;
      countdownProgressFill.style.width = `${Math.min(progress, 100)}%`;

      const remainingSec = Math.max(1, Math.ceil((durationMs - (progress / 100 * durationMs)) / 1000));
      btnExecPlan.innerHTML = `<span>Buka Sekarang (${remainingSec}s) ➔</span>`;

      if (progress >= 100) {
        clearCountdown();
        executeActivePlan();
      }
    }, intervalMs);
  }

  function clearCountdown() {
    if (state.countdownTimer) {
      clearInterval(state.countdownTimer);
      state.countdownTimer = null;
    }
  }

  async function executeActivePlan() {
    clearCountdown();
    if (!state.activePlan) return;

    const { plan, originalCommand } = state.activePlan;
    const navUrl = plan.navigate_to || 'https://www.google.com';

    btnExecPlan.innerHTML = `<span>Membuka halaman...</span>`;
    btnExecPlan.disabled = true;

    // Save persistent session for content-script to pick up on page load
    try {
      await chrome.storage.local.set({
        gmt_session: {
          panelOpen: true,
          chatHistory: [
            { role: 'user', text: originalCommand },
            { role: 'ai', text: plan.greeting || 'Baik! Saya akan memandu Anda...' },
          ],
          steps: plan.steps || [],
          currentStep: 0,
          lang: plan.language || 'id',
          mode: state.currentMode,
          isGuiding: true,
          audioEnabled: true,
          lastUpdated: Date.now(),
        }
      });

      // Update current tab to the target URL
      chrome.tabs.getCurrent((tab) => {
        if (tab?.id) {
          chrome.tabs.update(tab.id, { url: navUrl });
        } else {
          chrome.tabs.create({ url: navUrl });
        }
      });

    } catch (err) {
      console.warn('[GMT Hub] Execute plan error:', err);
      showToast('❌ Gagal berpindah ke halaman: ' + err.message);
    }
  }

  function cancelActivePlan() {
    clearCountdown();
    state.activePlan = null;
    planSection.style.display = 'none';
  }

  function showPlanError(errMsg) {
    btnExecPlan.disabled = true;
    planStatusPill.innerHTML = `
      <span style="color: var(--danger); font-size: 15px;">✕</span>
      <span style="color: var(--danger);">Gagal Memproses</span>
    `;
    planGreetingText.textContent = 'Terjadi kesalahan saat memproses panduan.';
    planStepsList.innerHTML = `
      <div style="padding: 12px; color: var(--danger); font-size: 13px; background: rgba(255, 71, 87, 0.1); border-radius: 8px;">
        ${escapeHtml(errMsg)}
      </div>
    `;
  }

  // ─── Direct URL Launch ───
  function handleCustomUrlPrompt() {
    const entered = prompt('Masukkan alamat website yang ingin Anda tuju:\n(Contoh: tokopedia.com, wikipedia.org, github.com)');
    if (entered && entered.trim()) {
      const url = formatUrl(entered.trim());
      startDirectNavigation(url, `Buka ${url}`);
    }
  }

  async function startDirectNavigation(url, initialPrompt) {
    try {
      await chrome.storage.local.set({
        gmt_session: {
          panelOpen: true,
          chatHistory: [
            { role: 'user', text: initialPrompt || `Membuka ${url}` },
            { role: 'ai', text: `Selamat datang di ${url}! Silakan katakan apa yang ingin Anda lakukan di sini, atau klik tombol di sebelah kanan.` },
          ],
          steps: [],
          currentStep: -1,
          lang: 'id',
          mode: state.currentMode,
          isGuiding: false,
          lastUpdated: Date.now(),
        }
      });

      chrome.tabs.getCurrent((tab) => {
        if (tab?.id) {
          chrome.tabs.update(tab.id, { url: url });
        } else {
          chrome.tabs.create({ url: url });
        }
      });
    } catch (e) {
      console.warn('[GMT Hub] Direct navigation error:', e);
    }
  }

  // ─── Speech Recognition (Voice Input) ───
  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      btnMic.style.display = 'none';
      return;
    }

    state.speechRecognition = new SpeechRecognition();
    state.speechRecognition.lang = 'id-ID';
    state.speechRecognition.continuous = false;
    state.speechRecognition.interimResults = true;

    btnMic.addEventListener('click', toggleRecording);
    btnCancelVoice.addEventListener('click', stopRecording);

    state.speechRecognition.onstart = () => {
      state.isRecording = true;
      btnMic.classList.add('recording');
      voiceBar.style.display = 'flex';
      voiceText.textContent = 'Mendengarkan... Silakan bicara perintah Anda';
    };

    state.speechRecognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const current = final || interim;
      if (current) {
        voiceText.textContent = `"${current}"`;
        commandInput.value = current;
        btnClearInput.style.display = 'block';
      }

      if (final) {
        stopRecording();
        setTimeout(() => {
          handleSubmitCommand();
        }, 500);
      }
    };

    state.speechRecognition.onerror = (event) => {
      console.warn('[GMT Hub Voice] Error:', event.error);
      voiceText.textContent = `Suara tidak terdeteksi (${event.error})`;
      setTimeout(stopRecording, 1500);
    };

    state.speechRecognition.onend = () => {
      stopRecording();
    };
  }

  function toggleRecording() {
    if (state.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  function startRecording() {
    try {
      state.speechRecognition.start();
    } catch (e) {
      console.warn(e);
    }
  }

  function stopRecording() {
    state.isRecording = false;
    btnMic.classList.remove('recording');
    voiceBar.style.display = 'none';
    try {
      state.speechRecognition.stop();
    } catch (e) {}
  }

  // ─── Settings Modal Logic ───
  async function handleSaveSettings() {
    const sumopodKey = document.getElementById('setting-sumopod-key').value.trim();
    const geminiKey = document.getElementById('setting-gemini-key').value.trim();
    const elevenlabsKey = document.getElementById('setting-elevenlabs-key').value.trim();
    const isSumopod = document.getElementById('radio-sumopod').checked;
    const provider = isSumopod ? 'sumopod' : 'gemini';
    const wakeWord = document.getElementById('setting-wake-word').checked;
    const audioEnabled = document.getElementById('setting-audio-enabled').checked;

    try {
      await chrome.storage.local.set({
        gmt_provider: provider,
        gmt_sumopod_key: sumopodKey,
        gmt_gemini_key: geminiKey,
        gmt_elevenlabs_key: elevenlabsKey,
        gmt_wake_word_active: wakeWord,
        gmt_audio_enabled: audioEnabled,
      });

      state.provider = provider;
      updateProviderUI();

      settingsStatusMsg.className = 'settings-status-msg success';
      settingsStatusMsg.textContent = '✅ Pengaturan berhasil disimpan!';
      settingsStatusMsg.style.display = 'block';

      showToast('Pengaturan disimpan!');

      setTimeout(() => {
        closeModal(modalSettings);
        settingsStatusMsg.style.display = 'none';
        loadSettings();
      }, 1000);

    } catch (err) {
      settingsStatusMsg.className = 'settings-status-msg error';
      settingsStatusMsg.textContent = '❌ Gagal menyimpan: ' + err.message;
      settingsStatusMsg.style.display = 'block';
    }
  }

  async function handleTestConnection() {
    settingsStatusMsg.className = 'settings-status-msg';
    settingsStatusMsg.style.background = 'rgba(0, 212, 255, 0.1)';
    settingsStatusMsg.style.borderColor = 'rgba(0, 212, 255, 0.3)';
    settingsStatusMsg.style.color = '#00D4FF';
    settingsStatusMsg.textContent = 'Testing koneksi AI...';
    settingsStatusMsg.style.display = 'block';

    const isSumopod = document.getElementById('radio-sumopod').checked;
    const sumopodKey = document.getElementById('setting-sumopod-key').value.trim();
    const geminiKey = document.getElementById('setting-gemini-key').value.trim();

    try {
      if (isSumopod) {
        if (!sumopodKey) throw new Error('Sumopod API Key belum diisi!');
        const res = await fetch('https://ai.sumopod.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sumopodKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-flash',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 5,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      } else {
        if (!geminiKey) throw new Error('Gemini API Key belum diisi!');
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Ping' }] }],
            generationConfig: { maxOutputTokens: 5 },
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      settingsStatusMsg.className = 'settings-status-msg success';
      settingsStatusMsg.textContent = `✅ Tes Koneksi Berhasil! ${isSumopod ? 'Sumopod (DeepSeek)' : 'Google Gemini'} aktif & terhubung.`;

    } catch (err) {
      settingsStatusMsg.className = 'settings-status-msg error';
      settingsStatusMsg.textContent = `❌ Koneksi Gagal: ${err.message}`;
    }
  }

  // ─── Otak & Kamus Pintar Modal Logic ───
  let hubBrainItems = [];

  async function openMemoryModal() {
    openModal(modalMemory);
    await reloadHubBrainList();
  }

  async function reloadHubBrainList() {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'GMT_GET_BRAIN' });
      hubBrainItems = Array.isArray(res?.brain) ? res.brain : [];
      loadMemoryCount();
      const searchVal = document.getElementById('hub-brain-search-input')?.value || '';
      renderHubBrainItems(searchVal);
    } catch (e) {
      console.warn(e);
    }
  }

  function renderHubBrainItems(filterQuery = '') {
    const q = (filterQuery || '').trim().toLowerCase();
    const items = q
      ? hubBrainItems.filter(item => (item.key || '').toLowerCase().includes(q) || (item.value || '').toLowerCase().includes(q))
      : hubBrainItems;

    if (items.length === 0) {
      if (q) {
        memoryItemsList.innerHTML = `<div class="empty-state" style="padding:18px;text-align:center;color:rgba(255,255,255,0.5);">Tidak ditemukan item untuk "${escapeHtml(q)}"</div>`;
      } else {
        memoryItemsList.innerHTML = `<div class="empty-state" style="padding:22px;text-align:center;color:rgba(255,255,255,0.5);">Belum ada item tersimpan di otak.<br><span style="font-size:11.5px;color:rgba(255,255,255,0.35);">Tambahkan di atas atau minta lewat chat AI.</span></div>`;
      }
      return;
    }

    memoryItemsList.innerHTML = '';
    items.forEach((item) => {
      const isUrl = item.type === 'url' || String(item.value).startsWith('http://') || String(item.value).startsWith('https://');
      const row = document.createElement('div');
      row.className = 'memory-chip-row';
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;';
      row.innerHTML = `
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
            <span style="font-size:13px;">${isUrl ? '🌐' : '📝'}</span>
            <span class="memory-key" style="font-weight:700;color:#00D4FF;font-size:13px;">${escapeHtml(item.key)}</span>
          </div>
          <div class="memory-val" title="${escapeHtml(String(item.value))}" style="font-size:11.5px;color:rgba(255,255,255,0.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:300px;">${escapeHtml(String(item.value))}</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <button class="btn-hub-brain-open" data-key="${escapeHtml(item.key)}" data-val="${escapeHtml(item.value)}" data-is-url="${isUrl}" style="background:#0071E3;color:white;border:none;border-radius:6px;padding:5px 9px;font-size:11.5px;font-weight:600;cursor:pointer;">
            ${isUrl ? 'Buka & Pandu ➔' : 'Pakai'}
          </button>
          <button class="btn-hub-brain-del" data-key="${escapeHtml(item.key)}" style="background:rgba(255,59,48,0.15);color:#FF3B30;border:1px solid rgba(255,59,48,0.3);border-radius:6px;padding:4px 8px;font-size:11.5px;cursor:pointer;" title="Hapus">
            🗑️
          </button>
        </div>
      `;
      memoryItemsList.appendChild(row);
    });
  }

  async function handleAddBrainFromHub() {
    const keyInput = document.getElementById('hub-brain-key-input');
    const valInput = document.getElementById('hub-brain-val-input');
    const key = keyInput?.value.trim();
    const val = valInput?.value.trim();

    if (!key || !val) {
      showToast('⚠️ Nama dan link/catatan wajib diisi');
      return;
    }

    try {
      const res = await chrome.runtime.sendMessage({
        type: 'GMT_SAVE_BRAIN_ITEM',
        key: key,
        value: val
      });
      hubBrainItems = Array.isArray(res?.brain) ? res.brain : [];
      if (keyInput) keyInput.value = '';
      if (valInput) valInput.value = '';
      loadMemoryCount();
      renderHubBrainItems();
      showToast('🧠 Disimpan ke otak GMT!');
    } catch (e) {
      showToast('❌ Gagal menyimpan: ' + e.message);
    }
  }

  async function handleDeleteBrainFromHub(key) {
    if (!confirm(`Hapus "${key}" dari ingatan otak GMT?`)) return;
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'GMT_DELETE_BRAIN_ITEM',
        key: key
      });
      hubBrainItems = Array.isArray(res?.brain) ? res.brain : [];
      loadMemoryCount();
      renderHubBrainItems();
      showToast('Item dihapus dari otak');
    } catch (e) {
      showToast('❌ Gagal menghapus: ' + e.message);
    }
  }

  function handleUseBrainItemHub(key, val, isUrl) {
    closeModal(modalMemory);
    commandInput.value = `Tolong buka ${key}`;
    btnClearInput.style.display = 'block';
    if (isUrl) {
      handleSubmitCommand(`Tolong buka ${key}`, val);
    } else {
      handleSubmitCommand(`Info tentang ${key}`);
    }
  }

  async function handleClearMemory() {
    if (!confirm('Yakin ingin membersihkan semua ingatan glosarium otak GMT?')) return;
    try {
      await chrome.runtime.sendMessage({ type: 'GMT_CLEAR_BRAIN' });
      hubBrainItems = [];
      memoryItemsList.innerHTML = `<div class="empty-state">Semua data otak telah dibersihkan.</div>`;
      loadMemoryCount();
      showToast('Otak GMT dibersihkan!');
    } catch (e) {}
  }

  // ─── Helpers ───
  function openModal(modal) {
    modal.style.display = 'flex';
  }

  function closeModal(modal) {
    modal.style.display = 'none';
  }

  function isModalOpen() {
    return modalSettings.style.display === 'flex' || modalMemory.style.display === 'flex';
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    setTimeout(() => {
      toastEl.style.display = 'none';
    }, 2800);
  }

  function isDirectUrl(text) {
    if (!text || text.includes(' ')) return false;
    return (
      text.startsWith('http://') ||
      text.startsWith('https://') ||
      text.endsWith('.com') ||
      text.endsWith('.id') ||
      text.endsWith('.org') ||
      text.endsWith('.net') ||
      text.endsWith('.co') ||
      text.endsWith('.io') ||
      text.endsWith('.edu') ||
      text.endsWith('.gov')
    );
  }

  function formatUrl(text) {
    if (text.startsWith('http://') || text.startsWith('https://')) return text;
    return `https://${text}`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();

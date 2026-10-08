/**
 * Telmy — Interactive Talking Avatar Companion Controller
 * Features:
 * 1. Web Audio API Analyser (FFT) real-time lip-sync for Google Cloud WaveNet TTS
 * 2. Natural cadence syllable lip-sync fallback for browser SpeechSynthesis
 * 3. State Machine: IDLE, THINKING, SPEAKING
 * 4. Autonomous natural eye blinking (3–5.5s interval) & antenna glow pulses
 * 5. Interactive click micro-interactions
 */

class TelmyAvatar {
  constructor(containerEl, options = {}) {
    this.container = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
    this.options = Object.assign({
      size: 40, // px
      interactive: true,
      onClick: null
    }, options);

    this.state = 'IDLE'; // 'IDLE' | 'THINKING' | 'SPEAKING'
    this.currentViseme = 'idle';
    this.audioContext = null;
    this.analyser = null;
    this.audioSource = null;
    this.rafId = null;
    this.blinkTimer = null;
    this.speechCadenceTimer = null;
    this.isBlinking = false;

    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderSVG();
    this.bindDOMElements();
    this.startBlinkLoop();

    if (this.options.interactive) {
      this.container.style.cursor = 'pointer';
      this.container.addEventListener('click', () => this.handleUserTap());
    }
  }

  renderSVG() {
    this.container.innerHTML = `
      <div class="telmy-avatar-wrapper" style="width: ${this.options.size}px; height: ${this.options.size}px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="telmy-avatar-svg">
          <defs>
            <linearGradient id="avatarHelmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="70%" stop-color="#f0f4f8"/>
              <stop offset="100%" stop-color="#d9e2ec"/>
            </linearGradient>

            <linearGradient id="avatarVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0f2b5c"/>
              <stop offset="50%" stop-color="#091e42"/>
              <stop offset="100%" stop-color="#040f28"/>
            </linearGradient>

            <linearGradient id="avatarBlueAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="40%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0369a1"/>
            </linearGradient>

            <linearGradient id="avatarPhoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#60a5fa"/>
              <stop offset="50%" stop-color="#2563eb"/>
              <stop offset="100%" stop-color="#1d4ed8"/>
            </linearGradient>

            <radialGradient id="avatarAntennaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#60a5fa" stop-opacity="1"/>
              <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/>
            </radialGradient>

            <filter id="avatarDropShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="3" flood-color="#034694" flood-opacity="0.22"/>
            </filter>
          </defs>

          <!-- Antenna -->
          <g id="av-antenna">
            <rect x="47.5" y="11" width="5" height="11" rx="2.5" fill="#1d4ed8"/>
            <circle id="av-antenna-aura" cx="50" cy="9.5" r="9" fill="url(#avatarAntennaGlow)" opacity="0.6"/>
            <circle id="av-antenna-bulb" cx="50" cy="9.5" r="6" fill="url(#avatarBlueAccentGrad)"/>
            <circle cx="48" cy="7.5" r="1.8" fill="#ffffff" opacity="0.8"/>
          </g>

          <!-- Headphones (Left & Right) -->
          <g id="av-headphones">
            <rect x="6" y="42" width="10" height="26" rx="5" fill="url(#avatarPhoneGrad)" filter="url(#avatarDropShadow)"/>
            <rect x="11" y="46" width="3" height="18" rx="1.5" fill="#1e40af"/>
            <rect x="84" y="42" width="10" height="26" rx="5" fill="url(#avatarPhoneGrad)" filter="url(#avatarDropShadow)"/>
            <rect x="86" y="46" width="3" height="18" rx="1.5" fill="#1e40af"/>
            <path d="M 14 44 C 14 20, 86 20, 86 44" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>
          </g>

          <!-- Head Helmet Base -->
          <rect id="av-helmet" x="14" y="20" width="72" height="68" rx="26" fill="url(#avatarHelmGrad)" filter="url(#avatarDropShadow)"/>
          <rect x="16" y="22" width="68" height="32" rx="20" fill="#ffffff" opacity="0.45"/>

          <!-- Visor Screen -->
          <rect id="av-screen" x="22" y="32" width="56" height="46" rx="18" fill="url(#avatarVisorGrad)"/>
          <path d="M 26 36 Q 50 33 74 36 Q 50 41 26 36 Z" fill="#ffffff" opacity="0.16"/>

          <!-- Cheeks Blush -->
          <g id="av-blush" opacity="0.55">
            <ellipse cx="29" cy="60" rx="3.5" ry="2" fill="#38bdf8"/>
            <ellipse cx="71" cy="60" rx="3.5" ry="2" fill="#38bdf8"/>
          </g>

          <!-- EYES -->
          <g id="av-eyes">
            <!-- Eyes Open (Happy curved arches) -->
            <g id="av-eyes-open">
              <path d="M 33 52 C 34 45, 43 45, 44 52" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" fill="none"/>
              <path d="M 56 52 C 57 45, 66 45, 67 52" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" fill="none"/>
            </g>

            <!-- Eyes Blink (Slits) -->
            <g id="av-eyes-blink" style="display: none;">
              <line x1="33" y1="51" x2="44" y2="51" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round"/>
              <line x1="56" y1="51" x2="67" y2="51" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round"/>
            </g>

            <!-- Eyes Thinking (Curious look) -->
            <g id="av-eyes-thinking" style="display: none;">
              <circle cx="39" cy="48" r="3.2" fill="#ffffff"/>
              <circle cx="62" cy="48" r="3.2" fill="#ffffff"/>
            </g>
          </g>

          <!-- MOUTH VISEMES -->
          <g id="av-mouth">
            <!-- Viseme 1: Idle (Gentle curve) -->
            <g id="av-viseme-idle">
              <path d="M 44 63 Q 50 68 56 63" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" fill="none"/>
            </g>

            <!-- Viseme 2: AEI (Open mouth) -->
            <g id="av-viseme-aei" style="display: none;">
              <path d="M 43 62 Q 50 72 57 62 Z" fill="#ffffff"/>
              <path d="M 46 66 Q 50 71 54 66" fill="#f43f5e" opacity="0.85"/>
            </g>

            <!-- Viseme 3: OU (Rounded O) -->
            <g id="av-viseme-ou" style="display: none;">
              <ellipse cx="50" cy="65" rx="4.5" ry="5.8" fill="#ffffff"/>
              <ellipse cx="50" cy="65" rx="2.5" ry="3.5" fill="#0f2b5c"/>
            </g>

            <!-- Viseme 4: MBP (Closed line) -->
            <g id="av-viseme-mbp" style="display: none;">
              <line x1="44" y1="64" x2="56" y2="64" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round"/>
            </g>

            <!-- Viseme 5: Wide (Peak amplitude / wide grin) -->
            <g id="av-viseme-wide" style="display: none;">
              <path d="M 41 61 Q 50 75 59 61 Z" fill="#ffffff"/>
              <path d="M 44 67 Q 50 73 56 67" fill="#f43f5e" opacity="0.85"/>
            </g>
          </g>
        </svg>
      </div>
    `;
  }

  bindDOMElements() {
    this.eyesOpen = this.container.querySelector('#av-eyes-open');
    this.eyesBlink = this.container.querySelector('#av-eyes-blink');
    this.eyesThinking = this.container.querySelector('#av-eyes-thinking');

    this.visemes = {
      idle: this.container.querySelector('#av-viseme-idle'),
      aei: this.container.querySelector('#av-viseme-aei'),
      ou: this.container.querySelector('#av-viseme-ou'),
      mbp: this.container.querySelector('#av-viseme-mbp'),
      wide: this.container.querySelector('#av-viseme-wide')
    };

    this.antennaAura = this.container.querySelector('#av-antenna-aura');
    this.avatarWrapper = this.container.querySelector('.telmy-avatar-wrapper');
  }

  /**
   * Set Avatar State: IDLE, THINKING, SPEAKING
   */
  setState(newState) {
    if (this.state === newState) return;
    this.state = newState;

    if (newState === 'THINKING') {
      this.showThinkingEyes();
      this.setViseme('ou');
      if (this.antennaAura) {
        this.antennaAura.style.animation = 'avatarPulse 0.8s infinite alternate';
      }
    } else if (newState === 'SPEAKING') {
      this.showOpenEyes();
      if (this.antennaAura) {
        this.antennaAura.style.opacity = '1';
        this.antennaAura.style.animation = 'avatarPulse 0.4s infinite alternate';
      }
    } else {
      // IDLE
      this.showOpenEyes();
      this.setViseme('idle');
      if (this.antennaAura) {
        this.antennaAura.style.animation = 'none';
        this.antennaAura.style.opacity = '0.6';
      }
      this.stopSpeechCadence();
      this.stopAudioAnalysis();
    }
  }

  /**
   * Switch active mouth viseme
   */
  setViseme(name) {
    if (!this.visemes[name]) name = 'idle';
    if (this.currentViseme === name) return;

    for (const [key, el] of Object.entries(this.visemes)) {
      if (el) el.style.display = key === name ? 'block' : 'none';
    }
    this.currentViseme = name;
  }

  /**
   * Natural Eye Blinking Loop
   */
  startBlinkLoop() {
    const triggerBlink = () => {
      if (this.state === 'THINKING' || this.isBlinking) {
        scheduleNext();
        return;
      }

      this.isBlinking = true;
      if (this.eyesOpen) this.eyesOpen.style.display = 'none';
      if (this.eyesBlink) this.eyesBlink.style.display = 'block';

      setTimeout(() => {
        if (this.state !== 'THINKING') {
          if (this.eyesBlink) this.eyesBlink.style.display = 'none';
          if (this.eyesOpen) this.eyesOpen.style.display = 'block';
        }
        this.isBlinking = false;
        scheduleNext();
      }, 140);
    };

    const scheduleNext = () => {
      const nextDelay = 3200 + Math.random() * 2600; // 3.2s - 5.8s
      this.blinkTimer = setTimeout(triggerBlink, nextDelay);
    };

    scheduleNext();
  }

  showOpenEyes() {
    if (this.eyesOpen) this.eyesOpen.style.display = 'block';
    if (this.eyesBlink) this.eyesBlink.style.display = 'none';
    if (this.eyesThinking) this.eyesThinking.style.display = 'none';
  }

  showThinkingEyes() {
    if (this.eyesOpen) this.eyesOpen.style.display = 'none';
    if (this.eyesBlink) this.eyesBlink.style.display = 'none';
    if (this.eyesThinking) this.eyesThinking.style.display = 'block';
  }

  /**
   * Attach HTMLAudioElement to Web Audio API Analyser for real-time WaveNet lip-sync
   */
  attachAudioElement(audioEl) {
    if (!audioEl) return;
    this.setState('SPEAKING');

    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Check if source already connected to this audio element
      if (!audioEl.__telmySourceConnected) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.55;

        this.audioSource = this.audioContext.createMediaElementSource(audioEl);
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        audioEl.__telmySourceConnected = true;
      }

      this.startAudioAnalysisLoop();

      audioEl.addEventListener('ended', () => {
        this.setState('IDLE');
      }, { once: true });

      audioEl.addEventListener('pause', () => {
        if (audioEl.ended || audioEl.currentTime >= audioEl.duration) {
          this.setState('IDLE');
        }
      }, { once: true });

    } catch (err) {
      console.warn('[TelmyAvatar] Web Audio API hook fallback to cadence:', err.message);
      // Fallback to syllable cadence
      this.startSpeechCadence();
      audioEl.addEventListener('ended', () => this.setState('IDLE'), { once: true });
    }
  }

  /**
   * FFT Frequency Analysis Loop
   */
  startAudioAnalysisLoop() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const checkVolume = () => {
      if (this.state !== 'SPEAKING') {
        this.setViseme('idle');
        return;
      }

      this.analyser.getByteFrequencyData(dataArray);

      // Calculate Root Mean Square (RMS) volume
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avgVolume = sum / dataArray.length;

      // Map volume to visemes
      if (avgVolume < 10) {
        this.setViseme('idle');
      } else if (avgVolume < 28) {
        this.setViseme('mbp');
      } else if (avgVolume < 52) {
        this.setViseme('ou');
      } else if (avgVolume < 85) {
        this.setViseme('aei');
      } else {
        this.setViseme('wide');
      }

      this.rafId = requestAnimationFrame(checkVolume);
    };

    this.rafId = requestAnimationFrame(checkVolume);
  }

  stopAudioAnalysis() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Start Natural Syllable Cadence (For SpeechSynthesis fallback when Web Audio is bypassed)
   */
  startSpeechCadence() {
    this.setState('SPEAKING');
    this.stopSpeechCadence();

    const sequence = ['aei', 'ou', 'aei', 'mbp', 'wide', 'aei', 'ou', 'idle'];
    let idx = 0;

    const tick = () => {
      if (this.state !== 'SPEAKING') return;
      this.setViseme(sequence[idx % sequence.length]);
      idx++;
      const nextDelay = 120 + Math.random() * 90; // 120ms - 210ms
      this.speechCadenceTimer = setTimeout(tick, nextDelay);
    };

    tick();
  }

  stopSpeechCadence() {
    if (this.speechCadenceTimer) {
      clearTimeout(this.speechCadenceTimer);
      this.speechCadenceTimer = null;
    }
  }

  /**
   * Cute Interactive Tap Reaction
   */
  handleUserTap() {
    if (this.avatarWrapper) {
      this.avatarWrapper.classList.add('avatar-tap-bounce');
      setTimeout(() => this.avatarWrapper.classList.remove('avatar-tap-bounce'), 350);
    }

    if (this.state === 'IDLE') {
      this.setViseme('wide');
      setTimeout(() => {
        if (this.state === 'IDLE') this.setViseme('idle');
      }, 500);
    }

    if (typeof this.options.onClick === 'function') {
      this.options.onClick();
    }
  }

  destroy() {
    this.stopAudioAnalysis();
    this.stopSpeechCadence();
    if (this.blinkTimer) clearTimeout(this.blinkTimer);
    if (this.audioContext) {
      try { this.audioContext.close(); } catch (e) {}
    }
  }
}

// Export global for sidepanel
window.TelmyAvatar = TelmyAvatar;

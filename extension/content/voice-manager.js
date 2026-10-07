/**
 * Telmy — Voice Engine & Speech Recognition Manager (Content Script)
 * Handles:
 * 1. ElevenLabs TTS via Telmy Backend Gateway (with Browser SpeechSynthesis fallback)
 * 2. Web Speech API Speech-to-Text (STT) for 2-way conversation
 */
window.TelmyVoice = (function () {
  let currentAudio = null;
  let recognition = null;
  let isListeningState = false;
  let isSpeakingState = false;
  let isMutedState = false;

  // Event listeners for UI & Avatar reactivity
  const listeners = {
    speakStart: [],
    speakEnd: [],
    listeningStart: [],
    listeningEnd: []
  };

  function emit(event, data) {
    if (listeners[event]) {
      listeners[event].forEach(fn => {
        try { fn(data); } catch (e) { console.warn('[TelmyVoice emit error]', e); }
      });
    }
  }

  // Language code mapping
  const LANG_LOCALE_MAP = {
    id: 'id-ID',
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR'
  };

  /**
   * Speak text using Backend ElevenLabs Gateway, fallback to Web Speech
   */
  async function speak(text, lang = 'id') {
    if (!text || isMutedState) return;
    stopSpeaking();

    isSpeakingState = true;
    emit('speakStart', { text, lang });

    // 1. Try ElevenLabs via Telmy Backend Gateway
    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          type: 'VOICE_TTS',
          payload: { text, language: lang }
        }, resolve);
      });

      if (response && response.success && response.audioDataUrl) {
        currentAudio = new Audio(response.audioDataUrl);
        currentAudio.onended = () => {
          isSpeakingState = false;
          currentAudio = null;
          emit('speakEnd');
        };
        currentAudio.onerror = (e) => {
          console.warn('[TelmyVoice] Backend audio playback failed, falling back to browser TTS:', e);
          speakBrowserFallback(text, lang);
        };
        await currentAudio.play();
        return;
      }
    } catch (err) {
      console.warn('[TelmyVoice] ElevenLabs backend gateway failed:', err.message);
    }

    // 2. Seamless Fallback: Native Browser SpeechSynthesis
    speakBrowserFallback(text, lang);
  }

  /**
   * Native Browser SpeechSynthesis Fallback
   */
  function speakBrowserFallback(text, lang = 'id') {
    if (!('speechSynthesis' in window)) {
      isSpeakingState = false;
      emit('speakEnd');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for cleaner voice utterance
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = LANG_LOCALE_MAP[lang] || 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      isSpeakingState = false;
      emit('speakEnd');
    };

    utterance.onerror = () => {
      isSpeakingState = false;
      emit('speakEnd');
    };

    // Try to pick natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetLangPrefix = utterance.lang.slice(0, 2);
    const matchedVoice = voices.find(v => v.lang.startsWith(targetLangPrefix) && !v.name.includes('Google')) ||
                         voices.find(v => v.lang.startsWith(targetLangPrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop any playing speech
   */
  function stopSpeaking() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (isSpeakingState) {
      isSpeakingState = false;
      emit('speakEnd');
    }
  }

  /**
   * Start Speech-to-Text Recognition
   */
  function startListening({ onInterim, onFinal, onError, lang = 'id' }) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    stopSpeaking();
    stopListening();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANG_LOCALE_MAP[lang] || 'id-ID';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListeningState = true;
      emit('listeningStart');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      if (interimTranscript && onInterim) {
        onInterim(interimTranscript);
      }
      if (finalTranscript && onFinal) {
        onFinal(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      isListeningState = false;
      emit('listeningEnd');
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      isListeningState = false;
      emit('listeningEnd');
    };

    try {
      recognition.start();
    } catch (err) {
      isListeningState = false;
      emit('listeningEnd');
      if (onError) onError(err.message);
    }
  }

  /**
   * Stop Speech-to-Text Recognition
   */
  function stopListening() {
    if (recognition && isListeningState) {
      recognition.stop();
    }
    isListeningState = false;
    emit('listeningEnd');
  }

  /**
   * Toggle Mute for Voice Output
   */
  function setMuted(muted) {
    isMutedState = Boolean(muted);
    if (isMutedState) {
      stopSpeaking();
    }
  }

  return {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    setMuted,
    isListening: () => isListeningState,
    isSpeaking: () => isSpeakingState,
    isMuted: () => isMutedState,
    on: (event, fn) => {
      if (listeners[event]) listeners[event].push(fn);
    }
  };
})();

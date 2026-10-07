// GMT Offscreen Speech Recognition Hub
// Runs in extension origin (chrome-extension://...)
// Persistent across all website navigations without domain permissions

let recognition = null;
let isRunning = false;
let lang = 'id-ID';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.target !== 'offscreen') return;

  if (msg.type === 'START_OFFSCREEN_SPEECH') {
    lang = msg.lang === 'id' ? 'id-ID' : 'en-US';
    startRecognition();
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'STOP_OFFSCREEN_SPEECH') {
    stopRecognition();
    sendResponse({ ok: true });
    return true;
  }
});

function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('[GMT Offscreen] SpeechRecognition not supported');
    return;
  }

  if (recognition) {
    try { recognition.stop(); } catch (e) {}
  }

  try {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    isRunning = true;

    recognition.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript.trim();
        const isFinal = e.results[i].isFinal;
        const lower = transcript.toLowerCase();

        // Check wake word
        if (lower.includes('halo gmt') || lower.includes('hey gmt') || lower.includes('hai gmt')) {
          const matchIndex = lower.indexOf('gmt');
          const userPrompt = transcript.slice(matchIndex + 3).trim();

          chrome.runtime.sendMessage({
            type: 'GMT_OFFSCREEN_WAKE_DETECTED',
            userPrompt: userPrompt,
            transcript: transcript,
            isFinal: isFinal,
          }).catch(() => {});
        } else {
          // Regular speech forwarding
          chrome.runtime.sendMessage({
            type: 'GMT_OFFSCREEN_SPEECH_INTERIM',
            transcript: transcript,
            isFinal: isFinal,
          }).catch(() => {});
        }
      }
    };

    recognition.onerror = (e) => {
      console.warn('[GMT Offscreen] Speech error:', e.error);
      if (e.error === 'not-allowed') {
        chrome.runtime.sendMessage({ type: 'GMT_OFFSCREEN_PERMISSION_NEEDED' }).catch(() => {});
        isRunning = false;
        return;
      }
      if (isRunning) {
        setTimeout(() => { if (isRunning) startRecognition(); }, 1000);
      }
    };

    recognition.onend = () => {
      if (isRunning) {
        startRecognition();
      }
    };

    recognition.start();
    console.log('[GMT Offscreen] Speech recognition running in background');
  } catch (err) {
    console.warn('[GMT Offscreen] Start error:', err);
    isRunning = false;
  }
}

function stopRecognition() {
  isRunning = false;
  if (recognition) {
    recognition.onend = null;
    try { recognition.stop(); } catch (e) {}
    recognition = null;
  }
  console.log('[GMT Offscreen] Speech recognition stopped');
}

// Auto-start upon creation
startRecognition();

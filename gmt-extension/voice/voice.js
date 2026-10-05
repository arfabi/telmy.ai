// GMT — Voice Module
// Handles: ElevenLabs TTS (primary) + Web Speech API (fallback)
// Also handles: Voice input via Web Speech API

const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

// ─────────────────────────────────────────
// VOICE OUTPUT (Text-to-Speech)
// ─────────────────────────────────────────

let currentAudio = null;

export async function speak(text, lang = 'id') {
  if (!text) return;
  stopSpeaking();

  const elKey = await getElevenLabsKey();
  const voiceId = await getVoiceId();

  if (elKey && voiceId) {
    try {
      await speakElevenLabs(text, elKey, voiceId);
      return;
    } catch (err) {
      console.warn('[GMT Voice] ElevenLabs failed, using browser TTS:', err.message);
    }
  }

  // Fallback: browser TTS
  speakBrowser(text, lang);
}

async function speakElevenLabs(text, apiKey, voiceId) {
  const response = await fetch(`${ELEVENLABS_API_BASE}/text-to-speech/${voiceId}/stream`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true,
      }
    })
  });

  if (!response.ok) throw new Error(`ElevenLabs error ${response.status}`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  currentAudio = new Audio(url);
  currentAudio.onended = () => URL.revokeObjectURL(url);
  await currentAudio.play();
}

function speakBrowser(text, lang) {
  const synth = window.speechSynthesis;
  synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === 'id' ? 'id-ID' : 'en-US';
  utter.rate = 0.95;
  utter.pitch = 1.0;
  utter.volume = 1.0;

  // Try to find a good voice
  const voices = synth.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith(lang === 'id' ? 'id' : 'en') && !v.name.includes('Google')
  ) || voices.find(v => v.lang.startsWith(lang === 'id' ? 'id' : 'en'));
  if (preferred) utter.voice = preferred;

  synth.speak(utter);
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// ─────────────────────────────────────────
// VOICE INPUT (Speech Recognition)
// ─────────────────────────────────────────

let recognition = null;
let isListening = false;

export function startListening(onResult, onError, lang = 'id') {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition not supported in this browser');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = lang === 'id' ? 'id-ID' : 'en-US';
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const isFinal = event.results[0].isFinal;
    onResult(transcript, isFinal);
  };

  recognition.onerror = (event) => {
    isListening = false;
    onError(event.error);
  };

  recognition.onend = () => {
    isListening = false;
  };

  recognition.start();
  isListening = true;
}

export function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
  }
}

export function isCurrentlyListening() {
  return isListening;
}

// ─────────────────────────────────────────
// SETTINGS HELPERS
// ─────────────────────────────────────────

async function getElevenLabsKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get('gmt_elevenlabs_key', (r) => resolve(r.gmt_elevenlabs_key || null));
  });
}

async function getVoiceId() {
  return new Promise((resolve) => {
    // Default: Rachel voice (multilingual, natural)
    chrome.storage.local.get('gmt_voice_id', (r) => resolve(r.gmt_voice_id || '21m00Tcm4TlvDq8ikWAM'));
  });
}

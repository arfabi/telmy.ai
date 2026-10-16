/**
 * Telmy Backend — Voice Service (Google Cloud TTS WaveNet Integration)
 * High-performance, natural voice synthesis pipeline supporting 11 JAPAC languages
 * 100% Google Cloud TTS with client-side Web Speech API fallback.
 */

const GOOGLE_TTS_ENDPOINT = process.env.GOOGLE_TTS_ENDPOINT || 'https://texttospeech.googleapis.com/v1/text:synthesize';

// Complete JAPAC Language to Google Cloud TTS WaveNet mapping (English default)
const GOOGLE_VOICE_MAP = {
  en: { languageCode: 'en-US', name: process.env.GOOGLE_TTS_VOICE_EN || 'en-US-Wavenet-F', ssmlGender: 'FEMALE' },
  id: { languageCode: 'id-ID', name: process.env.GOOGLE_TTS_VOICE_ID || 'id-ID-Wavenet-A', ssmlGender: 'FEMALE' },
  ja: { languageCode: 'ja-JP', name: process.env.GOOGLE_TTS_VOICE_JA || 'ja-JP-Wavenet-A', ssmlGender: 'FEMALE' },
  ko: { languageCode: 'ko-KR', name: process.env.GOOGLE_TTS_VOICE_KO || 'ko-KR-Wavenet-A', ssmlGender: 'FEMALE' },
  zh: { languageCode: 'cmn-CN', name: process.env.GOOGLE_TTS_VOICE_ZH || 'cmn-CN-Wavenet-A', ssmlGender: 'FEMALE' },
  'zh-TW': { languageCode: 'cmn-TW', name: process.env.GOOGLE_TTS_VOICE_ZHTW || 'cmn-TW-Wavenet-A', ssmlGender: 'FEMALE' },
  vi: { languageCode: 'vi-VN', name: process.env.GOOGLE_TTS_VOICE_VI || 'vi-VN-Wavenet-A', ssmlGender: 'FEMALE' },
  th: { languageCode: 'th-TH', name: process.env.GOOGLE_TTS_VOICE_TH || 'th-TH-Wavenet-A', ssmlGender: 'FEMALE' },
  hi: { languageCode: 'hi-IN', name: process.env.GOOGLE_TTS_VOICE_HI || 'hi-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  fil: { languageCode: 'fil-PH', name: process.env.GOOGLE_TTS_VOICE_FIL || 'fil-PH-Wavenet-A', ssmlGender: 'FEMALE' },
  ms: { languageCode: 'ms-MY', name: process.env.GOOGLE_TTS_VOICE_MS || 'ms-MY-Wavenet-A', ssmlGender: 'FEMALE' }
};

import { detectTextLanguage } from './chatService.js';

/**
 * Check if Google Cloud TTS is configured
 */
export function isVoiceConfigured() {
  return Boolean(process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY);
}

/**
 * Get available voice settings & status
 */
export function getVoiceStatus() {
  const hasGoogle = isVoiceConfigured();
  return {
    configured: hasGoogle,
    provider: hasGoogle ? 'google-cloud-tts' : 'browser-speech',
    model: process.env.GOOGLE_TTS_MODEL_NAME || 'Google Cloud TTS WaveNet',
    endpoint: GOOGLE_TTS_ENDPOINT
  };
}

/**
 * Synthesize speech from text using Google Cloud Text-to-Speech
 * Returns Buffer with audio/mpeg
 */
export async function synthesizeSpeechStream({ text, language = 'en' }) {
  if (!text || text.trim() === '') {
    throw new Error('Text to synthesize cannot be empty.');
  }

  const cleanText = text.slice(0, 4000);
  const googleApiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY;

  if (!googleApiKey) {
    const error = new Error('Google Cloud TTS API Key is not configured. Please use browser speech synthesis.');
    error.code = 'NO_API_KEY';
    throw error;
  }

  // CRITICAL HIGHER PRIORITY LANGUAGE POLICY FOR TTS:
  // Detect the actual language of the text to be spoken. If text clearly matches another language
  // (e.g. Indonesian response while session/user language was 'en'), use the native voice of the text!
  const effectiveLanguage = detectTextLanguage(cleanText, language);
  const voiceConfig = GOOGLE_VOICE_MAP[effectiveLanguage] || GOOGLE_VOICE_MAP[language] || GOOGLE_VOICE_MAP['en'];
  const requestHeaders = {
    'Content-Type': 'application/json'
  };
  const allowedReferer = process.env.GOOGLE_TTS_REFERER || process.env.ALLOWED_REFERER || 'https://telmy.id/';
  if (allowedReferer) {
    requestHeaders['Referer'] = allowedReferer;
  }

  const response = await fetch(`${GOOGLE_TTS_ENDPOINT}?key=${googleApiKey}`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({
      input: { text: cleanText },
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.name,
        ssmlGender: voiceConfig.ssmlGender
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.05,
        pitch: 0.0
      }
    })
  });

  if (response.ok) {
    const json = await response.json();
    if (json.audioContent) {
      const audioBuffer = Buffer.from(json.audioContent, 'base64');
      return {
        isBuffer: true,
        buffer: audioBuffer
      };
    }
  }

  const errJson = await response.json().catch(() => ({}));
  const errMsg = errJson.error ? errJson.error.message : response.statusText;
  throw new Error(`Google Cloud TTS API Error (${response.status}): ${errMsg}`);
}

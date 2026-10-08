/**
 * Telmy Backend — Voice Service (Google Cloud TTS & Gemini Voice Integration)
 * High-performance, natural voice synthesis pipeline supporting JAPAC languages
 * with native Web Speech API and ElevenLabs fallbacks.
 */

const GOOGLE_TTS_ENDPOINT = process.env.GOOGLE_TTS_ENDPOINT || 'https://texttospeech.googleapis.com/v1/text:synthesize';
const ELEVENLABS_API_BASE = process.env.ELEVENLABS_API_BASE || 'https://api.elevenlabs.io/v1';

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

/**
 * Check if voice backend is configured
 */
export function isVoiceConfigured() {
  const hasGoogle = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_TTS_API_KEY);
  const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY);
  return hasGoogle || hasElevenLabs;
}

/**
 * Get available voice settings & status
 */
export function getVoiceStatus() {
  const hasGoogle = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_TTS_API_KEY);
  return {
    configured: isVoiceConfigured(),
    provider: hasGoogle ? 'google-cloud-tts' : (process.env.ELEVENLABS_API_KEY ? 'elevenlabs' : 'browser-speech'),
    model: process.env.GOOGLE_TTS_MODEL_NAME || 'Google Cloud TTS WaveNet',
    endpoint: GOOGLE_TTS_ENDPOINT
  };
}

/**
 * Synthesize speech from text
 * Returns Buffer or ReadableStream with audio/mpeg
 */
export async function synthesizeSpeechStream({ text, language = 'en', voiceId, modelId }) {
  if (!text || text.trim() === '') {
    throw new Error('Text to synthesize cannot be empty.');
  }

  const cleanText = text.slice(0, 4000);
  const googleApiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY;

  // 1. Try Google Text-to-Speech / Gemini Flash-Lite TTS
  if (googleApiKey) {
    try {
      const voiceConfig = GOOGLE_VOICE_MAP[language] || GOOGLE_VOICE_MAP['id'];
      const response = await fetch(`${GOOGLE_TTS_ENDPOINT}?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn('[Google TTS API Note]:', errJson.error ? errJson.error.message : response.statusText);
      }
    } catch (gErr) {
      console.warn('[Google TTS Gateway Error]', gErr.message);
    }
  }

  // 2. Optional Fallback: ElevenLabs (if configured)
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  if (elevenLabsApiKey) {
    const selectedVoice = voiceId || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
    const selectedModel = modelId || process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
    const endpoint = `${ELEVENLABS_API_BASE}/text-to-speech/${selectedVoice}/stream`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsApiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: selectedModel
      })
    });

    if (response.ok) {
      return response;
    }
  }

  // 3. Fallback signal if backend TTS unavailable
  const error = new Error('Backend TTS gateway unavailable, falling back to browser Web Speech API.');
  error.code = 'NO_API_KEY';
  throw error;
}

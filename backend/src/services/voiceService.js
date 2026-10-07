/**
 * Telmy Backend — Voice Service (Google Cloud TTS & Gemini Voice Integration)
 * High-performance, natural voice synthesis pipeline supporting JAPAC languages
 * with native Web Speech API and ElevenLabs fallbacks.
 */

const GOOGLE_TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

// Complete JAPAC Language to Google TTS locale mapping (English default)
const GOOGLE_VOICE_MAP = {
  en: { languageCode: 'en-US', name: 'en-US-Journey-F', ssmlGender: 'FEMALE' },
  id: { languageCode: 'id-ID', name: 'id-ID-Standard-A', ssmlGender: 'FEMALE' },
  ja: { languageCode: 'ja-JP', name: 'ja-JP-Standard-A', ssmlGender: 'FEMALE' },
  ko: { languageCode: 'ko-KR', name: 'ko-KR-Standard-A', ssmlGender: 'FEMALE' },
  zh: { languageCode: 'cmn-CN', name: 'cmn-CN-Standard-A', ssmlGender: 'FEMALE' },
  'zh-TW': { languageCode: 'cmn-TW', name: 'cmn-TW-Standard-A', ssmlGender: 'FEMALE' },
  vi: { languageCode: 'vi-VN', name: 'vi-VN-Standard-A', ssmlGender: 'FEMALE' },
  th: { languageCode: 'th-TH', name: 'th-TH-Standard-A', ssmlGender: 'FEMALE' },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Standard-A', ssmlGender: 'FEMALE' },
  fil: { languageCode: 'fil-PH', name: 'fil-PH-Standard-A', ssmlGender: 'FEMALE' },
  ms: { languageCode: 'ms-MY', name: 'ms-MY-Standard-A', ssmlGender: 'FEMALE' }
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
    provider: hasGoogle ? 'google-gemini-tts' : (process.env.ELEVENLABS_API_KEY ? 'elevenlabs' : 'browser-speech'),
    model: 'Gemini 3.8 Flash-Lite TTS (Preview)',
    skuInput: '6D6B-51EE-87C4',
    skuOutput: '676E-5101-0A30'
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

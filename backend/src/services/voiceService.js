/**
 * Telmy Backend — Voice Service (ElevenLabs Integration)
 * Handles text-to-speech streaming via ElevenLabs API
 */

const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

// Default voice mappings
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel (clear, natural multilingual)

// Language-specific recommended voice IDs (can fallback to default)
const LANGUAGE_VOICES = {
  id: '21m00Tcm4TlvDq8ikWAM', // Rachel / Multilingual
  en: '21m00Tcm4TlvDq8ikWAM', // Rachel
  zh: '21m00Tcm4TlvDq8ikWAM', // Rachel multilingual
  ja: '21m00Tcm4TlvDq8ikWAM',
  ko: '21m00Tcm4TlvDq8ikWAM'
};

/**
 * Check if ElevenLabs is configured
 */
export function isVoiceConfigured() {
  return Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim() !== '');
}

/**
 * Get available voice settings & status
 */
export function getVoiceStatus() {
  return {
    configured: isVoiceConfigured(),
    defaultVoiceId: DEFAULT_VOICE_ID,
    model: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
    provider: 'elevenlabs'
  };
}

/**
 * Synthesize speech from text using ElevenLabs API
 * Returns response stream (ReadableStream) with audio/mpeg
 */
export async function synthesizeSpeechStream({ text, voiceId, language = 'id', modelId }) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    const error = new Error('ElevenLabs API key is not configured on backend.');
    error.code = 'NO_API_KEY';
    throw error;
  }

  if (!text || text.trim() === '') {
    throw new Error('Text to synthesize cannot be empty.');
  }

  const selectedVoice = voiceId || LANGUAGE_VOICES[language] || DEFAULT_VOICE_ID;
  const selectedModel = modelId || process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';

  const endpoint = `${ELEVENLABS_API_BASE}/text-to-speech/${selectedVoice}/stream`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: text.slice(0, 4000), // ElevenLabs max limit per request safety cap
      model_id: selectedModel,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    const error = new Error(`ElevenLabs API error (${response.status}): ${errorText || response.statusText}`);
    error.status = response.status;
    error.details = errorText;
    throw error;
  }

  return response;
}

import express from 'express';
import { synthesizeSpeechStream, getVoiceStatus } from '../services/voiceService.js';

const router = express.Router();

/**
 * GET /api/voice/status
 * Check if Google Cloud TTS is configured and get voice settings
 */
router.get('/voice/status', (req, res) => {
  try {
    const status = getVoiceStatus();
    return res.json({ success: true, ...status });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/voice/tts
 * Body: { text: "...", language: "en" }
 * Returns audio/mpeg synthesized via Google Cloud TTS WaveNet
 */
router.post('/voice/tts', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Text is required for TTS' });
    }

    const ttsResult = await synthesizeSpeechStream({
      text: text.trim(),
      language
    });

    // Set audio headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    if (ttsResult.isBuffer && ttsResult.buffer) {
      return res.send(ttsResult.buffer);
    }

    const buffer = Buffer.from(await ttsResult.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.warn('[Voice Route] Google TTS synthesis notice:', error.message);
    const status = error.code === 'NO_API_KEY' ? 503 : 500;
    return res.status(status).json({
      success: false,
      fallback: true,
      error: error.message
    });
  }
});

export default router;

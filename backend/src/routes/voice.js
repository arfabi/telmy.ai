import express from 'express';
import { Readable } from 'node:stream';
import { synthesizeSpeechStream, getVoiceStatus } from '../services/voiceService.js';

const router = express.Router();

/**
 * GET /api/voice/status
 * Check if ElevenLabs is configured and get voice settings
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
 * Body: { text: "...", language: "id", voiceId: "...", modelId: "..." }
 * Streams audio/mpeg directly from ElevenLabs or returns fallback signal
 */
router.post('/voice/tts', async (req, res) => {
  try {
    const { text, language = 'id', voiceId, modelId } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Text is required for TTS' });
    }

    const elevenLabsResponse = await synthesizeSpeechStream({
      text: text.trim(),
      language,
      voiceId,
      modelId
    });

    // Set audio headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Pipe Web ReadableStream to Node.js HTTP response
    if (elevenLabsResponse.body) {
      const nodeStream = Readable.fromWeb(elevenLabsResponse.body);
      nodeStream.pipe(res);
      nodeStream.on('error', (err) => {
        console.error('[Voice Route] Stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, fallback: true, error: err.message });
        }
      });
    } else {
      const buffer = Buffer.from(await elevenLabsResponse.arrayBuffer());
      return res.send(buffer);
    }
  } catch (error) {
    console.warn('[Voice Route] ElevenLabs synthesis failed, notifying client for fallback:', error.message);
    const status = error.code === 'NO_API_KEY' ? 503 : 500;
    return res.status(status).json({
      success: false,
      fallback: true,
      error: error.message
    });
  }
});

export default router;

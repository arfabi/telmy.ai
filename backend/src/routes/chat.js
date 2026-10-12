import express from 'express';
import { handleCopilotChat } from '../services/chatService.js';

const router = express.Router();

/**
 * POST /api/chat
 * Body: { message, history, language, formContext }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [], language = 'en', formContext = {}, screenshot = null } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    const result = await handleCopilotChat({
      message: message.trim(),
      history,
      language,
      formContext,
      screenshot
    });

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[Chat Route] Error handling chat:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

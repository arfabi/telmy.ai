import express from 'express';
import { translatePageTexts } from '../services/translateService.js';

const router = express.Router();

/**
 * POST /api/translate-page
 * Body: { pageContext, targetLanguage, texts }
 */
router.post('/translate-page', async (req, res) => {
  try {
    const { pageContext = {}, targetLanguage = 'en', texts = {} } = req.body;

    if (!texts || typeof texts !== 'object' || Object.keys(texts).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No text tokens provided to translate.'
      });
    }

    const result = await translatePageTexts({
      pageContext,
      targetLanguage,
      texts
    });

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[Translate Route] Error translating page:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

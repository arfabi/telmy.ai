import express from 'express';
import { explainPdfForm } from '../services/pdfService.js';

const router = express.Router();

/**
 * POST /api/explain-pdf
 * Ingest and decode a downloaded / online PDF form via Gemini Multimodal API
 */
router.post('/explain-pdf', async (req, res) => {
  try {
    const { pdfBase64, fileName = 'Form.pdf', targetLanguage = 'en' } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({
        success: false,
        error: 'Missing pdfBase64 payload in request body'
      });
    }

    const result = await explainPdfForm(pdfBase64, fileName, targetLanguage);
    return res.json(result);
  } catch (error) {
    console.error('[PDF Route] Error analyzing PDF form:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while analyzing PDF'
    });
  }
});

export default router;

import express from 'express';
import { explainPdfForm, extractVaultEntitiesFromDocument } from '../services/pdfService.js';
import { verifyAndDeductQuota } from '../middleware/quotaMiddleware.js';

const router = express.Router();

/**
 * POST /api/explain-pdf
 * Ingest and decode a downloaded / online PDF form via Gemini Multimodal API
 */
router.post('/explain-pdf', verifyAndDeductQuota, async (req, res) => {
  try {
    const {
      pdfBase64,
      fileBase64,
      fileName,
      filename = 'Document.pdf',
      targetLanguage,
      language = 'en',
      mimeType = 'application/pdf'
    } = req.body;

    const finalBase64 = fileBase64 || pdfBase64;
    const finalFileName = fileName || filename;
    const finalLang = targetLanguage || language;

    if (!finalBase64) {
      return res.status(400).json({
        success: false,
        error: 'Missing fileBase64 or pdfBase64 payload in request body'
      });
    }

    const result = await explainPdfForm(finalBase64, finalFileName, finalLang, mimeType);
    return res.json({ ...result, quota: req.userQuota });
  } catch (error) {
    console.error('[PDF Route] Error analyzing document form:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while analyzing document'
    });
  }
});

/**
 * POST /api/pdf/extract-vault
 * Ingest identity document (KTP, Passport, Diploma) for Zero-Knowledge Vault AutoFill
 * Zero Retention: File discarded immediately from memory after entity extraction.
 */
router.post('/pdf/extract-vault', async (req, res) => {
  try {
    const {
      fileBase64,
      pdfBase64,
      fileName = 'Document.pdf',
      mimeType = 'application/pdf'
    } = req.body;

    const payload = fileBase64 || pdfBase64;
    if (!payload) {
      return res.status(400).json({
        success: false,
        error: 'Missing file payload (fileBase64 or pdfBase64)'
      });
    }

    const result = await extractVaultEntitiesFromDocument(payload, fileName, mimeType);
    return res.json(result);
  } catch (error) {
    console.error('[PDF Route] Error extracting vault entities:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error extracting entities from document'
    });
  }
});

export default router;

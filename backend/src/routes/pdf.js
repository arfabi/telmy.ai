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
      pdfUrl,
      pdfBase64,
      fileBase64,
      fileName,
      filename = 'Document.pdf',
      targetLanguage,
      language = 'en',
      mimeType = 'application/pdf'
    } = req.body;

    let finalBase64 = fileBase64 || pdfBase64;
    const finalFileName = fileName || filename;
    const finalLang = targetLanguage || language;

    // If pdfUrl is provided, fetch remote PDF on server-side (Zero browser permissions needed!)
    if (!finalBase64 && pdfUrl) {
      try {
        console.log('[PDF Route] 🌐 Fetching remote PDF from URL:', pdfUrl);
        const remoteResp = await fetch(pdfUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (!remoteResp.ok) throw new Error(`HTTP error ${remoteResp.status}`);
        const arrayBuf = await remoteResp.arrayBuffer();
        finalBase64 = `data:${mimeType};base64,${Buffer.from(arrayBuf).toString('base64')}`;
      } catch (fetchErr) {
        console.error('[PDF Route] Error fetching remote PDF URL:', fetchErr.message);
        return res.status(400).json({
          success: false,
          error: `Failed to download remote PDF: ${fetchErr.message}`
        });
      }
    }

    if (!finalBase64) {
      return res.status(400).json({
        success: false,
        error: 'Missing pdfUrl or fileBase64/pdfBase64 payload in request body'
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

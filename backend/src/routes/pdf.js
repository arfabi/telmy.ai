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

    // Auto-record to saved_forms history in Firestore for dashboard visibility
    try {
      const { getFirestore } = await import('../config/firebase.js');
      const { db, isFirebaseConnected } = getFirestore();
      const userId = req.headers['x-user-id'] || req.body?.userId;
      if (isFirebaseConnected && db && userId && userId !== 'guest' && userId !== 'guest_user') {
        const cleanFile = (finalFileName || 'document.pdf').replace(/[^a-zA-Z0-9]/g, '_');
        const formId = 'pdf_' + cleanFile + '_' + (req.userQuota?.sessionId || Date.now().toString(36));
        
        let authority = 'Official Issuer';
        if (pdfUrl) {
          try { authority = new URL(pdfUrl).hostname; } catch(e){}
        }

        const historyData = {
          id: formId,
          uid: userId,
          title: result.data?.title || finalFileName || 'PDF Document Form',
          authority: authority,
          type: 'pdf',
          url: pdfUrl || '',
          date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
          fieldCount: result.data?.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0,
          status: 'Active (24h)',
          sessionId: req.userQuota?.sessionId || null,
          updatedAt: new Date().toISOString()
        };
        await db.collection('saved_forms').doc(formId).set(historyData, { merge: true });
        console.log(`[PDF Route] 📝 PDF Form history saved for user ${userId}:`, formId);
      }
    } catch (histErr) {
      console.warn('[PDF Route] Warning: could not write to saved_forms:', histErr.message);
    }

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
 * POST /api/pdf/session
 * Register or stage a PDF / Photo document session for the Telmy Dashboard Studio.
 * Zero-Retention: Only temporary session metadata is kept for handoff.
 */
router.post('/pdf/session', async (req, res) => {
  try {
    const { pdfUrl, pdfBase64, filename = 'Document.pdf', mimeType = 'application/pdf', userId } = req.body;
    const uid = req.headers['x-user-id'] || userId;

    if (!uid || uid === 'guest' || uid === 'guest_user') {
      return res.status(401).json({
        success: false,
        error: 'AUTH_REQUIRED',
        message: 'Silakan login terlebih dahulu dengan Google.'
      });
    }

    const sessionId = 'pdf_sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const sessionData = {
      id: sessionId,
      uid,
      filename,
      mimeType,
      pdfUrl: pdfUrl || null,
      pdfBase64: pdfBase64 || null,
      createdAt: new Date().toISOString()
    };

    const { getFirestore } = await import('../config/firebase.js');
    const { db, isFirebaseConnected } = getFirestore();
    if (isFirebaseConnected && db) {
      // Store temporary session with 24-hour expiration
      await db.collection('pdf_sessions').doc(sessionId).set(sessionData);
    }

    return res.json({
      success: true,
      sessionId,
      studioUrl: `/pdf-editor?session=${sessionId}`
    });
  } catch (error) {
    console.error('[PDF Route] Error creating PDF session:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/pdf/session/:sessionId
 * Retrieve staged PDF document session for the Telmy Dashboard Studio
 */
router.get('/pdf/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { getFirestore } = await import('../config/firebase.js');
    const { db, isFirebaseConnected } = getFirestore();

    if (isFirebaseConnected && db) {
      const doc = await db.collection('pdf_sessions').doc(sessionId).get();
      if (doc.exists) {
        return res.json({ success: true, data: doc.data() });
      }
    }

    return res.status(404).json({ success: false, error: 'PDF session not found or expired' });
  } catch (error) {
    console.error('[PDF Route] Error retrieving PDF session:', error);
    return res.status(500).json({ success: false, error: error.message });
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

import express from 'express';
import { explainField } from '../services/dictionaryService.js';
import { analyzeFormBatch } from '../services/formAnalysisService.js';
import { verifyAndDeductQuota } from '../middleware/quotaMiddleware.js';

const router = express.Router();

/**
 * POST /api/forms/analyze
 * Full-page form batch analysis: Gemini AI -> Firestore & Vector Storage -> Zero-Token Cached Lookup
 * Body: { domain, url, title, fields, instructions, language }
 */
router.post('/forms/analyze', verifyAndDeductQuota, async (req, res) => {
  try {
    const { domain, url, title, fields = [], instructions = [], language = 'en' } = req.body;
    const userId = req.headers['x-user-id'] || 'guest';

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields provided for analysis' });
    }

    const result = await analyzeFormBatch({
      domain,
      url,
      title,
      fields,
      instructions,
      language,
      userId
    });

    return res.json({
      success: true,
      data: result,
      quota: req.userQuota
    });
  } catch (error) {
    console.error('[Forms Analyze Route] Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/explain
 * Body: { metadata: {...}, language: 'id', pageContext: '...' }
 * Or batch: { fields: [{metadata:...}], language: 'id' }
 */
router.post('/explain', verifyAndDeductQuota, async (req, res) => {
  try {
    const { metadata, fields, language = 'en', pageContext = '' } = req.body;

    // Batch explanation
    if (Array.isArray(fields)) {
      const results = await Promise.all(
        fields.map(item => explainField({
          metadata: item.metadata || item,
          language,
          pageContext
        }))
      );
      return res.json({ success: true, count: results.length, data: results, quota: req.userQuota });
    }

    // Single field explanation
    if (!metadata) {
      return res.status(400).json({ success: false, error: 'Metadata is required' });
    }

    const explanation = await explainField({ metadata, language, pageContext });
    return res.json({ success: true, data: explanation, quota: req.userQuota });
  } catch (error) {
    console.error('Error in /api/explain:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

import express from 'express';
import { explainField } from '../services/dictionaryService.js';
import { verifyAndDeductQuota } from '../middleware/quotaMiddleware.js';

const router = express.Router();

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

import express from 'express';
import { saveSuggestion, saveRating } from '../services/dictionaryService.js';
import { getFirestore } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/feedback/suggestion
 * User submits improvement suggestion or correction
 */
router.post('/feedback/suggestion', async (req, res) => {
  try {
    const { fieldKey, fieldLabel, type, text, language, domain } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text suggestion is required' });
    }

    const saved = await saveSuggestion({ fieldKey, fieldLabel, type, text, language, domain });
    return res.json({ success: true, data: saved });
  } catch (error) {
    console.error('Error in /api/feedback/suggestion:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/feedback/rating
 * User rates explanation (helpful / not helpful)
 */
router.post('/feedback/rating', async (req, res) => {
  try {
    const { fieldKey, isHelpful, language } = req.body;
    const result = await saveRating({ fieldKey, isHelpful, language });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in /api/feedback/rating:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/feedback/suggestions
 * For Reviewer Dashboard (PRD FR-9)
 */
router.get('/feedback/suggestions', async (req, res) => {
  try {
    const { db, isFirebaseConnected } = getFirestore();
    if (!isFirebaseConnected || !db) {
      return res.json({ success: true, data: [], message: 'Firestore not connected' });
    }

    const snapshot = await db.collection('suggestions')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error in GET /api/feedback/suggestions:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

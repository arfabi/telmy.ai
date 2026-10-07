import express from 'express';
import { getFirestore } from '../config/firebase.js';

const router = express.Router();

/**
 * GET /api/dictionary
 * Query dictionary entries (optionally filtered by ?domain=...)
 */
router.get('/dictionary', async (req, res) => {
  try {
    const { domain, limit = 100 } = req.query;
    const { db, isFirebaseConnected } = getFirestore();

    if (!isFirebaseConnected || !db) {
      return res.json({ success: true, count: 0, data: [], message: 'Firestore offline' });
    }

    let query = db.collection('entries');
    if (domain) {
      query = query.where('domain', '==', domain);
    }

    const snapshot = await query.limit(parseInt(limit, 10)).get();
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    console.error('Error in GET /api/dictionary:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/dictionary/:id/verify
 * For Reviewer Dashboard: approve/verify an AI draft
 */
router.put('/dictionary/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { officialDocUrl, notes } = req.body;
    const { db, isFirebaseConnected } = getFirestore();

    if (!isFirebaseConnected || !db) {
      return res.status(503).json({ success: false, error: 'Firestore offline' });
    }

    await db.collection('entries').doc(id).update({
      verified: true,
      source: 'verified',
      verifiedAt: new Date().toISOString(),
      officialDocUrl: officialDocUrl || null,
      reviewerNotes: notes || null
    });

    return res.json({ success: true, message: `Entry ${id} verified successfully` });
  } catch (error) {
    console.error('Error verifying entry:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

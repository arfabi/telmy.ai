import express from 'express';
import { getFirestore, getStorage } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/user/sync
 * Sync user profile & preferences from web dashboard or extension
 */
router.post('/user/sync', async (req, res) => {
  try {
    const { uid, displayName, email, photoURL, language = 'en', preferences = {} } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, error: 'User UID is required' });
    }

    const userData = {
      uid,
      displayName: displayName || 'Telmy User',
      email: email || '',
      photoURL: photoURL || '',
      language,
      preferences,
      updatedAt: new Date().toISOString()
    };

    const { db, isFirebaseConnected } = getFirestore();
    if (isFirebaseConnected && db) {
      try {
        await db.collection('users').doc(uid).set(userData, { merge: true });
      } catch (dbErr) {
        console.warn('[User Route] Firestore sync warning:', dbErr.message);
      }
    }

    return res.json({
      success: true,
      data: userData,
      persistedInFirestore: isFirebaseConnected
    });
  } catch (error) {
    console.error('[User Route] Error syncing user:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/user/:uid
 * Retrieve user profile
 */
router.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { db, isFirebaseConnected } = getFirestore();

    if (isFirebaseConnected && db) {
      const doc = await db.collection('users').doc(uid).get();
      if (doc.exists) {
        return res.json({ success: true, data: doc.data() });
      }
    }

    return res.json({
      success: true,
      data: {
        uid,
        displayName: 'Telmy User',
        language: 'en',
        preferences: {}
      }
    });
  } catch (error) {
    console.error('[User Route] Error fetching user:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/user/avatar
 * Upload and save compressed profile avatar
 */
router.post('/user/avatar', async (req, res) => {
  try {
    const { uid, imageBase64 } = req.body;

    if (!uid || !imageBase64) {
      return res.status(400).json({ success: false, error: 'UID and imageBase64 are required' });
    }

    const { storage, isFirebaseConnected } = getStorage();
    let photoURL = imageBase64; // Default to direct base64 data URI

    if (isFirebaseConnected && storage) {
      try {
        const bucket = storage.bucket();
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const file = bucket.file(`avatars/${uid}.webp`);

        await file.save(buffer, {
          metadata: { contentType: 'image/webp' },
          public: true
        });

        photoURL = `https://storage.googleapis.com/${bucket.name}/avatars/${uid}.webp`;
      } catch (storageErr) {
        console.warn('[User Route] Firebase Storage upload error, using base64 fallback:', storageErr.message);
      }
    }

    return res.json({
      success: true,
      photoURL
    });
  } catch (error) {
    console.error('[User Route] Error saving avatar:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/user/saved-forms/:uid
 * Retrieve user's saved form drafts from Firestore
 */
router.get('/user/saved-forms/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { db, isFirebaseConnected } = getFirestore();
    const savedForms = [];

    if (isFirebaseConnected && db) {
      try {
        const snap = await db.collection('saved_forms').where('uid', '==', uid).get();
        snap.forEach(doc => savedForms.push(doc.data()));
      } catch (dbErr) {
        console.warn('[User Route] Error fetching saved forms:', dbErr.message);
      }
    }

    savedForms.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    // Fallback default sample forms if none exist
    if (savedForms.length === 0) {
      savedForms.push(
        {
          id: 'draft_apostille',
          uid,
          title: 'Apostille Legalization & Verification Portal',
          icon: '🏛️',
          category: 'Civil Registry & Certificates',
          fieldsCount: 12,
          progress: 85,
          updatedAt: new Date().toISOString()
        },
        {
          id: 'draft_evoa',
          uid,
          title: 'Electronic Visa on Arrival (e-VoA) Portal',
          icon: '✈️',
          category: 'Passport & Travel Clearance',
          fieldsCount: 8,
          progress: 100,
          updatedAt: new Date().toISOString()
        },
        {
          id: 'draft_scholarship',
          uid,
          title: 'International Scholarship Application Form',
          icon: '🎓',
          category: 'Academic Transcripts & Diplomas',
          fieldsCount: 16,
          progress: 60,
          updatedAt: new Date().toISOString()
        }
      );
    }

    return res.json({ success: true, data: savedForms });
  } catch (error) {
    console.error('[User Route] Error fetching saved forms:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/user/saved-forms/:uid
 * Save or update a form draft into Firestore
 */
router.post('/user/saved-forms/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const formDraft = req.body;
    const formId = formDraft.id || 'draft_' + Date.now().toString(36);
    const draftData = {
      ...formDraft,
      id: formId,
      uid,
      updatedAt: new Date().toISOString()
    };

    const { db, isFirebaseConnected } = getFirestore();
    if (isFirebaseConnected && db) {
      try {
        await db.collection('saved_forms').doc(formId).set(draftData, { merge: true });
      } catch (dbErr) {
        console.warn('[User Route] Error saving form draft:', dbErr.message);
      }
    }

    return res.json({ success: true, data: draftData });
  } catch (error) {
    console.error('[User Route] Error saving form draft:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

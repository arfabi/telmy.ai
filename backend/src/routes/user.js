import express from 'express';
import { getFirestore, getStorage } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/user/sync
 * Sync user profile & preferences from web dashboard or extension
 */
router.post('/user/sync', async (req, res) => {
  try {
    const { uid, displayName, email, photoURL, language = 'en', preferences = {}, credits = 5 } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, error: 'User UID is required' });
    }

    const userData = {
      uid,
      displayName: displayName || 'Telmy User',
      email: email || '',
      photoURL: photoURL || '',
      language,
      credits: Number(credits) || 5,
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
 * GET /api/user/quota/:uid
 * Retrieve user's actual credits and quota balance
 */
router.get('/user/quota/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { db, isFirebaseConnected } = getFirestore();
    let credits = 5;
    let plan = 'free';
    let quota = null;

    if (isFirebaseConnected && db) {
      const doc = await db.collection('users').doc(uid).get();
      if (doc.exists) {
        const d = doc.data();
        if (d.plan) plan = d.plan;
        if (d.quota) {
          quota = d.quota;
          credits = (quota.subscriptionQuotaRemaining || 0) + (quota.purchasedCreditsRemaining || 0) + (quota.freeRemaining || 0);
        } else if (d.credits !== undefined) {
          credits = Number(d.credits);
        }
      }
    }

    if (!quota) {
      quota = {
        freeRemaining: plan === 'free' ? credits : 0,
        purchasedCreditsRemaining: plan !== 'free' ? credits : 0,
        subscriptionQuotaRemaining: 0
      };
    }

    return res.json({
      success: true,
      data: {
        plan,
        totalRemaining: credits,
        quota
      }
    });
  } catch (err) {
    return res.json({
      success: true,
      data: { plan: 'free', totalRemaining: 5, quota: { freeRemaining: 5, purchasedCreditsRemaining: 0, subscriptionQuotaRemaining: 0 } }
    });
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
        credits: 5,
        preferences: {}
      }
    });
  } catch (error) {
    console.error('[User Route] Error fetching user:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/user/claim-academy-reward
 * Claim 10 credits valid for 30 days upon completing Telmy Academy (Single claim only)
 */
router.post('/user/claim-academy-reward', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'User UID is required' });
    }

    const { db, isFirebaseConnected } = getFirestore();
    let currentCredits = 5;
    let alreadyClaimed = false;

    if (isFirebaseConnected && db) {
      const userRef = db.collection('users').doc(uid);
      const doc = await userRef.get();
      if (doc.exists) {
        const d = doc.data();
        if (d.academyRewardClaimed) {
          alreadyClaimed = true;
        }
        if (d.credits !== undefined) {
          currentCredits = Number(d.credits);
        }
      }

      if (alreadyClaimed) {
        return res.status(400).json({
          success: false,
          error: 'Reward Telmy Academy (+10 Kredit) sudah pernah Anda klaim sebelumnya.'
        });
      }

      const updatedCredits = currentCredits + 10;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await userRef.set({
        credits: updatedCredits,
        academyRewardClaimed: true,
        academyRewardClaimedAt: new Date().toISOString(),
        academyRewardExpiresAt: expiryDate.toISOString()
      }, { merge: true });

      return res.json({
        success: true,
        message: '🎉 Selamat! 10 Form Credits berhasil diklaim ke akun Anda (berlaku 30 hari).',
        credits: updatedCredits,
        academyRewardClaimed: true,
        expiresAt: expiryDate.toISOString()
      });
    }

    // Fallback if offline / test mode
    return res.json({
      success: true,
      message: '🎉 Selamat! 10 Form Credits berhasil diklaim ke akun Anda (berlaku 30 hari).',
      credits: currentCredits + 10,
      academyRewardClaimed: true,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
    });
  } catch (error) {
    console.error('[User Route] Error claiming academy reward:', error);
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
 * POST /api/user/feedback
 * Save user feedback or field correction suggestions into Firestore
 */
router.post('/user/feedback', async (req, res) => {
  try {
    const {
      uid,
      userEmail,
      type = 'general_feedback', // 'general_feedback' | 'field_correction'
      subject = '',
      url = '',
      fieldName = '',
      message = '',
      fieldData = null
    } = req.body;

    const feedbackId = 'fb_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const feedbackDoc = {
      id: feedbackId,
      uid: uid || 'anonymous',
      userEmail: userEmail || '',
      type,
      subject: subject || (type === 'field_correction' ? `Koreksi Field: ${fieldName}` : 'Masukan Pengguna'),
      url: url || '',
      fieldName: fieldName || '',
      message: message || '',
      fieldData: fieldData || null,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    const { db, isFirebaseConnected } = getFirestore();
    if (isFirebaseConnected && db) {
      await db.collection('user_feedbacks').doc(feedbackId).set(feedbackDoc);
      console.log(`[User Route] 💬 Feedback recorded: ${feedbackId} (${type})`);
    }

    return res.json({ success: true, id: feedbackId });
  } catch (error) {
    console.error('[User Route] Error saving feedback:', error);
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

/**
 * GET /api/user/vault/:uid
 * Retrieve Zero-Knowledge Encrypted Vault Ciphertext (Server never sees plain data)
 */
router.get('/user/vault/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { db, isFirebaseConnected } = getFirestore();

    if (isFirebaseConnected && db) {
      const doc = await db.collection('user_vaults').doc(uid).get();
      if (doc.exists) {
        return res.json({ success: true, data: doc.data() });
      }
    }

    return res.json({ success: true, data: null });
  } catch (error) {
    console.error('[User Route] Error fetching encrypted vault:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/user/vault/:uid
 * Save or update Zero-Knowledge Encrypted Vault Ciphertext
 */
router.post('/user/vault/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { ciphertext, iv, salt, updatedAt } = req.body;

    if (!ciphertext || !iv || !salt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required encrypted envelope fields: ciphertext, iv, salt'
      });
    }

    const vaultPayload = {
      uid,
      ciphertext,
      iv,
      salt,
      updatedAt: updatedAt || new Date().toISOString()
    };

    const { db, isFirebaseConnected } = getFirestore();
    if (isFirebaseConnected && db) {
      await db.collection('user_vaults').doc(uid).set(vaultPayload, { merge: true });
    }

    return res.json({ success: true, data: vaultPayload });
  } catch (error) {
    console.error('[User Route] Error saving encrypted vault:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/user/vault/:uid
 * Wipe Zero-Knowledge Encrypted Vault completely
 */
router.delete('/user/vault/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { db, isFirebaseConnected } = getFirestore();

    if (isFirebaseConnected && db) {
      await db.collection('user_vaults').doc(uid).delete();
    }

    return res.json({ success: true, message: 'Vault wiped successfully' });
  } catch (error) {
    console.error('[User Route] Error wiping vault:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/user/device
 * Register or update active device/browser connection
 */
router.post('/user/device', async (req, res) => {
  try {
    const { uid, deviceId, deviceName, browser, os, ip, userAgent } = req.body;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'UID is required' });
    }

    const id = deviceId || 'dev_' + Buffer.from(userAgent || 'browser').toString('base64').substring(0, 16);
    const deviceRecord = {
      id,
      deviceId: id,
      uid,
      deviceName: deviceName || (browser ? `${browser} on ${os || 'Device'}` : 'Chrome Extension'),
      browser: browser || 'Chrome',
      os: os || 'Windows / MacOS',
      ip: ip || req.ip || '127.0.0.1',
      lastActive: new Date().toISOString(),
      isCurrent: true
    };

    const { db, isFirebaseConnected } = getFirestore();
    if (isFirebaseConnected && db) {
      try {
        await db.collection('user_devices').doc(`${uid}_${id}`).set(deviceRecord, { merge: true });
      } catch (dbErr) {
        console.warn('[User Route] Device save warning:', dbErr.message);
      }
    }

    return res.json({ success: true, data: deviceRecord });
  } catch (error) {
    console.error('[User Route] Error saving device:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/user/devices/:uid
 * Retrieve active connected devices for user
 */
router.get('/user/devices/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { db, isFirebaseConnected } = getFirestore();
    const devices = [];

    if (isFirebaseConnected && db) {
      try {
        const snap = await db.collection('user_devices').where('uid', '==', uid).get();
        snap.forEach(doc => devices.push(doc.data()));
      } catch (dbErr) {
        console.warn('[User Route] Error fetching user devices:', dbErr.message);
      }
    }

    devices.sort((a, b) => new Date(b.lastActive || 0) - new Date(a.lastActive || 0));

    return res.json({ success: true, data: devices });
  } catch (error) {
    console.error('[User Route] Error fetching devices:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

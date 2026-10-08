import { getFirestore } from '../config/firebase.js';

// In-memory fallback cache for development or when Firestore is offline
const inMemoryQuotaMap = new Map();

const DEFAULT_QUOTA = {
  plan: 'free',
  quota: {
    freeRemaining: 5,
    purchasedCreditsRemaining: 0,
    subscriptionQuotaRemaining: 0,
    subscriptionStatus: 'none', // 'none' | 'active' | 'canceled'
    subscriptionExpiresAt: null
  },
  usageStats: {
    totalFormsProcessed: 0,
    lastActiveAt: new Date().toISOString()
  }
};

/**
 * Get or initialize user quota record
 * @param {string} uid - User ID
 * @returns {Promise<object>} Quota details
 */
export async function getUserQuota(uid = 'guest_user') {
  const { db, isFirebaseConnected } = getFirestore();

  if (isFirebaseConnected && db) {
    try {
      const userRef = db.collection('users').doc(uid);
      const doc = await userRef.get();

      if (doc.exists) {
        const data = doc.data();
        if (data.quota) {
          // Check if subscription has expired
          if (data.quota.subscriptionStatus === 'active' && data.quota.subscriptionExpiresAt) {
            const expiresDate = new Date(data.quota.subscriptionExpiresAt);
            if (expiresDate < new Date()) {
              data.quota.subscriptionStatus = 'none';
              data.quota.subscriptionQuotaRemaining = 0;
              data.plan = data.quota.purchasedCreditsRemaining > 0 ? 'payg' : 'free';
              await userRef.set({ quota: data.quota, plan: data.plan }, { merge: true });
            }
          }
          return {
            uid,
            plan: data.plan || 'free',
            quota: data.quota,
            usageStats: data.usageStats || { totalFormsProcessed: 0, lastActiveAt: new Date().toISOString() }
          };
        }
      }

      // Initialize default 5 free forms for new user
      const initData = JSON.parse(JSON.stringify(DEFAULT_QUOTA));
      initData.usageStats.lastActiveAt = new Date().toISOString();
      await userRef.set(initData, { merge: true });
      return { uid, ...initData };
    } catch (err) {
      console.warn(`[QuotaService] Firestore read error for ${uid}:`, err.message);
    }
  }

  // In-memory fallback
  if (!inMemoryQuotaMap.has(uid)) {
    inMemoryQuotaMap.set(uid, JSON.parse(JSON.stringify(DEFAULT_QUOTA)));
  }
  const memoryData = inMemoryQuotaMap.get(uid);

  // Check subscription expiration in memory
  if (memoryData.quota.subscriptionStatus === 'active' && memoryData.quota.subscriptionExpiresAt) {
    if (new Date(memoryData.quota.subscriptionExpiresAt) < new Date()) {
      memoryData.quota.subscriptionStatus = 'none';
      memoryData.quota.subscriptionQuotaRemaining = 0;
      memoryData.plan = memoryData.quota.purchasedCreditsRemaining > 0 ? 'payg' : 'free';
    }
  }

  return { uid, ...memoryData };
}

/**
 * Priority 8.2: Expiring-First Quota Consumption
 * 1. Pro Subscription (expiring monthly) first
 * 2. Permanent PAYG credits second
 * 3. Initial Free Tier credits third
 * 
 * @param {string} uid - User ID
 * @returns {Promise<{allowed: boolean, quota?: object, consumedFrom?: string, reason?: string}>}
 */
export async function consumeFormQuota(uid = 'guest_user') {
  const current = await getUserQuota(uid);
  const q = current.quota;

  let consumedFrom = null;

  // 1. Priority 1: Expiring Subscription Quota
  if (q.subscriptionStatus === 'active' && q.subscriptionQuotaRemaining > 0) {
    q.subscriptionQuotaRemaining -= 1;
    consumedFrom = 'subscription';
  }
  // 2. Priority 2: Permanent PAYG Credits
  else if (q.purchasedCreditsRemaining > 0) {
    q.purchasedCreditsRemaining -= 1;
    consumedFrom = 'payg';
  }
  // 3. Priority 3: Initial Free Tier
  else if (q.freeRemaining > 0) {
    q.freeRemaining -= 1;
    consumedFrom = 'free';
  }
  // 4. Quota Exhausted
  else {
    return {
      allowed: false,
      reason: 'QUOTA_EXHAUSTED',
      uid,
      plan: current.plan,
      quota: q,
      totalRemaining: 0
    };
  }

  current.usageStats.totalFormsProcessed = (current.usageStats.totalFormsProcessed || 0) + 1;
  current.usageStats.lastActiveAt = new Date().toISOString();

  // Persist updated quota
  const { db, isFirebaseConnected } = getFirestore();
  if (isFirebaseConnected && db) {
    try {
      await db.collection('users').doc(uid).set({
        plan: current.plan,
        quota: q,
        usageStats: current.usageStats
      }, { merge: true });
    } catch (dbErr) {
      console.warn(`[QuotaService] Firestore update error for ${uid}:`, dbErr.message);
    }
  } else {
    inMemoryQuotaMap.set(uid, current);
  }

  const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);

  return {
    allowed: true,
    consumedFrom,
    uid,
    plan: current.plan,
    quota: q,
    totalRemaining
  };
}

/**
 * Add Pay-as-you-Go permanent credits ($5 for 10 forms)
 * @param {string} uid - User ID
 * @param {number} credits - Number of form credits (default: 10)
 * @returns {Promise<object>} Updated quota
 */
export async function addPaygCredits(uid = 'guest_user', credits = 10) {
  const current = await getUserQuota(uid);
  current.quota.purchasedCreditsRemaining = (current.quota.purchasedCreditsRemaining || 0) + credits;
  if (current.plan !== 'pro') {
    current.plan = 'payg';
  }

  const { db, isFirebaseConnected } = getFirestore();
  if (isFirebaseConnected && db) {
    try {
      await db.collection('users').doc(uid).set({
        plan: current.plan,
        quota: current.quota
      }, { merge: true });
    } catch (e) {
      console.warn('[QuotaService] Error saving PAYG credits to Firestore:', e.message);
    }
  } else {
    inMemoryQuotaMap.set(uid, current);
  }

  return current;
}

/**
 * Activate Pro Monthly Subscription ($14.99/mo for 50 forms)
 * @param {string} uid - User ID
 * @param {number} months - Duration in months (default: 1)
 * @returns {Promise<object>} Updated quota
 */
export async function activateProSubscription(uid = 'guest_user', months = 1) {
  const current = await getUserQuota(uid);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + (30 * months));

  current.plan = 'pro';
  current.quota.subscriptionStatus = 'active';
  current.quota.subscriptionQuotaRemaining = 50;
  current.quota.subscriptionExpiresAt = expiry.toISOString();

  const { db, isFirebaseConnected } = getFirestore();
  if (isFirebaseConnected && db) {
    try {
      await db.collection('users').doc(uid).set({
        plan: current.plan,
        quota: current.quota
      }, { merge: true });
    } catch (e) {
      console.warn('[QuotaService] Error activating Pro subscription in Firestore:', e.message);
    }
  } else {
    inMemoryQuotaMap.set(uid, current);
  }

  return current;
}

/**
 * Reset quota for testing purposes
 * @param {string} uid - User ID
 * @returns {Promise<object>}
 */
export async function resetUserQuota(uid = 'guest_user') {
  const resetData = JSON.parse(JSON.stringify(DEFAULT_QUOTA));
  resetData.usageStats.lastActiveAt = new Date().toISOString();

  const { db, isFirebaseConnected } = getFirestore();
  if (isFirebaseConnected && db) {
    try {
      await db.collection('users').doc(uid).set(resetData, { merge: true });
    } catch (e) {}
  }
  inMemoryQuotaMap.set(uid, resetData);
  return { uid, ...resetData };
}

import { getFirestore } from '../config/firebase.js';

// In-memory fallback cache for development or when Firestore is offline
const inMemoryQuotaMap = new Map();

/**
 * Returns current Year-Month string (e.g. '2026-10') for monthly quota refresh
 */
export function getCurrentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

const DEFAULT_QUOTA = {
  plan: 'free',
  quota: {
    freeRemaining: 5,
    lastFreeMonth: getCurrentYearMonth(),
    purchasedCreditsRemaining: 0,
    subscriptionQuotaRemaining: 0,
    subscriptionStatus: 'none', // 'none' | 'active' | 'canceled'
    subscriptionExpiresAt: null
  },
  activeFormSessions: [],
  usageStats: {
    totalFormsProcessed: 0,
    lastActiveAt: new Date().toISOString()
  }
};

/**
 * Get or initialize user quota record with Lazy Monthly Reset for Free Tier
 * @param {string} uid - User ID
 * @returns {Promise<object>} Quota details
 */
export async function getUserQuota(uid = 'guest_user') {
  const currentMonth = getCurrentYearMonth();
  const { db, isFirebaseConnected } = getFirestore();

  if (isFirebaseConnected && db) {
    try {
      const userRef = db.collection('users').doc(uid);
      const doc = await userRef.get();

      if (doc.exists) {
        const data = doc.data();
        if (data.quota) {
          let needsUpdate = false;

          // 1. Lazy Monthly Refresh for Free Tier (5 forms refreshed every month)
          if (!data.quota.lastFreeMonth || data.quota.lastFreeMonth !== currentMonth) {
            console.log(`[QuotaService] 🔄 Lazy monthly refresh triggered for ${uid}: ${data.quota.lastFreeMonth || 'initial'} -> ${currentMonth}`);
            data.quota.freeRemaining = 5;
            data.quota.lastFreeMonth = currentMonth;
            needsUpdate = true;
          }

          // 2. Check if active paid subscription has expired (30-day window)
          if (data.quota.subscriptionStatus === 'active' && data.quota.subscriptionExpiresAt) {
            const expiresDate = new Date(data.quota.subscriptionExpiresAt);
            if (expiresDate < new Date()) {
              console.log(`[QuotaService] ⌛ Subscription expired for ${uid}. Downgrading to free/custom.`);
              data.quota.subscriptionStatus = 'none';
              data.quota.subscriptionQuotaRemaining = 0;
              data.plan = (data.quota.purchasedCreditsRemaining || 0) > 0 ? 'custom' : 'free';
              needsUpdate = true;
            }
          }

          if (needsUpdate) {
            await userRef.set({ quota: data.quota, plan: data.plan }, { merge: true });
          }

          return {
            uid,
            plan: data.plan || 'free',
            quota: data.quota,
            activeFormSessions: data.activeFormSessions || [],
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

  // Lazy Monthly Refresh in-memory
  if (!memoryData.quota.lastFreeMonth || memoryData.quota.lastFreeMonth !== currentMonth) {
    console.log(`[QuotaService] 🔄 Lazy monthly refresh (in-memory) for ${uid}: ${memoryData.quota.lastFreeMonth || 'initial'} -> ${currentMonth}`);
    memoryData.quota.freeRemaining = 5;
    memoryData.quota.lastFreeMonth = currentMonth;
  }

  // Check subscription expiration in-memory
  if (memoryData.quota.subscriptionStatus === 'active' && memoryData.quota.subscriptionExpiresAt) {
    if (new Date(memoryData.quota.subscriptionExpiresAt) < new Date()) {
      memoryData.quota.subscriptionStatus = 'none';
      memoryData.quota.subscriptionQuotaRemaining = 0;
      memoryData.plan = (memoryData.quota.purchasedCreditsRemaining || 0) > 0 ? 'custom' : 'free';
    }
  }

  return { uid, ...memoryData };
}

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_PAGES_PER_SESSION = 20;

/**
 * Helper to extract unique session key for web form or PDF
 * @param {object} context
 * @returns {string} sessionKey
 */
function extractFormSessionKey(context = {}) {
  if (context.type === 'pdf') {
    const filename = (context.filename || 'document.pdf').toLowerCase().trim();
    return `pdf:${filename}`;
  }

  let rawUrl = context.url || context.origin || 'https://default-portal.com';
  try {
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }
    const parsed = new URL(rawUrl);
    const origin = parsed.origin.toLowerCase();
    
    // Public shared form domains (e.g. Google Forms, Tally, Typeform) -> group by form root path
    const SHARED_DOMAINS = ['forms.google.com', 'docs.google.com', 'typeform.com', 'tally.so', 'airtable.com', 'jotform.com'];
    if (SHARED_DOMAINS.some(d => parsed.hostname.includes(d))) {
      const pathSegments = parsed.pathname.split('/').filter(Boolean).slice(0, 3).join('/');
      return `web:${origin}/${pathSegments}`;
    }
    
    return `web:${origin}`;
  } catch (e) {
    return `web:${String(rawUrl).toLowerCase().substring(0, 60)}`;
  }
}

async function saveUserQuotaData(uid, current) {
  const { db, isFirebaseConnected } = getFirestore();
  if (isFirebaseConnected && db) {
    try {
      await db.collection('users').doc(uid).set({
        plan: current.plan,
        quota: current.quota,
        usageStats: current.usageStats,
        activeFormSessions: current.activeFormSessions || []
      }, { merge: true });
    } catch (dbErr) {
      console.warn(`[QuotaService] Firestore update error for ${uid}:`, dbErr.message);
    }
  } else {
    inMemoryQuotaMap.set(uid, current);
  }
}

/**
 * Form Quota Consumption Engine:
 * - 1 Form = 1 situs/portal, hingga 20 halaman/step, dalam 24 jam.
 * - 1 Form PDF = 1 file PDF.
 * - Upload ke Vault (KTP, Paspor, Ijazah) = 0 Kuota (bebas biaya, murni penyimpanan).
 * - Priority: 1. Pro Subscription -> 2. Permanent PAYG -> 3. Free Tier
 * 
 * @param {string} uid - User ID
 * @param {object} context - { type: 'web'|'pdf'|'vault', url?: string, origin?: string, path?: string, filename?: string }
 * @returns {Promise<{allowed: boolean, quota?: object, consumedFrom?: string, reason?: string, sessionInfo?: object}>}
 */
export async function consumeFormQuota(uid = 'guest_user', context = {}) {
  // 1. Vault storage exemption (KTP/Passport backup does NOT consume quota)
  if (context.type === 'vault') {
    const current = await getUserQuota(uid);
    const q = current.quota;
    const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);
    return {
      allowed: true,
      quotaExempt: true,
      reason: 'VAULT_STORAGE_EXEMPT',
      uid,
      plan: current.plan,
      quota: q,
      totalRemaining
    };
  }

  const current = await getUserQuota(uid);
  const q = current.quota;

  if (!current.activeFormSessions) {
    current.activeFormSessions = [];
  }

  const now = Date.now();
  // 2. Clean expired sessions (> 24 hours)
  current.activeFormSessions = current.activeFormSessions.filter(s => {
    return s.expiresAt && new Date(s.expiresAt).getTime() > now;
  });

  const sessionKey = extractFormSessionKey(context);
  let currentPath = context.path;
  if (!currentPath && context.url) {
    try {
      currentPath = new URL(context.url, 'https://dummy.com').pathname;
    } catch (e) {
      currentPath = '/';
    }
  }
  if (!currentPath) currentPath = '/';

  // 3. Check for existing active 24-hour session
  let existingSession = current.activeFormSessions.find(s => s.sessionKey === sessionKey);

  if (existingSession) {
    // A. For PDF: same file within 24h is exempt
    if (context.type === 'pdf') {
      const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);
      return {
        allowed: true,
        quotaExempt: true,
        isSessionContinuation: true,
        sessionId: existingSession.id,
        sessionKey,
        pageCount: existingSession.pageCount || 1,
        pagesRemaining: 0,
        consumedFrom: 'existing_pdf_session',
        uid,
        plan: current.plan,
        quota: q,
        totalRemaining
      };
    }

    // B. For Web: multi-step pages tracking (up to 20 pages within 24h)
    if (!existingSession.pagesVisited) existingSession.pagesVisited = [];
    const isNewPage = !existingSession.pagesVisited.includes(currentPath);

    if (isNewPage) {
      if ((existingSession.pageCount || existingSession.pagesVisited.length) < MAX_PAGES_PER_SESSION) {
        existingSession.pagesVisited.push(currentPath);
        existingSession.pageCount = existingSession.pagesVisited.length;
        existingSession.lastActiveAt = new Date().toISOString();

        await saveUserQuotaData(uid, current);

        const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);
        return {
          allowed: true,
          quotaExempt: true,
          isSessionContinuation: true,
          sessionId: existingSession.id,
          sessionKey,
          pageCount: existingSession.pageCount,
          pagesRemaining: Math.max(0, MAX_PAGES_PER_SESSION - existingSession.pageCount),
          consumedFrom: 'existing_web_session',
          uid,
          plan: current.plan,
          quota: q,
          totalRemaining
        };
      } else {
        // Exceeded 20 pages limit! Proceed to deduct 1 form credit for next 20 pages
        existingSession = null;
      }
    } else {
      // Re-query or multiple fields on the same page -> always exempt!
      existingSession.lastActiveAt = new Date().toISOString();
      const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);
      return {
        allowed: true,
        quotaExempt: true,
        isSessionContinuation: true,
        sessionId: existingSession.id,
        sessionKey,
        pageCount: existingSession.pageCount || 1,
        pagesRemaining: Math.max(0, MAX_PAGES_PER_SESSION - (existingSession.pageCount || 1)),
        consumedFrom: 'existing_web_session',
        uid,
        plan: current.plan,
        quota: q,
        totalRemaining
      };
    }
  }

  // 4. Consume 1 Form Credit for New Form Session
  let consumedFrom = null;

  // Priority 1: Expiring Subscription Quota
  if (q.subscriptionStatus === 'active' && q.subscriptionQuotaRemaining > 0) {
    q.subscriptionQuotaRemaining -= 1;
    consumedFrom = 'subscription';
  }
  // Priority 2: Monthly Free Tier Quota (refreshes every month)
  else if (q.freeRemaining > 0) {
    q.freeRemaining -= 1;
    consumedFrom = 'free';
  }
  // Priority 3: Permanent Purchased PAYG Credits (never expires)
  else if (q.purchasedCreditsRemaining > 0) {
    q.purchasedCreditsRemaining -= 1;
    consumedFrom = 'payg';
  }
  // Quota Exhausted
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

  // 5. Register new 24h active form session
  const newSession = {
    id: 'form_sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    sessionKey,
    type: context.type || 'web',
    startedAt: new Date().toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
    lastActiveAt: new Date().toISOString(),
    pagesVisited: [currentPath],
    pageCount: 1
  };
  current.activeFormSessions.push(newSession);

  current.usageStats.totalFormsProcessed = (current.usageStats.totalFormsProcessed || 0) + 1;
  current.usageStats.lastActiveAt = new Date().toISOString();

  // Persist updated quota & session
  await saveUserQuotaData(uid, current);

  const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);

  return {
    allowed: true,
    consumedFrom,
    isNewSession: true,
    sessionId: newSession.id,
    sessionKey,
    pageCount: 1,
    pagesRemaining: MAX_PAGES_PER_SESSION - 1,
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
  const totalCredits = (current.quota.subscriptionQuotaRemaining || 0) + (current.quota.purchasedCreditsRemaining || 0) + (current.quota.freeRemaining || 0);

  if (isFirebaseConnected && db) {
    try {
      await db.collection('users').doc(uid).set({
        plan: current.plan,
        quota: current.quota,
        credits: totalCredits
      }, { merge: true });
    } catch (e) {
      console.warn('[QuotaService] Error saving PAYG credits to Firestore:', e.message);
    }
  } else {
    current.credits = totalCredits;
    inMemoryQuotaMap.set(uid, current);
  }

  return current;
}

/**
 * Activate or Renew a Plan Subscription (Mayar Tiers: standard, pro, max)
 * @param {string} uid - User ID
 * @param {string} planId - 'standard' | 'pro' | 'max'
 * @param {number} formsGranted - Number of form credits granted (e.g. 25, 75, 200)
 * @param {number} durationDays - Duration in days (default: 30)
 * @returns {Promise<object>} Updated quota
 */
export async function activatePlanSubscription(uid = 'guest_user', planId = 'pro', formsGranted = 75, durationDays = 30) {
  const current = await getUserQuota(uid);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + durationDays);

  current.plan = planId;
  current.quota.subscriptionStatus = 'active';
  // Accumulate or set new subscription credits
  current.quota.subscriptionQuotaRemaining = formsGranted;
  current.quota.subscriptionExpiresAt = expiry.toISOString();

  const { db, isFirebaseConnected } = getFirestore();
  const totalCredits = (current.quota.subscriptionQuotaRemaining || 0) + (current.quota.purchasedCreditsRemaining || 0) + (current.quota.freeRemaining || 0);

  if (isFirebaseConnected && db) {
    try {
      await db.collection('users').doc(uid).set({
        plan: current.plan,
        quota: current.quota,
        credits: totalCredits
      }, { merge: true });
    } catch (e) {
      console.warn(`[QuotaService] Error activating ${planId} subscription in Firestore:`, e.message);
    }
  } else {
    current.credits = totalCredits;
    inMemoryQuotaMap.set(uid, current);
  }

  console.log(`[QuotaService] ✅ Plan ${planId} activated for ${uid}: +${formsGranted} forms, valid until ${expiry.toISOString()}`);
  return current;
}

/**
 * Activate Pro Monthly Subscription (backward compatibility wrapper)
 * @param {string} uid - User ID
 * @param {number} months - Duration in months (default: 1)
 * @returns {Promise<object>} Updated quota
 */
export async function activateProSubscription(uid = 'guest_user', months = 1) {
  return activatePlanSubscription(uid, 'pro', 75, 30 * months);
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

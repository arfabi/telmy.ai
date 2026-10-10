import { consumeFormQuota, getUserQuota } from '../services/quotaService.js';

/**
 * Priority 8.2: Backend Quota Verification Middleware
 * Verifies and deducts quota before processing form explanation or document analysis.
 * Returns HTTP 402 Payment Required with checkout information when quota is exhausted.
 */
export async function verifyAndDeductQuota(req, res, next) {
  try {
    // 1. Resolve User ID from headers, body, or query
    let uid = req.headers['x-user-id'] || 
              req.body?.userId || 
              req.body?.uid || 
              req.query?.userId || 
              req.query?.uid;

    if (!uid && req.headers['authorization']) {
      const authHeader = req.headers['authorization'];
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // Simple token format or mock UID
        if (token.startsWith('usr_') || token.startsWith('user_')) {
          uid = token;
        }
      }
    }

    if (!uid) {
      uid = 'guest_user';
    }

    // 2. Extract Session Context (1 Form = 1 site up to 20 pages in 24h; PDF = 1 file; Vault = 0)
    const isPdf = req.originalUrl?.includes('pdf') || req.body?.pdfBase64 || req.body?.filename;
    let context = {};

    if (isPdf) {
      context = {
        type: 'pdf',
        filename: req.body?.filename || 'document.pdf'
      };
    } else {
      const formUrl = req.body?.url || 
                      req.body?.pageUrl || 
                      req.headers['referer'] || 
                      req.headers['origin'] || 
                      req.body?.pageContext;

      context = {
        type: 'web',
        url: formUrl || 'https://unknown-form-site.com',
        path: req.body?.path
      };
    }

    // 3. Consume quota or reuse active 24h session
    const result = await consumeFormQuota(uid, context);

    if (result.allowed) {
      req.userQuota = result;
      res.setHeader('X-Quota-Remaining', result.totalRemaining);
      res.setHeader('X-Quota-Consumed-From', result.consumedFrom || 'none');
      res.setHeader('X-Quota-Exempt', result.quotaExempt ? 'true' : 'false');
      if (result.pagesRemaining !== undefined) {
        res.setHeader('X-Form-Pages-Remaining', result.pagesRemaining);
      }
      return next();
    }

    // 3. Quota exhausted -> HTTP 402 Payment Required
    console.warn(`[QuotaMiddleware] User ${uid} exhausted form analysis quota.`);
    return res.status(402).json({
      success: false,
      error: 'QUOTA_EXHAUSTED',
      message: 'Form analysis quota exhausted. Please purchase credits or upgrade to Pro.',
      uid,
      plan: result.plan,
      quota: result.quota,
      totalRemaining: 0,
      pricingTiers: {
        payg: {
          id: 'payg_10',
          name: 'Pay-as-you-Go',
          price: 5.00,
          currency: 'USD',
          forms: 10,
          rate: '$0.50 per form',
          expires: 'Never (No Expiration)',
          description: 'Best for seasonal applicants (visas, scholarships, one-off permits).'
        },
        pro: {
          id: 'pro_monthly',
          name: 'Pro Subscription',
          price: 14.99,
          currency: 'USD',
          forms: 50,
          rate: '$0.30 per form',
          period: 'month',
          refresh: 'Automatic monthly renewal',
          description: 'Best for frequent applicants, educational advisors, and legal pros.'
        }
      },
      checkoutUrl: '/dashboard#pricing'
    });
  } catch (error) {
    console.error('[QuotaMiddleware] Error in quota verification:', error);
    // In case of unexpected server error, do not block the user
    next();
  }
}

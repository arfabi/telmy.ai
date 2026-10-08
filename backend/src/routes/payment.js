import express from 'express';
import crypto from 'crypto';
import {
  getUserQuota,
  addPaygCredits,
  activateProSubscription,
  resetUserQuota
} from '../services/quotaService.js';
import { getFirestore } from '../config/firebase.js';

const router = express.Router();

// Pricing Tiers definition
const PRICING_TIERS = {
  payg_10: {
    id: 'payg_10',
    type: 'payg',
    name: 'Pay-as-you-Go',
    price: 5.00,
    currency: 'USD',
    forms: 10,
    rate: '$0.50 / form',
    expires: 'Never (Permanent)',
    description: 'Perfect for seasonal applicants (scholarships, embassy visas, civil service forms). Zero monthly commitment.',
    features: [
      '10 Interactive Form Guidance Credits',
      'Never Expires — Use anytime',
      'Universal PDF & Web Form guidance',
      'Full Pre-Submission Error Auditor',
      '1-Click Vault Smart Fill'
    ]
  },
  pro_monthly: {
    id: 'pro_monthly',
    type: 'subscription',
    name: 'Pro Subscription',
    price: 14.99,
    currency: 'USD',
    forms: 50,
    rate: '$0.30 / form',
    period: 'month',
    refresh: 'Monthly Auto-Refresh',
    description: 'Designed for active researchers, scholarship consultants, visa advisors, and frequent applicants.',
    features: [
      '50 Form Guidance Credits per month',
      'Automatic monthly renewal',
      'Priority Gemini 3.5 Flash-Lite processing',
      'Unlimited Voice WaveNet Narration',
      'Zero-Token Document Template Cache',
      'Priority Customer Support'
    ]
  }
};

/**
 * GET /api/payment/plans
 * List available pricing plans
 */
router.get('/payment/plans', (req, res) => {
  const isSimulation = process.env.LEMON_SQUEEZY_SIMULATION !== 'false' || !process.env.LEMON_SQUEEZY_API_KEY;
  return res.json({
    success: true,
    mode: isSimulation ? 'simulation' : 'live',
    provider: 'Lemon Squeezy',
    tiers: PRICING_TIERS
  });
});

/**
 * GET /api/payment/quota/:uid
 * Get current quota for a user
 */
router.get('/payment/quota/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const data = await getUserQuota(uid);
    const q = data.quota;
    const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);

    return res.json({
      success: true,
      data: {
        ...data,
        totalRemaining
      }
    });
  } catch (error) {
    console.error('[Payment] Error getting quota:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/payment/checkout
 * Create a checkout session (Simulation Mode or Lemon Squeezy Live)
 */
router.post('/payment/checkout', async (req, res) => {
  try {
    const { uid = 'guest_user', planId = 'payg_10', redirectUrl } = req.body;
    const selectedPlan = PRICING_TIERS[planId];

    if (!selectedPlan) {
      return res.status(400).json({ success: false, error: `Invalid planId: ${planId}` });
    }

    const isSimulation = process.env.LEMON_SQUEEZY_SIMULATION !== 'false' || !process.env.LEMON_SQUEEZY_API_KEY;

    if (isSimulation) {
      // Simulation mode: return simulated checkout data
      const simulationCheckoutId = 'sim_chk_' + Date.now().toString(36);
      return res.json({
        success: true,
        mode: 'simulation',
        provider: 'Lemon Squeezy (Simulated)',
        checkoutId: simulationCheckoutId,
        plan: selectedPlan,
        simulatedCheckoutUrl: `/checkout-simulate.html?checkoutId=${simulationCheckoutId}&planId=${planId}&uid=${encodeURIComponent(uid)}`,
        message: 'Simulation mode active: You can complete payment instantly via POST /api/payment/simulate-purchase.'
      });
    }

    // Live mode: call Lemon Squeezy API
    const lemonApiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env[`LEMON_SQUEEZY_VARIANT_${planId.toUpperCase()}`];

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${lemonApiKey}`
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                user_id: uid,
                plan_id: planId
              }
            }
          },
          relationships: {
            store: { data: { type: 'stores', id: storeId } },
            variant: { data: { type: 'variants', id: variantId } }
          }
        }
      })
    });

    const json = await response.json();
    if (json.data?.attributes?.url) {
      return res.json({
        success: true,
        mode: 'live',
        provider: 'Lemon Squeezy',
        checkoutUrl: json.data.attributes.url
      });
    }

    return res.status(502).json({ success: false, error: 'Failed to create Lemon Squeezy checkout', details: json });
  } catch (error) {
    console.error('[Payment] Checkout creation error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/payment/simulate-purchase
 * Instant simulation fulfillment endpoint for testing and hackathon demo
 */
router.post('/payment/simulate-purchase', async (req, res) => {
  try {
    const { uid = 'guest_user', planId = 'payg_10' } = req.body;
    const selectedPlan = PRICING_TIERS[planId];

    if (!selectedPlan) {
      return res.status(400).json({ success: false, error: `Invalid planId: ${planId}` });
    }

    let updatedData;
    if (selectedPlan.type === 'payg') {
      updatedData = await addPaygCredits(uid, selectedPlan.forms);
    } else if (selectedPlan.type === 'subscription') {
      updatedData = await activateProSubscription(uid, 1);
    }

    const q = updatedData.quota;
    const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);

    // Save invoice to Firestore
    const { db, isFirebaseConnected } = getFirestore();
    const invoiceId = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
    const invoiceRecord = {
      id: invoiceId,
      invoiceId,
      uid,
      planId,
      item: selectedPlan.name,
      amount: `$${selectedPlan.price.toFixed(2)}`,
      currency: 'USD',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      method: 'Card (Verified)',
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConnected && db) {
      try {
        await db.collection('invoices').doc(invoiceId).set(invoiceRecord);
      } catch (invErr) {
        console.warn('[Payment] Firestore invoice save error:', invErr.message);
      }
    }

    console.log(`[Payment Simulation] Successfully processed ${planId} for user ${uid}. Total forms left: ${totalRemaining}`);

    return res.json({
      success: true,
      simulated: true,
      message: `🎉 Purchase successful! Plan ${selectedPlan.name} is now active.`,
      plan: selectedPlan,
      invoice: invoiceRecord,
      user: {
        uid,
        plan: updatedData.plan,
        quota: updatedData.quota,
        totalRemaining
      }
    });
  } catch (error) {
    console.error('[Payment] Simulation purchase error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/payment/invoices/:uid
 * Retrieve all billing invoices for a user from Firestore
 */
router.get('/payment/invoices/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { db, isFirebaseConnected } = getFirestore();
    const invoices = [];

    if (isFirebaseConnected && db) {
      try {
        const snap = await db.collection('invoices').where('uid', '==', uid).get();
        snap.forEach(doc => invoices.push(doc.data()));
      } catch (dbErr) {
        console.warn('[Payment] Error fetching invoices:', dbErr.message);
      }
    }

    // Sort newest first
    invoices.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    // If empty, provide a default welcome invoice
    if (invoices.length === 0) {
      invoices.push({
        id: 'INV-2026-0712',
        invoiceId: 'INV-2026-0712',
        uid,
        item: 'Free Welcome Bonus (5 Forms)',
        date: '1 Oct 2026, 12:00',
        method: 'Platform Promotion',
        amount: '$0.00',
        status: 'PAID',
        createdAt: new Date('2026-10-01T12:00:00Z').toISOString()
      });
    }

    return res.json({ success: true, data: invoices });
  } catch (err) {
    console.error('[Payment] Invoices route error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/payment/reset-quota
 * Test helper to reset a user's quota back to 5 free forms
 */
router.post('/payment/reset-quota', async (req, res) => {
  try {
    const { uid = 'guest_user' } = req.body;
    const reset = await resetUserQuota(uid);
    return res.json({
      success: true,
      message: `Quota reset to 5 free forms for ${uid}.`,
      data: reset
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/payment/webhook
 * Official Lemon Squeezy Webhook Handler
 */
router.post('/payment/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    // Verify HMAC signature if secret is provided
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signature = Buffer.from(req.get('X-Signature') || '', 'utf8');

      if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
        return res.status(401).send('Invalid signature');
      }
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || {};
    const uid = customData.user_id || 'guest_user';
    const planId = customData.plan_id || 'payg_10';

    console.log(`[Lemon Squeezy Webhook] Received event: ${eventName} for user: ${uid}`);

    if (eventName === 'order_created') {
      // One-off PAYG order fulfilled
      await addPaygCredits(uid, 10);
    } else if (eventName === 'subscription_created' || eventName === 'subscription_payment_success') {
      // Pro subscription activated / renewed
      await activateProSubscription(uid, 1);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('[Lemon Squeezy Webhook] Processing error:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;

/**
 * Mayar.id Payment Gateway Integration Service
 * Adheres to Mayar Headless API v2 and Mayar CLI Agent Skill guidelines.
 * Uses native HTTP fetch calls with Bearer authentication.
 */

import { activatePlanSubscription } from './quotaService.js';
import { getFirestore } from '../config/firebase.js';

export function getMayarConfig() {
  const apiKey = process.env.MAYAR_API_KEY || '';
  const apiUrl = (process.env.MAYAR_API_URL || 'https://api.mayar.id').replace(/\/+$/, '');
  const isSimulation = process.env.MAYAR_SIMULATION !== 'false' || !apiKey;
  const webhookSecret = process.env.MAYAR_WEBHOOK_SECRET || '';

  return {
    apiKey,
    apiUrl,
    isSimulation,
    webhookSecret
  };
}

/**
 * Check whether Mayar is currently running in simulation mode
 */
export function isMayarSimulationMode() {
  return getMayarConfig().isSimulation;
}

/**
 * Create a Mayar Payment Link or Invoice Checkout Session
 * @param {object} params
 * @param {object} params.plan - The selected plan object from PRICING_TIERS
 * @param {string} params.uid - User ID
 * @param {string} [params.userEmail] - User email
 * @param {string} [params.userName] - User name
 * @param {string} [params.redirectUrl] - Redirect URL after payment
 * @returns {Promise<object>}
 */
export async function createMayarCheckout({ plan, uid = 'guest_user', userEmail, userName, redirectUrl }) {
  const config = getMayarConfig();

  // 1. Simulation Mode (Instant mock checkout for local dev and testing)
  if (config.isSimulation) {
    const simulationCheckoutId = 'mayar_sim_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const simulatedCheckoutUrl = `/checkout-simulate.html?checkoutId=${simulationCheckoutId}&planId=${plan.id}&uid=${encodeURIComponent(uid)}&provider=mayar`;
    
    console.log(`[MayarService] 🧪 Simulation Checkout Created: ${simulationCheckoutId} for Plan: ${plan.id} (${plan.name})`);
    return {
      success: true,
      mode: 'simulation',
      provider: 'Mayar.id (Simulated)',
      checkoutId: simulationCheckoutId,
      plan,
      checkoutUrl: simulatedCheckoutUrl,
      simulatedCheckoutUrl,
      message: 'Mode simulasi Mayar aktif. Anda dapat menyelesaikan pembayaran simulasi instan via POST /api/payment/simulate-purchase.'
    };
  }

  // 2. Live / Sandbox Mode: Call Mayar Headless API v2
  try {
    const defaultRedirect = redirectUrl || 'https://telmy-ai.cloud.run/dashboard.html';
    const payload = {
      name: `Telmy.ai ${plan.name} (1 Bulan)`,
      amount: plan.priceIdr,
      description: `Langganan Telmy.ai: ${plan.forms} Form Guidance Kuota selama 30 Hari.`,
      customer: {
        email: userEmail || `${uid}@telmy.user`,
        name: userName || 'Pelanggan Telmy'
      },
      redirectUrl: defaultRedirect,
      metadata: {
        userId: uid,
        planId: plan.id,
        formsGranted: plan.forms,
        durationDays: plan.durationDays || 30
      }
    };

    console.log(`[MayarService] 🚀 Calling Mayar API (${config.apiUrl}/hl/v2/payment-links/create) for ${plan.id}...`);

    const response = await fetch(`${config.apiUrl}/hl/v2/payment-links/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'telmy-backend/1.0.0 (Mayar v2)'
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[MayarService] ❌ Mayar API Error Response:', response.status, json);
      return {
        success: false,
        error: json.message || json.error || `Mayar API error (Status ${response.status})`,
        details: json
      };
    }

    // Extract checkout link URL from Mayar response
    const checkoutUrl = json.data?.linkUrl || json.data?.url || json.linkUrl || json.url || json.data?.paymentLink;

    if (!checkoutUrl) {
      console.warn('[MayarService] ⚠️ No checkout URL in response, returning data payload:', json);
    }

    return {
      success: true,
      mode: 'live',
      provider: 'Mayar.id',
      id: json.data?.id || json.id,
      checkoutUrl: checkoutUrl || `${config.apiUrl}/p/${json.data?.id}`,
      plan,
      data: json.data || json
    };
  } catch (error) {
    console.error('[MayarService] 💥 Exception during Mayar checkout creation:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Process a verified webhook event from Mayar
 * @param {object} event - Webhook event payload
 * @returns {Promise<object>} Result
 */
export async function handleMayarWebhookEvent(event = {}) {
  try {
    const status = (event.status || event.type || event.event || '').toLowerCase();
    const data = event.data || event;
    const metadata = data.metadata || event.metadata || {};
    
    console.log(`[Mayar Webhook] Received webhook event: "${status}" for payload ID: ${data.id || 'N/A'}`);

    // Check for payment success indicators
    const isPaid = status === 'paid' || 
                   status === 'payment.received' || 
                   status === 'payment.success' || 
                   status === 'invoice.paid' ||
                   data.status === 'paid';

    if (!isPaid) {
      console.log(`[Mayar Webhook] Event "${status}" does not require quota fulfillment.`);
      return { handled: true, action: 'ignored', status };
    }

    const uid = metadata.userId || metadata.user_id || 'guest_user';
    const planId = metadata.planId || metadata.plan_id || 'pro';
    const formsGranted = Number(metadata.formsGranted) || 75;
    const durationDays = Number(metadata.durationDays) || 30;

    // Activate the subscription in Firestore/Memory
    const updatedUser = await activatePlanSubscription(uid, planId, formsGranted, durationDays);

    // Save invoice record in Firestore
    const { db, isFirebaseConnected } = getFirestore();
    const invoiceId = 'MAYAR-' + (data.id || ('INV-' + Date.now().toString(36).toUpperCase()));
    const amountVal = data.amount || 0;
    const invoiceRecord = {
      id: invoiceId,
      invoiceId,
      uid,
      planId,
      provider: 'Mayar.id',
      item: `Telmy.ai ${planId.toUpperCase()} (${formsGranted} Forms)`,
      amount: `Rp ${amountVal.toLocaleString('id-ID')}`,
      currency: 'IDR',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      method: data.paymentChannel || data.channel || 'QRIS / Virtual Account',
      status: 'PAID',
      rawEventId: data.id || null,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConnected && db) {
      try {
        await db.collection('invoices').doc(invoiceId).set(invoiceRecord, { merge: true });
      } catch (invErr) {
        console.warn('[Mayar Webhook] Error recording invoice in Firestore:', invErr.message);
      }
    }

    console.log(`[Mayar Webhook] 🎉 Quota successfully granted for user "${uid}": +${formsGranted} forms on plan "${planId}".`);

    return {
      handled: true,
      action: 'quota_granted',
      uid,
      planId,
      formsGranted,
      invoice: invoiceRecord,
      userQuota: updatedUser.quota
    };
  } catch (err) {
    console.error('[Mayar Webhook] ❌ Error processing event:', err);
    throw err;
  }
}

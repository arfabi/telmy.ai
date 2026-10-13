import express from 'express';
import crypto from 'crypto';
import {
  getUserQuota,
  addPaygCredits,
  activateProSubscription,
  activatePlanSubscription,
  resetUserQuota
} from '../services/quotaService.js';
import {
  createMayarCheckout,
  handleMayarWebhookEvent,
  isMayarSimulationMode
} from '../services/mayarService.js';
import { getFirestore } from '../config/firebase.js';

const router = express.Router();

/**
 * 4-Tier Pricing Structure for Telmy.ai:
 * - Free: 5 forms/mo (Auto-refreshed every month via Lazy Monthly Refresh)
 * - Standard: 25 forms/mo ($3 / Rp 49.000)
 * - Pro: 75 forms/mo ($7 / Rp 99.000) [Best Value]
 * - Max: 200 forms/mo ($13 / Rp 199.000) [Under Rp 1.000/form]
 */
export const PRICING_TIERS = {
  free: {
    id: 'free',
    type: 'free',
    name: 'Free Tier',
    priceIdr: 0,
    priceUsd: 0,
    displayPrice: 'Gratis',
    currency: 'IDR',
    forms: 5,
    rate: 'Rp 0 / form',
    period: 'month',
    refresh: 'Setiap Bulan (Monthly Refresh)',
    description: 'Cocok untuk pengguna kasual yang sesekali mengisi formulir atau dokumen sederhana.',
    features: [
      '5 Form Guidance Credits per bulan',
      'Auto-refresh kuota setiap bulan baru',
      '14 Tools Aksesibilitas Lengkap (A11y Hub)',
      'Universal Web Form & PDF Explainer (Maks 3 hal)',
      '1 Profil Vault Pribadi'
    ]
  },
  standard: {
    id: 'standard',
    type: 'subscription',
    name: 'Standard',
    priceIdr: 49000,
    priceUsd: 3.00,
    displayPrice: 'Rp 49.000 (~$3)',
    currency: 'IDR',
    forms: 25,
    rate: 'Rp 1.960 / form',
    period: 'month',
    durationDays: 30,
    description: 'Pilihan hemat untuk pendaftar CPNS, paspor, visa liburan, atau formulir beasiswa reguler.',
    features: [
      '25 Form Guidance Credits per bulan',
      'Aktif 30 Hari (Mendukung QRIS & Virtual Account)',
      'Pre-Submission Error Auditor Lengkap',
      'Universal PDF Explainer hingga 15 halaman',
      'Simpan hingga 3 Profil Pintar di Vault',
      'Dukungan Suara TTS WaveNet'
    ]
  },
  pro: {
    id: 'pro',
    type: 'subscription',
    name: 'Pro',
    isPopular: true,
    priceIdr: 99000,
    priceUsd: 7.00,
    displayPrice: 'Rp 99.000 (~$7)',
    currency: 'IDR',
    forms: 75,
    rate: 'Rp 1.320 / form',
    period: 'month',
    durationDays: 30,
    description: 'Paling populer! Terbaik untuk pelamar beasiswa luar negeri, visa kerja/studi, dan apostille intensif.',
    features: [
      '75 Form Guidance Credits per bulan',
      'Prioritas Pemrosesan Gemini 3.5 Flash-Lite',
      'Unlimited Voice WaveNet Lip-Sync Mascot',
      'Universal PDF Explainer hingga 50 halaman',
      '10 Profil Multi-Anggota (Keluarga / Rekan)',
      'Pre-Submission Form Auditor Lanjutan'
    ]
  },
  max: {
    id: 'max',
    type: 'subscription',
    name: 'Max',
    priceIdr: 199000,
    priceUsd: 13.00,
    displayPrice: 'Rp 199.000 (~$13)',
    currency: 'IDR',
    forms: 200,
    rate: 'Rp 995 / form',
    period: 'month',
    durationDays: 30,
    description: 'Paket maksimal dengan biaya di bawah Rp 1.000/form. Untuk konsultan visa, agensi, dan power users.',
    features: [
      '200 Form Guidance Credits per bulan (Rp 995/form)',
      'Prioritas Tertinggi AI Gemini 3.5 Flash-Lite + Vision',
      'Multi-Vault Client Profiles Tanpa Batas',
      'Universal PDF Explainer Dokumen Tanpa Batas',
      'Export Laporan Form Pre-Submission Audit',
      'Dukungan Prioritas Dedicated VIP'
    ]
  }
};

// Aliases for backward compatibility with legacy client scripts
PRICING_TIERS.payg_10 = PRICING_TIERS.standard;
PRICING_TIERS.pro_monthly = PRICING_TIERS.pro;

/**
 * GET /api/payment/plans
 * List available pricing plans and payment provider info
 */
router.get('/payment/plans', (req, res) => {
  const isSimulation = isMayarSimulationMode();
  return res.json({
    success: true,
    mode: isSimulation ? 'simulation' : 'live',
    provider: 'Mayar.id',
    currency: 'IDR',
    tiers: PRICING_TIERS
  });
});

/**
 * GET /api/payment/quota/:uid
 * Get current quota for a user (includes automatic Lazy Monthly Refresh)
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
 * Create a checkout session (Simulation Mode or Mayar.id Live/Sandbox)
 */
router.post('/payment/checkout', async (req, res) => {
  try {
    const { uid = 'guest_user', planId = 'pro', email, name, redirectUrl } = req.body;
    const selectedPlan = PRICING_TIERS[planId] || PRICING_TIERS.pro;

    if (!selectedPlan || selectedPlan.id === 'free') {
      return res.status(400).json({
        success: false,
        error: `Paket tidak valid atau paket gratis tidak memerlukan checkout: ${planId}`
      });
    }

    const checkoutResult = await createMayarCheckout({
      plan: selectedPlan,
      uid,
      userEmail: email,
      userName: name,
      redirectUrl
    });

    return res.status(checkoutResult.success ? 200 : 502).json(checkoutResult);
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
    const { uid = 'guest_user', planId = 'pro' } = req.body;
    const selectedPlan = PRICING_TIERS[planId] || PRICING_TIERS.pro;

    if (!selectedPlan || selectedPlan.id === 'free') {
      return res.status(400).json({
        success: false,
        error: `Paket ${planId} tidak memerlukan aktivasi pembelian berbayar.`
      });
    }

    // Activate the chosen plan subscription (standard: 25, pro: 75, max: 200)
    const updatedData = await activatePlanSubscription(
      uid,
      selectedPlan.id,
      selectedPlan.forms,
      selectedPlan.durationDays || 30
    );

    const q = updatedData.quota;
    const totalRemaining = (q.subscriptionQuotaRemaining || 0) + (q.purchasedCreditsRemaining || 0) + (q.freeRemaining || 0);

    // Save billing invoice to Firestore
    const { db, isFirebaseConnected } = getFirestore();
    const invoiceId = 'MAYAR-SIM-' + Math.floor(1000 + Math.random() * 9000);
    const invoiceRecord = {
      id: invoiceId,
      invoiceId,
      uid,
      planId: selectedPlan.id,
      provider: 'Mayar.id (Simulated)',
      item: `Telmy.ai ${selectedPlan.name} (${selectedPlan.forms} Forms)`,
      amount: `Rp ${selectedPlan.priceIdr.toLocaleString('id-ID')} (~$${selectedPlan.priceUsd})`,
      currency: 'IDR',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      method: 'QRIS / Virtual Account (Simulated)',
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

    console.log(`[Payment Simulation] Successfully processed ${selectedPlan.id} for user ${uid}. Total forms remaining: ${totalRemaining}`);

    return res.json({
      success: true,
      simulated: true,
      message: `🎉 Pembayaran berhasil! Paket ${selectedPlan.name} (${selectedPlan.forms} Form) kini aktif selama 30 hari.`,
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
        const snap = await db.collection('invoices')
          .where('uid', '==', uid)
          .get();

        snap.forEach(doc => invoices.push(doc.data()));
        invoices.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      } catch (e) {
        console.warn(`[Payment] Firestore query error for invoices of ${uid}:`, e.message);
      }
    }

    return res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('[Payment] Error fetching invoices:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/payment/reset-quota
 * Reset quota for testing purposes
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
 * POST /api/payment/mayar-webhook
 * Official Mayar.id Webhook Handler
 */
router.post('/payment/mayar-webhook', async (req, res) => {
  try {
    const result = await handleMayarWebhookEvent(req.body);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('[Mayar Webhook] Processing error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/payment/webhook
 * Legacy webhook compatibility endpoint
 */
router.post('/payment/webhook', async (req, res) => {
  try {
    // If incoming payload has Mayar signature or Mayar format, route to Mayar handler
    if (req.body?.event?.startsWith?.('mayar') || req.body?.data?.linkUrl || req.body?.paymentChannel) {
      const result = await handleMayarWebhookEvent(req.body);
      return res.json({ success: true, ...result });
    }

    return res.json({ received: true, message: 'Legacy webhook acknowledged' });
  } catch (err) {
    console.error('[Legacy Webhook] Processing error:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;

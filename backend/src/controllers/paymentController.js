import Stripe from 'stripe';
import db from '../models/db.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/responseHandler.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { template_id, amount, currency = 'idr' } = req.body;
  const userId = req.user.id;

  // Validate template
  const [template] = await db.promise().query(
    'SELECT id, name, price, is_premium FROM templates WHERE id = ?',
    [template_id]
  );

  if (template.length === 0) {
    return errorResponse(res, 'Template tidak ditemukan', 404);
  }

  const templateData = template[0];

  if (!templateData.is_premium) {
    return errorResponse(res, 'Template ini gratis', 400);
  }

  // Validate amount
  if (amount !== templateData.price) {
    return errorResponse(res, 'Jumlah pembayaran tidak sesuai', 400);
  }

  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency,
      metadata: {
        user_id: userId.toString(),
        template_id: template_id.toString(),
        template_name: templateData.name
      }
    });

    // Save payment record
    await db.promise().query(
      `INSERT INTO payments (user_id, template_id, stripe_payment_intent_id, amount, currency, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [userId, template_id, paymentIntent.id, amount, currency]
    );

    return successResponse(res, {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });

  } catch (error) {
    console.error('Stripe error:', error);
    return errorResponse(res, 'Gagal membuat payment intent', 500);
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = asyncHandler(async (req, res) => {
  const { payment_intent_id } = req.body;
  const userId = req.user.id;

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === 'succeeded') {
      // Update payment record
      await db.promise().query(
        `UPDATE payments 
         SET status = 'completed', completed_at = NOW() 
         WHERE stripe_payment_intent_id = ? AND user_id = ?`,
        [payment_intent_id, userId]
      );

      // Grant access to premium template
      const [payment] = await db.promise().query(
        'SELECT template_id FROM payments WHERE stripe_payment_intent_id = ?',
        [payment_intent_id]
      );

      if (payment.length > 0) {
        await db.promise().query(
          `INSERT INTO user_template_access (user_id, template_id, access_type, granted_at)
           VALUES (?, ?, 'premium', NOW())
           ON DUPLICATE KEY UPDATE granted_at = NOW()`,
          [userId, payment[0].template_id]
        );
      }

      return successResponse(res, { status: 'completed' }, 'Pembayaran berhasil');
    } else {
      return errorResponse(res, 'Pembayaran belum selesai', 400);
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return errorResponse(res, 'Gagal konfirmasi pembayaran', 500);
  }
});

// @desc    Get user payments
// @route   GET /api/payments/mine
// @access  Private
export const getUserPayments = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [payments] = await db.promise().query(
    `SELECT 
      p.*,
      t.name as template_name,
      t.category as template_category
     FROM payments p
     JOIN templates t ON p.template_id = t.id
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC`,
    [userId]
  );

  return successResponse(res, payments);
});

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update payment status
      await db.promise().query(
        `UPDATE payments 
         SET status = 'completed', completed_at = NOW() 
         WHERE stripe_payment_intent_id = ?`,
        [paymentIntent.id]
      );

      // Grant template access
      const userId = paymentIntent.metadata.user_id;
      const templateId = paymentIntent.metadata.template_id;

      if (userId && templateId) {
        await db.promise().query(
          `INSERT INTO user_template_access (user_id, template_id, access_type, granted_at)
           VALUES (?, ?, 'premium', NOW())
           ON DUPLICATE KEY UPDATE granted_at = NOW()`,
          [userId, templateId]
        );
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      await db.promise().query(
        `UPDATE payments 
         SET status = 'failed' 
         WHERE stripe_payment_intent_id = ?`,
        [failedPayment.id]
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Get payment analytics (Admin)
// @route   GET /api/payments/analytics
// @access  Private (Admin)
export const getPaymentAnalytics = asyncHandler(async (req, res) => {
  // Total revenue
  const [revenue] = await db.promise().query(
    `SELECT 
      COALESCE(SUM(amount), 0) as total_revenue,
      COUNT(*) as total_payments,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_payments
     FROM payments`
  );

  // Monthly revenue
  const [monthlyRevenue] = await db.promise().query(
    `SELECT 
      DATE_FORMAT(created_at, '%Y-%m') as month,
      SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as revenue,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as payments
     FROM payments
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
     GROUP BY DATE_FORMAT(created_at, '%Y-%m')
     ORDER BY month DESC`
  );

  // Top selling templates
  const [topTemplates] = await db.promise().query(
    `SELECT 
      t.name,
      t.category,
      COUNT(p.id) as sales,
      SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as revenue
     FROM templates t
     LEFT JOIN payments p ON t.id = p.template_id
     WHERE t.is_premium = 1
     GROUP BY t.id
     ORDER BY sales DESC
     LIMIT 10`
  );

  const analytics = {
    overview: revenue[0],
    monthly_revenue: monthlyRevenue,
    top_templates: topTemplates
  };

  return successResponse(res, analytics);
});
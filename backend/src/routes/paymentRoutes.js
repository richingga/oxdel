import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getUserPayments,
  stripeWebhook,
  getPaymentAnalytics
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Webhook route (must be before express.json middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// User payment routes
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/mine', protect, getUserPayments);

// Admin routes
router.get('/analytics', protect, adminMiddleware, getPaymentAnalytics);

export default router;
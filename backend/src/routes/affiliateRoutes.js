import express from 'express';
import {
  applyAffiliate,
  getAffiliateDashboard,
  getAllAffiliates,
  updateAffiliateStatus,
  generateAffiliateLink
} from '../controllers/affiliateController.js';
import { protect } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { validateId } from '../middleware/validation.js';

const router = express.Router();

// Affiliate routes
router.post('/apply', protect, applyAffiliate);
router.get('/dashboard', protect, getAffiliateDashboard);
router.get('/link', protect, generateAffiliateLink);

// Admin routes
router.get('/', protect, adminMiddleware, getAllAffiliates);
router.put('/:id/status', protect, adminMiddleware, validateId, updateAffiliateStatus);

export default router;
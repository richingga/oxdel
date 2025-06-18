import express from 'express';
import {
  createPage,
  getMyPages,
  getPageById,
  updatePage,
  deletePage,
  getPublicPage,
  renderPublicPage,
  getPageAnalytics
} from '../controllers/pageController.js';

import { protect } from '../middleware/authMiddleware.js';
import { validatePage, validateId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public/:slug', getPublicPage);
router.get('/render/:slug', renderPublicPage);

// Protected routes
router.get('/mine', protect, validatePagination, getMyPages);
router.post('/', protect, validatePage, createPage);
router.get('/:id', protect, validateId, getPageById);
router.put('/:id', protect, validateId, updatePage);
router.delete('/:id', protect, validateId, deletePage);
router.get('/:id/analytics', protect, validateId, getPageAnalytics);

export default router;
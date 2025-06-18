import express from 'express';
import {
  getTemplates,
  getTemplateById,
  getTemplateForBuilder,
  getTemplatePreview,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateCategories,
  getTemplateTypes
} from '../controllers/templateController.js';

import { protect } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { validateTemplate, validateId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', validatePagination, getTemplates);
router.get('/categories', getTemplateCategories);
router.get('/types', getTemplateTypes);
router.get('/:id', validateId, getTemplateById);
router.get('/:id/preview', validateId, getTemplatePreview);

// Protected routes - untuk builder
router.get('/:id/builder', protect, validateId, getTemplateForBuilder);

// Admin only routes
router.post('/', protect, adminMiddleware, validateTemplate, createTemplate);
router.put('/:id', protect, adminMiddleware, validateId, validateTemplate, updateTemplate);
router.delete('/:id', protect, adminMiddleware, validateId, deleteTemplate);

export default router;
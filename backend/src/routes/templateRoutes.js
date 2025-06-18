import express from 'express';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '../controllers/templateController.js';

import { protect } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Semua user bisa lihat daftar template
router.get('/', getTemplates);

// Semua user bisa lihat detail satu template
router.get('/:id', getTemplateById);

// Admin tambah template baru
router.post('/', protect, adminMiddleware, createTemplate);

// Admin edit template
router.put('/:id', protect, adminMiddleware, updateTemplate);

// Admin hapus template
router.delete('/:id', protect, adminMiddleware, deleteTemplate);

export default router;

import express from 'express';
import {
  createPage,
  getMyPages,
  getPageById,
  updatePage
} from '../controllers/pageController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mendapatkan daftar semua page milik user login
router.get('/mine', protect, getMyPages);

// Buat page/undangan baru (user login)
router.post('/', protect, createPage);

// Ambil detail satu page (user login)
router.get('/:id', protect, getPageById);

// Update page/undangan milik user
router.put('/:id', protect, updatePage);

export default router;

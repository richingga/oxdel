import express from 'express';
import { getMyPages, createPage } from '../controllers/pageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Melindungi semua rute di file ini

router.route('/')
    .post(createPage); // POST /api/pages

router.route('/mine')
    .get(getMyPages); // GET /api/pages/mine

export default router;
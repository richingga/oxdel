import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rute ini akan dilindungi oleh middleware 'protect'
// Hanya user dengan token valid yang bisa mengaksesnya
router.get('/profile', protect, getUserProfile);

export default router;


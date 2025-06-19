import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { validateId } from '../middleware/validation.js';

const router = express.Router();

// User profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin only routes
router.get('/', protect, adminMiddleware, getAllUsers);
router.get('/stats', protect, adminMiddleware, getUserStats);
router.put('/:id/role', protect, adminMiddleware, validateId, updateUserRole);
router.delete('/:id', protect, adminMiddleware, validateId, deleteUser);

export default router;
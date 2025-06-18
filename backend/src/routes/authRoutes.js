import express from 'express';
import { register, login, forgotPassword, resetPassword, verifyOtp, checkResetToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/check-reset-token/:resettoken', checkResetToken);
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

export default router;
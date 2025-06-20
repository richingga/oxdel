import express from 'express';
import {
  uploadImage,
  uploadImages,
  deleteImage,
  getUserImages,
  upload
} from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload routes
router.post('/image', protect, upload.single('image'), uploadImage);
router.post('/images', protect, upload.array('images', 10), uploadImages);
router.delete('/image/:publicId', protect, deleteImage);
router.get('/my-images', protect, getUserImages);

export default router;
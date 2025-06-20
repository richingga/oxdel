import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/responseHandler.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diizinkan'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'Tidak ada file yang diupload', 400);
  }

  try {
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'oxdel',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    return successResponse(res, {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    }, 'Gambar berhasil diupload');

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return errorResponse(res, 'Gagal upload gambar', 500);
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return errorResponse(res, 'Tidak ada file yang diupload', 400);
  }

  try {
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'oxdel',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              size: result.bytes
            });
          }
        ).end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    return successResponse(res, results, 'Gambar berhasil diupload');

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return errorResponse(res, 'Gagal upload gambar', 500);
  }
});

// @desc    Delete image
// @route   DELETE /api/upload/image/:publicId
// @access  Private
export const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return successResponse(res, null, 'Gambar berhasil dihapus');
    } else {
      return errorResponse(res, 'Gambar tidak ditemukan', 404);
    }

  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return errorResponse(res, 'Gagal hapus gambar', 500);
  }
});

// @desc    Get user uploaded images
// @route   GET /api/upload/my-images
// @access  Private
export const getUserImages = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Get images from Cloudinary with user tag
    const result = await cloudinary.search
      .expression(`folder:oxdel AND tags:user_${userId}`)
      .sort_by([['created_at', 'desc']])
      .max_results(50)
      .execute();

    const images = result.resources.map(resource => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      size: resource.bytes,
      created_at: resource.created_at
    }));

    return successResponse(res, images);

  } catch (error) {
    console.error('Cloudinary search error:', error);
    return errorResponse(res, 'Gagal mengambil gambar', 500);
  }
});
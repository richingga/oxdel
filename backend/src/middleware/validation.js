import { body, param, query, validationResult } from 'express-validator';

// Middleware untuk menangani hasil validasi
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validasi untuk registrasi user
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username harus 3-30 karakter')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username hanya boleh huruf, angka, dan underscore'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email tidak valid'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password minimal 8 karakter')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
    .withMessage('Password harus mengandung huruf, angka, dan simbol'),
  
  handleValidationErrors
];

// Validasi untuk login
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email tidak valid'),
  
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi'),
  
  handleValidationErrors
];

// Validasi untuk template
export const validateTemplate = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nama template harus 3-100 karakter'),
  
  body('type')
    .isIn(['undangan', 'jasa', 'portofolio', 'bisnis'])
    .withMessage('Tipe template tidak valid'),
  
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Kategori harus 2-50 karakter'),
  
  body('code')
    .notEmpty()
    .withMessage('Kode template wajib diisi'),
  
  body('slots')
    .notEmpty()
    .withMessage('Slots template wajib diisi'),
  
  body('is_premium')
    .isBoolean()
    .withMessage('is_premium harus boolean'),
  
  body('price')
    .isNumeric()
    .withMessage('Harga harus berupa angka'),
  
  handleValidationErrors
];

// Validasi untuk page/undangan
export const validatePage = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Judul harus 3-200 karakter'),
  
  body('template_id')
    .isInt({ min: 1 })
    .withMessage('Template ID tidak valid'),
  
  body('content')
    .optional()
    .isJSON()
    .withMessage('Content harus berupa JSON valid'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status tidak valid'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'private', 'password'])
    .withMessage('Visibility tidak valid'),
  
  handleValidationErrors
];

// Validasi untuk parameter ID
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID tidak valid'),
  
  handleValidationErrors
];

// Validasi untuk query pagination
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page harus berupa angka positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus 1-100'),
  
  handleValidationErrors
];
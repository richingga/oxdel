import rateLimit from 'express-rate-limit';

// Rate limiter untuk API umum
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 500, // maksimal 500 request per 15 menit
  message: {
    success: false,
    message: 'Terlalu banyak request, coba lagi dalam 15 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter untuk auth endpoints (lebih ketat)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 50, // maksimal 5 percobaan login per 15 menit
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login, coba lagi dalam 15 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter untuk registrasi
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 3, // maksimal 3 registrasi per jam per IP
  message: {
    success: false,
    message: 'Terlalu banyak registrasi, coba lagi dalam 1 jam'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter untuk email (OTP, reset password)
export const emailLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 3, // maksimal 3 email per 5 menit
  message: {
    success: false,
    message: 'Terlalu banyak permintaan email, coba lagi dalam 5 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
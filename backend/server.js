import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './src/models/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import templateRoutes from './src/routes/templateRoutes.js';

// Import middleware
import { generalLimiter, authLimiter } from './src/middleware/rateLimiter.js';
import { securityHeaders, xssProtection, corsOptions } from './src/middleware/security.js';
import { globalErrorHandler } from './src/utils/responseHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(xssProtection);

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/templates', templateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Info
app.get('/api', (req, res) => {
  res.json({ 
    message: "Selamat datang di Oxdel API!",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users", 
      pages: "/api/pages",
      templates: "/api/templates"
    }
  });
});

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
    timestamp: new Date().toISOString()
  });
});

// Database connection and server start
db.promise().query("SELECT 1")
    .then(() => {
        console.log('✅ Koneksi ke database MySQL berhasil.');
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
            console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
        });
    })
    .catch((err) => {
        console.error('❌ Gagal terhubung ke database:', err.sqlMessage || err.message);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
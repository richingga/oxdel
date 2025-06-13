import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './src/models/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import templateRoutes from './src/routes/templateRoutes.js'; // <-- Impor rute baru

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/templates', templateRoutes);

app.get('/api', (req, res) => {
  res.json({ message: "Selamat datang di Oxdel API!" });
});

db.promise().query("SELECT 1")
    .then(() => {
        console.log('✅ Koneksi ke database MySQL berhasil.');
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Gagal terhubung ke database:', err.sqlMessage || err.message);
        process.exit(1);
    });



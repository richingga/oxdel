import jwt from 'jsonwebtoken';
import db from '../models/db.js';

export const protect = async (req, res, next) => {
    let token;

    // Cek jika header authorization ada dan diawali dengan 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari header (setelah 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token menggunakan kunci rahasia
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Ambil data user dari DB berdasarkan ID di dalam token, lalu pasang ke request
            // Kita tidak mengambil password untuk keamanan
            const [users] = await db.promise().query(
                'SELECT id, username, email, role, created_at FROM users WHERE id = ?', 
                [decoded.id]
            );
            
            if (!users[0]) {
                 return res.status(401).json({ message: 'Tidak diizinkan, token gagal' });
            }

            req.user = users[0]; // Pasang data user ke objek request
            next(); // Lanjutkan ke controller selanjutnya

        } catch (error) {
            console.error('Error di middleware protect:', error);
            return res.status(401).json({ message: 'Tidak diizinkan, token gagal' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Tidak diizinkan, tidak ada token' });
    }
};

import db from '../models/db.js';
import slugify from 'slugify'; // Kita akan butuh library ini, install nanti

// @desc    Create a new page
// @route   POST /api/pages
// @access  Private
export const createPage = async (req, res) => {
    const { title, template_id } = req.body;

    if (!title || !template_id) {
        return res.status(400).json({ message: 'Judul dan template wajib diisi.' });
    }

    // Buat slug yang unik secara otomatis dari judul
    let slug = slugify(title, { lower: true, strict: true });
    
    try {
        // Cek apakah slug sudah ada, jika ya, tambahkan angka acak
        const [existingSlug] = await db.promise().query('SELECT id FROM pages WHERE slug = ?', [slug]);
        if (existingSlug.length > 0) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        // Konten default dalam format JSON
        const defaultContent = JSON.stringify({
            heading: 'Judul Halaman Anda',
            subheading: 'Tulis deskripsi singkat di sini.',
            // ...properti lain bisa ditambahkan sesuai struktur template
        });

        const [result] = await db.promise().query(
            'INSERT INTO pages (user_id, template_id, title, slug, content, status) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, template_id, title, slug, defaultContent, 'draft']
        );

        res.status(201).json({ message: 'Halaman berhasil dibuat!', pageId: result.insertId });

    } catch (error) {
        console.error('Error creating page:', error);
        res.status(500).json({ message: 'Gagal membuat halaman.' });
    }
};

// @desc    Get pages created by the logged-in user
// @route   GET /api/pages/mine
// @access  Private
export const getMyPages = async (req, res) => {
    try {
        // req.user.id didapat dari middleware 'protect' yang sudah kita buat
        const [pages] = await db.promise().query(
            // Kita juga mengambil tipe template untuk informasi di frontend
            'SELECT p.id, p.title, p.slug, p.status, p.created_at, t.type as template_type FROM pages p JOIN templates t ON p.template_id = t.id WHERE p.user_id = ? ORDER BY p.created_at DESC',
            [req.user.id]
        );
        res.json(pages);
    } catch (error) {
        console.error('Error fetching user pages:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Fungsi lain (create, update, delete page) akan kita tambahkan di sini nanti.

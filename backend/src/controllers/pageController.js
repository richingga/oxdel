import db from '../models/db.js';
import slugify from 'slugify';

// Membuat halaman baru (user builder undangan)
export const createPage = async (req, res) => {
    const { title, template_id, content, status = 'draft', visibility = 'public' } = req.body;

    if (!title || !template_id) {
        return res.status(400).json({ message: 'Judul dan template wajib diisi.' });
    }

    // Buat slug unik otomatis dari judul
    let slug = slugify(title, { lower: true, strict: true });

    try {
        // Pastikan slug unik
        const [existingSlug] = await db.promise().query('SELECT id FROM pages WHERE slug = ?', [slug]);
        if (existingSlug.length > 0) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        // Jika frontend mengirim data slot builder, gunakan; jika tidak, pakai defaultContent
        const contentToSave = content ? JSON.stringify(content) : JSON.stringify({
            heading: 'Judul Halaman Anda',
            subheading: 'Tulis deskripsi singkat di sini.'
        });

        const [result] = await db.promise().query(
            'INSERT INTO pages (user_id, template_id, title, slug, content, status, visibility) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, template_id, title, slug, contentToSave, status, visibility]
        );

        res.status(201).json({ message: 'Halaman berhasil dibuat!', pageId: result.insertId });

    } catch (error) {
        console.error('Error creating page:', error);
        res.status(500).json({ message: 'Gagal membuat halaman.' });
    }
};

// Mendapatkan daftar page milik user login
export const getMyPages = async (req, res) => {
    try {
        const [pages] = await db.promise().query(
            'SELECT p.id, p.title, p.slug, p.status, p.created_at, t.type as template_type FROM pages p JOIN templates t ON p.template_id = t.id WHERE p.user_id = ? ORDER BY p.created_at DESC',
            [req.user.id]
        );
        res.json(pages);
    } catch (error) {
        console.error('Error fetching user pages:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Mendapatkan detail 1 page
export const getPageById = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM pages WHERE id = ?', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ message: "Halaman tidak ditemukan" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update konten page/undangan user
export const updatePage = async (req, res) => {
    try {
        const { title, content, status, visibility } = req.body;
        await db.promise().query(
            "UPDATE pages SET title=?, content=?, status=?, visibility=?, updated_at=NOW() WHERE id=? AND user_id=?",
            [title, JSON.stringify(content), status, visibility, req.params.id, req.user.id]
        );
        res.json({ message: "Halaman undangan berhasil diupdate" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

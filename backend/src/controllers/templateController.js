import db from '../models/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/responseHandler.js';

// GET semua template dengan pagination dan filter
export const getTemplates = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const type = req.query.type;
    const search = req.query.search;

    let whereClause = '';
    let queryParams = [];

    // Build WHERE clause
    const conditions = [];
    
    if (category) {
        conditions.push('category = ?');
        queryParams.push(category);
    }
    
    if (type) {
        conditions.push('type = ?');
        queryParams.push(type);
    }
    
    if (search) {
        conditions.push('(name LIKE ? OR category LIKE ? OR type LIKE ?)');
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Get total count
    const [countResult] = await db.promise().query(
        `SELECT COUNT(*) as total FROM templates ${whereClause}`,
        queryParams
    );
    const total = countResult[0].total;

    // Get templates with pagination
    const [templates] = await db.promise().query(
        `SELECT * FROM templates ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
    );

    return paginatedResponse(res, templates, { page, limit, total });
});

// GET detail satu template
export const getTemplateById = asyncHandler(async (req, res) => {
    const [rows] = await db.promise().query(
        "SELECT * FROM templates WHERE id = ?", 
        [req.params.id]
    );
    
    if (rows.length === 0) {
        return errorResponse(res, "Template tidak ditemukan", 404);
    }
    
    return successResponse(res, rows[0]);
});

// GET template dengan slot parsing untuk builder
export const getTemplateForBuilder = asyncHandler(async (req, res) => {
    const [rows] = await db.promise().query(
        "SELECT * FROM templates WHERE id = ?", 
        [req.params.id]
    );
    
    if (rows.length === 0) {
        return errorResponse(res, "Template tidak ditemukan", 404);
    }

    const template = rows[0];
    
    // Parse slots menjadi array
    const slots = template.slots ? template.slots.split(',').map(slot => ({
        key: slot.trim(),
        label: slot.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: inferSlotType(slot.trim()),
        required: true,
        placeholder: generatePlaceholder(slot.trim())
    })) : [];

    const builderData = {
        ...template,
        parsedSlots: slots,
        previewUrl: `/api/templates/${template.id}/preview`
    };
    
    return successResponse(res, builderData);
});

// Helper function untuk menentukan tipe input berdasarkan nama slot
const inferSlotType = (slotName) => {
    const name = slotName.toLowerCase();
    
    if (name.includes('email')) return 'email';
    if (name.includes('phone') || name.includes('telp') || name.includes('hp')) return 'tel';
    if (name.includes('date') || name.includes('tanggal')) return 'date';
    if (name.includes('time') || name.includes('waktu')) return 'time';
    if (name.includes('url') || name.includes('link') || name.includes('website')) return 'url';
    if (name.includes('number') || name.includes('angka') || name.includes('harga')) return 'number';
    if (name.includes('description') || name.includes('deskripsi') || name.includes('alamat')) return 'textarea';
    if (name.includes('foto') || name.includes('gambar') || name.includes('image')) return 'file';
    
    return 'text';
};

// Helper function untuk generate placeholder
const generatePlaceholder = (slotName) => {
    const name = slotName.toLowerCase();
    
    if (name.includes('nama')) return 'Masukkan nama lengkap';
    if (name.includes('email')) return 'contoh@email.com';
    if (name.includes('phone') || name.includes('telp')) return '08123456789';
    if (name.includes('alamat')) return 'Jl. Contoh No. 123, Jakarta';
    if (name.includes('tanggal') || name.includes('date')) return 'Pilih tanggal';
    if (name.includes('waktu') || name.includes('time')) return 'Pilih waktu';
    if (name.includes('harga') || name.includes('price')) return '100000';
    
    return `Masukkan ${slotName.toLowerCase()}`;
};

// GET preview template dengan data dummy
export const getTemplatePreview = asyncHandler(async (req, res) => {
    const [rows] = await db.promise().query(
        "SELECT * FROM templates WHERE id = ?", 
        [req.params.id]
    );
    
    if (rows.length === 0) {
        return errorResponse(res, "Template tidak ditemukan", 404);
    }

    const template = rows[0];
    let htmlContent = template.code;

    // Generate dummy data untuk preview
    if (template.slots) {
        const slots = template.slots.split(',');
        slots.forEach(slot => {
            const slotKey = slot.trim();
            const dummyValue = generateDummyData(slotKey);
            
            // Replace placeholder dengan dummy data
            const regex = new RegExp(`{${slotKey}}`, 'gi');
            htmlContent = htmlContent.replace(regex, dummyValue);
        });
    }

    // Wrap dalam HTML lengkap untuk preview
    const fullHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview: ${template.name}</title>
        <style>
            body { margin: 0; padding: 20px; font-family: 'Inter', sans-serif; }
            .preview-header { 
                background: #f8fafc; 
                padding: 10px 20px; 
                border-radius: 8px; 
                margin-bottom: 20px;
                text-align: center;
                border: 2px dashed #e2e8f0;
            }
            .preview-header h3 { margin: 0; color: #64748b; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="preview-header">
            <h3>🎨 Preview Template: ${template.name}</h3>
        </div>
        ${htmlContent}
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(fullHtml);
});

// Helper untuk generate dummy data
const generateDummyData = (slotKey) => {
    const key = slotKey.toLowerCase();
    
    const dummyData = {
        nama: 'John Doe',
        nama_lengkap: 'John Doe Smith',
        email: 'john@example.com',
        phone: '08123456789',
        telp: '08123456789',
        hp: '08123456789',
        alamat: 'Jl. Sudirman No. 123, Jakarta',
        tanggal: '25 Desember 2024',
        waktu: '19:00 WIB',
        tempat: 'Hotel Grand Indonesia',
        deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        harga: 'Rp 500.000',
        judul: 'Judul Contoh',
        subjudul: 'Subjudul yang menarik',
        foto: 'https://placehold.co/400x300/3b82f6/ffffff?text=Foto',
        gambar: 'https://placehold.co/400x300/3b82f6/ffffff?text=Gambar',
        logo: 'https://placehold.co/200x100/3b82f6/ffffff?text=Logo',
        website: 'https://example.com',
        instagram: '@johndoe',
        facebook: 'John Doe',
        whatsapp: '08123456789'
    };

    // Cari key yang cocok
    for (const [dummyKey, value] of Object.entries(dummyData)) {
        if (key.includes(dummyKey)) {
            return value;
        }
    }

    // Default dummy data
    return 'Contoh Data';
};

// POST: admin tambah template baru
export const createTemplate = asyncHandler(async (req, res) => {
    const { name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price } = req.body;
    
    const [result] = await db.promise().query(
        "INSERT INTO templates (name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, type, category, preview_url, thumbnail_url, code, slots, is_premium || 0, price || 0]
    );
    
    return successResponse(res, { id: result.insertId }, "Template berhasil dibuat", 201);
});

// PUT: admin edit template
export const updateTemplate = asyncHandler(async (req, res) => {
    const { name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price } = req.body;
    
    const [result] = await db.promise().query(
        "UPDATE templates SET name=?, type=?, category=?, preview_url=?, thumbnail_url=?, code=?, slots=?, is_premium=?, price=?, updated_at=NOW() WHERE id=?",
        [name, type, category, preview_url, thumbnail_url, code, slots, is_premium || 0, price || 0, req.params.id]
    );
    
    if (result.affectedRows === 0) {
        return errorResponse(res, "Template tidak ditemukan", 404);
    }
    
    return successResponse(res, null, "Template berhasil diupdate");
});

// DELETE: admin hapus template
export const deleteTemplate = asyncHandler(async (req, res) => {
    // Check if template is being used
    const [pages] = await db.promise().query(
        "SELECT COUNT(*) as count FROM pages WHERE template_id = ?",
        [req.params.id]
    );
    
    if (pages[0].count > 0) {
        return errorResponse(res, "Template tidak dapat dihapus karena sedang digunakan", 400);
    }
    
    const [result] = await db.promise().query(
        "DELETE FROM templates WHERE id = ?", 
        [req.params.id]
    );
    
    if (result.affectedRows === 0) {
        return errorResponse(res, "Template tidak ditemukan", 404);
    }
    
    return successResponse(res, null, "Template berhasil dihapus");
});

// GET categories untuk filter
export const getTemplateCategories = asyncHandler(async (req, res) => {
    const [rows] = await db.promise().query(
        "SELECT DISTINCT category FROM templates WHERE category IS NOT NULL ORDER BY category"
    );
    
    const categories = rows.map(row => row.category);
    return successResponse(res, categories);
});

// GET template types untuk filter
export const getTemplateTypes = asyncHandler(async (req, res) => {
    const [rows] = await db.promise().query(
        "SELECT DISTINCT type FROM templates WHERE type IS NOT NULL ORDER BY type"
    );
    
    const types = rows.map(row => row.type);
    return successResponse(res, types);
});
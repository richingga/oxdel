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
    if (name.includes('phone') || name.includes('telp') || name.includes('hp') || name.includes('whatsapp')) return 'tel';
    if (name.includes('date') || name.includes('tanggal')) return 'date';
    if (name.includes('time') || name.includes('waktu')) return 'time';
    if (name.includes('url') || name.includes('link') || name.includes('website')) return 'url';
    if (name.includes('number') || name.includes('angka') || name.includes('harga') || name.includes('price')) return 'number';
    if (name.includes('description') || name.includes('deskripsi') || name.includes('alamat') || name.includes('address')) return 'textarea';
    if (name.includes('foto') || name.includes('gambar') || name.includes('image') || name.includes('logo') || name.includes('banner')) return 'file';
    if (name.includes('color') || name.includes('warna')) return 'color';
    
    return 'text';
};

// Helper function untuk generate placeholder
const generatePlaceholder = (slotName) => {
    const name = slotName.toLowerCase();
    
    if (name.includes('nama') || name.includes('name')) return 'Masukkan nama lengkap';
    if (name.includes('email')) return 'contoh@email.com';
    if (name.includes('phone') || name.includes('telp') || name.includes('hp')) return '08123456789';
    if (name.includes('whatsapp')) return '628123456789';
    if (name.includes('alamat') || name.includes('address')) return 'Jl. Contoh No. 123, Jakarta';
    if (name.includes('tanggal') || name.includes('date')) return 'Pilih tanggal';
    if (name.includes('waktu') || name.includes('time')) return 'Pilih waktu';
    if (name.includes('harga') || name.includes('price')) return '100000';
    if (name.includes('foto') || name.includes('gambar') || name.includes('image')) return 'Upload gambar';
    if (name.includes('color') || name.includes('warna')) return '#3B82F6';
    if (name.includes('deskripsi') || name.includes('description')) return 'Masukkan deskripsi lengkap';
    
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
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
            .preview-header { 
                background: #f8fafc; 
                padding: 10px 20px; 
                border-radius: 8px; 
                margin-bottom: 20px;
                text-align: center;
                border: 2px dashed #e2e8f0;
            }
            .preview-header h3 { margin: 0; color: #64748b; font-size: 14px; }
            
            /* Animasi */
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeInLeft {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes fadeInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
            .animate-fade-in-left { animation: fadeInLeft 0.8s ease-out; }
            .animate-fade-in-right { animation: fadeInRight 0.8s ease-out; }
            .animate-pulse-hover:hover { animation: pulse 0.3s ease-in-out; }
            
            /* Floating WhatsApp */
            .floating-wa {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                animation: pulse 2s infinite;
            }
            
            /* Smooth scroll */
            html { scroll-behavior: smooth; }
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
        nama_perusahaan: 'Sedot WC Anugrah',
        nama_owner: 'Budi Santoso',
        email: 'info@sedotwcanugrah.com',
        phone: '08123456789',
        telp: '08123456789',
        hp: '08123456789',
        whatsapp: '628123456789',
        alamat: 'Jl. Raya Jakarta No. 123, Jakarta Selatan',
        deskripsi_perusahaan: 'Jasa sedot WC profesional dengan pengalaman 10+ tahun. Melayani area Jakarta, Bogor, Depok, Tangerang, Bekasi.',
        layanan_1: 'Sedot WC Rumah',
        layanan_2: 'Sedot WC Kantor',
        layanan_3: 'Sedot WC Apartemen',
        harga_mulai: 'Rp 150.000',
        jam_operasional: '24 Jam',
        pengalaman: '10+ Tahun',
        area_layanan: 'Jabodetabek',
        foto_header: '/ChatGPT Image Jun 19, 2025, 01_41_18 PM.png',
        foto_layanan_1: '/ChatGPT Image Jun 19, 2025, 01_36_20 PM.png',
        foto_layanan_2: '/ChatGPT Image Jun 19, 2025, 01_29_24 PM.png',
        foto_tim: '/ChatGPT Image Jun 19, 2025, 01_25_24 PM.png',
        foto_kendaraan: '/ChatGPT Image Jun 19, 2025, 01_20_09 PM.png',
        warna_primary: '#059669',
        warna_secondary: '#0891b2',
        facebook: 'SedotWCAnugrah',
        instagram: '@sedotwcanugrah',
        website: 'https://sedotwcanugrah.com'
    };

    // Cari key yang cocok
    for (const [dummyKey, value] of Object.entries(dummyData)) {
        if (key.includes(dummyKey.replace(/_/g, '')) || dummyKey.includes(key.replace(/_/g, ''))) {
            return value;
        }
    }

    // Default dummy data berdasarkan tipe
    if (key.includes('foto') || key.includes('gambar') || key.includes('image')) {
        return '/ChatGPT Image Jun 19, 2025, 01_41_18 PM.png';
    }
    if (key.includes('warna') || key.includes('color')) {
        return '#059669';
    }
    if (key.includes('harga') || key.includes('price')) {
        return 'Rp 150.000';
    }
    if (key.includes('phone') || key.includes('telp') || key.includes('hp')) {
        return '08123456789';
    }
    if (key.includes('whatsapp')) {
        return '628123456789';
    }

    // Default
    return 'Contoh Data';
};

// POST: admin tambah template baru
export const createTemplate = asyncHandler(async (req, res) => {
    const { name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price, description, featured } = req.body;
    
    const [result] = await db.promise().query(
        "INSERT INTO templates (name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price, description, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, type, category, preview_url, thumbnail_url, code, slots, is_premium || 0, price || 0, description || '', featured || 0]
    );
    
    return successResponse(res, { id: result.insertId }, "Template berhasil dibuat", 201);
});

// PUT: admin edit template
export const updateTemplate = asyncHandler(async (req, res) => {
    const { name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price, description, featured } = req.body;
    
    const [result] = await db.promise().query(
        "UPDATE templates SET name=?, type=?, category=?, preview_url=?, thumbnail_url=?, code=?, slots=?, is_premium=?, price=?, description=?, featured=?, updated_at=NOW() WHERE id=?",
        [name, type, category, preview_url, thumbnail_url, code, slots, is_premium || 0, price || 0, description || '', featured || 0, req.params.id]
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
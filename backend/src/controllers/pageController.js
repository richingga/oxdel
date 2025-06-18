import db from '../models/db.js';
import slugify from 'slugify';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/responseHandler.js';

// Membuat halaman baru (user builder undangan)
export const createPage = asyncHandler(async (req, res) => {
    const { title, template_id, content, status = 'draft', visibility = 'public' } = req.body;

    // Validasi template exists
    const [templateCheck] = await db.promise().query(
        'SELECT id, name, slots FROM templates WHERE id = ?', 
        [template_id]
    );
    
    if (templateCheck.length === 0) {
        return errorResponse(res, 'Template tidak ditemukan', 404);
    }

    // Buat slug unik otomatis dari judul
    let slug = slugify(title, { lower: true, strict: true });

    // Pastikan slug unik
    const [existingSlug] = await db.promise().query(
        'SELECT id FROM pages WHERE slug = ?', 
        [slug]
    );
    
    if (existingSlug.length > 0) {
        slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    // Jika frontend mengirim data slot builder, gunakan; jika tidak, pakai defaultContent
    const contentToSave = content ? JSON.stringify(content) : JSON.stringify({
        heading: title,
        subheading: 'Tulis deskripsi singkat di sini.',
        template_id: template_id
    });

    const [result] = await db.promise().query(
        'INSERT INTO pages (user_id, template_id, title, slug, content, status, visibility) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, template_id, title, slug, contentToSave, status, visibility]
    );

    const pageData = {
        id: result.insertId,
        title,
        slug,
        template_id,
        status,
        visibility,
        preview_url: `/preview/${slug}`,
        edit_url: `/builder/${result.insertId}`
    };

    return successResponse(res, pageData, 'Halaman berhasil dibuat!', 201);
});

// Mendapatkan daftar page milik user login dengan pagination
export const getMyPages = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    let whereClause = 'WHERE p.user_id = ?';
    let queryParams = [req.user.id];

    // Add filters
    if (status) {
        whereClause += ' AND p.status = ?';
        queryParams.push(status);
    }

    if (search) {
        whereClause += ' AND (p.title LIKE ? OR p.slug LIKE ?)';
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await db.promise().query(
        `SELECT COUNT(*) as total FROM pages p ${whereClause}`,
        queryParams
    );
    const total = countResult[0].total;

    // Get pages with template info
    const [pages] = await db.promise().query(
        `SELECT 
            p.id, p.title, p.slug, p.status, p.visibility, p.created_at, p.updated_at,
            t.name as template_name, t.type as template_type, t.category as template_category,
            (SELECT COUNT(*) FROM page_views pv WHERE pv.page_id = p.id) as view_count
        FROM pages p 
        JOIN templates t ON p.template_id = t.id 
        ${whereClause}
        ORDER BY p.updated_at DESC 
        LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
    );

    // Add URLs to each page
    const pagesWithUrls = pages.map(page => ({
        ...page,
        preview_url: `/preview/${page.slug}`,
        edit_url: `/builder/${page.id}`,
        public_url: page.status === 'published' ? `/${page.slug}` : null
    }));

    return paginatedResponse(res, pagesWithUrls, { page, limit, total });
});

// Mendapatkan detail 1 page untuk editing
export const getPageById = asyncHandler(async (req, res) => {
    const [rows] = await db.promise().query(
        `SELECT p.*, t.name as template_name, t.code as template_code, t.slots as template_slots
         FROM pages p 
         JOIN templates t ON p.template_id = t.id 
         WHERE p.id = ? AND p.user_id = ?`, 
        [req.params.id, req.user.id]
    );
    
    if (!rows[0]) {
        return errorResponse(res, "Halaman tidak ditemukan", 404);
    }

    const page = rows[0];
    
    // Parse content JSON
    try {
        page.content = JSON.parse(page.content);
    } catch (e) {
        page.content = {};
    }

    // Parse template slots
    page.template_slots = page.template_slots ? page.template_slots.split(',').map(s => s.trim()) : [];

    return successResponse(res, page);
});

// Update konten page/undangan user
export const updatePage = asyncHandler(async (req, res) => {
    const { title, content, status, visibility } = req.body;
    
    // Validate page ownership
    const [pageCheck] = await db.promise().query(
        "SELECT id FROM pages WHERE id = ? AND user_id = ?",
        [req.params.id, req.user.id]
    );
    
    if (pageCheck.length === 0) {
        return errorResponse(res, "Halaman tidak ditemukan atau tidak memiliki akses", 404);
    }

    // Update slug if title changed
    let updateFields = [];
    let updateValues = [];

    if (title) {
        const slug = slugify(title, { lower: true, strict: true });
        updateFields.push('title = ?', 'slug = ?');
        updateValues.push(title, slug);
    }

    if (content) {
        updateFields.push('content = ?');
        updateValues.push(JSON.stringify(content));
    }

    if (status) {
        updateFields.push('status = ?');
        updateValues.push(status);
    }

    if (visibility) {
        updateFields.push('visibility = ?');
        updateValues.push(visibility);
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(req.params.id);

    await db.promise().query(
        `UPDATE pages SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
    );

    return successResponse(res, null, "Halaman berhasil diupdate");
});

// Delete page
export const deletePage = asyncHandler(async (req, res) => {
    const [result] = await db.promise().query(
        "DELETE FROM pages WHERE id = ? AND user_id = ?",
        [req.params.id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
        return errorResponse(res, "Halaman tidak ditemukan atau tidak memiliki akses", 404);
    }
    
    return successResponse(res, null, "Halaman berhasil dihapus");
});

// Get public page by slug (untuk visitor)
export const getPublicPage = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    
    const [rows] = await db.promise().query(
        `SELECT p.*, t.code as template_code, t.name as template_name,
                u.username as author_username
         FROM pages p 
         JOIN templates t ON p.template_id = t.id 
         JOIN users u ON p.user_id = u.id
         WHERE p.slug = ? AND p.status = 'published' AND p.visibility = 'public'`, 
        [slug]
    );
    
    if (!rows[0]) {
        return errorResponse(res, "Halaman tidak ditemukan", 404);
    }

    const page = rows[0];
    
    // Parse content
    try {
        page.content = JSON.parse(page.content);
    } catch (e) {
        page.content = {};
    }

    // Record page view (optional - untuk analytics)
    const clientIp = req.ip || req.connection.remoteAddress;
    await db.promise().query(
        'INSERT INTO page_views (page_id, ip_address, user_agent, visited_at) VALUES (?, ?, ?, NOW())',
        [page.id, clientIp, req.get('User-Agent') || '']
    ).catch(() => {}); // Ignore errors untuk views

    return successResponse(res, page);
});

// Render public page as HTML
export const renderPublicPage = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    
    const [rows] = await db.promise().query(
        `SELECT p.*, t.code as template_code, t.name as template_name
         FROM pages p 
         JOIN templates t ON p.template_id = t.id 
         WHERE p.slug = ? AND p.status = 'published' AND p.visibility = 'public'`, 
        [slug]
    );
    
    if (!rows[0]) {
        return res.status(404).send(`
            <html>
                <head><title>Halaman Tidak Ditemukan</title></head>
                <body style="font-family: Arial; text-align: center; padding: 50px;">
                    <h1>404 - Halaman Tidak Ditemukan</h1>
                    <p>Halaman yang Anda cari tidak ditemukan atau sudah tidak aktif.</p>
                    <a href="/">Kembali ke Beranda</a>
                </body>
            </html>
        `);
    }

    const page = rows[0];
    let htmlContent = page.template_code;
    
    // Parse content dan replace placeholders
    try {
        const content = JSON.parse(page.content);
        
        // Replace semua placeholder dengan data aktual
        for (const [key, value] of Object.entries(content)) {
            const regex = new RegExp(`{${key}}`, 'gi');
            htmlContent = htmlContent.replace(regex, value || '');
        }
    } catch (e) {
        console.error('Error parsing page content:', e);
    }

    // Record page view
    const clientIp = req.ip || req.connection.remoteAddress;
    await db.promise().query(
        'INSERT INTO page_views (page_id, ip_address, user_agent, visited_at) VALUES (?, ?, ?, NOW())',
        [page.id, clientIp, req.get('User-Agent') || '']
    ).catch(() => {});

    // Wrap dalam HTML lengkap
    const fullHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${page.title}</title>
        <meta name="description" content="${page.title} - Dibuat dengan Oxdel">
        <meta property="og:title" content="${page.title}">
        <meta property="og:description" content="${page.title} - Dibuat dengan Oxdel">
        <meta property="og:type" content="website">
        <style>
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
            .oxdel-watermark { 
                position: fixed; 
                bottom: 10px; 
                right: 10px; 
                background: rgba(0,0,0,0.7); 
                color: white; 
                padding: 5px 10px; 
                border-radius: 15px; 
                font-size: 12px; 
                z-index: 9999;
                text-decoration: none;
            }
            .oxdel-watermark:hover { background: rgba(0,0,0,0.9); }
        </style>
    </head>
    <body>
        ${htmlContent}
        <a href="https://oxdel.id" class="oxdel-watermark" target="_blank">
            Dibuat dengan ❤️ Oxdel
        </a>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(fullHtml);
});

// Get page analytics
export const getPageAnalytics = asyncHandler(async (req, res) => {
    const pageId = req.params.id;
    
    // Verify ownership
    const [pageCheck] = await db.promise().query(
        "SELECT id FROM pages WHERE id = ? AND user_id = ?",
        [pageId, req.user.id]
    );
    
    if (pageCheck.length === 0) {
        return errorResponse(res, "Halaman tidak ditemukan", 404);
    }

    // Get analytics data
    const [totalViews] = await db.promise().query(
        'SELECT COUNT(*) as total FROM page_views WHERE page_id = ?',
        [pageId]
    );

    const [uniqueViews] = await db.promise().query(
        'SELECT COUNT(DISTINCT ip_address) as unique_views FROM page_views WHERE page_id = ?',
        [pageId]
    );

    const [dailyViews] = await db.promise().query(
        `SELECT DATE(visited_at) as date, COUNT(*) as views 
         FROM page_views 
         WHERE page_id = ? AND visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         GROUP BY DATE(visited_at) 
         ORDER BY date DESC`,
        [pageId]
    );

    const analytics = {
        total_views: totalViews[0].total,
        unique_views: uniqueViews[0].unique_views,
        daily_views: dailyViews
    };

    return successResponse(res, analytics);
});
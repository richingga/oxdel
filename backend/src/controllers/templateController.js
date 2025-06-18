import db from '../models/db.js';

// GET semua template (user & admin)
export const getTemplates = async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM templates");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET detail satu template (untuk detail/admin)
export const getTemplateById = async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM templates WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: admin tambah template baru
export const createTemplate = async (req, res) => {
    try {
        const { name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price } = req.body;
        await db.promise().query(
            "INSERT INTO templates (name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price]
        );
        res.status(201).json({ message: "Template created" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT: admin edit template
export const updateTemplate = async (req, res) => {
    try {
        const { name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price } = req.body;
        await db.promise().query(
            "UPDATE templates SET name=?, type=?, category=?, preview_url=?, thumbnail_url=?, code=?, slots=?, is_premium=?, price=? WHERE id=?",
            [name, type, category, preview_url, thumbnail_url, code, slots, is_premium, price, req.params.id]
        );
        res.json({ message: "Template updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE: admin hapus template
export const deleteTemplate = async (req, res) => {
    try {
        await db.promise().query("DELETE FROM templates WHERE id = ?", [req.params.id]);
        res.json({ message: "Template deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

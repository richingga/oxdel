import db from '../models/db.js';

// @desc    Fetch all templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res) => {
    try {
        const [templates] = await db.promise().query("SELECT id, name, type FROM templates WHERE type = 'undangan' OR type = 'jasa'");
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
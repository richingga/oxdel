import express from 'express';
import { getTemplates } from '../controllers/templateController.js';

const router = express.Router();

// Rute ini bisa diakses publik untuk menampilkan katalog
router.get('/', getTemplates);

export default router;

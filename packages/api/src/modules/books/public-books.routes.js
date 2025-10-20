import express from 'express';
import * as booksController from './books.controller.js';

const router = express.Router();

// Routes publiques pour les templates
router.get('/templates', booksController.getBookTemplatesHandler);

export default router;


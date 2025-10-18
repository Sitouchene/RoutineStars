import express from 'express';
import * as booksController from './books.controller.js';

const router = express.Router();

// Google Books Integration (avant les routes avec :id pour éviter les conflits)
router.get('/search/google', booksController.searchGoogleBooksHandler);
router.post('/import/google/:googleBookId', booksController.importGoogleBookHandler);

// CRUD Routes
router.get('/', booksController.getBooksHandler);
router.get('/:id', booksController.getBookByIdHandler);
router.post('/', booksController.createBookHandler);
router.put('/:id', booksController.updateBookHandler);
router.delete('/:id', booksController.deleteBookHandler);

export default router;


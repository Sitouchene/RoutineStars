import * as booksService from './books.service.js';

/**
 * GET /api/books
 * Liste des livres
 */
export async function getBooksHandler(req, res) {
  try {
    const { groupId } = req.user;
    const filters = {
      language: req.query.language,
      search: req.query.search
    };
    
    const books = await booksService.getBooks(groupId, filters);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/books/:id
 * Détails d'un livre
 */
export async function getBookByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const book = await booksService.getBookById(id);
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(404).json({ error: error.message });
  }
}

/**
 * POST /api/books
 * Créer un livre manuellement
 */
export async function createBookHandler(req, res) {
  try {
    const { groupId } = req.user;
    const bookData = {
      ...req.body,
      groupId: req.body.groupId || groupId
    };
    
    const book = await booksService.createBook(bookData);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * PUT /api/books/:id
 * Modifier un livre
 */
export async function updateBookHandler(req, res) {
  try {
    const { id } = req.params;
    const book = await booksService.updateBook(id, req.body);
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * DELETE /api/books/:id
 * Supprimer un livre
 */
export async function deleteBookHandler(req, res) {
  try {
    const { id } = req.params;
    await booksService.deleteBook(id);
    res.status(200).json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * GET /api/books/templates
 * Récupérer les templates de livres
 */
export async function getBookTemplatesHandler(req, res) {
  try {
    const { language } = req.query;
    const templates = await booksService.getBookTemplates(language);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching book templates:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/books/search/google
 * Rechercher sur Google Books
 */
export async function searchGoogleBooksHandler(req, res) {
  try {
    const { q, langRestrict } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Paramètre de recherche requis' });
    }
    
    const results = await booksService.searchGoogleBooks(q, langRestrict || 'fr');
    res.json(results);
  } catch (error) {
    console.error('Error searching Google Books:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /api/books/import/google/:googleBookId
 * Importer depuis Google Books
 */
export async function importGoogleBookHandler(req, res) {
  try {
    const { googleBookId } = req.params;
    const { groupId } = req.body;
    
    const book = await booksService.importFromGoogleBooks(googleBookId, groupId);
    res.status(201).json(book);
  } catch (error) {
    console.error('Error importing from Google Books:', error);
    res.status(400).json({ error: error.message });
  }
}


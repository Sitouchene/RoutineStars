/**
 * Mapper les catégories Google Books vers nos genres standardisés
 */
function mapGoogleCategoriesToGenres(categories = []) {
  const genreMapping = {
    'Fantasy': 'Fantasy',
    'Juvenile Fiction': 'Jeunesse',
    'Children\'s Fiction': 'Jeunesse',
    'Young Adult Fiction': 'Jeunesse',
    'History': 'Histoire',
    'Historical Fiction': 'Histoire',
    'Science': 'Science',
    'Science Fiction': 'Science',
    'Technology': 'Science',
    'Comics & Graphic Novels': 'Comics',
    'Graphic Novels': 'Comics',
    'Education': 'Education',
    'Educational': 'Education',
    'Textbooks': 'Education'
  };

  const mappedGenres = [];
  categories.forEach(category => {
    const mappedGenre = genreMapping[category];
    if (mappedGenre && !mappedGenres.includes(mappedGenre)) {
      mappedGenres.push(mappedGenre);
    }
  });

  return mappedGenres;
}

import prisma from '../../config/database.js';

/**
 * Fonction helper pour déduplication automatique
 */
async function createOrGetBook(data) {
  if (data.googleBookId) {
    const existing = await prisma.book.findFirst({ 
      where: { googleBookId: data.googleBookId } 
    });
    if (existing) {
      return existing;
    }
    return await prisma.book.create({
      data: { 
        ...data, 
        groupId: data.groupId || null 
      },
      include: {
        group: true,
      }
    });
  }
  return await prisma.book.create({ 
    data,
    include: {
      group: true,
    }
  });
}

/**
 * Créer un livre dans le catalogue
 */
export async function createBook(data) {
  return await createOrGetBook(data);
}

/**
 * Récupérer les templates de livres
 */
export async function getBookTemplates(language = null) {
  const where = {};
  
  if (language) {
    where.language = language;
  }
  
  return await prisma.bookTemplate.findMany({
    where,
    orderBy: { title: 'asc' }
  });
}

/**
 * Obtenir la liste des livres avec filtres
 */
export async function getBooks(groupId, filters = {}) {
  const where = {};
  
  // Livres du groupe + catalogue global
  if (groupId) {
    where.OR = [
      { groupId: groupId },
      { groupId: null }
    ];
  }
  
  // Filtres additionnels
  if (filters.language) {
    where.language = filters.language;
  }
  
  if (filters.search) {
    where.OR = [
      ...(where.OR || []),
      { title: { contains: filters.search, mode: 'insensitive' } },
      { author: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  
  return await prisma.book.findMany({
    where,
    include: {
      group: true,
      _count: {
        select: {
          readingAssignments: true,
          reviews: true,
          likes: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  }).then(async (books) => {
    if (books.length === 0) return [];
    const bookIds = books.map(b => b.id);
    // Agrégats des notes
    const ratingAgg = await prisma.bookReview.groupBy({
      by: ['bookId'],
      _avg: { rating: true },
      where: { bookId: { in: bookIds } }
    });
    const avgByBookId = new Map(ratingAgg.map(r => [r.bookId, r._avg.rating || 0]));

    // Agrégats des likes
    const likeAgg = await prisma.bookLike.groupBy({
      by: ['bookId'],
      _count: { _all: true },
      where: { bookId: { in: bookIds } }
    });
    const likesByBookId = new Map(likeAgg.map(l => [l.bookId, l._count._all]));

    return books.map(b => ({
      ...b,
      averageRating: Number((avgByBookId.get(b.id) || 0).toFixed(1)),
      totalLikes: likesByBookId.get(b.id) || 0,
    }));
  });
}

/**
 * Obtenir un livre par ID
 */
export async function getBookById(bookId) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      group: true,
      reviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      likes: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      _count: {
        select: {
          readingAssignments: true
        }
      }
    }
  });
  
  if (!book) {
    throw new Error('Livre non trouvé');
  }
  
  return book;
}

/**
 * Rechercher des livres sur Google Books API
 */
export async function searchGoogleBooks(query, langRestrict = 'fr') {
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.append('q', query);
  url.searchParams.append('langRestrict', langRestrict);
  url.searchParams.append('maxResults', '20');
  url.searchParams.append('printType', 'books');
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche Google Books');
  }
  
  const data = await response.json();
  
  // Mapper les résultats au format attendu
  return (data.items || []).map(item => {
    const volumeInfo = item.volumeInfo;
    const isbn13 = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13');
    const isbn10 = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10');
    
    return {
      googleBookId: item.id,
      title: volumeInfo.title,
      author: volumeInfo.authors?.join(', ') || 'Auteur inconnu',
      totalPages: volumeInfo.pageCount || 0,
      isbn: isbn13?.identifier || isbn10?.identifier || null,
      coverImageUrl: volumeInfo.imageLinks?.thumbnail || null,
      language: volumeInfo.language || 'fr',
      description: volumeInfo.description || null,
      publishedDate: volumeInfo.publishedDate || null,
      categories: volumeInfo.categories || [],
      genres: mapGoogleCategoriesToGenres(volumeInfo.categories)
    };
  });
}

/**
 * Importer un livre depuis Google Books
 */
export async function importFromGoogleBooks(googleBookId, groupId = null) {
  // Récupérer les détails du livre depuis Google Books
  const url = `https://www.googleapis.com/books/v1/volumes/${googleBookId}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Livre non trouvé sur Google Books');
  }
  
  const data = await response.json();
  const volumeInfo = data.volumeInfo;
  
  const isbn13 = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13');
  const isbn10 = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10');
  
  // Créer le livre (déduplication automatique dans createBook)
  return await createBook({
    googleBookId: googleBookId,
    title: volumeInfo.title,
    author: volumeInfo.authors?.join(', ') || 'Auteur inconnu',
    totalPages: volumeInfo.pageCount || 0,
    isbn: isbn13?.identifier || isbn10?.identifier || null,
    coverImageUrl: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || null,
    language: volumeInfo.language || 'fr',
    genres: mapGoogleCategoriesToGenres(volumeInfo.categories),
    groupId: groupId
  });
}

/**
 * Mettre à jour un livre
 */
export async function updateBook(bookId, data) {
  return await prisma.book.update({
    where: { id: bookId },
    data: {
      title: data.title,
      author: data.author,
      totalPages: data.totalPages,
      isbn: data.isbn,
      coverImageUrl: data.coverImageUrl,
      language: data.language
    },
    include: {
      group: true
    }
  });
}

/**
 * Supprimer un livre
 */
export async function deleteBook(bookId) {
  return await prisma.book.delete({
    where: { id: bookId }
  });
}


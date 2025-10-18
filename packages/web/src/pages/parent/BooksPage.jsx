import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BookOpen, Plus, Search, Globe, Trash2, Edit2, Star, UserPlus, Library } from 'lucide-react';
import GoogleBooksImportModal from '../../components/parent/GoogleBooksImportModal';
import AddBookManualModal from '../../components/parent/AddBookManualModal';
import BookReviewsModal from '../../components/parent/BookReviewsModal';
import AssignBookModal from '../../components/parent/AssignBookModal';
import BookLibraryModal from '../../components/parent/BookLibraryModal';
import { booksApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';

export default function BooksPage() {
  const { t } = useTranslation();
  const { getAuthHeader } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [selectedBookForReviews, setSelectedBookForReviews] = useState(null);
  const [selectedBookForAssignment, setSelectedBookForAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  // Charger les livres
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books', languageFilter, searchQuery],
    queryFn: () => booksApi.getAll(getAuthHeader(), {
      language: languageFilter,
      search: searchQuery
    }),
  });

  // Mutation pour supprimer un livre
  const deleteMutation = useMutation({
    mutationFn: (bookId) => booksApi.delete(bookId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      alert('Erreur lors de la suppression: ' + error.message);
    }
  });

  const handleDelete = (bookId, bookTitle) => {
    if (confirm(`Supprimer le livre "${bookTitle}" ?`)) {
      deleteMutation.mutate(bookId);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
          📚 Catalogue de Livres
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez votre bibliothèque et assignez des lectures
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="w-full sm:flex-[2] relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre ou auteur..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          />
        </div>

        {/* Filter by language */}
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="sm:flex-[1] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="">Toutes les langues</option>
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
          <option value="ar">Arabe</option>
        </select>

        {/* Import button */}
        <button
          onClick={() => setShowImportModal(true)}
          className="sm:flex-[1] px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 flex items-center gap-2 whitespace-nowrap"
        >
          <Globe className="w-4 h-4" />
          Importer de Google Books
        </button>

        {/* Add manual button */}
        <button
          onClick={() => setShowAddManualModal(true)}
          className="sm:flex-[1] px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Ajouter manuellement
        </button>

        {/* Library button */}
        <button
          onClick={() => setShowLibraryModal(true)}
          className="sm:flex-[1] px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 whitespace-nowrap"
        >
          <Library className="w-4 h-4" />
          {t('books.library.action')}
        </button>
      </div>

      {/* Books grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucun livre dans le catalogue</p>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
          >
            Importer votre premier livre
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-brand"
            >
              {/* Header avec icône et titre */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-16 bg-gradient-to-br from-mint-400 to-purple-400 rounded-lg overflow-hidden flex items-center justify-center text-xl flex-shrink-0">
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>📖</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-anthracite dark:text-cream line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {book.author || 'Auteur inconnu'}
                  </p>
                  
                  {/* Genres */}
                  {book.genres && book.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {book.genres.slice(0, 3).map(genre => (
                        <span
                          key={genre}
                          className="px-2 py-0.5 rounded-full bg-brand-light text-brand text-xs font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                      {book.genres.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                          +{book.genres.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description/Stats */}
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-3">
                  <span>{book.totalPages} pages</span>
                  {book.language && <span>• {book.language.toUpperCase()}</span>}
                  <span>• {book._count?.readingAssignments || 0} assignation(s)</span>
                </div>
                {book.group ? (
                  <span className="text-brand text-xs">Groupe</span>
                ) : (
                  <span className="text-secondary text-xs">Global</span>
                )}
              </div>

              {/* Bloc Note + Likes (cliquable) */}
              <button
                onClick={() => setSelectedBookForReviews({ id: book.id, title: book.title })}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 mb-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                title="Voir avis et likes"
              >
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{book.averageRating ?? 0}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M7.5 21h9a3 3 0 003-3v-6a3 3 0 00-3-3h-3.382a1.5 1.5 0 01-1.06-.44l-1.736-1.736A3 3 0 008.382 5H7.5A3.5 3.5 0 004 8.5V18a3 3 0 003.5 3z" /></svg>
                  <span className="font-medium">{book.totalLikes ?? 0}</span>
                </div>
              </button>

              {/* Actions avec icônes seulement */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedBookForReviews({ id: book.id, title: book.title })}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="Voir les avis"
                >
                  <Star className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedBookForAssignment({ id: book.id, title: book.title })}
                  className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  title="Assigner le livre"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(book.id, book.title)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                  title="Supprimer le livre"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import Modal */}
      <GoogleBooksImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      {/* Add Manual Modal */}
      <AddBookManualModal
        isOpen={showAddManualModal}
        onClose={() => setShowAddManualModal(false)}
      />

      {/* Reviews Modal */}
      <BookReviewsModal
        isOpen={!!selectedBookForReviews}
        onClose={() => setSelectedBookForReviews(null)}
        bookId={selectedBookForReviews?.id}
        bookTitle={selectedBookForReviews?.title}
      />

      {/* Assign Modal */}
      <AssignBookModal
        isOpen={!!selectedBookForAssignment}
        onClose={() => setSelectedBookForAssignment(null)}
        bookId={selectedBookForAssignment?.id}
        bookTitle={selectedBookForAssignment?.title}
      />

      {/* Library Modal */}
      <BookLibraryModal
        isOpen={showLibraryModal}
        onClose={() => setShowLibraryModal(false)}
      />
    </div>
  );
}


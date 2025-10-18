import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Search, X, BookOpen, Check, Loader2 } from 'lucide-react';
import { booksApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';

export default function GoogleBooksImportModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { user, getAuthHeader } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [importedIds, setImportedIds] = useState(new Set());

  // Recherche Google Books
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const data = await booksApi.searchGoogle(query, 'fr', getAuthHeader());
      setResults(data || []);
    } catch (error) {
      console.error('Error searching Google Books:', error);
      alert('Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  // Mutation d'import
  const importMutation = useMutation({
    mutationFn: (googleBookId) => 
      booksApi.importGoogle(googleBookId, user.groupId, getAuthHeader()),
    onSuccess: (data, googleBookId) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setImportedIds(prev => new Set([...prev, googleBookId]));
    },
    onError: (error) => {
      console.error('Error importing book:', error);
      alert('Erreur lors de l\'importation');
    }
  });

  const handleImport = (googleBookId) => {
    importMutation.mutate(googleBookId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-anthracite-light rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-display font-bold text-anthracite dark:text-cream">
              Importer depuis Google Books
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un livre (titre, auteur, ISBN...)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-anthracite-dark text-anthracite dark:text-cream"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Rechercher
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {results.length === 0 && !isSearching && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>Recherchez un livre pour commencer</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid gap-4">
              {results.map((book) => {
                const isImported = importedIds.has(book.googleBookId);
                const isImporting = importMutation.isPending && importMutation.variables === book.googleBookId;

                return (
                  <div
                    key={book.googleBookId}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-anthracite rounded-xl"
                  >
                    {/* Cover */}
                    <div className="w-20 h-28 bg-gradient-mootify rounded-lg shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                      {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">📖</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-anthracite dark:text-cream mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {book.author}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs mb-2">
                        <span className="px-2 py-1 bg-white dark:bg-anthracite-light rounded-full">
                          {book.totalPages} pages
                        </span>
                        {book.language && (
                          <span className="px-2 py-1 bg-white dark:bg-anthracite-light rounded-full">
                            {book.language.toUpperCase()}
                          </span>
                        )}
                        {book.isbn && (
                          <span className="px-2 py-1 bg-white dark:bg-anthracite-light rounded-full">
                            ISBN: {book.isbn}
                          </span>
                        )}
                      </div>
                      {book.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {book.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      {isImported ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                          <Check className="w-4 h-4" />
                          Importé
                        </div>
                      ) : (
                        <button
                          onClick={() => handleImport(book.googleBookId)}
                          disabled={isImporting}
                          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-50 text-sm"
                        >
                          {isImporting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Importer'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-anthracite dark:text-cream rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}


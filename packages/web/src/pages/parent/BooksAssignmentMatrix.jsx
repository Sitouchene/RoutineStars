import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { booksApi, childrenApi, readingApi } from '../../lib/api-client';
import { BookOpen, UserPlus } from 'lucide-react';
import AssignBookModal from '../../components/parent/AssignBookModal';

export default function BooksAssignmentMatrix() {
  const { getAuthHeader, user } = useAuthStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null); // { book, child }

  // Livres du groupe (et globaux)
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books', user?.groupId],
    queryFn: () => booksApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Enfants du groupe
  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ['children', user?.groupId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Assignations de lecture de tous les enfants (comme la page ReadingAssignmentsPage)
  const { data: allAssignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['allReadingAssignments', user?.groupId],
    queryFn: async () => {
      if (!children.length) return [];
      const perChild = await Promise.all(
        children.map((c) => readingApi.getChildReadings(c.id, getAuthHeader()))
      );
      return perChild.flat();
    },
    enabled: !!user?.groupId && children.length > 0,
  });

  const assignmentsByKey = useMemo(() => {
    const map = new Map();
    for (const a of allAssignments) {
      if (a.book && a.childId) {
        map.set(`${a.book.id}:${a.childId}`, a);
      }
    }
    return map;
  }, [allAssignments]);

  const isLoading = booksLoading || childrenLoading || assignmentsLoading;

  const openAssign = (book, child) => setSelected({ book, child });
  const closeAssign = () => setSelected(null);

  const afterAssign = () => {
    queryClient.invalidateQueries({ queryKey: ['allReadingAssignments', user?.groupId] });
    closeAssign();
  };

  // Responsive: détection simple
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const [expandedBookId, setExpandedBookId] = useState(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-gray-900">{t('books.matrixTitle', 'Matrice des lectures')}</h1>
            <p className="text-gray-600 text-sm">{t('books.matrixSubtitle', 'Affectez des lectures par enfant')}</p>
          </div>
        </div>
      </div>

      {/* Tableau croisé */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="w-80 px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r sticky left-0 z-20 bg-gray-50">
                  {t('books.title', 'Livres')}
                </th>
                {children.map((child) => (
                  <th key={child.id} className="w-48 px-4 py-4 text-center border-r last:border-r-0 bg-gray-50">
                    <div className="flex flex-col items-center">
                      <div className="font-semibold text-gray-900 text-sm">{child.name}</div>
                      <div className="text-xs text-gray-500">{t('children.age', { count: child.age })}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={1 + children.length} className="p-6 text-center text-gray-500">
                    {t('common.loading', 'Chargement...')}
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={1 + children.length} className="p-6 text-center text-gray-500">
                    {t('books.noBooks', 'Aucun livre dans le catalogue')}
                  </td>
                </tr>
              ) : (
                books.map((book, idx) => (
                  <tr key={book.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} onClick={() => isMobile && setExpandedBookId(expandedBookId === book.id ? null : book.id)}>
                    {/* Colonne livre */}
                    <td className="px-6 py-4 border-r sticky left-0 z-10 bg-inherit">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-mint-400 to-purple-400 flex items-center justify-center text-xl">
                          {book.coverImageUrl ? (
                            <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <span>📖</span>
                          )}
                        </div>
                        {!isMobile && (
                          <div>
                            <div className="font-medium text-gray-900">{book.title}</div>
                            <div className="text-xs text-gray-500">{book.author}</div>
                            {book.genres?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {book.genres.slice(0, 3).map((g) => (
                                  <span key={g} className="px-2 py-0.5 rounded-full bg-brand-light text-brand text-[10px] font-medium">{g}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Cellules enfant */}
                    {children.map((child) => {
                      const key = `${book.id}:${child.id}`;
                      const assignment = assignmentsByKey.get(key);
                      const assigned = Boolean(assignment);
                      return (
                        <td key={key} className="px-4 py-4 text-center border-r last:border-r-0">
                          {assigned ? (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${assignment.assignmentType === 'assigned' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {assignment.assignmentType === 'assigned' ? t('reading.assign.assigned', 'Assigné') : t('reading.assign.recommended', 'Recommandé')}
                            </span>
                          ) : (
                            <button
                              onClick={() => openAssign(book, child)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs"
                            >
                              <UserPlus className="w-3.5 h-3.5" /> {t('books.assign', 'Assigner')}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Détails en mobile */}
      {isMobile && expandedBookId && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          {(() => {
            const book = books.find((b) => b.id === expandedBookId);
            if (!book) return null;
            return (
              <div className="flex items-start gap-4">
                <div className="w-16 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-mint-400 to-purple-400 flex items-center justify-center text-2xl">
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>📖</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{book.title}</div>
                  <div className="text-sm text-gray-600">{book.author}</div>
                  {book.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.genres.map((g) => (
                        <span key={g} className="px-2 py-0.5 rounded-full bg-brand-light text-brand text-[11px] font-medium">{g}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Modale d'assignation (préremplie) */}
      {selected && (
        <AssignBookModal
          isOpen={!!selected}
          onClose={closeAssign}
          bookId={selected.book.id}
          bookTitle={selected.book.title}
        />
      )}
    </div>
  );
}



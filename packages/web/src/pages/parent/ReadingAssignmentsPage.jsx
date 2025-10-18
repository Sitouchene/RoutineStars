import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, User, Calendar, Award, TrendingUp } from 'lucide-react';
import { booksApi, readingApi, childrenApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';

export default function ReadingAssignmentsPage() {
  const { user, getAuthHeader } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Vérifier que l'utilisateur est chargé
  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </div>
    );
  }
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    childIds: [],
    assignmentType: 'assigned',
    totalPoints: 40,
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  });

  // Charger les livres
  const { data: books = [] } = useQuery({
    queryKey: ['books', user?.groupId],
    queryFn: () => booksApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Charger les enfants
  const { data: children = [] } = useQuery({
    queryKey: ['children', user?.groupId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Charger toutes les assignations
  const { data: allAssignments = [] } = useQuery({
    queryKey: ['allAssignments', user?.groupId],
    queryFn: async () => {
      if (!children.length) return [];
      const assignments = await Promise.all(
        children.map(child => readingApi.getChildReadings(child.id, getAuthHeader()))
      );
      return assignments.flat();
    },
    enabled: !!user?.groupId && children.length > 0,
  });

  // Mutation pour créer une assignation
  const assignMutation = useMutation({
    mutationFn: (data) => readingApi.assign(data, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAssignments', user?.groupId] });
      setShowForm(false);
          setFormData({
            bookId: '',
            childIds: [],
            assignmentType: 'assigned',
            totalPoints: 40,
            startDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
          });
      alert('Lecture assignée avec succès !');
    },
    onError: (error) => {
      alert('Erreur: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bookId || formData.childIds.length === 0) {
      alert('Veuillez sélectionner un livre et au moins un enfant');
      return;
    }
    assignMutation.mutate(formData);
  };

  const handleChildToggle = (childId) => {
    setFormData(prev => ({
      ...prev,
      childIds: prev.childIds.includes(childId)
        ? prev.childIds.filter(id => id !== childId)
        : [...prev.childIds, childId]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      childIds: prev.childIds.length === children.length ? [] : children.map(child => child.id)
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
          📖 Assignations de Lecture
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Assignez des livres aux enfants avec un système de points
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle assignation
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Assigner une lecture</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Book */}
              <div>
                <label className="block text-sm font-medium mb-2">Livre</label>
                <select
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  required
                >
                  <option value="">Sélectionner un livre</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} - {book.author}
                    </option>
                  ))}
                </select>
              </div>

                  {/* Children */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Enfants</label>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-sm text-brand hover:text-brand/80 font-medium"
                      >
                        {formData.childIds.length === children.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      {children.map(child => (
                        <label
                          key={child.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.childIds.includes(child.id)}
                            onChange={() => handleChildToggle(child.id)}
                            className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-mint-400 to-purple-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {child.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {child.name}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {formData.childIds.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.childIds.length} enfant(s) sélectionné(s)
                      </p>
                    )}
                  </div>

              {/* Assignment Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.assignmentType}
                  onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                >
                  <option value="assigned">Assigné (obligatoire)</option>
                  <option value="recommended">Recommandé</option>
                </select>
              </div>

              {/* Total Points */}
              <div>
                <label className="block text-sm font-medium mb-2">Points totaux</label>
                <input
                  type="number"
                  value={formData.totalPoints}
                  onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
                  min="0"
                  step="10"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Points répartis: 25% → 50% → 75% → 100%
                </p>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Date de début (optionnel)</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Date limite (optionnel)</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={assignMutation.isPending}
                className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-50"
              >
                {assignMutation.isPending ? 'En cours...' : 'Assigner'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {allAssignments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune assignation pour le moment</p>
          </div>
        ) : (
          allAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex items-center gap-4"
            >
              {/* Book cover */}
              <div className="w-16 h-20 bg-gradient-to-br from-mint-400 to-purple-400 rounded-lg overflow-hidden flex-shrink-0">
                {assignment.book.coverImageUrl ? (
                  <img src={assignment.book.coverImageUrl} alt={assignment.book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {assignment.book.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {assignment.child?.name || 'Enfant'} • {assignment.assignmentType === 'assigned' ? 'Assigné' : 'Recommandé'}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {assignment.totalPoints} points
                  </span>
                  {assignment.progress && (
                    <>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {assignment.progress.currentPage}/{assignment.book.totalPages} pages
                      </span>
                      <span className="flex items-center gap-1 text-brand">
                        {assignment.progress.currentPoints} pts gagnés
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status */}
              {assignment.progress?.isFinished && (
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                  Terminé
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


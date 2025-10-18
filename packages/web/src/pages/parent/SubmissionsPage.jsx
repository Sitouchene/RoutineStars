import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { submissionsApi, tasksApi } from '../../lib/api-client';
import { Calendar, CheckCircle, Clock, MessageSquare, Eye, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSubmissionsRealtime } from '../../hooks/useRealtime';

export default function SubmissionsPage() {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const { getAuthHeader, user, group } = useAuthStore();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  // Hook realtime pour les soumissions (écoute toutes les soumissions du groupe)
  const { isConnected: submissionsRealtimeConnected } = useSubmissionsRealtime(null);

  // Récupérer les soumissions de la famille
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['familySubmissions', user?.groupId],
    queryFn: () => submissionsApi.getGroupSubmissions(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Récupérer les détails d'une soumission avec les tâches
  const { data: submissionDetails } = useQuery({
    queryKey: ['submissionDetails', selectedSubmission?.id],
    queryFn: () => submissionsApi.getSubmissionDetails(selectedSubmission.id, getAuthHeader()),
    enabled: !!selectedSubmission,
  });

  // Mutation pour valider une soumission
  const validateSubmissionMutation = useMutation({
    mutationFn: ({ submissionId, parentComment }) => 
      submissionsApi.validateSubmission(submissionId, parentComment, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familySubmissions', user?.groupId] });
      setShowValidationModal(false);
      setSelectedSubmission(null);
    },
  });

  // Mutation pour valider une tâche individuelle
  const validateTaskMutation = useMutation({
    mutationFn: ({ taskId, score, comment }) => 
      tasksApi.validate(taskId, score, comment, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissionDetails', selectedSubmission?.id] });
    },
  });

  const handleValidateSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowValidationModal(true);
  };

  const handleSubmitValidation = (parentComment) => {
    validateSubmissionMutation.mutate({
      submissionId: selectedSubmission.id,
      parentComment,
    });
  };

  const handleValidateTask = (taskId, score, comment) => {
    validateTaskMutation.mutate({ taskId, score, comment });
  };

  const getStatusColor = (submission) => {
    if (submission.validatedAt) return 'text-green-600 bg-green-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getStatusText = (submission) => {
    if (submission.validatedAt) return t('submissions.validated');
    return t('submissions.pending');
  };

  // Grouper les soumissions par date
  const submissionsByDate = submissions.reduce((acc, submission) => {
    const date = new Date(submission.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(submission);
    return acc;
  }, {});

  const membersKey = group?.type === 'classroom' ? t('dashboard.members.students') : t('dashboard.members.children');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{group?.type === 'classroom' ? t('submissions.headerTeacher') : t('submissions.header')}</h1>
          <p className="text-gray-600">{t('submissions.description', { members: membersKey })}</p>
        </div>
        <div className="text-sm text-gray-500">
          {t('submissions.totalCount', { count: submissions.length })}
        </div>
      </div>

      {/* Liste des soumissions groupées par date */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">{t('submissions.loading')}</div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">{t('submissions.empty')}</div>
          <p className="text-sm text-gray-400">
            {t('submissions.emptyHelp', { members: membersKey })}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(submissionsByDate).map(([date, dateSubmissions]) => (
            <div key={date} className="bg-white rounded-lg border border-gray-200">
              {/* En-tête de date */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">
                  {new Date(date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar' ? 'ar' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('submissions.groupSub', { count: dateSubmissions.length, members: membersKey })}
                </p>
              </div>

              {/* Liste des enfants pour cette date */}
              <div className="divide-y divide-gray-200">
                {dateSubmissions.map(submission => (
                  <div key={submission.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {submission.child.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{submission.child.name}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(submission.submittedAt).toLocaleString(i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar' ? 'ar' : 'en-US')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(submission)}`}>
                          {submission.validatedAt ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {getStatusText(submission)}
                        </div>
                        
                        <button
                          onClick={() => handleValidateSubmission(submission)}
                          disabled={submission.validatedAt}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                            submission.validatedAt
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          {submission.validatedAt ? t('submissions.alreadyValidated') : t('submissions.validate')}
                        </button>
                      </div>
                    </div>
                    
                    {submission.parentComment && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-800">{t('submissions.parentCommentLabel')}</p>
                            <p className="text-sm text-green-700">{submission.parentComment}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de validation détaillée */}
      {showValidationModal && selectedSubmission && (
        <DetailedValidationModal
          submission={selectedSubmission}
          submissionDetails={submissionDetails}
          onClose={() => {
            setShowValidationModal(false);
            setSelectedSubmission(null);
          }}
          onSubmit={handleSubmitValidation}
          onValidateTask={handleValidateTask}
          isLoading={validateSubmissionMutation.isPending}
          isTaskLoading={validateTaskMutation.isPending}
        />
      )}
    </div>
  );
}

// Modal de validation détaillée
function DetailedValidationModal({ submission, submissionDetails, onClose, onSubmit, onValidateTask, isLoading, isTaskLoading }) {
  const [parentComment, setParentComment] = useState(submission.parentComment || '');
  const [taskValidations, setTaskValidations] = useState({});
  const { t, i18n } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parentComment.trim()) {
      onSubmit(parentComment.trim());
    }
  };

  const handleTaskValidation = (taskId, score, comment) => {
    setTaskValidations(prev => ({
      ...prev,
      [taskId]: { score, comment }
    }));
    onValidateTask(taskId, score, comment);
  };

  const getScoreColor = (score) => {
    if (score >= 76) return 'text-green-600 bg-green-100';
    if (score >= 51) return 'text-yellow-600 bg-yellow-100';
    if (score >= 26) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('submissions.modal.title', { name: submission.child.name })}
            </h3>
            <p className="text-sm text-gray-600">
              {new Date(submission.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar' ? 'ar' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {submissionDetails ? (
            <div className="space-y-6">
              {/* Liste des tâches */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('submissions.modal.tasksTitle')}</h4>
                <div className="space-y-4">
                  {submissionDetails.tasks.map(task => (
                    <TaskValidationCard
                      key={task.id}
                      task={task}
                      onValidate={handleTaskValidation}
                      isLoading={isTaskLoading}
                      getScoreColor={getScoreColor}
                    />
                  ))}
                </div>
              </div>

              {/* Commentaire global */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('submissions.modal.globalCommentLabel')}
                  </label>
                  <textarea
                    value={parentComment}
                    onChange={(e) => setParentComment(e.target.value)}
                    placeholder={t('submissions.modal.globalCommentPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('submissions.modal.globalCommentHelp')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={isLoading || !parentComment.trim()}
                  >
                    {isLoading ? t('submissions.modal.submitting') : t('submissions.modal.submit')}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">{t('submissions.loadingDetails')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant pour valider une tâche individuelle
function TaskValidationCard({ task, onValidate, isLoading, getScoreColor }) {
  const [showValidation, setShowValidation] = useState(false);
  const [parentScore, setParentScore] = useState(task.parentScore || task.selfScore);
  const [parentComment, setParentComment] = useState(task.parentComment || '');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onValidate(task.id, parentScore, parentComment);
    setShowValidation(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{task.taskTemplate?.icon || '📋'}</span>
          <div>
            <h5 className="font-medium text-gray-900">{task.taskTemplate?.title}</h5>
            <p className="text-sm text-gray-600">{task.taskTemplate?.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(task.selfScore)}`}>
            {t('submissions.task.childScore', { score: task.selfScore })}
          </div>
          {task.parentScore && (
            <div className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(task.parentScore)}`}>
              {t('submissions.task.parentScore', { score: task.parentScore })}
            </div>
          )}
        </div>
      </div>

      {task.parentScore ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800">{t('submissions.task.validated')}</p>
          {task.parentComment && (
            <p className="text-sm text-green-700 mt-1">"{task.parentComment}"</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {t('submissions.task.selfEval', { score: task.selfScore })}
          </div>
          <button
            onClick={() => setShowValidation(true)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
          >
            {t('submissions.task.validate')}
          </button>
        </div>
      )}

      {/* Modal de validation de tâche */}
      {showValidation && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h6 className="font-medium text-gray-900 mb-3">{t('submissions.task.validate')}</h6>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('submissions.task.scoreLabel')}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={parentScore}
                onChange={(e) => setParentScore(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('submissions.task.commentLabel', { optional: t('common.optional') })}
              </label>
              <textarea
                value={parentComment}
                onChange={(e) => setParentComment(e.target.value)}
                placeholder={t('submissions.task.commentPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowValidation(false)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? t('submissions.task.submitting') : t('submissions.task.submit')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

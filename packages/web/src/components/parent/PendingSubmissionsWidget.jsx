import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { submissionsApi } from '../../lib/api-client';
import { CheckCircle, Clock } from 'lucide-react';

export default function PendingSubmissionsWidget() {
  const { getAuthHeader, user } = useAuthStore();

  const { data: submissions = [] } = useQuery({
    queryKey: ['familySubmissions', user?.familyId],
    queryFn: () => submissionsApi.getFamilySubmissions(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  const pendingSubmissions = submissions.filter(submission => !submission.validatedAt);

  if (pendingSubmissions.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-yellow-600" />
        <div>
          <h3 className="font-semibold text-yellow-800">
            {pendingSubmissions.length} soumission(s) en attente de validation
          </h3>
          <p className="text-sm text-yellow-700">
            Vos enfants ont soumis leurs journées et attendent votre validation
          </p>
        </div>
        <a
          href="/parent/submissions"
          className="ml-auto px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Voir les soumissions
        </a>
      </div>
    </div>
  );
}

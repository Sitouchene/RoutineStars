import { useState } from 'react';
import { CheckCircle, Circle, Star, Lock } from 'lucide-react';

export default function TaskCard({ task, onSelfEvaluate, getCategoryIcon, getScoreColor, isDaySubmitted = false }) {
  const [showEvaluation, setShowEvaluation] = useState(false);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'validated':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'submitted':
        return <Lock className="w-6 h-6 text-orange-600" />;
      case 'self_evaluated':
        return <Circle className="w-6 h-6 text-blue-600" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'validated':
        return 'Validée par papa/maman';
      case 'submitted':
        return 'Soumise - En attente de validation';
      case 'self_evaluated':
        return 'En attente de validation';
      default:
        return 'À faire';
    }
  };

  const handleScoreSelect = (score) => {
    if (!isDaySubmitted) {
      onSelfEvaluate(task.id, score);
      setShowEvaluation(false);
    }
  };

  const canSelfEvaluate = !isDaySubmitted && task.status !== 'validated' && task.status !== 'submitted';

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {getCategoryIcon(task.category)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-sm text-gray-500">{task.points} points</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          {task.status === 'validated' && (
            <Lock className="w-4 h-4 text-green-600" />
          )}
        </div>
      </div>

      {/* Score actuel */}
      {task.selfScore !== null && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mon évaluation :</span>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(task.selfScore)}`}>
              {task.selfScore}%
            </div>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">{getStatusText()}</p>
          {isDaySubmitted && (
            <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              <Lock className="w-3 h-3" />
              Verrouillé
            </div>
          )}
        </div>
        
        {canSelfEvaluate && (
          <button
            onClick={() => setShowEvaluation(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            {task.selfScore !== null && task.selfScore !== undefined ? 'Modifier mon évaluation' : 'M\'évaluer'}
          </button>
        )}
      </div>

      {/* Modal d'autoévaluation */}
      {showEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-center mb-4">
              Comment as-tu fait ?
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleScoreSelect(0)}
                className="w-full p-4 border-2 border-red-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-colors"
              >
                <div className="text-2xl mb-1">😞</div>
                <div className="font-medium">Pas fait (0%)</div>
                <div className="text-sm text-gray-500">Je n'ai pas pu faire cette tâche</div>
              </button>

              <button
                onClick={() => handleScoreSelect(50)}
                className="w-full p-4 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
              >
                <div className="text-2xl mb-1">😐</div>
                <div className="font-medium">Partiellement fait (50%)</div>
                <div className="text-sm text-gray-500">J'ai commencé mais pas fini</div>
              </button>

              <button
                onClick={() => handleScoreSelect(100)}
                className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors"
              >
                <div className="text-2xl mb-1">😊</div>
                <div className="font-medium">Parfaitement fait (100%)</div>
                <div className="text-sm text-gray-500">J'ai tout fait comme il faut !</div>
              </button>
            </div>

            <button
              onClick={() => setShowEvaluation(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Star, Lock, Info, Zap, Target, Award } from 'lucide-react';

export default function TaskCard({ 
  task, 
  onSelfEvaluate, 
  getCategoryIcon, 
  getScoreColor, 
  isDaySubmitted = false,
  isWithinEvaluationWindow = true 
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentScore, setCurrentScore] = useState(task.selfScore || 0);
  const [clickCount, setClickCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef(null);

  // Sons pour les interactions (simulation avec des vibrations)
  const playSound = (type) => {
    if (navigator.vibrate) {
      switch (type) {
        case 'click':
          navigator.vibrate(50);
          break;
        case 'success':
          navigator.vibrate([100, 50, 100]);
          break;
        case 'error':
          navigator.vibrate([200, 100, 200]);
          break;
      }
    }
  };

  const getStatusConfig = () => {
    switch (task.status) {
      case 'validated':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'bg-green-500',
          text: 'Validée',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700'
        };
      case 'submitted':
        return {
          icon: <Lock className="w-4 h-4" />,
          color: 'bg-orange-500',
          text: 'Soumise',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700'
        };
      case 'self_evaluated':
        return {
          icon: <Circle className="w-4 h-4" />,
          color: 'bg-blue-500',
          text: 'Évaluée',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700'
        };
      default:
        return {
          icon: <Circle className="w-4 h-4" />,
          color: 'bg-gray-400',
          text: 'À faire',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleCardClick = () => {
    if (!isEvaluating) {
      playSound('click');
      setShowDetails(true);
    }
  };

  const handleEvaluationStart = (e) => {
    e.stopPropagation();
    if (!isDaySubmitted && task.status !== 'validated' && task.status !== 'submitted' && isWithinEvaluationWindow) {
      setIsEvaluating(true);
      setClickCount(0);
      playSound('click');
    }
  };

  const handleClick = () => {
    if (isEvaluating) {
      setClickCount(prev => prev + 1);
      const newScore = Math.min(100, clickCount * 25);
      setCurrentScore(newScore);
      
      if (newScore >= 100) {
        handleEvaluationComplete(100);
      }
    }
  };

  const handlePressStart = () => {
    if (isEvaluating) {
      setIsPressed(true);
      pressTimer.current = setInterval(() => {
        setCurrentScore(prev => {
          const newScore = Math.min(100, prev + 2);
          if (newScore >= 100) {
            handleEvaluationComplete(100);
          }
          return newScore;
        });
      }, 50);
    }
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    if (pressTimer.current) {
      clearInterval(pressTimer.current);
    }
  };

  const handleEvaluationComplete = (score) => {
    setIsEvaluating(false);
    setClickCount(0);
    playSound('success');
    onSelfEvaluate(task.id, score);
  };

  const handleCancelEvaluation = () => {
    setIsEvaluating(false);
    setClickCount(0);
    setCurrentScore(task.selfScore || 0);
    playSound('error');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'routine': 'from-pink-400 to-rose-500',
      'household': 'from-blue-400 to-cyan-500',
      'study': 'from-purple-400 to-violet-500',
      'personal': 'from-green-400 to-emerald-500',
      'other': 'from-yellow-400 to-orange-500'
    };
    // Gérer les objets Category ou les chaînes
    const categoryKey = typeof category === 'object' ? category?.title : category;
    return colors[categoryKey] || colors['other'];
  };

  const getRecurrenceIcon = (recurrence) => {
    switch (recurrence) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '🗓️';
      default: return '📋';
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative w-full aspect-square rounded-2xl p-4 cursor-pointer
          bg-gradient-to-br ${getCategoryColor(task.category)}
          border-4 border-white shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          ${isEvaluating ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
        `}
        onClick={handleCardClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        {/* Icône principale */}
        <div className="flex justify-center items-center h-12 mb-2">
          <motion.div
            animate={isEvaluating ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isEvaluating ? Infinity : 0 }}
            className="text-3xl"
          >
            {getCategoryIcon(task.category)}
          </motion.div>
        </div>

        {/* Titre */}
        <h3 className="text-white font-bold text-sm text-center mb-2 leading-tight">
          {task.title}
        </h3>

        {/* Informations compactes */}
        <div className="absolute bottom-2 left-2 right-2 space-y-1">
          {/* Points */}
          <div className="flex items-center justify-center gap-1 bg-white bg-opacity-20 rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-300" />
            <span className="text-white text-xs font-bold">{task.points}</span>
          </div>

          {/* Statut */}
          <div className={`flex items-center justify-center gap-1 rounded-full px-2 py-1 ${statusConfig.bgColor}`}>
            {statusConfig.icon}
            <span className={`text-xs font-medium ${statusConfig.textColor}`}>
              {statusConfig.text}
            </span>
          </div>
        </div>

        {/* Indicateur de récurrence */}
        <div className="absolute top-2 right-2">
          <span className="text-lg">{getRecurrenceIcon(task.recurrence)}</span>
        </div>

        {/* Zone d'auto-évaluation */}
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-white text-center"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-lg font-bold">{currentScore}%</div>
              <div className="text-sm">Clique ou maintiens !</div>
            </motion.div>
            
            {/* Barre de progression */}
            <div className="w-20 h-2 bg-white bg-opacity-30 rounded-full mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-yellow-400 rounded-full"
                animate={{ width: `${currentScore}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 mt-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
                className="px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-bold"
              >
                +25%
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCancelEvaluation}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold"
              >
                Annuler
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Bouton d'évaluation */}
        {!isEvaluating && !isDaySubmitted && task.status !== 'validated' && task.status !== 'submitted' && isWithinEvaluationWindow && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleEvaluationStart}
            className="absolute top-2 left-2 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
          >
            <Zap className="w-4 h-4 text-white" />
          </motion.button>
        )}

        {/* Score actuel */}
        {task.selfScore !== null && task.selfScore !== undefined && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-full px-2 py-1"
          >
            <span className="text-xs font-bold text-gray-800">{task.selfScore}%</span>
          </motion.div>
        )}
      </motion.div>

      {/* Modal des détails */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getCategoryColor(task.category)} flex items-center justify-center text-2xl`}>
                  {getCategoryIcon(task.category)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{getRecurrenceIcon(task.recurrence)} {task.recurrence}</span>
                    <span>•</span>
                    <span className="capitalize">{task.category}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{task.description}</p>
                </div>
              )}

              {/* Informations */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Points</span>
                  </div>
                  <span className="text-lg font-bold text-blue-900">{task.points}</span>
                </div>

                <div className={`${statusConfig.bgColor} rounded-xl p-3`}>
                  <div className="flex items-center gap-2 mb-1">
                    {statusConfig.icon}
                    <span className={`text-sm font-medium ${statusConfig.textColor}`}>Statut</span>
                  </div>
                  <span className={`text-lg font-bold ${statusConfig.textColor}`}>{statusConfig.text}</span>
                </div>
              </div>

              {/* Commentaire parent */}
              {task.parentComment && (
                <div className="bg-yellow-50 rounded-xl p-3 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Message de papa/maman
                  </h4>
                  <p className="text-yellow-700 text-sm">{task.parentComment}</p>
                </div>
              )}

              {/* Bouton fermer */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetails(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Fermer
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
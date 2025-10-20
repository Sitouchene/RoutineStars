import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Clock, CheckCircle, XCircle, Trophy, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Modal pour afficher et compléter un quiz de lecture
 */
export default function QuizModal({ quiz, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Vérification frontend des réponses
  const checkAnswer = (questionId, userAnswer) => {
    const question = questions.find(q => q.id === questionId);
    const isCorrect = userAnswer === question.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, { 
      questionId, 
      userAnswer, 
      isCorrect, 
      explanation: question.explanation 
    }]);
  };

  const handleAnswerSelect = (answer) => {
    if (!currentQuestion) return;

    checkAnswer(currentQuestion.id, answer);

    // Passer à la question suivante ou terminer
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsFinished(true);
      }, 1000);
    }
  };

  const handleSubmit = () => {
    const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    onSubmit(score, finalTimeSpent);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    if (score >= 5) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (score >= 5) return t('child.quiz.passed', 'Quiz réussi !');
    if (score >= 3) return t('child.quiz.good', 'Bien joué !');
    return t('child.quiz.failed', 'Réessaye !');
  };

  if (!quiz) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">{quiz.title}</h2>
                <p className="text-blue-100 text-sm">{quiz.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>
              {t('child.quiz.question', 'Question {{current}}/{{total}}', { 
                current: currentQuestionIndex + 1, 
                total: questions.length 
              })}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>
          
          <div className="mt-2 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentQuestionIndex}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="space-y-6"
              >
                {/* Question */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {currentQuestionIndex + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {currentQuestion?.question}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {t(`child.quiz.category.${currentQuestion?.category}`, currentQuestion?.category)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion?.type === 'qcm' ? (
                    Object.entries(currentQuestion.options || {}).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => handleAnswerSelect(key)}
                        className="w-full p-4 text-left border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {key}
                          </div>
                          <span className="font-medium">{value}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    ['A', 'B'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        className="w-full p-4 text-left border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {option}
                          </div>
                          <span className="font-medium">
                            {option === 'A' ? t('child.quiz.true', 'Vrai') : t('child.quiz.false', 'Faux')}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
              >
                {/* Results */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8">
                  <div className="flex items-center justify-center mb-4">
                    {score >= 5 ? (
                      <CheckCircle className="w-16 h-16 text-green-300" />
                    ) : (
                      <XCircle className="w-16 h-16 text-red-300" />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    {getScoreMessage()}
                  </h3>
                  
                  <div className={`text-4xl font-bold ${getScoreColor()}`}>
                    {score}/7
                  </div>
                  
                  <div className="mt-4 text-lg">
                    {t('child.quiz.timeSpent', 'Temps: {{time}}', { time: formatTime(timeSpent) })}
                  </div>
                </div>

                {/* Bonus Points */}
                {score >= 5 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      <div>
                        <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                          {t('child.quiz.doublePoints', 'Tu as doublé tes points !')}
                        </div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-300">
                          {t('child.quiz.bonusExplanation', 'Tu vas recevoir des points bonus pour avoir réussi ce quiz !')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {t('child.quiz.submit', 'Valider')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}


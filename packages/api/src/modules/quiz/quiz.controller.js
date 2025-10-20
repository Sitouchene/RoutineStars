import { 
  getQuizzesByBook, 
  getQuizByTriggerPage, 
  submitQuizAttempt, 
  getUserQuizAttempts,
  getUserQuizStats,
  getAvailableQuizzesForUser
} from './quiz.service.js';

/**
 * Contrôleur pour les quiz de lecture
 */

/**
 * Récupérer tous les quiz d'un livre
 */
export async function getBookQuizzes(req, res) {
  try {
    const { bookId } = req.params;
    const quizzes = await getQuizzesByBook(bookId);
    res.json(quizzes);
  } catch (error) {
    console.error('Erreur lors de la récupération des quiz:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer le quiz déclenché à une page donnée
 */
export async function getTriggeredQuiz(req, res) {
  try {
    const { bookId, currentPage } = req.params;
    const quiz = await getQuizByTriggerPage(bookId, parseInt(currentPage));
    
    if (!quiz) {
      return res.status(404).json({ error: 'Aucun quiz trouvé pour cette page' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error('Erreur lors de la récupération du quiz déclenché:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Soumettre une tentative de quiz
 */
export async function submitQuiz(req, res) {
  try {
    const { quizId, score, timeSpent } = req.body;
    const userId = req.user.id;

    if (!quizId || score === undefined) {
      return res.status(400).json({ error: 'quizId et score sont requis' });
    }

    const attempt = await submitQuizAttempt(userId, quizId, score, timeSpent);
    res.json(attempt);
  } catch (error) {
    console.error('Erreur lors de la soumission du quiz:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer les tentatives de quiz d'un utilisateur
 */
export async function getUserAttempts(req, res) {
  try {
    const { userId, quizId } = req.params;
    const attempts = await getUserQuizAttempts(userId, quizId || null);
    res.json(attempts);
  } catch (error) {
    console.error('Erreur lors de la récupération des tentatives:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer les statistiques de quiz d'un utilisateur
 */
export async function getUserStats(req, res) {
  try {
    const { userId } = req.params;
    const stats = await getUserQuizStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer les quiz disponibles pour un utilisateur
 */
export async function getAvailableQuizzes(req, res) {
  try {
    const { userId } = req.params;
    const quizzes = await getAvailableQuizzesForUser(userId);
    res.json(quizzes);
  } catch (error) {
    console.error('Erreur lors de la récupération des quiz disponibles:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}


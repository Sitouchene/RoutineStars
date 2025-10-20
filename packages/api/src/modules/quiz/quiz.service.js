import prisma from '../../config/database.js';

/**
 * Service pour gérer les quiz de lecture
 */

/**
 * Récupérer tous les quiz d'un livre
 */
export async function getQuizzesByBook(bookId) {
  return await prisma.readingQuiz.findMany({
    where: { bookId, isActive: true },
    include: { 
      questions: { 
        orderBy: { order: 'asc' } 
      } 
    }
  });
}

/**
 * Récupérer le quiz qui se déclenche à une page donnée
 */
export async function getQuizByTriggerPage(bookId, currentPage) {
  return await prisma.readingQuiz.findFirst({
    where: { 
      bookId, 
      isActive: true,
      triggerPage: { lte: currentPage }
    },
    include: { 
      questions: { 
        orderBy: { order: 'asc' } 
      } 
    },
    orderBy: { triggerPage: 'desc' }
  });
}

/**
 * Soumettre une tentative de quiz
 */
export async function submitQuizAttempt(userId, quizId, score, timeSpent) {
  const quiz = await prisma.readingQuiz.findUnique({ 
    where: { id: quizId },
    include: { book: true }
  });

  if (!quiz) {
    throw new Error('Quiz non trouvé');
  }

  const isPassed = score >= 5; // 5/7 pour réussir
  const pointsEarned = isPassed ? calculateBonusPoints(quiz) : 0;

  const attempt = await prisma.quizAttempt.create({
    data: { 
      userId, 
      quizId, 
      score, 
      maxScore: 7, 
      isPassed, 
      pointsEarned, 
      timeSpent,
      completedAt: new Date()
    },
    include: {
      quiz: {
        include: { book: true }
      }
    }
  });

  // Si le quiz est réussi, ajouter les points bonus à l'utilisateur
  if (isPassed && pointsEarned > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalPointsEarned: {
          increment: pointsEarned
        }
      }
    });

    // Créer une transaction de points
    await prisma.pointTransaction.create({
      data: {
        userId,
        amount: pointsEarned,
        type: 'quiz_bonus',
        description: `Bonus quiz: ${quiz.title}`,
        source: 'quiz',
        sourceId: quizId
      }
    });
  }

  return attempt;
}

/**
 * Récupérer les tentatives de quiz d'un utilisateur
 */
export async function getUserQuizAttempts(userId, quizId = null) {
  const where = { userId };
  if (quizId) {
    where.quizId = quizId;
  }

  return await prisma.quizAttempt.findMany({
    where,
    include: {
      quiz: {
        include: { book: true }
      }
    },
    orderBy: { startedAt: 'desc' }
  });
}

/**
 * Récupérer les statistiques de quiz d'un utilisateur
 */
export async function getUserQuizStats(userId) {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: {
        include: { book: true }
      }
    }
  });

  const stats = {
    totalAttempts: attempts.length,
    passedAttempts: attempts.filter(a => a.isPassed).length,
    totalPointsEarned: attempts.reduce((sum, a) => sum + a.pointsEarned, 0),
    averageScore: attempts.length > 0 ? 
      attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0,
    booksWithQuiz: [...new Set(attempts.map(a => a.quiz.book.title))].length,
    recentAttempts: attempts.slice(0, 5)
  };

  return stats;
}

/**
 * Calculer les points bonus pour un quiz réussi
 */
function calculateBonusPoints(quiz) {
  // Points bonus basés sur le livre et la difficulté
  const basePoints = 10;
  const difficultyMultiplier = quiz.questions.length / 7; // Normaliser sur 7 questions
  const timeBonus = quiz.timeLimit ? Math.max(0, (quiz.timeLimit - 60) / 60) : 1; // Bonus si temps limité
  
  return Math.round(basePoints * difficultyMultiplier * timeBonus);
}

/**
 * Vérifier si un utilisateur peut tenter un quiz
 */
export async function canAttemptQuiz(userId, quizId) {
  const quiz = await prisma.readingQuiz.findUnique({
    where: { id: quizId }
  });

  if (!quiz) return false;

  // Vérifier le nombre de tentatives
  const attempts = await prisma.quizAttempt.count({
    where: { userId, quizId }
  });

  return attempts < quiz.maxAttempts;
}

/**
 * Récupérer les quiz disponibles pour un utilisateur basés sur sa progression de lecture
 */
export async function getAvailableQuizzesForUser(userId) {
  // Récupérer les assignations de lecture de l'utilisateur
  const readingAssignments = await prisma.readingAssignment.findMany({
    where: { childId: userId },
    include: {
      book: {
        include: {
          quizzes: {
            where: { isActive: true },
            include: { questions: true }
          }
        }
      },
      progress: true
    }
  });

  const availableQuizzes = [];

  for (const assignment of readingAssignments) {
    if (!assignment.progress) continue;

    const currentPage = assignment.progress.currentPage;
    
    for (const quiz of assignment.book.quizzes) {
      // Vérifier si le quiz est déclenché et si l'utilisateur peut le tenter
      if (currentPage >= quiz.triggerPage) {
        const canAttempt = await canAttemptQuiz(userId, quiz.id);
        if (canAttempt) {
          availableQuizzes.push({
            ...quiz,
            book: assignment.book,
            assignment: assignment
          });
        }
      }
    }
  }

  return availableQuizzes;
}


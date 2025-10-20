import prisma from '../src/config/database.js';

/**
 * Script pour créer des quiz de lecture pour les livres de la bibliothèque
 */
async function seedQuizzes() {
  console.log('📚 Seeding des quiz de lecture...\n');

  try {
    // 1. Récupérer les BookTemplate existants
    const bookTemplates = await prisma.bookTemplate.findMany({
      where: { isActive: true },
      take: 10 // Limiter à 10 livres pour commencer
    });

    if (bookTemplates.length === 0) {
      console.log('⚠️ Aucun BookTemplate trouvé. Créons d\'abord des livres.');
      return;
    }

    console.log(`📖 Création de quiz pour ${bookTemplates.length} livres...`);

    for (const bookTemplate of bookTemplates) {
      // Créer un livre à partir du template pour chaque groupe existant
      const groups = await prisma.group.findMany();
      
      for (const group of groups) {
        // Vérifier si le livre existe déjà dans ce groupe
        const existingBook = await prisma.book.findFirst({
          where: {
            groupId: group.id,
            title: bookTemplate.title
          }
        });

        let book;
        if (existingBook) {
          book = existingBook;
        } else {
          // Créer le livre dans le groupe
          book = await prisma.book.create({
            data: {
              groupId: group.id,
              title: bookTemplate.title,
              author: bookTemplate.author,
              totalPages: bookTemplate.totalPages,
              isbn: bookTemplate.isbn,
              coverImageUrl: bookTemplate.coverImageUrl,
              language: bookTemplate.language,
              genres: bookTemplate.genres,
              googleBookId: bookTemplate.googleBookId
            }
          });
        }

        // Créer 2-3 quiz par livre
        const quizCount = Math.min(3, Math.floor(bookTemplate.totalPages / 50)); // 1 quiz par 50 pages
        
        for (let i = 0; i < quizCount; i++) {
          const triggerPage = Math.floor((bookTemplate.totalPages * (i + 1)) / (quizCount + 1));
          
          const quiz = await prisma.readingQuiz.create({
            data: {
              bookId: book.id,
              title: `Quiz ${i + 1} - ${bookTemplate.title}`,
              description: `Teste tes connaissances sur ${bookTemplate.title} à la page ${triggerPage}`,
              triggerPage: triggerPage,
              maxAttempts: 3,
              timeLimit: 300, // 5 minutes
              isActive: true
            }
          });

          // Créer 7 questions par quiz (4 directes + 3 inférences)
          const questions = generateQuizQuestions(bookTemplate, i + 1);
          
          for (let j = 0; j < questions.length; j++) {
            await prisma.quizQuestion.create({
              data: {
                quizId: quiz.id,
                order: j + 1,
                type: questions[j].type,
                category: questions[j].category,
                question: questions[j].question,
                options: questions[j].options,
                correctAnswer: questions[j].correctAnswer,
                explanation: questions[j].explanation,
                points: 1
              }
            });
          }

          console.log(`   ✅ Quiz ${i + 1} créé pour "${bookTemplate.title}" (${group.name})`);
        }
      }
    }

    console.log('\n🎉 Seeding des quiz terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du seeding des quiz:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Génère des questions de quiz basées sur le livre
 */
function generateQuizQuestions(bookTemplate, quizNumber) {
  const questions = [];
  
  // Questions directes (4)
  const directQuestions = [
    {
      type: 'qcm',
      category: 'direct',
      question: `Qui est l'auteur de "${bookTemplate.title}" ?`,
      options: {
        A: bookTemplate.author,
        B: 'Auteur inconnu',
        C: 'Plusieurs auteurs',
        D: 'Auteur anonyme'
      },
      correctAnswer: 'A',
      explanation: `L'auteur de ce livre est ${bookTemplate.author}.`
    },
    {
      type: 'true_false',
      category: 'direct',
      question: `Ce livre fait ${bookTemplate.totalPages} pages.`,
      options: {
        A: 'Vrai',
        B: 'Faux'
      },
      correctAnswer: 'A',
      explanation: `Oui, ce livre contient exactement ${bookTemplate.totalPages} pages.`
    },
    {
      type: 'qcm',
      category: 'direct',
      question: `Dans quelle langue est écrit "${bookTemplate.title}" ?`,
      options: {
        A: bookTemplate.language === 'fr' ? 'Français' : bookTemplate.language === 'en' ? 'Anglais' : 'Arabe',
        B: 'Espagnol',
        C: 'Italien',
        D: 'Allemand'
      },
      correctAnswer: 'A',
      explanation: `Ce livre est écrit en ${bookTemplate.language === 'fr' ? 'français' : bookTemplate.language === 'en' ? 'anglais' : 'arabe'}.`
    },
    {
      type: 'qcm',
      category: 'direct',
      question: `Quel est le genre principal de "${bookTemplate.title}" ?`,
      options: {
        A: bookTemplate.genres[0] || 'Fiction',
        B: 'Science-fiction',
        C: 'Mystère',
        D: 'Romance'
      },
      correctAnswer: 'A',
      explanation: `Le genre principal de ce livre est ${bookTemplate.genres[0] || 'Fiction'}.`
    }
  ];

  // Questions d'inférence (3)
  const inferenceQuestions = [
    {
      type: 'qcm',
      category: 'inference',
      question: `D'après le titre "${bookTemplate.title}", que peux-tu déduire sur l'histoire ?`,
      options: {
        A: 'C\'est une histoire d\'aventure',
        B: 'C\'est une histoire de famille',
        C: 'C\'est difficile à dire sans lire',
        D: 'C\'est une histoire d\'amour'
      },
      correctAnswer: 'C',
      explanation: 'Le titre seul ne nous donne pas assez d\'informations pour deviner l\'histoire complète.'
    },
    {
      type: 'true_false',
      category: 'inference',
      question: `Avec ${bookTemplate.totalPages} pages, ce livre est probablement un roman.`,
      options: {
        A: 'Vrai',
        B: 'Faux'
      },
      correctAnswer: bookTemplate.totalPages > 100 ? 'A' : 'B',
      explanation: bookTemplate.totalPages > 100 
        ? 'Avec plus de 100 pages, c\'est effectivement probablement un roman.'
        : 'Avec moins de 100 pages, c\'est plutôt une nouvelle ou un livre court.'
    },
    {
      type: 'qcm',
      category: 'inference',
      question: `Si tu lisais ce livre, que devrais-tu faire pour bien le comprendre ?`,
      options: {
        A: 'Le lire rapidement',
        B: 'Prendre ton temps et réfléchir',
        C: 'Sauter des pages',
        D: 'Le lire en diagonale'
      },
      correctAnswer: 'B',
      explanation: 'Pour bien comprendre un livre, il faut prendre son temps et réfléchir à ce qu\'on lit.'
    }
  ];

  // Mélanger et sélectionner les questions
  questions.push(...directQuestions);
  questions.push(...inferenceQuestions);

  return questions;
}

// Exécuter le seeding
seedQuizzes();


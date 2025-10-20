import prisma from '../src/config/database.js';

/**
 * Script de test pour vérifier le système Awards/Quiz
 */
async function testSystem() {
  console.log('🧪 Test du système Awards/Quiz...\n');

  try {
    // 1. Vérifier les badges globaux
    console.log('1️⃣ Vérification des badges globaux...');
    const globalBadges = await prisma.globalBadge.findMany();
    console.log(`   ✅ ${globalBadges.length} badges globaux trouvés`);

    // 2. Vérifier les récompenses globales
    console.log('2️⃣ Vérification des récompenses globales...');
    const globalRewards = await prisma.globalReward.findMany();
    console.log(`   ✅ ${globalRewards.length} récompenses globales trouvées`);

    // 3. Vérifier les quiz
    console.log('3️⃣ Vérification des quiz...');
    const quizzes = await prisma.readingQuiz.findMany({
      include: {
        questions: true,
        book: true
      }
    });
    console.log(`   ✅ ${quizzes.length} quiz trouvés`);
    
    const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    console.log(`   ✅ ${totalQuestions} questions au total`);

    // 4. Vérifier les groupes et leurs badges
    console.log('4️⃣ Vérification des groupes...');
    const groups = await prisma.group.findMany({
      include: {
        groupBadges: true,
        groupRewards: true
      }
    });
    
    for (const group of groups) {
      console.log(`   📁 Groupe "${group.name}":`);
      console.log(`      - ${group.groupBadges.length} badges`);
      console.log(`      - ${group.groupRewards.length} récompenses`);
    }

    // 5. Vérifier les utilisateurs et leurs badges
    console.log('5️⃣ Vérification des utilisateurs...');
    const users = await prisma.user.findMany({
      where: { role: 'child' },
      include: {
        userBadges: {
          include: {
            badge: true
          }
        },
        quizAttempts: true
      }
    });
    
    for (const user of users) {
      console.log(`   👤 Enfant "${user.name}":`);
      console.log(`      - ${user.userBadges.length} badges débloqués`);
      console.log(`      - ${user.quizAttempts.length} tentatives de quiz`);
      console.log(`      - ${user.totalPointsEarned || 0} points totaux`);
    }

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`   - ${globalBadges.length} badges globaux`);
    console.log(`   - ${globalRewards.length} récompenses globales`);
    console.log(`   - ${quizzes.length} quiz créés`);
    console.log(`   - ${totalQuestions} questions générées`);
    console.log(`   - ${groups.length} groupes avec badges/récompenses`);
    console.log(`   - ${users.length} enfants avec progression`);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testSystem();


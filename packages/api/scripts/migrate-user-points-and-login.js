import prisma from '../src/config/database.js';

/**
 * Script de migration pour ajouter les nouveaux champs et calculer les points existants
 */
async function migrateUserPointsAndLogin() {
  console.log('🚀 Début de la migration des points et connexions...');

  try {
    // 1. Calculer et mettre à jour les points totaux pour tous les utilisateurs
    console.log('📊 Calcul des points totaux...');
    
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['child', 'student'] }
      },
      select: {
        id: true,
        name: true
      }
    });

    for (const user of users) {
      // Calculer les points depuis les soumissions validées
      const totalPoints = await prisma.daySubmission.aggregate({
        where: {
          childId: user.id,
          validatedAt: { not: null }
        },
        _sum: {
          pointsEarned: true
        }
      });

      const points = totalPoints._sum.pointsEarned || 0;

      // Mettre à jour l'utilisateur avec les points calculés
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalPointsEarned: points
        }
      });

      console.log(`✅ ${user.name}: ${points} points`);
    }

    // 2. Mettre à jour lastLoginAt avec createdAt pour les utilisateurs existants
    console.log('🕒 Mise à jour des dernières connexions...');
    
    await prisma.user.updateMany({
      where: {
        lastLoginAt: null
      },
      data: {
        lastLoginAt: new Date()
      }
    });

    console.log('✅ Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateUserPointsAndLogin()
  .then(() => {
    console.log('🎉 Migration complétée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Échec de la migration:', error);
    process.exit(1);
  });


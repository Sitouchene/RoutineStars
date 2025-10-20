import prisma from '../src/config/database.js';

/**
 * Script pour migrer et synchroniser les points dans la base de données
 * - Calcule les points totaux depuis les soumissions validées
 * - Calcule les points totaux depuis les lectures terminées
 * - Met à jour le champ totalPointsEarned des utilisateurs
 */
async function migratePoints() {
  console.log('🔄 Migration des points en cours...\n');

  try {
    // Récupérer tous les enfants
    const children = await prisma.user.findMany({
      where: {
        role: { in: ['child', 'student'] }
      },
      select: {
        id: true,
        name: true,
        totalPointsEarned: true
      }
    });

    console.log(`📊 ${children.length} enfants trouvés\n`);

    for (const child of children) {
      console.log(`👤 Traitement de ${child.name} (ID: ${child.id})`);

      // 1. Calculer les points depuis les soumissions validées
      const submissions = await prisma.daySubmission.findMany({
        where: {
          childId: child.id,
          validatedAt: { not: null }
        },
        select: {
          pointsEarned: true
        }
      });

      const submissionPoints = submissions.reduce((sum, sub) => sum + (sub.pointsEarned || 0), 0);
      console.log(`   📝 Points soumissions: ${submissionPoints}`);

      // 2. Calculer les points depuis les lectures terminées
      const readingAssignments = await prisma.readingAssignment.findMany({
        where: {
          childId: child.id
        },
        include: {
          progress: true
        }
      });

      const readingPoints = readingAssignments.reduce((sum, assignment) => {
        return sum + (assignment.progress?.currentPoints || 0);
      }, 0);
      console.log(`   📚 Points lectures: ${readingPoints}`);

      // 3. Calculer le total
      const totalPoints = submissionPoints + readingPoints;
      console.log(`   🎯 Total calculé: ${totalPoints} (actuel: ${child.totalPointsEarned})`);

      // 4. Mettre à jour si nécessaire
      if (totalPoints !== child.totalPointsEarned) {
        await prisma.user.update({
          where: { id: child.id },
          data: { totalPointsEarned: totalPoints }
        });
        console.log(`   ✅ Mis à jour: ${child.totalPointsEarned} → ${totalPoints}`);
      } else {
        console.log(`   ✅ Déjà synchronisé`);
      }

      console.log('');
    }

    console.log('🎉 Migration terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migratePoints();


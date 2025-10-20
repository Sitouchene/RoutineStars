import prisma from '../src/config/database.js';

/**
 * Script de migration pour passer de l'ancien système Awards au nouveau
 * Supprime les anciennes données et prépare la base pour les nouveaux modèles
 */
async function migrateAwardsSchema() {
  console.log('🔄 Migration du schéma Awards...\n');

  try {
    // 1. Supprimer les données existantes dans l'ordre inverse des dépendances
    console.log('🗑️ Suppression des anciennes données...');
    
    // Supprimer les UserBadge existants
    const deletedUserBadges = await prisma.userBadge.deleteMany({});
    console.log(`   ✅ ${deletedUserBadges.count} UserBadge supprimés`);

    // Supprimer les RewardRedemption existants
    const deletedRedemptions = await prisma.rewardRedemption.deleteMany({});
    console.log(`   ✅ ${deletedRedemptions.count} RewardRedemption supprimés`);

    // Supprimer les PointTransaction existants
    const deletedTransactions = await prisma.pointTransaction.deleteMany({});
    console.log(`   ✅ ${deletedTransactions.count} PointTransaction supprimés`);

    // Supprimer les anciens Badge (si la table existe)
    try {
      const deletedBadges = await prisma.badge.deleteMany({});
      console.log(`   ✅ ${deletedBadges.count} Badge supprimés`);
    } catch (error) {
      if (error.code === 'P2021') {
        console.log(`   ⚠️ Table badges n'existe pas encore`);
      } else {
        throw error;
      }
    }

    // Supprimer les anciens Reward (si la table existe)
    try {
      const deletedRewards = await prisma.reward.deleteMany({});
      console.log(`   ✅ ${deletedRewards.count} Reward supprimés`);
    } catch (error) {
      if (error.code === 'P2021') {
        console.log(`   ⚠️ Table rewards n'existe pas encore`);
      } else {
        throw error;
      }
    }

    console.log('✅ Anciennes données supprimées !\n');

    console.log('🎉 Migration terminée avec succès !');
    console.log('💡 Vous pouvez maintenant exécuter: pnpm run db:push');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateAwardsSchema();

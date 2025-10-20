import prisma from '../src/config/database.js';

/**
 * Script pour peupler la base de données avec des badges et récompenses de base
 */
async function seedAwards() {
  console.log('🏆 Seeding des badges et récompenses...\n');

  try {
    // 1. Créer les badges de base
    const badges = [
      // Badges de lecture
      {
        name: "Premier Lecteur",
        description: "Tu as lu ton premier livre !",
        icon: "📚",
        category: "reading",
        rarity: "common",
        pointsRequired: 10
      },
      {
        name: "Lecteur Assidu",
        description: "Tu as lu 5 livres !",
        icon: "📖",
        category: "reading",
        rarity: "rare",
        pointsRequired: 50
      },
      {
        name: "Bibliophile",
        description: "Tu as lu 10 livres !",
        icon: "📚",
        category: "reading",
        rarity: "epic",
        pointsRequired: 100
      },
      {
        name: "Maître Lecteur",
        description: "Tu as lu 20 livres !",
        icon: "👑",
        category: "reading",
        rarity: "legendary",
        pointsRequired: 200
      },

      // Badges de tâches
      {
        name: "Premier Pas",
        description: "Tu as terminé ta première tâche !",
        icon: "👶",
        category: "tasks",
        rarity: "common",
        pointsRequired: 5
      },
      {
        name: "Travailleur",
        description: "Tu as terminé 10 tâches !",
        icon: "💪",
        category: "tasks",
        rarity: "rare",
        pointsRequired: 30
      },
      {
        name: "Champion",
        description: "Tu as terminé 50 tâches !",
        icon: "🏆",
        category: "tasks",
        rarity: "epic",
        pointsRequired: 150
      },
      {
        name: "Légende",
        description: "Tu as terminé 100 tâches !",
        icon: "🌟",
        category: "tasks",
        rarity: "legendary",
        pointsRequired: 300
      },

      // Badges de régularité
      {
        name: "Régulier",
        description: "Tu as travaillé 3 jours de suite !",
        icon: "🔥",
        category: "streak",
        rarity: "common",
        pointsRequired: 15
      },
      {
        name: "Persévérant",
        description: "Tu as travaillé 7 jours de suite !",
        icon: "⚡",
        category: "streak",
        rarity: "rare",
        pointsRequired: 35
      },
      {
        name: "Inébranlable",
        description: "Tu as travaillé 15 jours de suite !",
        icon: "💎",
        category: "streak",
        rarity: "epic",
        pointsRequired: 75
      },
      {
        name: "Invincible",
        description: "Tu as travaillé 30 jours de suite !",
        icon: "🚀",
        category: "streak",
        rarity: "legendary",
        pointsRequired: 150
      },

      // Badges spéciaux
      {
        name: "Premier Point",
        description: "Tu as gagné ton premier point !",
        icon: "⭐",
        category: "special",
        rarity: "common",
        pointsRequired: 1
      },
      {
        name: "Centurion",
        description: "Tu as atteint 100 points !",
        icon: "💯",
        category: "special",
        rarity: "rare",
        pointsRequired: 100
      },
      {
        name: "Millénaire",
        description: "Tu as atteint 1000 points !",
        icon: "🎯",
        category: "special",
        rarity: "legendary",
        pointsRequired: 1000
      }
    ];

    console.log(`📝 Création de ${badges.length} badges...`);
    for (const badge of badges) {
      try {
        await prisma.globalBadge.create({
          data: badge
        });
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`   ⚠️ Badge "${badge.name}" existe déjà`);
        } else {
          throw error;
        }
      }
    }
    console.log('✅ Badges créés !\n');

    // 2. Créer les récompenses de base
    const rewards = [
      // Récompenses jouets
      {
        name: "Jouet Surprise",
        description: "Un jouet surprise choisi par tes parents !",
        icon: "🎁",
        category: "toy",
        cost: 50
      },
      {
        name: "Nouveau Jouet",
        description: "Choisir un nouveau jouet !",
        icon: "🧸",
        category: "toy",
        cost: 100
      },
      {
        name: "Jouet Spécial",
        description: "Un jouet spécial que tu veux vraiment !",
        icon: "🎮",
        category: "toy",
        cost: 200
      },

      // Récompenses activités
      {
        name: "Sortie Cinéma",
        description: "Aller voir un film au cinéma !",
        icon: "🎬",
        category: "activity",
        cost: 75
      },
      {
        name: "Sortie Parc",
        description: "Une journée au parc d'attractions !",
        icon: "🎢",
        category: "activity",
        cost: 150
      },
      {
        name: "Sortie Restaurant",
        description: "Manger dans ton restaurant préféré !",
        icon: "🍕",
        category: "activity",
        cost: 100
      },

      // Récompenses privilèges
      {
        name: "Heure de Coucher +30min",
        description: "Se coucher 30 minutes plus tard !",
        icon: "🌙",
        category: "privilege",
        cost: 25
      },
      {
        name: "Choisir le Repas",
        description: "Choisir ce qu'on mange ce soir !",
        icon: "🍽️",
        category: "privilege",
        cost: 40
      },
      {
        name: "Temps Écran +1h",
        description: "Une heure d'écran supplémentaire !",
        icon: "📱",
        category: "privilege",
        cost: 60
      },
      {
        name: "Sortie avec Amis",
        description: "Inviter un ami à la maison !",
        icon: "👫",
        category: "privilege",
        cost: 80
      },

      // Récompenses spéciales
      {
        name: "Surprise Mystère",
        description: "Une surprise mystère de tes parents !",
        icon: "🎭",
        category: "special",
        cost: 120
      },
      {
        name: "Journée Spéciale",
        description: "Une journée entière rien que pour toi !",
        icon: "👑",
        category: "special",
        cost: 300
      }
    ];

    console.log(`🎁 Création de ${rewards.length} récompenses...`);
    for (const reward of rewards) {
      try {
        await prisma.globalReward.create({
          data: reward
        });
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`   ⚠️ Récompense "${reward.name}" existe déjà`);
        } else {
          throw error;
        }
      }
    }
    console.log('✅ Récompenses créées !\n');

    console.log('🎉 Seeding terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le seeding
seedAwards();

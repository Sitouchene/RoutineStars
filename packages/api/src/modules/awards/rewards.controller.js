import * as rewardsService from './rewards.service.js';

/**
 * Contrôleur pour les récompenses
 */

/**
 * Récupérer toutes les récompenses globales disponibles
 */
export async function getAllGlobalRewardsHandler(req, res) {
  try {
    const rewards = await rewardsService.getAllGlobalRewards();
    res.json(rewards);
  } catch (error) {
    console.error('Erreur lors de la récupération des récompenses globales:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer les récompenses globales par catégorie
 */
export async function getGlobalRewardsByCategoryHandler(req, res) {
  try {
    const { category } = req.params;
    const rewards = await rewardsService.getGlobalRewardsByCategory(category);
    res.json(rewards);
  } catch (error) {
    console.error('Erreur lors de la récupération des récompenses par catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer les récompenses d'un groupe
 */
export async function getGroupRewardsHandler(req, res) {
  try {
    const { groupId } = req.params;
    const rewards = await rewardsService.getGroupRewards(groupId);
    res.json(rewards);
  } catch (error) {
    console.error('Erreur lors de la récupération des récompenses du groupe:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Importer une récompense globale dans un groupe
 */
export async function importGlobalRewardHandler(req, res) {
  try {
    const { groupId } = req.params;
    const { globalRewardId } = req.body;
    const reward = await rewardsService.createGroupRewardFromGlobal(groupId, globalRewardId);
    res.json(reward);
  } catch (error) {
    console.error('Erreur lors de l\'import de la récompense:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Créer une récompense personnalisée pour un groupe
 */
export async function createCustomRewardHandler(req, res) {
  try {
    const { groupId } = req.params;
    const rewardData = req.body;
    const reward = await rewardsService.createCustomGroupReward(groupId, rewardData);
    res.json(reward);
  } catch (error) {
    console.error('Erreur lors de la création de la récompense personnalisée:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Mettre à jour une récompense de groupe
 */
export async function updateGroupRewardHandler(req, res) {
  try {
    const { rewardId } = req.params;
    const updates = req.body;
    const reward = await rewardsService.updateGroupReward(rewardId, updates);
    res.json(reward);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la récompense:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Activer/désactiver une récompense de groupe
 */
export async function toggleGroupRewardHandler(req, res) {
  try {
    const { rewardId } = req.params;
    const { isEnabled } = req.body;
    const reward = await rewardsService.toggleGroupReward(rewardId, isEnabled);
    res.json(reward);
  } catch (error) {
    console.error('Erreur lors du toggle de la récompense:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer les échanges d'un utilisateur
 */
export async function getUserRedemptionsHandler(req, res) {
  try {
    const { userId } = req.params;
    const redemptions = await rewardsService.getUserRedemptions(userId);
    res.json(redemptions);
  } catch (error) {
    console.error('Erreur lors de la récupération des échanges utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Échanger des points contre une récompense
 */
export async function redeemRewardHandler(req, res) {
  try {
    const { userId } = req.params;
    const { rewardId, childComment } = req.body;
    
    if (!rewardId) {
      return res.status(400).json({ error: 'ID de récompense requis' });
    }

    const redemption = await rewardsService.redeemReward(userId, rewardId, childComment);
    res.status(201).json(redemption);
  } catch (error) {
    console.error('Erreur lors de l\'échange de récompense:', error);
    if (error.message === 'Récompense non trouvée' || 
        error.message === 'Récompense non disponible' ||
        error.message === 'Points insuffisants' ||
        error.message === 'Utilisateur non trouvé') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
}

/**
 * Mettre à jour le statut d'un échange (pour les parents)
 */
export async function updateRedemptionStatusHandler(req, res) {
  try {
    const { redemptionId } = req.params;
    const { status, parentComment } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Statut requis' });
    }

    const redemption = await rewardsService.updateRedemptionStatus(redemptionId, status, parentComment);
    res.json(redemption);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut d\'échange:', error);
    if (error.message === 'Statut invalide') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
}

/**
 * Récupérer les échanges en attente pour un groupe (pour les parents)
 */
export async function getPendingRedemptionsHandler(req, res) {
  try {
    const { groupId } = req.params;
    const redemptions = await rewardsService.getPendingRedemptions(groupId);
    res.json(redemptions);
  } catch (error) {
    console.error('Erreur lors de la récupération des échanges en attente:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Obtenir les statistiques de récompenses d'un utilisateur
 */
export async function getRewardStatsHandler(req, res) {
  try {
    const { userId } = req.params;
    const stats = await rewardsService.getRewardStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de récompenses:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}


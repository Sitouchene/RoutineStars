import * as badgesService from './badges.service.js';

/**
 * Contrôleur pour les badges
 */

/**
 * Récupérer tous les badges globaux disponibles
 */
export async function getAllGlobalBadgesHandler(req, res) {
  try {
    const badges = await badgesService.getAllGlobalBadges();
    res.json(badges);
  } catch (error) {
    console.error('Erreur lors de la récupération des badges globaux:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer les badges d'un groupe
 */
export async function getGroupBadgesHandler(req, res) {
  try {
    const { groupId } = req.params;
    const badges = await badgesService.getGroupBadges(groupId);
    res.json(badges);
  } catch (error) {
    console.error('Erreur lors de la récupération des badges du groupe:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Importer un badge global dans un groupe
 */
export async function importGlobalBadgeHandler(req, res) {
  try {
    const { groupId } = req.params;
    const { globalBadgeId } = req.body;
    const badge = await badgesService.createGroupBadgeFromGlobal(groupId, globalBadgeId);
    res.json(badge);
  } catch (error) {
    console.error('Erreur lors de l\'import du badge:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Créer un badge personnalisé pour un groupe
 */
export async function createCustomBadgeHandler(req, res) {
  try {
    const { groupId } = req.params;
    const badgeData = req.body;
    const badge = await badgesService.createCustomGroupBadge(groupId, badgeData);
    res.json(badge);
  } catch (error) {
    console.error('Erreur lors de la création du badge personnalisé:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Mettre à jour un badge de groupe
 */
export async function updateGroupBadgeHandler(req, res) {
  try {
    const { badgeId } = req.params;
    const updates = req.body;
    const badge = await badgesService.updateGroupBadge(badgeId, updates);
    res.json(badge);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du badge:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Activer/désactiver un badge de groupe
 */
export async function toggleGroupBadgeHandler(req, res) {
  try {
    const { badgeId } = req.params;
    const { isEnabled } = req.body;
    const badge = await badgesService.toggleGroupBadge(badgeId, isEnabled);
    res.json(badge);
  } catch (error) {
    console.error('Erreur lors du toggle du badge:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Récupérer les badges d'un utilisateur
 */
export async function getUserBadgesHandler(req, res) {
  try {
    const { userId } = req.params;
    const badges = await badgesService.getUserBadges(userId);
    res.json(badges);
  } catch (error) {
    console.error('Erreur lors de la récupération des badges utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Débloquer manuellement un badge pour un utilisateur
 */
export async function unlockBadgeManuallyHandler(req, res) {
  try {
    const { userId, badgeId } = req.params;
    const userBadge = await badgesService.unlockBadgeManually(userId, badgeId);
    res.json(userBadge);
  } catch (error) {
    console.error('Erreur lors du déblocage manuel du badge:', error);
    if (error.message === 'Badge non trouvé' || error.message === 'Badge déjà débloqué') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
}

/**
 * Vérifier et débloquer automatiquement les badges
 */
export async function checkAndUnlockBadgesHandler(req, res) {
  try {
    const { userId } = req.params;
    const unlockedBadges = await badgesService.checkAndUnlockBadges(userId);
    res.json({ unlockedBadges });
  } catch (error) {
    console.error('Erreur lors de la vérification des badges:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Obtenir les statistiques de badges d'un utilisateur
 */
export async function getBadgeStatsHandler(req, res) {
  try {
    const { userId } = req.params;
    const stats = await badgesService.getBadgeStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de badges:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}


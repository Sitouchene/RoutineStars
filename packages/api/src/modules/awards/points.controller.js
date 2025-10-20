import * as pointsService from './points.service.js';

/**
 * Contrôleur pour les points
 */

/**
 * Récupérer l'historique des transactions d'un utilisateur
 */
export async function getUserPointTransactionsHandler(req, res) {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    const transactions = await pointsService.getUserPointTransactions(userId, parseInt(limit));
    res.json(transactions);
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Ajouter des points à un utilisateur
 */
export async function addPointsHandler(req, res) {
  try {
    const { userId } = req.params;
    const { amount, description, source, sourceId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant requis et doit être positif' });
    }

    if (!description) {
      return res.status(400).json({ error: 'Description requise' });
    }

    const transaction = await pointsService.addPoints(userId, amount, description, source, sourceId);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de points:', error);
    if (error.message === 'Le montant doit être positif') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
}

/**
 * Dépenser des points d'un utilisateur
 */
export async function spendPointsHandler(req, res) {
  try {
    const { userId } = req.params;
    const { amount, description, source, sourceId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant requis et doit être positif' });
    }

    if (!description) {
      return res.status(400).json({ error: 'Description requise' });
    }

    const transaction = await pointsService.spendPoints(userId, amount, description, source, sourceId);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erreur lors de la dépense de points:', error);
    if (error.message === 'Le montant doit être positif' || 
        error.message === 'Points insuffisants' ||
        error.message === 'Utilisateur non trouvé') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
}

/**
 * Obtenir le solde de points d'un utilisateur
 */
export async function getUserBalanceHandler(req, res) {
  try {
    const { userId } = req.params;
    const balance = await pointsService.getUserBalance(userId);
    res.json({ balance });
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    if (error.message === 'Utilisateur non trouvé') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
}

/**
 * Obtenir les statistiques de points d'un utilisateur
 */
export async function getPointStatsHandler(req, res) {
  try {
    const { userId } = req.params;
    const stats = await pointsService.getPointStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de points:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}

/**
 * Ajouter des points bonus
 */
export async function addBonusPointsHandler(req, res) {
  try {
    const { userId } = req.params;
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant requis et doit être positif' });
    }

    if (!description) {
      return res.status(400).json({ error: 'Description requise' });
    }

    const transaction = await pointsService.addBonusPoints(userId, amount, description);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de points bonus:', error);
    if (error.message === 'Le montant doit être positif') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
}


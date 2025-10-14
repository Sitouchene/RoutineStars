import * as statsService from './stats.service.js';
import prisma from '../../config/database.js';
import { z } from 'zod';

/**
 * GET /api/stats/child/:childId/daily/:date
 */
export async function getChildDailyStatsController(req, res, next) {
  try {
    const { childId, date } = req.params;
    
    // Vérifier que l'enfant appartient à la famille du parent
    if (req.user.role === 'parent') {
      const child = await prisma.user.findFirst({
        where: {
          id: childId,
          groupId: req.user.groupId,
          role: 'child',
        },
      });
      
      if (!child) {
        return res.status(403).json({ error: 'Accès non autorisé à cet enfant' });
      }
    } else if (req.user.role === 'child' && req.user.id !== childId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const stats = await statsService.getChildDailyStats(childId, date);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/stats/child/:childId/weekly/:startDate
 */
export async function getChildWeeklyStatsController(req, res, next) {
  try {
    const { childId, startDate } = req.params;
    
    // Vérifier que l'enfant appartient à la famille du parent
    if (req.user.role === 'parent') {
      const child = await prisma.user.findFirst({
        where: {
          id: childId,
          groupId: req.user.groupId,
          role: 'child',
        },
      });
      
      if (!child) {
        return res.status(403).json({ error: 'Accès non autorisé à cet enfant' });
      }
    } else if (req.user.role === 'child' && req.user.id !== childId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const stats = await statsService.getChildWeeklyStats(childId, startDate);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/stats/child/:childId/monthly/:year/:month
 */
export async function getChildMonthlyStatsController(req, res, next) {
  try {
    const { childId, year, month } = req.params;
    
    // Vérifier que l'enfant appartient à la famille du parent
    if (req.user.role === 'parent') {
      const child = await prisma.user.findFirst({
        where: {
          id: childId,
          groupId: req.user.groupId,
          role: 'child',
        },
      });
      
      if (!child) {
        return res.status(403).json({ error: 'Accès non autorisé à cet enfant' });
      }
    } else if (req.user.role === 'child' && req.user.id !== childId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const stats = await statsService.getChildMonthlyStats(childId, parseInt(year), parseInt(month));
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/stats/family/:startDate/:endDate
 */
export async function getGroupStatsController(req, res, next) {
  try {
    const { startDate, endDate } = req.params;
    
    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Accès réservé aux parents' });
    }

    const stats = await statsService.getGroupStats(req.user.groupId, startDate, endDate);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

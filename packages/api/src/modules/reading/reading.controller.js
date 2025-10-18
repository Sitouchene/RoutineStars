import * as readingService from './reading.service.js';

/**
 * POST /api/reading/assign
 * Assigner une lecture à un enfant
 */
export async function assignReadingHandler(req, res) {
  try {
    const { id: assignedById } = req.user;
    const assignmentData = {
      ...req.body,
      assignedById
    };
    
    const assignments = await readingService.assignReading(assignmentData);
    res.status(201).json(assignments);
  } catch (error) {
    console.error('Error assigning reading:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * GET /api/reading/child/:childId
 * Obtenir les lectures d'un enfant
 */
export async function getChildReadingsHandler(req, res) {
  try {
    const { childId } = req.params;
    const filters = {
      assignmentType: req.query.assignmentType,
      isFinished: req.query.isFinished
    };
    
    const readings = await readingService.getChildReadings(childId, filters);
    res.json(readings);
  } catch (error) {
    console.error('Error fetching child readings:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /api/reading/:id/progress
 * Mettre à jour la progression
 */
export async function updateProgressHandler(req, res) {
  try {
    const { id } = req.params;
    const { currentPage } = req.body;
    
    if (currentPage === undefined || currentPage < 0) {
      return res.status(400).json({ error: 'Page courante invalide' });
    }
    
    const progress = await readingService.updateProgress(id, currentPage);
    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * PUT /api/reading/:id/finish
 * Marquer comme terminé
 */
export async function finishReadingHandler(req, res) {
  try {
    const { id } = req.params;
    const progress = await readingService.finishReading(id);
    res.json(progress);
  } catch (error) {
    console.error('Error finishing reading:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * GET /api/reading/child/:childId/stats
 * Statistiques de lecture
 */
export async function getReadingStatsHandler(req, res) {
  try {
    const { childId } = req.params;
    const stats = await readingService.getReadingStats(childId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching reading stats:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/reading/:id
 * Obtenir une assignation spécifique
 */
export async function getReadingAssignmentHandler(req, res) {
  try {
    const { id } = req.params;
    const assignment = await readingService.getReadingAssignment(id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignation non trouvée' });
    }
    
    res.json(assignment);
  } catch (error) {
    console.error('Error fetching reading assignment:', error);
    res.status(500).json({ error: error.message });
  }
}


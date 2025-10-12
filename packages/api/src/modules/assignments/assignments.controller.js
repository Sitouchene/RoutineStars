import * as assignmentsService from './assignments.service.js';
import { z } from 'zod';

const taskAssignmentSchema = z.object({
  taskTemplateId: z.string().uuid(),
  childId: z.string().uuid(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  isActive: z.boolean().default(true),
});

const updateAssignmentSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)').optional(),
  isActive: z.boolean().optional(),
});

/**
 * POST /api/assignments
 */
export async function createAssignmentController(req, res, next) {
  try {
    const validatedData = taskAssignmentSchema.parse(req.body);
    const assignment = await assignmentsService.createTaskAssignment(validatedData);
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assignments
 */
export async function getFamilyAssignmentsController(req, res, next) {
  try {
    const assignments = await assignmentsService.getFamilyAssignments(req.user.familyId);
    res.json(assignments);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assignments/child/:childId
 */
export async function getChildAssignmentsController(req, res, next) {
  try {
    const assignments = await assignmentsService.getChildAssignments(req.params.childId);
    res.json(assignments);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/assignments/:id
 */
export async function updateAssignmentController(req, res, next) {
  try {
    const validatedData = updateAssignmentSchema.parse(req.body);
    const assignment = await assignmentsService.updateTaskAssignment(
      req.params.id,
      req.user.familyId,
      validatedData
    );
    res.json(assignment);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/assignments/:id
 */
export async function deleteAssignmentController(req, res, next) {
  try {
    const result = await assignmentsService.deleteTaskAssignment(
      req.params.id,
      req.user.familyId
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/assignments/generate-daily/:childId
 */
export async function generateDailyTasksController(req, res, next) {
  try {
    const { date } = req.body;
    const tasks = await assignmentsService.generateDailyTasksFromAssignments(
      req.params.childId,
      date || new Date()
    );
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

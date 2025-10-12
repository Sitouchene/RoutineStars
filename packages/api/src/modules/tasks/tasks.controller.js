import * as tasksService from './tasks.service.js';
import {
  taskTemplateSchema,
  parentValidationSchema,
} from 'shared/validators';
import { z } from 'zod';

// Schéma pour l'autoévaluation (seulement le score)
const selfEvaluateSchema = z.object({
  score: z.number().int().min(0).max(100),
});

// Schéma pour la validation parent (seulement score et commentaire)
const validateTaskSchema = z.object({
  score: z.number().int().min(0).max(100),
  comment: z.string().max(500).optional(),
});

/**
 * POST /api/tasks/templates
 */
export async function createTaskTemplateController(req, res, next) {
  try {
    const validatedData = taskTemplateSchema.parse(req.body);
    const taskTemplate = await tasksService.createTaskTemplate({
      familyId: req.user.familyId,
      ...validatedData,
    });
    res.status(201).json(taskTemplate);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/templates
 */
export async function getTaskTemplatesController(req, res, next) {
  try {
    const templates = await tasksService.getTaskTemplates(req.user.familyId);
    res.json(templates);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/tasks/templates/:id
 */
export async function updateTaskTemplateController(req, res, next) {
  try {
    const template = await tasksService.updateTaskTemplate(
      req.params.id,
      req.user.familyId,
      req.body
    );
    res.json(template);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/tasks/templates/:id
 */
export async function deleteTaskTemplateController(req, res, next) {
  try {
    const result = await tasksService.deleteTaskTemplate(
      req.params.id,
      req.user.familyId
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks/generate-daily/:childId
 */
export async function generateDailyTasksController(req, res, next) {
  try {
    const { date } = req.body;
    const tasks = await tasksService.generateDailyTasks(
      req.params.childId,
      date || new Date()
    );
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/child/:childId
 */
export async function getChildTasksController(req, res, next) {
  try {
    const { date } = req.query;
    const tasks = await tasksService.getChildTasks(
      req.params.childId,
      date || new Date()
    );
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks/:id/self-evaluate
 */
export async function selfEvaluateTaskController(req, res, next) {
  try {
    const validatedData = selfEvaluateSchema.parse(req.body);
    const task = await tasksService.selfEvaluateTask(
      req.params.id,
      req.user.id,
      validatedData.score
    );
    res.json(task);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks/:id/validate
 */
export async function validateTaskController(req, res, next) {
  try {
    const validatedData = validateTaskSchema.parse(req.body);
    const task = await tasksService.validateTask(
      req.params.id,
      req.user.familyId,
      validatedData.score,
      validatedData.comment
    );
    res.json(task);
  } catch (error) {
    next(error);
  }
}

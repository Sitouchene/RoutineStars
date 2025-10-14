import * as submissionsService from './submissions.service.js';
import { z } from 'zod';

// Schéma pour la validation parentale
const validateSubmissionSchema = z.object({
  parentComment: z.string().min(1, 'Le commentaire est requis').max(500),
});

/**
 * POST /api/submissions/submit
 */
export async function submitDayController(req, res, next) {
  try {
    const { date } = req.body;
    const submission = await submissionsService.submitDay(req.user.id, date);
    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/submissions/child
 */
export async function getChildSubmissionsController(req, res, next) {
  try {
    const { limit } = req.query;
    const submissions = await submissionsService.getChildSubmissions(
      req.user.id,
      limit ? parseInt(limit) : 30
    );
    res.json(submissions);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/submissions/family
 */
export async function getGroupSubmissionsController(req, res, next) {
  try {
    const { limit } = req.query;
    const submissions = await submissionsService.getGroupSubmissions(
      req.user.groupId,
      limit ? parseInt(limit) : 30
    );
    res.json(submissions);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/submissions/:id/validate
 */
export async function validateSubmissionController(req, res, next) {
  try {
    const validatedData = validateSubmissionSchema.parse(req.body);
    const submission = await submissionsService.validateSubmission(
      req.params.id,
      req.user.groupId,
      validatedData.parentComment
    );
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/submissions/:id/details
 */
export async function getSubmissionDetailsController(req, res, next) {
  try {
    const details = await submissionsService.getSubmissionDetails(
      req.params.id,
      req.user.groupId
    );
    res.json(details);
  } catch (error) {
    next(error);
  }
}

import express from 'express';
import * as controller from './book-templates.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/templates', authenticate, controller.getBookTemplatesHandler);
router.post('/templates/:templateId/import', authenticate, controller.importBookTemplateHandler);

export default router;

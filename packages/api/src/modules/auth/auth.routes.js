import { Router } from 'express';
import * as authController from './auth.controller.js';

const router = Router();

// Routes parent
router.post('/parent/register', authController.registerParentController);
router.post('/parent/login', authController.loginParentController);

// Routes enfant
router.post('/child/login', authController.loginChildController);

// Routes génériques pour la nouvelle interface
router.post('/register', authController.registerController);
router.post('/login', authController.loginController);
router.post('/login-child', authController.loginChildController);

export default router;



import { Router } from 'express';

import { authenticate } from 'middleware/authenticate';

import authController from './auth.controller';

const router = Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.use(authenticate);

router.post('/refresh', authController.refresh);

export default router;

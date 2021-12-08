import { Router } from 'express';

import cameraController from './camera.controller';

const router = Router();

router.post('/register', cameraController.registerCamera);
router.post('/add', cameraController.addCamera);

export default router;

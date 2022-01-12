import { Router } from 'express';

import { rateLimiter } from '/middleware/rateLimiter';

import cameraController from './camera.controller';

const router = Router();

router.get('/owned', cameraController.getOwnedCameras);
router.get('/used', cameraController.getUsedCameras);
router.post('/register', rateLimiter, cameraController.registerCamera);
router.post('/add', rateLimiter, cameraController.addCamera);
router.put('/edit/:id', cameraController.editCamera);
router.delete('/remove/:id', cameraController.removeCamera);
router.delete('/removeperm/:id', cameraController.removePermCamera);

export default router;

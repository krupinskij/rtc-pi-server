import { Router } from 'express';

import cameraController from './camera.controller';

const router = Router();

router.get('/owned', cameraController.getOwnedCameras);
router.get('/used', cameraController.getUsedCameras);
router.post('/register', cameraController.registerCamera);
router.post('/add', cameraController.addCamera);
router.delete('/remove/:id', cameraController.removeCamera);
router.post('/removeperm/:id', cameraController.removePermCamera);

export default router;

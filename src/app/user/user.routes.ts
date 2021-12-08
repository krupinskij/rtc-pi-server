import { Router } from 'express';

import userController from './user.controller';

const router = Router();

router.get('/camera', userController.getCameras);

export default router;

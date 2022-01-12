import { Router } from 'express';

import userController from './user.controller';

const router = Router();

router.put('/edit', userController.editUser);

export default router;

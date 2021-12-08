import { Camera } from 'app/camera/camera.types';
import { HttpException } from 'exception';
import { Response } from 'express';
import { AuthRequest } from 'model';
import userService from './user.service';

const getCameras = async (req: AuthRequest, res: Response<Camera[] | string>) => {
  const user = req.user;

  try {
    const cameras = await userService.getCameras(user);

    res.send(cameras);
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
      return;
    }

    res.status(500).send(error.message);
  }
};

export default {
  getCameras,
};

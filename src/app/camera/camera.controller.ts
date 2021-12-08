import { HttpException } from 'exception';
import { Response } from 'express';
import { AuthRequest } from 'model';
import cameraService from './camera.service';
import { NewCameraInput, Camera } from './camera.types';

const getCameras = async (req: AuthRequest, res: Response<Camera[] | string>) => {
  const user = req.user;

  try {
    const cameras = await cameraService.getCameras(user);

    res.send(cameras);
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
      return;
    }

    res.status(500).send(error.message);
  }
};

const registerCamera = async (req: AuthRequest<NewCameraInput>, res: Response<Camera | string>) => {
  const newCameraInput = req.body;
  const user = req.user;

  try {
    const camera = await cameraService.registerCamera(newCameraInput, user);

    res.send(camera);
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
      return;
    }

    res.status(500).send(error.message);
  }
};

const addCamera = async (req: AuthRequest<NewCameraInput>, res: Response<Camera | string>) => {
  const newCameraInput = req.body;
  const user = req.user;

  try {
    const camera = await cameraService.addCamera(newCameraInput, user);

    res.send(camera);
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
  registerCamera,
  addCamera,
};

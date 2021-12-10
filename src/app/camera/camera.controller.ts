import { HttpException } from 'exception';
import { Response } from 'express';
import { AuthRequest } from 'model';
import cameraService from './camera.service';
import { Camera, CameraRegisterInput, CameraCode, CameraAddInput } from './camera.types';

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

const registerCamera = async (
  req: AuthRequest<CameraRegisterInput>,
  res: Response<CameraCode | string>
) => {
  const cameraRegisterInput = req.body;
  const user = req.user;

  try {
    const cameraCode = await cameraService.registerCamera(cameraRegisterInput, user);

    res.send(cameraCode);
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
      return;
    }

    res.status(500).send(error.message);
  }
};

const addCamera = async (req: AuthRequest<CameraAddInput>, res: Response<Camera | string>) => {
  const cameraAddInput = req.body;
  const user = req.user;

  try {
    const camera = await cameraService.addCamera(cameraAddInput, user);

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

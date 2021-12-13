import { HttpException } from 'exception';
import { Response } from 'express';
import { AuthRequest } from 'model';
import { validate } from 'utils';
import cameraService from './camera.service';
import { CameraRegisterInput, CameraCode, CameraAddInput, CameraDTO } from './camera.types';
import { cameraAddValidator, cameraRegisterValidator } from './camera.validation';

const getOwnedCameras = async (req: AuthRequest, res: Response<CameraDTO[] | string>) => {
  const user = req.user;

  try {
    const cameras = await cameraService.getOwnedCameras(user);

    res.send(cameras);
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
      return;
    }

    res.status(500).send(error.message);
  }
};

const getUsedCameras = async (req: AuthRequest, res: Response<CameraDTO[] | string>) => {
  const user = req.user;

  try {
    const cameras = await cameraService.getUsedCameras(user);

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
    validate(cameraRegisterInput, cameraRegisterValidator);
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

const addCamera = async (req: AuthRequest<CameraAddInput>, res: Response<CameraDTO | string>) => {
  const cameraAddInput = req.body;
  const user = req.user;

  try {
    validate(cameraAddInput, cameraAddValidator);
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
  getOwnedCameras,
  getUsedCameras,
  registerCamera,
  addCamera,
};

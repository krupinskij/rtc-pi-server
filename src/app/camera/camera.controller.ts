import { HttpException } from 'exception';
import { AuthRequest, Response } from 'model';
import { validate } from 'utils';
import cameraService from './camera.service';
import { CameraRegisterInput, CameraCode, CameraAddInput, CameraDTO } from './camera.types';
import { cameraAddValidator, cameraRegisterValidator } from './camera.validation';

const getOwnedCameras = async (req: AuthRequest, res: Response<CameraDTO[]>) => {
  const user = req.user;

  try {
    const cameras = await cameraService.getOwnedCameras(user);

    res.send(cameras);
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message, authRetry });
      return;
    }

    res.status(500).send({ message, stack });
  }
};

const getUsedCameras = async (req: AuthRequest, res: Response<CameraDTO[]>) => {
  const user = req.user;

  try {
    const cameras = await cameraService.getUsedCameras(user);

    res.send(cameras);
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message, authRetry });
      return;
    }

    res.status(500).send({ message, stack });
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
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message, authRetry });
      return;
    }

    res.status(500).send({ message, stack });
  }
};

const addCamera = async (req: AuthRequest<CameraAddInput>, res: Response<CameraDTO>) => {
  const cameraAddInput = req.body;
  const user = req.user;

  try {
    validate(cameraAddInput, cameraAddValidator);
    const camera = await cameraService.addCamera(cameraAddInput, user);

    res.send(camera);
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message, authRetry });
      return;
    }

    res.status(500).send({ message, stack });
  }
};

export default {
  getOwnedCameras,
  getUsedCameras,
  registerCamera,
  addCamera,
};

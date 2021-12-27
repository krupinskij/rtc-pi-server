import { HttpException } from 'exception';
import { AuthRequest, Response } from 'model';
import { validate } from 'utils';
import cameraService from './camera.service';
import {
  CameraRegisterInput,
  CameraCode,
  CameraAddInput,
  CameraDTO,
  CameraRemovePermInput,
  CameraEditInput,
} from './camera.types';
import {
  cameraAddValidator,
  cameraEditValidator,
  cameraRegisterValidator,
  cameraRemovePermValidator,
} from './camera.validation';

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

const editCamera = async (
  req: AuthRequest<CameraEditInput, { id: string }>,
  res: Response<void>
) => {
  const user = req.user;
  const id = req.params.id;
  const cameraEditInput = req.body;

  try {
    validate(cameraEditInput, cameraEditValidator);
    await cameraService.editCamera(id, cameraEditInput, user);

    res.send();
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message, authRetry });
      return;
    }

    res.status(500).send({ message, stack });
  }
};

const removeCamera = async (req: AuthRequest<void, { id: string }>, res: Response<void>) => {
  const user = req.user;
  const id = req.params.id;

  try {
    await cameraService.removeCamera(id, user);

    res.send();
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message, authRetry });
      return;
    }

    res.status(500).send({ message, stack });
  }
};

const removePermCamera = async (
  req: AuthRequest<CameraRemovePermInput, { id: string }>,
  res: Response<void>
) => {
  const user = req.user;
  const id = req.params.id;
  const cameraRemovePermInput = req.body;

  try {
    validate(cameraRemovePermInput, cameraRemovePermValidator);
    await cameraService.removePermCamera(id, cameraRemovePermInput, user);

    res.send();
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
  editCamera,
  removeCamera,
  removePermCamera,
};

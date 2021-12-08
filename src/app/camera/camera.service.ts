import { User } from 'app/user/user.types';
import { BadRequestException, UnauthorizedException } from 'exception';
import ConflictException from 'exception/conflict.exception';
import { generateHash, validateHash } from 'utils';
import cameraModel from './camera.model';
import { Camera, NewCameraInput } from './camera.types';

const getCameras = async (user?: User | null): Promise<Camera[]> => {
  if (!user) {
    throw new UnauthorizedException('User does not exists');
  }

  const cameras = await cameraModel.find({ users: { $in: [user] } });

  return cameras;
};

const registerCamera = async (
  newCameraInput: NewCameraInput,
  user?: User | null
): Promise<Camera> => {
  if (!user) {
    throw new UnauthorizedException('User does not exists');
  }

  const { code, password } = newCameraInput;

  const existingCamera = await cameraModel.findOne({ code });

  if (!!existingCamera) {
    throw new ConflictException('Camera already exists');
  }

  const hashedPassword = await generateHash(password, 10);

  const camera = await cameraModel.create({
    code,
    password: hashedPassword,
    owner: user,
    users: [user],
  });

  return camera;
};

const addCamera = async (newCameraInput: NewCameraInput, user?: User | null): Promise<Camera> => {
  if (!user) {
    throw new UnauthorizedException('User does not exists');
  }

  const { code, password } = newCameraInput;

  const existingCamera = await cameraModel.findOne({ code });

  if (!existingCamera) {
    throw new BadRequestException("Camera doesn't exist");
  }

  const isPasswordCorrect = await validateHash(password, existingCamera.password);

  if (!isPasswordCorrect) {
    throw new BadRequestException('Password or code is not correct');
  }

  const existingCameraWithUsers = await existingCamera.populate('users');
  const isUserHaveCamera = existingCameraWithUsers.users.find((u) => u._id === user._id);

  if (!isUserHaveCamera) {
    throw new BadRequestException('You already own this camera');
  }

  existingCameraWithUsers.users.push(user);

  return existingCameraWithUsers.save();
};

export default {
  getCameras,
  registerCamera,
  addCamera,
};

import { User } from 'app/user/user.types';
import { BadRequestException, UnauthorizedException } from 'exception';
import { generateHash, validateHash } from 'utils';
import cameraModel from './camera.model';
import { Camera, CameraAddInput, CameraCode, CameraRegisterInput } from './camera.types';
import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import userModel from 'app/user/user.model';

const getOwnedCameras = async (user?: User | null): Promise<Camera[]> => {
  if (!user) {
    throw new UnauthorizedException('User does not exists');
  }

  const existingUserWithCameras = await userModel.findById(user._id).populate('ownedCameras');

  return existingUserWithCameras.ownedCameras;
};

const getUsedCameras = async (user?: User | null): Promise<Camera[]> => {
  if (!user) {
    throw new UnauthorizedException('User does not exists');
  }

  const existingUserWithCameras = await userModel.findById(user._id).populate('usedCameras');

  return existingUserWithCameras.usedCameras;
};

const registerCamera = async (
  cameraRegisterInput: CameraRegisterInput,
  user?: User | null
): Promise<CameraCode> => {
  if (!user) {
    throw new UnauthorizedException('User does not exists');
  }

  const { name, password } = cameraRegisterInput;

  let code: string;
  let isCodeOccupied = true;
  const nanoid = customAlphabet(nolookalikes, 10);
  do {
    code = nanoid();
    isCodeOccupied = await cameraModel.exists({ code });
  } while (isCodeOccupied);

  const hashedPassword = await generateHash(password, 10);

  const newCamera = await cameraModel.create({
    name,
    code,
    password: hashedPassword,
    owner: user,
    users: [user],
  });
  await userModel.findByIdAndUpdate(user._id, { $push: { ownedCameras: newCamera._id } });

  return { code };
};

const addCamera = async (addCameraInput: CameraAddInput, user?: User | null): Promise<Camera> => {
  if (!user) {
    throw new UnauthorizedException('User does not exists');
  }

  const { code, password } = addCameraInput;

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

  if (isUserHaveCamera) {
    throw new BadRequestException('You already have this camera');
  }

  existingCameraWithUsers.users.push(user);
  await userModel.findByIdAndUpdate(user._id, { $push: { usedCameras: existingCamera._id } });

  return existingCameraWithUsers.save();
};

export default {
  getOwnedCameras,
  getUsedCameras,
  registerCamera,
  addCamera,
};

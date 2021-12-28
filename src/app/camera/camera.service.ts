import { User } from 'app/user/user.types';
import { BadRequestException, UnauthorizedException } from 'exception';
import { generateHash, validateHash } from 'utils';
import cameraModel from './camera.model';
import {
  CameraAddInput,
  CameraCode,
  CameraDTO,
  CameraEditInput,
  CameraRegisterInput,
  CameraRemovePermInput,
} from './camera.types';
import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import userModel from 'app/user/user.model';
import { mapToDTO } from './camera.utils';

const getOwnedCameras = async (user?: User | null): Promise<CameraDTO[]> => {
  if (!user) {
    throw new UnauthorizedException('user.not-logged', true);
  }

  const existingUserWithCameras = await userModel.findById(user._id).populate('ownedCameras');

  return existingUserWithCameras.ownedCameras.map(mapToDTO);
};

const getUsedCameras = async (user?: User | null): Promise<CameraDTO[]> => {
  if (!user) {
    throw new UnauthorizedException('user.not-logged', true);
  }

  const existingUserWithCameras = await userModel.findById(user._id).populate('usedCameras');

  return existingUserWithCameras.usedCameras.map(mapToDTO);
};

const registerCamera = async (
  cameraRegisterInput: CameraRegisterInput,
  user?: User | null
): Promise<CameraCode> => {
  if (!user) {
    throw new UnauthorizedException('user.not-logged', true);
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

const addCamera = async (
  addCameraInput: CameraAddInput,
  user?: User | null
): Promise<CameraDTO> => {
  if (!user) {
    throw new UnauthorizedException('user.not-logged', true);
  }

  const { code, password } = addCameraInput;

  const existingCamera = await cameraModel.findOne({ code });

  if (!existingCamera) {
    throw new BadRequestException('incorrect.code-password');
  }

  const isPasswordCorrect = await validateHash(password, existingCamera.password);

  if (!isPasswordCorrect) {
    throw new BadRequestException('incorrect.code-password');
  }

  const existingCameraWithUsers = await existingCamera.populate('users');
  const isUserHaveCamera = existingCameraWithUsers.users.find((u) => u._id == user._id);

  if (isUserHaveCamera) {
    throw new BadRequestException('camera.already-have');
  }

  existingCameraWithUsers.users.push(user);
  await userModel.findByIdAndUpdate(user._id, { $push: { usedCameras: existingCamera._id } });
  await existingCameraWithUsers.save();

  return mapToDTO(existingCameraWithUsers);
};

const editCamera = async (id: string, editCameraInput: CameraEditInput, user?: User | null) => {
  if (!user) {
    throw new UnauthorizedException('user.not-logged', true);
  }

  const existingCamera = await cameraModel.findById(id);
  if (!existingCamera) {
    throw new BadRequestException('incorrect.camera-password');
  }

  const { newName, newPassword, password } = editCameraInput;

  const isPasswordCorrect = await validateHash(password, existingCamera.password);
  if (!isPasswordCorrect) {
    throw new BadRequestException('incorrect.camera-password');
  }

  if (newName) {
    existingCamera.name = newName;
  }

  if (newPassword) {
    const hashedPassword = await generateHash(newPassword, 10);
    existingCamera.password = hashedPassword;
  }

  await existingCamera.save();
};

const removeCamera = async (id: string, user?: User | null) => {
  if (!user) {
    throw new UnauthorizedException('user.not-logged', true);
  }

  const existingCamera = await cameraModel.findById(id);
  if (!existingCamera) {
    throw new BadRequestException('camera.not-exists');
  }

  const existingCameraWithUsers = await existingCamera.populate('users');
  const isUserHaveCamera = existingCameraWithUsers.users.find((u) => u._id == user._id);
  if (!isUserHaveCamera) {
    throw new UnauthorizedException('camera.not-have', false);
  }

  const existingUserWithCameras = await userModel.findById(user._id).populate('usedCameras');
  const isUserUsingCamera = existingUserWithCameras.usedCameras.find((c) => c._id == id);
  if (!isUserUsingCamera) {
    throw new UnauthorizedException('camera.not-have', false);
  }

  existingCameraWithUsers.users = existingCameraWithUsers.users.filter((u) => u._id != user._id);
  await existingCameraWithUsers.save();

  existingUserWithCameras.usedCameras = existingUserWithCameras.usedCameras.filter(
    (c) => c._id != id
  );
  await existingUserWithCameras.save();
};

const removePermCamera = async (
  id: string,
  removePermCameraInput: CameraRemovePermInput,
  user?: User | null
) => {
  if (!user) {
    throw new UnauthorizedException('user.not-logged', true);
  }

  const { password } = removePermCameraInput;

  const existingCamera = await cameraModel.findById(id);
  if (!existingCamera) {
    throw new BadRequestException('incorrect.camera-password');
  }

  const isPasswordCorrect = await validateHash(password, existingCamera.password);
  if (!isPasswordCorrect) {
    throw new BadRequestException('incorrect.camera-password');
  }

  const isUserAnOwner = existingCamera.owner._id == user._id;
  if (!isUserAnOwner) {
    throw new UnauthorizedException('camera.not-owner', false);
  }

  const existingCameraWithUsers = await existingCamera.populate('users');

  await userModel.updateMany(
    { _id: { $in: existingCameraWithUsers.users.map((user) => user._id) } },
    { $pull: { ownedCameras: id } }
  );

  const existingUserWithOwnedCameras = await userModel.findById(user._id).populate('ownedCameras');
  existingUserWithOwnedCameras.ownedCameras = existingUserWithOwnedCameras.ownedCameras.filter(
    (camera) => camera._id != id
  );
  await existingUserWithOwnedCameras.save();

  await existingCamera.delete();
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

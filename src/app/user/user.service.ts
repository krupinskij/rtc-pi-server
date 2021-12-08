import cameraModel from 'app/camera/camera.model';
import { Camera } from 'app/camera/camera.types';
import { UnauthorizedException } from 'exception';
import userModel from './user.model';
import { User, UserToSave } from './user.types';

const findById = async (id: string): Promise<User | null> => {
  return await userModel.findById(id);
};

const findByEmail = async (email: string): Promise<User | null> => {
  return await userModel.findOne({ email });
};

const createUser = async (userToSave: UserToSave): Promise<User> => {
  return await userModel.create(userToSave);
};

const getCameras = async (user?: User | null): Promise<Camera[]> => {
  if (!user) {
    throw new UnauthorizedException('User does not exists');
  }

  const userWithCamera = await userModel.findById(user._id).populate('cameras');

  return userWithCamera.cameras;
};

export default {
  findById,
  findByEmail,
  createUser,
  getCameras,
};

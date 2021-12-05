import { User, UserToSave } from './user.types';
import userModel from './user.model';

const findById = async (id: string): Promise<User> => {
  return await userModel.findById(id);
};

const findByEmail = async (email: string): Promise<User> => {
  return await userModel.findOne({ email });
};

const createUser = async (userToSave: UserToSave): Promise<User> => {
  return await userModel.create(userToSave);
};

export default {
  findById,
  findByEmail,
  createUser,
};

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

export default {
  findById,
  findByEmail,
  createUser,
};

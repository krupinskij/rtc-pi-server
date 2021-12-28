import { UnauthorizedException } from 'exception';
import { generateHash, validateHash } from 'utils';
import userModel from './user.model';
import { EditUserInput, User, UserToSave } from './user.types';

const findById = async (id: string): Promise<User | null> => {
  return await userModel.findById(id);
};

const findByEmail = async (email: string): Promise<User | null> => {
  return await userModel.findOne({ email });
};

const createUser = async (userToSave: UserToSave): Promise<User> => {
  return await userModel.create(userToSave);
};

const editUser = async (editUserInput: EditUserInput, user?: User | null) => {
  if (!user) {
    throw new UnauthorizedException('user.not-logged', true);
  }

  const existingUser = await userModel.findById(user._id);
  if (!existingUser) {
    throw new UnauthorizedException('user.not-logged', true);
  }

  const { newPassword, password } = editUserInput;

  const isPasswordCorrect = await validateHash(password, existingUser.password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedException('incorrect.password', false);
  }

  const hashedPassword = await generateHash(newPassword, 10);
  existingUser.password = hashedPassword;

  return await existingUser.save();
};

export default {
  findById,
  findByEmail,
  createUser,
  editUser,
};

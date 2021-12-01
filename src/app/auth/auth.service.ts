import { RegisterInput, Token } from './auth.types';

import userService from '../user/user.service';
import bcrypt from 'bcrypt';
import { User } from '../user/user.types';
import jwt from 'jsonwebtoken';
import config from '../../config';

const signToken = (user: User): Token => {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  return { token: jwt.sign(payload, config.JWT_SECRET) };
};

const register = async (registerInput: RegisterInput): Promise<Token> => {
  const { email, password } = registerInput;
  const existingUser = await userService.findByEmail(email);

  if (existingUser) {
    throw new Error(`Cannot register with email ${email}`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userService.createUser({
    ...registerInput,
    password: hashedPassword,
  });

  return signToken(user);
};

export default {
  register,
};

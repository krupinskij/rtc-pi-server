import { LoginInput, RegisterInput, Token } from './auth.types';

import userService from '../user/user.service';
import bcrypt from 'bcrypt';
import { User } from '../user/user.types';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { BadRequestException, UnauthorizedException } from '../../exception';

const signToken = (user: User): Token => {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  return { token: jwt.sign(payload, config.JWT_SECRET, { expiresIn: '5m' }) };
};

const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

const register = async (registerInput: RegisterInput): Promise<Token> => {
  const { email, password } = registerInput;
  const existingUser = await userService.findByEmail(email);

  if (existingUser) {
    throw new BadRequestException(`Cannot register with email ${email}`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userService.createUser({
    ...registerInput,
    password: hashedPassword,
  });

  return signToken(user);
};

const login = async (loginInput: LoginInput): Promise<Token> => {
  const { email, password } = loginInput;
  const existingUser = await userService.findByEmail(email);

  if (!existingUser) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isUserValid = await validatePassword(password, existingUser.password);
  if (!isUserValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return signToken(existingUser);
};

const refresh = async (user?: User): Promise<Token> => {
  if (!user) {
    throw new UnauthorizedException("User doesn't exists");
  }

  return signToken(user);
};

export default {
  register,
  login,
  refresh,
};

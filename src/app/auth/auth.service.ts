import { BadRequestException, UnauthorizedException } from 'exception';

import userService from '../user/user.service';
import { User } from '../user/user.types';
import { LoginInput, RegisterInput, Tokens } from './auth.types';
import { generateHash, signAccessToken, signRefreshToken, validatePassword } from './utils';

const register = async (registerInput: RegisterInput): Promise<Tokens> => {
  const { email, password } = registerInput;
  const existingUser = await userService.findByEmail(email);

  if (existingUser) {
    throw new BadRequestException(`Cannot register with email ${email}`);
  }

  const hashedPassword = await generateHash(password);

  const user = await userService.createUser({
    ...registerInput,
    password: hashedPassword,
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    csrfToken: await generateHash(user._id, 1),
  };
};

const login = async (loginInput: LoginInput): Promise<Tokens> => {
  const { email, password } = loginInput;
  const existingUser = await userService.findByEmail(email);

  if (!existingUser) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isUserValid = await validatePassword(password, existingUser.password);
  if (!isUserValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return {
    accessToken: signAccessToken(existingUser),
    refreshToken: signRefreshToken(existingUser),
    csrfToken: await generateHash(existingUser._id, 1),
  };
};

const refresh = async (user?: User): Promise<Tokens> => {
  if (!user) {
    throw new UnauthorizedException("User doesn't exists");
  }

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    csrfToken: await generateHash(user._id, 1),
  };
};

export default {
  register,
  login,
  refresh,
};

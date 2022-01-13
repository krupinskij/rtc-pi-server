import userModel from '@app/user/user.model';
import userService from '@app/user/user.service';
import { User } from '@app/user/user.types';
import { BadRequestException, UnauthorizedException } from '/exception';
import { generateHash, signAccessToken, signRefreshToken, validateHash } from '/utils';

import { LoginInput, RegisterInput, Tokens } from './auth.types';

const register = async (registerInput: RegisterInput): Promise<Tokens> => {
  const { email, password } = registerInput;

  const isUserFromEmail = await userModel.exists({ email });
  if (isUserFromEmail) {
    throw new BadRequestException('user.exists.email');
  }

  const hashedPassword = await generateHash(password, 10);

  const user = await userService.createUser({
    ...registerInput,
    password: hashedPassword,
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    csrfToken: await generateHash(user._id.toString(), 1),
  };
};

const login = async (loginInput: LoginInput): Promise<Tokens> => {
  const { email, password } = loginInput;
  const existingUser = await userService.findByEmail(email);

  if (!existingUser) {
    throw new UnauthorizedException('incorrect.email-password', false);
  }

  const isUserValid = await validateHash(password, existingUser.password);
  if (!isUserValid) {
    throw new UnauthorizedException('incorrect.email-password', false);
  }

  return {
    accessToken: signAccessToken(existingUser),
    refreshToken: signRefreshToken(existingUser),
    csrfToken: await generateHash(existingUser._id.toString(), 1),
  };
};

const refresh = async (user?: User | null): Promise<Tokens> => {
  if (!user) {
    throw new UnauthorizedException('error.logout', true);
  }

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    csrfToken: await generateHash(user._id.toString(), 1),
  };
};

export default {
  register,
  login,
  refresh,
};

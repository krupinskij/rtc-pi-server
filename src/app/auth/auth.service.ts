import { BadRequestException, UnauthorizedException } from 'exception';

import userService from '../user/user.service';
import { User } from '../user/user.types';
import { LoginInput, RegisterInput, Tokens } from './auth.types';
import { generateHash, signAccessToken, signRefreshToken, validateHash } from 'utils';

const register = async (registerInput: RegisterInput): Promise<Tokens> => {
  const { email, password } = registerInput;
  const existingUser = await userService.findByEmail(email);

  if (existingUser) {
    throw new BadRequestException('Użytkownik o takim emailu już istnieje');
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
    throw new UnauthorizedException('Nieodpowiedni email lub hasło');
  }

  const isUserValid = await validateHash(password, existingUser.password);
  if (!isUserValid) {
    throw new UnauthorizedException('Nieodpowiedni email lub hasło');
  }

  return {
    accessToken: signAccessToken(existingUser),
    refreshToken: signRefreshToken(existingUser),
    csrfToken: await generateHash(existingUser._id.toString(), 1),
  };
};

const refresh = async (user?: User | null): Promise<Tokens> => {
  if (!user) {
    throw new UnauthorizedException('Wystąpił błąd. Nastąpi wylogowanie...');
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

import HttpException from 'exception/http.exception';
import { AuthRequest, Request, Response } from 'model';

import authService from './auth.service';
import { LoginInput, RegisterInput, HeaderTokens, Tokens } from './auth.types';

const login = async (req: Request<LoginInput>, res: Response<HeaderTokens | string>) => {
  const loginInput = req.body;

  try {
    const { accessToken, refreshToken, csrfToken } = await authService.login(loginInput);

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000,
    });
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).send({ accessToken, csrfToken });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
    }

    res.status(500).send(error.message);
  }
};

const register = async (req: Request<RegisterInput>, res: Response<HeaderTokens | string>) => {
  const registerInput = req.body;

  try {
    const { accessToken, refreshToken, csrfToken } = await authService.register(registerInput);

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000,
    });
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).send({ accessToken, csrfToken });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
    }

    res.status(500).send(error.message);
  }
};

const refresh = async (req: AuthRequest, res: Response<HeaderTokens | string>) => {
  const user = req.user;

  try {
    const { accessToken, refreshToken, csrfToken } = await authService.refresh(user);

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000,
    });
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).send({ accessToken, csrfToken });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
    }

    res.status(500).send(error.message);
  }
};

export default {
  login,
  register,
  refresh,
};

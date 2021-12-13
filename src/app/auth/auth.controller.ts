import HttpException from 'exception/http.exception';
import { AuthRequest, Request, Response } from 'model';
import { validate } from 'utils';

import authService from './auth.service';
import { LoginInput, RegisterInput, HeaderTokens } from './auth.types';
import { loginValidator, registerValidator } from './auth.validation';

const login = async (req: Request<LoginInput>, res: Response<HeaderTokens | string>) => {
  const loginInput = req.body;

  try {
    validate(loginInput, loginValidator);
    const { accessToken, refreshToken, csrfToken } = await authService.login(loginInput);

    res
      .cookie('access-token', accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      .cookie('refresh-token', refreshToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken, csrfToken });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
      return;
    }

    res.status(500).send(error.message);
  }
};

const register = async (req: Request<RegisterInput>, res: Response<HeaderTokens | string>) => {
  const registerInput = req.body;

  try {
    validate(registerInput, registerValidator);
    const { accessToken, refreshToken, csrfToken } = await authService.register(registerInput);

    res
      .cookie('access-token', accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      .cookie('refresh-token', refreshToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken, csrfToken });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
      return;
    }

    res.status(500).send(error.message);
  }
};

const refresh = async (req: AuthRequest, res: Response<HeaderTokens | string>) => {
  const user = req.user;

  try {
    const { accessToken, refreshToken, csrfToken } = await authService.refresh(user);

    res
      .cookie('access-token', accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      .cookie('refresh-token', refreshToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken, csrfToken });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
      return;
    }

    res.status(500).send(error.message);
  }
};

export default {
  login,
  register,
  refresh,
};

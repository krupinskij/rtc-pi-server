import { HttpException } from '/exception';
import { AuthRequest, Request, Response } from '/model';
import { validate } from '/utils';

import authService from './auth.service';
import { LoginInput, RegisterInput, HeaderTokens } from './auth.types';
import { loginValidator, registerValidator } from './auth.validation';

const login = async (req: Request<LoginInput>, res: Response<HeaderTokens>) => {
  const loginInput = req.body;

  try {
    validate(loginInput, loginValidator);
    const { accessToken, refreshToken, csrfToken } = await authService.login(loginInput);

    res
      .cookie('access-token', accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .cookie('refresh-token', refreshToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .send({ accessToken, csrfToken });
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      console.log(req.i18n.resolvedLanguage);
      console.log(req.i18n.getResourceBundle(req.i18n.resolvedLanguage, 'translation'));
      console.log(req.i18n.getResourceBundle('pl', 'translation'));
      res.status(error.httpStatus).send({ message: req.t(message), authRetry });
      return;
    }

    res.status(500).send({ message, stack });
  }
};

const register = async (req: Request<RegisterInput>, res: Response<HeaderTokens>) => {
  const registerInput = req.body;

  try {
    validate(registerInput, registerValidator);
    const { accessToken, refreshToken, csrfToken } = await authService.register(registerInput);

    res
      .cookie('access-token', accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .cookie('refresh-token', refreshToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .send({ accessToken, csrfToken });
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message: req.t(message), authRetry });
      return;
    }

    res.status(500).send({ message, stack });
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
        sameSite: 'none',
      })
      .cookie('refresh-token', refreshToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .send({ accessToken, csrfToken });
  } catch (error: any) {
    const { message, stack, authRetry } = error;
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send({ message: req.t(message), authRetry });
      return;
    }

    res.status(500).send({ message, stack });
  }
};

export default {
  login,
  register,
  refresh,
};

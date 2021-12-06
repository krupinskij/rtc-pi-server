import HttpException from 'exception/http.exception';
import { AuthRequest, Request, Response } from 'model';

import authService from './auth.service';
import { LoginInput, RegisterInput, Token } from './auth.types';

const login = async (req: Request<LoginInput>, res: Response<Token | string>) => {
  const loginInput = req.body;

  try {
    const userToken = await authService.login(loginInput);
    res.status(200).send(userToken);
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
    }

    res.status(500).send(error.message);
  }
};

const register = async (req: Request<RegisterInput>, res: Response<Token | string>) => {
  const registerInput = req.body;

  try {
    const userToken = await authService.register(registerInput);
    res.status(200).send(userToken);
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.httpStatus).send(error.message);
    }

    res.status(500).send(error.message);
  }
};

const refresh = async (req: AuthRequest, res: Response<Token | string>) => {
  const user = req.user;

  try {
    const userToken = await authService.refresh(user);
    res.status(200).send(userToken);
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

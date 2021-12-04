import { Request, RequestHandler, Response } from 'express';

import { LoginInput, RegisterInput, Token } from './auth.types';
import authService from './auth.service';

const login: RequestHandler<{}, Token, LoginInput> = async (req: Request, res: Response) => {
  const loginInput = req.body;

  try {
    const userToken = await authService.login(loginInput);
    res.status(200).send(userToken);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

const register: RequestHandler<{}, Token, RegisterInput> = async (req, res) => {
  const registerInput = req.body;

  try {
    const userToken = await authService.register(registerInput);
    res.status(200).send(userToken);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export default {
  login,
  register,
};

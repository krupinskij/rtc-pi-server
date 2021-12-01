import { Request, RequestHandler, Response } from 'express';

import { RegisterInput, Token } from './auth.types';
import authService from './auth.service';

const login: RequestHandler = async (req: Request, res: Response) => {
  console.log('Zalogowany');

  res.status(200).send('OK');
};

const register: RequestHandler<{}, Token, RegisterInput> = async (req, res) => {
  const registerInput = req.body;
  const userToken = await authService.register(registerInput);

  res.status(200).send(userToken);
};

export default {
  login,
  register,
};

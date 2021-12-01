import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  console.log('Zalogowany');

  res.status(200).send('OK');
};

export const register = async (req: Request, res: Response) => {
  console.log('Zarejestrowany');

  res.status(200).send('OK');
};

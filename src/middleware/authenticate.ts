import config from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, TokenPayload } from 'model';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    try {
      req.user = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    } catch (err) {}
  }

  next();
};

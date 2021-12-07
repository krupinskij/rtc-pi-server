import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { validateHash } from 'app/auth/utils';
import userService from 'app/user/user.service';
import config from 'config';
import { AuthRequest, AccessTokenPayload, RefreshTokenPayload } from 'model';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['access-token'];
  const refreshToken = req.cookies['refresh-token'];

  const csrfToken = req.headers['x-csrf-token'] as string;

  if (accessToken && refreshToken && csrfToken) {
    try {
      const user = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
      const isUserValid = await validateHash(user._id, csrfToken);

      if (isUserValid) {
        req.user = user;
      }
    } catch (err) {
      const { _id } = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
      const user = await userService.findById(_id);

      const isUserValid = await validateHash(_id, csrfToken);

      if (isUserValid) {
        req.user = user;
      }
    }
  }

  next();
};

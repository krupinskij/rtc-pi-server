import { User } from 'app/user/user.types';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';
import { BadRequestException } from 'exception';

import { ObjectSchema } from 'joi';

export const signAccessToken = (user: User): string => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
};

export const signRefreshToken = (user: User): string => {
  const payload = {
    _id: user._id,
  };

  return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
};

export const validateHash = async (data: string, hashedData: string): Promise<boolean> => {
  return bcrypt.compare(data, hashedData);
};

export const generateHash = async (data: string, saltRound: number = 10): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRound);
  const hashedData = await bcrypt.hash(data, salt);

  return hashedData;
};

export const validate = (body: any, validator: ObjectSchema): void => {
  const { error } = validator.validate(body);

  if (!!error) throw new BadRequestException('error.wrong-format');
};

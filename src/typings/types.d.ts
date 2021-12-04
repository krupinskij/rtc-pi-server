import * as core from 'express-serve-static-core';
import * as qs from 'qs';
import { Request, Response } from 'express';
import { User } from '../app/user/user.types';
import jwt from 'jsonwebtoken';

export interface TokenPayload extends User, jwt.JwtPayload {}

export interface AuthRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request {
  user?: User;
}

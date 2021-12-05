import * as core from 'express-serve-static-core';
import qs from 'qs';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { User } from '../app/user/user.types';
import jwt from 'jsonwebtoken';

export interface TokenPayload extends User, jwt.JwtPayload {}

export interface Request<ReqBody = any, ReqParams = core.ParamsDictionary>
  extends ExpressRequest<ReqParams, any, ReqBody, qs.ParsedQs, Record<string, any>> {}

export interface AuthRequest<ReqBody = any, ReqParams = core.ParamsDictionary>
  extends Request<ReqBody, ReqParams> {
  user?: User;
}

export interface Response<ResBody = any> extends ExpressResponse<ResBody, Record<string, any>> {}

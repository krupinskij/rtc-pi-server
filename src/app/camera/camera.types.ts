import { User } from 'app/user/user.types';

export type CameraRegisterInput = {
  name: string;
  password: string;
};

export type CameraAddInput = {
  code: string;
  password: string;
};

export type Camera = {
  _id: string;
  name: string;
  code: string;
  password: string;
  sid: string;
  owner: User;
  users: User[];
};

export type CameraCode = {
  code: string;
};

export type CameraDTO = {
  _id: string;
  name: string;
  sid: string;
};

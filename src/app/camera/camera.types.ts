import { User } from 'app/user/user.types';

export type CameraRegisterInput = {
  password: string;
};

export type CameraAddInput = {
  code: string;
  password: string;
};

export type Camera = {
  _id: string;
  code: string;
  password: string;
  owner: User;
  users: User[];
};

export type CameraCode = {
  code: string;
};

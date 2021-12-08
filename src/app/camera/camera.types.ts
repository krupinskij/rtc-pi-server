import { User } from 'app/user/user.types';

export type NewCameraInput = {
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

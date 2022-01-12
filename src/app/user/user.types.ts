import { Camera } from 'app/camera/camera.types';

export type User = {
  readonly _id: string;
  readonly email: string;
  password: string;
  ownedCameras: Camera[];
  usedCameras: Camera[];
};

export type UserToSave = {
  readonly email: string;
  readonly password: string;
};

export type EditUserInput = {
  newPassword: string;
  password: string;
};

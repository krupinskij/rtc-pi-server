export type User = {
  readonly _id: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  ownedCameras: Camera[];
  usedCameras: Camera[];
};

export type UserToSave = {
  readonly email: string;
  readonly username: string;
  readonly password: string;
};

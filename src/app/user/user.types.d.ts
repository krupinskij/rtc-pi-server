export type User = {
  readonly _id: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly ownedCameras: Camera[];
  readonly usedCameras: Camera[];
};

export type UserToSave = {
  readonly email: string;
  readonly username: string;
  readonly password: string;
};

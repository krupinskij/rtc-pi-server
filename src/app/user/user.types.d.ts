export type User = {
  readonly _id: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly cameras: Camera[];
};

export type UserToSave = {
  readonly email: string;
  readonly username: string;
  readonly password: string;
};

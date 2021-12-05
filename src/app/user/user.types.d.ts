export type User = {
  readonly _id: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
};

export type UserToSave = {
  readonly email: string;
  readonly username: string;
  readonly password: string;
};

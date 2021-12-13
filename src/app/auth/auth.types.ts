export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type HeaderTokens = {
  accessToken: string;
  csrfToken: string;
};

export type Tokens = HeaderTokens & {
  refreshToken: string;
};

import dotenv from 'dotenv';

dotenv.config();

const config = {
  CONNECTION_STRING: process.env.CONNECTION_STRING || '',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'default_access_jwt_secret',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'default_refresh_jwt_secret',
  PORT: process.env.PORT || 3030,
  ORIGIN: process.env.ORIGIN || '*',
};

export default config;

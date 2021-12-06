import dotenv from 'dotenv';

dotenv.config();

const config = {
  CONNECTION_STRING: process.env.CONNECTION_STRING || '',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  PORT: process.env.PORT || 3030,
};

export default config;

import dotenv from 'dotenv';

dotenv.config();

const config = {
  CONNECTION_STRING: process.env.CONNECTION_STRING || '',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
};

export default config;

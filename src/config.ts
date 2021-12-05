import { config } from 'dotenv';

config();

export default {
  CONNECTION_STRING: process.env.CONNECTION_STRING || '',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
};

import express from 'express';
import authRouter from './app/auth/_routes';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import config from './config';

mongoose
  .connect(config.CONNECTION_STRING)
  .then(() => console.log('connection succesful'))
  .catch(err => console.error(err));

const app = express();

app.use(json());

app.use('/api/auth', authRouter);

app.listen(3000, () => {
  console.log(`App started on port 3000`);
});

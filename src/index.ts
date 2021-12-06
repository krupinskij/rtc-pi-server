import express from 'express';
import authRouter from './app/auth/_routes';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import config from './config';
import cors from 'cors';

const CONNECTION_STRING = config.CONNECTION_STRING;
const PORT = config.PORT;

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log('Connection established succesfully'))
  .catch(err => console.error(err));

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(json());

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

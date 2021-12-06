import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import authRouter from './app/auth/_routes';
import config from './config';

const CONNECTION_STRING = config.CONNECTION_STRING;
const PORT = config.PORT;

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log('Connection established succesfully'))
  .catch((err) => console.error(err));

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

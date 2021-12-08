import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import authRouter from './app/auth/_routes';
import cameraRouter from './app/camera/camera.routes';
import userRouter from './app/user/user.routes';
import config from './config';

const CONNECTION_STRING = config.CONNECTION_STRING;
const PORT = config.PORT;
const ORIGIN = config.ORIGIN;

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log('Connection established succesfully'))
  .catch((err) => console.error(err));

const app = express();
app.use(json());
app.use(cookieParser());

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/camera', cameraRouter);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

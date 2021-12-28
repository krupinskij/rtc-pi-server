import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { authenticate } from 'middleware/authenticate';
import mongoose from 'mongoose';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';

import authRouter from './app/auth/auth.routes';
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

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/locales/{{lng}}.json',
    },
    fallbackLng: 'pl',
    load: 'languageOnly',
  });

const app = express();
app.use(json());
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

app.use('/api/auth', authRouter);

app.use(authenticate);
app.use('/api/user', userRouter);
app.use('/api/camera', cameraRouter);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

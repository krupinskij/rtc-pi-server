import 'ts-path-mapping';

import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';

import authRouter from '@app/auth/auth.routes';
import cameraRouter from '@app/camera/camera.routes';
import cameraService from '@app/camera/camera.service';
import userRouter from '@app/user/user.routes';
import { authenticate } from '@middleware/authenticate';

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
    methods: 'GET,PUT,POST,DELETE',
    preflightContinue: true,
    credentials: true,
  })
);

app.use('/api/auth', authRouter);

app.use(authenticate);
app.use('/api/user', userRouter);
app.use('/api/camera', cameraRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ORIGIN,
  },
});

io.on('connection', (socket: Socket) => {
  console.log(`Connection established with socket ${socket.id}`);

  socket.on('save-code', async (code) => {
    await cameraService.saveCameraSID(code, socket.id);
  });

  socket.on('get-offer-from-server', async (cameraId) => {
    const sid = await cameraService.getCameraSID(cameraId);
    console.log(sid, cameraId);

    if (!sid) return;

    socket.to(sid).emit('get-offer-from-camera', socket.id);
  });

  socket.on('send-offer-to-server', (userId, offer) => {
    socket.to(userId).emit('send-offer-to-client', offer);
  });

  socket.on('send-answer-to-server', async (cameraId, answer) => {
    const sid = await cameraService.getCameraSID(cameraId);

    if (!sid) return;

    socket.to(sid).emit('send-answer-to-camera', socket.id, answer);
  });
});

server.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

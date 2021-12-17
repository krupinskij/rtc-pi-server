import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { authenticate } from 'middleware/authenticate';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import authRouter from './app/auth/auth.routes';
import cameraRouter from './app/camera/camera.routes';
import userRouter from './app/user/user.routes';
import config from './config';
import cameraService from 'app/camera/camera.service';

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

app.use(authenticate);
app.use('/api/user', userRouter);
app.use('/api/camera', cameraRouter);

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket: Socket) => {
  console.log(`Connection established with socket ${socket.id}`);

  socket.on('save-code', async (code) => {
    await cameraService.saveCameraSID(code, socket.id);
  });

  socket.on('get-offer-from-server', async (code) => {
    const sid = await cameraService.getCameraSID(code);

    if (!sid) return;

    socket.to(sid).emit('get-offer-from-camera', socket.id);
  });

  socket.on('send-offer-to-server', (userId, offer) => {
    socket.to(userId).emit('send-offer-to-client', offer);
  });

  socket.on('send-answer-to-server', async (code, answer) => {
    const sid = await cameraService.getCameraSID(code);

    if (!sid) return;

    socket.to(sid).emit('send-answer-to-camera', socket.id, answer);
  });
});

server.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

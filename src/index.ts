import express from 'express';
import authRouter from './auth/auth.routes';

const app = express();

app.use('/api/auth', authRouter);

app.listen(3000, () => {
  console.log(`App started on port 3000`);
});

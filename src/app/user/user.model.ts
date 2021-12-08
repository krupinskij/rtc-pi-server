import mongoose from 'mongoose';
import { User } from './user.types';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  cameras: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camera',
    },
  ],
});

export default mongoose.model<User>('User', userSchema);

import mongoose from 'mongoose';
import { Camera } from './camera.types';

const cameraSchema = new mongoose.Schema({
  code: String,
  password: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default mongoose.model<Camera>('Camera', cameraSchema);

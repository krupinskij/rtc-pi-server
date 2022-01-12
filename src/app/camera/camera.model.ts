import mongoose from 'mongoose';
import { Camera } from './camera.types';

const cameraSchema = new mongoose.Schema({
  name: String,
  code: String,
  password: String,
  sid: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model<Camera>('Camera', cameraSchema);

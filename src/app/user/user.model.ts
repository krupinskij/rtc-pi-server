import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
});

export default mongoose.model('User', userSchema);

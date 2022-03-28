import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: String,
  name: { type: String, required: true },
  location: String,
  socialOnly: { type: Boolean },
  avatarUrl: String,
});

userSchema.pre('save', async function () {
  console.log(`before hashing password: ${this.password}`);
  this.password = await bcrypt.hash(this.password, 5);
  console.log(`after hashing password: ${this.password}`);
});

const User = mongoose.model('User', userSchema);

export default User;

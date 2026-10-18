import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
});

adminSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

adminSchema.statics.createWithPassword = async function (email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return this.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email, passwordHash },
    { upsert: true, new: true }
  );
};

export default mongoose.model('Admin', adminSchema);

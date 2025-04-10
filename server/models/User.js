import mongoose from 'mongoose';

const absenceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  note: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'teacher', 'parent', 'student'],
    default: 'student'
  },
  absences: [absenceSchema], 
});

const User = mongoose.model('User', userSchema);
export default User;

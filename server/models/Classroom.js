import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  startTime: String, 
  endTime: String
});

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  schedule: [timeSlotSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Classroom = mongoose.model('Classroom', classSchema);
export default Classroom;

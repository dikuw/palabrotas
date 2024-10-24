import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  lastActivityDate: {
    type: Date,
    required: 'You must supply a last activity date'
  },
  length: {
    type: Number,
    required: true,
    default: 1
  },
}, { timestamps: true });

const Streak = mongoose.model('Streak', streakSchema);

export default Streak;
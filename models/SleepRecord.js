const mongoose = require('mongoose')

const SleepRecordSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Please provide date of your sleep record.'],
    },
    time: {
      type: Number,
      required: [true, 'Please provide time in hours.'],
      maxlength: 48,
    },
    result: {
      type: String,
      enum: ['slept very well', 'good sleep', 'bad sleep', 'didn not sleep at all'],
      default: 'good sleep',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user.'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('SleepRecord', SleepRecordSchema)
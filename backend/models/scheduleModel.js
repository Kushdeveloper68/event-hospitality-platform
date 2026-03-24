const mongoose = require('mongoose');

const scheduleActivitySchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  workstream: {
    type: String,
    enum: ['Main Sessions', 'Transport', 'Catering', 'Staffing', 'Media/AV'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: String
  },
  assignedTo: {
    type: String
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled', 'Active'],
    default: 'Confirmed'
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('ScheduleActivity', scheduleActivitySchema);

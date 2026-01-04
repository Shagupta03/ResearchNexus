// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  SuperVisor: { type: String, required: true },
  Gmail: { type: String, required: true, unique: true },
  Group_id: { type: Number, required: true },
  studentId: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },

  // New fields for activity tracking
  dailyActivity: [
    {
      date: { type: String }, // YYYY-MM-DD
      minutesSpent: { type: Number, default: 0 }
    }
  ],
  weeklySummary: { type: Number, default: 0 } // total minutes for last 7 days
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);

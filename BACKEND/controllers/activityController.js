// controllers/activityController.js
const Student = require('../models/Student');

// Update student activity
exports.updateActivity = async (req, res) => {
  try {
    const { email, minutesSpent } = req.body;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const student = await Student.findOne({ Gmail: email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const todayActivity = student.dailyActivity.find(a => a.date === today);

    if (todayActivity) {
      todayActivity.minutesSpent += minutesSpent;
    } else {
      student.dailyActivity.push({ date: today, minutesSpent });
    }

    await student.save();
    res.status(200).json({ message: 'Activity updated', dailyActivity: student.dailyActivity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get weekly summary
exports.getWeeklySummary = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await Student.findOne({ Gmail: email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10);
    });

    const weeklyMinutes = student.dailyActivity
      .filter(a => last7Days.includes(a.date))
      .reduce((sum, a) => sum + a.minutesSpent, 0);

    student.weeklySummary = weeklyMinutes;
    await student.save();

    res.status(200).json({ weeklySummary: weeklyMinutes, dailyActivity: student.dailyActivity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

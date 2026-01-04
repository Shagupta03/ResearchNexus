// routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Update activity (POST from frontend every few minutes or on logout)
router.post('/update', activityController.updateActivity);

// Get weekly summary
router.get('/weekly/:email', activityController.getWeeklySummary);

module.exports = router;

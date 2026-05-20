const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getSchedulesByEventId,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleControllers');
const authMiddleware = require('../middlewares/authMiddleware');

// Base URL: /api/schedules
router.post('/', authMiddleware, createSchedule);
router.get('/event/:eventId', authMiddleware, getSchedulesByEventId);
router.put('/:id', authMiddleware, updateSchedule);
router.delete('/:id', authMiddleware, deleteSchedule);

module.exports = router;
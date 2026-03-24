const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getSchedulesByEventId,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleControllers');

// Base URL: /api/schedules
router.post('/', createSchedule);
router.get('/event/:eventId', getSchedulesByEventId);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;

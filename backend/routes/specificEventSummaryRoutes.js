const express = require("express");
const router = express.Router();
const {
  handleGetEventSummary,
  handleGetEventKPIs,
} = require("../controllers/specificEventSummaryController");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes protected
router.use(authMiddleware);

// GET /api/event-summary/:eventId  — full dashboard data
router.get("/:eventId", handleGetEventSummary);

// GET /api/event-summary/:eventId/kpis  — lightweight KPI refresh
router.get("/:eventId/kpis", handleGetEventKPIs);

module.exports = router;
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  handleGetFullDashboard,
  handleGetMetrics,
  handleGetRecentActivity,
  handleGetUpcomingEvents,
  handleGetActiveEventStats,
} = require("../controllers/mainOprationDashboardController");

// All routes require authentication
router.use(authMiddleware);

// GET /api/main-dashboard  — full dashboard in one shot
router.get("/", handleGetFullDashboard);

// GET /api/main-dashboard/metrics  — KPI counts only
router.get("/metrics", handleGetMetrics);

// GET /api/main-dashboard/recent-activity  — activity feed
router.get("/recent-activity", handleGetRecentActivity);

// GET /api/main-dashboard/upcoming-events  — events table
router.get("/upcoming-events", handleGetUpcomingEvents);

// GET /api/main-dashboard/active-events  — live event stats
router.get("/active-events", handleGetActiveEventStats);

module.exports = router;
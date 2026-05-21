const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  handleGetFullAnalytics,
  handleGetKPIs,
  handleGetCheckInTrend,
  handleGetRegistrationTrend,
  handleGetServiceBreakdown,
  handleGetRoomOccupancy,
  handleGetTransportAnalytics,
  handleGetTeamAnalytics,
  handleGetActivityAnalytics,
  handleGetTopEvents,
  handleGetVIPAnalytics,
} = require("../controllers/organizationAnalyticsDashboardsController");

// All routes protected by JWT auth
router.use(authMiddleware);

// ── Full payload (initial page load) ──────────────────────────────────────────
// GET /api/org-analytics/full?startDate=&endDate=
router.get("/full", handleGetFullAnalytics);

// ── Individual section endpoints (lazy / refresh) ─────────────────────────────
// GET /api/org-analytics/kpis?startDate=&endDate=
router.get("/kpis", handleGetKPIs);

// GET /api/org-analytics/checkin-trend?months=12
router.get("/checkin-trend", handleGetCheckInTrend);

// GET /api/org-analytics/registration-trend?months=12
router.get("/registration-trend", handleGetRegistrationTrend);

// GET /api/org-analytics/services
router.get("/services", handleGetServiceBreakdown);

// GET /api/org-analytics/rooms
router.get("/rooms", handleGetRoomOccupancy);

// GET /api/org-analytics/transport
router.get("/transport", handleGetTransportAnalytics);

// GET /api/org-analytics/team
router.get("/team", handleGetTeamAnalytics);

// GET /api/org-analytics/activity
router.get("/activity", handleGetActivityAnalytics);

// GET /api/org-analytics/top-events?limit=10
router.get("/top-events", handleGetTopEvents);

// GET /api/org-analytics/vip
router.get("/vip", handleGetVIPAnalytics);

module.exports = router;
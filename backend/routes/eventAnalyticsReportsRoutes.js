const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  handleGetFullReport,
  handleGetGuestAnalytics,
  handleGetRoomAnalytics,
  handleGetServiceAnalytics,
  handleGetTransportAnalytics,
  handleGetTeamAnalytics,
  handleGetScheduleAnalytics,
  handleGetActivityAnalytics,
  handleExportGuests,
  handleExportServices,
  handleExportTransport,
  handleExportWorkbook,
} = require("../controllers/eventAnalyticsReportsController");

// All routes protected
router.use(authMiddleware);

// ── Full report (initial page load) ──────────────────────────────────────────
// GET /api/event-analytics/:eventId/full
router.get("/:eventId/full", handleGetFullReport);

// ── Individual section endpoints ──────────────────────────────────────────────
// GET /api/event-analytics/:eventId/guests
router.get("/:eventId/guests", handleGetGuestAnalytics);

// GET /api/event-analytics/:eventId/rooms
router.get("/:eventId/rooms", handleGetRoomAnalytics);

// GET /api/event-analytics/:eventId/services
router.get("/:eventId/services", handleGetServiceAnalytics);

// GET /api/event-analytics/:eventId/transport
router.get("/:eventId/transport", handleGetTransportAnalytics);

// GET /api/event-analytics/:eventId/team
router.get("/:eventId/team", handleGetTeamAnalytics);

// GET /api/event-analytics/:eventId/schedule
router.get("/:eventId/schedule", handleGetScheduleAnalytics);

// GET /api/event-analytics/:eventId/activity
router.get("/:eventId/activity", handleGetActivityAnalytics);

// ── CSV Export endpoints ───────────────────────────────────────────────────────
// GET /api/event-analytics/:eventId/export/guests
router.get("/:eventId/export/guests", handleExportGuests);

// GET /api/event-analytics/:eventId/export/services
router.get("/:eventId/export/services", handleExportServices);

// GET /api/event-analytics/:eventId/export/transport
router.get("/:eventId/export/transport", handleExportTransport);

// GET /api/event-analytics/:eventId/export/workbook
router.get("/:eventId/export/workbook", handleExportWorkbook);

module.exports = router;
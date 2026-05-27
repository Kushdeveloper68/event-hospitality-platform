const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  handleGetActivityLogs,
  handleGetSummary,
  handleGetTypes,
} = require("../controllers/activityAndNotificationLogsControllers");

// All routes protected
router.use(authMiddleware);

// GET /api/activity-logs               — paginated list with filters
router.get("/", handleGetActivityLogs);

// GET /api/activity-logs/summary       — counts & stats (BEFORE /:id patterns)
router.get("/summary", handleGetSummary);

// GET /api/activity-logs/types         — distinct types for filter dropdown
router.get("/types", handleGetTypes);

module.exports = router;
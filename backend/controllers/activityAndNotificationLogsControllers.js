const {
  getActivityLogs,
  getActivitySummary,
  getDistinctTypes,
} = require("../services/activityAndNotificationLogsServices");

/**
 * GET /api/activity-logs
 * Query params: eventId, type, priority, search, startDate, endDate, page, limit
 */
const handleGetActivityLogs = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      eventId,
      type,
      priority,
      search,
      startDate,
      endDate,
      page,
      limit,
    } = req.query;

    const result = await getActivityLogs(userId, {
      eventId,
      type,
      priority,
      search,
      startDate,
      endDate,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    if (error.message?.includes("Forbidden")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch activity logs",
    });
  }
};

/**
 * GET /api/activity-logs/summary
 * Query params: eventId
 */
const handleGetSummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { eventId } = req.query;
    const summary = await getActivitySummary(userId, eventId || null);

    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching activity summary:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch summary",
    });
  }
};

/**
 * GET /api/activity-logs/types
 * Returns distinct activity types for the user's events (for filter dropdown)
 */
const handleGetTypes = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const types = await getDistinctTypes(userId);
    return res.status(200).json({ success: true, types });
  } catch (error) {
    console.error("Error fetching activity types:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch types",
    });
  }
};

module.exports = {
  handleGetActivityLogs,
  handleGetSummary,
  handleGetTypes,
};
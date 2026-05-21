const {
  getDashboardMetrics,
  getRecentActivity,
  getUpcomingEvents,
  getActiveEventStats,
  getFullDashboard,
} = require("../services/mainOprationDashboardServices");

/**
 * GET /api/main-dashboard
 * Returns full dashboard data in one request
 */
const handleGetFullDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login." });
    }

    const data = await getFullDashboard(userId);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Error fetching full dashboard:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard data",
    });
  }
};

/**
 * GET /api/main-dashboard/metrics
 * Returns only the KPI metric counts
 */
const handleGetMetrics = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login." });
    }

    const metrics = await getDashboardMetrics(userId);

    return res.status(200).json({ success: true, metrics });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch metrics",
    });
  }
};

/**
 * GET /api/main-dashboard/recent-activity
 * Returns recent activity logs across all user events
 */
const handleGetRecentActivity = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login." });
    }

    const limit = parseInt(req.query.limit) || 8;
    const activity = await getRecentActivity(userId, limit);

    return res.status(200).json({ success: true, activity });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch recent activity",
    });
  }
};

/**
 * GET /api/main-dashboard/upcoming-events
 * Returns events list with computed statuses
 */
const handleGetUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login." });
    }

    const limit = parseInt(req.query.limit) || 6;
    const events = await getUpcomingEvents(userId, limit);

    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch upcoming events",
    });
  }
};

/**
 * GET /api/main-dashboard/active-events
 * Returns active events with live stats
 */
const handleGetActiveEventStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login." });
    }

    const stats = await getActiveEventStats(userId);

    return res.status(200).json({ success: true, activeEvents: stats });
  } catch (error) {
    console.error("Error fetching active event stats:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch active event stats",
    });
  }
};

module.exports = {
  handleGetFullDashboard,
  handleGetMetrics,
  handleGetRecentActivity,
  handleGetUpcomingEvents,
  handleGetActiveEventStats,
};
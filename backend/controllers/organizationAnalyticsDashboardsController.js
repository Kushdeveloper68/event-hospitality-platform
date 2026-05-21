const {
  getKPISummary,
  getMonthlyCheckInTrend,
  getGuestRegistrationTrend,
  getServiceRequestBreakdown,
  getRoomOccupancyAnalytics,
  getTransportAnalytics,
  getTeamAnalytics,
  getActivityAnalytics,
  getTopEventsPerformance,
  getVIPAnalytics,
  getFullAnalytics,
} = require("../services/organizationAnalyticsDashboardsServices");

// ─── Helper ───────────────────────────────────────────────────────────────────
const getUserId = (req) => req.user?.id || req.user?._id;

const extractFilters = (query) => ({
  startDate: query.startDate || null,
  endDate: query.endDate || null,
});

// ─── GET /api/org-analytics/full ─────────────────────────────────────────────
/**
 * Full analytics payload — all sections in one call.
 * Use this on initial page load.
 */
const handleGetFullAnalytics = async (req, res) => {
  try {
    const userId = getUserId(req);
    const filters = extractFilters(req.query);

    const data = await getFullAnalytics(userId, filters);

    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Error fetching full analytics:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch analytics",
    });
  }
};

// ─── GET /api/org-analytics/kpis ─────────────────────────────────────────────
/**
 * Lightweight KPI refresh — card values only.
 */
const handleGetKPIs = async (req, res) => {
  try {
    const userId = getUserId(req);
    const filters = extractFilters(req.query);

    const kpiSummary = await getKPISummary(userId, filters);

    return res.status(200).json({ success: true, kpiSummary });
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch KPIs",
    });
  }
};

// ─── GET /api/org-analytics/checkin-trend ────────────────────────────────────
/**
 * Monthly check-in trend data for line chart.
 * Query: ?months=12
 */
const handleGetCheckInTrend = async (req, res) => {
  try {
    const userId = getUserId(req);
    const months = parseInt(req.query.months) || 12;

    const data = await getMonthlyCheckInTrend(userId, months);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching check-in trend:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch check-in trend",
    });
  }
};

// ─── GET /api/org-analytics/registration-trend ───────────────────────────────
/**
 * Monthly guest registration trend.
 * Query: ?months=12
 */
const handleGetRegistrationTrend = async (req, res) => {
  try {
    const userId = getUserId(req);
    const months = parseInt(req.query.months) || 12;

    const data = await getGuestRegistrationTrend(userId, months);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching registration trend:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch registration trend",
    });
  }
};

// ─── GET /api/org-analytics/services ─────────────────────────────────────────
/**
 * Service request breakdown by type, status, urgency.
 */
const handleGetServiceBreakdown = async (req, res) => {
  try {
    const userId = getUserId(req);

    const data = await getServiceRequestBreakdown(userId);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching service breakdown:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch service breakdown",
    });
  }
};

// ─── GET /api/org-analytics/rooms ────────────────────────────────────────────
/**
 * Room occupancy analytics.
 */
const handleGetRoomOccupancy = async (req, res) => {
  try {
    const userId = getUserId(req);

    const data = await getRoomOccupancyAnalytics(userId);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching room occupancy:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch room occupancy",
    });
  }
};

// ─── GET /api/org-analytics/transport ────────────────────────────────────────
/**
 * Transport coordination analytics.
 */
const handleGetTransportAnalytics = async (req, res) => {
  try {
    const userId = getUserId(req);

    const data = await getTransportAnalytics(userId);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching transport analytics:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch transport analytics",
    });
  }
};

// ─── GET /api/org-analytics/team ─────────────────────────────────────────────
/**
 * Team member distribution analytics.
 */
const handleGetTeamAnalytics = async (req, res) => {
  try {
    const userId = getUserId(req);

    const data = await getTeamAnalytics(userId);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching team analytics:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch team analytics",
    });
  }
};

// ─── GET /api/org-analytics/activity ─────────────────────────────────────────
/**
 * Activity log analytics + 30-day daily trend.
 */
const handleGetActivityAnalytics = async (req, res) => {
  try {
    const userId = getUserId(req);

    const data = await getActivityAnalytics(userId);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching activity analytics:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch activity analytics",
    });
  }
};

// ─── GET /api/org-analytics/top-events ───────────────────────────────────────
/**
 * Top events performance table.
 * Query: ?limit=10
 */
const handleGetTopEvents = async (req, res) => {
  try {
    const userId = getUserId(req);
    const limit = parseInt(req.query.limit) || 10;

    const data = await getTopEventsPerformance(userId, limit);

    return res.status(200).json({ success: true, topEvents: data });
  } catch (error) {
    console.error("Error fetching top events:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch top events",
    });
  }
};

// ─── GET /api/org-analytics/vip ──────────────────────────────────────────────
/**
 * VIP guest analytics.
 */
const handleGetVIPAnalytics = async (req, res) => {
  try {
    const userId = getUserId(req);

    const data = await getVIPAnalytics(userId);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching VIP analytics:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch VIP analytics",
    });
  }
};

module.exports = {
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
};
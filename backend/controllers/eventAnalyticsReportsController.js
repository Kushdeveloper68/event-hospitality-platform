const {
  getGuestAnalytics,
  getRoomAnalytics,
  getServiceAnalytics,
  getTransportAnalytics,
  getTeamAnalytics,
  getScheduleAnalytics,
  getActivityAnalytics,
  getFullAnalyticsReport,
  getGuestListCsv,
  getServiceRequestsCsv,
  getTransportLogCsv,
  getEventWorkbookBuffer,
} = require("../services/eventAnalyticsReportsServices");
const { getEventById } = require("../services/eventServices");

// ─── Ownership guard ──────────────────────────────────────────────────────────
const verifyOwnership = async (eventId, userId) => {
  const event = await getEventById(eventId);
  const ownerId = event.createdBy?._id || event.createdBy;
  if (userId && String(ownerId) !== String(userId)) {
    return { authorized: false, event: null };
  }
  return { authorized: true, event };
};

// ─── GET /api/event-analytics/:eventId/full ───────────────────────────────────
/**
 * Full analytics report for a single event — all sections in one call.
 */
const handleGetFullReport = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    const { authorized } = await verifyOwnership(eventId, userId);
    if (!authorized) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const report = await getFullAnalyticsReport(eventId);
    return res.status(200).json({ success: true, ...report });
  } catch (error) {
    console.error("Error fetching full analytics report:", error);
    const status = error.message?.includes("not found") ? 404 : 500;
    return res
      .status(status)
      .json({ success: false, message: error.message || "Failed to fetch report" });
  }
};

// ─── GET /api/event-analytics/:eventId/guests ─────────────────────────────────
const handleGetGuestAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const data = await getGuestAnalytics(eventId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching guest analytics:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to fetch guest analytics" });
  }
};

// ─── GET /api/event-analytics/:eventId/rooms ──────────────────────────────────
const handleGetRoomAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const data = await getRoomAnalytics(eventId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching room analytics:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to fetch room analytics" });
  }
};

// ─── GET /api/event-analytics/:eventId/services ───────────────────────────────
const handleGetServiceAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const data = await getServiceAnalytics(eventId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching service analytics:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to fetch service analytics" });
  }
};

// ─── GET /api/event-analytics/:eventId/transport ──────────────────────────────
const handleGetTransportAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const data = await getTransportAnalytics(eventId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching transport analytics:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to fetch transport analytics" });
  }
};

// ─── GET /api/event-analytics/:eventId/team ───────────────────────────────────
const handleGetTeamAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const data = await getTeamAnalytics(eventId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching team analytics:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to fetch team analytics" });
  }
};

// ─── GET /api/event-analytics/:eventId/schedule ───────────────────────────────
const handleGetScheduleAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const data = await getScheduleAnalytics(eventId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching schedule analytics:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to fetch schedule analytics" });
  }
};

// ─── GET /api/event-analytics/:eventId/activity ───────────────────────────────
const handleGetActivityAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const data = await getActivityAnalytics(eventId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching activity analytics:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to fetch activity analytics" });
  }
};

// ─── GET /api/event-analytics/:eventId/export/guests ─────────────────────────
const handleExportGuests = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized, event } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const csv = await getGuestListCsv(eventId);
    const filename = `guests-${event.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting guests CSV:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to export guests" });
  }
};

// ─── GET /api/event-analytics/:eventId/export/services ───────────────────────
const handleExportServices = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized, event } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const csv = await getServiceRequestsCsv(eventId);
    const filename = `services-${event.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting services CSV:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to export services" });
  }
};

// ─── GET /api/event-analytics/:eventId/export/transport ──────────────────────
const handleExportTransport = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized, event } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const csv = await getTransportLogCsv(eventId);
    const filename = `transport-${event.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting transport CSV:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to export transport" });
  }
};

// ─── GET /api/event-analytics/:eventId/export/workbook ───────────────────────
const handleExportWorkbook = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { authorized } = await verifyOwnership(eventId, req.user?.id);
    if (!authorized) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { buffer, filename } = await getEventWorkbookBuffer(eventId);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);

    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Error exporting event workbook:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to export event workbook" });
  }
};

module.exports = {
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
};
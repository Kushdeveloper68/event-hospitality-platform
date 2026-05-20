const { getEventSummaryData, getEventKPIs } = require("../services/specificEventSummaryServices");
const { getEventById } = require("../services/eventServices");

/**
 * Helper: verify the requesting user owns the event
 */
const verifyEventOwnership = async (eventId, userId) => {
  const event = await getEventById(eventId);
  const ownerId = event.createdBy?._id || event.createdBy;
  if (userId && String(ownerId) !== String(userId)) {
    return { authorized: false, event: null };
  }
  return { authorized: true, event };
};

/**
 * GET /api/event-summary/:eventId
 * Full summary dashboard data
 */
const handleGetEventSummary = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required",
      });
    }

    // Verify ownership
    let event;
    try {
      const check = await verifyEventOwnership(eventId, userId);
      if (!check.authorized) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: you do not own this event",
        });
      }
      event = check.event;
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const summaryData = await getEventSummaryData(eventId);

    return res.status(200).json({
      success: true,
      event: {
        _id: event._id,
        name: event.name,
        venue: event.venue,
        startDate: event.startDate,
        endDate: event.endDate,
        description: event.description,
        isPrivate: event.isPrivate,
        createdBy: event.createdBy,
      },
      summary: summaryData,
    });
  } catch (error) {
    console.error("Error fetching event summary:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch event summary",
    });
  }
};

/**
 * GET /api/event-summary/:eventId/kpis
 * Lightweight KPI-only refresh
 */
const handleGetEventKPIs = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required",
      });
    }

    try {
      const check = await verifyEventOwnership(eventId, userId);
      if (!check.authorized) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: you do not own this event",
        });
      }
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const kpis = await getEventKPIs(eventId);

    return res.status(200).json({
      success: true,
      kpis,
    });
  } catch (error) {
    console.error("Error fetching event KPIs:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch event KPIs",
    });
  }
};

module.exports = {
  handleGetEventSummary,
  handleGetEventKPIs,
};
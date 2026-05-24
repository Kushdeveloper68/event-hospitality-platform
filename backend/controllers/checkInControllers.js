const {
  getArrivingToday,
  getCheckedInGuests,
  getPendingGuests,
  checkInGuest,
  checkOutGuest,
  getCheckInSummary,
} = require("../services/checkInServices");
const { getEventById } = require("../services/eventServices");
const { createActivityLog } = require("../services/activityLogServices");
  const GuestModel = require("../models/guestModel");
  
/**
 * Helper: verify the requesting user owns the event
 */
const verifyEventOwnership = async (eventId, userId) => {
  const event = await getEventById(eventId);
  const ownerId = event.createdBy?._id || event.createdBy;
  if (userId && String(ownerId) !== String(userId)) {
    return false;
  }
  return true;
};

/**
 * GET /api/checkin/arriving-today?eventId=
 */
const handleGetArrivingToday = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId is required" });
    }

    const userId = req.user?.id;
    if (!(await verifyEventOwnership(eventId, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const guests = await getArrivingToday(eventId);
    return res.status(200).json({ success: true, guests });
  } catch (error) {
    console.error("Error fetching arriving today:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch arriving guests" });
  }
};

/**
 * GET /api/checkin/checked-in?eventId=
 */
const handleGetCheckedIn = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId is required" });
    }

    const userId = req.user?.id;
    if (!(await verifyEventOwnership(eventId, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const guests = await getCheckedInGuests(eventId);
    return res.status(200).json({ success: true, guests });
  } catch (error) {
    console.error("Error fetching checked-in guests:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch checked-in guests" });
  }
};

/**
 * GET /api/checkin/pending?eventId=
 */
const handleGetPending = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId is required" });
    }

    const userId = req.user?.id;
    if (!(await verifyEventOwnership(eventId, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const guests = await getPendingGuests(eventId);
    return res.status(200).json({ success: true, guests });
  } catch (error) {
    console.error("Error fetching pending guests:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch pending guests" });
  }
};

/**
 * PUT /api/checkin/:guestId/check-in
 */
const handleCheckIn = async (req, res) => {
  try {
    const { guestId } = req.params;
    const userId = req.user?.id;

    // get the guest to find its event, then verify ownership
  
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    if (!(await verifyEventOwnership(guest.event, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const updated = await checkInGuest(guestId);

    // Async logging
    createActivityLog({
      event: guest.event,
      type: "check-in",
      message: `Guest checked in: ${guest.fullName}`,
      relatedGuest: guestId,
      priority: "normal"
    });

    return res.status(200).json({ success: true, message: "Guest checked in successfully", guest: updated });
  } catch (error) {
    console.error("Error checking in guest:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to check in guest" });
  }
};

/**
 * PUT /api/checkin/:guestId/check-out
 */
const handleCheckOut = async (req, res) => {
  try {
    const { guestId } = req.params;
    const userId = req.user?.id;

   
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    if (!(await verifyEventOwnership(guest.event, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const updated = await checkOutGuest(guestId);

    // Async logging
    createActivityLog({
      event: guest.event,
      type: "check-out",
      message: `Guest checked out: ${guest.fullName}`,
      relatedGuest: guestId,
      priority: "normal"
    });

    return res.status(200).json({ success: true, message: "Guest checked out successfully", guest: updated });
  } catch (error) {
    console.error("Error checking out guest:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to check out guest" });
  }
};

/**
 * GET /api/checkin/summary?eventId=
 */
const handleGetSummary = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId is required" });
    }

    const userId = req.user?.id;
    if (!(await verifyEventOwnership(eventId, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const summary = await getCheckInSummary(eventId);
    return res.status(200).json({ success: true, ...summary });
  } catch (error) {
    console.error("Error fetching check-in summary:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch summary" });
  }
};

module.exports = {
  handleGetArrivingToday,
  handleGetCheckedIn,
  handleGetPending,
  handleCheckIn,
  handleCheckOut,
  handleGetSummary,
};

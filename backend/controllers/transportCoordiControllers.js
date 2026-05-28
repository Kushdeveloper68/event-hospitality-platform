const {
  createTransport,
  getTransports,
  getTransportById,
  updateTransport,
  deleteTransport,
  updateTransportStatus,
  getTransportSummary,
} = require("../services/transportCoordiServices");
const { getEventById } = require("../services/eventServices");
const { createActivityLog } = require("../services/activityLogServices");

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
 * POST /api/transport/create
 */
const handleCreateTransport = async (req, res) => {
  try {
    const { event, guest, driverName, vehicleId, pickupLocation, dropoffLocation, scheduledTime, status, notes } = req.body;
    const userId = req.user?.id;

    if (!event) {
      return res.status(400).json({ success: false, message: "Event ID is required" });
    }
    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ success: false, message: "Pickup and dropoff locations are required" });
    }

    if (!(await verifyEventOwnership(event, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const transportData = { event, guest: guest || null, driverName, vehicleId, pickupLocation, dropoffLocation, scheduledTime, status: status || "scheduled", notes };
    const newTransport = await createTransport(transportData);

    // Async logging
    createActivityLog({
      event,
      type: "transport",
      message: `Transport scheduled for ${newTransport.guest?.fullName || "Guest"}: ${pickupLocation} to ${dropoffLocation}`,
      relatedGuest: guest || null,
      priority: "normal"
    });

    return res.status(201).json({ success: true, message: "Transport created successfully", transport: newTransport });
  } catch (error) {
    console.error("Error creating transport:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create transport" });
  }
};

/**
 * GET /api/transport?eventId=&status=
 */
const handleGetTransports = async (req, res) => {
  try {
    const { eventId, status, page, limit } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'eventId is required' });
    }

    const userId = req.user?.id;
    if (!(await verifyEventOwnership(eventId, userId))) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    const result = await getTransports(
      eventId,
      status,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching transports:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch transports' });
  }
};

/**
 * GET /api/transport/:transportId
 */
const handleGetTransportById = async (req, res) => {
  try {
    const { transportId } = req.params;
    const transport = await getTransportById(transportId);

    const userId = req.user?.id;
    if (!(await verifyEventOwnership(transport.event, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.status(200).json({ success: true, transport });
  } catch (error) {
    console.error("Error fetching transport:", error);
    return res.status(404).json({ success: false, message: error.message || "Transport not found" });
  }
};

/**
 * PUT /api/transport/:transportId
 */
const handleUpdateTransport = async (req, res) => {
  try {
    const { transportId } = req.params;
    const userId = req.user?.id;

    const existing = await getTransportById(transportId);
    if (!(await verifyEventOwnership(existing.event, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await updateTransport(transportId, req.body);
    return res.status(200).json({ success: true, message: "Transport updated successfully", transport: updated });
  } catch (error) {
    console.error("Error updating transport:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update transport" });
  }
};

/**
 * DELETE /api/transport/:transportId
 */
const handleDeleteTransport = async (req, res) => {
  try {
    const { transportId } = req.params;
    const userId = req.user?.id;

    const existing = await getTransportById(transportId);
    if (!(await verifyEventOwnership(existing.event, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await deleteTransport(transportId);
    return res.status(200).json({ success: true, message: "Transport deleted successfully" });
  } catch (error) {
    console.error("Error deleting transport:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to delete transport" });
  }
};

/**
 * PUT /api/transport/:transportId/status
 */
const handleUpdateStatus = async (req, res) => {
  try {
    const { transportId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const existing = await getTransportById(transportId);
    if (!(await verifyEventOwnership(existing.event, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await updateTransportStatus(transportId, status);

    // Async logging
    createActivityLog({
      event: existing.event,
      type: "transport",
      message: `Transport for ${updated.guest?.fullName || "Guest"} updated to ${status}`,
      relatedGuest: existing.guest || null,
      priority: "normal"
    });

    return res.status(200).json({ success: true, message: "Status updated", transport: updated });
  } catch (error) {
    console.error("Error updating transport status:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update status" });
  }
};

/**
 * GET /api/transport/summary?eventId=
 */
const handleGetSummary = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId is required" });
    }

    const userId = req.user?.id;
    if (!(await verifyEventOwnership(eventId, userId))) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const summary = await getTransportSummary(eventId);
    return res.status(200).json({ success: true, ...summary });
  } catch (error) {
    console.error("Error fetching transport summary:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch summary" });
  }
};

module.exports = {
  handleCreateTransport,
  handleGetTransports,
  handleGetTransportById,
  handleUpdateTransport,
  handleDeleteTransport,
  handleUpdateStatus,
  handleGetSummary,
};

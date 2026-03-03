const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../services/eventServices");

/**
 * Create a new event
 * POST /api/events/create
 */
const handleCreateEvent = async (req, res) => {
  try {
    const { name, venue, startDate, endDate, description, isPrivate } = req.body;
    const userId = req.user?.id || req.userId; // from auth middleware

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Event name is required",
      });
    }

    const eventData = {
      name,
      venue: venue || "",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      description: description || "",
      isPrivate: isPrivate || false,
    };

    const newEvent = await createEvent(eventData, userId);

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
};

/**
 * Get all events
 * GET /api/events
 */
const handleGetAllEvents = async (req, res) => {
  try {
    const userId = req.user?.id;
    const events = await getAllEvents(userId);
    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch events",
    });
  }
};

/**
 * Get event by ID
 * GET /api/events/:eventId
 */
const handleGetEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await getEventById(eventId);
    // ensure requesting user owns this event
    const userId = req.user?.id;
    const ownerId = event.createdBy?._id || event.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }
    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(404).json({
      success: false,
      message: error.message || "Event not found",
    });
  }
};

/**
 * Update event
 * PUT /api/events/:eventId
 */
const handleUpdateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updateData = req.body;

    // ensure ownership
    const existing = await getEventById(eventId);
    const userId = req.user?.id;
    const ownerId = existing.createdBy?._id || existing.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    const updatedEvent = await updateEvent(eventId, updateData);
    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update event",
    });
  }
};

/**
 * Delete event
 * DELETE /api/events/:eventId
 */
const handleDeleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    // ensure ownership
    const existing = await getEventById(eventId);
    const userId = req.user?.id;
    const ownerId = existing.createdBy?._id || existing.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    await deleteEvent(eventId);
    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete event",
    });
  }
};

module.exports = {
  handleCreateEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
};

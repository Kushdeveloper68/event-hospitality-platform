const {
  createGuest,
  getGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
} = require("../services/guestServices");
const { getEventById, getAllEvents } = require("../services/eventServices");
const { createActivityLog } = require("../services/activityLogServices");

/**
 * POST /api/guests
 * body must include event (id) and guest fields
 */
const handleCreateGuest = async (req, res) => {
  try {
    const guestData = req.body;
    if (!guestData.event) {
      return res.status(400).json({ success: false, message: "event id required" });
    }
    // ensure the requesting user owns the event
    const userId = req.user?.id;
    const event = await getEventById(guestData.event);
    const ownerId = event.createdBy?._id || event.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }
    const newGuest = await createGuest(guestData);

    // Async logging
    createActivityLog({
      event: guestData.event,
      type: "registration",
      message: `New guest registered: ${newGuest.fullName}`,
      relatedGuest: newGuest._id,
      priority: "normal"
    });

    return res.status(201).json({ success: true, guest: newGuest });
  } catch (error) {
    console.error("Error creating guest", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create guest" });
  }
};

/**
 * GET /api/guests?eventId=&search=&vip=&status=&page=&limit=
 */
const handleGetGuests = async (req, res) => {
  try {
    const { eventId, search, vip, status, page, limit } = req.query;
    const userId = req.user?.id;

    let resolvedEventId = eventId;
    // if no eventId provided, restrict to events owned by the user
    if (!resolvedEventId) {
      const userEvents = await getAllEvents(userId);
      resolvedEventId = userEvents.map((e) => String(e._id));
    } else {
      // if an eventId was provided, ensure it belongs to the user
      const ev = await getEventById(resolvedEventId);
      const ownerId = ev.createdBy?._id || ev.createdBy;
      if (userId && String(ownerId) !== String(userId)) {
        return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
      }
    }

    const opts = {
      eventId: resolvedEventId,
      search,
      vip: vip === undefined ? undefined : vip === "true",
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };
    const result = await getGuests(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Error fetching guests", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch guests" });
  }
};

/**
 * GET /api/guests/:guestId
 */
const handleGetGuestById = async (req, res) => {
  try {
    const { guestId } = req.params;
    const guest = await getGuestById(guestId);
    // ensure the requesting user owns the event this guest belongs to
    const userId = req.user?.id;
    const ev = await getEventById(guest.event);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this guest/event' });
    }
    return res.status(200).json({ success: true, guest });
  } catch (error) {
    console.error("Error fetching guest", error);
    return res.status(404).json({ success: false, message: error.message || "Guest not found" });
  }
};

/**
 * PUT /api/guests/:guestId
 */
const handleUpdateGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const updateData = req.body;
    // ensure owner
    const userId = req.user?.id;
    const guest = await getGuestById(guestId);
    const ev = await getEventById(guest.event);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this guest/event' });
    }
    const updated = await updateGuest(guestId, updateData);
    return res.status(200).json({ success: true, guest: updated });
  } catch (error) {
    console.error("Error updating guest", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update guest" });
  }
};

/**
 * DELETE /api/guests/:guestId
 */
const handleDeleteGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    // ensure owner
    const userId = req.user?.id;
    const guest = await getGuestById(guestId);
    const ev = await getEventById(guest.event);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this guest/event' });
    }
    await deleteGuest(guestId);
    return res.status(200).json({ success: true, message: "Guest deleted" });
  } catch (error) {
    console.error("Error deleting guest", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to delete guest" });
  }
};

module.exports = {
  handleCreateGuest,
  handleGetGuests,
  handleGetGuestById,
  handleUpdateGuest,
  handleDeleteGuest,
};

const {
  createGuest,
  getGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
} = require("../services/guestServices");

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
    const newGuest = await createGuest(guestData);
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
    const opts = {
      eventId,
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

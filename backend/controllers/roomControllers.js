const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  assignGuestToRoom,
} = require("../services/roomServices");
const { getEventById } = require("../services/eventServices");
const { createActivityLog } = require("../services/activityLogServices");

// create
const handleCreateRoom = async (req, res) => {
  try {
    const { number, capacity, type, notes, event } = req.body;
    const userId = req.user?.id;

    if (!number || !event) {
      return res.status(400).json({ success: false, message: "Room number and event are required" });
    }

    // ensure user owns event
    const ev = await getEventById(event);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    const roomData = { number, capacity, type, notes, event };
    const room = await createRoom(roomData);
    return res.status(201).json({ success: true, room });
  } catch (error) {
    console.error("Error creating room", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create room" });
  }
};

// list
const handleGetRooms = async (req, res) => {
  try {
    const { eventId, page, limit } = req.query;
    const userId = req.user?.id;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'eventId query parameter required' });
    }
    const ev = await getEventById(eventId);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    const result = await getRooms({
      eventId,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching rooms', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch rooms' });
  }
};
// single
const handleGetRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await getRoomById(roomId);
    const userId = req.user?.id;
    // ensure owner
    const ev = await getEventById(room.event);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this room/event' });
    }
    return res.status(200).json({ success: true, room });
  } catch (error) {
    console.error("Error fetching room", error);
    return res.status(404).json({ success: false, message: error.message || "Room not found" });
  }
};

// update
const handleUpdateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const updateData = req.body;
    const room = await getRoomById(roomId);
    const userId = req.user?.id;
    const ev = await getEventById(room.event);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this room/event' });
    }
    const updated = await updateRoom(roomId, updateData);
    return res.status(200).json({ success: true, room: updated });
  } catch (error) {
    console.error("Error updating room", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update room" });
  }
};

// delete
const handleDeleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await getRoomById(roomId);
    const userId = req.user?.id;
    const ev = await getEventById(room.event);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this room/event' });
    }
    await deleteRoom(roomId);
    return res.status(200).json({ success: true, message: "Room deleted" });
  } catch (error) {
    console.error("Error deleting room", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to delete room" });
  }
};

// assign
const handleAssignGuest = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { guestId } = req.body;
    if (!guestId) {
      return res.status(400).json({ success: false, message: "guestId is required" });
    }
    const room = await getRoomById(roomId);
    const userId = req.user?.id;
    const ev = await getEventById(room.event);
    const ownerId = ev.createdBy?._id || ev.createdBy;
    if (userId && String(ownerId) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this room/event' });
    }
    const guest = await assignGuestToRoom(roomId, guestId);

    // Async logging
    createActivityLog({
      event: room.event,
      type: "room-assignment",
      message: `Guest ${guest.fullName} assigned to room ${room.number}`,
      relatedGuest: guestId,
      priority: "normal"
    });

    return res.status(200).json({ success: true, guest });
  } catch (error) {
    console.error("Error assigning guest", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to assign guest" });
  }
};

module.exports = {
  handleCreateRoom,
  handleGetRooms,
  handleGetRoomById,
  handleUpdateRoom,
  handleDeleteRoom,
  handleAssignGuest,
};

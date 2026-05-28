const RoomModel = require("../models/roomModel");
const GuestModel = require("../models/guestModel");

/**
 * Create a new room
 * @param {Object} roomData
 * @returns {Promise}
 */
const createRoom = async (roomData) => {
  try {
    const newRoom = new RoomModel(roomData);
    const saved = await newRoom.save();
    return saved;
  } catch (error) {
    throw new Error("Failed to create room: " + error.message);
  }
};

/**
 * Fetch rooms with optional filters
 * @param {Object} options
 * @param {string} options.eventId
 * @param {string} [options.status] // available, occupied, maintenance
 * @returns {Promise<Array>}
 */
const getRooms = async ({ eventId, status, page = 1, limit = 20 } = {}) => {
  try {
    const query = {};
    if (eventId) query.event = eventId;

    const skip = (page - 1) * limit;
    const total = await RoomModel.countDocuments(query);
    const rooms = await RoomModel.find(query)
      .sort({ number: 1 })
      .skip(skip)
      .limit(limit);

    // add occupancy count
    if (rooms.length) {
      const roomIds = rooms.map(r => r._id);
      const counts = await GuestModel.aggregate([
        { $match: { room: { $in: roomIds } } },
        { $group: { _id: '$room', count: { $sum: 1 } } }
      ]);
      const countMap = counts.reduce((acc, cur) => {
        acc[cur._id.toString()] = cur.count;
        return acc;
      }, {});
      rooms.forEach((r, idx) => {
        const obj = r.toObject ? r.toObject() : { ...r };
        obj.occupancy = countMap[r._id.toString()] || 0;
        rooms[idx] = obj;
      });
    }

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      rooms,
    };
  } catch (error) {
    throw new Error('Failed to fetch rooms: ' + error.message);
  }
};

/**
 * Get room by ID
 */
const getRoomById = async (roomId) => {
  try {
    const room = await RoomModel.findById(roomId);
    if (!room) throw new Error("Room not found");
    return room;
  } catch (error) {
    throw new Error("Failed to fetch room: " + error.message);
  }
};

/**
 * Update a room
 */
const updateRoom = async (roomId, updateData) => {
  try {
    const updated = await RoomModel.findByIdAndUpdate(roomId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new Error("Room not found");
    return updated;
  } catch (error) {
    throw new Error("Failed to update room: " + error.message);
  }
};

/**
 * Delete a room
 */
const deleteRoom = async (roomId) => {
  try {
    const deleted = await RoomModel.findByIdAndDelete(roomId);
    if (!deleted) throw new Error("Room not found");
    // also unassign guests that were in this room
    await GuestModel.updateMany({ room: roomId }, { $unset: { room: "" } });
    return deleted;
  } catch (error) {
    throw new Error("Failed to delete room: " + error.message);
  }
};

/**
 * Assign a guest to a room (must belong to same event)
 */
const assignGuestToRoom = async (roomId, guestId) => {
  try {
    const room = await RoomModel.findById(roomId);
    if (!room) throw new Error("Room not found");

    const guest = await GuestModel.findById(guestId);
    if (!guest) throw new Error("Guest not found");

    if (String(guest.event) !== String(room.event)) {
      throw new Error("Guest does not belong to the same event as the room");
    }

    guest.room = roomId;
    await guest.save();
    return guest;
  } catch (error) {
    throw new Error("Failed to assign guest to room: " + error.message);
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  assignGuestToRoom,
};

const mongoose = require("mongoose");
const RoomModel = require("../models/roomModel");
const GuestModel = require("../models/guestModel");

// Escapes regex special characters so free-text search can't be used to
// build an unintended (or catastrophically slow) regular expression.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
/**
 * Fetch a page of rooms for an event, with optional free-text search and
 * availability-status filtering applied server-side (across *all* of the
 * event's rooms, not just the page being returned) — plus a `stats` object
 * with event-wide totals (total / available / occupied) so summary cards
 * and filter-tab badges stay correct regardless of which page is loaded
 * or what's currently searched.
 */
const getRooms = async ({ eventId, search, status, page = 1, limit = 20 } = {}) => {
  try {
    const matchStage = {};
    if (eventId) matchStage.event = new mongoose.Types.ObjectId(eventId);

    // Base pipeline: scope to the event, then compute live occupancy per room.
    const basePipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: GuestModel.collection.name,
          localField: "_id",
          foreignField: "room",
          as: "occupants",
        },
      },
      { $addFields: { occupancy: { $size: "$occupants" } } },
      { $project: { occupants: 0 } },
    ];

    // ---- Event-wide stats: ignore search/status so cards & tab badges
    // always reflect every room, not just the current filter/page ----
    const statsAgg = await RoomModel.aggregate([
      ...basePipeline,
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $lt: ["$occupancy", "$capacity"] }, 1, 0] } },
          occupied: { $sum: { $cond: [{ $gt: ["$occupancy", 0] }, 1, 0] } },
          totalCapacity: { $sum: { $ifNull: ["$capacity", 0] } },
          totalOccupancy: { $sum: "$occupancy" },
        },
      },
    ]);
    const stats = statsAgg[0]
      ? {
          total: statsAgg[0].total,
          available: statsAgg[0].available,
          occupied: statsAgg[0].occupied,
          totalCapacity: statsAgg[0].totalCapacity,
          totalOccupancy: statsAgg[0].totalOccupancy,
        }
      : { total: 0, available: 0, occupied: 0, totalCapacity: 0, totalOccupancy: 0 };

    // ---- Filtered pipeline for the actual list (search + status) ----
    const listPipeline = [...basePipeline];

    if (search && search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      listPipeline.push({ $match: { $or: [{ number: regex }, { type: regex }, { notes: regex }] } });
    }
    if (status === "available") {
      listPipeline.push({ $match: { $expr: { $lt: ["$occupancy", "$capacity"] } } });
    } else if (status === "occupied") {
      listPipeline.push({ $match: { $expr: { $gt: ["$occupancy", 0] } } });
    }

    const countResult = await RoomModel.aggregate([...listPipeline, { $count: "count" }]);
    const filteredTotal = countResult[0]?.count || 0;

    const skip = (Math.max(page, 1) - 1) * limit;
    const rooms = await RoomModel.aggregate([
      ...listPipeline,
      { $sort: { number: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      total: filteredTotal,
      page,
      limit,
      totalPages: Math.max(Math.ceil(filteredTotal / limit), 1),
      rooms,
      stats,
    };
  } catch (error) {
    throw new Error('Failed to fetch rooms: ' + error.message);
  }
};

/**
 * Fetch every room for an event matching the current search/status filter,
 * unpaginated — used for "export all" so the CSV isn't limited to one page.
 */
const getAllRoomsForExport = async ({ eventId, search, status } = {}) => {
  const { rooms } = await getRooms({ eventId, search, status, page: 1, limit: 100000 });
  return rooms;
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

/**
 * Bulk create rooms from a parsed CSV import.
 * @param {string} eventId
 * @param {Array<Object>} rows - each row: { number, capacity, type, notes }
 * @returns {Promise<{createdCount:number, failed:Array<{row:number, reason:string}>}>}
 */
const VALID_ROOM_TYPES = ["standard", "double", "suite", "meeting", "accessible"];

const bulkCreateRooms = async (eventId, rows) => {
  let createdCount = 0;
  const failed = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      if (!row.number || !String(row.number).trim()) {
        throw new Error("number is required");
      }
      const type = row.type ? String(row.type).trim().toLowerCase() : undefined;
      if (type && !VALID_ROOM_TYPES.includes(type)) {
        throw new Error(`type must be one of: ${VALID_ROOM_TYPES.join(", ")}`);
      }
      const roomData = {
        event: eventId,
        number: String(row.number).trim(),
        capacity: row.capacity ? Number(row.capacity) : 1,
        type,
        notes: row.notes ? String(row.notes).trim() : undefined,
      };
      const newRoom = new RoomModel(roomData);
      await newRoom.save();
      createdCount += 1;
    } catch (error) {
      failed.push({ row: i + 2, reason: error.message });
    }
  }

  return { createdCount, failed };
};

module.exports = {
  createRoom,
  getRooms,
  getAllRoomsForExport,
  getRoomById,
  updateRoom,
  deleteRoom,
  assignGuestToRoom,
  bulkCreateRooms,
};

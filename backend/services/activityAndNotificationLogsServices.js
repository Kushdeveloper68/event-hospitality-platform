const ActivityLogModel = require("../models/activityLogModel");
const EventModel = require("../models/eventModel");
const GuestModel = require("../models/guestModel");
const mongoose = require("mongoose");

/**
 * Get all event IDs belonging to a user
 */
const getUserEventIds = async (userId) => {
  const events = await EventModel.find({ createdBy: userId }).select("_id name");
  return events;
};

/**
 * Get activity logs with filters
 * @param {string} userId
 * @param {Object} filters - { eventId, type, priority, search, startDate, endDate, page, limit }
 */
const getActivityLogs = async (userId, filters = {}) => {
  const {
    eventId,
    type,
    priority,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = filters;

  // Get all user events to scope access
  const userEvents = await getUserEventIds(userId);
  const userEventIds = userEvents.map((e) => e._id);

  if (!userEventIds.length) {
    return { logs: [], total: 0, page, limit, events: [] };
  }

  // Build query
  const query = {};

  // Scope to user's events
  if (eventId) {
    // Verify the event belongs to the user
    const belongs = userEventIds.some((id) => id.toString() === eventId);
    if (!belongs) {
      throw new Error("Forbidden: you do not own this event");
    }
    query.event = new mongoose.Types.ObjectId(eventId);
  } else {
    query.event = { $in: userEventIds };
  }

  // Type filter
  if (type && type !== "all") {
    query.type = type;
  }

  // Priority filter
  if (priority && priority !== "all") {
    query.priority = priority;
  }

  // Date range filter
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.timestamp.$lte = end;
    }
  }

  // Search in message
  if (search) {
    query.$or = [
      { message: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ActivityLogModel.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate("event", "name venue startDate endDate")
      .populate("relatedGuest", "fullName email vipStatus groupName")
      .populate("relatedStaff", "name role")
      .lean(),
    ActivityLogModel.countDocuments(query),
  ]);

  return { logs, total, page, limit, events: userEvents };
};

/**
 * Get activity summary stats for a user (or specific event)
 */
const getActivitySummary = async (userId, eventId = null) => {
  const userEvents = await getUserEventIds(userId);
  const userEventIds = userEvents.map((e) => e._id);

  if (!userEventIds.length) {
    return {
      total: 0,
      byType: [],
      byPriority: [],
      criticalCount: 0,
      todayCount: 0,
    };
  }

  const matchQuery = eventId
    ? { event: new mongoose.Types.ObjectId(eventId) }
    : { event: { $in: userEventIds } };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [total, byType, byPriority, criticalCount, todayCount] =
    await Promise.all([
      ActivityLogModel.countDocuments(matchQuery),

      ActivityLogModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      ActivityLogModel.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),

      ActivityLogModel.countDocuments({
        ...matchQuery,
        priority: { $in: ["high", "critical"] },
      }),

      ActivityLogModel.countDocuments({
        ...matchQuery,
        timestamp: { $gte: todayStart },
      }),
    ]);

  return { total, byType, byPriority, criticalCount, todayCount };
};

/**
 * Mark logs as read (future extension — stores a readAt field)
 * For now this is a passthrough helper
 */
const getDistinctTypes = async (userId) => {
  const userEvents = await getUserEventIds(userId);
  const userEventIds = userEvents.map((e) => e._id);
  if (!userEventIds.length) return [];

  const types = await ActivityLogModel.distinct("type", {
    event: { $in: userEventIds },
  });
  return types;
};

module.exports = {
  getActivityLogs,
  getActivitySummary,
  getDistinctTypes,
  getUserEventIds,
};
const EventModel = require("../models/eventModel");
const GuestModel = require("../models/guestModel");
const ServiceRequestModel = require("../models/serviceRequestModel");
const ActivityLogModel = require("../models/activityLogModel");
const TransportModel = require("../models/transportModel");
const TeamMemberModel = require("../models/teamMemberModel");
const RoomModel = require("../models/roomModel");
const mongoose = require("mongoose");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (_) {
    return id;
  }
};

/**
 * Get all event IDs for a user, optionally filtered by date range
 */
const getUserEventIds = async (userId, startDate, endDate) => {
  const query = { createdBy: userId };
  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) query.startDate.$gte = new Date(startDate);
    if (endDate) query.startDate.$lte = new Date(endDate);
  }
  const events = await EventModel.find(query).select("_id");
  return events.map((e) => e._id);
};

/**
 * Determine event status from dates
 */
const getEventStatus = (startDate, endDate) => {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (start && end && now >= start && now <= end) return "in_progress";
  if (start && now < start) return "upcoming";
  if (end && now > end) return "completed";
  return "upcoming";
};

// ─── KPI Summary ─────────────────────────────────────────────────────────────

/**
 * Top-level KPI cards across all user events
 */
const getKPISummary = async (userId, { startDate, endDate } = {}) => {
  const now = new Date();
  const eventIds = await getUserEventIds(userId, startDate, endDate);

  const [
    totalEvents,
    activeEvents,
    upcomingEvents,
    completedEvents,
    totalGuests,
    checkedInGuests,
    totalRooms,
    openServices,
    completedServices,
    totalTransports,
    activeStaff,
    totalActivityLogs,
  ] = await Promise.all([
    EventModel.countDocuments({ createdBy: userId }),
    EventModel.countDocuments({
      createdBy: userId,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }),
    EventModel.countDocuments({
      createdBy: userId,
      startDate: { $gt: now },
    }),
    EventModel.countDocuments({
      createdBy: userId,
      endDate: { $lt: now },
    }),
    eventIds.length
      ? GuestModel.countDocuments({ event: { $in: eventIds } })
      : Promise.resolve(0),
    eventIds.length
      ? GuestModel.countDocuments({ event: { $in: eventIds }, checkedIn: true })
      : Promise.resolve(0),
    eventIds.length
      ? RoomModel.countDocuments({ event: { $in: eventIds } })
      : Promise.resolve(0),
    eventIds.length
      ? ServiceRequestModel.countDocuments({
          event: { $in: eventIds },
          status: { $in: ["open", "in_progress"] },
        })
      : Promise.resolve(0),
    eventIds.length
      ? ServiceRequestModel.countDocuments({
          event: { $in: eventIds },
          status: "completed",
        })
      : Promise.resolve(0),
    eventIds.length
      ? TransportModel.countDocuments({ event: { $in: eventIds } })
      : Promise.resolve(0),
    eventIds.length
      ? TeamMemberModel.countDocuments({
          event: { $in: eventIds },
          status: "active",
        })
      : Promise.resolve(0),
    eventIds.length
      ? ActivityLogModel.countDocuments({ event: { $in: eventIds } })
      : Promise.resolve(0),
  ]);

  // FIX: declare totalServices before using it
  const totalServices = openServices + completedServices;
  const checkInRate =
    totalGuests > 0 ? Math.round((checkedInGuests / totalGuests) * 100) : 0;
  const serviceResolutionRate =
    totalServices > 0
      ? Math.round((completedServices / totalServices) * 100)
      : 0;

  return {
    totalEvents,
    activeEvents,
    upcomingEvents,
    completedEvents,
    totalGuests,
    checkedInGuests,
    checkInRate,
    totalRooms,
    openServices,
    completedServices,
    totalServices,
    serviceResolutionRate,
    totalTransports,
    activeStaff,
    totalActivityLogs,
  };
};

// ─── Monthly Guest Check-in Trend ────────────────────────────────────────────

/**
 * Monthly guest check-in volume for the last N months
 */
const getMonthlyCheckInTrend = async (userId, months = 12) => {
  const eventIds = await getUserEventIds(userId);
  if (!eventIds.length) return { data: [], yoyChange: null };

  const since = new Date();
  since.setMonth(since.getMonth() - months);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        event: { $in: eventIds },
        checkedIn: true,
        checkedInAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$checkedInAt" },
          month: { $month: "$checkedInAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ];

  const raw = await GuestModel.aggregate(pipeline);

  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const found = raw.find(
      (r) => r._id.year === year && r._id.month === month
    );
    result.push({
      year,
      month,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      count: found ? found.count : 0,
    });
  }

  const recent = result.slice(-6).reduce((s, r) => s + r.count, 0);
  const prior = result.slice(-12, -6).reduce((s, r) => s + r.count, 0);
  const yoyChange =
    prior > 0 ? Math.round(((recent - prior) / prior) * 100) : null;

  return { data: result, yoyChange };
};

// ─── Guest Registration Trend ─────────────────────────────────────────────────

/**
 * Monthly guest registration counts
 */
const getGuestRegistrationTrend = async (userId, months = 12) => {
  const eventIds = await getUserEventIds(userId);
  if (!eventIds.length) return { data: [], yoyChange: null };

  const since = new Date();
  since.setMonth(since.getMonth() - months);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        event: { $in: eventIds },
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ];

  const raw = await GuestModel.aggregate(pipeline);

  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const found = raw.find(
      (r) => r._id.year === year && r._id.month === month
    );
    result.push({
      year,
      month,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      count: found ? found.count : 0,
    });
  }

  const recent = result.slice(-6).reduce((s, r) => s + r.count, 0);
  const prior = result.slice(-12, -6).reduce((s, r) => s + r.count, 0);
  const yoyChange =
    prior > 0 ? Math.round(((recent - prior) / prior) * 100) : null;

  return { data: result, yoyChange };
};

// ─── Service Request Breakdown ───────────────────────────────────────────────

/**
 * Service request counts by type and by status
 */
const getServiceRequestBreakdown = async (userId) => {
  const eventIds = await getUserEventIds(userId);
  if (!eventIds.length)
    return { byType: [], byStatus: [], byUrgency: [], totalRequests: 0 };

  const [byTypeRaw, byStatusRaw, byUrgencyRaw, totalRequests] =
    await Promise.all([
      ServiceRequestModel.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: "$requestType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ServiceRequestModel.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ServiceRequestModel.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: "$urgency", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ServiceRequestModel.countDocuments({ event: { $in: eventIds } }),
    ]);

  const typeLabels = {
    housekeeping: "Housekeeping",
    maintenance: "Maintenance",
    fb: "Food & Beverage",
    valet: "Valet",
    other: "Other",
  };

  return {
    byType: byTypeRaw.map((r) => ({
      type: r._id,
      label: typeLabels[r._id] || r._id,
      count: r.count,
      pct:
        totalRequests > 0 ? Math.round((r.count / totalRequests) * 100) : 0,
    })),
    byStatus: byStatusRaw.map((r) => ({
      status: r._id,
      count: r.count,
      pct:
        totalRequests > 0 ? Math.round((r.count / totalRequests) * 100) : 0,
    })),
    byUrgency: byUrgencyRaw.map((r) => ({
      urgency: r._id,
      count: r.count,
      pct:
        totalRequests > 0 ? Math.round((r.count / totalRequests) * 100) : 0,
    })),
    totalRequests,
  };
};

// ─── Room Occupancy Analytics ─────────────────────────────────────────────────

/**
 * Room utilization breakdown (by type, occupancy rate per event)
 */
const getRoomOccupancyAnalytics = async (userId) => {
  const eventIds = await getUserEventIds(userId);
  if (!eventIds.length)
    return {
      byType: [],
      overallOccupancy: 0,
      totalRooms: 0,
      occupiedRooms: 0,
      availableRooms: 0,
    };

  const [allRooms, occupiedRoomIds, byTypeRaw] = await Promise.all([
    RoomModel.find({ event: { $in: eventIds } }).lean(),
    GuestModel.distinct("room", {
      event: { $in: eventIds },
      room: { $ne: null },
    }),
    RoomModel.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const totalRooms = allRooms.length;
  const occupiedRooms = occupiedRoomIds.length;
  const overallOccupancy =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return {
    byType: byTypeRaw.map((r) => ({
      type: r._id || "standard",
      count: r.count,
      pct: totalRooms > 0 ? Math.round((r.count / totalRooms) * 100) : 0,
    })),
    overallOccupancy,
    totalRooms,
    occupiedRooms,
    availableRooms: totalRooms - occupiedRooms,
  };
};

// ─── Transport Analytics ──────────────────────────────────────────────────────

/**
 * Transport coordination stats
 */
const getTransportAnalytics = async (userId) => {
  const eventIds = await getUserEventIds(userId);
  if (!eventIds.length)
    return {
      byStatus: [],
      totalTransports: 0,
      completionRate: 0,
      todayCount: 0,
    };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [byStatusRaw, totalTransports, todayCount] = await Promise.all([
    TransportModel.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    TransportModel.countDocuments({ event: { $in: eventIds } }),
    TransportModel.countDocuments({
      event: { $in: eventIds },
      scheduledTime: { $gte: todayStart, $lte: todayEnd },
    }),
  ]);

  const arrived =
    byStatusRaw.find((r) => r._id === "arrived")?.count || 0;
  const completionRate =
    totalTransports > 0
      ? Math.round((arrived / totalTransports) * 100)
      : 0;

  return {
    byStatus: byStatusRaw.map((r) => ({
      status: r._id,
      count: r.count,
      pct:
        totalTransports > 0
          ? Math.round((r.count / totalTransports) * 100)
          : 0,
    })),
    totalTransports,
    completionRate,
    todayCount,
  };
};

// ─── Team Analytics ───────────────────────────────────────────────────────────

/**
 * Team member distribution by role & status
 */
const getTeamAnalytics = async (userId) => {
  const eventIds = await getUserEventIds(userId);
  if (!eventIds.length)
    return { byRole: [], byStatus: [], total: 0, activeRate: 0 };

  const [byRoleRaw, byStatusRaw, total] = await Promise.all([
    TeamMemberModel.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    TeamMemberModel.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    TeamMemberModel.countDocuments({ event: { $in: eventIds } }),
  ]);

  const active =
    byStatusRaw.find((r) => r._id === "active")?.count || 0;
  const activeRate =
    total > 0 ? Math.round((active / total) * 100) : 0;

  return {
    byRole: byRoleRaw.map((r) => ({
      role: r._id || "Unassigned",
      count: r.count,
      pct: total > 0 ? Math.round((r.count / total) * 100) : 0,
    })),
    byStatus: byStatusRaw.map((r) => ({
      status: r._id,
      count: r.count,
    })),
    total,
    activeRate,
  };
};

// ─── Activity Log Analytics ───────────────────────────────────────────────────

/**
 * Activity log breakdown by type, priority + 30-day daily trend
 */
const getActivityAnalytics = async (userId) => {
  const eventIds = await getUserEventIds(userId);
  if (!eventIds.length)
    return { byType: [], byPriority: [], dailyTrend: [], total: 0 };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [byTypeRaw, byPriorityRaw, dailyRaw, total] = await Promise.all([
    ActivityLogModel.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ActivityLogModel.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    ActivityLogModel.aggregate([
      {
        $match: {
          event: { $in: eventIds },
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]),
    ActivityLogModel.countDocuments({ event: { $in: eventIds } }),
  ]);

  // Fill daily trend with last 30 days
  const dailyTrend = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const found = dailyRaw.find(
      (r) =>
        r._id.year === d.getFullYear() &&
        r._id.month === d.getMonth() + 1 &&
        r._id.day === d.getDate()
    );
    dailyTrend.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: found ? found.count : 0,
    });
  }

  return {
    byType: byTypeRaw.map((r) => ({ type: r._id || "other", count: r.count })),
    byPriority: byPriorityRaw.map((r) => ({
      priority: r._id || "normal",
      count: r.count,
    })),
    dailyTrend,
    total,
  };
};

// ─── Top Events Performance ───────────────────────────────────────────────────

/**
 * Per-event performance table (top N events by startDate desc)
 */
const getTopEventsPerformance = async (userId, limit = 10) => {
  const events = await EventModel.find({ createdBy: userId })
    .sort({ startDate: -1 })
    .limit(limit)
    .lean();

  if (!events.length) return [];

  const eventIds = events.map((e) => e._id);

  const [guestCounts, checkedInCounts, serviceCounts, transportCounts] =
    await Promise.all([
      GuestModel.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: "$event", count: { $sum: 1 } } },
      ]),
      GuestModel.aggregate([
        { $match: { event: { $in: eventIds }, checkedIn: true } },
        { $group: { _id: "$event", count: { $sum: 1 } } },
      ]),
      ServiceRequestModel.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: "$event", count: { $sum: 1 } } },
      ]),
      TransportModel.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: "$event", count: { $sum: 1 } } },
      ]),
    ]);

  const toMap = (arr) =>
    arr.reduce((acc, r) => {
      acc[r._id.toString()] = r.count;
      return acc;
    }, {});

  const guestMap = toMap(guestCounts);
  const checkedInMap = toMap(checkedInCounts);
  const serviceMap = toMap(serviceCounts);
  const transportMap = toMap(transportCounts);

  return events.map((ev) => {
    const id = ev._id.toString();
    const guests = guestMap[id] || 0;
    const checkedIn = checkedInMap[id] || 0;
    const checkInRate =
      guests > 0 ? Math.round((checkedIn / guests) * 100) : 0;

    return {
      _id: ev._id,
      name: ev.name,
      venue: ev.venue,
      startDate: ev.startDate,
      endDate: ev.endDate,
      isPrivate: ev.isPrivate,
      status: getEventStatus(ev.startDate, ev.endDate),
      guests,
      checkedIn,
      checkInRate,
      services: serviceMap[id] || 0,
      transports: transportMap[id] || 0,
    };
  });
};

// ─── VIP Analytics ────────────────────────────────────────────────────────────

/**
 * VIP guest statistics
 */
const getVIPAnalytics = async (userId) => {
  const eventIds = await getUserEventIds(userId);
  if (!eventIds.length)
    return { totalVIP: 0, checkedInVIP: 0, vipRate: 0, vipCheckInRate: 0 };

  const [totalVIP, checkedInVIP, totalGuests] = await Promise.all([
    GuestModel.countDocuments({ event: { $in: eventIds }, vipStatus: true }),
    GuestModel.countDocuments({
      event: { $in: eventIds },
      vipStatus: true,
      checkedIn: true,
    }),
    GuestModel.countDocuments({ event: { $in: eventIds } }),
  ]);

  return {
    totalVIP,
    checkedInVIP,
    vipRate:
      totalGuests > 0 ? Math.round((totalVIP / totalGuests) * 100) : 0,
    vipCheckInRate:
      totalVIP > 0 ? Math.round((checkedInVIP / totalVIP) * 100) : 0,
  };
};

// ─── Full Analytics ───────────────────────────────────────────────────────────

/**
 * All analytics in one call — used on initial page load
 */
const getFullAnalytics = async (userId, filters = {}) => {
  const [
    kpiSummary,
    monthlyCheckIn,
    guestRegistration,
    serviceBreakdown,
    roomOccupancy,
    transportStats,
    teamStats,
    activityStats,
    topEvents,
    vipStats,
  ] = await Promise.all([
    getKPISummary(userId, filters),
    getMonthlyCheckInTrend(userId, 12),
    getGuestRegistrationTrend(userId, 12),
    getServiceRequestBreakdown(userId),
    getRoomOccupancyAnalytics(userId),
    getTransportAnalytics(userId),
    getTeamAnalytics(userId),
    getActivityAnalytics(userId),
    getTopEventsPerformance(userId, 10),
    getVIPAnalytics(userId),
  ]);

  return {
    kpiSummary,
    monthlyCheckIn,
    guestRegistration,
    serviceBreakdown,
    roomOccupancy,
    transportStats,
    teamStats,
    activityStats,
    topEvents,
    vipStats,
    generatedAt: new Date().toISOString(),
  };
};

module.exports = {
  getKPISummary,
  getMonthlyCheckInTrend,
  getGuestRegistrationTrend,
  getServiceRequestBreakdown,
  getRoomOccupancyAnalytics,
  getTransportAnalytics,
  getTeamAnalytics,
  getActivityAnalytics,
  getTopEventsPerformance,
  getVIPAnalytics,
  getFullAnalytics,
};
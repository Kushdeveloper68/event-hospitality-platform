const EventModel = require("../models/eventModel");
const GuestModel = require("../models/guestModel");
const ServiceRequestModel = require("../models/serviceRequestModel");
const ActivityLogModel = require("../models/activityLogModel");
const TransportModel = require("../models/transportModel");
const TeamMemberModel = require("../models/teamMemberModel");
const RoomModel = require("../models/roomModel");

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

/**
 * Get all event IDs that belong to a user
 */
const getUserEventIds = async (userId) => {
  const events = await EventModel.find({ createdBy: userId }).select("_id");
  return events.map((e) => e._id);
};

/**
 * Get dashboard metrics for the logged-in user
 */
const getDashboardMetrics = async (userId) => {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Event counts
  const [totalEvents, activeEvents, upcomingEventsCount, completedEvents] =
    await Promise.all([
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
    ]);

  const eventIds = await getUserEventIds(userId);

  if (eventIds.length === 0) {
    return {
      totalEvents,
      activeEvents,
      upcomingEventsCount,
      completedEvents,
      guestsToday: 0,
      pendingCheckIns: 0,
      serviceRequests: 0,
      totalGuests: 0,
      checkedInGuests: 0,
    };
  }

  // Guest & service metrics
  const [
    totalGuests,
    checkedInGuests,
    guestsToday,
    pendingCheckIns,
    serviceRequests,
  ] = await Promise.all([
    GuestModel.countDocuments({ event: { $in: eventIds } }),
    GuestModel.countDocuments({ event: { $in: eventIds }, checkedIn: true }),
    GuestModel.countDocuments({
      event: { $in: eventIds },
      arrivalDatetime: { $gte: todayStart, $lte: todayEnd },
    }),
    GuestModel.countDocuments({
      event: { $in: eventIds },
      checkedIn: false,
      $or: [
        { arrivalDatetime: { $lte: now } },
        { arrivalDatetime: null },
        { arrivalDatetime: { $exists: false } },
      ],
    }),
    ServiceRequestModel.countDocuments({
      event: { $in: eventIds },
      status: { $in: ["open", "in_progress"] },
    }),
  ]);

  return {
    totalEvents,
    activeEvents,
    upcomingEventsCount,
    completedEvents,
    guestsToday,
    pendingCheckIns,
    serviceRequests,
    totalGuests,
    checkedInGuests,
  };
};

/**
 * Get recent activity logs across all user events
 */
const getRecentActivity = async (userId, limit = 8) => {
  const eventIds = await getUserEventIds(userId);
  if (eventIds.length === 0) return [];

  const logs = await ActivityLogModel.find({ event: { $in: eventIds } })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate("relatedGuest", "fullName groupName vipStatus")
    .populate("relatedStaff", "name")
    .populate("event", "name")
    .lean();

  return logs;
};

/**
 * Get upcoming / active / recent events for the table
 */
const getUpcomingEvents = async (userId, limit = 6) => {
  const now = new Date();

  // Fetch recent and upcoming events sorted by startDate
  const events = await EventModel.find({ createdBy: userId })
    .sort({ startDate: -1 })
    .limit(limit)
    .lean();

  return events.map((event) => ({
    ...event,
    status: getEventStatus(event.startDate, event.endDate),
  }));
};

/**
 * Get quick stats per active event (for live events panel)
 */
const getActiveEventStats = async (userId) => {
  const now = new Date();
  const activeEvents = await EventModel.find({
    createdBy: userId,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .limit(3)
    .lean();

  const statsPromises = activeEvents.map(async (event) => {
    const [totalGuests, checkedIn, openServices, activeTransport] =
      await Promise.all([
        GuestModel.countDocuments({ event: event._id }),
        GuestModel.countDocuments({ event: event._id, checkedIn: true }),
        ServiceRequestModel.countDocuments({
          event: event._id,
          status: { $in: ["open", "in_progress"] },
        }),
        TransportModel.countDocuments({
          event: event._id,
          status: { $in: ["scheduled", "in_transit"] },
        }),
      ]);

    return {
      ...event,
      stats: {
        totalGuests,
        checkedIn,
        checkInRate:
          totalGuests > 0 ? Math.round((checkedIn / totalGuests) * 100) : 0,
        openServices,
        activeTransport,
      },
    };
  });

  return Promise.all(statsPromises);
};

/**
 * Full dashboard data in one call
 */
const getFullDashboard = async (userId) => {
  const [metrics, recentActivity, upcomingEvents, activeEventStats] =
    await Promise.all([
      getDashboardMetrics(userId),
      getRecentActivity(userId, 8),
      getUpcomingEvents(userId, 8),
      getActiveEventStats(userId),
    ]);

  return {
    metrics,
    recentActivity,
    upcomingEvents,
    activeEventStats,
  };
};

module.exports = {
  getDashboardMetrics,
  getRecentActivity,
  getUpcomingEvents,
  getActiveEventStats,
  getFullDashboard,
};
const GuestModel = require("../models/guestModel");
const RoomModel = require("../models/roomModel");
const TeamMemberModel = require("../models/teamMemberModel");
const ServiceRequestModel = require("../models/serviceRequestModel");
const TransportModel = require("../models/transportModel");
const ActivityLogModel = require("../models/activityLogModel");
const ScheduleActivity = require("../models/scheduleModel");

/**
 * Get full event summary dashboard data
 * @param {string} eventId
 * @returns {Promise<Object>}
 */
const getEventSummaryData = async (eventId) => {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // ── GUEST STATS ──────────────────────────────────────────────────────────
  const [
    totalGuests,
    checkedInGuests,
    vipGuests,
    arrivingToday,
    departingToday,
  ] = await Promise.all([
    GuestModel.countDocuments({ event: eventId }),
    GuestModel.countDocuments({ event: eventId, checkedIn: true }),
    GuestModel.countDocuments({ event: eventId, vipStatus: true }),
    GuestModel.countDocuments({
      event: eventId,
      checkedIn: false,
      arrivalDatetime: { $gte: todayStart, $lte: todayEnd },
    }),
    GuestModel.countDocuments({
      event: eventId,
      departureDatetime: { $gte: todayStart, $lte: todayEnd },
    }),
  ]);

  const checkInRate =
    totalGuests > 0 ? Math.round((checkedInGuests / totalGuests) * 100) : 0;

  // ── ROOM STATS ───────────────────────────────────────────────────────────
  const allRooms = await RoomModel.find({ event: eventId }).lean();
  const totalRooms = allRooms.length;
  const totalCapacity = allRooms.reduce((s, r) => s + (r.capacity || 1), 0);

  // Count guests assigned to rooms
  const occupiedRoomIds = await GuestModel.distinct("room", {
    event: eventId,
    room: { $ne: null },
  });
  const occupiedRooms = occupiedRoomIds.length;
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Room type breakdown
  const roomTypeBreakdown = allRooms.reduce((acc, r) => {
    const type = r.type || "standard";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // ── SERVICE STATS ────────────────────────────────────────────────────────
  const [
    totalServices,
    openServices,
    inProgressServices,
    completedServices,
    cancelledServices,
  ] = await Promise.all([
    ServiceRequestModel.countDocuments({ event: eventId }),
    ServiceRequestModel.countDocuments({ event: eventId, status: "open" }),
    ServiceRequestModel.countDocuments({
      event: eventId,
      status: "in_progress",
    }),
    ServiceRequestModel.countDocuments({ event: eventId, status: "completed" }),
    ServiceRequestModel.countDocuments({ event: eventId, status: "cancelled" }),
  ]);

  // Service type breakdown
  const serviceTypeAgg = await ServiceRequestModel.aggregate([
    { $match: { event: require("mongoose").Types.ObjectId.createFromHexString ? 
        (() => { try { const mongoose = require("mongoose"); return new mongoose.Types.ObjectId(eventId); } catch(e) { return eventId; } })()
        : eventId 
    }},
    { $group: { _id: "$requestType", count: { $sum: 1 } } },
  ]).catch(() => []);

  const serviceTypeBreakdown = serviceTypeAgg.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  // Emergency / high-priority services
  const urgentServices = await ServiceRequestModel.countDocuments({
    event: eventId,
    urgency: { $in: ["high", "emergency"] },
    status: { $in: ["open", "in_progress"] },
  });

  // ── TRANSPORT STATS ──────────────────────────────────────────────────────
  const [
    totalTransports,
    scheduledTransports,
    inTransitTransports,
    arrivedTransports,
    cancelledTransports,
  ] = await Promise.all([
    TransportModel.countDocuments({ event: eventId }),
    TransportModel.countDocuments({ event: eventId, status: "scheduled" }),
    TransportModel.countDocuments({ event: eventId, status: "in_transit" }),
    TransportModel.countDocuments({ event: eventId, status: "arrived" }),
    TransportModel.countDocuments({ event: eventId, status: "cancelled" }),
  ]);

  // Transports scheduled for today
  const transportsToday = await TransportModel.countDocuments({
    event: eventId,
    scheduledTime: { $gte: todayStart, $lte: todayEnd },
  });

  // ── TEAM STATS ───────────────────────────────────────────────────────────
  const [totalStaff, activeStaff, inactiveStaff] = await Promise.all([
    TeamMemberModel.countDocuments({ event: eventId }),
    TeamMemberModel.countDocuments({ event: eventId, status: "active" }),
    TeamMemberModel.countDocuments({ event: eventId, status: "inactive" }),
  ]);

  // Role distribution
  const roleAgg = await TeamMemberModel.aggregate([
    { $match: { event: (() => { try { const mongoose = require("mongoose"); return new mongoose.Types.ObjectId(eventId); } catch(e) { return eventId; } })() } },
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]).catch(() => []);

  // ── SCHEDULE STATS ───────────────────────────────────────────────────────
  const [
    totalActivities,
    confirmedActivities,
    pendingActivities,
    activeActivities,
    cancelledActivities,
  ] = await Promise.all([
    ScheduleActivity.countDocuments({ eventId }),
    ScheduleActivity.countDocuments({ eventId, status: "Confirmed" }),
    ScheduleActivity.countDocuments({ eventId, status: "Pending" }),
    ScheduleActivity.countDocuments({ eventId, status: "Active" }),
    ScheduleActivity.countDocuments({ eventId, status: "Cancelled" }),
  ]);

  // Today's schedule items
  const todaysSchedule = await ScheduleActivity.find({
    eventId,
    startTime: { $gte: todayStart, $lte: todayEnd },
  })
    .sort({ startTime: 1 })
    .limit(5)
    .lean();

  // Workstream distribution
  const workstreamAgg = await ScheduleActivity.aggregate([
    { $match: { eventId: (() => { try { const mongoose = require("mongoose"); return new mongoose.Types.ObjectId(eventId); } catch(e) { return eventId; } })() } },
    { $group: { _id: "$workstream", count: { $sum: 1 } } },
  ]).catch(() => []);

  // ── RECENT ACTIVITY ──────────────────────────────────────────────────────
  const recentActivity = await ActivityLogModel.find({ event: eventId })
    .sort({ timestamp: -1 })
    .limit(10)
    .populate("relatedGuest", "fullName vipStatus groupName")
    .populate("relatedStaff", "name role")
    .lean();

  // Activity counts by type
  const activityTypeAgg = await ActivityLogModel.aggregate([
    { $match: { event: (() => { try { const mongoose = require("mongoose"); return new mongoose.Types.ObjectId(eventId); } catch(e) { return eventId; } })() } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]).catch(() => []);

  const activityByType = activityTypeAgg.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  // High/critical logs today
  const criticalLogsToday = await ActivityLogModel.countDocuments({
    event: eventId,
    priority: { $in: ["high", "critical"] },
    timestamp: { $gte: todayStart },
  });

  // ── HOURLY CHECK-IN TREND (last 12 hours) ────────────────────────────────
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const checkInTrend = await GuestModel.aggregate([
    {
      $match: {
        event: (() => { try { const mongoose = require("mongoose"); return new mongoose.Types.ObjectId(eventId); } catch(e) { return eventId; } })(),
        checkedIn: true,
        checkedInAt: { $gte: twelveHoursAgo },
      },
    },
    {
      $group: {
        _id: { $hour: "$checkedInAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]).catch(() => []);

  // ── COMPILE RESPONSE ─────────────────────────────────────────────────────
  return {
    guests: {
      total: totalGuests,
      checkedIn: checkedInGuests,
      notCheckedIn: totalGuests - checkedInGuests,
      vip: vipGuests,
      arrivingToday,
      departingToday,
      checkInRate,
    },
    rooms: {
      total: totalRooms,
      occupied: occupiedRooms,
      available: totalRooms - occupiedRooms,
      occupancyRate,
      totalCapacity,
      typeBreakdown: roomTypeBreakdown,
    },
    services: {
      total: totalServices,
      open: openServices,
      inProgress: inProgressServices,
      completed: completedServices,
      cancelled: cancelledServices,
      urgent: urgentServices,
      resolutionRate:
        totalServices > 0
          ? Math.round((completedServices / totalServices) * 100)
          : 0,
      typeBreakdown: serviceTypeBreakdown,
    },
    transport: {
      total: totalTransports,
      scheduled: scheduledTransports,
      inTransit: inTransitTransports,
      arrived: arrivedTransports,
      cancelled: cancelledTransports,
      today: transportsToday,
      activeCount: scheduledTransports + inTransitTransports,
    },
    team: {
      total: totalStaff,
      active: activeStaff,
      inactive: inactiveStaff,
      activeRate:
        totalStaff > 0 ? Math.round((activeStaff / totalStaff) * 100) : 0,
      roleDistribution: roleAgg.map((r) => ({ role: r._id || "Unassigned", count: r.count })),
    },
    schedule: {
      total: totalActivities,
      confirmed: confirmedActivities,
      pending: pendingActivities,
      active: activeActivities,
      cancelled: cancelledActivities,
      todaysItems: todaysSchedule,
      workstreamBreakdown: workstreamAgg.map((w) => ({
        workstream: w._id,
        count: w.count,
      })),
    },
    activity: {
      recent: recentActivity,
      byType: activityByType,
      criticalToday: criticalLogsToday,
      total: await ActivityLogModel.countDocuments({ event: eventId }),
    },
    trends: {
      checkInByHour: checkInTrend.map((t) => ({
        hour: t._id,
        count: t.count,
      })),
    },
    generatedAt: now.toISOString(),
  };
};

/**
 * Get just the KPI metrics (lighter call for refresh)
 */
const getEventKPIs = async (eventId) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalGuests,
    checkedIn,
    openServices,
    activeTransports,
    activeStaff,
    todaysSchedule,
  ] = await Promise.all([
    GuestModel.countDocuments({ event: eventId }),
    GuestModel.countDocuments({ event: eventId, checkedIn: true }),
    ServiceRequestModel.countDocuments({
      event: eventId,
      status: { $in: ["open", "in_progress"] },
    }),
    TransportModel.countDocuments({
      event: eventId,
      status: { $in: ["scheduled", "in_transit"] },
    }),
    TeamMemberModel.countDocuments({ event: eventId, status: "active" }),
    ScheduleActivity.countDocuments({
      eventId,
      startTime: { $gte: todayStart, $lte: todayEnd },
    }),
  ]);

  return {
    totalGuests,
    checkedIn,
    checkInRate:
      totalGuests > 0 ? Math.round((checkedIn / totalGuests) * 100) : 0,
    openServices,
    activeTransports,
    activeStaff,
    todaysSchedule,
  };
};

module.exports = {
  getEventSummaryData,
  getEventKPIs,
};
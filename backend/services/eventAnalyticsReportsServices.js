const mongoose = require("mongoose");
const EventModel = require("../models/eventModel");
const GuestModel = require("../models/guestModel");
const RoomModel = require("../models/roomModel");
const ServiceRequestModel = require("../models/serviceRequestModel");
const TransportModel = require("../models/transportModel");
const TeamMemberModel = require("../models/teamMemberModel");
const ActivityLogModel = require("../models/activityLogModel");
const ScheduleActivity = require("../models/scheduleModel");

const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (e) {
    return id;
  }
};

// ─── GUEST ANALYTICS ─────────────────────────────────────────────────────────

const getGuestAnalytics = async (eventId) => {
  const eid = toObjectId(eventId);

  const [
    total,
    checkedIn,
    vip,
    withRoom,
    withSpecialRequests,
    byTransportMode,
    byGroup,
    checkInByHour,
    arrivalByHour,
    ageGroups,
    checkOutCount,
  ] = await Promise.all([
    GuestModel.countDocuments({ event: eid }),
    GuestModel.countDocuments({ event: eid, checkedIn: true }),
    GuestModel.countDocuments({ event: eid, vipStatus: true }),
    GuestModel.countDocuments({ event: eid, room: { $ne: null } }),
    GuestModel.countDocuments({
      event: eid,
      specialRequests: { $exists: true, $ne: "" },
    }),

    // Transport mode breakdown
    GuestModel.aggregate([
      { $match: { event: eid, transportMode: { $exists: true, $ne: "" } } },
      { $group: { _id: "$transportMode", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    // Top groups
    GuestModel.aggregate([
      { $match: { event: eid, groupName: { $exists: true, $ne: "" } } },
      { $group: { _id: "$groupName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),

    // Check-in by hour of day (0-23)
    GuestModel.aggregate([
      { $match: { event: eid, checkedIn: true, checkedInAt: { $ne: null } } },
      { $group: { _id: { $hour: "$checkedInAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),

    // Arrival datetime by hour
    GuestModel.aggregate([
      {
        $match: {
          event: eid,
          arrivalDatetime: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: { $hour: "$arrivalDatetime" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Age distribution buckets
    GuestModel.aggregate([
      { $match: { event: eid, age: { $exists: true, $ne: null, $gt: 0 } } },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 18, 26, 36, 46, 56, 66, 120],
          default: "Unknown",
          output: { count: { $sum: 1 } },
        },
      },
    ]),

    GuestModel.countDocuments({
      event: eid,
      checkedOutAt: { $ne: null },
    }),
  ]);

  const checkInRate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  const vipRate = total > 0 ? Math.round((vip / total) * 100) : 0;
  const roomAssignmentRate =
    total > 0 ? Math.round((withRoom / total) * 100) : 0;

  return {
    summary: {
      total,
      checkedIn,
      notCheckedIn: total - checkedIn,
      checkedOut: checkOutCount,
      vip,
      nonVip: total - vip,
      withRoom,
      withoutRoom: total - withRoom,
      withSpecialRequests,
      checkInRate,
      vipRate,
      roomAssignmentRate,
    },
    transportModeBreakdown: byTransportMode.map((t) => ({
      mode: t._id || "Not specified",
      count: t.count,
    })),
    topGroups: byGroup.map((g) => ({
      group: g._id,
      count: g.count,
    })),
    checkInByHour: Array.from({ length: 24 }, (_, h) => {
      const found = checkInByHour.find((x) => x._id === h);
      return { hour: h, count: found ? found.count : 0 };
    }),
    arrivalByHour: Array.from({ length: 24 }, (_, h) => {
      const found = arrivalByHour.find((x) => x._id === h);
      return { hour: h, count: found ? found.count : 0 };
    }),
    ageDistribution: ageGroups.map((b) => ({
      range:
        b._id === "Unknown"
          ? "Unknown"
          : `${b._id}-${b._id === 0 ? 17 : b._id + 9}`,
      count: b.count,
    })),
  };
};

// ─── ROOM ANALYTICS ──────────────────────────────────────────────────────────

const getRoomAnalytics = async (eventId) => {
  const eid = toObjectId(eventId);

  const [allRooms, typeBreakdown, guestsByRoom] = await Promise.all([
    RoomModel.find({ event: eid }).lean(),

    RoomModel.aggregate([
      { $match: { event: eid } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalCapacity: { $sum: "$capacity" },
        },
      },
      { $sort: { count: -1 } },
    ]),

    GuestModel.aggregate([
      { $match: { event: eid, room: { $ne: null } } },
      { $group: { _id: "$room", count: { $sum: 1 } } },
    ]),
  ]);

  const roomOccupancyMap = guestsByRoom.reduce((acc, g) => {
    acc[g._id.toString()] = g.count;
    return acc;
  }, {});

  const totalRooms = allRooms.length;
  const totalCapacity = allRooms.reduce((s, r) => s + (r.capacity || 1), 0);
  const totalOccupied = Object.keys(roomOccupancyMap).length;
  const totalGuests = Object.values(roomOccupancyMap).reduce(
    (s, c) => s + c,
    0,
  );

  const occupancyRate =
    totalRooms > 0 ? Math.round((totalOccupied / totalRooms) * 100) : 0;
  const capacityUtilization =
    totalCapacity > 0 ? Math.round((totalGuests / totalCapacity) * 100) : 0;

  const roomDetails = allRooms.map((r) => ({
    roomNumber: r.number,
    type: r.type || "standard",
    capacity: r.capacity || 1,
    occupied: roomOccupancyMap[r._id.toString()] || 0,
    available: (r.capacity || 1) - (roomOccupancyMap[r._id.toString()] || 0),
    utilizationRate:
      r.capacity > 0
        ? Math.round(
            ((roomOccupancyMap[r._id.toString()] || 0) / r.capacity) * 100,
          )
        : 0,
  }));

  return {
    summary: {
      totalRooms,
      totalCapacity,
      occupiedRooms: totalOccupied,
      availableRooms: totalRooms - totalOccupied,
      totalGuestsAssigned: totalGuests,
      occupancyRate,
      capacityUtilization,
    },
    typeBreakdown: typeBreakdown.map((t) => ({
      type: t._id || "standard",
      count: t.count,
      totalCapacity: t.totalCapacity,
    })),
    roomDetails,
  };
};

// ─── SERVICE REQUEST ANALYTICS ───────────────────────────────────────────────

const getServiceAnalytics = async (eventId) => {
  const eid = toObjectId(eventId);

  const [
    total,
    byStatus,
    byType,
    byUrgency,
    permissionGranted,
    recentResolved,
  ] = await Promise.all([
    ServiceRequestModel.countDocuments({ event: eid }),

    ServiceRequestModel.aggregate([
      { $match: { event: eid } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    ServiceRequestModel.aggregate([
      { $match: { event: eid } },
      { $group: { _id: "$requestType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    ServiceRequestModel.aggregate([
      { $match: { event: eid } },
      { $group: { _id: "$urgency", count: { $sum: 1 } } },
    ]),

    ServiceRequestModel.countDocuments({
      event: eid,
      permissionToEnter: true,
    }),

    ServiceRequestModel.find({
      event: eid,
      status: "completed",
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("guest", "fullName")
      .populate("room", "number")
      .lean(),
  ]);

  const statusMap = byStatus.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  const open = statusMap["open"] || 0;
  const inProgress = statusMap["in_progress"] || 0;
  const completed = statusMap["completed"] || 0;
  const cancelled = statusMap["cancelled"] || 0;

  const resolutionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingRate =
    total > 0 ? Math.round(((open + inProgress) / total) * 100) : 0;

  const typeLabels = {
    housekeeping: "Housekeeping",
    maintenance: "Maintenance",
    fb: "Food & Beverage",
    valet: "Valet",
    other: "Other",
  };

  return {
    summary: {
      total,
      open,
      inProgress,
      completed,
      cancelled,
      permissionGranted,
      resolutionRate,
      pendingRate,
    },
    byType: byType.map((t) => ({
      type: t._id,
      label: typeLabels[t._id] || t._id,
      count: t.count,
      percentage: total > 0 ? Math.round((t.count / total) * 100) : 0,
    })),
    byUrgency: byUrgency.map((u) => ({
      urgency: u._id,
      count: u.count,
      percentage: total > 0 ? Math.round((u.count / total) * 100) : 0,
    })),
    recentResolved,
  };
};

// ─── TRANSPORT ANALYTICS ─────────────────────────────────────────────────────

const getTransportAnalytics = async (eventId) => {
  const eid = toObjectId(eventId);

  const [total, byStatus, byHour, topDrivers, topRoutes] = await Promise.all([
    TransportModel.countDocuments({ event: eid }),

    TransportModel.aggregate([
      { $match: { event: eid } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Transports by scheduled hour
    TransportModel.aggregate([
      {
        $match: {
          event: eid,
          scheduledTime: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: { $hour: "$scheduledTime" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Top drivers by trip count
    TransportModel.aggregate([
      {
        $match: {
          event: eid,
          driverName: { $exists: true, $ne: "" },
        },
      },
      { $group: { _id: "$driverName", trips: { $sum: 1 } } },
      { $sort: { trips: -1 } },
      { $limit: 5 },
    ]),

    // Top pickup-dropoff routes
    TransportModel.aggregate([
      { $match: { event: eid } },
      {
        $group: {
          _id: {
            pickup: "$pickupLocation",
            dropoff: "$dropoffLocation",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const statusMap = byStatus.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  return {
    summary: {
      total,
      scheduled: statusMap["scheduled"] || 0,
      inTransit: statusMap["in_transit"] || 0,
      arrived: statusMap["arrived"] || 0,
      cancelled: statusMap["cancelled"] || 0,
      completionRate:
        total > 0 ? Math.round(((statusMap["arrived"] || 0) / total) * 100) : 0,
    },
    byHour: Array.from({ length: 24 }, (_, h) => {
      const found = byHour.find((x) => x._id === h);
      return { hour: h, count: found ? found.count : 0 };
    }),
    topDrivers: topDrivers.map((d) => ({
      driver: d._id,
      trips: d.trips,
    })),
    topRoutes: topRoutes.map((r) => ({
      pickup: r._id.pickup,
      dropoff: r._id.dropoff,
      count: r.count,
    })),
  };
};

// ─── TEAM ANALYTICS ──────────────────────────────────────────────────────────

const getTeamAnalytics = async (eventId) => {
  const eid = toObjectId(eventId);

  const [total, byStatus, byRole] = await Promise.all([
    TeamMemberModel.countDocuments({ event: eid }),

    TeamMemberModel.aggregate([
      { $match: { event: eid } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    TeamMemberModel.aggregate([
      { $match: { event: eid } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const statusMap = byStatus.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  const active = statusMap["active"] || 0;
  const inactive = statusMap["inactive"] || 0;

  return {
    summary: {
      total,
      active,
      inactive,
      activeRate: total > 0 ? Math.round((active / total) * 100) : 0,
    },
    byRole: byRole.map((r) => ({
      role: r._id || "Unassigned",
      count: r.count,
      percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
    })),
  };
};

// ─── SCHEDULE ANALYTICS ──────────────────────────────────────────────────────

const getScheduleAnalytics = async (eventId) => {
  const eid = toObjectId(eventId);

  const [total, byStatus, byWorkstream, upcoming] = await Promise.all([
    ScheduleActivity.countDocuments({ eventId: eid }),

    ScheduleActivity.aggregate([
      { $match: { eventId: eid } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    ScheduleActivity.aggregate([
      { $match: { eventId: eid } },
      { $group: { _id: "$workstream", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    ScheduleActivity.find({
      eventId: eid,
      startTime: { $gte: new Date() },
    })
      .sort({ startTime: 1 })
      .limit(5)
      .lean(),
  ]);

  const statusMap = byStatus.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  return {
    summary: {
      total,
      confirmed: statusMap["Confirmed"] || 0,
      active: statusMap["Active"] || 0,
      pending: statusMap["Pending"] || 0,
      cancelled: statusMap["Cancelled"] || 0,
      completionRate:
        total > 0
          ? Math.round(((statusMap["Confirmed"] || 0) / total) * 100)
          : 0,
    },
    byWorkstream: byWorkstream.map((w) => ({
      workstream: w._id,
      count: w.count,
      percentage: total > 0 ? Math.round((w.count / total) * 100) : 0,
    })),
    upcomingActivities: upcoming,
  };
};

// ─── ACTIVITY LOG ANALYTICS ──────────────────────────────────────────────────

const getActivityAnalytics = async (eventId) => {
  const eid = toObjectId(eventId);

  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [total, byType, byPriority, dailyTrend, criticalToday] =
    await Promise.all([
      ActivityLogModel.countDocuments({ event: eid }),

      ActivityLogModel.aggregate([
        { $match: { event: eid } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      ActivityLogModel.aggregate([
        { $match: { event: eid } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),

      // Daily count for last 7 days
      ActivityLogModel.aggregate([
        {
          $match: {
            event: eid,
            timestamp: { $gte: last7Days },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      ActivityLogModel.countDocuments({
        event: eid,
        priority: { $in: ["high", "critical"] },
        timestamp: {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
        },
      }),
    ]);

  return {
    summary: {
      total,
      criticalToday,
    },
    byType: byType.map((t) => ({
      type: t._id,
      count: t.count,
    })),
    byPriority: byPriority.map((p) => ({
      priority: p._id,
      count: p.count,
    })),
    dailyTrend: dailyTrend.map((d) => ({
      date: d._id,
      count: d.count,
    })),
  };
};

// ─── FULL EVENT ANALYTICS REPORT ─────────────────────────────────────────────

const getFullAnalyticsReport = async (eventId) => {
  const event = await EventModel.findById(eventId).lean();
  if (!event) throw new Error("Event not found");

  const [
    guestAnalytics,
    roomAnalytics,
    serviceAnalytics,
    transportAnalytics,
    teamAnalytics,
    scheduleAnalytics,
    activityAnalytics,
  ] = await Promise.all([
    getGuestAnalytics(eventId),
    getRoomAnalytics(eventId),
    getServiceAnalytics(eventId),
    getTransportAnalytics(eventId),
    getTeamAnalytics(eventId),
    getScheduleAnalytics(eventId),
    getActivityAnalytics(eventId),
  ]);

  return {
    event: {
      _id: event._id,
      name: event.name,
      venue: event.venue,
      startDate: event.startDate,
      endDate: event.endDate,
      isPrivate: event.isPrivate,
    },
    guests: guestAnalytics,
    rooms: roomAnalytics,
    services: serviceAnalytics,
    transport: transportAnalytics,
    team: teamAnalytics,
    schedule: scheduleAnalytics,
    activity: activityAnalytics,
    generatedAt: new Date().toISOString(),
  };
};

// ─── CSV EXPORT HELPERS ───────────────────────────────────────────────────────

const getGuestListCsv = async (eventId) => {
  const guests = await GuestModel.find({ event: eventId })
    .populate("room", "number type")
    .lean();

  const headers = [
    "Full Name",
    "Email",
    "Phone",
    "Age",
    "Group",
    "VIP",
    "Checked In",
    "Check-In Time",
    "Check-Out Time",
    "Room",
    "Arrival",
    "Departure",
    "Transport Mode",
    "Special Requests",
  ];

  const rows = guests.map((g) => [
    g.fullName || "",
    g.email || "",
    g.phoneNumber || "",
    g.age || "",
    g.groupName || "",
    g.vipStatus ? "Yes" : "No",
    g.checkedIn ? "Yes" : "No",
    g.checkedInAt ? new Date(g.checkedInAt).toLocaleString() : "",
    g.checkedOutAt ? new Date(g.checkedOutAt).toLocaleString() : "",
    g.room ? g.room.number : "",
    g.arrivalDatetime ? new Date(g.arrivalDatetime).toLocaleString() : "",
    g.departureDatetime ? new Date(g.departureDatetime).toLocaleString() : "",
    g.transportMode || "",
    (g.specialRequests || "").replace(/,/g, ";"),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((v) => `"${v}"`).join(","))
    .join("\n");
};

const getServiceRequestsCsv = async (eventId) => {
  const requests = await ServiceRequestModel.find({ event: eventId })
    .populate("guest", "fullName email")
    .populate("room", "number")
    .lean();

  const headers = [
    "ID",
    "Guest",
    "Room",
    "Type",
    "Urgency",
    "Status",
    "Permission to Enter",
    "Notes",
    "Created At",
  ];

  const rows = requests.map((r) => [
    r._id.toString().slice(-8).toUpperCase(),
    r.guest ? r.guest.fullName : "N/A",
    r.room ? r.room.number : "N/A",
    r.requestType || "",
    r.urgency || "",
    r.status || "",
    r.permissionToEnter ? "Yes" : "No",
    (r.notes || "").replace(/,/g, ";"),
    r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
  ]);

  return [headers, ...rows]
    .map((row) => row.map((v) => `"${v}"`).join(","))
    .join("\n");
};

const getTransportLogCsv = async (eventId) => {
  const transports = await TransportModel.find({ event: eventId })
    .populate("guest", "fullName")
    .lean();

  const headers = [
    "Guest",
    "Driver",
    "Vehicle",
    "Pickup",
    "Dropoff",
    "Scheduled Time",
    "Status",
    "Notes",
  ];

  const rows = transports.map((t) => [
    t.guest ? t.guest.fullName : "Group/General",
    t.driverName || "",
    t.vehicleId || "",
    t.pickupLocation || "",
    t.dropoffLocation || "",
    t.scheduledTime ? new Date(t.scheduledTime).toLocaleString() : "",
    t.status || "",
    (t.notes || "").replace(/,/g, ";"),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((v) => `"${v}"`).join(","))
    .join("\n");
};

module.exports = {
  getGuestAnalytics,
  getRoomAnalytics,
  getServiceAnalytics,
  getTransportAnalytics,
  getTeamAnalytics,
  getScheduleAnalytics,
  getActivityAnalytics,
  getFullAnalyticsReport,
  getGuestListCsv,
  getServiceRequestsCsv,
  getTransportLogCsv,
};

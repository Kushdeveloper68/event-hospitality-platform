const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
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

const slugifyFilename = (value) =>
  String(value || "event")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "event";

const formatExportDate = (value) => (value ? new Date(value).toLocaleString() : "");

const columnLetter = (index) => {
  let result = "";
  let current = index;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    current = Math.floor((current - 1) / 26);
  }

  return result;
};

const buildWorksheet = (workbook, sheetName, columns, rows) => {
  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.columns = columns;
  worksheet.addRows(rows);

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF111827" },
  };
  headerRow.alignment = { vertical: "middle" };

  worksheet.eachRow((row) => {
    row.alignment = { vertical: "top", wrapText: true };
  });

  worksheet.columns.forEach((column) => {
    const headerWidth = String(column.header || "").length;
    const cellWidths = rows.map((row) => String(row[column.key] ?? "").length);
    column.width = Math.min(Math.max(headerWidth + 2, ...cellWidths, 12), 36);
  });

  worksheet.autoFilter = `A1:${columnLetter(columns.length)}1`;

  return worksheet;
};

const getEventWorkbookBuffer = async (eventId) => {
  const eid = toObjectId(eventId);

  const [
    event,
    rooms,
    guests,
    serviceRequests,
    transports,
    teamMembers,
    scheduleActivities,
    guestRoomCounts,
  ] = await Promise.all([
    EventModel.findById(eid).populate("createdBy", "name email").lean(),
    RoomModel.find({ event: eid }).sort({ number: 1 }).lean(),
    GuestModel.find({ event: eid })
      .populate("room", "number type capacity")
      .sort({ fullName: 1 })
      .lean(),
    ServiceRequestModel.find({ event: eid })
      .populate("guest", "fullName email")
      .populate("room", "number")
      .sort({ createdAt: -1 })
      .lean(),
    TransportModel.find({ event: eid })
      .populate("guest", "fullName email")
      .sort({ scheduledTime: 1 })
      .lean(),
    TeamMemberModel.find({ event: eid }).sort({ createdAt: -1 }).lean(),
    ScheduleActivity.find({ eventId: eid }).sort({ startTime: 1 }).lean(),
    GuestModel.aggregate([
      { $match: { event: eid, room: { $ne: null } } },
      { $group: { _id: "$room", count: { $sum: 1 } } },
    ]),
  ]);

  if (!event) {
    throw new Error("Event not found");
  }

  const roomCountMap = guestRoomCounts.reduce((acc, item) => {
    acc[String(item._id)] = item.count;
    return acc;
  }, {});

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "EventCure";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.title = `${event.name} Export`;
  workbook.subject = "Event data export";
  workbook.company = "EventCure";

  buildWorksheet(
    workbook,
    "Event Summary",
    [
      { header: "Field", key: "field" },
      { header: "Value", key: "value" },
    ],
    [
      { field: "Event Name", value: event.name || "" },
      { field: "Venue", value: event.venue || "" },
      { field: "Start Date", value: formatExportDate(event.startDate) },
      { field: "End Date", value: formatExportDate(event.endDate) },
      { field: "Private Event", value: event.isPrivate ? "Yes" : "No" },
      {
        field: "Owner",
        value: event.createdBy
          ? `${event.createdBy.name || ""}${event.createdBy.email ? ` (${event.createdBy.email})` : ""}`.trim()
          : "",
      },
      { field: "Total Rooms", value: rooms.length },
      { field: "Total Guests", value: guests.length },
      { field: "Total Services", value: serviceRequests.length },
      { field: "Total Transport Requests", value: transports.length },
      { field: "Total Team Members", value: teamMembers.length },
      { field: "Total Schedule Items", value: scheduleActivities.length },
      { field: "Export Generated At", value: new Date().toLocaleString() },
    ],
  );

  buildWorksheet(
    workbook,
    "Rooms",
    [
      { header: "Room Number", key: "roomNumber" },
      { header: "Type", key: "type" },
      { header: "Capacity", key: "capacity" },
      { header: "Guest Count", key: "guestCount" },
      { header: "Available Slots", key: "availableSlots" },
      { header: "Notes", key: "notes" },
      { header: "Created At", key: "createdAt" },
      { header: "Updated At", key: "updatedAt" },
    ],
    rooms.map((room) => ({
      roomNumber: room.number || "",
      type: room.type || "",
      capacity: room.capacity ?? 1,
      guestCount: roomCountMap[String(room._id)] || 0,
      availableSlots: Math.max((room.capacity ?? 1) - (roomCountMap[String(room._id)] || 0), 0),
      notes: room.notes || "",
      createdAt: formatExportDate(room.createdAt),
      updatedAt: formatExportDate(room.updatedAt),
    })),
  );

  buildWorksheet(
    workbook,
    "Guests",
    [
      { header: "Full Name", key: "fullName" },
      { header: "Email", key: "email" },
      { header: "Phone", key: "phoneNumber" },
      { header: "Age", key: "age" },
      { header: "Group", key: "groupName" },
      { header: "VIP", key: "vipStatus" },
      { header: "Checked In", key: "checkedIn" },
      { header: "Check-In Time", key: "checkedInAt" },
      { header: "Check-Out Time", key: "checkedOutAt" },
      { header: "Room", key: "roomNumber" },
      { header: "Room Type", key: "roomType" },
      { header: "Arrival", key: "arrivalDatetime" },
      { header: "Departure", key: "departureDatetime" },
      { header: "Transport Mode", key: "transportMode" },
      { header: "Special Requests", key: "specialRequests" },
      { header: "Created At", key: "createdAt" },
      { header: "Updated At", key: "updatedAt" },
    ],
    guests.map((guest) => ({
      fullName: guest.fullName || "",
      email: guest.email || "",
      phoneNumber: guest.phoneNumber || "",
      age: guest.age ?? "",
      groupName: guest.groupName || "",
      vipStatus: guest.vipStatus ? "Yes" : "No",
      checkedIn: guest.checkedIn ? "Yes" : "No",
      checkedInAt: formatExportDate(guest.checkedInAt),
      checkedOutAt: formatExportDate(guest.checkedOutAt),
      roomNumber: guest.room?.number || "",
      roomType: guest.room?.type || "",
      arrivalDatetime: formatExportDate(guest.arrivalDatetime),
      departureDatetime: formatExportDate(guest.departureDatetime),
      transportMode: guest.transportMode || "",
      specialRequests: guest.specialRequests || "",
      createdAt: formatExportDate(guest.createdAt),
      updatedAt: formatExportDate(guest.updatedAt),
    })),
  );

  buildWorksheet(
    workbook,
    "Services",
    [
      { header: "ID", key: "id" },
      { header: "Guest", key: "guest" },
      { header: "Room", key: "room" },
      { header: "Type", key: "requestType" },
      { header: "Urgency", key: "urgency" },
      { header: "Status", key: "status" },
      { header: "Permission to Enter", key: "permissionToEnter" },
      { header: "Notes", key: "notes" },
      { header: "Created At", key: "createdAt" },
      { header: "Updated At", key: "updatedAt" },
    ],
    serviceRequests.map((request) => ({
      id: request._id.toString().slice(-8).toUpperCase(),
      guest: request.guest ? request.guest.fullName : "N/A",
      room: request.room ? request.room.number : "N/A",
      requestType: request.requestType || "",
      urgency: request.urgency || "",
      status: request.status || "",
      permissionToEnter: request.permissionToEnter ? "Yes" : "No",
      notes: request.notes || "",
      createdAt: formatExportDate(request.createdAt),
      updatedAt: formatExportDate(request.updatedAt),
    })),
  );

  buildWorksheet(
    workbook,
    "Schedule",
    [
      { header: "Title", key: "title" },
      { header: "Workstream", key: "workstream" },
      { header: "Start Time", key: "startTime" },
      { header: "End Time", key: "endTime" },
      { header: "Location", key: "location" },
      { header: "Assigned To", key: "assignedTo" },
      { header: "Status", key: "status" },
      { header: "Description", key: "description" },
      { header: "Created At", key: "createdAt" },
      { header: "Updated At", key: "updatedAt" },
    ],
    scheduleActivities.map((activity) => ({
      title: activity.title || "",
      workstream: activity.workstream || "",
      startTime: formatExportDate(activity.startTime),
      endTime: formatExportDate(activity.endTime),
      location: activity.location || "",
      assignedTo: activity.assignedTo || "",
      status: activity.status || "",
      description: activity.description || "",
      createdAt: formatExportDate(activity.createdAt),
      updatedAt: formatExportDate(activity.updatedAt),
    })),
  );

  buildWorksheet(
    workbook,
    "Team",
    [
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Role", key: "role" },
      { header: "Status", key: "status" },
      { header: "Last Active", key: "lastActive" },
      { header: "Created At", key: "createdAt" },
      { header: "Updated At", key: "updatedAt" },
    ],
    teamMembers.map((member) => ({
      name: member.name || "",
      email: member.email || "",
      role: member.role || "",
      status: member.status || "",
      lastActive: formatExportDate(member.lastActive),
      createdAt: formatExportDate(member.createdAt),
      updatedAt: formatExportDate(member.updatedAt),
    })),
  );

  buildWorksheet(
    workbook,
    "Transport",
    [
      { header: "Guest", key: "guest" },
      { header: "Driver", key: "driverName" },
      { header: "Vehicle", key: "vehicleId" },
      { header: "Pickup Location", key: "pickupLocation" },
      { header: "Dropoff Location", key: "dropoffLocation" },
      { header: "Scheduled Time", key: "scheduledTime" },
      { header: "Status", key: "status" },
      { header: "Notes", key: "notes" },
      { header: "Created At", key: "createdAt" },
      { header: "Updated At", key: "updatedAt" },
    ],
    transports.map((transport) => ({
      guest: transport.guest ? transport.guest.fullName : "Group/General",
      driverName: transport.driverName || "",
      vehicleId: transport.vehicleId || "",
      pickupLocation: transport.pickupLocation || "",
      dropoffLocation: transport.dropoffLocation || "",
      scheduledTime: formatExportDate(transport.scheduledTime),
      status: transport.status || "",
      notes: transport.notes || "",
      createdAt: formatExportDate(transport.createdAt),
      updatedAt: formatExportDate(transport.updatedAt),
    })),
  );

  const buffer = await workbook.xlsx.writeBuffer();

  return {
    buffer: Buffer.from(buffer),
    filename: `event-data-${slugifyFilename(event.name)}-${Date.now()}.xlsx`,
  };
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
  getEventWorkbookBuffer,
};

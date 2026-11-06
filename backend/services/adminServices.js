const UserModel = require("../models/userModel");
const EventModel = require("../models/eventModel");
const GuestModel = require("../models/guestModel");

/**
 * Build a day-by-day signup count for the last `days` days (oldest first),
 * always including days with zero signups so the frontend can render a
 * complete, evenly-spaced trend without gaps.
 */
const getSignupTrend = async (days = 14) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const raw = await UserModel.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);

  const countsByDay = new Map(raw.map((r) => [r._id, r.count]));

  const trend = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    trend.push({ date: key, count: countsByDay.get(key) || 0 });
  }
  return trend;
};

/**
 * Signups grouped by where they came from, with how many verified their email
 * and how many went on to create an event ("activated"). Accounts created
 * before tracking started show up as "unknown".
 */
const getSignupSources = async () => {
  const organizerIds = await EventModel.distinct("createdBy");
  const rows = await UserModel.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$signupSource.source", "unknown"] },
        total: { $sum: 1 },
        verified: { $sum: { $cond: ["$isEmailVerified", 1, 0] } },
        activated: { $sum: { $cond: [{ $in: ["$_id", organizerIds] }, 1, 0] } },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 12 },
  ]);
  return rows.map((r) => ({ source: r._id, total: r.total, verified: r.verified, activated: r.activated }));
};

/**
 * Full platform admin stats — everything the Admin Dashboard needs in one call.
 */
const getPlatformStats = async () => {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date();
  monthStart.setDate(monthStart.getDate() - 30);

  const [
    totalUsers,
    verifiedUsers,
    newUsersToday,
    newUsersThisWeek,
    newUsersThisMonth,
    totalEvents,
    activeEvents,
    eventsThisWeek,
    totalGuestsAgg,
    recentSignups,
    topOrganizers,
    signupTrend,
    signupSources,
  ] = await Promise.all([
    UserModel.countDocuments({}),
    UserModel.countDocuments({ isEmailVerified: true }),
    UserModel.countDocuments({ createdAt: { $gte: todayStart } }),
    UserModel.countDocuments({ createdAt: { $gte: weekStart } }),
    UserModel.countDocuments({ createdAt: { $gte: monthStart } }),
    EventModel.countDocuments({}),
    EventModel.countDocuments({ startDate: { $lte: now }, endDate: { $gte: now } }),
    EventModel.countDocuments({ createdAt: { $gte: weekStart } }),
    GuestModel.aggregate([{ $count: "total" }]),
    UserModel.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name email organizationName isEmailVerified isAdmin createdAt signupSource signupMethod"),
    EventModel.aggregate([
      { $group: { _id: "$createdBy", eventCount: { $sum: 1 } } },
      { $sort: { eventCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          organizationName: "$user.organizationName",
          eventCount: 1,
        },
      },
    ]),
    getSignupTrend(14),
    getSignupSources(),
  ]);

  return {
    users: {
      total: totalUsers,
      verified: verifiedUsers,
      unverified: totalUsers - verifiedUsers,
      newToday: newUsersToday,
      newThisWeek: newUsersThisWeek,
      newThisMonth: newUsersThisMonth,
    },
    events: {
      total: totalEvents,
      active: activeEvents,
      newThisWeek: eventsThisWeek,
    },
    guests: {
      total: totalGuestsAgg[0]?.total || 0,
    },
    signupTrend,
    recentSignups: recentSignups.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      organizationName: u.organizationName,
      isEmailVerified: u.isEmailVerified,
      isAdmin: u.isAdmin,
      createdAt: u.createdAt,
      source: u.signupSource?.source || null,
      medium: u.signupSource?.medium || null,
      campaign: u.signupSource?.campaign || null,
      method: u.signupMethod || null,
    })),
    signupSources,
    topOrganizers,
  };
};

module.exports = {
  getPlatformStats,
  getSignupTrend,
  getSignupSources,
};
const GuestModel = require("../models/guestModel");

// The check-in desk only needs these fields. Sending whole guest documents
// (plus a fully populated room) for every guest in the event made this the
// heaviest request in the app.
const DESK_FIELDS = "fullName groupName vipStatus arrivalDatetime checkedIn checkedInAt room";

/**
 * Get guests arriving today who haven't checked in yet
 * Sorted by arrivalDatetime ASC (earliest first)
 */
const getArrivingToday = async (eventId) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const guests = await GuestModel.find({
      event: eventId,
      checkedIn: false,
      arrivalDatetime: { $gte: todayStart, $lte: todayEnd },
    })
      .select(DESK_FIELDS)
      .populate("room", "number type")
      .sort({ arrivalDatetime: 1 })
      .lean();

    return guests;
  } catch (error) {
    throw new Error("Failed to fetch arriving guests: " + error.message);
  }
};

/**
 * Get currently checked-in guests
 * Sorted by checkedInAt DESC (most recent first)
 */
const getCheckedInGuests = async (eventId) => {
  try {
    const guests = await GuestModel.find({
      event: eventId,
      checkedIn: true,
    })
      .select(DESK_FIELDS)
      .populate("room", "number type")
      .sort({ checkedInAt: -1 })
      .lean();

    return guests;
  } catch (error) {
    throw new Error("Failed to fetch checked-in guests: " + error.message);
  }
};

/**
 * Get pending / overdue guests (arrival time has passed but not checked in, or no arrival time set)
 * Sorted by arrivalDatetime ASC
 */
const getPendingGuests = async (eventId) => {
  try {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const guests = await GuestModel.find({
      event: eventId,
      checkedIn: false,
      $or: [
        // arrival time is in the past (before now but could be today or earlier)
        { arrivalDatetime: { $lt: now, $gte: todayStart } },
        // no arrival time set at all
        { arrivalDatetime: null },
        { arrivalDatetime: { $exists: false } },
      ],
    })
      .select(DESK_FIELDS)
      .populate("room", "number type")
      .sort({ arrivalDatetime: 1 })
      .lean();

    return guests;
  } catch (error) {
    throw new Error("Failed to fetch pending guests: " + error.message);
  }
};

/**
 * Check in a guest
 */
const checkInGuest = async (guestId) => {
  try {
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
      throw new Error("Guest not found");
    }
    if (guest.checkedIn) {
      throw new Error("Guest is already checked in");
    }

    guest.checkedIn = true;
    guest.checkedInAt = new Date();
    guest.checkedOutAt = null;
    await guest.save();

    // return populated guest
    const updated = await GuestModel.findById(guestId).populate("room");
    return updated;
  } catch (error) {
    throw new Error(error.message || "Failed to check in guest");
  }
};

/**
 * Check out a guest
 */
const checkOutGuest = async (guestId) => {
  try {
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
      throw new Error("Guest not found");
    }
    if (!guest.checkedIn) {
      throw new Error("Guest is not checked in");
    }

    guest.checkedIn = false;
    guest.checkedOutAt = new Date();
    await guest.save();

    const updated = await GuestModel.findById(guestId).populate("room");
    return updated;
  } catch (error) {
    throw new Error(error.message || "Failed to check out guest");
  }
};

/**
 * Get check-in summary counts for an event
 */
const getCheckInSummary = async (eventId) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const now = new Date();

    const [totalGuests, checkedIn, arrivingToday, pending] = await Promise.all([
      GuestModel.countDocuments({ event: eventId }),
      GuestModel.countDocuments({ event: eventId, checkedIn: true }),
      GuestModel.countDocuments({
        event: eventId,
        checkedIn: false,
        arrivalDatetime: { $gte: todayStart, $lte: todayEnd },
      }),
      GuestModel.countDocuments({
        event: eventId,
        checkedIn: false,
        $or: [
          { arrivalDatetime: { $lt: now, $gte: todayStart } },
          { arrivalDatetime: null },
          { arrivalDatetime: { $exists: false } },
        ],
      }),
    ]);

    return { totalGuests, checkedIn, arrivingToday, pending };
  } catch (error) {
    throw new Error("Failed to fetch check-in summary: " + error.message);
  }
};

module.exports = {
  getArrivingToday,
  getCheckedInGuests,
  getPendingGuests,
  checkInGuest,
  checkOutGuest,
  getCheckInSummary,
};

const GuestModel = require("../models/guestModel");

/**
 * Create a guest record
 * @param {Object} guestData
 * @returns {Promise}
 */
const createGuest = async (guestData) => {
  try {
    const newGuest = new GuestModel(guestData);
    const saved = await newGuest.save();
    return saved;
  } catch (error) {
    throw new Error("Failed to create guest: " + error.message);
  }
};

/**
 * Fetch guests with optional filters/pagination
 * @param {Object} options
 * @param {string} options.eventId
 * @param {string} [options.search] - substring to search name/email/phone
 * @param {boolean} [options.vip] - vip status filter
 * @param {string} [options.status] - 'checkedin' | 'arriving' | 'noshow' etc
 * @param {number} [options.page]
 * @param {number} [options.limit]
 * @returns {Promise<{total:number,page:number,limit:number,guests:Array}>}
 */
const getGuests = async ({ eventId, search, vip, status, page = 1, limit = 10 }) => {
  try {
    const query = {};
    if (eventId) {
      // allow passing a single eventId or an array of eventIds
      if (Array.isArray(eventId) && eventId.length > 0) {
        query.event = { $in: eventId };
      } else {
        query.event = eventId;
      }
    }
    if (typeof vip !== "undefined") query.vipStatus = vip;
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { fullName: regex },
        { email: regex },
        { phoneNumber: regex },
        { groupName: regex },
      ];
    }

    // simple status handling
    if (status) {
      switch (status) {
        case "checkedin":
          query.checkedIn = true;
          break;
        case "notchecked":
          query.checkedIn = false;
          break;
        // you could expand for other statuses
      }
    }

    const skip = (page - 1) * limit;
    const total = await GuestModel.countDocuments(query);
    const guests = await GuestModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { total, page, limit, guests };
  } catch (error) {
    throw new Error("Failed to fetch guests: " + error.message);
  }
};

/**
 * Get a single guest by ID
 */
const getGuestById = async (guestId) => {
  try {
    const guest = await GuestModel.findById(guestId);
    if (!guest) {
      throw new Error("Guest not found");
    }
    return guest;
  } catch (error) {
    throw new Error("Failed to fetch guest: " + error.message);
  }
};

/**
 * Update a guest record
 */
const updateGuest = async (guestId, updateData) => {
  try {
    const updated = await GuestModel.findByIdAndUpdate(guestId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw new Error("Guest not found");
    }
    return updated;
  } catch (error) {
    throw new Error("Failed to update guest: " + error.message);
  }
};

/**
 * Delete guest
 */
const deleteGuest = async (guestId) => {
  try {
    const deleted = await GuestModel.findByIdAndDelete(guestId);
    if (!deleted) {
      throw new Error("Guest not found");
    }
    return deleted;
  } catch (error) {
    throw new Error("Failed to delete guest: " + error.message);
  }
};

module.exports = {
  createGuest,
  getGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
};

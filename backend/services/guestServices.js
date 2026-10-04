const GuestModel = require("../models/guestModel");

/**
 * Parses a date/time string in the format the import template uses:
 * "YYYY-MM-DD HH:mm" (24-hour) or just "YYYY-MM-DD".
 * Returns a Date, or throws a clear error if the string doesn't match.
 * (A plain `new Date(str)` is avoided here because its behaviour for
 * non-ISO strings differs across Node/browser versions — this keeps
 * import results deterministic.)
 */
const parseImportDate = (value, fieldLabel) => {
  if (!value || !String(value).trim()) return undefined;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?$/);
  if (!match) {
    throw new Error(
      `${fieldLabel} must be in YYYY-MM-DD or YYYY-MM-DD HH:mm format, got "${raw}"`,
    );
  }
  const isoString = match[2] ? `${match[1]}T${match[2]}` : `${match[1]}T00:00`;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error(`${fieldLabel} "${raw}" is not a valid date`);
  }
  return date;
};

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
const getGuests = async ({
  eventId,
  search,
  vip,
  status,
  page = 1,
  limit = 10,
}) => {
  try {
    const query = {};
    if (eventId) query.event = eventId;
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
      .populate("room")
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

/**
 * Bulk create guests from a parsed CSV import.
 * Each row is validated and saved independently so one bad row
 * doesn't block the rest of the import.
 * @param {string} eventId
 * @param {Array<Object>} rows - each row: { fullName, email, phoneNumber, age, groupName, vipStatus, specialRequests }
 * @returns {Promise<{createdCount:number, failed:Array<{row:number, reason:string}>}>}
 */
const bulkCreateGuests = async (eventId, rows) => {
  let createdCount = 0;
  const failed = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      if (!row.fullName || !String(row.fullName).trim()) {
        throw new Error("fullName is required");
      }
      if (!row.arrivalDatetime || !String(row.arrivalDatetime).trim()) {
        throw new Error("arrivalDatetime is required");
      }
      const guestData = {
        event: eventId,
        fullName: String(row.fullName).trim(),
        email: row.email ? String(row.email).trim() : undefined,
        phoneNumber: row.phoneNumber
          ? String(row.phoneNumber).trim()
          : undefined,
        age: row.age ? Number(row.age) : undefined,
        groupName: row.groupName ? String(row.groupName).trim() : undefined,
        vipStatus: ["true", "yes", "1", true].includes(
          typeof row.vipStatus === "string"
            ? row.vipStatus.toLowerCase()
            : row.vipStatus,
        ),
        specialRequests: row.specialRequests
          ? String(row.specialRequests).trim()
          : undefined,
        arrivalDatetime: parseImportDate(
          row.arrivalDatetime,
          "arrivalDatetime",
        ),
        departureDatetime: parseImportDate(
          row.departureDatetime,
          "departureDatetime",
        ),
      };
      if (
        guestData.arrivalDatetime &&
        guestData.departureDatetime &&
        guestData.departureDatetime <= guestData.arrivalDatetime
      ) {
        throw new Error("departureDatetime must be after arrivalDatetime");
      }
      const newGuest = new GuestModel(guestData);
      await newGuest.save();
      createdCount += 1;
    } catch (error) {
      failed.push({ row: i + 2, reason: error.message }); // +2: header row + 1-index
    }
  }

  return { createdCount, failed };
};

module.exports = {
  createGuest,
  getGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
  bulkCreateGuests,
};

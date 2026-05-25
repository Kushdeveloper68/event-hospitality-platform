// backend/services/specificEventSettingServices.js

const EventSettingModel = require("../models/eventSettingModel");
const EventModel = require("../models/eventModel");
const GuestModel = require("../models/guestModel");
const RoomModel = require("../models/roomModel");
const TransportModel = require("../models/transportModel");
const ServiceRequestModel = require("../models/serviceRequestModel");
const ScheduleActivity = require("../models/scheduleModel");
const TeamMemberModel = require("../models/teamMemberModel");
const ActivityLogModel = require("../models/activityLogModel");

/**
 * Get settings for an event. Creates default settings if none exist.
 */
const getEventSettings = async (eventId) => {
  let settings = await EventSettingModel.findOne({ event: eventId });
  if (!settings) {
    settings = await EventSettingModel.create({ event: eventId });
  }
  return settings;
};

/**
 * Update settings for an event (upsert).
 */
const updateEventSettings = async (eventId, updateData) => {
  const { _id, event, createdAt, updatedAt, __v, ...safe } = updateData;
  const settings = await EventSettingModel.findOneAndUpdate(
    { event: eventId },
    { $set: safe },
    { new: true, upsert: true, runValidators: true }
  );
  return settings;
};

/**
 * Update only the core event info.
 */
const updateEventCoreInfo = async (eventId, coreData) => {
  const allowed = ["name", "venue", "startDate", "endDate", "description", "isPrivate"];
  const update = {};
  allowed.forEach((k) => {
    if (k in coreData) update[k] = coreData[k];
  });
  const updated = await EventModel.findByIdAndUpdate(eventId, update, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw new Error("Event not found");
  return updated;
};

/**
 * Archive or unarchive an event.
 *  @param {string} eventId
 * @param {boolean} archive
 */
const setArchiveStatus = async (eventId, archive) => {
  const settings = await EventSettingModel.findOneAndUpdate(
    { event: eventId },
    {
      $set: {
        isArchived: archive,
        archivedAt: archive ? new Date() : null,
      },
    },
    { new: true, upsert: true }
  );
  return settings;
};

/**
 * Permanently delete an event and ALL related data (cascade).
 * @param {string} eventId
 */
const deleteEventPermanently = async (eventId) => {
  const event = await EventModel.findById(eventId);
  if (!event) throw new Error("Event not found");

  // Run all deletions in parallel for speed
  await Promise.all([
    GuestModel.deleteMany({ event: eventId }),
    RoomModel.deleteMany({ event: eventId }),
    TransportModel.deleteMany({ event: eventId }),
    ServiceRequestModel.deleteMany({ event: eventId }),
    ScheduleActivity.deleteMany({ eventId: eventId }),  // note: scheduleModel uses eventId not event
    TeamMemberModel.deleteMany({ event: eventId }),
    ActivityLogModel.deleteMany({ event: eventId }),
    EventSettingModel.deleteOne({ event: eventId }),
  ]);

  await EventModel.findByIdAndDelete(eventId);
  return event;
};

/**
 * Generate a URL slug from an event name.
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

module.exports = {
  getEventSettings,
  updateEventSettings,
  updateEventCoreInfo,
  setArchiveStatus,
  deleteEventPermanently,
  generateSlug,
};
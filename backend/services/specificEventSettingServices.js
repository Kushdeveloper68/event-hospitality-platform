const EventSettingModel = require("../models/eventSettingModel");
const EventModel = require("../models/eventModel");

/**
 * Get settings for an event. Creates default settings if none exist.
 * @param {string} eventId
 * @returns {Promise<Object>} settings doc
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
 * @param {string} eventId
 * @param {Object} updateData
 * @returns {Promise<Object>} updated settings
 */
const updateEventSettings = async (eventId, updateData) => {
  // Strip protected fields
  const { _id, event, createdAt, updatedAt, __v, ...safe } = updateData;

  const settings = await EventSettingModel.findOneAndUpdate(
    { event: eventId },
    { $set: safe },
    { new: true, upsert: true, runValidators: true }
  );
  return settings;
};

/**
 * Update only the core event info (name, venue, startDate, endDate, description, isPrivate).
 * Delegates to EventModel directly — kept here for single-service flow.
 * @param {string} eventId
 * @param {Object} coreData
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
 * @param {string} eventId
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
 * Permanently delete an event and all its settings.
 * Cascading deletions are handled by the caller (controller) or can be
 * extended here based on requirements.
 * @param {string} eventId
 */
const deleteEventPermanently = async (eventId) => {
  // Remove settings document
  await EventSettingModel.deleteOne({ event: eventId });
  // Remove event itself
  const deleted = await EventModel.findByIdAndDelete(eventId);
  if (!deleted) throw new Error("Event not found");
  return deleted;
};

/**
 * Generate a unique URL slug based on event name.
 * @param {string} name
 * @param {string} eventId - exclude this event when checking uniqueness
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
const {
  getEventSettings,
  updateEventSettings,
  updateEventCoreInfo,
  setArchiveStatus,
  deleteEventPermanently,
  generateSlug,
} = require("../services/specificEventSettingServices");
const { getEventById } = require("../services/eventServices");
const { createActivityLog } = require("../services/activityLogServices");

/**
 * Helper: verify the requesting user owns the event
 */
const verifyEventOwnership = async (eventId, userId) => {
  const event = await getEventById(eventId);
  const ownerId = event.createdBy?._id || event.createdBy;
  if (userId && String(ownerId) !== String(userId)) {
    return { authorized: false, event: null };
  }
  return { authorized: true, event };
};

/**
 * GET /api/event-settings/:eventId
 * Returns both the event core info and its settings document
 */
const handleGetEventSettings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    const { authorized, event } = await verifyEventOwnership(eventId, userId);
    if (!authorized) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const settings = await getEventSettings(eventId);

    return res.status(200).json({
      success: true,
      event: {
        _id: event._id,
        name: event.name,
        venue: event.venue,
        startDate: event.startDate,
        endDate: event.endDate,
        description: event.description,
        isPrivate: event.isPrivate,
        createdBy: event.createdBy,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      },
      settings,
    });
  } catch (error) {
    console.error("Error fetching event settings:", error);
    return res.status(error.message?.includes("not found") ? 404 : 500).json({
      success: false,
      message: error.message || "Failed to fetch event settings",
    });
  }
};

/**
 * PUT /api/event-settings/:eventId/core
 * Update core event info (name, venue, dates, description, isPrivate)
 */
const handleUpdateCoreInfo = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    const { authorized } = await verifyEventOwnership(eventId, userId);
    if (!authorized) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const { name, venue, startDate, endDate, description, isPrivate } = req.body;

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Event name cannot be empty" });
    }

    const updatedEvent = await updateEventCoreInfo(eventId, {
      name,
      venue,
      startDate: startDate || null,
      endDate: endDate || null,
      description,
      isPrivate,
    });

    // Log the update
    createActivityLog({
      event: eventId,
      type: "schedule",
      message: `Event core info updated: ${updatedEvent.name}`,
      priority: "normal",
    });

    return res.status(200).json({
      success: true,
      message: "Event information updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating core info:", error);
    return res.status(error.message?.includes("not found") ? 404 : 500).json({
      success: false,
      message: error.message || "Failed to update event information",
    });
  }
};

/**
 * PUT /api/event-settings/:eventId/preferences
 * Update all settings (permissions, notifications, branding, etc.)
 */
const handleUpdateSettings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    const { authorized } = await verifyEventOwnership(eventId, userId);
    if (!authorized) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const updatedSettings = await updateEventSettings(eventId, req.body);

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update settings",
    });
  }
};

/**
 * POST /api/event-settings/:eventId/generate-slug
 * Auto-generate a URL slug from the event name
 */
const handleGenerateSlug = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    const { authorized, event } = await verifyEventOwnership(eventId, userId);
    if (!authorized) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const { name } = req.body;
    const baseName = name || event.name;
    const slug = generateSlug(baseName);

    return res.status(200).json({ success: true, slug });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to generate slug" });
  }
};

/**
 * PUT /api/event-settings/:eventId/archive
 * Archive or unarchive an event
 */
const handleSetArchive = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;
    const { archive } = req.body; // boolean

    if (typeof archive !== "boolean") {
      return res.status(400).json({ success: false, message: "'archive' (boolean) is required" });
    }

    const { authorized, event } = await verifyEventOwnership(eventId, userId);
    if (!authorized) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    const settings = await setArchiveStatus(eventId, archive);

    createActivityLog({
      event: eventId,
      type: "schedule",
      message: `Event "${event.name}" ${archive ? "archived" : "unarchived"}`,
      priority: "normal",
    });

    return res.status(200).json({
      success: true,
      message: archive ? "Event archived successfully" : "Event unarchived successfully",
      settings,
    });
  } catch (error) {
    console.error("Error archiving event:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update archive status" });
  }
};

/**
 * DELETE /api/event-settings/:eventId/delete
 * Permanently delete an event (danger zone)
 */
const handleDeleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    const { authorized, event } = await verifyEventOwnership(eventId, userId);
    if (!authorized) {
      return res.status(403).json({ success: false, message: "Forbidden: you do not own this event" });
    }

    // Optional: require confirmation string in body
    const { confirmName } = req.body;
    if (!confirmName || confirmName.trim() !== event.name.trim()) {
      return res.status(400).json({
        success: false,
        message: `To confirm deletion, provide the exact event name: "${event.name}"`,
      });
    }

    await deleteEventPermanently(eventId);

    return res.status(200).json({
      success: true,
      message: `Event "${event.name}" has been permanently deleted`,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(error.message?.includes("not found") ? 404 : 500).json({
      success: false,
      message: error.message || "Failed to delete event",
    });
  }
};

module.exports = {
  handleGetEventSettings,
  handleUpdateCoreInfo,
  handleUpdateSettings,
  handleGenerateSlug,
  handleSetArchive,
  handleDeleteEvent,
};
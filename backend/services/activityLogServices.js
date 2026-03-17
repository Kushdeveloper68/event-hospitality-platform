const ActivityLogModel = require("../models/activityLogModel");

/**
 * Create a new activity log entry
 * @param {Object} logData - { event, type, message, relatedGuest, relatedStaff, priority }
 */
const createActivityLog = async (logData) => {
  try {
    const newLog = new ActivityLogModel({
      event: logData.event,
      type: logData.type,
      message: logData.message,
      relatedGuest: logData.relatedGuest || null,
      relatedStaff: logData.relatedStaff || null,
      priority: logData.priority || "normal",
      timestamp: new Date()
    });

    await newLog.save();
    return newLog;
  } catch (error) {
    console.error("Error creating activity log:", error);
    // We don't throw here to avoid breaking the main operational flow if logging fails
    return null;
  }
};

module.exports = {
  createActivityLog
};

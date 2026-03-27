const ScheduleActivity = require('../models/scheduleModel');
const Event = require('../models/eventModel');

// Helper to check ownership
const checkOwnership = (event, req) => {
  const userId = req.user?.id || req.userId;
  const ownerId = event.createdBy?._id || event.createdBy;
  if (userId && String(ownerId) !== String(userId)) {
    return false;
  }
  return true;
};

// Create a new schedule activity
exports.createSchedule = async (req, res) => {
  try {
    const { eventId, title, workstream, startTime, endTime, location, assignedTo, status, description } = req.body;
    
    if (!eventId || !title || !workstream || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkOwnership(event, req)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    const newActivity = new ScheduleActivity({
      eventId,
      title,
      workstream,
      startTime,
      endTime,
      location,
      assignedTo,
      status,
      description
    });

    await newActivity.save();

    // Async logging
    require('../services/activityLogServices').createActivityLog({
      event: eventId,
      type: "schedule",
      message: `New activity scheduled: ${title} at ${location || "TBD"}`,
      priority: "normal"
    });

    res.status(201).json({ success: true, activity: newActivity });
  } catch (error) {
    console.error('Error creating schedule activity:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all schedules for an event
exports.getSchedulesByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkOwnership(event, req)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    const activities = await ScheduleActivity.find({ eventId }).sort({ startTime: 1 });
    res.status(200).json({ success: true, activities });
  } catch (error) {
    console.error('Error fetching schedule activities:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update a schedule activity
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const existingActivity = await ScheduleActivity.findById(id);
    if (!existingActivity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const event = await Event.findById(existingActivity.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!checkOwnership(event, req)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    const updatedActivity = await ScheduleActivity.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    // Async logging
    require('../services/activityLogServices').createActivityLog({
      event: event._id,
      type: "schedule",
      message: `Schedule updated: ${updatedActivity.title}`,
      priority: "normal"
    });

    res.status(200).json({ success: true, activity: updatedActivity });
  } catch (error) {
    console.error('Error updating schedule activity:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete a schedule activity
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const existingActivity = await ScheduleActivity.findById(id);
    if (!existingActivity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const event = await Event.findById(existingActivity.eventId);
    if (event && !checkOwnership(event, req)) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this event' });
    }

    await ScheduleActivity.findByIdAndDelete(id);

    // Async logging
    require('../services/activityLogServices').createActivityLog({
      event: event._id,
      type: "schedule",
      message: `Activity removed from schedule: ${existingActivity.title}`,
      priority: "normal"
    });

    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule activity:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

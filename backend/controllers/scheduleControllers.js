const ScheduleActivity = require('../models/scheduleModel');
const Event = require('../models/eventModel');

// Create a new schedule activity
exports.createSchedule = async (req, res) => {
  try {
    const { eventId, title, workstream, startTime, endTime, location, assignedTo, status, description } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
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
    const updatedActivity = await ScheduleActivity.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!updatedActivity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

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
    const deletedActivity = await ScheduleActivity.findByIdAndDelete(id);
    
    if (!deletedActivity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule activity:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

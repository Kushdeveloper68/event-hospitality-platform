const EventModel = require("../models/eventModel");

/**
 * Create a new event
 * @param {Object} eventData - { name, venue, startDate, endDate, description, isPrivate }
 * @param {string} userId - ID of the user creating the event
 * @returns {Promise} - Created event object
 */
const createEvent = async (eventData, userId) => {
  try {
    const newEvent = new EventModel({
      ...eventData,
      createdBy: userId,
    });

    const savedEvent = await newEvent.save();
    return savedEvent;
  } catch (error) {
    throw new Error("Failed to create event: " + error.message);
  }
};

/**
 * Get all events
 * @returns {Promise} - Array of events
 */
/**
 * Get all events, optionally filtered by owner
 * @param {string} [userId] - if provided, return only events created by this user
 */
const getAllEvents = async (userId) => {
  try {
    const query = {};
    if (userId) query.createdBy = userId;
    const events = await EventModel.find(query).populate("createdBy", "name email");
    return events;
  } catch (error) {
    throw new Error("Failed to fetch events: " + error.message);
  }
};

/**
 * Get event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise} - Event object
 */
const getEventById = async (eventId) => {
  try {
    const event = await EventModel.findById(eventId).populate("createdBy", "name email");
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  } catch (error) {
    throw new Error("Failed to fetch event: " + error.message);
  }
};

/**
 * Update event
 * @param {string} eventId - Event ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} - Updated event object
 */
const updateEvent = async (eventId, updateData) => {
  try {
    const updatedEvent = await EventModel.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      throw new Error("Event not found");
    }
    return updatedEvent;
  } catch (error) {
    throw new Error("Failed to update event: " + error.message);
  }
};

/**
 * Delete event
 * @param {string} eventId - Event ID
 * @returns {Promise}
 */
const deleteEvent = async (eventId) => {
  try {
    const deletedEvent = await EventModel.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      throw new Error("Event not found");
    }
    return deletedEvent;
  } catch (error) {
    throw new Error("Failed to delete event: " + error.message);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};

import api from "./axios";

const API_BASE_PATH = "/events";

/**
 * Create a new event
 * @param {Object} eventData - {name, venue, startDate, endDate, description, isPrivate}
 * @returns {Promise}
 */
export const createEvent = async (eventData) => {
    try {
        const response = await api.post(`${API_BASE_PATH}/create`, eventData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to create event' };
    }
};

/**
 * Get all events
 * @returns {Promise}
 */
export const getAllEvents = async () => {
    try {
        const response = await api.get(`${API_BASE_PATH}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch events' };
    }
};

/**
 * Get event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise}
 */
export const getEventById = async (eventId) => {
    try {
        const response = await api.get(`${API_BASE_PATH}/${eventId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch event' };
    }
};

/**
 * Update event
 * @param {string} eventId - Event ID
 * @param {Object} updateData - Data to update
 * @returns {Promise}
 */
export const updateEvent = async (eventId, updateData) => {
    try {
        const response = await api.put(`${API_BASE_PATH}/${eventId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to update event' };
    }
};

/**
 * Delete event
 * @param {string} eventId - Event ID
 * @returns {Promise}
 */
export const deleteEvent = async (eventId) => {
    try {
        const response = await api.delete(`${API_BASE_PATH}/${eventId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to delete event' };
    }
};


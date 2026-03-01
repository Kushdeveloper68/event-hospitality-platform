import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/events';

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

/**
 * Create a new event
 * @param {Object} eventData - {name, venue, startDate, endDate, description, isPrivate}
 * @returns {Promise}
 */
export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/create', eventData);
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
        const response = await api.get('/');
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
        const response = await api.get(`/${eventId}`);
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
        const response = await api.put(`/${eventId}`, updateData);
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
        const response = await api.delete(`/${eventId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to delete event' };
    }
};

export default api;

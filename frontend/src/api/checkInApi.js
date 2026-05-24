import api from "./axios";

const API_BASE_PATH = "/checkin";

/**
 * Get guests arriving today (not yet checked in)
 */
export const getArrivingToday = async (eventId) => {
    try {
        const res = await api.get(`${API_BASE_PATH}/arriving-today`, { params: { eventId } });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch arriving guests' };
    }
};

/**
 * Get currently checked-in guests
 */
export const getCheckedInGuests = async (eventId) => {
    try {
        const res = await api.get(`${API_BASE_PATH}/checked-in`, { params: { eventId } });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch checked-in guests' };
    }
};

/**
 * Get pending / overdue guests
 */
export const getPendingGuests = async (eventId) => {
    try {
        const res = await api.get(`${API_BASE_PATH}/pending`, { params: { eventId } });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch pending guests' };
    }
};

/**
 * Check in a guest
 */
export const checkInGuest = async (guestId) => {
    try {
        const res = await api.put(`${API_BASE_PATH}/${guestId}/check-in`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to check in guest' };
    }
};

/**
 * Check out a guest
 */
export const checkOutGuest = async (guestId) => {
    try {
        const res = await api.put(`${API_BASE_PATH}/${guestId}/check-out`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to check out guest' };
    }
};

/**
 * Get check-in summary counts
 */
export const getCheckInSummary = async (eventId) => {
    try {
        const res = await api.get(`${API_BASE_PATH}/summary`, { params: { eventId } });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch check-in summary' };
    }
};


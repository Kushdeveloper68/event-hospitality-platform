import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/checkin';
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

/**
 * Get guests arriving today (not yet checked in)
 */
export const getArrivingToday = async (eventId) => {
    try {
        const res = await api.get('/arriving-today', { params: { eventId } });
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
        const res = await api.get('/checked-in', { params: { eventId } });
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
        const res = await api.get('/pending', { params: { eventId } });
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
        const res = await api.put(`/${guestId}/check-in`);
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
        const res = await api.put(`/${guestId}/check-out`);
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
        const res = await api.get('/summary', { params: { eventId } });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch check-in summary' };
    }
};

export default api;

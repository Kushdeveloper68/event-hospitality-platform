import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/guests';
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

/**
 * Create guest
 * @param {Object} guestData
 */
export const createGuest = async (guestData) => {
    try {
        const res = await api.post('/', guestData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to create guest' };
    }
};

/**
 * Get guests list
 * options may include eventId, search, vip, status, page, limit
 */
export const getGuests = async (options = {}) => {
    try {
        const res = await api.get('/', { params: options });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch guests' };
    }
};

export const getGuestById = async (id) => {
    try {
        const res = await api.get(`/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch guest' };
    }
};

export const updateGuest = async (id, updateData) => {
    try {
        const res = await api.put(`/${id}`, updateData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to update guest' };
    }
};

export const deleteGuest = async (id) => {
    try {
        const res = await api.delete(`/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to delete guest' };
    }
};

export default api;

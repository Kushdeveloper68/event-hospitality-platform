import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/rooms';
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const createRoom = async (roomData) => {
    try {
        const res = await api.post('/', roomData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to create room' };
    }
};

export const getRooms = async (options = {}) => {
    try {
        const res = await api.get('/', { params: options });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch rooms' };
    }
};

export const getRoomById = async (id) => {
    try {
        const res = await api.get(`/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch room' };
    }
};

export const updateRoom = async (id, updateData) => {
    try {
        const res = await api.put(`/${id}`, updateData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to update room' };
    }
};

export const deleteRoom = async (id) => {
    try {
        const res = await api.delete(`/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to delete room' };
    }
};

export const assignGuestToRoom = async (roomId, guestId) => {
    try {
        const res = await api.post(`/${roomId}/assign`, { guestId });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to assign guest' };
    }
};

export default api;

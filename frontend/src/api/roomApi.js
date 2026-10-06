import api from "./axios";

const API_BASE_PATH = "/rooms";

export const createRoom = async (roomData) => {
    try {
        const res = await api.post(`${API_BASE_PATH}`, roomData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to create room' };
    }
};

export const getRooms = async (options = {}) => {
    try {
        const res = await api.get(`${API_BASE_PATH}`, { params: options });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch rooms' };
    }
};

/**
 * Fetch every room matching the current search/status filter, unpaginated —
 * used by "Export CSV" so it isn't limited to whatever page is on screen.
 */
export const exportAllRooms = async (options = {}) => {
    try {
        const res = await api.get(`${API_BASE_PATH}/export`, { params: options });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to export rooms' };
    }
};

export const getRoomById = async (id) => {
    try {
        const res = await api.get(`${API_BASE_PATH}/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch room' };
    }
};

export const updateRoom = async (id, updateData) => {
    try {
        const res = await api.put(`${API_BASE_PATH}/${id}`, updateData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to update room' };
    }
};

export const deleteRoom = async (id) => {
    try {
        const res = await api.delete(`${API_BASE_PATH}/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to delete room' };
    }
};

/**
 * Bulk import rooms from a parsed CSV
 * @param {string} eventId
 * @param {Array<Object>} rows
 */
export const bulkImportRooms = async (eventId, rows) => {
    try {
        const res = await api.post(`${API_BASE_PATH}/bulk-import`, { event: eventId, rows });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to import rooms' };
    }
};

export const assignGuestToRoom = async (roomId, guestId) => {
    try {
        const res = await api.post(`${API_BASE_PATH}/${roomId}/assign`, { guestId });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to assign guest' };
    }
};



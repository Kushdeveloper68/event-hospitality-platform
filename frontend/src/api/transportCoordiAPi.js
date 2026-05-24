import api from "./axios";

const API_BASE_PATH = "/transport";

/**
 * Create a new transport entry
 */
export const createTransport = async (transportData) => {
    try {
        const res = await api.post(`${API_BASE_PATH}/create`, transportData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to create transport' };
    }
};

/**
 * Get all transports for an event (optionally by status)
 */
export const getTransports = async (eventId, status) => {
    try {
        const params = { eventId };
        if (status && status !== 'all') params.status = status;
        const res = await api.get(`${API_BASE_PATH}`, { params });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch transports' };
    }
};

/**
 * Get transport by ID
 */
export const getTransportById = async (transportId) => {
    try {
        const res = await api.get(`${API_BASE_PATH}/${transportId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch transport' };
    }
};

/**
 * Update transport
 */
export const updateTransport = async (transportId, updateData) => {
    try {
        const res = await api.put(`${API_BASE_PATH}/${transportId}`, updateData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to update transport' };
    }
};

/**
 * Delete transport
 */
export const deleteTransport = async (transportId) => {
    try {
        const res = await api.delete(`${API_BASE_PATH}/${transportId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to delete transport' };
    }
};

/**
 * Update transport status
 */
export const updateTransportStatus = async (transportId, status) => {
    try {
        const res = await api.put(`${API_BASE_PATH}/${transportId}/status`, { status });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to update transport status' };
    }
};

/**
 * Get transport summary counts
 */
export const getTransportSummary = async (eventId) => {
    try {
        const res = await api.get(`${API_BASE_PATH}/summary`, { params: { eventId } });
        return res.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to fetch transport summary' };
    }
};



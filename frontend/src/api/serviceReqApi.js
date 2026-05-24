import api from "./axios";

const API_BASE_PATH = "/services";

/**
 * Fetch all service requests for a specific event
 */
export const getServiceRequests = async (eventId, filters = {}) => {
  try {
    const params = { eventId, ...filters };
    const response = await api.get(`${API_BASE_PATH}`, { params });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server connection error' };
  }
};

/**
 * Fetch summary metrics for service requests
 */
export const getServiceSummary = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/summary`, {
      params: { eventId }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server connection error' };
  }
};

/**
 * Fetch a single service request by ID
 */
export const getServiceRequestById = async (requestId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${requestId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server connection error' };
  }
};

/**
 * Create a new service request
 */
export const createServiceRequest = async (requestData) => {
  try {
    const response = await api.post(`${API_BASE_PATH}/create`, requestData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server connection error' };
  }
};

/**
 * Update an entire service request (EDIT)
 */
export const updateServiceRequest = async (requestId, requestData) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/${requestId}`, requestData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server connection error' };
  }
};

/**
 * Update just the status of a service request
 */
export const updateServiceStatus = async (requestId, status) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/${requestId}/status`, { status });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server connection error' };
  }
};

/**
 * Delete a service request
 */
export const deleteServiceRequest = async (requestId) => {
  try {
    const response = await api.delete(`${API_BASE_PATH}/${requestId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server connection error' };
  }
};

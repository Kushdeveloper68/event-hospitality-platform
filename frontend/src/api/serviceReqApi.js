import axios from 'axios';

// Ensure cookies (JWT token) are sent with every request
axios.defaults.withCredentials = true;

const API_BASE_URL = 'http://localhost:5000/api/services';

/**
 * Fetch all service requests for a specific event
 */
export const getServiceRequests = async (eventId, filters = {}) => {
  try {
    const params = { eventId, ...filters };
    const response = await axios.get(`${API_BASE_URL}`, { params });
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
    const response = await axios.get(`${API_BASE_URL}/summary`, {
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
    const response = await axios.get(`${API_BASE_URL}/${requestId}`);
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
    const response = await axios.post(`${API_BASE_URL}/create`, requestData);
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
    const response = await axios.put(`${API_BASE_URL}/${requestId}`, requestData);
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
    const response = await axios.put(`${API_BASE_URL}/${requestId}/status`, { status });
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
    const response = await axios.delete(`${API_BASE_URL}/${requestId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Server connection error' };
  }
};

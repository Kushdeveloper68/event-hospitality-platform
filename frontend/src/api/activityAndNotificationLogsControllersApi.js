import api from "./axios";

const API_BASE_PATH = "/activity-logs";

/**
 * Fetch paginated activity logs with filters
 * @param {Object} params - { eventId, type, priority, search, startDate, endDate, page, limit }
 */
export const getActivityLogs = async (params = {}) => {
  try {
    const response = await api.get(API_BASE_PATH, { params });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch activity logs",
      }
    );
  }
};

/**
 * Fetch summary stats (counts by type/priority)
 * @param {string} [eventId]
 */
export const getActivitySummary = async (eventId = null) => {
  try {
    const params = eventId ? { eventId } : {};
    const response = await api.get(`${API_BASE_PATH}/summary`, { params });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch summary",
      }
    );
  }
};

/**
 * Fetch distinct activity types for filter dropdown
 */
export const getActivityTypes = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}/types`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch types",
      }
    );
  }
};
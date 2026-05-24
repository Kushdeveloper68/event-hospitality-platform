import api from "./axios";

const API_BASE_PATH = "/event-summary";

/**
 * Fetch the full event summary dashboard data
 * @param {string} eventId
 * @returns {Promise<Object>}
 */
export const getEventSummary = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch event summary",
      }
    );
  }
};

/**
 * Fetch lightweight KPIs only (for periodic refresh)
 * @param {string} eventId
 * @returns {Promise<Object>}
 */
export const getEventKPIs = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/kpis`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch event KPIs",
      }
    );
  }
};
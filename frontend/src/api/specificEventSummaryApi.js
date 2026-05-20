import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/event-summary";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Fetch the full event summary dashboard data
 * @param {string} eventId
 * @returns {Promise<Object>}
 */
export const getEventSummary = async (eventId) => {
  try {
    const response = await api.get(`/${eventId}`);
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
    const response = await api.get(`/${eventId}/kpis`);
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
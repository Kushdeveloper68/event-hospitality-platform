import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/overview";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
/**
 * Fetch overview metrics and recent activity for an event
 * @param {string} eventId
 * @returns {Promise<Object>}
 */
export const getOverviewData = async (eventId) => {
  try {
    const response = await api.get(`/${eventId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    return error.response
      ? error.response.data
      : { success: false, message: "Network Error" };
  }
};

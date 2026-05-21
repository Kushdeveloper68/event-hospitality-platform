import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/main-dashboard";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Fetch the full dashboard data in one request
 * (metrics + recentActivity + upcomingEvents + activeEventStats)
 */
export const getFullDashboard = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch dashboard data",
      }
    );
  }
};

/**
 * Fetch only the KPI metric counts
 */
export const getDashboardMetrics = async () => {
  try {
    const response = await api.get("/metrics");
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch metrics",
      }
    );
  }
};

/**
 * Fetch recent activity logs across all user events
 * @param {number} limit - number of logs to fetch (default 8)
 */
export const getRecentActivity = async (limit = 8) => {
  try {
    const response = await api.get("/recent-activity", { params: { limit } });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch recent activity",
      }
    );
  }
};

/**
 * Fetch events list with computed statuses
 * @param {number} limit - number of events to fetch
 */
export const getUpcomingEvents = async (limit = 6) => {
  try {
    const response = await api.get("/upcoming-events", { params: { limit } });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch events",
      }
    );
  }
};

/**
 * Fetch active events with live stats
 */
export const getActiveEventStats = async () => {
  try {
    const response = await api.get("/active-events");
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch active event stats",
      }
    );
  }
};

export default api;
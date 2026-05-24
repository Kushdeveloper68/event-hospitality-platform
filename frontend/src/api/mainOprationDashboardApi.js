import api from "./axios";

const API_BASE_PATH = "/main-dashboard";

/**
 * Fetch the full dashboard data in one request
 * (metrics + recentActivity + upcomingEvents + activeEventStats)
 */
export const getFullDashboard = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}`);
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
    const response = await api.get(`${API_BASE_PATH}/metrics`);
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
    const response = await api.get(`${API_BASE_PATH}/recent-activity`, { params: { limit } });
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
    const response = await api.get(`${API_BASE_PATH}/upcoming-events`, { params: { limit } });
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
    const response = await api.get(`${API_BASE_PATH}/active-events`);
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


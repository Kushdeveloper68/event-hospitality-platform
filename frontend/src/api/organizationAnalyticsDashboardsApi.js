import api from "./axios";

const API_BASE_PATH = "/org-analytics";

/**
 * Fetch all analytics in one call (initial page load)
 * @param {{ startDate?: string, endDate?: string }} filters
 */
export const getFullAnalytics = async (filters = {}) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/full`, { params: filters });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch analytics",
      }
    );
  }
};

/**
 * Fetch KPI summary cards only (lightweight refresh)
 * @param {{ startDate?: string, endDate?: string }} filters
 */
export const getKPISummary = async (filters = {}) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/kpis`, { params: filters });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || { success: false, message: "Failed to fetch KPIs" }
    );
  }
};

/**
 * Monthly check-in trend
 * @param {number} months
 */
export const getCheckInTrend = async (months = 12) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/checkin-trend`, { params: { months } });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch check-in trend",
      }
    );
  }
};

/**
 * Monthly guest registration trend
 * @param {number} months
 */
export const getRegistrationTrend = async (months = 12) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/registration-trend`, {
      params: { months },
    });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch registration trend",
      }
    );
  }
};

/**
 * Service request breakdown by type / status / urgency
 */
export const getServiceBreakdown = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}/services`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch service breakdown",
      }
    );
  }
};

/**
 * Room occupancy analytics
 */
export const getRoomOccupancy = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}/rooms`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch room occupancy",
      }
    );
  }
};

/**
 * Transport analytics
 */
export const getTransportAnalytics = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}/transport`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch transport analytics",
      }
    );
  }
};

/**
 * Team member analytics
 */
export const getTeamAnalytics = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}/team`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch team analytics",
      }
    );
  }
};

/**
 * Activity log analytics + 30-day daily trend
 */
export const getActivityAnalytics = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}/activity`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch activity analytics",
      }
    );
  }
};

/**
 * Top events performance table
 * @param {number} limit
 */
export const getTopEvents = async (limit = 10) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/top-events`, { params: { limit } });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch top events",
      }
    );
  }
};

/**
 * VIP guest analytics
 */
export const getVIPAnalytics = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}/vip`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch VIP analytics",
      }
    );
  }
};
import api from "./axios";

const API_BASE_PATH = "/admin";

/**
 * Fetch platform-wide admin stats.
 * Backend enforces isAdmin server-side (401 if not logged in, 403 if not admin)
 * — the frontend page just reacts to that, it never decides access on its own.
 */
export const getAdminStats = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}/stats`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch admin stats",
      }
    );
  }
};
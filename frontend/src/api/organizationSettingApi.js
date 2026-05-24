import api from "./axios";

const API_BASE_PATH = "/org-settings";

/**
 * Fetch full settings (profile + org info combined)
 */
export const getSettings = async () => {
  try {
    const response = await api.get(`${API_BASE_PATH}`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch settings",
      }
    );
  }
};

/**
 * Update personal profile (name, jobTitle, timezone)
 * @param {{ name?: string, jobTitle?: string, timezone?: string }} data
 */
export const updateProfile = async (data) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/profile`, data);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to update profile",
      }
    );
  }
};

/**
 * Update organization info
 * @param {{ organizationName?: string, industry?: string, website?: string, address?: string, primaryContactName?: string, primaryContactEmail?: string }} data
 */
export const updateOrgInfo = async (data) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/organization`, data);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to update organization info",
      }
    );
  }
};

/**
 * Change password
 * @param {{ currentPassword: string, newPassword: string, confirmPassword: string }} data
 */
export const changePassword = async (data) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/password`, data);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to change password",
      }
    );
  }
};

/**
 * Toggle notifications
 * @param {boolean} notificationsEnabled
 */
export const updateNotifications = async (notificationsEnabled) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/notifications`, { notificationsEnabled });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to update notifications",
      }
    );
  }
};

/**
 * Update theme preference
 * @param {"light" | "dark" | "system"} theme
 */
export const updateTheme = async (theme) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/theme`, { theme });
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to update theme",
      }
    );
  }
};
import api from "./axios";

const API_BASE_PATH = "/event-settings";

/**
 * Get full event settings (core info + preferences)
 * @param {string} eventId
 */
export const getEventSettings = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to fetch event settings" };
  }
};

/**
 * Update core event info (name, venue, dates, description, isPrivate)
 * @param {string} eventId
 * @param {Object} coreData
 */
export const updateEventCoreInfo = async (eventId, coreData) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/${eventId}/core`, coreData);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to update event information" };
  }
};

/**
 * Update preferences (permissions, notifications, branding, etc.)
 * @param {string} eventId
 * @param {Object} settingsData
 */
export const updateEventPreferences = async (eventId, settingsData) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/${eventId}/preferences`, settingsData);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to update settings" };
  }
};

/**
 * Auto-generate a URL slug from an event name
 * @param {string} eventId
 * @param {string} name  - optional custom name to slugify
 */
export const generateEventSlug = async (eventId, name) => {
  try {
    const response = await api.post(`${API_BASE_PATH}/${eventId}/generate-slug`, { name });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to generate slug" };
  }
};

/**
 * Archive or unarchive an event
 * @param {string} eventId
 * @param {boolean} archive
 */
export const setEventArchive = async (eventId, archive) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/${eventId}/archive`, { archive });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to update archive status" };
  }
};

/**
 * Permanently delete an event (requires confirmName === event.name)
 * @param {string} eventId
 * @param {string} confirmName
 */
export const deleteEventPermanently = async (eventId, confirmName) => {
  try {
    const response = await api.delete(`${API_BASE_PATH}/${eventId}/delete`, {
      data: { confirmName },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to delete event" };
  }
};
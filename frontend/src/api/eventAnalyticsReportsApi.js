import api from "./axios";

const API_BASE_PATH = "/event-analytics";

const slugifyFilename = (value) =>
  String(value || "event")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "event";

const saveBlobFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const extractErrorMessage = async (error, fallbackMessage) => {
  const data = error.response?.data;

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return parsed.message || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }

  return data?.message || fallbackMessage;
};

/**
 * Full analytics report for one event — all sections in one request.
 * Use on initial page load.
 * @param {string} eventId
 */
export const getFullReport = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/full`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch full report",
      }
    );
  }
};

/**
 * Guest analytics only
 * @param {string} eventId
 */
export const getGuestAnalytics = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/guests`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch guest analytics",
      }
    );
  }
};

/**
 * Room analytics only
 * @param {string} eventId
 */
export const getRoomAnalytics = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/rooms`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch room analytics",
      }
    );
  }
};

/**
 * Service request analytics only
 * @param {string} eventId
 */
export const getServiceAnalytics = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/services`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch service analytics",
      }
    );
  }
};

/**
 * Transport analytics only
 * @param {string} eventId
 */
export const getTransportAnalytics = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/transport`);
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
 * Team analytics only
 * @param {string} eventId
 */
export const getTeamAnalytics = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/team`);
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
 * Schedule analytics only
 * @param {string} eventId
 */
export const getScheduleAnalytics = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/schedule`);
    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch schedule analytics",
      }
    );
  }
};

/**
 * Activity log analytics only
 * @param {string} eventId
 */
export const getActivityAnalytics = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/activity`);
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
 * Download guest list as CSV (triggers browser download)
 * @param {string} eventId
 * @param {string} eventName  – used for filename display
 */
export const exportGuestsCsv = async (eventId, eventName = "event") => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/export/guests`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests-${eventName.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to export guests CSV" };
  }
};

/**
 * Download service requests as CSV
 * @param {string} eventId
 * @param {string} eventName
 */
export const exportServicesCsv = async (eventId, eventName = "event") => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/export/services`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `services-${eventName.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to export services CSV" };
  }
};

/**
 * Download transport log as CSV
 * @param {string} eventId
 * @param {string} eventName
 */
export const exportTransportCsv = async (eventId, eventName = "event") => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${eventId}/export/transport`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `transport-${eventName.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to export transport CSV" };
  }
};

/**
 * Download a multi-sheet workbook with the event's core operational data
 * @param {string} eventId
 * @param {string} eventName
 */
export const exportEventWorkbook = async (eventId, eventName = "event") => {
  try {
    const response = await api.get(
      `${API_BASE_PATH}/${eventId}/export/workbook`,
      {
        responseType: "blob",
      },
    );

    saveBlobFile(
      response.data,
      `event-data-${slugifyFilename(eventName)}.xlsx`,
    );

    return {
      success: true,
      message: "Event workbook downloaded successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: await extractErrorMessage(
        error,
        "Failed to export event workbook",
      ),
    };
  }
};
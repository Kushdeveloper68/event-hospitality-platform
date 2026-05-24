import api from "./axios";

const API_BASE_PATH = "/schedules";

export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post(`${API_BASE_PATH}`, scheduleData);
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to create schedule' };
  }
};

export const getSchedulesByEventId = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch schedules' };
  }
};

export const updateSchedule = async (id, updatedData) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating schedule:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to update schedule' };
  }
};

export const deleteSchedule = async (id) => {
  try {
    const response = await api.delete(`${API_BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to delete schedule' };
  }
};

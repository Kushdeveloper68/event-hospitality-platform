import axios from 'axios';

const API_URL = 'http://localhost:5000/api/schedules';

export const createSchedule = async (scheduleData) => {
  try {
    const response = await axios.post(`${API_URL}/`, scheduleData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to create schedule' };
  }
};

export const getSchedulesByEventId = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/event/${eventId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch schedules' };
  }
};

export const updateSchedule = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error updating schedule:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to update schedule' };
  }
};

export const deleteSchedule = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule:', error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || 'Failed to delete schedule' };
  }
};

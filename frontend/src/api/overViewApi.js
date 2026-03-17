import axios from 'axios';

const API_URL = 'http://localhost:5000/api/overview';

/**
 * Fetch overview metrics and recent activity for an event
 * @param {string} eventId 
 * @returns {Promise<Object>}
 */
export const getOverviewData = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/${eventId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching overview data:', error);
    return error.response ? error.response.data : { success: false, message: 'Network Error' };
  }
};

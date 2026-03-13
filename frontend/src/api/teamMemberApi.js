import axios from 'axios';

const API_URL = 'http://localhost:5000/api/team';

// Configure Axios to send cookies (for JWT token)
axios.defaults.withCredentials = true;

// Create a new team member
export const createTeamMember = async (memberData) => {
  try {
    const response = await axios.post(API_URL, memberData);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Get team members for an event, with optional filters
export const getTeamMembers = async (eventId, filters = {}) => {
  try {
    const params = { eventId, ...filters };
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Get team summary (counts)
export const getTeamSummary = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/summary`, { params: { eventId } });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Get a team member by ID
export const getTeamMemberById = async (memberId) => {
  try {
    const response = await axios.get(`${API_URL}/${memberId}`);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Update a team member
export const updateTeamMember = async (memberId, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${memberId}`, updateData);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Delete a team member
export const deleteTeamMember = async (memberId) => {
  try {
    const response = await axios.delete(`${API_URL}/${memberId}`);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Quick status toggle
export const updateTeamMemberStatus = async (memberId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${memberId}`, { status });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

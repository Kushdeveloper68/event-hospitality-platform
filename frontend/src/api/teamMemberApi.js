import api from "./axios";

const API_BASE_PATH = "/team";

// Create a new team member
export const createTeamMember = async (memberData) => {
  try {
    const response = await api.post(`${API_BASE_PATH}`, memberData);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Get team members for an event, with optional filters
export const getTeamMembers = async (eventId, filters = {}) => {
  try {
    const params = { eventId, ...filters };
    const response = await api.get(`${API_BASE_PATH}`, { params });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Get team summary (counts)
export const getTeamSummary = async (eventId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/summary`, { params: { eventId } });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Get a team member by ID
export const getTeamMemberById = async (memberId) => {
  try {
    const response = await api.get(`${API_BASE_PATH}/${memberId}`);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Update a team member
export const updateTeamMember = async (memberId, updateData) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/${memberId}`, updateData);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Delete a team member
export const deleteTeamMember = async (memberId) => {
  try {
    const response = await api.delete(`${API_BASE_PATH}/${memberId}`);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

// Quick status toggle
export const updateTeamMemberStatus = async (memberId, status) => {
  try {
    const response = await api.put(`${API_BASE_PATH}/${memberId}`, { status });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: 'Server error' };
  }
};

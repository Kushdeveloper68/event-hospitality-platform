const TeamMemberModel = require("../models/teamMemberModel");

// Create a new team member
const createTeamMember = async (memberData) => {
  try {
    const newMember = new TeamMemberModel(memberData);
    await newMember.save();
    return newMember;
  } catch (error) {
    throw error;
  }
};

// Get team members for an event with optional filtering and searching
const getTeamMembers = async (eventId, filters = {}) => {
  try {
    const query = { event: eventId };

    if (filters.role && filters.role !== 'All Roles') {
      query.role = filters.role;
    }
    if (filters.status && filters.status !== 'All') {
      query.status = filters.status.toLowerCase();
    }
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await TeamMemberModel.countDocuments(query);
    const members = await TeamMemberModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      teamMembers: members,
    };
  } catch (error) {
    throw error;
  }
};
// Get a single team member by ID
const getTeamMemberById = async (memberId) => {
  try {
    const member = await TeamMemberModel.findById(memberId);
    return member;
  } catch (error) {
    throw error;
  }
};

// Update a team member
const updateTeamMember = async (memberId, updateData) => {
  try {
    // If status is being changed to active, update lastActive timestamp
    if (updateData.status === 'active') {
      updateData.lastActive = new Date();
    }
    
    const updatedMember = await TeamMemberModel.findByIdAndUpdate(
      memberId,
      updateData,
      { new: true, runValidators: true }
    );
    return updatedMember;
  } catch (error) {
    throw error;
  }
};

// Delete a team member
const deleteTeamMember = async (memberId) => {
  try {
    const deletedMember = await TeamMemberModel.findByIdAndDelete(memberId);
    return deletedMember;
  } catch (error) {
    throw error;
  }
};

// Get summary metrics for the team
const getTeamSummary = async (eventId) => {
  try {
    const total = await TeamMemberModel.countDocuments({ event: eventId });
    const active = await TeamMemberModel.countDocuments({ event: eventId, status: 'active' });
    const inactive = await TeamMemberModel.countDocuments({ event: eventId, status: 'inactive' });
    
    return {
      total,
      active,
      inactive
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  getTeamSummary
};

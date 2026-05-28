const teamMemberServices = require("../services/teamMemberServices");
const EventModel = require("../models/eventModel");

// Helper function to verify event ownership
const verifyEventOwnership = async (eventId, userId) => {
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  const ownerId = event.createdBy?._id || event.createdBy;
  if (userId && String(ownerId) !== String(userId)) {
    throw new Error("Unauthorized access to this event");
  }
  return true;
};

// Create a new team member
const handleCreateTeamMember = async (req, res) => {
  try {
    const { event, name, email, role, status } = req.body;
    
    if (!event || !name || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields (event, name, email)" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(err.message === "Event not found" ? 404 : 403).json({ success: false, message: err.message });
    }

    const newMember = await teamMemberServices.createTeamMember({
      event,
      name,
      email,
      role,
      status: status || 'active',
      lastActive: status === 'active' ? new Date() : null
    });

    res.status(201).json({ success: true, message: "Team member added successfully", teamMember: newMember });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "A team member with this email already exists for this event." });
    }
    console.error("Error creating team member:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get team members for an event
const handleGetTeamMembers = async (req, res) => {
  try {
    const { eventId, role, status, search, page, limit } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'eventId query parameter is required' });
    }

    try {
      await verifyEventOwnership(eventId, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(err.message === 'Event not found' ? 404 : 403).json({ success: false, message: err.message });
    }

    const result = await teamMemberServices.getTeamMembers(eventId, {
      role,
      status,
      search,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    res.status(200).json({ success: true, count: result.teamMembers.length, ...result });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
// Get a single team member by ID
const handleGetTeamMemberById = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await teamMemberServices.getTeamMemberById(memberId);

    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    // Verify ownership via the event reference
    try {
      await verifyEventOwnership(member.event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }

    res.status(200).json({ success: true, teamMember: member });
  } catch (error) {
    console.error("Error fetching team member by id:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update a team member
const handleUpdateTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const updateData = req.body;

    const existingMember = await teamMemberServices.getTeamMemberById(memberId);
    if (!existingMember) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(existingMember.event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }

    const updatedMember = await teamMemberServices.updateTeamMember(memberId, updateData);
    res.status(200).json({ success: true, message: "Team member updated successfully", teamMember: updatedMember });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "A team member with this email already exists for this event." });
    }
    console.error("Error updating team member:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Delete a team member
const handleDeleteTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const existingMember = await teamMemberServices.getTeamMemberById(memberId);
    if (!existingMember) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(existingMember.event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }

    await teamMemberServices.deleteTeamMember(memberId);
    res.status(200).json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get team summary (counts)
const handleGetTeamSummary = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId query parameter is required" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(eventId, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(err.message === "Event not found" ? 404 : 403).json({ success: false, message: err.message });
    }

    const summary = await teamMemberServices.getTeamSummary(eventId);
    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching team summary:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  handleCreateTeamMember,
  handleGetTeamMembers,
  handleGetTeamMemberById,
  handleUpdateTeamMember,
  handleDeleteTeamMember,
  handleGetTeamSummary
};

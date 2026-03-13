const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  handleCreateTeamMember,
  handleGetTeamMembers,
  handleGetTeamMemberById,
  handleUpdateTeamMember,
  handleDeleteTeamMember,
  handleGetTeamSummary
} = require("../controllers/teamMemberControllers");

// Protect all transport routes with JWT auth
router.use(authMiddleware);

// Create a new team member
router.post("/", handleCreateTeamMember);

// Get all team members for an event (via ?eventId=)
router.get("/", handleGetTeamMembers);

// Get summary for an event (via ?eventId=)
// MUST be before /:memberId so "summary" isn't treated as a memberId
router.get("/summary", handleGetTeamSummary);

// Get a team member by ID
router.get("/:memberId", handleGetTeamMemberById);

// Update a team member
router.put("/:memberId", handleUpdateTeamMember);

// Delete a team member
router.delete("/:memberId", handleDeleteTeamMember);

module.exports = router;

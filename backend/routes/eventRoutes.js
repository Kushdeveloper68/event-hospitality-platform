const express = require("express");
const router = express.Router();
const {
  handleCreateEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
} = require("../controllers/eventControllers");
const authMiddleware = require("../middlewares/authMiddleware");
// Create a new event
router.post("/create", authMiddleware, handleCreateEvent);

// Get all events
router.get("/",authMiddleware, handleGetAllEvents);

// Get event by ID
router.get("/:eventId",authMiddleware,handleGetEventById);

// Update event
router.put("/:eventId",authMiddleware, handleUpdateEvent);

// Delete event
router.delete("/:eventId", authMiddleware, handleDeleteEvent);

module.exports = router;

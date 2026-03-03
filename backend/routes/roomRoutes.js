const express = require("express");
const router = express.Router();
const {
  handleCreateRoom,
  handleGetRooms,
  handleGetRoomById,
  handleUpdateRoom,
  handleDeleteRoom,
  handleAssignGuest,
} = require("../controllers/roomControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// create new room
router.post("/", authMiddleware, handleCreateRoom);

// list rooms with event filter
router.get("/", authMiddleware, handleGetRooms);

// single room
router.get("/:roomId", authMiddleware, handleGetRoomById);

// update
router.put("/:roomId", authMiddleware, handleUpdateRoom);

// delete
router.delete("/:roomId", authMiddleware, handleDeleteRoom);

// assign guest to room
router.post("/:roomId/assign", authMiddleware, handleAssignGuest);

module.exports = router;

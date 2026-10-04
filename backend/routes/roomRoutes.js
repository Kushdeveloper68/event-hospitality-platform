const express = require("express");
const router = express.Router();
const {
  handleCreateRoom,
  handleGetRooms,
  handleGetRoomById,
  handleUpdateRoom,
  handleDeleteRoom,
  handleAssignGuest,
  handleBulkImportRooms,
} = require("../controllers/roomControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// create new room
router.post("/", authMiddleware, handleCreateRoom);

// bulk import rooms from CSV (must be before /:roomId so "bulk-import" isn't treated as an id)
router.post("/bulk-import", authMiddleware, handleBulkImportRooms);

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

const express = require("express");
const router = express.Router();
const {
  handleCreateTransport,
  handleGetTransports,
  handleGetTransportById,
  handleUpdateTransport,
  handleDeleteTransport,
  handleUpdateStatus,
  handleGetSummary,
} = require("../controllers/transportCoordiControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// Summary (must be before /:transportId to avoid conflict)
router.get("/summary", authMiddleware, handleGetSummary);

// Get all transports (with optional status filter)
router.get("/", authMiddleware, handleGetTransports);

// Create new transport
router.post("/create", authMiddleware, handleCreateTransport);

// Get transport by ID
router.get("/:transportId", authMiddleware, handleGetTransportById);

// Update transport
router.put("/:transportId", authMiddleware, handleUpdateTransport);

// Update transport status
router.put("/:transportId/status", authMiddleware, handleUpdateStatus);

// Delete transport
router.delete("/:transportId", authMiddleware, handleDeleteTransport);

module.exports = router;

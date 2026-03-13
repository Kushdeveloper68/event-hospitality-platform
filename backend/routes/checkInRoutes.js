const express = require("express");
const router = express.Router();
const {
  handleGetArrivingToday,
  handleGetCheckedIn,
  handleGetPending,
  handleCheckIn,
  handleCheckOut,
  handleGetSummary,
} = require("../controllers/checkInControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// Get guests arriving today
router.get("/arriving-today", authMiddleware, handleGetArrivingToday);

// Get currently checked-in guests
router.get("/checked-in", authMiddleware, handleGetCheckedIn);

// Get pending / overdue guests
router.get("/pending", authMiddleware, handleGetPending);

// Check-in summary counts
router.get("/summary", authMiddleware, handleGetSummary);

// Check in a guest
router.put("/:guestId/check-in", authMiddleware, handleCheckIn);

// Check out a guest
router.put("/:guestId/check-out", authMiddleware, handleCheckOut);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  handleCreateGuest,
  handleGetGuests,
  handleGetGuestById,
  handleUpdateGuest,
  handleDeleteGuest,
} = require("../controllers/guestControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// create new guest
router.post("/", authMiddleware, handleCreateGuest);

// list guests with filters
router.get("/", authMiddleware, handleGetGuests);

// single guest
router.get("/:guestId", authMiddleware, handleGetGuestById);

// update
router.put("/:guestId", authMiddleware, handleUpdateGuest);

// delete
router.delete("/:guestId", authMiddleware, handleDeleteGuest);

module.exports = router;

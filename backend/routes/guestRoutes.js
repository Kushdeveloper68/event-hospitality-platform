const express = require("express");
const router = express.Router();
const {
  handleCreateGuest,
  handleGetGuests,
  handleGetGuestById,
  handleUpdateGuest,
  handleDeleteGuest,
  handleBulkImportGuests,
} = require("../controllers/guestControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// create new guest
router.post("/", authMiddleware, handleCreateGuest);

// bulk import guests from CSV (must be before /:guestId so "bulk-import" isn't treated as an id)
router.post("/bulk-import", authMiddleware, handleBulkImportGuests);

// list guests with filters
router.get("/", authMiddleware, handleGetGuests);

// single guest
router.get("/:guestId", authMiddleware, handleGetGuestById);

// update
router.put("/:guestId", authMiddleware, handleUpdateGuest);

// delete
router.delete("/:guestId", authMiddleware, handleDeleteGuest);

module.exports = router;

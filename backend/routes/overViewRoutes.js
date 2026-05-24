const express = require("express");
const router = express.Router();
const overViewController = require("../controllers/overViewController");
const authMiddleware = require("../middlewares/authMiddleware");
// Get overview data for an event
router.get("/:eventId", authMiddleware, overViewController.handleGetOverview);

module.exports = router;

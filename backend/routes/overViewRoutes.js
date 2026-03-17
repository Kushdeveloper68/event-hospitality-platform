const express = require("express");
const router = express.Router();
const overViewController = require("../controllers/overViewController");

// Get overview data for an event
router.get("/:eventId", overViewController.handleGetOverview);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  handleGetEventSettings,
  handleUpdateCoreInfo,
  handleUpdateSettings,
  handleGenerateSlug,
  handleSetArchive,
  handleDeleteEvent,
} = require("../controllers/specificEventSettingController");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes protected
router.use(authMiddleware);

// GET  /api/event-settings/:eventId  — full settings + event core info
router.get("/:eventId", handleGetEventSettings);

// PUT  /api/event-settings/:eventId/core  — update name, venue, dates, description, isPrivate
router.put("/:eventId/core", handleUpdateCoreInfo);

// PUT  /api/event-settings/:eventId/preferences  — update permissions, notifications, branding
router.put("/:eventId/preferences", handleUpdateSettings);

// POST /api/event-settings/:eventId/generate-slug  — auto-generate a URL slug
router.post("/:eventId/generate-slug", handleGenerateSlug);

// PUT  /api/event-settings/:eventId/archive  — archive / unarchive
router.put("/:eventId/archive", handleSetArchive);

// DELETE /api/event-settings/:eventId/delete  — permanently delete event
router.delete("/:eventId/delete", handleDeleteEvent);

module.exports = router;
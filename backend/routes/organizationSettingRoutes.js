const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  handleGetSettings,
  handleUpdateProfile,
  handleUpdateOrgInfo,
  handleChangePassword,
  handleUpdateNotifications,
  handleUpdateTheme,
} = require("../controllers/organizationSettingControllers");

// All routes require auth
router.use(authMiddleware);

// GET  /api/org-settings          — full settings (profile + org)
router.get("/", handleGetSettings);

// PUT  /api/org-settings/profile  — personal info (name, jobTitle, timezone)
router.put("/profile", handleUpdateProfile);

// PUT  /api/org-settings/organization — org info (name, industry, website …)
router.put("/organization", handleUpdateOrgInfo);

// PUT  /api/org-settings/password — change password
router.put("/password", handleChangePassword);

// PUT  /api/org-settings/notifications — toggle notifications
router.put("/notifications", handleUpdateNotifications);

// PUT  /api/org-settings/theme    — update theme (light | dark | system)
router.put("/theme", handleUpdateTheme);

module.exports = router;
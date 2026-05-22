const {
  getFullSettings,
  updateProfile,
  updateOrgInfo,
  changePassword,
  updateNotifications,
  updateTheme,
} = require("../services/organizationSettingServices");

const getUserId = (req) => req.user?.id || req.user?._id;

// ─── GET /api/org-settings ────────────────────────────────────────────────────
/**
 * Get full combined settings (user profile + org info)
 */
const handleGetSettings = async (req, res) => {
  try {
    const userId = getUserId(req);
    const settings = await getFullSettings(userId);
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(error.message?.includes("not found") ? 404 : 500).json({
      success: false,
      message: error.message || "Failed to fetch settings",
    });
  }
};

// ─── PUT /api/org-settings/profile ───────────────────────────────────────────
/**
 * Update personal profile: name, jobTitle, timezone
 */
const handleUpdateProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { name, jobTitle, timezone } = req.body;

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Name cannot be empty" });
    }

    const updated = await updateProfile(userId, { name, jobTitle, timezone });
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

// ─── PUT /api/org-settings/organization ──────────────────────────────────────
/**
 * Update organization info: name, industry, website, address, contacts
 */
const handleUpdateOrgInfo = async (req, res) => {
  try {
    const userId = getUserId(req);
    const {
      organizationName,
      industry,
      website,
      address,
      primaryContactName,
      primaryContactEmail,
    } = req.body;

    if (organizationName !== undefined && !String(organizationName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Organization name cannot be empty",
      });
    }

    const updated = await updateOrgInfo(userId, {
      organizationName,
      industry,
      website,
      address,
      primaryContactName,
      primaryContactEmail,
    });

    return res.status(200).json({
      success: true,
      message: "Organization info updated successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("Error updating org info:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update organization info",
    });
  }
};

// ─── PUT /api/org-settings/password ──────────────────────────────────────────
/**
 * Change password — requires currentPassword verification
 */
const handleChangePassword = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const result = await changePassword(userId, { currentPassword, newPassword });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error changing password:", error);
    const status = error.message?.includes("incorrect") ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};

// ─── PUT /api/org-settings/notifications ─────────────────────────────────────
/**
 * Toggle notifications on/off
 */
const handleUpdateNotifications = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { notificationsEnabled } = req.body;

    if (typeof notificationsEnabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "'notificationsEnabled' must be a boolean",
      });
    }

    const result = await updateNotifications(userId, notificationsEnabled);
    return res.status(200).json({
      success: true,
      message: `Notifications ${notificationsEnabled ? "enabled" : "disabled"}`,
      ...result,
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notifications",
    });
  }
};

// ─── PUT /api/org-settings/theme ─────────────────────────────────────────────
/**
 * Update theme preference: light | dark | system
 */
const handleUpdateTheme = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({ success: false, message: "theme is required" });
    }

    const result = await updateTheme(userId, theme);
    return res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error updating theme:", error);
    const status = error.message?.includes("Invalid") ? 400 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update theme",
    });
  }
};

module.exports = {
  handleGetSettings,
  handleUpdateProfile,
  handleUpdateOrgInfo,
  handleChangePassword,
  handleUpdateNotifications,
  handleUpdateTheme,
};
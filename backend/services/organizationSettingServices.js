const UserModel = require("../models/userModel");
const OrgSettingsModel = require("../models/orgSettingsModel");
const bcrypt = require("bcryptjs");

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Get or create org settings for a user (upsert on first fetch)
 */
const getOrCreateOrgSettings = async (userId) => {
  let settings = await OrgSettingsModel.findOne({ user: userId });
  if (!settings) {
    settings = await OrgSettingsModel.create({ user: userId });
  }
  return settings;
};

// ─── READ ─────────────────────────────────────────────────────────────────────

/**
 * Get full combined profile: user fields + org settings
 */
const getFullSettings = async (userId) => {
  const [user, settings] = await Promise.all([
    UserModel.findById(userId).select("-password -otp -otpExpiry"),
    getOrCreateOrgSettings(userId),
  ]);

  if (!user) throw new Error("User not found");

  return {
    // From User model
    name: user.name,
    email: user.email,
    organizationName: user.organizationName,
    // From OrgSettings model
    jobTitle: settings.jobTitle,
    timezone: settings.timezone,
    notificationsEnabled: settings.notificationsEnabled,
    theme: settings.theme,
    industry: settings.industry,
    website: settings.website,
    address: settings.address,
    primaryContactName: settings.primaryContactName,
    primaryContactEmail: settings.primaryContactEmail,
  };
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────

/**
 * Update user personal profile: name, jobTitle, timezone
 */
const updateProfile = async (userId, data) => {
  const { name, jobTitle, timezone } = data;

  const updates = {};
  if (name !== undefined && name.trim() !== "") updates.name = name.trim();

  // Update User model if name changed
  if (Object.keys(updates).length > 0) {
    await UserModel.findByIdAndUpdate(userId, updates);
  }

  // Update OrgSettings for jobTitle, timezone
  const settingsUpdates = {};
  if (jobTitle !== undefined) settingsUpdates.jobTitle = jobTitle;
  if (timezone !== undefined) settingsUpdates.timezone = timezone;

  const settings = await OrgSettingsModel.findOneAndUpdate(
    { user: userId },
    { $set: settingsUpdates },
    { new: true, upsert: true }
  );

  return getFullSettings(userId);
};

// ─── UPDATE ORG INFO ──────────────────────────────────────────────────────────

/**
 * Update organization information
 */
const updateOrgInfo = async (userId, data) => {
  const {
    organizationName,
    industry,
    website,
    address,
    primaryContactName,
    primaryContactEmail,
  } = data;

  // Update organizationName on User model
  if (organizationName !== undefined && organizationName.trim() !== "") {
    await UserModel.findByIdAndUpdate(userId, {
      organizationName: organizationName.trim(),
    });
  }

  // Update rest in OrgSettings
  const settingsUpdates = {};
  if (industry !== undefined) settingsUpdates.industry = industry;
  if (website !== undefined) settingsUpdates.website = website;
  if (address !== undefined) settingsUpdates.address = address;
  if (primaryContactName !== undefined)
    settingsUpdates.primaryContactName = primaryContactName;
  if (primaryContactEmail !== undefined)
    settingsUpdates.primaryContactEmail = primaryContactEmail;

  await OrgSettingsModel.findOneAndUpdate(
    { user: userId },
    { $set: settingsUpdates },
    { upsert: true }
  );

  return getFullSettings(userId);
};

// ─── UPDATE SECURITY ──────────────────────────────────────────────────────────

/**
 * Change password - requires current password verification
 */
const changePassword = async (userId, data) => {
  const { currentPassword, newPassword } = data;

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters");
  }

  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new Error("Current password is incorrect");

  if (currentPassword === newPassword) {
    throw new Error("New password must be different from the current one");
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);

  await UserModel.findByIdAndUpdate(userId, { password: hashed });

  return { success: true, message: "Password updated successfully" };
};

/**
 * Update notifications preference
 */
const updateNotifications = async (userId, notificationsEnabled) => {
  await OrgSettingsModel.findOneAndUpdate(
    { user: userId },
    { $set: { notificationsEnabled } },
    { upsert: true }
  );
  return { notificationsEnabled };
};

// ─── UPDATE THEME ─────────────────────────────────────────────────────────────

/**
 * Update theme preference
 */
const updateTheme = async (userId, theme) => {
  const validThemes = ["light", "dark", "system"];
  if (!validThemes.includes(theme)) {
    throw new Error("Invalid theme. Must be light, dark, or system");
  }

  await OrgSettingsModel.findOneAndUpdate(
    { user: userId },
    { $set: { theme } },
    { upsert: true }
  );

  return { theme };
};

module.exports = {
  getFullSettings,
  updateProfile,
  updateOrgInfo,
  changePassword,
  updateNotifications,
  updateTheme,
};
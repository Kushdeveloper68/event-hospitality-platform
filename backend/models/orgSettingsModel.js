const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrgSettingsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // ── User Profile Extensions ─────────────────────────────────────────────
    jobTitle: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },
    notificationsEnabled: { type: Boolean, default: true },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "light",
    },
    // ── Organization Info ───────────────────────────────────────────────────
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    address: { type: String, default: "" },
    primaryContactName: { type: String, default: "" },
    primaryContactEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

const OrgSettingsModel = mongoose.model("OrgSettings", OrgSettingsSchema);
module.exports = OrgSettingsModel;
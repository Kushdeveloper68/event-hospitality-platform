const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSettingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true,
    },
    // General Info
    urlSlug: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },

    // Permissions
    allowPublicRegistration: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: false },
    allowGuestSelfCheckIn: { type: Boolean, default: false },
    enableWaitlist: { type: Boolean, default: false },
    maxCapacity: { type: Number, default: 0 }, // 0 = unlimited

    // Notifications
    notifyOnGuestRegistration: { type: Boolean, default: true },
    notifyOnCheckIn: { type: Boolean, default: true },
    notifyOnServiceRequest: { type: Boolean, default: true },
    notifyOnHighPriority: { type: Boolean, default: true },
    notificationEmail: { type: String, default: "" },

    // Branding
    primaryColor: { type: String, default: "#2463eb" },
    logoUrl: { type: String, default: "" },
    bannerMessage: { type: String, default: "" },

    // Archive/Status
    isArchived: { type: Boolean, default: false },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const EventSettingModel = mongoose.model("EventSetting", EventSettingSchema);
module.exports = EventSettingModel;
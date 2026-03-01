const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivityLogSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    type: { type: String },
    message: { type: String },
    relatedGuest: { type: Schema.Types.ObjectId, ref: "Guest" },
    relatedStaff: { type: Schema.Types.ObjectId, ref: "TeamMember" },
    priority: {
      type: String,
      enum: ["normal", "high", "critical"],
      default: "normal",
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const ActivityLogModel = mongoose.model("ActivityLog", ActivityLogSchema);
module.exports = ActivityLogModel;

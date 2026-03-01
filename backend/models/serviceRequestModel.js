const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceRequestSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    guest: { type: Schema.Types.ObjectId, ref: "Guest" },
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    requestType: {
      type: String,
      enum: ["housekeeping", "maintenance", "fb", "valet", "other"],
      required: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "emergency"],
      default: "medium",
    },
    notes: { type: String },
    permissionToEnter: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true },
);

const ServiceRequestModel = mongoose.model(
  "ServiceRequest",
  ServiceRequestSchema,
);
module.exports = ServiceRequestModel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransportSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    guest: { type: Schema.Types.ObjectId, ref: "Guest" },
    driverName: { type: String },
    vehicleId: { type: String },
    pickupLocation: { type: String },
    dropoffLocation: { type: String },
    scheduledTime: { type: Date },
    status: {
      type: String,
      enum: ["scheduled", "in_transit", "arrived", "cancelled"],
      default: "scheduled",
    },
    notes: { type: String },
  },
  { timestamps: true },
);

TransportSchema.index({ event: 1, createdAt: -1 });

const TransportModel = mongoose.model("Transport", TransportSchema);
module.exports = TransportModel;

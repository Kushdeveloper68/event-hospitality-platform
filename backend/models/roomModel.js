const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    number: { type: String, required: true },
    capacity: { type: Number, default: 1 },
    type: {
      type: String,
      enum: ["standard", "double", "suite", "meeting", "accessible"],
    },
    notes: { type: String },
  },
  { timestamps: true },
);

const RoomModel = mongoose.model("Room", RoomSchema);
module.exports = RoomModel;

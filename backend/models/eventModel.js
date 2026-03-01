const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    venue: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
    isPrivate: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    // you can expand with more fields as needed
  },
  { timestamps: true },
);

const EventModel = mongoose.model("Event", EventSchema);
module.exports = EventModel;

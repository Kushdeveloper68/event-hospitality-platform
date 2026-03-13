const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuestSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    fullName: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String },
    age: { type: Number },
    groupName: { type: String },
    vipStatus: { type: Boolean, default: false },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null },
    checkedOutAt: { type: Date, default: null },
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    arrivalDatetime: { type: Date },
    departureDatetime: { type: Date },
    transportMode: { type: String },
    specialRequests: { type: String },
  },
  { timestamps: true },
);

const GuestModel = mongoose.model("Guest", GuestSchema);
module.exports = GuestModel;

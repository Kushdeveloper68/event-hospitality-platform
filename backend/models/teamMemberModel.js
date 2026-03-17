const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamMemberSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    lastActive: { type: Date },
  },
  { timestamps: true },
);

TeamMemberSchema.index({ event: 1, email: 1 }, { unique: true });

const TeamMemberModel = mongoose.model("TeamMember", TeamMemberSchema);
module.exports = TeamMemberModel;

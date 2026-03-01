// central export for all mongoose models
const User = require("./userModel");
const Event = require("./eventModel");
const Room = require("./roomModel");
const Guest = require("./guestModel");
const ServiceRequest = require("./serviceRequestModel");
const Transport = require("./transportModel");
const TeamMember = require("./teamMemberModel");
const ActivityLog = require("./activityLogModel");

module.exports = {
  User,
  Event,
  Room,
  Guest,
  ServiceRequest,
  Transport,
  TeamMember,
  ActivityLog,
};

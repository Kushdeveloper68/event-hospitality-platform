const GuestModel = require("../models/guestModel");
const RoomModel = require("../models/roomModel");
const TeamMemberModel = require("../models/teamMemberModel");
const ServiceRequestModel = require("../models/serviceRequestModel");
const ActivityLogModel = require("../models/activityLogModel");
const TransportModel = require("../models/transportModel");

/**
 * Get core metrics for an event
 */
const getOverviewMetrics = async (eventId) => {
  try {
    const [
      totalGuests,
      checkedInGuests,
      totalRooms,
      occupiedRooms,
      activeStaff,
      pendingServices,
      activeTransport,
      totalLogs
    ] = await Promise.all([
      GuestModel.countDocuments({ event: eventId }),
      GuestModel.countDocuments({ event: eventId, checkedIn: true }),
      RoomModel.countDocuments({ event: eventId }),
      RoomModel.countDocuments({ event: eventId, status: "Occupied" }),
      TeamMemberModel.countDocuments({ event: eventId, status: "active" }),
      ServiceRequestModel.countDocuments({ event: eventId, status: { $in: ["open", "in_progress"] } }),
      TransportModel.countDocuments({ event: eventId, status: { $in: ["scheduled", "in_transit"] } }),
      ActivityLogModel.countDocuments({ event: eventId })
    ]);

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    return {
      guests: {
        total: totalGuests,
        checkedIn: checkedInGuests
      },
      rooms: {
        total: totalRooms,
        occupied: occupiedRooms,
        occupancyRate: occupancyRate
      },
      staff: {
        active: activeStaff
      },
      services: {
        pending: pendingServices
      },
      transport: {
        active: activeTransport
      },
      logs: {
        total: totalLogs
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get recent activity logs for an event
 */
const getRecentActivity = async (eventId, limit = 5) => {
  try {
    const logs = await ActivityLogModel.find({ event: eventId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("relatedGuest", "fullName groupName vipStatus")
      .populate("relatedStaff", "name");
    
    return logs;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOverviewMetrics,
  getRecentActivity
};

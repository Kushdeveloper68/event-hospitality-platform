const TransportModel = require("../models/transportModel");

/**
 * Create a new transport entry
 */
const createTransport = async (transportData) => {
  try {
    const transport = new TransportModel(transportData);
    const saved = await transport.save();
    // return populated
    const populated = await TransportModel.findById(saved._id).populate("guest", "fullName email phoneNumber vipStatus");
    return populated;
  } catch (error) {
    throw new Error("Failed to create transport: " + error.message);
  }
};

/**
 * Get all transports for an event, optionally filtered by status
 */
const getTransports = async (eventId, status, page = 1, limit = 20) => {
  try {
    const query = { event: eventId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await TransportModel.countDocuments(query);
    const transports = await TransportModel.find(query)
      .populate('guest', 'fullName email phoneNumber vipStatus groupName')
      .sort({ scheduledTime: 1 })
      .skip(skip)
      .limit(limit);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      transports,
    };
  } catch (error) {
    throw new Error('Failed to fetch transports: ' + error.message);
  }
};

/**
 * Get transport by ID
 */
const getTransportById = async (transportId) => {
  try {
    const transport = await TransportModel.findById(transportId)
      .populate("guest", "fullName email phoneNumber vipStatus groupName");
    if (!transport) {
      throw new Error("Transport entry not found");
    }
    return transport;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch transport");
  }
};

/**
 * Update a transport entry
 */
const updateTransport = async (transportId, updateData) => {
  try {
    const updated = await TransportModel.findByIdAndUpdate(
      transportId,
      updateData,
      { new: true, runValidators: true }
    ).populate("guest", "fullName email phoneNumber vipStatus groupName");
    if (!updated) {
      throw new Error("Transport entry not found");
    }
    return updated;
  } catch (error) {
    throw new Error(error.message || "Failed to update transport");
  }
};

/**
 * Delete a transport entry
 */
const deleteTransport = async (transportId) => {
  try {
    const deleted = await TransportModel.findByIdAndDelete(transportId);
    if (!deleted) {
      throw new Error("Transport entry not found");
    }
    return deleted;
  } catch (error) {
    throw new Error(error.message || "Failed to delete transport");
  }
};

/**
 * Update transport status
 */
const updateTransportStatus = async (transportId, status) => {
  try {
    const validStatuses = ["scheduled", "in_transit", "arrived", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status: " + status);
    }
    const updated = await TransportModel.findByIdAndUpdate(
      transportId,
      { status },
      { new: true }
    ).populate("guest", "fullName email phoneNumber vipStatus groupName");
    if (!updated) {
      throw new Error("Transport entry not found");
    }
    return updated;
  } catch (error) {
    throw new Error(error.message || "Failed to update transport status");
  }
};

/**
 * Get transport summary counts for an event
 */
const getTransportSummary = async (eventId) => {
  try {
    const [total, scheduled, inTransit, arrived, cancelled] = await Promise.all([
      TransportModel.countDocuments({ event: eventId }),
      TransportModel.countDocuments({ event: eventId, status: "scheduled" }),
      TransportModel.countDocuments({ event: eventId, status: "in_transit" }),
      TransportModel.countDocuments({ event: eventId, status: "arrived" }),
      TransportModel.countDocuments({ event: eventId, status: "cancelled" }),
    ]);
    return { total, scheduled, inTransit, arrived, cancelled };
  } catch (error) {
    throw new Error("Failed to fetch transport summary: " + error.message);
  }
};

module.exports = {
  createTransport,
  getTransports,
  getTransportById,
  updateTransport,
  deleteTransport,
  updateTransportStatus,
  getTransportSummary,
};

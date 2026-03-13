const ServiceRequestModel = require("../models/serviceRequestModel");

// Create a new service request
const createServiceRequest = async (requestData) => {
  const newRequest = new ServiceRequestModel(requestData);
  return await newRequest.save();
};

// Get service requests for an event
const getServiceRequests = async (eventId, filters = {}) => {
  const query = { event: eventId };

  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.requestType) {
    query.requestType = filters.requestType;
  }

  // Find all matching requests and populate linked entities
  let requests = await ServiceRequestModel.find(query)
    .populate("guest", "name email")
    .populate("room", "number floor")
    .sort({ createdAt: -1 }); // Newest first

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, "i");
    requests = requests.filter((req) => 
      (req.guest && req.guest.name && searchRegex.test(req.guest.name)) ||
      (req.room && req.room.number && searchRegex.test(req.room.number)) ||
      (req._id && searchRegex.test(req._id.toString()))
    );
  }

  return requests;
};

// Get a single service request by ID
const getServiceRequestById = async (requestId) => {
  return await ServiceRequestModel.findById(requestId)
    .populate("guest", "name email")
    .populate("room", "number floor");
};

// Update a service request
const updateServiceRequest = async (requestId, updateData) => {
  return await ServiceRequestModel.findByIdAndUpdate(requestId, updateData, {
    new: true,
    runValidators: true,
  });
};

// Quick update just the status
const updateServiceStatus = async (requestId, status) => {
  return await ServiceRequestModel.findByIdAndUpdate(
    requestId,
    { status },
    { new: true, runValidators: true }
  );
};

// Delete a service request
const deleteServiceRequest = async (requestId) => {
  return await ServiceRequestModel.findByIdAndDelete(requestId);
};

// Get summary metrics for the dashboard
const getServiceSummary = async (eventId) => {
  const allRequests = await ServiceRequestModel.find({ event: eventId });

  const total = allRequests.length;
  const pending = allRequests.filter(r => r.status === "open").length;
  const inProgress = allRequests.filter(r => r.status === "in_progress").length;
  const resolved = allRequests.filter(r => r.status === "completed").length;
  
  // also track cancellation if needed 
  const cancelled = allRequests.filter(r => r.status === "cancelled").length;

  return {
    total,
    pending,
    inProgress,
    resolved,
    cancelled
  };
};

module.exports = {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  updateServiceStatus,
  deleteServiceRequest,
  getServiceSummary,
};

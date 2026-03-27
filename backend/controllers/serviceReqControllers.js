const serviceReqServices = require("../services/serviceReqServices");
const EventModel = require("../models/eventModel");
const { createActivityLog } = require("../services/activityLogServices");

// Helper function to verify event ownership
const verifyEventOwnership = async (eventId, userId) => {
  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  const ownerId = event.createdBy?._id || event.createdBy;
  if (userId && String(ownerId) !== String(userId)) {
    throw new Error("Unauthorized access to this event");
  }
  return true;
};

// Create a new service request
const handleCreateServiceRequest = async (req, res) => {
  try {
    const { event, guest, room, requestType, urgency, notes, permissionToEnter, status } = req.body;
    
    if (!event || !requestType) {
      return res.status(400).json({ success: false, message: "Missing required fields (event, requestType)" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(err.message === "Event not found" ? 404 : 403).json({ success: false, message: err.message });
    }

    const newRequest = await serviceReqServices.createServiceRequest({
      event,
      guest: guest || null,
      room: room || null,
      requestType,
      urgency: urgency || "medium",
      notes,
      permissionToEnter: permissionToEnter || false,
      status: status || "open"
    });

    const guestObj = guest ? await require("../models/guestModel").findById(guest) : null;

    // Async logging
    createActivityLog({
      event,
      type: "service",
      message: `${guestObj ? `Guest ${guestObj.fullName}` : "Service"} requested: ${requestType}`,
      relatedGuest: guest || null,
      priority: urgency === "high" || urgency === "critical" ? "high" : "normal"
    });

    res.status(201).json({ success: true, message: "Service request created successfully", serviceRequest: newRequest });
  } catch (error) {
    console.error("Error creating service request:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get service requests for an event
const handleGetServiceRequests = async (req, res) => {
  try {
    const { eventId, status, requestType, search } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId query parameter is required" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(eventId, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(err.message === "Event not found" ? 404 : 403).json({ success: false, message: err.message });
    }
    
    // Pass the raw eventId separately, and bundle the filters into an object
    // Wait, let's fix the call order based on our service definition: `getServiceRequests(eventId, filters = {})`
    const requests = await serviceReqServices.getServiceRequests(eventId, {
      status, 
      requestType,
      search
    });

    res.status(200).json({ success: true, count: requests.length, serviceRequests: requests });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get a single service request by ID
const handleGetServiceRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await serviceReqServices.getServiceRequestById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    // Verify ownership via the event reference
    try {
      await verifyEventOwnership(request.event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }

    res.status(200).json({ success: true, serviceRequest: request });
  } catch (error) {
    console.error("Error fetching service request by id:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update an entire service request (e.g., from an edit form)
const handleUpdateServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const updateData = req.body;

    const existingRequest = await serviceReqServices.getServiceRequestById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(existingRequest.event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }

    const updatedRequest = await serviceReqServices.updateServiceRequest(requestId, updateData);
    res.status(200).json({ success: true, message: "Service request updated successfully", serviceRequest: updatedRequest });
  } catch (error) {
    console.error("Error updating service request:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Quick update for status only
const handleUpdateServiceStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    if(!status) {
         return res.status(400).json({ success: false, message: "Status is required" });
    }

    const existingRequest = await serviceReqServices.getServiceRequestById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(existingRequest.event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }

    const updatedRequest = await serviceReqServices.updateServiceStatus(requestId, status);

    // Async logging
    try {
      createActivityLog({
        event: existingRequest.event,
        type: "service",
        message: `Service status for ${existingRequest.guest?.fullName || "Guest"} updated to ${status}`,
        relatedGuest: existingRequest.guest?._id || null,
        priority: "normal"
      });
    } catch (logErr) {
      console.error("Non-critical: Failed to log service status update", logErr);
    }

    res.status(200).json({ success: true, message: "Service request status updated", serviceRequest: updatedRequest });
  } catch (error) {
    console.error("Error updating service request status:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// Delete a service request
const handleDeleteServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const existingRequest = await serviceReqServices.getServiceRequestById(requestId);
    if (!existingRequest) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(existingRequest.event, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(403).json({ success: false, message: err.message });
    }

    await serviceReqServices.deleteServiceRequest(requestId);
    res.status(200).json({ success: true, message: "Service request deleted successfully" });
  } catch (error) {
    console.error("Error deleting service request:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get service summary (counts)
const handleGetServiceSummary = async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId query parameter is required" });
    }

    // Verify ownership
    try {
      await verifyEventOwnership(eventId, req.user?.id || req.user?._id);
    } catch (err) {
      return res.status(err.message === "Event not found" ? 404 : 403).json({ success: false, message: err.message });
    }

    const summary = await serviceReqServices.getServiceSummary(eventId);
    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching service summary:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  handleCreateServiceRequest,
  handleGetServiceRequests,
  handleGetServiceRequestById,
  handleUpdateServiceRequest,
  handleUpdateServiceStatus,
  handleDeleteServiceRequest,
  handleGetServiceSummary
};

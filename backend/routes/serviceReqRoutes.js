const express = require('express');
const router = express.Router();
const {
  handleCreateServiceRequest,
  handleGetServiceRequests,
  handleGetServiceRequestById,
  handleUpdateServiceRequest,
  handleUpdateServiceStatus,
  handleDeleteServiceRequest,
  handleGetServiceSummary
} = require('../controllers/serviceReqControllers');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all transport coordination routes
router.use(authMiddleware);

// Create a new service request
router.post('/create', handleCreateServiceRequest);

// Get summary metrics (must come before /:requestId to prevent "summary" from being read as an ID)
router.get('/summary', handleGetServiceSummary);

// Get all service requests for an event
router.get('/', handleGetServiceRequests);

// Get a single service request by ID
router.get('/:requestId', handleGetServiceRequestById);

// Update entire service request
router.put('/:requestId', handleUpdateServiceRequest);

// Update only the status
router.put('/:requestId/status', handleUpdateServiceStatus);

// Delete a service request
router.delete('/:requestId', handleDeleteServiceRequest);

module.exports = router;

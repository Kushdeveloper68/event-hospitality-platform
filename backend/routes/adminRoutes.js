const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminControllers');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Base URL: /api/admin
// Every route here requires: valid login (authMiddleware) AND isAdmin=true (adminMiddleware)
router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);

module.exports = router;
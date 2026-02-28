const express = require('express');
const { CreateUser, LoginUser } = require('../controllers/userControllers');

const router = express.Router();

// User authentication routes
router.post('/signup', CreateUser);
router.post('/login', LoginUser);

module.exports = router;


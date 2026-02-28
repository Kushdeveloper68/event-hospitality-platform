const express = require('express');
const { SignupInitiate, VerifyOTP, ResendOTP, LoginUser } = require('../controllers/userControllers');

const router = express.Router();

// User authentication routes
router.post('/signup', SignupInitiate);
router.post('/verify-otp', VerifyOTP);
router.post('/resend-otp', ResendOTP);
router.post('/login', LoginUser);

module.exports = router;


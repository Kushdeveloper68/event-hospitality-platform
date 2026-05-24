const express = require('express');
const { SignupInitiate, VerifyOTP, ResendOTP, LoginUser } = require('../controllers/userControllers');
const { signupLimiter, verifyOtpLimiter, resendOtpLimiter, loginLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// User authentication routes
router.post('/signup', signupLimiter, SignupInitiate);
router.post('/verify-otp', verifyOtpLimiter, VerifyOTP);
router.post('/resend-otp', resendOtpLimiter, ResendOTP);
router.post('/login', loginLimiter, LoginUser);

module.exports = router;


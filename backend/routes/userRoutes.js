const express = require('express');
const { SignupInitiate, VerifyOTP, ResendOTP, LoginUser, LogoutUser } = require('../controllers/userControllers');
const { signupLimiter, verifyOtpLimiter, resendOtpLimiter, loginLimiter } = require('../middlewares/rateLimiter');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signupLimiter, SignupInitiate);
router.post('/verify-otp', verifyOtpLimiter, VerifyOTP);
router.post('/resend-otp', resendOtpLimiter, ResendOTP);
router.post('/login', loginLimiter, LoginUser);
router.post('/logout', authMiddleware, LogoutUser); // protected so only valid sessions can hit it

module.exports = router;
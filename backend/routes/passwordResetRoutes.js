const express = require('express');
const router = express.Router();
const {
  handleRequestReset,
  handleVerifyResetOTP,
  handleResetPassword,
} = require('../controllers/passwordResetControllers');
const {
  resetPasswordRequestLimiter,
  resetPasswordVerifyLimiter,
  resetPasswordConfirmLimiter,
} = require('../middlewares/rateLimiter');

// Step 1: request OTP
router.post('/request', resetPasswordRequestLimiter, handleRequestReset);

// Step 2: verify OTP → get reset token
router.post('/verify-otp', resetPasswordVerifyLimiter, handleVerifyResetOTP);

// Step 3: set new password
router.post('/reset', resetPasswordConfirmLimiter, handleResetPassword);

module.exports = router;
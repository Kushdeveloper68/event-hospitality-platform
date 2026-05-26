const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, sendPasswordResetEmail } = require('../helpers/emailHelper');

const OTP_EXPIRY_MINUTES = 10;
const RESET_TOKEN_EXPIRY = '15m'; // short-lived token after OTP verified

/**
 * Step 1: Request password reset
 * Checks account exists, sends OTP, returns nothing sensitive
 */
const requestPasswordReset = async (email) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('If an account with that email exists, an OTP has been sent.');
  }

  if (!user.isEmailVerified) {
    throw new Error('This account has not been verified. Please complete signup first.');
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await sendPasswordResetEmail(email, otp, user.name);

  return { success: true };
};

/**
 * Step 2: Verify OTP
 * Returns a short-lived reset token so the user can set a new password
 */
const verifyResetOTP = async (email, otp) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('Invalid request.');
  }

  if (!user.otp) {
    throw new Error('No OTP was requested. Please start the reset process again.');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP. Please check the code and try again.');
  }

  if (new Date() > user.otpExpiry) {
    throw new Error('OTP has expired. Please request a new one.');
  }

  // Clear OTP fields so it cannot be reused
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  // Issue a short-lived reset token
  const resetToken = jwt.sign(
    { id: user._id, purpose: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: RESET_TOKEN_EXPIRY }
  );

  return { resetToken };
};

/**
 * Step 3: Set new password
 * Validates reset token, hashes and saves the new password
 */
const resetPassword = async (resetToken, newPassword) => {
  let decoded;

  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Reset session has expired or is invalid. Please start over.');
  }

  if (decoded.purpose !== 'password-reset') {
    throw new Error('Invalid reset token.');
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new Error('Account not found.');
  }

  // Prevent reusing the same password
  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    throw new Error('New password must be different from your current password.');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { success: true };
};

module.exports = {
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
};
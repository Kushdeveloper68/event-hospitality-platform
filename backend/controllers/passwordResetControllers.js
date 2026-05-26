const {
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
} = require('../services/passwordResetServices');

/**
 * POST /api/password-reset/request
 * Body: { email }
 */
const handleRequestReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    await requestPasswordReset(email.toLowerCase().trim());

    // Always return same message to prevent account enumeration
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, an OTP has been sent.',
    });
  } catch (error) {
    // For the "account not found" case we still return 200
    // so attackers cannot tell whether the email is registered
    if (error.message.includes('If an account')) {
      return res.status(200).json({ success: true, message: error.message });
    }
    console.error('Error requesting password reset:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process request.',
    });
  }
};

/**
 * POST /api/password-reset/verify-otp
 * Body: { email, otp }
 */
const handleVerifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required.',
      });
    }

    const { resetToken } = await verifyResetOTP(
      email.toLowerCase().trim(),
      otp.trim()
    );

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      resetToken, // frontend stores this temporarily in memory
    });
  } catch (error) {
    console.error('Error verifying reset OTP:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'OTP verification failed.',
    });
  }
};

/**
 * POST /api/password-reset/reset
 * Body: { resetToken, newPassword, confirmPassword }
 */
const handleResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      });
    }

    await resetPassword(resetToken, newPassword);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to reset password.',
    });
  }
};

module.exports = {
  handleRequestReset,
  handleVerifyResetOTP,
  handleResetPassword,
};
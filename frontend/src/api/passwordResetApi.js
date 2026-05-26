import api from './axios';

const API_BASE_PATH = '/password-reset';

/**
 * Step 1: Request OTP for password reset
 * @param {string} email
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post(`${API_BASE_PATH}/request`, { email });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Request failed. Please try again.' };
  }
};

/**
 * Step 2: Verify OTP — returns resetToken
 * @param {string} email
 * @param {string} otp
 */
export const verifyResetOTP = async (email, otp) => {
  try {
    const response = await api.post(`${API_BASE_PATH}/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'OTP verification failed.' };
  }
};

/**
 * Step 3: Set new password using reset token
 * @param {string} resetToken
 * @param {string} newPassword
 * @param {string} confirmPassword
 */
export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  try {
    const response = await api.post(`${API_BASE_PATH}/reset`, {
      resetToken,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Password reset failed.' };
  }
};
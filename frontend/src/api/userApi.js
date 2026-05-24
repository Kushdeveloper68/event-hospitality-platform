import api from "./axios";

const API_BASE_PATH = "/users";

// ============ SIGNUP ENDPOINTS ============

/**
 * Initiate signup - Send user data and OTP to email
 * @param {Object} userData - {email, password, name, organizationName, termCondition}
 * @returns {Promise}
 */


export const signupInitiate = async (userData) => {
    try {
        const response = await api.post(`${API_BASE_PATH}/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Signup failed' };
    }
};

/**
 * Verify OTP - Complete signup process
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise}
 */
export const verifyOTP = async (email, otp) => {
    try {
        const response = await api.post(`${API_BASE_PATH}/verify-otp`, { email, otp });
        
        // Store token in localStorage if provided
        if (response.data.token && response.data.user) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'OTP verification failed' };
    }
};

/**
 * Resend OTP - Request a new OTP
 * @param {string} email - User email
 * @returns {Promise}
 */
export const resendOTP = async (email) => {
    try {
        const response = await api.post(`${API_BASE_PATH}/resend-otp`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Failed to resend OTP' };
    }
};

// ============ LOGIN ENDPOINTS ============

/**
 * Login - Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise}
 */
export const loginUser = async (email, password) => {
    try {
        const response = await api.post(`${API_BASE_PATH}/login`, { email, password });
        
        // Store token in localStorage if provided
        if (response.data.token && response.data.user) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: 'Login failed' };
    }
};

// ============ UTILITY FUNCTIONS ============

/**
 * Get stored auth token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

/**
 * Logout - Clear stored token
 */
export const logout = () => {
    localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return !!getAuthToken();
};



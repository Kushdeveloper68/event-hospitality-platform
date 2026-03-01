const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTPEmail } = require('../helpers/emailHelper');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRE = '7d';
const OTP_EXPIRY_MINUTES = 10;


class UserServiceClass {
    // Generate JWT token
    generateToken(userId) {
        try {
            // include `id` claim so middleware/controllers can read `req.user.id`
            const token = jwt.sign(
                { id: userId },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRE }
            );
            return token;
        } catch (error) {
            throw new Error('Error generating token: ' + error.message);
        }
    }

    // Send OTP to user email
    async sendOTPToEmail(email, name) {
        try {
            const user = await UserModel.findOne({ email });
            if (user && user.isEmailVerified) {
                throw new Error('Email already registered and verified');
            }

            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

            // Save OTP to user
            if (user) {
                user.otp = otp;
                user.otpExpiry = otpExpiry;
                await user.save();
            }

            // Send OTP email
            await sendOTPEmail(email, otp, name);

            return { success: true, message: 'OTP sent to email' };
        } catch (error) {
            throw new Error(error.message || 'Error sending OTP');
        }
    }

    // Verify OTP
    async verifyOTP(email, otp) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            if (!user.otp) {
                throw new Error('OTP not requested. Please signup first');
            }

            if (user.otp !== otp) {
                throw new Error('Invalid OTP');
            }

            if (new Date() > user.otpExpiry) {
                throw new Error('OTP expired. Please request a new one');
            }

            // Mark email as verified
            user.isEmailVerified = true;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();

            return { success: true, message: 'Email verified successfully' };
        } catch (error) {
            throw new Error(error.message || 'Error verifying OTP');
        }
    }

    async createUser(userData) {
        try {
            // Check if user already exists
            const existingUser = await UserModel.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Email already registered');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // Create user
            const user = new UserModel({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            return user;
        } catch (error) {
            throw new Error(error.message || 'Error creating user');
        }
    }

    async loginUser(email, password) {
        try {
            // Find user by email
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Compare password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            return user;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }
}

const UserService = new UserServiceClass()

module.exports = UserService;
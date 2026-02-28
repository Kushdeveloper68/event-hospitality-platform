const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRE = '7d';

class UserServiceClass {
    // Generate JWT token
    generateToken(userId) {
        try {
            const token = jwt.sign(
                { userId, email: userId },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRE }
            );
            return token;
        } catch (error) {
            throw new Error('Error generating token: ' + error.message);
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
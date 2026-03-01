const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authMiddleware = (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];
           console.log("Auth Middleware - Token:", token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login first'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log("Auth Middleware - Decoded User:", decoded);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;

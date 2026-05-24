// global rate limiter middleware
const { rateLimit } = require("express-rate-limit");

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    standardHeaders: true, 
    legacyHeaders: false, 
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            success: false,
            message: "Too many requests from this IP. Please try again later.",
            retryAfterSeconds: Math.max(
                1,
                Math.ceil(options.windowMs / 1000)
            )
        });
    }
});

module.exports = globalLimiter;
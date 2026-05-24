
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const createAuthLimiter = ({
	windowMs,
	max,
	message,
	keyPrefix,
}) =>
	rateLimit({
		windowMs,
		max,

		standardHeaders: true,
		legacyHeaders: false,

		skipSuccessfulRequests,

		keyGenerator: (req) =>
			`${keyPrefix}:${ipKeyGenerator(req.ip)}`,

		handler: (req, res, next, options) => {
			res.status(options.statusCode).json({
				success: false,
				message,
				retryAfterSeconds: Math.max(
					1,
					Math.ceil(
						(req.rateLimit.resetTime - Date.now()) / 1000
					)
				),
			});
		},
	});

const signupLimiter = createAuthLimiter({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: "Too many signup attempts from this IP. Please try again later.",
	keyPrefix: "signup",
    skipSuccessfulRequests: true,
});

const verifyOtpLimiter = createAuthLimiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Too many OTP verification attempts. Please wait before trying again.",
	keyPrefix: "verify-otp",
    skipSuccessfulRequests: false,
});

const resendOtpLimiter = createAuthLimiter({
	windowMs: 15 * 60 * 1000,
	max: 3,
	message: "Too many OTP resend requests. Please wait before requesting another code.",
	keyPrefix: "resend-otp",
    skipSuccessfulRequests: false,
});

const loginLimiter = createAuthLimiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Too many login attempts. Please try again later.",
	keyPrefix: "login",
    skipSuccessfulRequests: true,
});

module.exports = {
	signupLimiter,
	verifyOtpLimiter,
	resendOtpLimiter,
	loginLimiter,
};


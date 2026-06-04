const express = require("express");
const passport = require("passport");
const {
  SignupInitiate,
  VerifyOTP,
  ResendOTP,
  LoginUser,
  LogoutUser,
} = require("../controllers/userControllers");
const {
  signupLimiter,
  verifyOtpLimiter,
  resendOtpLimiter,
  loginLimiter,
} = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/authMiddleware");
const { handleGoogleCallback } = require("../controllers/googleAuthController");

const router = express.Router();

// ── Email / password auth ──────────────────────────────────────────────────
router.post("/signup", signupLimiter, SignupInitiate);
router.post("/verify-otp", verifyOtpLimiter, VerifyOTP);
router.post("/resend-otp", resendOtpLimiter, ResendOTP);
router.post("/login", loginLimiter, LoginUser);
router.post("/logout", authMiddleware, LogoutUser);

// ── Google OAuth ───────────────────────────────────────────────────────────
// Step 1: redirect the browser to Google's consent screen
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Step 2: Google redirects back here after the user consents
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  handleGoogleCallback
);

module.exports = router;
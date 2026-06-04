const UserService = require("../services/userServices");
const UserModel = require("../models/userModel");
const { sendWelcomeEmail } = require("../helpers/emailHelper");

/**
 * GET /api/users/auth/google/callback
 * Called by Passport after Google verifies the user.
 * Issues a JWT, sets the cookie, and redirects to the frontend.
 */
const handleGoogleCallback = async (req, res) => {
  try {
    const user = req.user; // set by Passport
    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=google_auth_failed`
      );
    }

    const token = UserService.generateToken(user._id);

    // Set the same cookie that the rest of the app expects
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with token in query so the SPA can store it in
    // localStorage (mirrors what the email/password flow already does)
    const redirectUrl = new URL(`${process.env.CLIENT_URL}/auth/google/success`);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("user", JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.name,
      organizationName: user.organizationName,
    }));

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Google callback error:", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/login?error=server_error`
    );
  }
};

module.exports = { handleGoogleCallback };
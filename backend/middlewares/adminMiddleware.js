const UserModel = require("../models/userModel");

/**
 * Admin-only route guard.
 *
 * IMPORTANT: this must run AFTER authMiddleware in the route chain —
 * it relies on req.user.id having already been set from a verified JWT.
 *
 * Deliberately re-checks isAdmin against the database on every request
 * rather than trusting a role embedded in the JWT itself. This means
 * revoking admin access takes effect immediately (no waiting for old
 * tokens to expire), and a tampered/forged token can't grant admin
 * rights since the JWT payload only ever contains a user id, never a
 * role claim.
 */
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await UserModel.findById(req.user.id).select("isAdmin");

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying admin access",
    });
  }
};

module.exports = adminMiddleware;
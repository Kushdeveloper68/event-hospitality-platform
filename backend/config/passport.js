const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const UserModel = require("../models/userModel");
const { sendWelcomeEmail } = require("../helpers/emailHelper");

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing in .env");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || "http://localhost:7000"}/api/users/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }

        // ── Find existing user ──────────────────────────────────────────────
        let user = await UserModel.findOne({ email });

        if (user) {
          // Mark email as verified if it wasn't already (Google has verified it)
          if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
          }
          return done(null, user);
        }

        // ── Create new user from Google profile ─────────────────────────────
        const name = profile.displayName || email.split("@")[0];

        // We generate a random unguessable password because the user will
        // sign in via Google — they never need to type a password.
        const crypto = require("crypto");
        const bcrypt = require("bcryptjs");
        const randomPassword = crypto.randomBytes(32).toString("hex");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        user = new UserModel({
          email,
          password: hashedPassword,
          name,
          // Use their Google domain or a sensible default as the org name.
          // The user can update this later in Settings.
          organizationName: name + "'s Organization",
          termCondition: true, // OAuth sign-up implies acceptance
          isEmailVerified: true,
        });

        await user.save();

        // Non-blocking welcome email
        sendWelcomeEmail(email, name).catch((err) =>
          console.error("Welcome email failed:", err.message)
        );

        return done(null, user);
      } catch (error) {
        console.error("Google strategy error:", error);
        return done(error, null);
      }
    }
  )
);

// Passport requires serialize/deserialize even if we only use JWT
// (these are called during the OAuth redirect dance, not on API requests)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
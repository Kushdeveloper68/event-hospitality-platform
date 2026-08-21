const UserService = require("../services/userServices");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const {
  sendWelcomeEmail,
  sendWelcomeBackEmail,
} = require("../helpers/emailHelper");

// Step 1: Initiate signup and send OTP
async function SignupInitiate(req, res) {
  try {
    const { email, password, name, organizationName, termCondition } = req.body;

    // Validation
    if (!email || !password || !name || !organizationName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!termCondition) {
      return res.status(400).json({
        success: false,
        message: "Please accept terms and conditions",
      });
    }

    // Check if email already exists and is verified
    const existingUser = await UserModel.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    let user = existingUser;

    // If user doesn't exist, create a temporary user (not verified yet)
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new UserModel({
        email,
        password: hashedPassword,
        name,
        organizationName,
        termCondition,
        isEmailVerified: false,
      });
      await user.save();
    }

    // Send OTP
    await UserService.sendOTPToEmail(email, name);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
      email,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error initiating signup",
    });
  }
}

// Step 2: Verify OTP and complete signup
async function VerifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Verify OTP
    await UserService.verifyOTP(email, otp);

    // Get user
    const user = await UserModel.findOne({ email });

    // Generate JWT token
    const token = UserService.generateToken(user._id);

    // Set cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // Send welcome email (non-blocking — failures should not break flow)
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (err) {
      console.error("Error sending welcome email:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. Welcome!",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        organizationName: user.organizationName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error verifying OTP",
    });
  }
}

// Resend OTP
async function ResendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Send OTP
    await UserService.sendOTPToEmail(email, user.name);

    return res.status(200).json({
      success: true,
      message: "OTP resent to your email",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error resending OTP",
    });
  }
}

async function LoginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Authenticate user
    const user = await UserService.loginUser(email, password);

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Generate JWT token
    const token = UserService.generateToken(user._id);

    // Set cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send welcome-back email (non-blocking)
    try {
      await sendWelcomeBackEmail(user.email, user.name);
    } catch (err) {
      console.error("Error sending welcome-back email:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        organizationName: user.organizationName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
}

async function LogoutUser(req, res) {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
}
module.exports = { SignupInitiate, VerifyOTP, ResendOTP, LoginUser, LogoutUser };
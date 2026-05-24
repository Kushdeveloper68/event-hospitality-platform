const nodemailer = require('nodemailer');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error("EMAIL_USER or EMAIL_PASSWORD missing");
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASSWORD 
    }
});

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@hospitality.com',
            to: email,
            subject: 'Email Verification - OTP Code',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>Thank you for signing up! Please use the OTP code below to verify your email address:</p>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p style="color: #666; font-size: 14px;">Do not share this code with anyone.</p>
                    
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    
                    <p style="color: #999; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
                    <p style="color: #999; font-size: 12px;">© 2026 Hospitality Platform. All rights reserved.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        throw new Error('Error sending OTP email: ' + error.message);
    }
};

// Send welcome greeting email (after successful signup)
const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@hospitality.com',
            to: email,
            subject: 'Welcome to Hospitality Platform',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #333;">Welcome, ${name}!</h2>
                    <p>Thank you for signing up for Hospitality Platform. We're excited to have you on board.</p>
                    <p style="color: #666; font-size: 14px;">Get started by exploring your dashboard and creating your first event.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="color: #999; font-size: 12px;">Need help? Reply to this email and we'll assist you.</p>
                    <p style="color: #999; font-size: 12px;">© 2026 Hospitality Platform. All rights reserved.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Welcome email sent' };
    } catch (error) {
        throw new Error('Error sending welcome email: ' + error.message);
    }
};

// Send welcome-back email (after successful login)
const sendWelcomeBackEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@hospitality.com',
            to: email,
            subject: 'Welcome back to Hospitality Platform',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #333;">Welcome back, ${name}!</h2>
                    <p>Glad to see you again. We hope you have a productive session.</p>
                    <p style="color: #666; font-size: 14px;">Quick links: <a href="/dashboard">Dashboard</a> | <a href="/events">Events</a></p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="color: #999; font-size: 12px;">If this wasn't you, please reset your password immediately.</p>
                    <p style="color: #999; font-size: 12px;">© 2026 Hospitality Platform. All rights reserved.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Welcome back email sent' };
    } catch (error) {
        throw new Error('Error sending welcome-back email: ' + error.message);
    }
};

module.exports = { generateOTP, sendOTPEmail, sendWelcomeEmail, sendWelcomeBackEmail };

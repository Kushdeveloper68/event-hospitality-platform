const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
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

module.exports = { generateOTP, sendOTPEmail };

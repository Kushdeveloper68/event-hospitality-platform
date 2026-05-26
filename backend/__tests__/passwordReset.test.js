const request = require('supertest');
const app = require('../tests/helpers/testApp');
const { connect, disconnect, clearDatabase } = require('../tests/helpers/testDb');
const { createTestUser } = require('../tests/helpers/authHelper');
const UserModel = require('../models/userModel');

jest.mock('../helpers/emailHelper', () => ({
  generateOTP: jest.fn(() => '654321'),
  sendOTPEmail: jest.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
  sendWelcomeBackEmail: jest.fn().mockResolvedValue({ success: true }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true }),
}));

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await disconnect());

describe('Password Reset Flow', () => {
  const email = 'reset@example.com';

  // ─── Step 1: Request ───────────────────────────────────────────────────────

  describe('POST /api/password-reset/request', () => {
    it('should send OTP and return 200 for existing verified user', async () => {
      await createTestUser({ email });

      const res = await request(app)
        .post('/api/password-reset/request')
        .send({ email });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // OTP should be saved on the user
      const user = await UserModel.findOne({ email });
      expect(user.otp).toBe('654321');
      expect(user.otpExpiry).toBeDefined();
    });

    it('should return 200 even for non-existent email (no enumeration)', async () => {
      const res = await request(app)
        .post('/api/password-reset/request')
        .send({ email: 'ghost@example.com' });

      // Must not reveal that account doesn't exist
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 400 when email field is missing', async () => {
      const res = await request(app)
        .post('/api/password-reset/request')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── Step 2: Verify OTP ───────────────────────────────────────────────────

  describe('POST /api/password-reset/verify-otp', () => {
    it('should return resetToken for valid OTP', async () => {
      await createTestUser({ email });
      await request(app)
        .post('/api/password-reset/request')
        .send({ email });

      const res = await request(app)
        .post('/api/password-reset/verify-otp')
        .send({ email, otp: '654321' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.resetToken).toBeDefined();

      // OTP must be cleared after use
      const user = await UserModel.findOne({ email });
      expect(user.otp).toBeNull();
    });

    it('should return 400 for wrong OTP', async () => {
      await createTestUser({ email });
      await request(app)
        .post('/api/password-reset/request')
        .send({ email });

      const res = await request(app)
        .post('/api/password-reset/verify-otp')
        .send({ email, otp: '000000' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should return 400 for expired OTP', async () => {
      await createTestUser({ email });

      // Manually set an already-expired OTP
      await UserModel.findOneAndUpdate(
        { email },
        { otp: '654321', otpExpiry: new Date(Date.now() - 5000) }
      );

      const res = await request(app)
        .post('/api/password-reset/verify-otp')
        .send({ email, otp: '654321' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/expired/i);
    });
  });

  // ─── Step 3: Reset password ───────────────────────────────────────────────

  describe('POST /api/password-reset/reset', () => {
    const getResetToken = async () => {
      await createTestUser({ email });
      await request(app)
        .post('/api/password-reset/request')
        .send({ email });
      const verify = await request(app)
        .post('/api/password-reset/verify-otp')
        .send({ email, otp: '654321' });
      return verify.body.resetToken;
    };

    it('should reset password with valid token', async () => {
      const resetToken = await getResetToken();

      const res = await request(app)
        .post('/api/password-reset/reset')
        .send({
          resetToken,
          newPassword: 'NewSecurePass123!',
          confirmPassword: 'NewSecurePass123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Should now be able to log in with new password
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({ email, password: 'NewSecurePass123!' });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.success).toBe(true);
    });

    it('should return 400 when passwords do not match', async () => {
      const resetToken = await getResetToken();

      const res = await request(app)
        .post('/api/password-reset/reset')
        .send({
          resetToken,
          newPassword: 'NewPass123!',
          confirmPassword: 'DifferentPass123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/do not match/i);
    });

    it('should return 400 for password under 8 characters', async () => {
      const resetToken = await getResetToken();

      const res = await request(app)
        .post('/api/password-reset/reset')
        .send({
          resetToken,
          newPassword: 'abc',
          confirmPassword: 'abc',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/8 characters/i);
    });

    it('should return 400 for invalid or tampered reset token', async () => {
      const res = await request(app)
        .post('/api/password-reset/reset')
        .send({
          resetToken: 'this.is.not.valid',
          newPassword: 'NewPass123!',
          confirmPassword: 'NewPass123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/invalid|expired/i);
    });
  });
});
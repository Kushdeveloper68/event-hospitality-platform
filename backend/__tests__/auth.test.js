const request = require('supertest');
const app = require('../tests/helpers/testApp');
const { connect, disconnect, clearDatabase } = require('../tests/helpers/testDb');
const { createTestUser } = require('../tests/helpers/authHelper');
const UserModel = require('../models/userModel');

// Mock the email helper so no real emails are sent during tests
jest.mock('../helpers/emailHelper', () => ({
  generateOTP: jest.fn(() => '123456'),
  sendOTPEmail: jest.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
  sendWelcomeBackEmail: jest.fn().mockResolvedValue({ success: true }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true }),
}));

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await disconnect());

// ─── Signup ───────────────────────────────────────────────────────────────────

describe('POST /api/users/signup', () => {
  const validPayload = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'SecurePass123!',
    organizationName: 'Acme Corp',
    termCondition: true,
  };

  it('should return 200 and send OTP for valid signup', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.email).toBe(validPayload.email);
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when terms not accepted', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({ ...validPayload, termCondition: false });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/terms/i);
  });

  it('should return 400 when email already registered and verified', async () => {
    await createTestUser({ email: validPayload.email });

    const res = await request(app)
      .post('/api/users/signup')
      .send(validPayload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already registered/i);
  });
});

// ─── Verify OTP ───────────────────────────────────────────────────────────────

describe('POST /api/users/verify-otp', () => {
  it('should verify OTP and return token', async () => {
    const email = 'verify@example.com';

    // Create unverified user with known OTP
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    await UserModel.create({
      name: 'Verify User',
      email,
      password: await bcrypt.hash('pass123456', salt),
      organizationName: 'Test Org',
      termCondition: true,
      isEmailVerified: false,
      otp: '123456',
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    const res = await request(app)
      .post('/api/users/verify-otp')
      .send({ email, otp: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it('should return 400 for wrong OTP', async () => {
    const email = 'wrong@example.com';
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    await UserModel.create({
      name: 'Wrong OTP User',
      email,
      password: await bcrypt.hash('pass123456', salt),
      organizationName: 'Test Org',
      termCondition: true,
      isEmailVerified: false,
      otp: '123456',
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    const res = await request(app)
      .post('/api/users/verify-otp')
      .send({ email, otp: '999999' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid otp/i);
  });

  it('should return 400 for expired OTP', async () => {
    const email = 'expired@example.com';
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    await UserModel.create({
      name: 'Expired OTP User',
      email,
      password: await bcrypt.hash('pass123456', salt),
      organizationName: 'Test Org',
      termCondition: true,
      isEmailVerified: false,
      otp: '123456',
      otpExpiry: new Date(Date.now() - 1000), // already expired
    });

    const res = await request(app)
      .post('/api/users/verify-otp')
      .send({ email, otp: '123456' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/expired/i);
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

describe('POST /api/users/login', () => {
  it('should login with correct credentials and set cookie', async () => {
    const { user, password } = await createTestUser({ email: 'login@example.com' });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'login@example.com', password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('login@example.com');
    // Cookie should be set
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should return 401 for wrong password', async () => {
    await createTestUser({ email: 'wrongpass@example.com' });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'wrongpass@example.com', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'nobody@example.com', password: 'SomePass123!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if email is not verified', async () => {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    await UserModel.create({
      name: 'Unverified',
      email: 'unverified@example.com',
      password: await bcrypt.hash('TestPass123!', salt),
      organizationName: 'Org',
      termCondition: true,
      isEmailVerified: false,
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'unverified@example.com', password: 'TestPass123!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/verify/i);
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

describe('POST /api/users/logout', () => {
  it('should clear cookie and return success for authenticated user', async () => {
    const { token } = await createTestUser({ email: 'logout@example.com' });

    const res = await request(app)
      .post('/api/users/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Cookie should be cleared (set with maxAge=0 or expires in the past)
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/authToken/);
  });

  it('should return 401 for unauthenticated request', async () => {
    const res = await request(app).post('/api/users/logout');
    expect(res.status).toBe(401);
  });
});
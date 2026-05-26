const request = require('supertest');
const app = require('../tests/helpers/testApp');
const { connect, disconnect, clearDatabase } = require('../tests/helpers/testDb');
const { createTestUser } = require('../tests/helpers/authHelper');
const jwt = require('jsonwebtoken');

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

describe('Auth Middleware', () => {
  it('should return 401 when no token provided', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  it('should return 401 for an expired token', async () => {
    const expiredToken = jwt.sign(
      { id: 'fakeid123' },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' } // already expired
    );

    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid or expired/i);
  });

  it('should return 401 for a tampered token', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', 'Bearer totally.fake.token');

    expect(res.status).toBe(401);
  });

  it('should pass through with a valid token', async () => {
    const { token } = await createTestUser({ email: 'valid@example.com' });

    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should accept token from cookie as well as header', async () => {
    const { token } = await createTestUser({ email: 'cookie@example.com' });

    const res = await request(app)
      .get('/api/events')
      .set('Cookie', `authToken=${token}`);

    expect(res.status).toBe(200);
  });
});
const request = require('supertest');
const app = require('../tests/helpers/testApp');
const { connect, disconnect, clearDatabase } = require('../tests/helpers/testDb');
const { createTestUser } = require('../tests/helpers/authHelper');

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

describe('Events API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const result = await createTestUser({ email: 'events@example.com' });
    token = result.token;
    userId = result.user._id;
  });

  // ─── Create ──────────────────────────────────────────────────────────────

  describe('POST /api/events/create', () => {
    it('should create event for authenticated user', async () => {
      const res = await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Annual Summit 2025',
          venue: 'Grand Plaza',
          startDate: '2025-06-01',
          endDate: '2025-06-03',
          description: 'A test event',
          isPrivate: false,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.event.name).toBe('Annual Summit 2025');
      expect(res.body.event.createdBy).toBeDefined();
    });

    it('should return 400 when name is missing', async () => {
      const res = await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ venue: 'No Name Venue' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/events/create')
        .send({ name: 'Ghost Event' });

      expect(res.status).toBe(401);
    });
  });

  // ─── List ─────────────────────────────────────────────────────────────────

  describe('GET /api/events', () => {
    it('should return only events belonging to the authenticated user', async () => {
      // Create event for this user
      await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'My Event' });

      // Create a second user with their own event
      const other = await createTestUser({ email: 'other@example.com' });
      await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${other.token}`)
        .send({ name: 'Other Event' });

      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.events).toHaveLength(1);
      expect(res.body.events[0].name).toBe('My Event');
    });
  });

  // ─── Get by ID ────────────────────────────────────────────────────────────

  describe('GET /api/events/:eventId', () => {
    it('should return event for owner', async () => {
      const create = await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Target Event' });

      const eventId = create.body.event._id;

      const res = await request(app)
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.event._id).toBe(eventId);
    });

    it('should return 403 when non-owner tries to access', async () => {
      const create = await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Private Event' });

      const eventId = create.body.event._id;
      const other = await createTestUser({ email: 'intruder@example.com' });

      const res = await request(app)
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${other.token}`);

      expect(res.status).toBe(403);
    });
  });

  // ─── Update ───────────────────────────────────────────────────────────────

  describe('PUT /api/events/:eventId', () => {
    it('should update event name for owner', async () => {
      const create = await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Old Name' });

      const eventId = create.body.event._id;

      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.event.name).toBe('New Name');
    });

    it('should return 403 when non-owner tries to update', async () => {
      const create = await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Protected Event' });

      const eventId = create.body.event._id;
      const other = await createTestUser({ email: 'attacker@example.com' });

      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${other.token}`)
        .send({ name: 'Hijacked' });

      expect(res.status).toBe(403);
    });
  });

  // ─── Delete ───────────────────────────────────────────────────────────────

  describe('DELETE /api/events/:eventId', () => {
    it('should delete event for owner', async () => {
      const create = await request(app)
        .post('/api/events/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Delete Me' });

      const eventId = create.body.event._id;

      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Confirm it's gone
      const check = await request(app)
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(check.status).toBe(404);
    });
  });
});
/**
 * Signup-source tracking (helper, email signup, Google OAuth `state` round trip,
 * admin aggregation) and room guest management (list / remove).
 * Models are mocked, so no database is needed.
 */
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.SERVER_URL = 'http://localhost:7000';
process.env.CLIENT_URL = 'http://localhost:5173';

// ---- mocks -------------------------------------------------------------
jest.mock('../models/userModel', () => {
  const UserModel = jest.fn(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  });
  UserModel.findOne = jest.fn();
  UserModel.aggregate = jest.fn();
  return UserModel;
});
jest.mock('../models/eventModel', () => ({ distinct: jest.fn(), countDocuments: jest.fn() }));
jest.mock('../models/guestModel', () => ({
  find: jest.fn(), findById: jest.fn(), updateOne: jest.fn(), countDocuments: jest.fn(),
}));
jest.mock('../models/roomModel', () => ({ findById: jest.fn() }));
jest.mock('../helpers/emailHelper', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(),
  sendWelcomeBackEmail: jest.fn().mockResolvedValue(),
  generateOTP: jest.fn(), sendOTPEmail: jest.fn(),
}));
jest.mock('../services/userServices', () => ({
  sendOTPToEmail: jest.fn().mockResolvedValue(),
  generateToken: jest.fn(() => 'jwt'),
}));
jest.mock('../middlewares/rateLimiter', () => {
  const pass = (req, res, next) => next();
  return { signupLimiter: pass, verifyOtpLimiter: pass, resendOtpLimiter: pass, loginLimiter: pass };
});
jest.mock('../middlewares/authMiddleware', () => (req, res, next) => next());

const request = require('supertest');
const express = require('express');
const passport = require('passport');
const UserModel = require('../models/userModel');
const EventModel = require('../models/eventModel');
const GuestModel = require('../models/guestModel');
const RoomModel = require('../models/roomModel');
const { sanitizeAttribution, decodeAttributionParam } = require('../helpers/attribution');
require('../config/passport');
const { SignupInitiate } = require('../controllers/userControllers');
const { getSignupSources } = require('../services/adminServices');
const { getRoomGuests, unassignGuestFromRoom } = require('../services/roomServices');

// Same encoding the frontend uses (btoa of JSON -> base64url)
const encodeParam = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const GOOD = { source: 'instagram', medium: 'bio', campaign: 'oct-planners', referrer: 'l.instagram.com', landingPath: '/', capturedAt: new Date().toISOString() };

beforeEach(() => jest.clearAllMocks());

// ======================= attribution helper =======================
describe('sanitizeAttribution', () => {
  it('keeps clean values', () => {
    expect(sanitizeAttribution(GOOD)).toMatchObject({ source: 'instagram', medium: 'bio', campaign: 'oct-planners', referrer: 'l.instagram.com', landingPath: '/' });
  });
  it('strips markup / odd characters and lowercases', () => {
    const r = sanitizeAttribution({ source: '<Script>alert(1)</Script>', medium: 'BIO!!', campaign: 'a'.repeat(300) });
    expect(r.source).not.toMatch(/[<>()]/);
    expect(r.medium).toBe('bio');
    expect(r.campaign.length).toBeLessThanOrEqual(80);
  });
  it.each([null, undefined, 'x', 42, [], {}, { source: '' }, { source: '<>' }, { medium: 'bio' }])('returns null for unusable input %p', (input) => {
    expect(sanitizeAttribution(input)).toBeNull();
  });
  it('replaces an implausible capturedAt with now', () => {
    const r = sanitizeAttribution({ ...GOOD, capturedAt: '1999-01-01' });
    expect(Date.now() - r.capturedAt.getTime()).toBeLessThan(5000);
  });
  it('drops a landing path that is not a path, and strips any query string', () => {
    expect(sanitizeAttribution({ ...GOOD, landingPath: 'javascript:alert(1)' }).landingPath).toBeNull();
    expect(sanitizeAttribution({ ...GOOD, landingPath: '/pricing?token=secret' }).landingPath).toBe('/pricing');
  });
});

describe('decodeAttributionParam', () => {
  it('decodes what the frontend sends', () => expect(decodeAttributionParam(encodeParam(GOOD))).toMatchObject({ source: 'instagram', medium: 'bio' }));
  it.each([undefined, '', '!!!', 'not-json-at-all', 'a'.repeat(2000), encodeParam('just a string'), encodeParam([1, 2])])('returns null for %p', (v) => {
    expect(decodeAttributionParam(v)).toBeNull();
  });
});

// ======================= email signup =======================
const mockRes = () => { const res = {}; res.status = jest.fn(() => res); res.json = jest.fn(() => res); return res; };
const signupBody = (extra = {}) => ({ email: 'a@b.com', password: 'secret123', name: 'A', organizationName: 'Org', termCondition: true, ...extra });

describe('SignupInitiate stores the source', () => {
  it('new user: saves sanitized source and method=email', async () => {
    UserModel.findOne.mockResolvedValue(null);
    const res = mockRes();
    await SignupInitiate({ body: signupBody({ attribution: { ...GOOD, source: 'Instagram<b>' } }) }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const created = UserModel.mock.calls[0][0];
    expect(created.signupMethod).toBe('email');
    expect(created.signupSource.source).toBe('instagramb');
  });
  it('works fine with no attribution at all', async () => {
    UserModel.findOne.mockResolvedValue(null);
    const res = mockRes();
    await SignupInitiate({ body: signupBody() }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(UserModel.mock.calls[0][0].signupSource).toBeUndefined();
  });
  it('unverified user retrying: fills a missing source but never overwrites an existing one', async () => {
    const withSource = { isEmailVerified: false, signupSource: { source: 'whatsapp' }, save: jest.fn() };
    UserModel.findOne.mockResolvedValue(withSource);
    await SignupInitiate({ body: signupBody({ attribution: GOOD }) }, mockRes());
    expect(withSource.signupSource.source).toBe('whatsapp');
    expect(withSource.save).not.toHaveBeenCalled();

    const without = { isEmailVerified: false, save: jest.fn().mockResolvedValue() };
    UserModel.findOne.mockResolvedValue(without);
    await SignupInitiate({ body: signupBody({ attribution: GOOD }) }, mockRes());
    expect(without.signupSource.source).toBe('instagram');
    expect(without.save).toHaveBeenCalled();
  });
});

// ======================= Google OAuth =======================
describe('Google OAuth carries the source through `state`', () => {
  const buildApp = () => {
    // loads the REAL routes/userRoutes.js (controllers/limiters are mocked above)
    const app = express();
    app.use(passport.initialize());
    app.use('/api/users', require('../routes/userRoutes'));
    return app;
  };

  it('redirects to Google with the encoded source as `state`', async () => {
    const param = encodeParam(GOOD);
    const res = await request(buildApp()).get(`/api/users/auth/google?src=${param}`);
    expect(res.status).toBe(302);
    expect(new URL(res.headers.location).searchParams.get('state')).toBe(param);
  });
  it('sends no `state` when there is no (or an invalid) src', async () => {
    const app = buildApp();
    for (const q of ['', '?src=', '?src=<script>', `?src=${'a'.repeat(2000)}`]) {
      const res = await request(app).get(`/api/users/auth/google${q}`);
      expect(res.status).toBe(302);
      expect(new URL(res.headers.location).searchParams.has('state')).toBe(false);
    }
  });

  const runVerify = (req, profile) =>
    new Promise((resolve, reject) => {
      passport._strategy('google')._verify(req, 'at', 'rt', profile, (err, user) => (err ? reject(err) : resolve(user)));
    });
  const profile = { displayName: 'New Person', emails: [{ value: 'new@x.com' }] };

  it('new Google user gets signupSource + signupMethod=google', async () => {
    UserModel.findOne.mockResolvedValue(null);
    await runVerify({ query: { state: encodeParam(GOOD) } }, profile);
    const created = UserModel.mock.calls[0][0];
    expect(created.signupMethod).toBe('google');
    expect(created.signupSource).toMatchObject({ source: 'instagram', medium: 'bio' });
  });
  it('new Google user with a tampered state is still created, just without a source', async () => {
    UserModel.findOne.mockResolvedValue(null);
    await runVerify({ query: { state: 'garbage!!' } }, profile);
    const created = UserModel.mock.calls[0][0];
    expect(created.signupMethod).toBe('google');
    expect(created.signupSource).toBeUndefined();
  });
  it('an EXISTING user signing in is never re-attributed', async () => {
    const existing = { isEmailVerified: true, save: jest.fn() };
    UserModel.findOne.mockResolvedValue(existing);
    await runVerify({ query: { state: encodeParam(GOOD) } }, profile);
    expect(existing.signupSource).toBeUndefined();
    expect(UserModel).not.toHaveBeenCalled();
  });
});

// ======================= admin aggregation =======================
describe('getSignupSources', () => {
  it('groups by source (missing -> unknown) and counts activation from event owners', async () => {
    EventModel.distinct.mockResolvedValue(['u1', 'u2']);
    UserModel.aggregate.mockResolvedValue([
      { _id: 'instagram', total: 10, verified: 7, activated: 3 },
      { _id: 'unknown', total: 4, verified: 4, activated: 2 },
    ]);
    const out = await getSignupSources();
    expect(out).toEqual([
      { source: 'instagram', total: 10, verified: 7, activated: 3 },
      { source: 'unknown', total: 4, verified: 4, activated: 2 },
    ]);
    const pipeline = UserModel.aggregate.mock.calls[0][0];
    expect(JSON.stringify(pipeline)).toContain('$ifNull');
    expect(JSON.stringify(pipeline)).toContain('signupSource.source');
    expect(JSON.stringify(pipeline)).toContain('"u1"'); // organizer ids are passed in for the activation count
  });
});

// ======================= room guests =======================
const chain = (result) => { const q = {}; ['select', 'sort'].forEach((m) => { q[m] = jest.fn(() => q); }); q.lean = jest.fn(() => Promise.resolve(result)); return q; };

describe('getRoomGuests', () => {
  it('lists the room\'s guests with light fields', async () => {
    RoomModel.findById.mockResolvedValue({ _id: 'r1' });
    const q = chain([{ fullName: 'A' }]);
    GuestModel.find.mockReturnValue(q);
    expect(await getRoomGuests('r1')).toEqual([{ fullName: 'A' }]);
    expect(GuestModel.find).toHaveBeenCalledWith({ room: 'r1' });
    expect(q.lean).toHaveBeenCalled();
  });
  it('404 for a missing room', async () => {
    RoomModel.findById.mockResolvedValue(null);
    await expect(getRoomGuests('nope')).rejects.toMatchObject({ status: 404 });
  });
});

describe('unassignGuestFromRoom', () => {
  const room = { _id: 'r1', number: '101' };
  it('removes the guest, only if they are still in that room', async () => {
    RoomModel.findById.mockResolvedValue(room);
    GuestModel.findById.mockResolvedValue({ _id: 'g1', fullName: 'Rahul', room: 'r1' });
    GuestModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

    const guest = await unassignGuestFromRoom('r1', 'g1');

    expect(guest.fullName).toBe('Rahul');
    expect(GuestModel.updateOne).toHaveBeenCalledWith({ _id: 'g1', room: 'r1' }, { $unset: { room: '' } });
  });
  it('409 if the guest is in a different room, or none', async () => {
    RoomModel.findById.mockResolvedValue(room);
    GuestModel.findById.mockResolvedValue({ _id: 'g1', fullName: 'Rahul', room: 'r2' });
    await expect(unassignGuestFromRoom('r1', 'g1')).rejects.toMatchObject({ status: 409 });
    GuestModel.findById.mockResolvedValue({ _id: 'g1', fullName: 'Rahul' });
    await expect(unassignGuestFromRoom('r1', 'g1')).rejects.toMatchObject({ status: 409 });
    expect(GuestModel.updateOne).not.toHaveBeenCalled();
  });
  it('409 if they were moved away by someone else a moment ago', async () => {
    RoomModel.findById.mockResolvedValue(room);
    GuestModel.findById.mockResolvedValue({ _id: 'g1', fullName: 'Rahul', room: 'r1' });
    GuestModel.updateOne.mockResolvedValue({ modifiedCount: 0 });
    await expect(unassignGuestFromRoom('r1', 'g1')).rejects.toMatchObject({ status: 409 });
  });
  it('404 for a missing room or guest', async () => {
    RoomModel.findById.mockResolvedValue(null);
    await expect(unassignGuestFromRoom('x', 'g1')).rejects.toMatchObject({ status: 404 });
    RoomModel.findById.mockResolvedValue(room);
    GuestModel.findById.mockResolvedValue(null);
    await expect(unassignGuestFromRoom('r1', 'x')).rejects.toMatchObject({ status: 404 });
  });
});

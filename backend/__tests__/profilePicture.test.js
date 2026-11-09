/**
 * Google profile photo: URL validation, saving on signup, refreshing on later
 * sign-ins, and being returned to the frontend. Models are mocked.
 */
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

jest.mock('../models/userModel', () => {
  const UserModel = jest.fn(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  });
  UserModel.findOne = jest.fn();
  return UserModel;
});
jest.mock('../helpers/emailHelper', () => ({ sendWelcomeEmail: jest.fn().mockResolvedValue() }));
jest.mock('../services/userServices', () => ({ generateToken: jest.fn(() => 'jwt') }));

const passport = require('passport');
const UserModel = require('../models/userModel');
const { sanitizeProfilePicture } = require('../helpers/profilePicture');
require('../config/passport');
const { handleGoogleCallback } = require('../controllers/googleAuthController');

const PHOTO = 'https://lh3.googleusercontent.com/a/ACg8oc123=s96-c';
const profile = (photo) => ({ displayName: 'New Person', emails: [{ value: 'new@x.com' }], ...(photo !== undefined && { photos: [{ value: photo }] }) });
const runVerify = (p) =>
  new Promise((resolve, reject) => {
    passport._strategy('google')._verify({ query: {} }, 'at', 'rt', p, (err, user) => (err ? reject(err) : resolve(user)));
  });

beforeEach(() => jest.clearAllMocks());

describe('sanitizeProfilePicture', () => {
  it.each([
    PHOTO,
    'https://lh3.googleusercontent.com/a-/AOh14Gh=s96-c',
    'https://lh4.ggpht.com/abc',
  ])('keeps a Google image URL: %s', (url) => expect(sanitizeProfilePicture(url)).toBeTruthy());

  it.each([
    ['http (not https)', 'http://lh3.googleusercontent.com/a/x'],
    ['another host', 'https://evil.example.com/a.png'],
    ['look-alike host', 'https://googleusercontent.com.evil.com/a.png'],
    ['look-alike suffix', 'https://notgoogleusercontent.com/a.png'],
    ['javascript url', 'javascript:alert(1)'],
    ['data url', 'data:image/png;base64,AAAA'],
    ['not a url', 'hello'],
    ['too long', 'https://lh3.googleusercontent.com/' + 'a'.repeat(600)],
    ['empty', ''],
    ['null', null],
    ['undefined', undefined],
    ['object', {}],
  ])('rejects %s', (_label, url) => expect(sanitizeProfilePicture(url)).toBeNull());
});

describe('Google sign-in stores / refreshes the photo', () => {
  it('new user: saved with the photo', async () => {
    UserModel.findOne.mockResolvedValue(null);
    await runVerify(profile(PHOTO));
    expect(UserModel.mock.calls[0][0].profilePicture).toBe(PHOTO);
  });

  it('new user whose photo is not a Google image URL: created without one', async () => {
    UserModel.findOne.mockResolvedValue(null);
    await runVerify(profile('https://evil.example.com/a.png'));
    expect(UserModel.mock.calls[0][0].profilePicture).toBeUndefined();
  });

  it('new user with no photo at all still signs up fine', async () => {
    UserModel.findOne.mockResolvedValue(null);
    await expect(runVerify(profile())).resolves.toBeDefined();
    expect(UserModel.mock.calls[0][0].profilePicture).toBeUndefined();
  });

  it('existing user: a changed photo is refreshed and saved', async () => {
    const existing = { isEmailVerified: true, profilePicture: 'https://lh3.googleusercontent.com/a/old=s96-c', save: jest.fn().mockResolvedValue() };
    UserModel.findOne.mockResolvedValue(existing);
    await runVerify(profile(PHOTO));
    expect(existing.profilePicture).toBe(PHOTO);
    expect(existing.save).toHaveBeenCalledTimes(1);
  });

  it('existing user: an unchanged photo causes no database write', async () => {
    const existing = { isEmailVerified: true, profilePicture: PHOTO, save: jest.fn() };
    UserModel.findOne.mockResolvedValue(existing);
    await runVerify(profile(PHOTO));
    expect(existing.save).not.toHaveBeenCalled();
  });

  it('existing email/password user signing in with Google for the first time gets verified + a photo in ONE save', async () => {
    const existing = { isEmailVerified: false, save: jest.fn().mockResolvedValue() };
    UserModel.findOne.mockResolvedValue(existing);
    await runVerify(profile(PHOTO));
    expect(existing.isEmailVerified).toBe(true);
    expect(existing.profilePicture).toBe(PHOTO);
    expect(existing.save).toHaveBeenCalledTimes(1);
  });

  it('existing user: a missing/invalid photo never wipes the one we already have', async () => {
    const existing = { isEmailVerified: true, profilePicture: PHOTO, save: jest.fn() };
    UserModel.findOne.mockResolvedValue(existing);
    await runVerify(profile('https://evil.example.com/a.png'));
    expect(existing.profilePicture).toBe(PHOTO);
    await runVerify(profile());
    expect(existing.profilePicture).toBe(PHOTO);
    expect(existing.save).not.toHaveBeenCalled();
  });
});

describe('the photo reaches the frontend', () => {
  it('Google callback includes it in the user payload', async () => {
    const res = { cookie: jest.fn(), redirect: jest.fn() };
    process.env.CLIENT_URL = 'http://localhost:5173';
    await handleGoogleCallback({ user: { _id: 'u1', email: 'a@b.com', name: 'A', organizationName: 'O', isAdmin: false, profilePicture: PHOTO } }, res);
    const url = new URL(res.redirect.mock.calls[0][0]);
    expect(JSON.parse(url.searchParams.get('user')).profilePicture).toBe(PHOTO);
  });

  it('Google callback sends null (not undefined) when there is no photo', async () => {
    const res = { cookie: jest.fn(), redirect: jest.fn() };
    process.env.CLIENT_URL = 'http://localhost:5173';
    await handleGoogleCallback({ user: { _id: 'u1', email: 'a@b.com', name: 'A', organizationName: 'O', isAdmin: false } }, res);
    const url = new URL(res.redirect.mock.calls[0][0]);
    expect(JSON.parse(url.searchParams.get('user'))).toHaveProperty('profilePicture', null);
  });
});

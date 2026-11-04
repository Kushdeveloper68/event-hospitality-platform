/**
 * Query-shape tests for the speed work: lean results, trimmed fields, slim
 * pickers, and safe search. Models are mocked, so no database is needed.
 */
const mockChain = (result) => {
  const q = {};
  ['select', 'populate', 'sort', 'skip', 'limit'].forEach((m) => { q[m] = jest.fn(() => q); });
  q.lean = jest.fn(() => Promise.resolve(result));
  return q;
};

jest.mock('../models/guestModel', () => ({
  find: jest.fn(), countDocuments: jest.fn(), aggregate: jest.fn(), collection: { name: 'guests' },
}));
jest.mock('../models/roomModel', () => ({
  find: jest.fn(), countDocuments: jest.fn(), aggregate: jest.fn(),
}));

const GuestModel = require('../models/guestModel');
const RoomModel = require('../models/roomModel');
const checkIn = require('../services/checkInServices');
const { getGuests } = require('../services/guestServices');
const { getRooms } = require('../services/roomServices');

const EVENT_ID = '64b7f0c2a1b2c3d4e5f60718';
beforeEach(() => jest.clearAllMocks());

// Everything the check-in desk page actually reads from a guest.
const FIELDS_THE_DESK_READS = ['fullName', 'groupName', 'vipStatus', 'arrivalDatetime', 'checkedInAt', 'room'];

describe('check-in desk queries', () => {
  const listFns = Object.entries(checkIn).filter(([name]) => /arriving|checkedin|pending/i.test(name));

  it('has list functions to test', () => {
    expect(listFns.length).toBeGreaterThanOrEqual(3);
  });

  it.each(listFns.map(([name]) => name))('%s is lean, trimmed and keeps the room light', async (name) => {
    const q = mockChain([{ _id: 'g1' }]);
    GuestModel.find.mockReturnValue(q);

    await checkIn[name](EVENT_ID);

    expect(q.lean).toHaveBeenCalled();
    const fields = q.select.mock.calls[0][0].split(' ');
    FIELDS_THE_DESK_READS.forEach((f) => expect(fields).toContain(f));
    expect(fields).not.toContain('specialRequests'); // heavy / unused on the desk
    expect(q.populate).toHaveBeenCalledWith('room', 'number type');
  });
});

describe('getGuests', () => {
  it('default mode: full room populate, lean', async () => {
    const q = mockChain([]);
    GuestModel.find.mockReturnValue(q);
    GuestModel.countDocuments.mockResolvedValue(0);

    await getGuests({ eventId: EVENT_ID });

    expect(q.populate).toHaveBeenCalledWith('room');
    expect(q.select).not.toHaveBeenCalled();
    expect(q.lean).toHaveBeenCalled();
  });

  it('slim mode: only picker fields and a light room', async () => {
    const q = mockChain([]);
    GuestModel.find.mockReturnValue(q);
    GuestModel.countDocuments.mockResolvedValue(0);

    await getGuests({ eventId: EVENT_ID, slim: true, limit: 1000 });

    const fields = q.select.mock.calls[0][0].split(' ');
    ['fullName', 'email', 'phoneNumber', 'groupName', 'room'].forEach((f) => expect(fields).toContain(f));
    expect(fields).not.toContain('specialRequests');
    expect(q.populate).toHaveBeenCalledWith('room', 'number type');
    expect(q.lean).toHaveBeenCalled();
  });

  it('escapes regex characters in search instead of throwing', async () => {
    const q = mockChain([]);
    GuestModel.find.mockReturnValue(q);
    GuestModel.countDocuments.mockResolvedValue(0);

    await expect(getGuests({ eventId: EVENT_ID, search: 'a(b' })).resolves.toBeDefined();

    const query = GuestModel.find.mock.calls[0][0];
    const regexes = query.$or.map((c) => Object.values(c)[0]);
    regexes.forEach((r) => {
      expect(r.source).toContain('a\\(b');
      expect(r.test('xa(by')).toBe(true);
      expect(r.test('ab')).toBe(false); // "(" is literal, not a group
    });
  });
});

describe('getRooms slim mode', () => {
  it('skips the occupancy $lookup / stats aggregation entirely', async () => {
    const q = mockChain([{ number: '101' }]);
    RoomModel.find.mockReturnValue(q);
    RoomModel.countDocuments.mockResolvedValue(45);

    const res = await getRooms({ eventId: EVENT_ID, slim: true, limit: 20 });

    expect(RoomModel.aggregate).not.toHaveBeenCalled();
    expect(q.select).toHaveBeenCalledWith('number type capacity');
    expect(q.lean).toHaveBeenCalled();
    expect(res).toMatchObject({ total: 45, totalPages: 3, rooms: [{ number: '101' }] });
  });

  it('normal mode still uses the aggregation (stats + occupancy)', async () => {
    RoomModel.aggregate.mockResolvedValue([]);
    await getRooms({ eventId: EVENT_ID });
    expect(RoomModel.aggregate).toHaveBeenCalled();
    expect(RoomModel.find).not.toHaveBeenCalled();
  });
});

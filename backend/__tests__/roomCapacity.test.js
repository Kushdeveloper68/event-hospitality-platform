/**
 * Room capacity rules — assignment, race guard, capacity edits, and the
 * mass-assignment bypass through guest create/update.
 * Models are mocked, so no database is needed.
 */
jest.mock('../models/roomModel', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  aggregate: jest.fn(),
}));

jest.mock('../models/guestModel', () => {
  const GuestModel = jest.fn(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  });
  GuestModel.findById = jest.fn();
  GuestModel.findByIdAndUpdate = jest.fn();
  GuestModel.countDocuments = jest.fn();
  GuestModel.updateOne = jest.fn();
  GuestModel.collection = { name: 'guests' };
  return GuestModel;
});

const RoomModel = require('../models/roomModel');
const GuestModel = require('../models/guestModel');
const { assignGuestToRoom, updateRoom } = require('../services/roomServices');
const { createGuest, updateGuest } = require('../services/guestServices');

const EVENT = 'event-1';
const makeRoom = (over = {}) => ({ _id: 'room-1', number: '101', capacity: 2, event: EVENT, ...over });
const makeGuest = (over = {}) => ({
  _id: 'guest-1',
  event: EVENT,
  room: undefined,
  save: jest.fn().mockResolvedValue(true),
  ...over,
});

beforeEach(() => jest.clearAllMocks());

describe('assignGuestToRoom', () => {
  it('assigns a guest when the room has space', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom({ capacity: 2 }));
    const guest = makeGuest();
    GuestModel.findById.mockResolvedValue(guest);
    GuestModel.countDocuments.mockResolvedValueOnce(1).mockResolvedValueOnce(2); // before, after

    const result = await assignGuestToRoom('room-1', 'guest-1');

    expect(result.room).toBe('room-1');
    expect(guest.save).toHaveBeenCalledTimes(1);
  });

  it('rejects with 409 when the room is already full, and does not save', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom({ capacity: 2 }));
    const guest = makeGuest();
    GuestModel.findById.mockResolvedValue(guest);
    GuestModel.countDocuments.mockResolvedValueOnce(2);

    await expect(assignGuestToRoom('room-1', 'guest-1')).rejects.toMatchObject({
      status: 409,
      message: expect.stringMatching(/Room 101 is full \(2\/2/),
    });
    expect(guest.save).not.toHaveBeenCalled();
  });

  it('excludes the guest themself when counting occupancy', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom());
    GuestModel.findById.mockResolvedValue(makeGuest());
    GuestModel.countDocuments.mockResolvedValue(0);

    await assignGuestToRoom('room-1', 'guest-1');

    expect(GuestModel.countDocuments).toHaveBeenNthCalledWith(1, {
      room: 'room-1',
      _id: { $ne: 'guest-1' },
    });
  });

  it('is a no-op when the guest is already in that room (even if it is full)', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom({ capacity: 1 }));
    const guest = makeGuest({ room: 'room-1' });
    GuestModel.findById.mockResolvedValue(guest);

    const result = await assignGuestToRoom('room-1', 'guest-1');

    expect(result).toBe(guest);
    expect(guest.save).not.toHaveBeenCalled();
    expect(GuestModel.countDocuments).not.toHaveBeenCalled();
  });

  it('rolls back and returns 409 if the room filled up between check and save (race)', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom({ capacity: 1 }));
    GuestModel.findById.mockResolvedValue(makeGuest());
    GuestModel.countDocuments.mockResolvedValueOnce(0).mockResolvedValueOnce(2); // passes check, then over capacity

    await expect(assignGuestToRoom('room-1', 'guest-1')).rejects.toMatchObject({ status: 409 });
    expect(GuestModel.updateOne).toHaveBeenCalledWith(
      { _id: 'guest-1', room: 'room-1' },
      { $unset: { room: '' } }
    );
  });

  it('restores the previous room when a rolled-back guest was being moved', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom({ capacity: 1 }));
    GuestModel.findById.mockResolvedValue(makeGuest({ room: 'room-9' }));
    GuestModel.countDocuments.mockResolvedValueOnce(0).mockResolvedValueOnce(2);

    await expect(assignGuestToRoom('room-1', 'guest-1')).rejects.toMatchObject({ status: 409 });
    expect(GuestModel.updateOne).toHaveBeenCalledWith(
      { _id: 'guest-1', room: 'room-1' },
      { $set: { room: 'room-9' } }
    );
  });

  it('rejects a guest from a different event with 400', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom());
    GuestModel.findById.mockResolvedValue(makeGuest({ event: 'other-event' }));

    await expect(assignGuestToRoom('room-1', 'guest-1')).rejects.toMatchObject({ status: 400 });
  });

  it('returns 404 for a missing room or guest', async () => {
    RoomModel.findById.mockResolvedValue(null);
    await expect(assignGuestToRoom('nope', 'guest-1')).rejects.toMatchObject({ status: 404 });

    RoomModel.findById.mockResolvedValue(makeRoom());
    GuestModel.findById.mockResolvedValue(null);
    await expect(assignGuestToRoom('room-1', 'nope')).rejects.toMatchObject({ status: 404 });
  });
});

describe('updateRoom', () => {
  it('refuses to shrink capacity below the number of assigned guests (409)', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom({ capacity: 4 }));
    GuestModel.countDocuments.mockResolvedValue(3);

    await expect(updateRoom('room-1', { capacity: 2 })).rejects.toMatchObject({ status: 409 });
    expect(RoomModel.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('allows capacity equal to current occupancy', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom({ capacity: 4 }));
    GuestModel.countDocuments.mockResolvedValue(3);
    RoomModel.findByIdAndUpdate.mockResolvedValue({ capacity: 3 });

    await updateRoom('room-1', { capacity: 3 });
    expect(RoomModel.findByIdAndUpdate).toHaveBeenCalledWith('room-1', { capacity: 3 }, expect.any(Object));
  });

  it.each([0, -1, 1.5, 'abc'])('rejects invalid capacity %p with 400', async (bad) => {
    RoomModel.findById.mockResolvedValue(makeRoom());
    await expect(updateRoom('room-1', { capacity: bad })).rejects.toMatchObject({ status: 400 });
  });

  it('never lets `event` be changed through a room edit', async () => {
    RoomModel.findById.mockResolvedValue(makeRoom());
    RoomModel.findByIdAndUpdate.mockResolvedValue({});

    await updateRoom('room-1', { notes: 'hi', event: 'someone-elses-event', _id: 'x' });

    expect(RoomModel.findByIdAndUpdate).toHaveBeenCalledWith('room-1', { notes: 'hi' }, expect.any(Object));
  });
});

describe('guest create/update cannot bypass the capacity check', () => {
  it('updateGuest drops `room` and `event` from the update', async () => {
    GuestModel.findByIdAndUpdate.mockResolvedValue({ _id: 'guest-1' });

    await updateGuest('guest-1', { fullName: 'A', room: 'room-1', event: 'other', vipStatus: true });

    expect(GuestModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'guest-1',
      { fullName: 'A', vipStatus: true },
      expect.any(Object)
    );
  });

  it('createGuest drops `room` but keeps everything else', async () => {
    await createGuest({ event: EVENT, fullName: 'A', room: 'room-1' });

    expect(GuestModel).toHaveBeenCalledWith({ event: EVENT, fullName: 'A' });
  });
});

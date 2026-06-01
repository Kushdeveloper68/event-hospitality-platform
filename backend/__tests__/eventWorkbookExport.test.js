const request = require('supertest');
const ExcelJS = require('exceljs');
const app = require('../tests/helpers/testApp');
const { connect, disconnect, clearDatabase } = require('../tests/helpers/testDb');
const { createTestUser } = require('../tests/helpers/authHelper');
const EventModel = require('../models/eventModel');
const RoomModel = require('../models/roomModel');
const GuestModel = require('../models/guestModel');
const ServiceRequestModel = require('../models/serviceRequestModel');
const TransportModel = require('../models/transportModel');
const TeamMemberModel = require('../models/teamMemberModel');
const ScheduleActivity = require('../models/scheduleModel');

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

describe('GET /api/event-analytics/:eventId/export/workbook', () => {
  it('returns a workbook with the core event sheets', async () => {
    const { token, user } = await createTestUser({ email: 'export-owner@example.com' });

    const event = await EventModel.create({
      name: 'Export Ready Summit',
      venue: 'Grand Hall',
      startDate: new Date('2026-06-10T09:00:00.000Z'),
      endDate: new Date('2026-06-12T17:00:00.000Z'),
      description: 'Integration test event',
      isPrivate: false,
      createdBy: user._id,
    });

    const room = await RoomModel.create({
      event: event._id,
      number: 'A101',
      capacity: 2,
      type: 'suite',
      notes: 'VIP room',
    });

    const guest = await GuestModel.create({
      event: event._id,
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      phoneNumber: '+10000000000',
      age: 36,
      groupName: 'Speakers',
      vipStatus: true,
      checkedIn: true,
      checkedInAt: new Date('2026-06-10T09:15:00.000Z'),
      room: room._id,
      transportMode: 'car',
      specialRequests: 'Quiet room',
    });

    await ServiceRequestModel.create({
      event: event._id,
      guest: guest._id,
      room: room._id,
      requestType: 'housekeeping',
      urgency: 'high',
      notes: 'Extra pillows',
      permissionToEnter: true,
      status: 'open',
    });

    await TransportModel.create({
      event: event._id,
      guest: guest._id,
      driverName: 'Chris Driver',
      vehicleId: 'VH-77',
      pickupLocation: 'Airport',
      dropoffLocation: 'Grand Hall',
      scheduledTime: new Date('2026-06-10T08:30:00.000Z'),
      status: 'scheduled',
      notes: 'Call on arrival',
    });

    await TeamMemberModel.create({
      event: event._id,
      name: 'Morgan Lead',
      email: 'morgan@example.com',
      role: 'Operations',
      status: 'active',
    });

    await ScheduleActivity.create({
      eventId: event._id,
      title: 'Opening Ceremony',
      workstream: 'Main Sessions',
      startTime: new Date('2026-06-10T10:00:00.000Z'),
      endTime: new Date('2026-06-10T11:00:00.000Z'),
      location: 'Main Stage',
      assignedTo: 'Morgan Lead',
      status: 'Confirmed',
      description: 'Kickoff session',
    });

    const res = await request(app)
      .get(`/api/event-analytics/${event._id}/export/workbook`)
      .buffer(true)
      .parse((res, callback) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => callback(null, Buffer.concat(chunks)));
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    expect(res.headers['content-disposition']).toContain('.xlsx');
    expect(Buffer.isBuffer(res.body)).toBe(true);
    expect(res.body[0]).toBe(0x50);
    expect(res.body[1]).toBe(0x4b);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(res.body);

    expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual(
      expect.arrayContaining([
        'Event Summary',
        'Rooms',
        'Guests',
        'Services',
        'Schedule',
        'Team',
        'Transport',
      ]),
    );
    expect(workbook.getWorksheet('Guests').getRow(2).getCell(1).value).toBe(
      'Ada Lovelace',
    );
    expect(workbook.getWorksheet('Rooms').getRow(2).getCell(1).value).toBe('A101');
    expect(workbook.getWorksheet('Team').getRow(2).getCell(1).value).toBe(
      'Morgan Lead',
    );
  });
});
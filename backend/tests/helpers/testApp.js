/**
 * Creates a clean Express app instance for tests,
 * without calling app.listen() so supertest controls the port.
 */
const express = require('express');
const cookiesP = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('../../routes/userRoutes');
const eventRoutes = require('../../routes/eventRoutes');
const guestRoutes = require('../../routes/guestRoutes');
const passwordResetRoutes = require('../../routes/passwordResetRoutes');
const checkInRoutes = require('../../routes/checkInRoutes');
const roomRoutes = require('../../routes/roomRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookiesP());
app.use(cors({ origin: '*', credentials: true }));

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/checkin', checkInRoutes);
app.use('/api/rooms', roomRoutes);

module.exports = app;
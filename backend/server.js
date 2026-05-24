require('dotenv').config({path:__dirname + "/.env"})
const express = require("express")
const app = express() 

app.set("trust proxy", 1);

const cors = require("cors")
const bodyPraser = require('body-parser')
const cookiesP = require('cookie-parser');
const path = require('path')
const port = process.env.PORT || 5000
const rateLimit = require("express-rate-limit");

const connectToMongoDB = require('./connections/mongodbConnection')
const userRoutes = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes')
const guestRoutes = require('./routes/guestRoutes')
const roomRoutes = require('./routes/roomRoutes')
const checkInRoutes = require('./routes/checkInRoutes')
const transportRoutes = require('./routes/transportCoordiRoutes')
const teamMemberRoutes = require('./routes/teamMemberRoutes')
const serviceReqRoutes = require('./routes/serviceReqRoutes')
const overViewRoutes = require('./routes/overViewRoutes')
const scheduleRoutes = require('./routes/scheduleRoutes')
const specificEventSummaryRoutes = require('./routes/specificEventSummaryRoutes')
const specificEventSettingRoutes = require('./routes/specificEventSettingRoutes')
const mainDashboardRoutes = require('./routes/mainOprationDashboardRoutes')
const organizationAnalyticsDashboardsRoutes = require('./routes/OrganizationAnalyticsDashboardsRoutes')
const eventAnalyticsReportsRoutes  = require('./routes/eventAnalyticsReportsRoutes')
const orgSettingsRoutes = require('./routes/organizationSettingRoutes')

// connect to MongoDB
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI missing");
}

connectToMongoDB(process.env.MONGO_URI)

// body parser
app.use(bodyPraser.json())
app.use(bodyPraser.urlencoded({ extended: true }))
app.use(cookiesP())

// cors setup
app.use(cors({
  origin: process.env.CLIENT_URL, //  frontend URL
  credentials: true
}));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500
});

app.use(globalLimiter);

app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/guests', guestRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/checkin', checkInRoutes)
app.use('/api/transport', transportRoutes)
app.use('/api/team', teamMemberRoutes)
app.use('/api/services', serviceReqRoutes)
app.use('/api/overview', overViewRoutes)
app.use('/api/schedules', scheduleRoutes)
app.use('/api/event-summary', specificEventSummaryRoutes)
app.use('/api/event-settings', specificEventSettingRoutes)
app.use('/api/main-dashboard', mainDashboardRoutes)
app.use('/api/org-analytics', organizationAnalyticsDashboardsRoutes)
app.use('/api/event-analytics', eventAnalyticsReportsRoutes)  
app.use('/api/org-settings', orgSettingsRoutes)

app.listen(port, () =>
  console.log('> Server is up and running on port : ' + port)
)
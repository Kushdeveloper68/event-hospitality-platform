require('dotenv').config({path:__dirname + "/.env"})
const express = require("express")
const app = express() 

app.set("trust proxy", 1);

const cors = require("cors")
const bodyPraser = require('body-parser')
const cookiesP = require('cookie-parser');
const path = require('path')
const port = process.env.PORT || 5000

const helmet = require("helmet");
const morgan = require('morgan');

const globalLimiter = require('./middlewares/globalLimiter')
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
const passwordResetRoutes = require('./routes/passwordResetRoutes')  
const activityAndNotificationLogsRoutes = require('./routes/activityAndNotificationLogsRoutes')
// connect to MongoDB
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI missing");
}

connectToMongoDB(process.env.MONGO_URI)

// body parser
app.use(helmet({
		crossOriginResourcePolicy: false,
	}));

// Request logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // full apache-style logs in production
} else {
  app.use(morgan('dev')); // colored compact logs in development
}

app.use(globalLimiter);
app.use(bodyPraser.json())
app.use(bodyPraser.urlencoded({ extended: true }))
app.use(cookiesP())

// cors setup
app.use(cors({
  origin: process.env.CLIENT_URL, //  frontend URL
  credentials: true
}));


// Health check endpoint
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbStatus];

  res.status(dbStatus === 1 ? 200 : 503).json({
    status: dbStatus === 1 ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbState,
    environment: process.env.NODE_ENV || 'development',
  });
});


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
app.use('/api/password-reset', passwordResetRoutes)  
app.use('/api/activity-logs', activityAndNotificationLogsRoutes)

const server = app.listen(port, () =>
  console.log('> Server is up and running on port : ' + port)
);

// Graceful shutdown handler
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close((err) => {
    if (err) {
      console.error('Error during server close:', err);
      process.exit(1);
    }

    // Close MongoDB connection
    const mongoose = require('mongoose');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      console.log('Process exiting cleanly.');
      process.exit(0);
    });
  });

  // Force kill if graceful shutdown takes too long (10 seconds)
  setTimeout(() => {
    console.error('Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM')); // sent by Docker, Kubernetes, hosting platforms
process.on('SIGINT', () => shutdown('SIGINT'));   // sent by Ctrl+C in terminal

// Handle uncaught errors so the process doesn't just die silently
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('unhandledRejection');
});
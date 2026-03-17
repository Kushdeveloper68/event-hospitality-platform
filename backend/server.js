require('dotenv').config({path:__dirname + "/.env"})
const express = require("express")
const app = express() 
const cors = require("cors")
const bodyPraser = require('body-parser')
const cookiesP = require('cookie-parser');
const path = require('path')
const port = process.env.PORT || 5000
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

// connect to MongoDB
connectToMongoDB(process.env.MONGO_URI)

// body parser
app.use(bodyPraser.json())
app.use(bodyPraser.urlencoded({ extended: true }))
app.use(cookiesP())

// cors setup
app.use(cors({
  origin: "http://localhost:5173", //  frontend URL
  credentials: true
}));


app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/guests', guestRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/checkin', checkInRoutes)
app.use('/api/transport', transportRoutes)
app.use('/api/team', teamMemberRoutes)
app.use('/api/services', serviceReqRoutes)
app.use('/api/overview', overViewRoutes)

app.listen(port, () =>
  console.log('> Server is up and running on port : ' + port)
)
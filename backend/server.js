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

app.listen(port, () =>
  console.log('> Server is up and running on port : ' + port)
)
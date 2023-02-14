// ---------------
// Based Veriables
// ---------------
const express = require('express');
const cors = require('cors');
const app = express();
// ---------------


// ---------------
// Routes
// ---------------
const userRouter = require('./routes/user.routes')
// ---------------


// ---------------
// Middleware
// ---------------
app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// ---------------


// ---------------
// Routes
// ---------------
app.use('/api/v1/users', userRouter)
// ---------------



// ---------------
// Export Module
// ---------------
module.exports = app;
// ---------------













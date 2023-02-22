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
// Gets version one of the api
const apiVersion_1 = require('./apis/v1/root.api');
// ---------------


// ---------------
// Middleware
// ---------------
app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/uploads")) // set static files to be served using this folder
// ---------------


// ---------------
// Routes
// ---------------
// tells the server to user "/api/v1" to prefix the api version_1 routes
app.use('/api/v1/', apiVersion_1)
// ---------------



// ---------------
// Export Module
// ---------------
module.exports = app;
// ---------------













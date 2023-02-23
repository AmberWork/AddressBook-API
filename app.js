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
const { JSONResponse } = require('./utilities/response.utility');
// ---------------


// ---------------
// Middleware
// ---------------
app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static("uploads")) // set static files to be served using this folder
// ---------------


// ---------------
// Routes
// ---------------
// tells the server to user "/api/v1" to prefix the api version_1 routes
app.use('/api/v1/', apiVersion_1);


// Global Error handler
app.use((error, req, res, next)=>{
    console.error(error.stack);
    JSONResponse.error(res, "There has been an issue with the Server", error, 500);
})
// ---------------



// ---------------
// Export Module
// ---------------
module.exports = app;
// ---------------













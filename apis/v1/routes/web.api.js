// ---------------
// Based Routes
// ---------------
const express = require("express");
const {
    getUserById,
    updateUser    
} = require("../controllers/user.controller");

const {
    createAddress,
    getAddressById,
    updateAddress,
    softDeleteAddress,
} = require("../controllers/addresses.controller");

// ---------------


// ---------------
// Based Variatbles
// ---------------
// const router = require("express").Router();
const router = express.Router();
// ---------------


// ---------------
// Based Routers
// ---------------
router.route('/users/:id').get(getUserById).put(updateUser);
router.route('/users/:id/addresses').get(getAddressById).post(createAddress).put(updateAddress).delete(softDeleteAddress);
// ---------------


module.exports = router;



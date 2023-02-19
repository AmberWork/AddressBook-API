// ---------------
// Based Routes
// ---------------
const express = require("express");
const {
    getUserById,
    updateUser,
    deleteUser,
    
    // Temporary routes - for testing (will be removed)
    getAllUsers,
    createUser,
    loginUser

} = require("../controllers/user.controller");

const {
    createAddress,
    getAddressById,
    updateAddress,
    softDeleteAddress,
    destroyAddress,
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
router.route('/users/:user_id').get(getUserById).put(updateUser).delete(deleteUser);
router.route('/users/:id/addresses').get(getAddressById).post(createAddress).put(updateAddress).delete(softDeleteAddress);
router.route('/addresses/:id/destroy').delete(destroyAddress);
// ---------------


// ---------------
// Temporary Routers - for testing (will be removed)
// ---------------
router.route('/users').get(getAllUsers).post(createUser);
router.route('/users/login').post(loginUser);
router.route('/users/:id');
// ---------------


module.exports = router;



// ---------------
// Based Routes
// ---------------
const express = require("express");
const {
    getUserById,
    updateUser,
    deleteUser,
} = require("../controllers/user.controller");

const {
    createAddress,
    getAddressById,
    getAllAddressByUserId,
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

router.route('/users/:user_id/addresses').get(getAllAddressByUserId).put(updateAddress);
router.route('/addresses/:id').get(getAddressById)
// ---------------



module.exports = router;

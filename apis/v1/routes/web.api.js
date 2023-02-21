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

router.route('/users/:user_id/addresses').get(getAllAddressByUserId).put(updateAddress).delete(softDeleteAddress);
router.route('/users/address').post(createAddress)
router.route('/addresses/:id').get(getAddressById)
router.route('/addresses/:id/destroy').delete(destroyAddress);
// ---------------



module.exports = router;

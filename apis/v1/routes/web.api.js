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
const Middleware = require("../middlewares/middleware");

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

router.route('/users/:user_id/addresses')
.all(Middleware.protectedViaRole(["ADMIN"]))
.get(getAllAddressByUserId)
.put(updateAddress)
.delete(softDeleteAddress);
router.route('/addresses/:id').get(getAddressById)
// ---------------



module.exports = router;

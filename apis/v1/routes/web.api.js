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
.all(new Middleware().protectedViaRole(["USER","ADMIN"]))
.get(getAllAddressByUserId)

.delete(softDeleteAddress);
// ---------------



module.exports = router;

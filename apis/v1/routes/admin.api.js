// ---------------
// Based Routes
// ---------------
const router = require("express").Router();

const {
    getAllUsers,
    createUser
} = require("../controllers/user.controller");
// ---------------


// ---------------
// Based Routers
// ---------------
router.route('/users').get(getAllUsers).post(createUser);
// ---------------



module.exports = router;
// ---------------
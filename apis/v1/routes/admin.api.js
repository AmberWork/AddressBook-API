// ---------------
// Based Routes
// ---------------
const router = require("express").Router();
<<<<<<< HEAD

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
=======
const UserController = require("../controllers/user.controller");
const Middleware = require("../middlewares/middleware");
router
    .route("/users")
    .all(Middleware.protectedViaRole(["ADMIN"]))
    .get(UserController.getAllUsers)
>>>>>>> af804bdf12a4082849187b73e46d47355ba18579



module.exports = router;
// ---------------
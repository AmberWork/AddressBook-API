// ---------------
// Based Routes
// ---------------
const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const Middleware = require("../middlewares/middleware");
router
    .route("/users")
    .all(Middleware.protectedViaRole(["ADMIN"]))
    .get(UserController.getAllUsers)

    
module.exports = router;
// ---------------
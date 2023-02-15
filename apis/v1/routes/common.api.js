const router = require("express").Router();
const UserController = require("../controllers/user.controller")

router
    .route("/login")
.post(UserController.loginUser)

router
    .route("/users")
    .post(UserController.createUser)
    



module.exports = router;
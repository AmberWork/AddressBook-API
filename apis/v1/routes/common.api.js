const router = require("express").Router();


router
    .route("/login")
// .post(UserController.loginUser) this is assuming that it is the name of the class and method.

router
    .route("/users")
    // .post(UserController.createUser) this is assuming that it is the name of the class and method.
    



module.exports = router;
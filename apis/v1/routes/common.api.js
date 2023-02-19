const router = require("express").Router();
const FileUploader = require("../../../utilities/file_upload.utility");
const UserController = require("../controllers/user.controller")
const Middleware = require("../middlewares/middleware")
router
    .route("/login")
    .post(UserController.loginUser)

router
    .route("/users")
    .post(FileUploader.uploadFile("Profile").single("profile_image"),UserController.createUser)

router
    .route("/users/:user_id")
    .all(Middleware.protectedViaRole(["ADMIN", "USER"]))
    .get(UserController.getUserById)
    .patch(UserController.updateUser)
    .delete(UserController.deleteUser)


router.route("/requestPasswordReset")
    .all(Middleware.protectedViaRole(["USER","ADMIN"]))
    .post(UserController.requestPasswordReset);

router.route("/resetPassword")
    .all(Middleware.protectedViaRole(["USER","ADMIN"]))
    .post(UserController.resetPassword);



module.exports = router;
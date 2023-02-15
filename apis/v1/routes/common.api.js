const router = require("express").Router();
const FileUploader = require("../../../utilities/file_upload.utility");
const UserController = require("../controllers/user.controller")

router
    .route("/login")
.post(UserController.loginUser)

router
    .route("/users")
    .post(FileUploader.uploadFile("Profile").single("profile_image"),UserController.createUser)
    



module.exports = router;
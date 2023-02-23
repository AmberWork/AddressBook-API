const router = require("express").Router();
const FileUploader = require("../../../utilities/file_upload.utility");
const UserController = require("../controllers/user.controller")
const Middleware = require("../middlewares/middleware")
const AddressController = require("../controllers/addresses.controller")
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
    

    // address
router
    .route('/users/address')
    .post(AddressController.createAddress)

router
    .route('/addresses')
    .get(AddressController.getAllParish)

router
    .route('/users/:user_id/addresses').delete(AddressController.softDeleteAddress);
router.route('/users/:user_id')
    .all(Middleware.protectedViaRole(["USER","ADMIN"]))
    .get(UserController.getUserById).put(UserController.updateUser)
    .delete(UserController.deleteUser);

router.route('/addresses/:id/destroy')
    .all(Middleware.protectedViaRole(["USER","ADMIN"]))
    .delete(AddressController.destroyAddress);

module.exports = router;
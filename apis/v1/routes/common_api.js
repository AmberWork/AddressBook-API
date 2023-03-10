const router = require("express").Router();
const FileUploader = require("../../../utilities/file_upload_utility");
const UserController = require("../controllers/user_controller")
const Middleware = require("../middlewares/middleware")
const AddressController = require("../controllers/addresses_controller");
const ParishController = require("../controllers/parish_controller")


router
    .route("/login")
    .post(UserController.loginUser)


// OTP Routes
router
    .route("/verifyOtp")
    .post(UserController.verifyOtp);


router
    .all(new Middleware().protectedViaRole(["USER", "ADMIN"]))
    .route("/getRoleAndStatus")
    .get(UserController.getRolesAndStatus);

router
    .route("/users")
    .post(FileUploader.uploadFile("Profile").single("profile_image"),UserController.createUser)

router
    .route("/users/:user_id")
    .all(new Middleware().protectedViaRole(["ADMIN", "USER"]))
    .get(UserController.getUserById)
    .patch(FileUploader.uploadFile("Profile").single("profile_image"),UserController.updateUser)
    .delete(UserController.deleteUser)


    // Password
router.route("/requestPasswordReset")
    .all(new Middleware().protectedViaRole(["USER","ADMIN"]))
    .post(UserController.requestPasswordReset);

router.route("/resetPassword")
    .patch(UserController.resetPassword);
    

    // address
router
    .route('/addresses')
    .all(new Middleware().protectedViaRole(["USER","ADMIN"]))
    .post(AddressController.createAddress)

    // Admins should also be able to go to this route
router
    .route('/addresses/:id')
    .all(new Middleware().protectedViaRole(["USER","ADMIN"]))
    .get(AddressController.getAddressById)
    .put(AddressController.updateAddress)
    .delete(AddressController.softDeleteAddress);


router.route('/addresses/:id/destroy')
    .all(new Middleware().protectedViaRole(["USER","ADMIN"]))
    .delete(AddressController.destroyAddress);

router.route("/parishes")
    .all(new Middleware().protectedViaRole(["USER", "ADMIN"]))
    .get(ParishController.getAllParish)
    .get(ParishController.getParishByName);


router.route("parishes/:id")
    .get(ParishController.getParishById)
 
module.exports = router;
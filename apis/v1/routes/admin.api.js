// ---------------
// Based Routes
// ---------------
const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const AddressController = require("../controllers/addresses.controller");
const Middleware = require("../middlewares/middleware");
router
    .route("/users")
    .all(Middleware.protectedViaRole(["ADMIN"]))
    .get(UserController.getAllUsers)


router
    .route("/addresses")
    .get(AddressController.getAllAddresses)


router
    .route("/parishes")
    .get(AddressController.getAllParish)
    .post(AddressController.createParish)
    

router
    .route("/parishes/:id")
    .get(AddressController.getAddressById)
    .put(AddressController.updateParish)
    // .delete(AddressController.deleteParish)

    
module.exports = router;
// ---------------
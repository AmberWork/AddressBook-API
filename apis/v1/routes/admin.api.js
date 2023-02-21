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
// ---------------


// ---------------
// Based Routers
// ---------------

    // Addresses routers
router
    .route("/addresses")
    .all(Middleware.protectedViaRole(["ADMIN"]))
    .get(AddressController.getAllAddresses)


    // Parishes routers
router
    .route("/parishes")
    .get(AddressController.getAllParish)
    .post(AddressController.createParish)
    

router
    .route("/parishes/:id")
    .get(AddressController.getParishById)
    .put(AddressController.updateParish)
    .delete(AddressController.deleteParish)
// ---------------
    
module.exports = router;
// ---------------
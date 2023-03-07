// ---------------
// Based Routes
// ---------------
const router = require("express").Router();
const UserController = require("../controllers/user_controller");
const AddressController = require("../controllers/addresses_controller");
const ParishController = require("../controllers/parish_controller");
const Middleware = require("../middlewares/middleware");
router
    .route("/users")
    .all(new Middleware().protectedViaRole(["ADMIN"]))
    .get(UserController.getAllUsers)

router
    .route("/users/export")
    .all(new Middleware().protectedViaRole(["ADMIN"]))
    .get(UserController.exportUserList)
// ---------------


// ---------------
// Based Routers
// ---------------

    // Addresses routers
router
    .route("/addresses")
    .all(new Middleware().protectedViaRole(["ADMIN"]))
    .get(AddressController.getAllAddresses)


    // Parishes routers
router
    .route("/parishes")
    .post(ParishController.createParish)
    

router
    .route("/parishes/:id")
    .put(ParishController.updateParish)
    .delete(ParishController.deleteParish)

// ---------------
    
module.exports = router;
// ---------------
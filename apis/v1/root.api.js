const router = require("express").Router();
const commonEndpoints = require("./routes/common_api")
const webEndpoints = require("./routes/web_api")
const adminEndpoints = require("./routes/admin_api")

router.use("/common", commonEndpoints);
router.use("/web", webEndpoints);
router.use("/admin", adminEndpoints);




module.exports = router;
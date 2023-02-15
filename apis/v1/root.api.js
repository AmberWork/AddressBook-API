const router = require("express").Router();
const commonEndpoints = require("./routes/common.api")
const webEndpoints = require("./routes/web.api")
const adminEndpoints = require("./routes/admin.api")

router.use("/common", commonEndpoints);
router.use("/web", webEndpoints);
router.use("/admin", adminEndpoints);




module.exports = router;
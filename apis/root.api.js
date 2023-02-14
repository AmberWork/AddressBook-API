const router = require("express").Router();
const commonEndpoints = require("../apis/routes/common.api")
const webEndpoints = require("../apis/routes/web.api")
const adminEndpoints = require("../apis/routes/admin.api")

router.use("/common", commonEndpoints);
router.use("/web", webEndpoints);
router.use("/admin", adminEndpoints);




module.exports = router;
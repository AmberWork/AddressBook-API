const router = require("express").Router();
const commonEndpoints = require("../apis/routes/common.api")

router.use("/common", commonEndpoints);




module.exports = router;
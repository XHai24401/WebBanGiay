var express = require("express");
const { render } = require("./productcontroller");
var router = express.Router();
router.use("/home", require(__dirname + "/homecontroller"));
router.use("/product", require(__dirname + "/productcontroller"));
router.use("/services", require(__dirname + "/servicescontroller"));
router.get("/", function(req, res) {  
    res.render("index");
});
module.exports = router;
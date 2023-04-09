var express = require("express");
var router = express.Router();
router.use("/home", require(__dirname + "/homeController"));
router.use("/user", require(__dirname + "/userController"));
router.use("/product", require(__dirname + "/productController"));
router.use("/cart", require(__dirname + "/cartController"));
router.use("/admin", require(__dirname + "/adminController"));
router.get("/", function(req,res){
    res.json({"message": "this is index page"});
});
module.exports = router;

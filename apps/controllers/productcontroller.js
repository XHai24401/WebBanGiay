var express = require("express");
var router = express();
var Product = require("./../model/product");
router.get("/", function (req, res) {
    res.json({
        "message": "this is product page"
    });
});
router.get("/getlist", function (req, res) {
    var userList = new Array();
    for (var i = 0; i < 20; i++) {
        var product = new Product();
        product.id = (i + 1);
        product.name = "name" + (i + 1);
        userList.push(product);
    }
    res.json(userList);
});
module.exports = router;
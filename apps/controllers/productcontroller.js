var express = require("express");
var router = express();
// var Product = require("../../model/product");
router.use("/", function(req, res) {  
    res.json({ "message": "this is product page" });

});
router.get("/get-product-list", function(req, res) {
    var productlist = new Array();
    for (var i = 0; i < 10; i++) {
        var product = new Product();
        product.id = (i + 1);
        productlist.push(us);
    }
    res.json(userList);
});
module.exports = router;
var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");
var DataService = require("./../services/dataService");

router.get("/", async function(req,res){
    var dataService = new DataService();
    var categories = await dataService.getCategoryList();
    var products = await dataService.getProductList();
    res.render("homeView/homePage", { req: req, categoryList : categories, productList: products});
});

router.get("/contact", function(req,res){
    res.render("contact");
});
router.get("/blog", function(req,res){
    res.render("blog");
});
module.exports = router;

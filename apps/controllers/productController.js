var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");
var DataService = require("./../services/dataService");

router.get("/", async function(req,res){
    var dataService = new DataService();  
    var categories =  req.session.categories
    
    if(req.query.category_id == ' ' || req.query.category_id == 0){
        var products = await dataService.getProductList();
        res.render("productView/productPage", { categoryList : categories, title_name: "All product", productList : products});
    }
    else{
        var productsByCategory = await dataService.getProductByCategory(req.query.category_id);
        res.json(productsByCategory);
        //res.render("productView/productPage", { categoryList : categories, title_name: "Products", productList : productsByCategory});
    }
});

router.post("/findProduct", async function(req,res){
    var dataService = new DataService();
    var categories =  req.session.categories
   
    var findProducts = await dataService.findProduct(req.body.product_name);
    var title_name = "Search results for: " + req.body.product_name;
    res.render("productView/productPage", { categoryList : categories, title_name, productList : findProducts});
});
module.exports = router;

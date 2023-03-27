var express = require("express");
const { ObjectId } = require("mongodb");
var router = express.Router();
var User = require("./../models/user");
var UserService = require("./../services/userService");
var config = require('../../config/setting.json');
var verifyToken = require("../util/VerifyToken");
//jwt
const jsonwebtoken = require("jsonwebtoken");
const jwtExpirySeconds = 300

router.get("/", function (req, res) {
    res.json({ "message": "this is user Page" });
});

router.post("/login", async function (req, res) {
    var userService = new UserService();
    var user = await userService.login(req.body.phone, req.body.password);
    var categories = req.session.categories
    var discountProducts = req.session.discountProducts
    if (user) {
        var token = jsonwebtoken.sign({ _id: user._id }, config.jwt.secret, { expiresIn: jwtExpirySeconds })
        res.cookie('token', token)
        res.render("homeView/homePage", { categoryList: categories, productList: discountProducts });
    }
    else {
        return res
            .status(401)
            .json({ message: "Tai khoản hoặc mật khẩu không chính xác" });
    }
});

router.post("/register", async function (req, res) {
    var userService = new UserService();
    var categories = req.session.categories
    var discountProducts = req.session.discountProducts
    var addUser = new User();
    addUser.phone = req.body.phone;
    addUser.password = req.body.password;
    addUser.full_name = req.body.full_name;
    addUser.email = req.body.email;
    addUser.address = req.body.address;
    var result = await userService.register(addUser);
    res.render("homeView/homePage", { categoryList: categories, productList: discountProducts });
});

// router.get("/product-list", async function(req,res){
//     var productService = new ProductService();
//     var product =  await productService.getProductList();
//     res.json(product);
// });
// router.get("/get-product", async function(req,res){
//     var productService = new ProductService();
//     var product =  await productService.getProduct(req.query.id);
//     res.json(product);
// });

// router.post("/insert-product", async function(req,res){
//     var productService = new ProductService();
//     var pro = new Product();
//     pro.Name = req.body.Name;
//     pro.Price = req.body.Price;
//     var result =  await productService.insertProduct(pro);
//     res.json({status: true, message:""});
// });

// router.post("/update-product", async function(req,res){
//     var productService = new ProductService();
//     var pro = new Product();
//     pro._id = new ObjectId(req.body.Id);
//     pro.Name = req.body.Name;
//     pro.Price = req.body.Price;
//     await  productService.updateProduct(pro);
//     res.json({status: true, message:""});
// });

// router.delete("/delete-product", async function(req,res){
//     var productService = new ProductService();
//     await  productService.deleteProduct(req.query.id);
//     res.json({status: true, message:""});
// });
module.exports = router;

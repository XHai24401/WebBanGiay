var express = require("express");
const { ObjectId } = require("mongodb");
var router = express.Router();
//models
var Product = require("../models/product");
var Category = require("../models/category");
//services
var DataService = require("../services/dataService");
var AdminService = require("../services/adminService");
//jwt
var config = require('../../config/setting.json');
const jsonwebtoken = require("jsonwebtoken");
const jwtExpirySeconds = 300
//verify token
var verifyToken = require("../util/verifyTokenAdmin");

//LOGIN
router.get("/login", async function (req, res) {
    res.render("adminView/login");
});
router.post("/login", async function (req, res) {
    var adminService = new AdminService();
    var admin = await adminService.login(req.body.email, req.body.password);
    if (admin) {
        var token = jsonwebtoken.sign({ _id: admin._id }, config.jwt.secret, { expiresIn: jwtExpirySeconds })
        res.cookie('adminToken', token)
        res.cookie('adminName', admin.full_name)
        res.redirect("/admin/productManage");
    }
    else {
        return res
            .status(401)
            .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    }
});
//FOOD MANAGE
//index
router.get("/productManage", verifyToken, async function (req, res) {
    var dataService = new DataService();
    var data = await dataService.getProductList();
    res.render("adminView/product/index", {data: data});
});
//create
router.get("/createProduct", verifyToken, async function (req, res) {
    var dataService = new DataService();
    var categories = await dataService.getCategoryList();
    res.render("adminView/product/create", { categories: categories});
});
router.post("/createProduct", verifyToken, async function (req, res) {
    var dataService = new DataService();
    var createProduct = new Product();
    createProduct._id = new ObjectId(req.body.id);
    createProduct.name = req.body.name;
    createProduct.image = req.body.image;
    createProduct.price = parseInt(req.body.price);
    createProduct.category_id = new ObjectId(req.body.category_id);
    await dataService.createProduct(createProduct);
    res.redirect("/admin/productManage");
});
//edit
router.get("/editProduct/:id", verifyToken, async function (req, res) {
    var dataService = new DataService();
    var data = await dataService.getProductById(req.params.id);
    var categories = await dataService.getCategoryList();
    res.render("adminView/product/edit", {data: data, categories: categories});
});
router.post("/editProduct", verifyToken, async function (req, res) {
    var dataService = new DataService();
    var updateProduct = new Product();
    updateProduct._id = new ObjectId(req.body.id);
    updateProduct.name = req.body.name;
    updateProduct.image = req.body.image;
    updateProduct.price = parseInt(req.body.price);
    updateProduct.category_id = new ObjectId(req.body.category_id);
    await dataService.updateProduct(updateProduct);
    res.redirect("/admin/productManage");
});
//delete
router.post("/deleteProduct/:id", verifyToken, async function(req,res){
    var dataService = new DataService();
    await dataService.deleteProduct(req.params.id);
    res.redirect("/admin/productManage");
});

//test
router.get("/cate", async function (req, res) {
    var dataService = new DataService();
    var categories = await dataService.getCategoryList();
    res.json(categories);
});
module.exports = router;
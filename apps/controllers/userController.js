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
    res.render("userView/login");
});

router.post("/login", async function (req, res) {
    var userService = new UserService();
    var user = await userService.login(req.body.email, req.body.password);
    var categories = req.session.categories;
    var products = req.session.products;
    if (user) {    
        var token = jsonwebtoken.sign({ _id: user._id }, config.jwt.secret, { expiresIn: jwtExpirySeconds })
        res.cookie('token', token)
    
        res.render("homeView/homePage", { categoryList : categories,productList: products});
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
    var products = req.session.products;
    var addUser = new User();
    addUser.phone = req.body.phone;
    addUser.password = req.body.password;
    addUser.full_name = req.body.full_name;
    addUser.email = req.body.email;
    addUser.address = req.body.address;
    var result = await userService.register(addUser);
    res.render("homeView/homePage", { categoryList: categories,productList: products});
});
module.exports = router;

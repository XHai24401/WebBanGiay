var express = require("express");
const { ObjectId } = require("mongodb");
var router = express.Router();
var User = require("./../models/user");
var UserService = require("./../services/userService");
var config = require('../../config/setting.json');
var verifyToken = require("../util/VerifyToken");
var DataService = require("./../services/dataService");
//jwt
const jsonwebtoken = require("jsonwebtoken");
const jwtExpirySeconds = 300

router.get("/", function (req, res) {
    res.render("userView/login");
});

router.get("/logout", function (req, res) {
    res.clearCookie('userToken');
    res.clearCookie('userName');
    res.redirect("/home", {req : req});
});

router.post("/login", async function (req, res) {
    var userService = new UserService();
    var user = await userService.login(req.body.email, req.body.password);
    if (user) {
        var token = jsonwebtoken.sign({ _id: user._id }, config.jwt.secret, { expiresIn: jwtExpirySeconds })
        res.cookie('userToken', token)
        res.cookie('userName', user.full_name)
        var dataService = new DataService();
        var categories = await dataService.getCategoryList();
        var products = await dataService.getProductList();
        res.render("homeView/homePage", { req: req, categoryList : categories, productList: products});
    }
    else {
        return res
            .status(401)
            .json({ message: "Tai khoản hoặc mật khẩu không chính xác" });
    }
});

router.post("/register", async function (req, res) {
    var userService = new UserService();
    var addUser = new User();
    addUser.phone = req.body.phone;
    addUser.password = req.body.password;
    addUser.full_name = req.body.full_name;
    addUser.email = req.body.email;
    addUser.address = req.body.address;
    var result = await userService.register(addUser);
    res.redirect("/home", {req : req});
});
module.exports = router;

router.get("/inf", function (req, res) {
    var userService = new UserService();

    res.render('userView/information');
});

router.post("/updateInf", function (req, res) {
    var userService = new UserService();

    res.render('userView/information');
});

// const mailer = require('./../services/mailer');

// router.post("/login", async function (req, res) {
//     var userService = new UserService();
//     var user = await userService.login(req.body.phone, req.body.password);
//     res.render("userView/information",{user : user});
// });

// router.post("/updateInf/:id", async function(req,res){
//     var userService = new UserService();
//     var user = new User();
//     user._id = new ObjectId(req.params.id);
//     user.phone = req.body.phone;
//     user.full_name = req.body.full_name;
//     user.email = req.body.email;
//     user.address = req.body.address;
//     await  userService.updateInf(user);
//     res.render("userView/information",{user : user});
// });
// function generateNewPassword() {
//     const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     let password = "";
//     for (let i = 0; i < 8; i++) {
//       password += chars[Math.floor(Math.random() * chars.length)];
//     }
//     return password;
//   }
// router.post("/forgot-password", async (req, res) => {
//     var email = req.body.email;
//     var userService = new UserService();
//     var user = await userService.findByEmail(email);
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     // tạo pass mới
//     var newPassword = generateNewPassword();
//     // cập nhật lại pass mới cho người dùng trong db
//     await userService.updatePassword(user._id, newPassword)  
//     // gửi pass mới tới mail người dùng
//     let mailOptions = {
//         from: 'bishamond1108@gmail.com',
//         to: 'tcminh1108@gmail.com',
//         subject: 'New password for your account',
//         text: `Your new password is: ${newPassword}`
//     }; 
//     mailer.sendEmail(mailOptions);
//     res.status(200).json({ message: "New password sent to your email" });
//   });







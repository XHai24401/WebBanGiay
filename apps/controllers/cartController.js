var express = require("express");
const { ObjectId } = require("mongodb");
var router = express.Router();
var DataService = require("./../services/dataService");
var UserService = require("./../services/userService");
var CartService = require("./../services/cartService");
var config = require('../../config/setting.json');
var verifyToken = require("../util/VerifyToken");
var Cart = require('./../models/cart'); 
var CartDetail = require('./../models/cart_detail'); 
var moment = require('moment');

//jwt
const jsonwebtoken = require("jsonwebtoken");
const jwtExpirySeconds = 300
var cart = []
router.get("/", function(req,res){
    if(!cart){
        res.send('Giỏ hàng rỗng!');
    }
    else{
        const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        res.render('cartView/cartPage', {cart: cart, total: total});
    }
});
router.get("/addToCart/:productId", async function(req,res){
    var dataService = new DataService();
    var productId = req.params.productId;
    var product = await dataService.getProductById(productId);
    if(!cart){
        cart = [];
    }   
    var kiemtra = cart.find(c => c.product._id == productId);
    if(kiemtra){
        kiemtra.quantity++;
    }
    else{
        cart.push({product, quantity : 1});
    }
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    res.render('cartView/cartPage', {cart: cart, total: total});
});

router.get("/checkout", verifyToken, async function(req,res){
    if(!cart){
        res.send('Giỏ hàng rỗng!');
    }
    else{
        var userId = req.userId;
        var userService = new UserService();
        var userData = await userService.getUser(userId);
        const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        res.render('cartView/checkout', {userData: userData, cart: cart, total: total});
    }    
});

router.post("/order", verifyToken, async function(req,res){
        var cartService = new CartService();
        var addCart = new Cart(); 
        addCart.user_id = req.userId;
        addCart.total_price = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        addCart.order_date = moment().format('YYYY-MM-DD');
        addCart.notes = req.query.notes;
        addCart.status = "Đang xử lý";
        var result_cart =  await cartService.insertCart(addCart);
        var getCart = await cartService.getCartId();
        for( i = 0; i < cart.length; i++){
            var addCartDetail = new CartDetail();
            addCartDetail.cart_id = getCart._id;
            addCartDetail.product_id = cart[i].product._id;
            addCartDetail.quantity = cart[i].quantity;
            var result_cartdetail =  await cartService.insertCartDetail(addCartDetail);
        }
        cart = [];
        res.json({"message": "oke"});   
});
module.exports = router;

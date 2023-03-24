var express = require("express");
var bodyParser = require("body-parser");

var app = express();
//session
var session = require('express-session');
app.use(session({
   secret: 'mysecretkey',
   resave: false,
   saveUninitialized: true
 }));
//cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
var controller = require(__dirname + "/apps/controllers");
app.use(controller);
//trỏ tới views lấy các file .ejs
app.set("views",__dirname + "/apps/views");
app.set("view engine", "ejs");
//trỏ tới public lấy css
app.use("/public", express.static(__dirname + "/public"));
//sử dụng express json để post dữ liệu dưới dạng json

// var moment = require('moment');
// app.use((req, res, next) => {
//   req.moment = moment;
//   next();
// });
var server = app.listen(3000, function(){
   console.log("server is running");
});

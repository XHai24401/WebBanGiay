const { ObjectId } = require('mongodb');
var config = require("../../config/setting.json");
class CartService{
    databaseConnection = require('../database/database');
    cart = require('../models/cart');
    cart_detail = require('../models/cart_detail');

    client;
    database;
    cartCollection;
    cart_detailCollection;
    constructor(){
        this.client = this.databaseConnection.getMongoClient();
        this.database =  this.client.db(config.mongodb.database);
        this.cartCollection = this.database.collection("cart");
        this.cart_detailCollection = this.database.collection("cart_detail");
    }
    async insertCart(cart){
        return await this.cartCollection.insertOne(cart);
    }
    async insertCartDetail(cart_detail){
        return await this.cart_detailCollection.insertOne(cart_detail);
    }
    async getCartId(){
        return await this.cartCollection.findOne({}, { sort: { _id: -1 } });
    }

    
}
module.exports = CartService;

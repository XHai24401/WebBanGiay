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
    async deleteCart(id){
        return await this.cart_detailCollection.deleteOne({"_id": new ObjectId(id) });
    }
    async getCartId(){
        return await this.cartCollection.findOne({}, { sort: { _id: -1 } });
    }
    async getCartList() {
        const cursor = await this.cartCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
    async getCartDetailList(cart_id) {
        const cursor = await this.cart_detailCollection.find({"cart_id": new ObjectId(cart_id)}).skip(0).limit(100);
        return await cursor.toArray();
    }

    
}
module.exports = CartService;

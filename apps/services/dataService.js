const { ObjectId } = require('mongodb');
var config = require("../../config/setting.json");
class DataService{
    databaseConnection = require('../database/database');
    category = require('../models/category');

    client;
    database;
    categoriesCollection;
    productsCollection;
    constructor(){
        this.client = this.databaseConnection.getMongoClient();
        this.database =  this.client.db(config.mongodb.database);
        this.categoriesCollection = this.database.collection("category");
        this.productsCollection = this.database.collection("product");
    }
    
    async getProductById(product_id) {
        return await this.productsCollection.findOne({"_id": new ObjectId(product_id)},{});
    }
    
    async getCategoryList() {
        const cursor = await this.categoriesCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
   
    async getCategoryById(category_id) {
        return await this.categoriesCollection.findOne({"_id": (category_id)},{});
    }
   
    async getProductList() {
        const cursor = await this.productsCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
   
    async getProductByCategory(category_id) {
        const cursor = await this.productsCollection.find({"category_id": category_id}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
   
    async findProduct(product_name) {
        const cursor = await this.productsCollection.find({ name: { $regex: product_name, $options: "i" } }, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
}
module.exports = DataService;

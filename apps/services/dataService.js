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
    //lấy món ăn theo id
    async getProductById(product_id) {
        return await this.productsCollection.findOne({"_id": new ObjectId(product_id)},{});
    }
    //lấy danh sách loại món ăn
    async getCategoryList() {
        const cursor = await this.categoriesCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
    //lấy loại món ăn theo id
    async getCategoryById(category_id) {
        return await this.categoriesCollection.findOne({"_id": new ObjectId(category_id)},{});
    }
    //lấy danh sách món ăn
    async getProductList() {
        const cursor = await this.productsCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
    //lấy danh sách món ăn đang giảm giá
    // async getDiscountProductList() {
    //     const cursor = await this.productsCollection.find({"discount": {$gt: 0}}, {}).skip(0).limit(100);
    //     return await cursor.toArray();
    // }
    //lấy danh sách món ăn theo loại
    async getProductByCategory(category_id) {
        const cursor = await this.productsCollection.find({"category_id": category_id}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
    //tìm kiếm món ăn
    async findProduct(product_name) {
        const cursor = await this.productsCollection.find({ name: { $regex: product_name, $options: "i" } }, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
}
module.exports = DataService;

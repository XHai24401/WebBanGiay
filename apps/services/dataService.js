const { ObjectId } = require('mongodb');
var config = require("../../config/setting.json");
class DataService{
    databaseConnection = require('../database/database');
    product = require('./../models/product');
    category = require('../models/category');
    client;
    database;
    categoryCollection;
    productCollection;
    constructor(){
        this.client = this.databaseConnection.getMongoClient();
        this.database =  this.client.db(config.mongodb.database);
        this.categoryCollection = this.database.collection("category");
        this.productCollection = this.database.collection("product");
    }
    // Product
    // async getProductList() {
    //     return await this.productCollection.aggregate([
    //         {
    //             $addFields: {
    //                 category_id_str: { $toString: "$category_id" }
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "categories",
    //                 localField: "category_id",
    //                 foreignField: "_id",
    //                 as: "category"
    //             }
    //         },
    //         {
    //             $unwind: "$category"
    //         },
    //         {
    //             $project: {
    //                 _id: 1,
    //                 name: 1,
    //                 image: 1,
    //                 category_id: 1,
    //                 category_name: "$category.name",
    //                 price: 1,
                   
    //             }
    //         }
    //     ]).toArray();
    // }
    
    async getProductList() {
        const cursor = await this.productCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
    async getProductById(product_id) {
        return await this.productCollection.findOne({"_id": new ObjectId(product_id)},{});
    }
    async findProduct(product_name) {
        const cursor = await this.productCollection.find({ name: { $regex: product_name, $options: "i" } }, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
    async createProduct(product){
        return await this.productCollection.insertOne(product);
    }
    async updateProduct(product){
        return await this.productCollection.updateOne({"_id": new ObjectId(product._id)},{$set: product});
    }
    async deleteProduct(id){
        return await this.productCollection.deleteOne({"_id": new ObjectId(id) });
    }
    async getProductByCategory(category_id) {
        const cursor = await this.productCollection.find({"category_id": new ObjectId(category_id)}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }

    //Category
    async getCategoryList() {
        const cursor = await this.categoryCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
    async getCategoryById(category_id) {
        return await this.categoryCollection.findOne({"_id": new ObjectId(category_id)});
    }
    async insertCategory(category){
        return await this.categoryCollection.insertOne(category);
    }
    async updateCategory(category){
        return await this.categoryCollection.updateOne({"_id": new ObjectId(category._id)},{$set: category});
    }
    async deleteCategory(id){
        return await this.categoryCollection.deleteOne({"_id": new ObjectId(id) });
    }
}
module.exports = DataService;

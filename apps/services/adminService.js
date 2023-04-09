const { ObjectId } = require('mongodb');
var config = require("./../../config/setting.json");
class AdminService{
    databaseConnection = require('./../database/database');
    client;
    database;
    adminCollection;
    constructor(){
        this.client = this.databaseConnection.getMongoClient();
        this.database =  this.client.db(config.mongodb.database);
        this.adminCollection = this.database.collection("admin");
    }
    async login(email, password){
        return await this.adminCollection.findOne({"email": email, "password": password});
    }
}
module.exports = AdminService;
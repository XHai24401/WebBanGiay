const { ObjectId } = require('mongodb');
var config = require("./../../config/setting.json");
class UserService{
    databaseConnection = require('./../database/database');
    user = require('./../models/user');

    client;
    userDatabase;
    userCollection;
    constructor(){
        this.client = this.databaseConnection.getMongoClient();
        this.userDatabase =  this.client.db(config.mongodb.database);
        this.userCollection = this.userDatabase.collection("user");
    }
    async login(email, password){
        return await this.userCollection.findOne({"email": email, "password": password});
    }
    async register(user){
        return await this.userCollection.insertOne(user);
    }
    
    async getUser(id){
        return await this.userCollection.findOne({"_id": new ObjectId(id) },{});
    }
    async getUserList() {
        const cursor = await this.userCollection.find({}, {}).skip(0).limit(100);
        return await cursor.toArray();
    }
    async updateInf(user){
        return await this.userCollection.updateOne({"_id": new ObjectId(user._id) }, {$set: user});
    }
    async findByEmail(email){
        return await this.userCollection.findOne({"email": email});
    }
    
    async updatePassword(id, new_password){
        return await this.userCollection.updateOne({"_id": new ObjectId(user._id) }, {$set: {password: new_password}});
    }
  
}
module.exports = UserService;

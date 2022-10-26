const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Users extends MongoDB {

    constructor() {
        super();
    }

    /** READ - CLIENT EXIST */
    async getUser(email) {
        return this.connect().then((db) => {
            return db.collection('Users').findOne({ email: email });
        });
    }

    /** READ - PROFILE */
    async getProfile(userID) {
        return this.connect().then((db) => {
            return db.collection('Users').findOne({ _id: ObjectId(userID) });
        });
    }

    /** C - CREATE */
    async createUser(data) {
        return this.connect().then((db) => {
            return db.collection('Users').insertOne(data);
        });
    }

    /** R - ALL */
    async getAllClients() {
        return this.connect().then((db) => {
            return db.collection('Users').find().toArray();
        });
    }
}

module.exports = Users;
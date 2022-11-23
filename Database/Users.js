const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Users extends MongoDB {

    constructor() {
        super();
    }

    /** READ - CLIENT EXIST */
    async getUser(email) {
        return this.connect().then((db) => {
            try {
                return db.collection('Users').findOne({ email: email });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - CLIENT */
    async getUserId(Id) {
        return this.connect().then((db) => {
            try {
                return db.collection('Users').findOne({ _id: ObjectId(Id) });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - PROFILE */
    async getProfile(userID) {
        return this.connect().then((db) => {
            try {
                return db.collection('Users').findOne({ _id: ObjectId(userID) });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** C - CREATE */
    async createUser(data) {
        return this.connect().then((db) => {
            try {
                return db.collection('Users').insertOne(data);
            } catch (err) {
                return undefined;
            }
        });
    }

    /** R - ALL */
    async getAllClients() {
        return this.connect().then((db) => {
            try {
                return db.collection('Users').find().toArray();
            } catch (err) {
                return undefined;
            }
        });
    }
}

module.exports = Users;
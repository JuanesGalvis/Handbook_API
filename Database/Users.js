const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Users extends MongoDB {

    constructor() {
        super();
    }

    /** R - ALL */
    async getAllClients() {
    return this.connect().then((db) => {
        return db.collection('Users').find().toArray();
    });
    }

}

module.exports = Users;
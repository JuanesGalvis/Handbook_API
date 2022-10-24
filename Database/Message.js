const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Message extends MongoDB {

    constructor() {
        super();
    }
}

module.exports = Message;
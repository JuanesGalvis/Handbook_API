const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Exchange extends MongoDB {

    constructor() {
        super();
    }
}

module.exports = Exchange;
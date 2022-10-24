const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Communities extends MongoDB {

    constructor() {
        super();
    }
}

module.exports = Communities;
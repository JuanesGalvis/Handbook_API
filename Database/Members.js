const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Members extends MongoDB {

    constructor() {
        super();
    }
}

module.exports = Members;
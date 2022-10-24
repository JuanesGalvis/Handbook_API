const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Events extends MongoDB {

    constructor() {
        super();
    }
}

module.exports = Events;
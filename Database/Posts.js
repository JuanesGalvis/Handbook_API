const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Posts extends MongoDB {

    constructor() {
        super();
    }
}

module.exports = Posts;
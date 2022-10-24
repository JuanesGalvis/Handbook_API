const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class SelectedBook extends MongoDB {

    constructor() {
        super();
    }
}

module.exports = SelectedBook;
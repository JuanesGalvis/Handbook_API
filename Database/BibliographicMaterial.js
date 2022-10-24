const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class BibliographicMaterial extends MongoDB {

    constructor() {
        super();
    }
}

module.exports = BibliographicMaterial;
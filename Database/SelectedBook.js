const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class SelectedBook extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createSelectedBook(IdOwner) {
        let newSelectedBookFormat = {
            Id_Books: [],
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('MB_Selections').insertOne(newSelectedBookFormat);
        });
    }

    /** READ - ALLBOOKSLIKE */
    async getAllBooksLike(IdOwner) {
        return this.connect().then((db) => {
            try {
                let pipeline = [
                    {
                        '$lookup': {
                            'from': 'BibliographicMaterials',
                            'localField': 'Id_Books',
                            'foreignField': '_id',
                            'as': 'Id_Books'
                        }
                    }, {
                        '$match': {
                            'Id_Owner': new ObjectId(IdOwner)
                        }
                    }, {
                        '$project': {
                            'Id_Books': 1
                        }
                    }
                ]

                return db.collection('MB_Selections').aggregate(pipeline).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - MATCH */
    async getBooksMatch(IdOwnerBook) {
        return this.connect().then((db) => {
            try {
                return db.collection('MB_Selections').find({ Id_Owner: ObjectId(IdOwnerBook) }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** POST - ADD BOOK */
    async addSelectedBook(IdBook, IdOwner) {
        return this.connect().then((db) => {
            return db.collection('MB_Selections').updateOne({ Id_Owner: ObjectId(IdOwner) }, { $push: { Id_Books: ObjectId(IdBook) } });
        });
    }

    /** DELETE - REMOVE BOOK */
    async removeSelectedBook(IdBook) {
        return this.connect().then((db) => {
            return db.collection('MB_Selections').updateMany({ Id_Books: ObjectId(IdBook) }, { $pull: { Id_Books: ObjectId(IdBook) } });
        });
    }
}

module.exports = SelectedBook;
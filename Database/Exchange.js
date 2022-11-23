const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Exchange extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createExchange(IdOwner1, IdOwner2, Book1, Book2) {
        let newExchangeFormat = {
            Id_User_One: ObjectId(IdOwner1),
            Id_User_Two: ObjectId(IdOwner2),
            Id_Book_One: ObjectId(Book1),
            Id_Book_Two: ObjectId(Book2),
            state: 'Pendiente',
            date: '',
            reviewOne: 0,
            reviewTwo: 0
        }

        return this.connect().then((db) => {
            try {
                return db.collection('Exchange').insertOne(newExchangeFormat);
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL - IDOWNER */
    async getExchangeOwner(IdOwner) {
        return this.connect().then((db) => {
            try {
                let pipeline = [
                    {
                        '$match': {
                            '$or': [
                                {
                                    'Id_User_One': new ObjectId(IdOwner)
                                }, {
                                    'Id_User_Two': new ObjectId(IdOwner)
                                }
                            ]
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'Id_User_One',
                            'foreignField': '_id',
                            'as': 'Id_User_One'
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'Id_User_Two',
                            'foreignField': '_id',
                            'as': 'Id_User_Two'
                        }
                    }, {
                        '$lookup': {
                            'from': 'BibliographicMaterials',
                            'localField': 'Id_Book_One',
                            'foreignField': '_id',
                            'as': 'Id_Book_One'
                        }
                    }, {
                        '$lookup': {
                            'from': 'BibliographicMaterials',
                            'localField': 'Id_Book_Two',
                            'foreignField': '_id',
                            'as': 'Id_Book_Two'
                        }
                    }
                ]
                return db.collection('Exchange').aggregate(pipeline).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL - BOOK */
    async getExchangeBook(BookId) {
        return this.connect().then((db) => {
            try {
                let pipeline = [
                    {
                        '$match': {
                            '$or': [
                                {
                                    'Id_Book_One': new ObjectId(BookId)
                                }, {
                                    'Id_Book_Two': new ObjectId(BookId)
                                }
                            ]
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'Id_User_One',
                            'foreignField': '_id',
                            'as': 'Id_User_One'
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'Id_User_Two',
                            'foreignField': '_id',
                            'as': 'Id_User_Two'
                        }
                    }, {
                        '$lookup': {
                            'from': 'BibliographicMaterials',
                            'localField': 'Id_Book_One',
                            'foreignField': '_id',
                            'as': 'Id_Book_One'
                        }
                    }, {
                        '$lookup': {
                            'from': 'BibliographicMaterials',
                            'localField': 'Id_Book_Two',
                            'foreignField': '_id',
                            'as': 'Id_Book_Two'
                        }
                    }
                ]
                return db.collection('Exchange').aggregate(pipeline).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL - IDOWNER - EXCHANGE */
    async getExchangeOwnerCorrect(IdOwner) {
        return this.connect().then((db) => {
            try {
                return db.collection('Exchange').find({ $or: [{ "Id_User_One": ObjectId(IdOwner) }, { "Id_User_Two": ObjectId(IdOwner) }], "state": "Intercambio Realizado" }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ONE */
    async getExchange(Id) {
        return this.connect().then((db) => {
            try {
                let pipeline = [
                    {
                        '$match': {
                            '_id': new ObjectId(Id)
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'Id_User_One',
                            'foreignField': '_id',
                            'as': 'Id_User_One'
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'Id_User_Two',
                            'foreignField': '_id',
                            'as': 'Id_User_Two'
                        }
                    }, {
                        '$lookup': {
                            'from': 'BibliographicMaterials',
                            'localField': 'Id_Book_One',
                            'foreignField': '_id',
                            'as': 'Id_Book_One'
                        }
                    }, {
                        '$lookup': {
                            'from': 'BibliographicMaterials',
                            'localField': 'Id_Book_Two',
                            'foreignField': '_id',
                            'as': 'Id_Book_Two'
                        }
                    }
                ]
                return db.collection('Exchange').aggregate(pipeline).toArray();
            } catch (error) {
                return undefined;
            }
        });
    }

    /** UPDATE */
    async updateExchange(Id, data) {
        let ExchangeFormat = {
            ...data
        }

        return this.connect().then((db) => {
            try {
                return db.collection('Exchange').updateOne({ _id: ObjectId(Id) }, { $set: { ...ExchangeFormat } });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** DELETE */
    async deleteExchange(Id) {
        return this.connect().then((db) => {
            try {
                return db.collection('Exchange').deleteOne({ _id: ObjectId(Id) });
            } catch (err) {
                return undefined;
            }
        });
    }

}

module.exports = Exchange;
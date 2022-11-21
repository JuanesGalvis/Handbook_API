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
            reviewOne: '',
            reviewTwo: ''
        }

        return this.connect().then((db) => {
            return db.collection('Exchange').insertOne(newExchangeFormat);
        });
    }

    /** READ - ALL - IDOWNER */
    async getExchangeOwner(IdOwner) {
        return this.connect().then((db) => {
            try {
                return db.collection('Exchange').find({ $or: [{ "Id_User_One": ObjectId(IdOwner) }, { "Id_User_Two": ObjectId(IdOwner) }] }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL - BOOK */
    async getExchangeBook(BookId) {
        return this.connect().then((db) => {
            return db.collection('Exchange').find({ $or: [{ "Id_Book_One": ObjectId(BookId) }, { "Id_Book_Two": ObjectId(BookId) }] }).toArray();
        });
    }

    /** READ - ONE */
    async getExchange(Id) {
        return this.connect().then((db) => {
            return db.collection('Exchange').findOne({ _id: ObjectId(Id) });
        });
    }

    /** UPDATE */
    async updateExchange(Id, data) {
        let ExchangeFormat = {
            ...data
        }

        return this.connect().then((db) => {
            return db.collection('Exchange').updateOne({ _id: ObjectId(Id) }, { $set: { ...ExchangeFormat } });
        });
    }

    /** DELETE */
    async deleteExchange(Id) {
        return this.connect().then((db) => {
            return db.collection('Exchange').deleteOne({ _id: ObjectId(Id) });
        });
    }

}

module.exports = Exchange;
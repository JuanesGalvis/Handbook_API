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
}

module.exports = Exchange;
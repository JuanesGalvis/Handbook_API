const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Message extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createMessage(data, id_user_origin, id_user_destiny) {

        let FormatData = {
            ...data,
            id_user_origin: ObjectId(id_user_origin),
            id_user_destiny: ObjectId(id_user_destiny)
        }

        return this.connect().then((db) => {
            return db.collection('Messages').insertOne(FormatData);
        });
    }

}

module.exports = Message;
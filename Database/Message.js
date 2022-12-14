const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Message extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createMessage(exchangeId, data, id_user_origin, id_user_destiny) {

        let FormatData = {
            content: data,
            date: new Date(),
            id_user_origin: ObjectId(id_user_origin),
            id_user_destiny: ObjectId(id_user_destiny),
            id_exchange: ObjectId(exchangeId)
        }

        return this.connect().then((db) => {
            try {
                return db.collection('Messages').insertOne(FormatData);
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ MESSAGES */
    async readMessages(exchangeId) {
        return this.connect().then((db) => {
            try {
                let pipeline = [
                    {
                        '$match': {
                            'id_exchange': new ObjectId(exchangeId)
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'id_user_origin',
                            'foreignField': '_id',
                            'as': 'id_user_origin'
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'id_user_destiny',
                            'foreignField': '_id',
                            'as': 'id_user_destiny'
                        }
                    }
                ]
                return db.collection('Messages').aggregate(pipeline).toArray();
            } catch (error) {
                return undefined;
            }
        });
    }

    /** DELETE MESSAGES - IDEXCHANGE */
    async deleteMessages(IdExchange) {
        return this.connect().then((db) => {
            try {
                return db.collection('Messages').deleteMany({ id_exchange: ObjectId(IdExchange) });
            } catch (err) {
                return undefined;
            }
        });
    }
}

module.exports = Message;
const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Events extends MongoDB {

    constructor() {
        super();
    }

    createEvent(data, IdOwner) {

        /**
            participants: participants.map((participant) => {
                return ObjectId(participant)
            })
         */

        let FormatData = {
            ...data,
            id_owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('Events').insertOne(FormatData);
        });
    }

    getOneEvent(eventId) {
        return this.connect().then((db) => {
            return db.collection('Events').findOne({ _id: ObjectId(eventId) });
        });
    }

    getMyEvents(userId) {
        return this.connect().then((db) => {
            return db.collection('Events').find({ id_owner: ObjectId(userId) }).toArray();
        });
    }

    updateEvent(eventID, editedData, userID) {

        let FormatData = {
            ...editedData,
            id_owner: ObjectId(userID)
        }

        return this.connect().then((db) => {
            return db.collection('Events').updateOne(
                { _id: ObjectId(eventID), id_owner: ObjectId(userID) },
                { $set: { ...FormatData } }
            );
        });
    }

    deleteEvent(eventID, userID) {
        return this.connect().then((db) => {
            return db.collection('Events').deleteOne({ _id: ObjectId(eventID), id_owner: ObjectId(userID) });
        });
    }

}

module.exports = Events;
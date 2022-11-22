const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Events extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createEvent(data, IdOwner) {

        let FormatData = {
            ...data,
            id_owner: ObjectId(IdOwner),
            participants: []
        }

        return this.connect().then((db) => {
            try {
                return db.collection('Events').insertOne(FormatData);
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ONE EVENT */
    async getOneEvent(eventId) {
        return this.connect().then((db) => {
            try {
                return db.collection('Events').findOne({ _id: ObjectId(eventId) });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - MY EVENTS */
    async getMyEvents(userId) {
        return this.connect().then((db) => {
            try {
                return db.collection('Events').find({ id_owner: ObjectId(userId) }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - EVENT PARTICIPATED */
    async getEventsParticipate(userId) {
        return this.connect().then((db) => {
            try {
                return db.collection('Events').find({ participants: ObjectId(userId) }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** UPDATE */
    async updateEvent(eventID, editedData, userID) {
        try {
            let DataOriginal = await this.getOneEvent(eventID);

            let FormatData = {
                name: editedData.name ? editedData.name : DataOriginal.name,
                description: editedData.description ? editedData.description : DataOriginal.description,
                date: editedData.date ? editedData.date : DataOriginal.date,
                location: editedData.location ? editedData.location : DataOriginal.location,
                icon: editedData.icon ? editedData.icon : DataOriginal.icon,
                id_owner: DataOriginal.id_owner,
                participants: DataOriginal.participants.length == 0 ? [] : DataOriginal.participants
            }

            return this.connect().then((db) => {
                try {
                    return db.collection('Events').updateOne(
                        { _id: ObjectId(eventID), id_owner: ObjectId(userID) },
                        { $set: { ...FormatData } }
                    );
                } catch (err) {
                    return undefined;
                }
            });
        } catch (error) {
            return "Evento no encontrado";
        }
    }

    /** DELETE */
    async deleteEvent(eventID, userID) {
        return this.connect().then((db) => {
            try {
                return db.collection('Events').deleteOne({ _id: ObjectId(eventID), id_owner: ObjectId(userID) });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** ADD PARTICIPANT */
    async addParticipant(eventID, userID) {
        return this.connect().then((db) => {
            try {
                return db.collection('Events').updateOne(
                    { _id: ObjectId(eventID) },
                    { $push: { participants: ObjectId(userID) } }
                );
            } catch (err) {
                return undefined;
            }
        });
    }

    async removeParticipant(eventID, userID) {
        return this.connect().then((db) => {
            try {
                return db.collection('Events').updateOne(
                    { _id: ObjectId(eventID) },
                    { $pull: { participants: ObjectId(userID) } }
                );
            } catch (err) {
                return undefined;
            }
        });
    }

    async getAllEvents(userID) {
        return this.connect().then((db) => {
            try {
                return db.collection('Events').find({ id_owner: { $ne: ObjectId(userID) }, participants: { $ne: ObjectId(userID) } }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }
}

module.exports = Events;
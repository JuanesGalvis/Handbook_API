const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Members extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createMember(IdOwner) {
        let newMemberFormat = {
            Id_Communities: [],
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            try {
                return db.collection('Members').insertOne(newMemberFormat);
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL - COMMUNITY */
    async getMembersCommunity(IdCommunity) {
        return this.connect().then((db) => {
            try {
                let pipeline = [
                    {
                        '$match': {
                            'Id_Communities': new ObjectId(IdCommunity)
                        }
                    }, {
                        '$lookup': {
                            'from': 'Users',
                            'localField': 'Id_Owner',
                            'foreignField': '_id',
                            'as': 'Id_Owner'
                        }
                    }, {
                        '$project': {
                            'Id_Owner': 1
                        }
                    }
                ]

                return db.collection('Members').aggregate(pipeline).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ONE */
    async getMember(Id) {
        return this.connect().then((db) => {
            try {
                let pipeline = [
                    {
                        '$match': {
                            'Id_Owner': new ObjectId(Id)
                        }
                    }, {
                        '$lookup': {
                            'from': 'Communities',
                            'localField': 'Id_Communities',
                            'foreignField': '_id',
                            'as': 'Id_Communities'
                        }
                    }
                ]

                return db.collection('Members').aggregate(pipeline).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** POST - ADD COMMUNITY */
    async addMemberCommunity(IdCommunity, IdOwner) {
        return this.connect().then((db) => {
            try {
                return db.collection('Members').updateOne({ Id_Owner: ObjectId(IdOwner) }, { $push: { Id_Communities: ObjectId(IdCommunity) } });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** DELETE - REMOVE COMMUNITY */
    async removeMemberCommunity(IdCommunity, IdOwner) {
        return this.connect().then((db) => {
            try {
                return db.collection('Members').updateOne({ Id_Owner: ObjectId(IdOwner) }, { $pull: { Id_Communities: ObjectId(IdCommunity) } });
            } catch (err) {
                return undefined;
            }
        });
    }
}

module.exports = Members;
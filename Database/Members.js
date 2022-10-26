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
            return db.collection('Members').insertOne(newMemberFormat);
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
            let pipeline = [
                {
                    '$match': {
                        '_id': new ObjectId(Id)
                    }
                }, {
                    '$lookup': {
                        'from': 'Users',
                        'localField': 'Id_Owner',
                        'foreignField': '_id',
                        'as': 'Id_Owner'
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
        });
    }

    /** UPDATE */
    async updateMember(data, IdOwner) {
        let MemberFormat = {
            Id_Communities: data.Id_Communities.map((item) => {
                return ObjectId(item)
            }),
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('Members').updateOne({ Id_Owner: ObjectId(IdOwner) }, { $set: { ...MemberFormat } });
        });
    }
}

module.exports = Members;
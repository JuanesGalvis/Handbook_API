const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Communities extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createCommunity(data, IdOwner) {
        let newCommunityFormat = {
            ...data,
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            try {
                return db.collection('Communities').insertOne(newCommunityFormat);
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL */
    async getCommunities(IdOwner) {
        return this.connect().then((db) => {
            try {
                return db.collection('Communities').find({ Id_Owner: ObjectId(IdOwner) }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ONE */
    async getCommunity(Id) {
        return this.connect().then((db) => {
            try {
                return db.collection('Communities').findOne({ _id: ObjectId(Id) });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALLCOMMUNITIESMEMBER */
    async getAllCommunitiesMember(IdOwner) {
        return this.connect().then((db) => {
            try {
                let pipeline = [
                    {
                        '$lookup': {
                            'from': 'Communities',
                            'localField': 'Id_Communities',
                            'foreignField': '_id',
                            'as': 'Id_Communities'
                        }
                    }, {
                        '$match': {
                            'Id_Owner': new ObjectId(IdOwner)
                        }
                    }, {
                        '$project': {
                            'Id_Communities': 1
                        }
                    }
                ]

                return db.collection('Members').aggregate(pipeline).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL - WITHOUT ME - WITHOUT MEMBER */
    async getAllCommunities(IdOwner, CommunitiesMember) {
        return this.connect().then((db) => {
            try {
                return db.collection('Communities').find({ Id_Owner: { $ne: ObjectId(IdOwner) }, _id: { $nin: CommunitiesMember } }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** UPDATE */
    async updateCommunity(Id, data, IdOwner) {
        let CommunityFormat = {
            ...data,
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            try {
                return db.collection('Communities').updateOne({ _id: ObjectId(Id) }, { $set: { ...CommunityFormat } });
            } catch (err) {
                return undefined;
            }
        });
    }

    /** DELETE */
    async deleteCommunity(Id) {
        return this.connect().then((db) => {
            try {
                /** ELIMINAR PUBLICACIONES PERTENECIENTES A LA COMUNIDAD */
                db.collection('Posts').deleteMany({ Id_Community: ObjectId(Id) });

                /** ELIMINARLE LA COMUNIDAD A TODOS LOS MIEMBROS QUE HAGAN PARTE */
                db.collection('Members').updateMany({ Id_Communities: ObjectId(Id) }, { $pull: { Id_Communities: ObjectId(Id) } });

                return db.collection('Communities').deleteOne({ _id: ObjectId(Id) });
            } catch (err) {
                return undefined;
            }
        });
    }
}

module.exports = Communities;
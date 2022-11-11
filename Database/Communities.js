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
            return db.collection('Communities').insertOne(newCommunityFormat);
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
            return db.collection('Communities').findOne({ _id: ObjectId(Id) });
        });
    }

    /** READ - ALL - WITHOUT ME */
    async getAllCommunities(IdOwner) {
        return this.connect().then((db) => {
            return db.collection('Communities').find({ Id_Owner: { $ne: ObjectId(IdOwner) } }).toArray();
        });
    }

    /** UPDATE */
    async updateCommunity(Id, data, IdOwner) {
        let CommunityFormat = {
            ...data,
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('Communities').updateOne({ _id: ObjectId(Id) }, { $set: { ...CommunityFormat } });
        });
    }

    /** DELETE */
    async deleteCommunity(Id) {
        return this.connect().then((db) => {

            /** ELIMINAR PUBLICACIONES PERTENECIENTES A LA COMUNIDAD */
            db.collection('Posts').deleteMany({ Id_Community: ObjectId(Id) });

            /** ELIMINARLE LA COMUNIDAD A TODOS LOS MIEMBROS QUE HAGAN PARTE */
            db.collection('Members').updateMany({ Id_Communities: ObjectId(Id) }, { $pull: { Id_Communities: ObjectId(Id) } });

            return db.collection('Communities').deleteOne({ _id: ObjectId(Id) });
        });
    }
}

module.exports = Communities;
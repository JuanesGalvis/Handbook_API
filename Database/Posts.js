const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Posts extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createPost(data, IdOwner) {
        let newPostFormat = {
            ...data,
            Id_Community: ObjectId(data.Id_Community),
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('Posts').insertOne(newPostFormat);
        });
    }

    /** READ - ALL - IDOWNER */
    async getPostsOwner(IdOwner) {
        return this.connect().then((db) => {
            try {
                return db.collection('Posts').find({ Id_Owner: ObjectId(IdOwner) }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL - IDCOMMUNITY */
    async getPostsCommunity(Id_Community) {
        return this.connect().then((db) => {
            try {
                return db.collection('Posts').find({ Id_Community: ObjectId(Id_Community) }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ONE */
    async getPost(Id) {
        return this.connect().then((db) => {
            return db.collection('Posts').findOne({ _id: ObjectId(Id) });
        });
    }

    /** UPDATE */
    async updatePost(Id, data, IdOwner) {
        let PostFormat = {
            ...data,
            Id_Community: ObjectId(data.Id_Community),
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('Posts').updateOne({ _id: ObjectId(Id) }, { $set: { ...PostFormat } });
        });
    }

    /** DELETE */
    async deletePost(Id) {
        return this.connect().then((db) => {
            return db.collection('Posts').deleteOne({ _id: ObjectId(Id) });
        });
    }
}

module.exports = Posts;
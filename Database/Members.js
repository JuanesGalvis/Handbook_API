const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class Members extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createMember(data, IdOwner) {
        let newMemberFormat = {
            Id_Communities: data.Id_Communities.map((item) => {
                return ObjectId(item)
            }),
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('Members').insertOne(newMemberFormat);
        });
    }
}

module.exports = Members;
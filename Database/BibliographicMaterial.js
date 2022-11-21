const { ObjectId } = require('mongodb');
const MongoDB = require('./Mongo');

class BibliographicMaterial extends MongoDB {

    constructor() {
        super();
    }

    /** CREATE */
    async createBibliographicMaterial(data, IdOwner) {
        let newBibliographicMaterialFormat = {
            ...data,
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('BibliographicMaterials').insertOne(newBibliographicMaterialFormat);
        });
    }

    /** READ - ALL */
    async getAllBibliographicMaterials() {
        return this.connect().then((db) => {
            try {
                return db.collection('BibliographicMaterials').find().toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ALL - IDOWNER */
    async getBibliographicMaterials(IdOwner) {
        return this.connect().then((db) => {
            try {
                return db.collection('BibliographicMaterials').find({ Id_Owner: ObjectId(IdOwner) }).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - RANDOM BOOKS */
    async getBibliographicMaterialsRandom(IdOwner, limit, BooksLike) {
        return this.connect().then((db) => {
            let random = Math.round(Math.random() * limit);

            try {
                return db.collection('BibliographicMaterials').find({ Id_Owner: { $ne: ObjectId(IdOwner) }, _id: { $nin: BooksLike } }).skip(random).limit(1).toArray();
            } catch (err) {
                return undefined;
            }
        });
    }

    /** READ - ONE */
    async getBibliographicMaterial(Id) {
        return this.connect().then((db) => {
            return db.collection('BibliographicMaterials').findOne({ _id: ObjectId(Id) });
        });
    }

    /** UPDATE */
    async updateBibliographicMaterial(Id, data, IdOwner) {
        let BibliographicMaterialFormat = {
            ...data,
            Id_Owner: ObjectId(IdOwner)
        }

        return this.connect().then((db) => {
            return db.collection('BibliographicMaterials').updateOne({ _id: ObjectId(Id) }, { $set: { ...BibliographicMaterialFormat } });
        });
    }

    /** DELETE */
    async deleteBibliographicMaterial(Id) {
        return this.connect().then((db) => {
            return db.collection('BibliographicMaterials').deleteOne({ _id: ObjectId(Id) });
        });
    }
}

module.exports = BibliographicMaterial;
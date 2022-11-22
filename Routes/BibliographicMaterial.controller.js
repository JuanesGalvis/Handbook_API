const express = require('express');
const BibliographicMaterialRouter = express.Router();

const Client = require('../Database/BibliographicMaterial');
const Client2 = require('../Database/Users');
const Client3 = require('../Database/SelectedBook');
const Client4 = require('../Database/Exchange');
const BibliographicMaterialClient = new Client();
const UsersClient = new Client2();
const SelectedBookClient = new Client3();
const ExchangeClient = new Client4();

const passport = require('passport');

/** CREATE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.post('/new_bibliographic_material',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await BibliographicMaterialClient.createBibliographicMaterial(req.body, req.user.sub);
        req.result = result;
        req.message = "MATERIAL BIBLIOGRAFICO CREADO CON ÉXITO";
        next();
    })

/** READ ALL BIBLIOGRAPHIC MATERIALS */
BibliographicMaterialRouter.get('/bibliographic_materials',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await BibliographicMaterialClient.getBibliographicMaterials(req.user.sub);
        req.result = result.reverse();
        req.message = "INFO DE TODO EL MATERIAL BIBLIOGRAFICO";
        next();
    })

/** READ RANDOM BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.get('/bibliographic_materials_random',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        /** MOSTRAR NUEVO RANDOM */
        let numberBibliographicMaterialUser = await BibliographicMaterialClient.getBibliographicMaterials(req.user.sub);
        let numberBibliographicMaterial = await BibliographicMaterialClient.getAllBibliographicMaterials();

        let BooksLikeArray = await SelectedBookClient.getAllBooksLike(req.user.sub);

        let BooksLikeArrayId = [];

        for (let i = 0; i < BooksLikeArray[0].Id_Books.length; i++) {
            BooksLikeArrayId.push(BooksLikeArray[0].Id_Books[i]._id);
        }

        if ((numberBibliographicMaterial.length - numberBibliographicMaterialUser.length - BooksLikeArrayId.length - 1) !== -1) {
            let result = await BibliographicMaterialClient.getBibliographicMaterialsRandom(req.user.sub, (numberBibliographicMaterial.length - numberBibliographicMaterialUser.length - BooksLikeArrayId.length - 1), BooksLikeArrayId);

            let user = await UsersClient.getUserId(result[0].Id_Owner);

            let Exchanges = await ExchangeClient.getExchangeOwnerCorrect(user._id);

            let sumReviews = 0;

            for (let i = 0; i < Exchanges.length; i++) {
                if (Exchanges[i].Id_User_One.toString() === user._id.toString()) {
                    sumReviews += Exchanges[i].reviewTwo;
                } else {
                    sumReviews += Exchanges[i].reviewOne;
                }
            }

            user = {
                ...user,
                stars: Exchanges.length === 0 ? 0 : Math.floor(sumReviews / Exchanges.length)
            }

            req.result = {
                book: result,
                user: user
            };
            req.message = "MI MATERIAL BIBLIOGRAFICO RANDOM";
            next();
        } else {
            req.result = null
            req.message = "NO HAY MAS LIBROS NUEVOS";
            next();
        }
    })

/** LIKE BOOK AND READ RANDOM BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.post('/bibliographic_materials_like/:idBook',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        /** GUARDAR EN LA COLECCIÓN EL LIKE */
        await SelectedBookClient.addSelectedBook(req.params.idBook, req.user.sub);

        /** VERIFICACIÓN DEL MATCH */
        let bookLiked = await BibliographicMaterialClient.getBibliographicMaterial(req.params.idBook);

        let userMatch = await SelectedBookClient.getBooksMatch(bookLiked.Id_Owner);

        for (let i = 0; i < userMatch[0].Id_Books.length; i++) {
            let bookOtherUser = await BibliographicMaterialClient.getBibliographicMaterial(userMatch[0].Id_Books[i]);

            if (bookOtherUser.Id_Owner.toString() === req.user.sub && bookOtherUser.state === 'Disponible') {
                await ExchangeClient.createExchange(req.user.sub, bookLiked.Id_Owner, bookOtherUser._id.toString(), req.params.idBook);
                await BibliographicMaterialClient.updateBibliographicMaterial(
                    bookOtherUser._id.toString(),
                    {
                        state: 'En proceso'
                    },
                    req.user.sub
                )
                await BibliographicMaterialClient.updateBibliographicMaterial(
                    req.params.idBook,
                    {
                        state: 'En proceso'
                    },
                    bookLiked.Id_Owner
                )
                i = userMatch[0].Id_Books.length;
                req.match = "SE HA HECHO UN MATCH SATISFACTORIAMENTE";
            }
        }

        /** MOSTRAR NUEVO RANDOM */
        let numberBibliographicMaterialUser = await BibliographicMaterialClient.getBibliographicMaterials(req.user.sub);
        let numberBibliographicMaterial = await BibliographicMaterialClient.getAllBibliographicMaterials();

        let BooksLikeArray = await SelectedBookClient.getAllBooksLike(req.user.sub);

        let BooksLikeArrayId = [];

        for (let i = 0; i < BooksLikeArray[0].Id_Books.length; i++) {
            BooksLikeArrayId.push(BooksLikeArray[0].Id_Books[i]._id);
        }

        if ((numberBibliographicMaterial.length - numberBibliographicMaterialUser.length - BooksLikeArrayId.length - 1) !== -1) {
            let result = await BibliographicMaterialClient.getBibliographicMaterialsRandom(req.user.sub, (numberBibliographicMaterial.length - numberBibliographicMaterialUser.length - BooksLikeArrayId.length - 1), BooksLikeArrayId);

            let user = await UsersClient.getUserId(result[0].Id_Owner);

            let Exchanges = await ExchangeClient.getExchangeOwnerCorrect(user._id);

            let sumReviews = 0;

            for (let i = 0; i < Exchanges.length; i++) {
                if (Exchanges[i].Id_User_One.toString() === user._id.toString()) {
                    sumReviews += Exchanges[i].reviewTwo;
                } else {
                    sumReviews += Exchanges[i].reviewOne;
                }
            }

            user = {
                ...user,
                stars: Exchanges.length === 0 ? 0 : Math.floor(sumReviews / Exchanges.length)
            }

            req.result = {
                book: result,
                user: user
            };
            req.message = "OTRO MATERIAL BIBLIOGRAFICO RANDOM";
            res.json({ result: req.result, message: req.message, match: req.match });
        } else {
            req.result = null
            req.message = "NO HAY MAS LIBROS NUEVOS";
            res.json({ result: req.result, message: req.message, match: req.match });
        }
    })

/** DISLIKE AND READ RANDOM BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.get('/bibliographic_materials_dislike',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        /** MOSTRAR NUEVO RANDOM */
        let numberBibliographicMaterialUser = await BibliographicMaterialClient.getBibliographicMaterials(req.user.sub);
        let numberBibliographicMaterial = await BibliographicMaterialClient.getAllBibliographicMaterials();

        let BooksLikeArray = await SelectedBookClient.getAllBooksLike(req.user.sub);

        let BooksLikeArrayId = [];

        for (let i = 0; i < BooksLikeArray[0].Id_Books.length; i++) {
            BooksLikeArrayId.push(BooksLikeArray[0].Id_Books[i]._id);
        }

        if ((numberBibliographicMaterial.length - numberBibliographicMaterialUser.length - BooksLikeArrayId.length - 1) !== -1) {
            let result = await BibliographicMaterialClient.getBibliographicMaterialsRandom(req.user.sub, (numberBibliographicMaterial.length - numberBibliographicMaterialUser.length - BooksLikeArrayId.length - 1), BooksLikeArrayId);

            let user = await UsersClient.getUserId(result[0].Id_Owner);

            let Exchanges = await ExchangeClient.getExchangeOwnerCorrect(user._id);

            let sumReviews = 0;

            for (let i = 0; i < Exchanges.length; i++) {
                if (Exchanges[i].Id_User_One.toString() === user._id.toString()) {
                    sumReviews += Exchanges[i].reviewTwo;
                } else {
                    sumReviews += Exchanges[i].reviewOne;
                }
            }

            user = {
                ...user,
                stars: Exchanges.length === 0 ? 0 : Math.floor(sumReviews / Exchanges.length)
            }

            req.result = {
                book: result,
                user: user
            };
            req.message = "OTRO MATERIAL BIBLIOGRAFICO RANDOM";
            next();
        } else {
            req.result = null
            req.message = "NO HAY MAS LIBROS NUEVOS";
            next();
        }
    })

/** READ ONE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.get('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await BibliographicMaterialClient.getBibliographicMaterial(req.params.id);
        req.result = result;
        req.message = "INFO DE UN MATERIAL BIBLIOGRAFICO";
        next();
    })

/** UPDATE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.put('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await BibliographicMaterialClient.updateBibliographicMaterial(req.params.id, req.body, req.user.sub);
        req.result = result;
        req.message = "MATERIAL BIBLIOGRAFICO ACTUALIZADO CON ÉXITO";
        next();
    })

/** DELETE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.delete('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let BookExchange = await ExchangeClient.getExchangeBook(req.params.id);

        if (BookExchange.length === 0) {
            let result = await BibliographicMaterialClient.deleteBibliographicMaterial(req.params.id);
            await SelectedBookClient.removeSelectedBook(req.params.id);
            req.result = result;
            req.message = "MATERIAL BIBLIOGRAFICO ELIMINADO CON ÉXITO";
        } else {
            req.result = null;
            req.message = "EL MATERIAL BIBLIOGRAFICO NO PUEDE SER ELIMINADO";
        }
        next();
    })

module.exports = BibliographicMaterialRouter;
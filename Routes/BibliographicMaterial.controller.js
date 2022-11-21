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
    async (req, res) => {
        let result = await BibliographicMaterialClient.createBibliographicMaterial(req.body, req.user.sub);
        req.result = result;
        req.message = "MATERIAL BIBLIOGRAFICO CREADO CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** READ ALL BIBLIOGRAPHIC MATERIALS */
BibliographicMaterialRouter.get('/bibliographic_materials',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await BibliographicMaterialClient.getBibliographicMaterials(req.user.sub);
        req.result = result.reverse();
        req.message = "INFO DE TODO EL MATERIAL BIBLIOGRAFICO";
        res.json({ result: req.result, message: req.message });
    })

/** READ RANDOM BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.get('/bibliographic_materials_random',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

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

            req.result = {
                book: result,
                user: user
            };
            req.message = "MI MATERIAL BIBLIOGRAFICO RANDOM";
            res.json({ result: req.result, message: req.message });
        } else {
            req.result = null
            req.message = "NO HAY MAS LIBROS NUEVOS";
            res.json({ result: req.result, message: req.message });
        }
    })

/** LIKE BOOK AND READ RANDOM BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.post('/bibliographic_materials_like/:idBook',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

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
    async (req, res) => {

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

            req.result = {
                book: result,
                user: user
            };
            req.message = "OTRO MATERIAL BIBLIOGRAFICO RANDOM";
            res.json({ result: req.result, message: req.message });
        } else {
            req.result = null
            req.message = "NO HAY MAS LIBROS NUEVOS";
            res.json({ result: req.result, message: req.message });
        }
    })

/** READ ONE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.get('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await BibliographicMaterialClient.getBibliographicMaterial(req.params.id);
        req.result = result;
        req.message = "INFO DE UN MATERIAL BIBLIOGRAFICO";
        res.json({ result: req.result, message: req.message });
    })

/** UPDATE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.put('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await BibliographicMaterialClient.updateBibliographicMaterial(req.params.id, req.body, req.user.sub);
        req.result = result;
        req.message = "MATERIAL BIBLIOGRAFICO ACTUALIZADO CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** DELETE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.delete('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

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
        res.json({ result: req.result, message: req.message });
    })

module.exports = BibliographicMaterialRouter;
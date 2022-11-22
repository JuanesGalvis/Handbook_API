const express = require('express');
const ExchangeRouter = express.Router();

const Exchange = require('../Database/Exchange');
const BibliographicMaterial = require('../Database/BibliographicMaterial');
const SelectedBook = require('../Database/SelectedBook');
const Messages = require('../Database/Message');
const ExchangeClient = new Exchange();
const BibliographicMaterialClient = new BibliographicMaterial();
const SelectedBookClient = new SelectedBook();
const MessagesClient = new Messages();

const passport = require('passport');

/** READ EXCHANGE OF IDOWNER */
ExchangeRouter.get('/Exchanges',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        const Exchange = await ExchangeClient.getExchangeOwner(req.user.sub);

        req.result = {
            Exchanges: [...Exchange],
            myId: req.user.sub
        };
        req.message = "INTERCAMBIOS DE UN USUARIO EN ESPECIFICO";
        next();

    })

/** READ EXCHANGE OF BIBLIOGRAPHIC MATERIAL */
ExchangeRouter.get('/Exchanges/:BookId',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        const Exchange = await ExchangeClient.getExchangeBook(req.params.BookId);

        req.result = Exchange;
        req.message = "INTERCAMBIOS DE UN LIBRO EN ESPECIFICO";
        next();

    })

/** READ ONE EXCHANGE */
ExchangeRouter.get('/Exchange/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await ExchangeClient.getExchange(req.params.id);
        req.result = {
            Exchange: [...Exchange],
            myId: req.user.sub
        };
        req.message = "INFO DE UN INTERCAMBIO";
        next();
    })

/** UPDATE EXCHANGE */
ExchangeRouter.put('/Exchange/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let Exchange = await ExchangeClient.getExchange(req.params.id);

        if (Exchange[0].Id_User_One[0]._id.toString() === req.user.sub) {
            if (Exchange[0].reviewTwo !== 0) {
                await BibliographicMaterialClient.updateBibliographicMaterial(
                    Exchange[0].Id_Book_One[0]._id,
                    {
                        state: 'Intercambiado'
                    },
                    Exchange[0].Id_User_One[0]._id
                );
                await BibliographicMaterialClient.updateBibliographicMaterial(
                    Exchange[0].Id_Book_Two[0]._id,
                    {
                        state: 'Intercambiado'
                    },
                    Exchange[0].Id_User_Two[0]._id
                );
                await MessagesClient.deleteMessages(req.params.id);
                req.body = {
                    reviewOne: req.body.review,
                    state: "Intercambio Realizado",
                    date: new Date()
                }
            }
        } else {
            if (Exchange[0].reviewOne !== 0) {
                await BibliographicMaterialClient.updateBibliographicMaterial(
                    Exchange[0].Id_Book_One[0]._id,
                    {
                        state: 'Intercambiado'
                    },
                    Exchange[0].Id_User_One[0]._id
                );
                await BibliographicMaterialClient.updateBibliographicMaterial(
                    Exchange[0].Id_Book_Two[0]._id,
                    {
                        state: 'Intercambiado'
                    },
                    Exchange[0].Id_User_Two[0]._id
                );
                await MessagesClient.deleteMessages(req.params.id);
                req.body = {
                    reviewTwo: req.body.review,
                    state: "Intercambio Realizado",
                    date: new Date()
                }
            }
        }

        let result = await ExchangeClient.updateExchange(req.params.id, req.body);
        req.result = result;
        req.message = "INTERCAMBIO ACTUALIZADO CON ÉXITO";
        next();
    })

/** DELETE EXCHANGE*/
ExchangeRouter.delete('/Exchange/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let Exchange = await ExchangeClient.getExchange(req.params.id);

        await BibliographicMaterialClient.updateBibliographicMaterial(
            Exchange[0].Id_Book_One[0]._id,
            {
                state: 'Disponible'
            },
            Exchange[0].Id_User_One[0]._id
        )
        await BibliographicMaterialClient.updateBibliographicMaterial(
            Exchange[0].Id_Book_Two[0]._id,
            {
                state: 'Disponible'
            },
            Exchange[0].Id_User_Two[0]._id
        )

        if (Exchange[0].Id_User_One[0]._id.toString() === req.user.sub) {
            await SelectedBookClient.removeSelectedBookIdOwner(Exchange[0].Id_Book_Two[0]._id, req.user.sub);
        } else {
            await SelectedBookClient.removeSelectedBookIdOwner(Exchange[0].Id_Book_One[0]._id, req.user.sub);
        }

        let result = await ExchangeClient.deleteExchange(req.params.id);

        await MessagesClient.deleteMessages(req.params.id);

        req.result = result;
        req.message = "INTERCAMBIO ELIMINADO CON ÉXITO";
        next();
    })

module.exports = ExchangeRouter;
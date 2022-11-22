const express = require('express');
const SelectedBookRouter = express.Router();

const Client = require('../Database/SelectedBook');
const SelectedBookClient = new Client();

const passport = require('passport');

/** POST SELECTED BOOK */
SelectedBookRouter.post('/new_selectedBook/:idBook',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let result = await SelectedBookClient.addSelectedBook(req.params.idBook, req.user.sub);
        req.result = result;
        req.message = "SELECTED BOOK AÑADIDO CON ÉXITO";
        next();
    })

/** DELETE SELECTED BOOK */
SelectedBookRouter.delete('/remove_selectedBook/:idBook',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let result = await SelectedBookClient.removeSelectedBook(req.params.idBook);
        req.result = result;
        req.message = "SELECTED BOOK ELIMINADO CON ÉXITO";
        next();
    })

module.exports = SelectedBookRouter;
const express = require('express');
const MessageRouter = express.Router();

const passport = require('passport');

const Client = require('../Database/Message');
const MessageClient = new Client();

const ClientExchange = require('../Database/Exchange');
const ExchangeClient = new ClientExchange();

MessageRouter.post('/sendMessage/:exchangeId',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        const Exchange = await ExchangeClient.getExchange(req.params.exchangeId);

        let Destiny = '';

        if (Exchange[0].Id_User_One[0]._id.toString() === req.user.sub) {
            Destiny = Exchange[0].Id_User_Two[0]._id.toString()
        } else {
            Destiny = Exchange[0].Id_User_One[0]._id.toString()
        }

        const NewMessage = await MessageClient.createMessage(
            req.params.exchangeId,
            req.body.content,
            req.user.sub,
            Destiny
        );

        res.json({
            result: NewMessage,
            message: "MENSAJE CREADO"
        })
    })

module.exports = MessageRouter;
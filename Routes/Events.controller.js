const express = require('express');
const EventsRouter = express.Router();

const Events = require('../Database/Events');
const EventsClient = new Events();

const passport = require('passport');

EventsRouter.post('/new_event',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        const NewEvent = await EventsClient.createEvent(req.body, req.user.sub);

        res.json({
            result: NewEvent,
            message: "EVENTO CREADO"
        })

    })

EventsRouter.get('/my_events',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        const MyEvents = await EventsClient.getMyEvents(req.user.sub);

        res.json({
            result: MyEvents,
            message: "EVENTOS CREADOS POR ESTE USUARIO"
        })

    })

EventsRouter.get('/other_events', async (req, res) => {

})

EventsRouter.put('/event/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        let changeEvent = await EventsClient.updateEvent(req.params.eventID, req.body, req.user.sub);

        res.json({
            result: changeEvent,
            message: "EVENTO ACTUALIZADO"
        })

    })

EventsRouter.delete('/event/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        let deletedEvent = await EventsClient.deleteEvent(req.params.eventID, req.user.sub);

        res.json({
            result: deletedEvent,
            message: "EVENTO ELIMINADO"
        })

    })

module.exports = EventsRouter;
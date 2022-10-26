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

EventsRouter.get('/other_events',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        const Events = await EventsClient.getEventsParticipate(req.user.sub);

        res.json({
            result: Events,
            message: "EVENTOS EN LOS CUALES PARTICIPA"
        })

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

EventsRouter.post('/new_participant/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        let NewParticipant = await EventsClient.addParticipant(req.params.eventID, req.user.sub);

        res.json({
            result: NewParticipant,
            message: "PARTICIPANTE AGREGADO AL EVENTO"
        })

    }
)

EventsRouter.delete('/remove_participant/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        let NewParticipant = await EventsClient.removeParticipant(req.params.eventID, req.user.sub);

        res.json({
            result: NewParticipant,
            message: "PARTICIPANTE ELIMINADO DEL EVENTO"
        })

    }
)

module.exports = EventsRouter;
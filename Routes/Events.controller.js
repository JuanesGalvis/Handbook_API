const express = require('express');
const EventsRouter = express.Router();

const Events = require('../Database/Events');
const EventsClient = new Events();

const passport = require('passport');

EventsRouter.post('/new_event',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        const NewEvent = await EventsClient.createEvent(req.body, req.user.sub);

        req.result = NewEvent;
        req.message = "EVENTO CREADO CON ÉXITO";
        next();
    })

EventsRouter.get('/events',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        const Events = await EventsClient.getAllEvents(req.user.sub);

        req.result = Events.reverse();
        req.message = "EVENTOS CREADOS MENOS LOS DEL USUARIO";
        next();

    })

EventsRouter.get('/event/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        const Event = await EventsClient.getOneEvent(req.params.eventID);

        req.result = Event;
        req.message = "INFORMACIÓN DE UN EVENTO";
        next();

    })

EventsRouter.get('/my_events',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        const MyEvents = await EventsClient.getMyEvents(req.user.sub);

        req.result = MyEvents.reverse();
        req.message = "EVENTOS CREADOS POR ESTE USUARIO";
        next();

    })

EventsRouter.get('/other_events',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        const Events = await EventsClient.getEventsParticipate(req.user.sub);

        req.result = Events.reverse();
        req.message = "EVENTOS EN LOS CUALES PARTICIPA";
        next();

    })

EventsRouter.put('/event/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let changeEvent = await EventsClient.updateEvent(req.params.eventID, req.body, req.user.sub);

        req.result = changeEvent;
        req.message = "EVENTO ACTUALIZADO";
        next();

    })

EventsRouter.delete('/event/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let deletedEvent = await EventsClient.deleteEvent(req.params.eventID, req.user.sub);

        req.result = deletedEvent;
        req.message = "EVENTO ELIMINADO";
        next();

    })

EventsRouter.post('/new_participant/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let NewParticipant = await EventsClient.addParticipant(req.params.eventID, req.user.sub);

        req.result = NewParticipant;
        req.message = "PARTICIPANTE AGREGADO AL EVENTO";
        next();

    })

EventsRouter.delete('/remove_participant/:eventID',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let NewParticipant = await EventsClient.removeParticipant(req.params.eventID, req.user.sub);

        req.result = NewParticipant;
        req.message = "PARTICIPANTE ELIMINADO DEL EVENTO";
        next();

    })

module.exports = EventsRouter;
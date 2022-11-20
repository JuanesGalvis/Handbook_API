const express = require('express');
const CommunityRouter = express.Router();

const Client = require('../Database/Communities');
const CommunityClient = new Client();

const passport = require('passport');

/** CREATE COMMUNITY */
CommunityRouter.post('/new_community',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await CommunityClient.createCommunity(req.body, req.user.sub);
        req.result = result;
        req.message = "COMUNIDAD CREADA CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** READ ALL COMMUNITIES */
CommunityRouter.get('/my_communities',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await CommunityClient.getCommunities(req.user.sub);
        req.result = result;
        req.message = "INFO DE TODAS LAS COMUNIDADES";
        res.json({ result: req.result, message: req.message });
    })

/** READ ONE COMMUNITY */
CommunityRouter.get('/community/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await CommunityClient.getCommunity(req.params.id);
        req.result = result;
        req.message = "INFO DE UNA COMUNIDAD";
        res.json({ result: req.result, message: req.message });
    })

/** READ ALL COMMUNITIES WITHOUT ME - WITHOUT MEMBER */
CommunityRouter.get('/communities',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let CommunitiesMemberArray = await CommunityClient.getAllCommunitiesMember(req.user.sub);

        let CommunitiesMemberArrayId = [];

        for (let i = 0; i < CommunitiesMemberArray[0].Id_Communities.length; i++) {
            CommunitiesMemberArrayId.push(CommunitiesMemberArray[0].Id_Communities[i]._id);
        }

        let result = await CommunityClient.getAllCommunities(req.user.sub, CommunitiesMemberArrayId);
        req.result = result;
        req.message = "INFO DE TODAS LAS COMUNIDADES MENOS LAS DEL USUARIO, NI LAS QUE SOY MIEMBRO";
        res.json({ result: req.result, message: req.message });
    })

/** UPDATE COMMUNITY */
CommunityRouter.put('/community/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await CommunityClient.updateCommunity(req.params.id, req.body, req.user.sub);
        req.result = result;
        req.message = "COMUNIDAD ACTUALIZADA CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** DELETE COMMUNITY */
CommunityRouter.delete('/community/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await CommunityClient.deleteCommunity(req.params.id);
        req.result = result;
        req.message = "COMUNIDAD ELIMINADA CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

module.exports = CommunityRouter;
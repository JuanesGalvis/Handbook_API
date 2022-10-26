const express = require('express');
const MemberRouter = express.Router();

const Client = require('../Database/Members');
const MemberClient = new Client();

const passport = require('passport');

/** READ ALL MEMBERS - COMMUNITY */
MemberRouter.get('/members_community/:idCommunity',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await MemberClient.getMembersCommunity(req.params.idCommunity);
        req.result = result;
        req.message = "INFO DE TODOS LOS MIEMBROS DE UNA COMUNIDAD";
        res.json({ result: req.result, message: req.message });
    })

/** READ ONE MEMBER */
MemberRouter.get('/member/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await MemberClient.getMember(req.params.id);
        req.result = result;
        req.message = "INFO DE UN MIEMBRO";
        res.json({ result: req.result, message: req.message });
    })

/** POST MEMBER COMMUNITY */
MemberRouter.post('/new_member/:idCommunity',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        let result = await MemberClient.addMemberCommunity(req.params.idCommunity, req.user.sub);
        req.result = result;
        req.message = "MIEMBRO AÑADIDO CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** DELETE MEMBER COMMUNITY */
MemberRouter.delete('/remove_member/:idCommunity',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {

        let result = await MemberClient.removeMemberCommunity(req.params.idCommunity, req.user.sub);
        req.result = result;
        req.message = "MIEMBRO ELIMINADO CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

module.exports = MemberRouter;
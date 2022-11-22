const express = require('express');
const MemberRouter = express.Router();

const Client = require('../Database/Members');
const MemberClient = new Client();

const passport = require('passport');

/** READ ALL MEMBERS - COMMUNITY */
MemberRouter.get('/members_community/:idCommunity',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await MemberClient.getMembersCommunity(req.params.idCommunity);
        req.result = result;
        req.message = "INFO DE TODOS LOS MIEMBROS DE UNA COMUNIDAD";
        next();
    })

/** READ ONE MEMBER */
MemberRouter.get('/member',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await MemberClient.getMember(req.user.sub);
        result = result[0].Id_Communities.reverse();

        let numberMembersArray;

        for (let i = 0; i < result.length; i++) {
            numberMembersArray = await MemberClient.getMembersCommunity(result[i]._id.toString());

            result[i] = {
                ...result[i],
                members: numberMembersArray.length === 0 ? 0 : numberMembersArray.length
            }
        }

        req.result = result;

        req.message = "INFO DE UN MIEMBRO";
        next();
    })

/** POST MEMBER COMMUNITY */
MemberRouter.post('/new_member/:idCommunity',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let result = await MemberClient.addMemberCommunity(req.params.idCommunity, req.user.sub);
        req.result = result;
        req.message = "MIEMBRO AÑADIDO CON ÉXITO";
        next();
    })

/** DELETE MEMBER COMMUNITY */
MemberRouter.delete('/remove_member/:idCommunity',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {

        let result = await MemberClient.removeMemberCommunity(req.params.idCommunity, req.user.sub);
        req.result = result;
        req.message = "MIEMBRO ELIMINADO CON ÉXITO";
        next();
    })

module.exports = MemberRouter;
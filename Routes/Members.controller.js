const express = require('express');
const MemberRouter = express.Router();

const Client = require('../Database/Members');
const MemberClient = new Client();

const passport = require('passport');

/** CREATE MEMBER */
MemberRouter.post('/new_member',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await MemberClient.createMember(req.body, req.user.sub);
        req.result = result;
        req.message = "MIEMBRO CREADO CON ÉXITO"
        res.json({ result: req.result, message: req.message });
    })

module.exports = MemberRouter;
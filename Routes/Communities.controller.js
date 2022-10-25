const express = require('express');
const CommunityRouter = express.Router();

const Client = require('../Database/Communities');
const CommunityClient = new Client();

/** CREATE COMMUNITY */
CommunityRouter.post('/new_community', async (req, res) => {
    let result = await CommunityClient.createCommunity(req.body);
    req.result = result;
    req.message = "COMUNIDAD CREADA CON ÉXITO";
    res.json({ result: req.result, message: req.message });
})

/** READ ALL COMMUNITIES */
CommunityRouter.get('/communities/:idOwner', async (req, res) => {
    let result = await CommunityClient.getCommunities(req.params.idOwner);
    req.result = result;
    req.message = "INFO DE TODAS LAS COMUNIDADES";
    res.json({ result: req.result, message: req.message });
})

/** READ ONE COMMUNITY */
CommunityRouter.get('/community/:id', async (req, res) => {
    let result = await CommunityClient.getCommunity(req.params.id);
    req.result = result;
    req.message = "INFO DE UNA COMUNIDAD";
    res.json({ result: req.result, message: req.message });
})

/** UPDATE COMMUNITY */
CommunityRouter.put('/community/:id', async (req, res) => {
    let result = await CommunityClient.updateCommunity(req.params.id, req.body);
    req.result = result;
    req.message = "COMUNIDAD ACTUALIZADA CON ÉXITO";
    res.json({ result: req.result, message: req.message });
})

/** DELETE COMMUNITY */
CommunityRouter.delete('/community/:id', async (req, res) => {
    let result = await CommunityClient.deleteCommunity(req.params.id);
    req.result = result;
    req.message = "COMUNIDAD ELIMINADA CON ÉXITO";
    res.json({ result: req.result, message: req.message });
})

module.exports = CommunityRouter;
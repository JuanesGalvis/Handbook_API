const express = require('express');
const BibliographicMaterialRouter = express.Router();

const Client = require('../Database/BibliographicMaterial');
const BibliographicMaterialClient = new Client();

const passport = require('passport');

/** CREATE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.post('/new_bibliographic_material',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await BibliographicMaterialClient.createBibliographicMaterial(req.body, req.user.sub);
        req.result = result;
        req.message = "MATERIAL BIBLIOGRAFICO CREADO CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** READ ALL BIBLIOGRAPHIC MATERIALS */
BibliographicMaterialRouter.get('/bibliographic_materials',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await BibliographicMaterialClient.getBibliographicMaterials(req.user.sub);
        req.result = result;
        req.message = "INFO DE TODO EL MATERIAL BIBLIOGRAFICO";
        res.json({ result: req.result, message: req.message });
    })

/** READ ONE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.get('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await BibliographicMaterialClient.getBibliographicMaterial(req.params.id);
        req.result = result;
        req.message = "INFO DE UN MATERIAL BIBLIOGRAFICO";
        res.json({ result: req.result, message: req.message });
    })

/** UPDATE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.put('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await BibliographicMaterialClient.updateBibliographicMaterial(req.params.id, req.body, req.user.sub);
        req.result = result;
        req.message = "MATERIAL BIBLIOGRAFICO ACTUALIZADO CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** DELETE BIBLIOGRAPHIC MATERIAL */
BibliographicMaterialRouter.delete('/bibliographic_material/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await BibliographicMaterialClient.deleteBibliographicMaterial(req.params.id);
        req.result = result;
        req.message = "MATERIAL BIBLIOGRAFICO ELIMINADO CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

module.exports = BibliographicMaterialRouter;
const express = require('express');
const PostRouter = express.Router();

const Client = require('../Database/Posts');
const PostClient = new Client();

const passport = require('passport');

/** CREATE POST */
PostRouter.post('/new_post',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await PostClient.createPost(req.body, req.user.sub);
        req.result = result;
        req.message = "PUBLICACIÓN CREADA CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** READ ALL POSTS - OWNER */
PostRouter.get('/posts_owner',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await PostClient.getPostsOwner(req.user.sub);
        req.result = result;
        req.message = "INFO DE TODAS LAS PUBLICACIONES DE UN USUARIO";
        res.json({ result: req.result, message: req.message });
    })

/** READ ALL POSTS - COMMUNITY */
PostRouter.get('/posts_community/:idCommunity',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await PostClient.getPostsCommunity(req.params.idCommunity);
        req.result = result;
        req.message = "INFO DE TODAS LAS PUBLICACIONES DE UNA COMUNIDAD";
        res.json({ result: req.result, message: req.message });
    })

/** READ ONE POST */
PostRouter.get('/post/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await PostClient.getPost(req.params.id);
        req.result = result;
        req.message = "INFO DE UNA PUBLICACIÓN";
        res.json({ result: req.result, message: req.message });
    })

/** UPDATE POST */
PostRouter.put('/post/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await PostClient.updatePost(req.params.id, req.body, req.user.sub);
        req.result = result;
        req.message = "PUBLICACIÓN ACTUALIZADA CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

/** DELETE POST */
PostRouter.delete('/post/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res) => {
        let result = await PostClient.deletePost(req.params.id);
        req.result = result;
        req.message = "PUBLICACIÓN ELIMINADA CON ÉXITO";
        res.json({ result: req.result, message: req.message });
    })

module.exports = PostRouter;
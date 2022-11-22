const express = require('express');
const PostRouter = express.Router();

const Client = require('../Database/Posts');
const PostClient = new Client();

const passport = require('passport');

/** CREATE POST */
PostRouter.post('/new_post',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await PostClient.createPost(req.body, req.user.sub);
        req.result = result;
        req.message = "PUBLICACIÓN CREADA CON ÉXITO";
        next();
    })

/** READ ALL POSTS - OWNER */
PostRouter.get('/posts_owner',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await PostClient.getPostsOwner(req.user.sub);
        req.result = result.reverse();
        req.message = "INFO DE TODAS LAS PUBLICACIONES DE UN USUARIO";
        next();
    })

/** READ ALL POSTS - COMMUNITY */
PostRouter.get('/posts_community/:idCommunity',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await PostClient.getPostsCommunity(req.params.idCommunity);
        req.result = result.reverse();
        req.message = "INFO DE TODAS LAS PUBLICACIONES DE UNA COMUNIDAD";
        next();
    })

/** READ ONE POST */
PostRouter.get('/post/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await PostClient.getPost(req.params.id);
        req.result = result;
        req.message = "INFO DE UNA PUBLICACIÓN";
        next();
    })

/** UPDATE POST */
PostRouter.put('/post/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await PostClient.updatePost(req.params.id, req.body, req.user.sub);
        req.result = result;
        req.message = "PUBLICACIÓN ACTUALIZADA CON ÉXITO";
        next();
    })

/** DELETE POST */
PostRouter.delete('/post/:id',
    passport.authenticate("JWT", { session: false }),
    async (req, res, next) => {
        let result = await PostClient.deletePost(req.params.id);
        req.result = result;
        req.message = "PUBLICACIÓN ELIMINADA CON ÉXITO";
        next();
    })

module.exports = PostRouter;
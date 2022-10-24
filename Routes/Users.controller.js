const express = require('express');
const UsersRouter = express.Router();

const Client = require('../Database/Users');
const UsersClient = new Client();

/** CREATE CLIENT */
UsersRouter.get('/login', async (req, res) => {
    let result = await UsersClient.getAllClients();

    res.json({
        result,
        message: "USUARIO LOGEADO"
    })
})

module.exports = UsersRouter;
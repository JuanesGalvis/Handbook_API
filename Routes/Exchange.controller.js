const express = require('express');
const UsersRouter = express.Router();

const Client = require('../Database/Users');
const UsersClient = new Client();

UsersRouter.get('', async (req, res) => {

})

module.exports = UsersRouter;
const express = require('express');
const passport = require('passport');
const UsersRouter = express.Router();

const Client = require('../Database/Users');
const UsersClient = new Client();

const { FirmarToken } = require('../Libs/JWT');

/** LOGIN - GOOGLE */
UsersRouter.get('/auth/google',
  passport.authenticate('GOOGLE', {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ], session: false
  })
);

UsersRouter.get('/auth/google/callback',
  passport.authenticate('GOOGLE', { failureRedirect: '/404', session: false }),
  async function (request, response) {

    const UserGoogle = request.user;

    if (UserGoogle.email.includes("@elpoli.edu.co")) {

      let User = {
        _id: null,
        name: UserGoogle.name
      };

      const Exist = await UsersClient.getUser(UserGoogle.email);

      if (!Exist) {
        let createdUser = await UsersClient.createUser(UserGoogle);
        User._id = createdUser.insertedId;

      } else {
        User._id = Exist._id;
      }

      let token = FirmarToken(User);
      response.cookie("JWT", token);
      // response.redirect(`${process.env.REDIRECT_URL}/home`);
      response.json({
        result: UserGoogle,
        message: "ESTUDIANTE LOGEADO CON ÉXITO"
      })


    } else {
      response.json({
        message: "ESTE CORREO NO PERTENECE AL POLITÉCNICO JIC"
      })
    }
  }
);

UsersRouter.get('/profile',
  passport.authenticate("JWT", { session: false }),
  async (req, res) => {

    let User = await UsersClient.getProfile(req.user.sub);

    res.json({
      result: User,
      message: "INFORMACIÓN DEL USUARIO"
  })

  })

module.exports = UsersRouter;
const express = require('express');
const passport = require('passport');
const UsersRouter = express.Router();

const Client = require('../Database/Users');
const Member = require('../Database/Members');
const SelectedBook = require('../Database/SelectedBook');
const UsersClient = new Client();
const MemberClient = new Member();
const SelectedBookClient = new SelectedBook();

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
        await MemberClient.createMember(createdUser.insertedId);
        await SelectedBookClient.createSelectedBook(createdUser.insertedId);

        User._id = createdUser.insertedId;
      } else {
        User._id = Exist._id;
      }

      let token = FirmarToken(User);
      response.redirect(`${process.env.REDIRECT_FRONTEND}/${token}`);
    } else {
      response.redirect(`${process.env.REDIRECT_FRONTEND}/401`);
    }
  }
);

UsersRouter.get('/profile',
  passport.authenticate("JWT", { session: false }),
  async (req, res, next) => {

    let User = await UsersClient.getProfile(req.user.sub);

    req.result = User;
    req.message = "INFORMACIÓN DEL USUARIO";
    next();

  })
module.exports = UsersRouter;
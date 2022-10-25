const passport = require('passport');

const { PASSPORTGOOGLE } = require('./strategy/Google.strategy');
const { JWTSTRATEGY } = require('./strategy/JWT.strategy');

passport.use("GOOGLE", PASSPORTGOOGLE);
passport.use("JWT", JWTSTRATEGY);
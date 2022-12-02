const passport = require('passport');

const { PASSPORTGOOGLE } = require('./Strategy/Google.strategy.js');
const { JWTSTRATEGY } = require('./Strategy/JWT.strategy.js');

passport.use("GOOGLE", PASSPORTGOOGLE);
passport.use("JWT", JWTSTRATEGY);
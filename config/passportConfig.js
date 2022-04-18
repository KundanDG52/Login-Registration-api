const passport = require("passport");
const localStratergy = require("passport-local").Strategy;
const PasswordHash = require("password-hash");
const User = require("../models/user");
passport.use(
  new localStratergy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        let user = await User.findOne({ email_id: email });
        if (!user) {
          return done(null, false, {
            message: "Email Or Password Does not match",
          });
        }
        if (PasswordHash.verify(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Email Or Password Does not match",
          });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);
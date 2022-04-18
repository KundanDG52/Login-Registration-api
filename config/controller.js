const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
module.exports.authenticate = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(401).json(err);
    } else if (user) {
      // console.log(user);
      return res.status(200).json({
        token: jwt.sign({ _id: user.id, _type: user.role }, config.JWT_SECRET, {
          expiresIn: config.JWT_EXP,
        }),
      });
    } else {
      return res.status(401).json(info);
    }
  })(req, res);
};

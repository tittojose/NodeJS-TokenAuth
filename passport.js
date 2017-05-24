const passport = require("passport");
const Strategy = require("passport-local");
const User = require("./app/models/user");
const Client = require("./app/models/client");
const crypto = require("crypto");
const db = require("./dbHandler");

var jwt = require("jsonwebtoken");
var config = require("./config.js");

passport.use(
  new Strategy(function(username, password, done) {
    User.findOne({ username: username, password: password }, function(
      err,
      users
    ) {
      if (err) {
        console.log("passport auth strategy error" + err);
        done(null, false);
      } else {
        console.log("passport auth strategy success");
        console.log(users);
        done(null, users);
      }
    });
  })
);

passport.serialize = function(req, res, next) {
  var user = req.user;
  //   console.log("serialize user +" + user);
  db.updateCreate(req.user, function(err, user) {
    if (err) {
      return next(err);
    }
    req.user = {
      id: user.id,
      username: user.username
    };
    next();
  });
};

passport.serializeClient = function(req, res, next) {
  var user = req.user;
  //   console.log("serialize user +" + user);
  db.updateCreatClient(req.user, function(err, client) {
    if (err) {
      return next(err);
    }
    req.user.clientId = client.id;
    next();
  });
};

passport.generateToken = function(req, res, next) {
  // console.log(req.user);
  req.token = req.token || {};
  req.token.accessToken = jwt.sign(
    { id: req.user.id, username: req.user.username },
    config.secret,
    { expiresIn: 1200 }
  );
  next();
};

passport.generateRefreshToken = function(req, res, next) {
  req.token.refreshToken =
    req.user.clientId.toString() + "." + crypto.randomBytes(40).toString("hex");
  db.storeToken(
    {
      id: req.user.clientId,
      refreshToken: req.token.refreshToken
    },
    next
  );
};

passport.sendToken = function(req, res) {
  res.status(200).json({
    user: req.user,
    token: req.token
  });
};

passport.validateRefreshToken = function(req, res, next) {
  db.findUserOfToken(req.body, function(err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

module.exports = passport;

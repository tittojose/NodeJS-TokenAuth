var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");

var passport = require("./passport");
const expressJwt = require("express-jwt");

var User = require("./app/models/user.js");
var Todo = require("./app/models/todoitem");

var config = require("./config.js");

var app = express();

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set("superSecret", config.secret);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("dev"));

const authenticate = expressJwt({ secret: config.secret });

app.use(passport.initialize());

var apiRouter = express.Router();

apiRouter.get("/users", function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

apiRouter.get("/todo", authenticate, function(req, res) {
  Todo.find({ user: req.user.username }, function(err, reslt) {
    if (err) {
      res.status(500).json({ result: "error" });
    } else {
      res.json(reslt);
    }
  });
});

apiRouter.post("/todo", authenticate, function(req, res) {
  var user = req.user;
  console.log("todo user - ");
  console.log(user);

  // res.status(200).json({ result: "success" });

  var todoItem = Todo({
    title: "Third todo",
    user: user.username
  });

  todoItem.save(function(err, result) {
    if (err) {
      console.log(err);
      throw err;
    }

    res.status(200).json({ result: "success", data: result });
  });
});

apiRouter.post(
  "/auth",
  passport.authenticate("local", { session: false }),
  passport.serialize,
  passport.serializeClient,
  passport.generateToken,
  passport.generateRefreshToken,
  passport.sendToken
);

apiRouter.post(
  "/token",
  passport.validateRefreshToken,
  passport.generateToken,
  function(req, res) {
    res.status(201).json({
      token: req.token
    });
  }
);

apiRouter.get("/me", authenticate, function(req, res) {
  // res.status(200).json(req.user);

  User.find({}, function(err, users) {
    res.json(users);
  });
});

app.use("/api", apiRouter);

app.listen(port);

console.log("listening to port - " + port);

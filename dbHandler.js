const Client = require("./app/models/client");
var User = require("./app/models/user.js");

exports.updateCreate = function(user, cb) {
  cb(null, user);
};

exports.updateCreatClient = function(user, cb) {
  var client = Client({
    username: user.username
  });

  client.save(function(err, clientRes) {
    if (err) {
      cb(err);
    } else {
      cb(null, clientRes);
    }
  });
};

exports.storeToken = function(refreshTokenInfo, cb) {
  console.log(refreshTokenInfo);
  Client.update(
    { _id: refreshTokenInfo.id },
    { refreshToken: refreshTokenInfo.refreshToken },
    function(err, result) {
      if (err) {
        console.log("refresh token save erro");
        cb(err);
      } else {
        console.log("refresh token save successfuly");
        cb();
      }
    }
  );
};

exports.findUserOfToken = function(reqBody, cb) {
  Client.find({ refreshToken: reqBody.refreshToken }, function(err, client) {
    if (err) {
      cb(err);
    } else {
      console.log("findUserOfToken");
      console.log(client);
      User.find({ username: client[0].username }, (err, user) => {
        if (err) {
          cb(err);
        } else {
          console.log("findUserOfToken - user");
          console.log(user);
          cb(null,user);
        }
      });
    }
  });
};

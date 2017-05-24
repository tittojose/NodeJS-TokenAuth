var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var clientSchema = new Schema({
  username: String,
  clientId: String,
  refreshToken: String,
  createdDate: Date,
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("Client", clientSchema);

clientSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();
  if (!this.createdDate) {
    this.createdDate = currentDate;
  }
  next();
});

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  title: String,
  user: String,
  createdDate: Date,
  updatedDate: Date,
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("TodoItem", todoSchema);

todoSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updated_at field to current date
  this.updatedDate = currentDate;
  // if created_at doesn't exist, add to that field
  if (!this.createdDate) {
    this.createdDate = currentDate;
  }
  next();
});

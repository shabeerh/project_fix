const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String ,
  hash: String
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;

//email: { type: String, required: true}, 
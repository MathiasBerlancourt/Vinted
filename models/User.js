const mongoose = require("mongoose");

/*On créé notre model dans le fichier*/

const User = mongoose.model("User", {
  email: String,
  account: { username: String, avatar: Object },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;

const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String, required: true },
});

const Auth = mongoose.model("Auth", authSchema);
module.exports = Auth;

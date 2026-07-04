const mongoose = require("mongoose");

const salesAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Sales Agent name is required"],
  },
  email: {
    type: String,
    required: [true, "Sales Agent email is required"],
    unique: true, // Email must be unique across agents
  },
  profileImg: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SalesAgent = mongoose.model("SalesAgent", salesAgentSchema);
module.exports = SalesAgent;

const mongoose = require("mongoose")


const commentModel = new mongoose.Schema({
    leadId: { type: mongoose.Types.ObjectId, required: true, ref: "Lead" },
    salesAgentId: { type: mongoose.Types.ObjectId, required: true, ref: "SalesAgent" },
    commentText: { type: String, required: true },
    author: { type: String, required: true }
})


const Comment = mongoose.model("Comment", commentModel)
module.exports = Comment
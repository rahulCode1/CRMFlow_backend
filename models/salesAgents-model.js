const mongoose = require("mongoose")


const salesAgentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true }
}, { timestamps: true })

const SalesAgent = mongoose.model("SalesAgent", salesAgentSchema)
module.exports = SalesAgent
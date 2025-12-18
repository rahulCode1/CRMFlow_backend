const mongoose = require("mongoose")



const reportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    salesAgent: { type: mongoose.Types.ObjectId, required: true, ref: "SalesAgent" },
    closedAt: { type: Date, default: Date.now },
    leadId: { type: mongoose.Types.ObjectId, required: true, ref: "Lead" }
}, {timestamps: true}) 

const Report = mongoose.model("Report", reportSchema)
module.exports = Report
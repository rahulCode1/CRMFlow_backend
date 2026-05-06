const { default: mongoose } = require("mongoose")
const { validationResult } = require("express-validator")
const HttpError = require("../models/http-error")
const Lead = require("../models/leads-model")
const SalesAgent = require("../models/salesAgents-model")
const Comment = require("../models/comment-model")


const addLeads = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input data", 400, errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }))))
    }

    const { name, source, salesAgent, status, tags, timeToClose, priority, closedAt } = req.body

    console.log(name, source)
    
    try {

        const existingSalesAgent = await SalesAgent.findById(salesAgent)

        if (!existingSalesAgent) {
            return next(new HttpError(`Sales agent not found with ${salesAgent} id.`, 404))
        }


        const newLead = new Lead({ name, source, salesAgent, status, tags, timeToClose, priority, closedAt })
        const savedLead = await newLead.save()

        if (savedLead) {
            res.status(201).json({ success: true, message: "Lead added successfully.", lead: savedLead })
        } else {
            return next(new HttpError("Failed to add lead.", 404))
        }

    } catch (error) {
        next(new HttpError(error.message || "Failed to create lead", 500))
    }
}

const getAllLeads = async (req, res, next) => {
    const { salesAgent, status, tags, source } = req.query

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input data", 400, errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }))))
    }
    let filter = {}

    if (salesAgent) filter.salesAgent = salesAgent
    if (status) filter.status = status
    if (source) filter.source = source

    if (tags) {
        filter.tags = { $in: Array.isArray(tags) ? tags : [tags] }
    }


    try {
        const leads = await Lead.find(filter).populate("salesAgent").sort({ createdAt: -1 })


        res.status(200).json({ leads: leads.map(lead => lead.toObject({ getters: true })) })
    } catch (error) {
        next(new HttpError(error.message || "Failed to get all leads", 500))
    }
}

const updateLeads = async (req, res, next) => {
    const leadsId = req.params.id

    if (!leadsId) {
        return next(new HttpError("Please provide leads id.", 404))
    }

    if (!mongoose.Types.ObjectId.isValid(leadsId)) {
        return next(
            new HttpError("Invalid lead ID format", 400)
        );
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input data to update.", 400, errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }))))
    }
    const dataToUpdate = req.body


    try {
        const updatedLead = await Lead.findByIdAndUpdate(leadsId, dataToUpdate, { new: true })



        if (updatedLead) {
            res.status(201).json({ success: true, message: "Leads updated successfully.", leads: updatedLead })
        } else {
            return next(new HttpError(`Lead with ID ${leadsId} not found.`, 404))
        }
    } catch (error) {
        return next(new HttpError(error.message || "Failed to update lead.", 500))
    }


}

const deleteLead = async (req, res, next) => {
    const leadId = req.params.id
    try {

        const lead = await Lead.findById(leadId);
        if (!lead) {
            return next(new HttpError("No lead exists with that id.", 404));
        }

        await Comment.deleteMany({ lead: leadId })
        await lead.deleteOne();
        res.status(200).json({ success: true, message: `Lead & related comments deleted successfully.`, deleteLead: lead })
    } catch (error) {
        next(error)
    }
}



const getLeadDetails = async (req, res, next) => {


    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input data", 400, errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }))))
    }
    const leadId = req.params.id
    try {
        const lead = await Lead.findById(leadId).populate("salesAgent")
        const comments = await Comment.find({ lead: leadId }).populate("lead").populate("author")


        if (lead) {
            res.status(200).json({ lead: lead.toObject({ getters: true }), comments: comments.map(comment => comment.toObject({ getters: true })) })
        } else {
            return next(new HttpError(`No lead found with ${leadId}.`, 500))
        }
    } catch (error) {
        next(error)
    }
}
module.exports = {
    addLeads,
    getAllLeads,
    updateLeads,
    deleteLead,
    getLeadDetails
}
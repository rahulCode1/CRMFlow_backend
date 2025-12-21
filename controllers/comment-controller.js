const { validationResult } = require("express-validator")
const HttpError = require("../models/http-error")
const Lead = require("../models/leads-model")
const Comment = require("../models/comment-model")
const SalesAgent = require("../models/salesAgents-model")

const addComments = async (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input", 400, errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }))))
    }

    const leadId = req.params.id
    const { author, commentText } = req.body



    try {
        const existingLead = await Lead.findById(leadId)

        if (!existingLead) {
            return next(new HttpError(`Lead doesn't exist with that ${leadId}`, 404))
        }
        const existingSalesAgent = await SalesAgent.findById(author)

        if (!existingSalesAgent) {
            return next(new HttpError(`Sales agent doesn't exist with that ${author}`, 404))
        }



        const newComment = new Comment({ lead: leadId, author, commentText })
        const savedComment = await newComment.save()

        
        res.status(201).json({ success: true, message: "New comment added successfully.", commentText: savedComment.toObject({ getters: true }) })
   
   
    } catch (error) {
        next(error)
    }
}

const getAllComments = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input", 400, errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }))))
    }

    const leadId = req.params.id

    try {
        const comments = await Comment.find({ leadId })
        if (comments.length !== 0) {
            res.status(200).json({ success: true, comments: comments.map(comment => comment.toObject({ getters: true })) })
        } else {
            return next(new HttpError(`Comment not found with lead id: ${leadId}`, 400))
        }
    } catch (error) {
        next(error)
    }
}


module.exports = {
    addComments,
    getAllComments
} 
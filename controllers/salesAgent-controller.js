const { validationResult } = require("express-validator")
const SalesAgent = require("../models/salesAgents-model")
const HttpError = require("../models/http-error")

const addNewSalesAgent = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input data", 400, errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }))))
    }


    try {
        const salesAgent = new SalesAgent(req.body)
        const savedAgent = await salesAgent.save()

        res.status(200).json({ success: true, message: "New sales agent added successfully.", savedAgent })
    } catch (error) {
        next(error)
    }


}

const getAllSalesAgents = async (req, res, next) => {
    try {

        const allSalesAgents = await SalesAgent.find()
        res.status(200).json({ success: true, message: "Sales agents find successfully.", allSalesAgents: allSalesAgents.map(agent => agent.toObject({ getters: true })) })
    } catch (error) {
        next(error)
    }
}

module.exports = { addNewSalesAgent, getAllSalesAgents }
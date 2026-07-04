const { validationResult } = require("express-validator");
const SalesAgent = require("../models/salesAgents-model");
const HttpError = require("../models/http-error");
const cloudinary = require("../config/cloudinary.config.js");

const addNewSalesAgent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid input data",
        400,
        errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      ),
    );
  }

  const { name, email } = req.body;

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const salesAgent = new SalesAgent({
      name,
      email,
      profileImg: result.secure_url,
      publicId: result.public_id,
    });

    const savedAgent = await salesAgent.save();

    res.status(200).json({
      success: true,
      message: "New sales agent added successfully.",
      savedAgent: savedAgent.toObject({ getters: true }),
    });
  } catch (error) {
    next(error);
  }
};

const getAllSalesAgents = async (req, res, next) => {
  try {
    const allSalesAgents = await SalesAgent.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Sales agents find successfully.",
      allSalesAgents: allSalesAgents.map((agent) =>
        agent.toObject({ getters: true }),
      ),
    });
  } catch (error) {
    next(error);
  }
};

const deleteSalesAgent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid sales agent id.",
        400,
        errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      ),
    );
  }

  const agentId = req.params.id;

  try {
    const existingAgent = await SalesAgent.findById(agentId);

    if (!existingAgent) {
      return next(
        new HttpError(`No sales agent exist with that id ${agentId}`, 404),
      );
    }

    await existingAgent.deleteOne();

    res.status(200).json({
      success: true,
      message: "Agent deleted successfully.",
      deletedAgent: existingAgent,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addNewSalesAgent, getAllSalesAgents, deleteSalesAgent };

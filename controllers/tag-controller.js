const { validationResult } = require("express-validator");
const Tag = require("../models/tag-model");
const HttpError = require("../models/http-error");

/**
 * POST /tags
 * Add new tag
 */
const createTag = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid tag data", 422, errors.array()));
  }

  const { name } = req.body;

  try {
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return next(new HttpError("Tag already exists", 409));
    }

    const tag = await Tag.create({ name });

    res.status(201).json({
      success: true,
      data: {
        id: tag._id,
        name: tag.name,
        createdAt: tag.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tags
 * Fetch all tags
 */
const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ name: 1 }).lean();

    const response = tags.map((tag) => ({
      id: tag._id,
      name: tag.name,
    }));

    res.status(200).json({
      success: true,
      total: response.length,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTag,
  getAllTags,
};

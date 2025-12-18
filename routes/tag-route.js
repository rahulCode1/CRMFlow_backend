const express = require("express");
const {
    createTag,
    getAllTags,
} = require("../controllers/tag-controller");


const { body } = require("express-validator");

const createTagValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Tag name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("Tag name must be between 2 and 30 characters"),
];


const router = express.Router();

router.post("/", createTagValidation, createTag);
router.get("/", getAllTags);

module.exports = router;

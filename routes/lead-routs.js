const express = require("express")
const router = express.Router()
const { body, query, param } = require("express-validator")
const { addLeads, getAllLeads, updateLeads, deleteLead, getLeadDetails } = require("../controllers/leads-controller")
const { addComments, getAllComments } = require("../controllers/comment-controller")


const leadsValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Please provide lead name"),

    body("source")
        .notEmpty()
        .withMessage("Please provide lead source")
        .bail()
        .isIn(["Website", "Referral", "Cold Call"])
        .withMessage("Provide valid source."),

    body("salesAgent")
        .notEmpty()
        .withMessage("Please provide sales id").isMongoId().withMessage("Invalid sales agent id"),

    body("status")
        .notEmpty()
        .withMessage("Please provide status")
        .bail()
        .isIn(["New", "Contacted", "Qualified", "Proposal Sent", "Closed"])
        .withMessage("Invalid lead status"),

    body("tags")
        .optional()
        .isArray()
        .withMessage("Invalid type, it should be an array."),

    body("tags.*")
        .optional()
        .isIn(["High Value", "Follow-up"])
        .withMessage("Invalid tags."),

    body("timeToClose")
        .isInt({ min: 0 })
        .withMessage("Time to close must be a positive number"),

    body("priority")
        .notEmpty()
        .withMessage("Please provide priority")
        .bail()
        .isIn(["High", "Medium", "Low"])
        .withMessage("Invalid priority"),
];
const queryValidation = [
    query("status").optional().isIn(["New", "Contacted", "Qualified", "Proposal Sent", "Closed"])
        .withMessage("Invalid input: 'status' must be one of ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'].")
]
const leadsValidationToUpdate = [

    body("source")
        .optional()
        .trim()
        .isIn(["Website", "Referral", "Cold Call"])
        .withMessage(
            "Invalid source. Allowed values: Website, Referral, Cold Call."
        ),

    body("status")
        .optional()
        .trim()
        .isIn(["New", "Contacted", "Qualified", "Proposal Sent", "Closed"])
        .withMessage(
            "Invalid status. Allowed values: New, Contacted, Qualified, Proposal Sent, Closed."
        ),

    body("tags")
        .optional()
        .isArray()
        .withMessage(
            "Invalid tags format. Tags must be an array."
        ),

    body("tags.*")
        .optional()
        .trim()
        .isIn(["High Value", "Follow-up"])
        .withMessage(
            "Invalid tag value. Allowed values: High Value, Follow-up."
        ),

    body("timeToClose")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
            "Invalid timeToClose. It must be a positive integer."
        ),

    body("priority")
        .optional()
        .trim()
        .isIn(["High", "Medium", "Low"])
        .withMessage(
            "Invalid priority. Allowed values: High, Medium, Low."
        ),
];



const commentValidation = [
    param("id").notEmpty().withMessage("Please provide lead id").isMongoId().withMessage("Invalid lead id."),
    body("commentText")
        .trim()
        .notEmpty()
        .withMessage("Comment text is required")
        .isLength({ min: 3, max: 500 })
        .withMessage("Comment must be between 3 and 500 characters"),
    
    body("author")
        .trim()
        .notEmpty()
        .withMessage("Author name is required")
        .isLength({ min: 2 })
        .withMessage("Author name must be at least 2 characters"),

]
const paramIdValidation = [
    param("id").notEmpty().withMessage("Please provide lead id").isMongoId().withMessage("Invalid lead id."),
]

const validateStatusUpdate = [
    param("id").notEmpty().withMessage("Please provide lead id").isMongoId().withMessage("Invalid lead id."),
    body("status").trim().notEmpty().withMessage("Status must be present.").isIn(["New", "Contacted", "Qualified", "Proposal Sent", "Closed"])
        .withMessage("Invalid input: 'status' must be one of ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed']."),

    body("salesAgent")
        .notEmpty()
        .withMessage("Please provide sales id").isMongoId().withMessage("Invalid sales agent id"),


]

router.post("/", leadsValidation, addLeads)
router.post("/:id/comments", commentValidation, addComments)
router.get("/", queryValidation, getAllLeads)
router.get("/:id", paramIdValidation, getLeadDetails)
router.get("/:id/comments", paramIdValidation, getAllComments)
router.patch("/:id", leadsValidationToUpdate, updateLeads)
router.delete("/:id", deleteLead)


module.exports = router 
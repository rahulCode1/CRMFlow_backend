const express = require("express");
const router = express.Router();
const {
  addNewSalesAgent,
  getAllSalesAgents,
  deleteSalesAgent,
} = require("../controllers/salesAgent-controller");
const { body } = require("express-validator");
const authCheck = require("../middlewares/auth_check");
const fileUpload = require("../middlewares/file-upload");

const salesAgentValidation = [
  body("name").trim().notEmpty().withMessage("Name must be present."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

router.post(
  "/",
  fileUpload.single("image"),
  salesAgentValidation,
  authCheck,
  addNewSalesAgent,
);
router.get("/", getAllSalesAgents);
router.delete("/:id", authCheck, deleteSalesAgent);

module.exports = router;

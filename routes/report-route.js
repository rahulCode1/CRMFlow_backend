const express = require("express")
const router = express.Router()
const { getAllLeadsClosedLastWeek, getTotalLeadsInPipeline, getLeadsClosedByAgent } = require("../controllers/report-controller")

router.get("/last-week", getAllLeadsClosedLastWeek)
router.get("/pipeline", getTotalLeadsInPipeline)
router.get("/closed-by-agent", getLeadsClosedByAgent)

module.exports = router 
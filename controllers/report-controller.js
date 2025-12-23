
const HttpError = require("../models/http-error")
const Lead = require("../models/leads-model")


const getAllLeadsClosedLastWeek = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)


        const leads = await Lead.find({ status: "Closed", closedAt: { $gte: sevenDaysAgo } }).populate("salesAgent", "name").select("name salesAgent, closedAt")

        if (leads) {
            const response = leads.map((lead) => ({
                id: lead._id,
                name: lead.name,
                salesAgent: lead.salesAgent.name,
                closedAt: lead.closedAt,
                id: lead._id
            }));


            res.status(201).json({ success: true, message: "All leads find successfully that closed last week", leads: response })
        } else {
            return next(new HttpError("No lead find that closed last week.", 404))
        }

    } catch (error) {
        next(error)
    }
}

const getTotalLeadsInPipeline = async (req, res, next) => {
    try {

        const activeLeads = await Lead.countDocuments({ status: { $ne: "Closed" } })
        const closedLeads = await Lead.countDocuments({ status: "Closed" })

        // console.log(closedLeads)

        res.status(200).json({ activeLeads, closedLeads })

    } catch (error) {
        return next(error)
    }
}

const getLeadsClosedByAgent = async (req, res, next) => {
    try {
        const leads = await Lead.find({ status: "Closed" }).populate("salesAgent")


       

        const closedByAgent = leads.reduce((acc, lead) => {

            if (lead.status !== "Closed") return acc;

            const agentName = lead.salesAgent ?  lead.salesAgent.name : "Unknown"


            if (!acc[agentName]) {
                acc[agentName] = 0;
            }


            acc[agentName] += 1;

            return acc;
        }, {});

       

        
        const response = Object.entries(closedByAgent).map(
            ([agent, count]) => ({
                salesAgent: agent,
                closedLeads: count
            })
        );

        res.status(201).json({ success: true, leads: response })
    } catch (error) {
        next(error)
    }
}




module.exports = { getAllLeadsClosedLastWeek, getTotalLeadsInPipeline, getLeadsClosedByAgent }
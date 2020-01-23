const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const config = require('../../env/config')

router.get('/', (req, res) => {
    mongo.connect('mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority', async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result = await getCompanies(client, req.body.id)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})



// Helper Functions
async function getCompanies(client, id){
    if (!ObjectId.isValid(id)) {
        return { code: 400, message: "Invalid company ID" }
    }
    let info = await client.db('job_recruitment').collection("companies").aggregate([{
        $match: {
            _id: ObjectId(id)
        }
    },
    {
        $lookup: {
            from: "jobs",
            localField: "jobs",
            foreignField: "_id",
            as: "jobs"
        }
    }]).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Companies does not exist" }
    } else {
        delete info[0].recruiters;
        info[0].jobs.map(job => {
            delete job.companyID
        })
        return { code: 200, info: info[0] }
    }
}


module.exports = router;
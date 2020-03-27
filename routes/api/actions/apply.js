const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')

router.post("/:job_ID", (req, res) => {
    // body: CV_ID
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        }
        let validate = await client.db('job_requirement').collection('cvs').find({ "_id": req.body.CV_ID }).limit(1).toArray
        if (validate.length == 0) {
            return res.status(400).json({ message: `No CV with ID ${req.body.CV_ID}` })
        }
        client.db('job_requirement').collection('jobs').updateOne({ "_id": ObjectId(req.params.job_ID) }, {
            $push: {
                "cvs": ObjectId(req.params.job_ID)
            }
        })
        client.db('job_requirement').collection('cvs').updateOne({ "_id": ObjectId(req.body.CV_ID) }, {
            $set: {
                "job_ID": req.params.job_ID
            }
        })
        return res.status(200).json({ "message": "CV has been sent" })
    })
})

router.delete("/:job_ID", (req, res) => {
    // body: CV_ID
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        }
        let validate = await client.db('job_requirement').collection('cvs').find({ "_id": req.body.CV_ID }).limit(1).toArray
        if (validate.length == 0) {
            return res.status(400).json({ message: `No CV with ID ${req.body.CV_ID}` })
        }
        client.db('job_requirement').collection('jobs').updateOne({ "_id": ObjectId(req.params.job_ID) }, {
            $pull: {
                "cvs": ObjectId(req.params.job_ID)
            }
        })
        client.db('job_requirement').collection('cvs').updateOne({ "_id": ObjectId(req.body.CV_ID) }, {
            $set: {
                "job_ID": null
            }
        })
        return res.status(200).json({ "message": "CV has been unsent" })
    })
})

module.exports = router;
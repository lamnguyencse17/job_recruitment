const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const fs = require('fs')
const errorLog = require('../../../logging/modules/errorLog')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'

router.get('/:profile_ID/:file_name', async (req, res) => {
    if (!ObjectId.isValid(req.params.profile_ID)){
        return res.status(400).json({message: "profile ID is not valid"})
    }
    let permission = true
    let path = `./uploads/${req.params.profile_ID}/${req.params.file_name}`
    if (req.role == 2) {
        mongo.connect(dataPath, async (err, client) => {
            if (err) {
                errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
                return res.status(400).status({ message: "Database system is not available" })
            }
            let recruiter = await client.db('job_recruitment').collection('jobs').find({ "recruiter_ID": ObjectId(req.user) }).toArray()
            let result = await client.db('job_recruitment').collection('cvs').find({
                $and: [
                    { "profile_ID": ObjectId(req.params.profile_ID) },
                    { "proof": path }
                ]
            }).toArray()
            if (recruiter.length == 0 || result.length == 0) {
                permission = false
            } else {
                permission = true
            }
        })
    }
    if (permission) {
        if (fs.existsSync(path)) {
            return res.download(path)
        } else {
            return res.status(400).json({ message: "Does not exist" })
        }
    } else {
        return res.status(401).json({ message: "Not Authorized or Not found" })
    }
})

router.delete('/:profile_ID/:file_name', async (req, res) => {
    let path = `./uploads/${req.params.profile_ID}/${req.params.file_name}`
    if (fs.existsSync(path)) {
        fs.unlink(path, (err) => {
            if (err) {
                errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
                return res.status(400).json({ message: err })
            } else {
                return res.status(200).json({ info: `Deleted file ${req.params.file_name}` })
            }
        })
    } else {
        return res.status(400).json({ message: "Does not exist" })
    }
})

module.exports = router;
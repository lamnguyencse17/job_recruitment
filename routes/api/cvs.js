const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const config = require('../../env/config')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'

router.get('/', (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result
            if (req.body.id != -1) {
                result = await getCVS(client, req.body.id)
            }
            else {
                result = await getAllCVS(client, req.body.page)
            }
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})


//Helper Functions
function getAllCVS(client, id) { // Security check later. Fundamental first. id: Job ID
    if (!ObjectId.isValid(id)) {
        return { code: 400, message: "Invalid CV ID" }
    }
    let info = client.db('job_recruitment').collection('cvs').find({ "job_ID": ObjectId(id) }).toArray()
    return { code: 200, result: info }
}

function getCVS(client, id) { // Security check later. Fundamental first. id: CV ID
    if (!ObjectId.isValid(id)) {
        return { code: 400, message: "Invalid CV ID" }
    }
    let info = client.db('job_recruitment').collection('cvs').find({ "_id": ObjectId(id) }).toArray()
    return { code: 200, result: info[0] }
}


module.exports = router;
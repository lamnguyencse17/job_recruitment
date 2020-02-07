const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')

// Newsletter service

router.post('/', (req, res) => {
    // body: email
    if (!validateEmail(req.body.email)){
        return res.status(400).json({message: "Invalid Email"})
    }
    mongo.connect(dataPath, (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).status({ message: "Database system is not available" })
        }
        let result = client.db("job_recruitment").collection("newsletter").insertOne({"email": req.body.email})
        if (!result.acknowledged){
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, "insertOne - Acknowledged failed")
            return res.status(200).json({message: "Newsletter subscription went wrong"})
        }
        return res.status(200).json({message: "Newsletter subscribed"})
    })
    
})

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email.toLowerCase());
}

module.exports = router;
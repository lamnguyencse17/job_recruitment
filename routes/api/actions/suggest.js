const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')

router.post('/', (req, res) => {
    // body: partial search in tag 
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        }
        let result = await client.db("job_recruitment").collection("tags").find({name: {$regex: new RegExp(`${req.body.partial}*`) , $options: "$i" }}).toArray()
        return res.status(200).json(result)
    })
})

module.exports = router;
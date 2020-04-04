const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')

router.use('/', (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        }
        let collection = req.url.split("?")[0]
        if (collection == "/") {
            collection = ["companies", "jobs"]
        } else {
            collection = [collection.replace("/", "")]
        }
        let result = await queryTerm(client, req.query.term, collection)
        return res.status(200).json(result)
    })
})

async function queryTerm(client, term, collections) {
    let result = {}
    collections.map(async (collection) => {
        result[`${collection}`] = await client.db("job_recruitment").collection(`${collection}`).find({ $or: [{ "name": { $regex: term } }, { "description": { $regex: term } }] }).toArray()
    })
    return result
}

module.exports = router;
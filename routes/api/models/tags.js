const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const redis = require("redis");
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const redis_client = redis.createClient(17054, "redis-17054.c53.west-us.azure.cloud.redislabs.com");
const cacheLog = require('../../../logging/modules/cacheLog.js')
const errorLog = require('../../../logging/modules/errorLog')

redis_client.auth('zodiac3011', (err) => {
    if (err) {
        errorLog.writeLog(__dirname, null, "auth", null, err)
        throw (err)
    }
})

router.get('/:tag/companies/:page', (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            if (req.cached) {
                return res.status(200).json(JSON.parse(req.cached))
            }
            else {
                    let result = await getTagsAndCompanies(client, req.params.page, req.params.tag)
                if (!result.message) {
                    redis_client.setex(`tags_${req.params.tag}_${req.params.page}`, 3600, JSON.stringify(result.info), (err) => {
                        cacheLog.writeLog(req.path, req.params, err)
                    })
                }
                return res.status(result.code).json(result.message ? result.message : result.info)
            }
        }
    })
})

async function getTagsAndCompanies(client, page, tag){
    let info = await client.db('job_recruitment').collection("companies").find({
        $query: {tag: tag},
        $orderby: { $natural: -1 }
    }).limit(page * 10).toArray()

    info.map(field => {
        delete field.recruiters
        delete field.cvs
    })
    return { code: 200, info: info }
}

module.exports = router;
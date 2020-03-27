const redis = require('redis')
const cacheLog = require('../logging/modules/cacheLog')
const redis_client = redis.createClient(17054, "redis-17054.c53.west-us.azure.cloud.redislabs.com");
const errorLog = require('../logging/modules/errorLog')

redis_client.auth('zodiac3011', (err) => {
    if (err) {
        errorLog.writeLog("Redis Middleware", __dirname, "auth", null, err)
    }
})

module.exports = () => {
    // redis_client.flushall()
    return async function (req, res, next) {
        let params = req.path.split('/')
        params = params[params.length - 1]
        if (!req.path.includes("/api/companies", "/api/jobs", "/api/tags")) {
            next()
        } else {
            let id
            if (req.path.includes("/api/jobs")) {
                id = `jobs_${params}`
            }
            if (req.path.includes("/api/companies")) {
                id = `companies_${params}`
            }
            console.log(id)
            redis_client.get(id, (err, reply) => {
                console.log(reply)
                if (err) {
                    cacheLog.writeLog(req.path, params, err)
                    errorLog.writeLog("Redis Middleware", __dirname, "get", null, err)
                    return res.status(400).json({ message: "Cache system gone wrong" })
                }
                if (reply != null) {
                    req.cached = reply
                }
                next()
            })
        }
    }
}
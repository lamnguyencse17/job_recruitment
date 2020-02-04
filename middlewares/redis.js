const redis = require('redis')
const cacheLog = require('../logging/modules/cacheLog')
const redis_client = redis.createClient(17054, "redis-17054.c53.west-us.azure.cloud.redislabs.com");
redis_client.auth('zodiac3011', (err) => {
    if (err) {
        console.log(err)
    }
})

module.exports = () => {
    return async function (req, res, next) {
        let params = req.path.split('/')
        params = params[params.length - 1]
        if (!req.path.includes("/api/companies","/api/jobs")){
            next()
        } else {
            let id
        if (req.path.includes("/api/jobs")){
                id = `jobs_${params}`
        }
        if (req.path.includes("/api/companies")){
                id = `companies_${params}`
        }
        redis_client.get(id, (err, reply) => {
            if (err) {
                cacheLog.writeLog(req.path, params, err)
                return res.status(400).json({message: "Cache system gone wrong"})
            }
            if (reply != null){
                req.cached = reply
            }
            next()
        })
        }
    }
}
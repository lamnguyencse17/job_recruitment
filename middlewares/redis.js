const redis = require('redis')
const redis_client = redis.createClient(17054, "redis-17054.c53.west-us.azure.cloud.redislabs.com");
redis_client.auth('zodiac3011', (err) => {
    if (err) {
        console.log(err)
    }
})

module.exports = () => {
    return async function (req, res, next) {
        if (!["/api/jobs", "/api/companies"].includes(req.path)){
            next()
        } else {
            let id
        if (req.path == "/api/jobs"){
            if (req.body.job_ID == "-1"){
                id = "AllJobs"
            }
            else id = req.body.job_ID
        }
        if (req.path == "/api/companies"){
            if (req.body.page){
                id = req.body.page
            }
            else id = req.body.company_ID
        }
        redis_client.get(id, (err, reply) => {
            if (err) {
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
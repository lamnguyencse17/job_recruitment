const jwt = require('jsonwebtoken')
const config = require('../env/config')
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'

module.exports = () => {
    return async function (req, res, next) {
        let params = req.path.split('/')
        params = params[params.length - 1]
        let token = req.headers['x-access-token'];
        verifyObjectId(req.body).catch((value) => {
            return res.status(400).json({message: `${value} was invalid`})
        })
        if (!req.path.includes("/auth")){
            console.log(req.path)
            if (["/api/companies", "/api/profiles", "/api/jobs"].includes(req.path)){
                return res.status(400).json({ message: "Not Found" })
            }
            if (req.method != "GET" && ObjectId.isValid(params)){
                return res.status(400).json({message: `${params} ID was invalid`})
            } else if (!(/^\d+$/.test(params) || ObjectId.isValid(params))){
                return res.status(400).json({message: `${params} ID was invalid`})
            }
        }
        let result = await jwtVerify(token, req)
        if (req.path == "/api/cvs") {
            if (!result) {
                return res.status(401).json({ message: "Token Failed" })
            }
        }
        next()
    }
}

async function verifyObjectId(body) {
    for (let [key, value] of Object.entries(body)) {
        if (typeof(value) == "object"){
            if(!verifyObjectId(value)){
                throw(value)
            }
        }
        if (["profile_ID", "company_ID", "CV_ID", "recruiter_ID", "job_ID"].includes(key)) {
            if (!ObjectId.isValid(value)) {
                throw(value)
            }
        }
    }
}

async function jwtVerify(token, req) {
    return jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return false
        }
        let result = await dbVerify(token, decoded)
        if (!result) {
            return false
        } else {
            req.user = decoded.id
            req.role = decoded.role
            return true
        }
    })
}


async function dbVerify(token, decoded) {
    return await mongo.connect(dataPath).then(async client => {
        let db = await client.db('job_recruitment').collection('profiles');
        let info = await db.find({ "_id": ObjectId(decoded.id) }).toArray()
        if (info.length == 0) {
            return false
        } else {
            if (token == info[0].auth.token) {
                return true
            } else {
                return false
            }
        }
    })
}
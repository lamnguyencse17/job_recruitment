const jwt = require('jsonwebtoken')
const config = require('../env/config')
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'

module.exports = () => {
    return async function (req, res, next) {
        if (req.path == "/api/cvs") {
            let token = req.headers['x-access-token'];
            jwt.verify(token, config.secret, async (err, decoded) => {
                let result = await mongo.connect(dataPath).then(async client => {
                    var db = await client.db('job_recruitment').collection('profiles');
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
                if (!result) {
                    return res.status(401).json({ message: "Not Logged In" })
                } else {
                    req.user = decoded.id
                    req.role = decoded.role
                    next()
                }
            })
        } else {
            next()
        }
    }
}
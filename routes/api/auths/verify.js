const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const config = require('../../../env/config')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')
const bcrypt = require('bcryptjs')


router.get('/', (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: "No token provided." });
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) { return res.status(401).send({ message: 'Failed to authenticate token.' }) } else {
            mongo.connect(dataPath, async (err, client) => {
                if (err) {
                    errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
                    return res.status(400).json({ message: "Database system is not available" })
                } else {
                    var db = await client.db('job_recruitment').collection('profiles');
                    let info = await db.find({ "_id": ObjectId(decoded.id) }).toArray()
                    if (info.length == 0) {
                        return res.status(400).json({ message: "Token verification failed" })
                    }
                    else {
                        if (token == info[0].auth.token) {
                            return res.status(200).json(decoded)
                        }
                        else {
                            return res.status(400).json({ message: "Expired token" })
                        }
                    }
                }
            })
        }
    })
})
router.post('/', (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        }
        let info = await client.db('job_recruitment').collection('profiles').find({ "_id": ObjectId(req.user) }).toArray();
            if (info.length == 0) {
                res.status(400).json({ message: "Username does not exist" })
            } else {
                if (bcrypt.compareSync(req.body.password, info[0].auth.password)){
                    return res.status(200).json({message: "Verified"})
                }
                return res.status(401).json({message: "Not Verified"})
            }
    })
})
module.exports = router;
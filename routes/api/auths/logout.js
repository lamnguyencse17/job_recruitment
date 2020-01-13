const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const config = require('../../../env/config')

router.post('/', (req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: "No token provided." });
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) { return status(500).send({ message: 'Failed to authenticate token.' }) } else {
            mongo.connect('mongodb://localhost:27017/job_recruitment', async (err, client) => {
                if (err) {
                    console.log(err);
                } else {
                    var db = await client.db('job_recruitment').collection('auths');
                    let info = await db.find({ "_id": ObjectId(decoded.id)  }).toArray()
                    if (info.length == 0) {
                        return res.status(400).json({ message: "Token verification failed" })
                    }
                    else {
                        if (token == info[0].token) {
                            db.update({_id: ObjectId(decoded.id)}, {
                                $set: {
                                    token: ""
                                }
                            })
                            return res.status(200).json({message: "Logged out"})
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
module.exports = router;
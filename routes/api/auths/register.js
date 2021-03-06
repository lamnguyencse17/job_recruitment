const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../../../env/config')
const ObjectId = require('mongodb').ObjectId
const authLog = require('../../../logging/modules/authLog')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')




router.get('/', (req, res) => {
    res.status(400).send("forbidden")
})

router.post('/', async (req, res) => {
    let username = req.body.username;
    let role = req.body.role; // 1: normal user, 2: recruiter
    let password = bcrypt.hashSync(req.body.password, 8);
    let company_ID = req.body.company_ID
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            var db = await client.db('job_recruitment').collection('profiles');
            let info = await db.find({ "auth.username": username }).toArray()
            if (info.length != 0) {
                res.status(400).json({ message: "Username existed" })
            }
            else {
                let token
                db = await client.db('job_recruitment').collection('profiles');
                info = await db.insertOne({ "auth": { username: username, password: password, token: "" }, "role": role })
                if (role == 2) {
                    db.updateOne({ _id: info.ops[0]._id }, {
                        $set: {
                            "company_ID": ObjectId(company_ID)
                        }
                    })
                    token = jwt.sign({ id: info.ops[0]._id, role: role, company_ID: company_ID }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    db.update({ _id: info.ops[0]._id }, {
                        $set: {
                            "auth.token": token
                        }
                    })
                    client.db('job_recruitment').collection('companies').findOneAndUpdate({ "_id": ObjectId(company_ID) }, {
                        $push: {
                            "recruiters": info.ops[0]._id
                        }
                    })
                } else {
                    token = jwt.sign({ id: info.ops[0]._id, role: role }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    db.update({ _id: info.ops[0]._id }, {
                        $set: {
                            "auth.token": token
                        }
                    })
                }
                let path = './logging/logs/auth'
                authLog.writeLog(info.ops[0]._id, path)
                return res.status(200).json({ id: info.ops[0]._id, token: token }) // Clearly it will only return 1
            }
        }
    });
})

module.exports = router;
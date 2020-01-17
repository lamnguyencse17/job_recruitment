const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../../../env/config')
const ObjectId = require('mongodb').ObjectId



router.get('/', (req, res) => {
    res.status(400).send("forbidden")
})

router.post('/', async (req, res) => {
    let username = req.body.username;
    let role = req.body.role; // 1: normal user, 2: recruiter
    let password = bcrypt.hashSync(req.body.password, 8);
    let companyID = req.body.companyID
    mongo.connect('mongodb://localhost:27017/job_recruitment', async (err, client) => {
        if (err) {
            console.log(err);
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
                            "companyID": ObjectId(companyID)
                        }
                    })
                    token = jwt.sign({ id: info.ops[0]._id, role: role, companyID: companyID }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    db.update({ _id: info.ops[0]._id }, {
                        $set: {
                            "auth.token": token
                        }
                    })
                    client.db('job_recruitment').collection('companies').findOneAndUpdate({ "_id": ObjectId(companyID) }, {
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
                return res.status(200).json({ id: info.ops[0]._id, token: token }) // Clearly it will only return 1
            }
        }
    });
})

module.exports = router;
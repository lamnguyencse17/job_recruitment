const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../../../env/config')



router.get('/', (req, res) => {
    res.status(400).send("forbidden")
})

router.post('/', async (req, res) => {
    var username = req.body.username;
    var password = bcrypt.hashSync(req.body.password, 8);
    mongo.connect('mongodb://localhost:27017/job_recruitment', async (err, client) => {
        if (err) {
            console.log(err);
        } else {
            var db = await client.db('job_recruitment').collection('auths');
            let info = await db.find({ "username": username }).toArray()
            if (info.length != 0) {
                res.status(400).json({ message: "Username existed" })
            }
            else {
                db = await client.db('job_recruitment').collection('auths');
                info = await db.insertOne({ username: username, password: password, token: "token" })
                var token = jwt.sign({id: info.ops[0]._id}, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                update = await db.update({_id: info.ops[0]._id},{
                    $set: {
                        token: token
                    }
                })
                res.status(200).json({ id: info.ops[0]._id, token: token }) // Clearly it will only return 1
            }
        }
    });
})

module.exports = router;
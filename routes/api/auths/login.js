const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../../env/config')



router.get('/', (req, res) => {
    res.status(400).send("forbidden")
})

router.post('/', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log(password)
    mongo.connect('mongodb://localhost:27017/job_recruitment', async (err, client) => {
        if (err) {
            console.log(err);
        } else {
            var db = await client.db('job_recruitment').collection('auths');
            let info = await db.find({ "username": username }).toArray() // Clearly it will only return 1
            if (info.length == 0) {
                res.status(400).json({ message: "Username does not exist" })
            } else {
                if (bcrypt.compareSync(password, info[0].password)) {
                    var token = jwt.sign({id: info[0]._id}, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    update = await db.update({_id: info[0]._id},{
                        $set: {
                            token: token
                        }
                    })
                    return res.status(200).json({ id: info[0]._id, token: token })
                }
                else {
                    res.status(400).json({ message: "Wrong credentials" })
                }
            }
        }
    });
})

module.exports = router;
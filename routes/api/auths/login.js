const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../../env/config')
const authLog = require('../../../logging/modules/authLog')




router.get('/', (req, res) => {
    res.status(400).send("forbidden")
})

router.post('/', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    mongo.connect('mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority', async (err, client) => {
        if (err) {
            console.log(err);
        } else {
            var db = await client.db('job_recruitment').collection('profiles');
            let info = await db.find({"auth.username": username }).toArray() // Clearly it will only return 1
            if (info.length == 0) {
                res.status(400).json({ message: "Username does not exist" })
            } else {
                if (bcrypt.compareSync(password, info[0].auth.password)) {
                    var token = jwt.sign({ id: info[0]._id, role: info[0].role }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    // eslint-disable-next-line no-unused-vars
                    let update = await db.update({ _id: info[0]._id }, {
                        $set:  {
                            "auth.token": token
                        }
                    })
                    let path = './logging/logs/auth'
                    authLog.writeLog(info[0]._id, path)
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
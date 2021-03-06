const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../../../env/config')
const authLog = require('../../../logging/modules/authLog')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')

router.post('/', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            var db = await client.db('job_recruitment').collection('administrators');
            let info = await db.find({ "username": username }).toArray() // Clearly it will only return 1
            if (info.length == 0) {
                res.status(400).json({ message: "Username does not exist" })
            } else {
                if (bcrypt.compareSync(password, info[0].password)) {
                    var token = jwt.sign({ id: info[0]._id }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    // eslint-disable-next-line no-unused-vars
                    let update = await db.updateOne({ _id: info[0]._id }, {
                        $set: {
                            "token": token
                        }
                    })
                    let path = './logging/logs/auth'
                    authLog.readLog(info[0]._id, path)
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
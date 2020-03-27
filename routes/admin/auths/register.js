const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../../../env/config')
const authLog = require('../../../logging/modules/authLog')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')
const randomizer = require('generate-password')

router.use((req, res, next) => {
    if (["GET", "DELETE", "PUT"].includes(req.method)) {
        return res.status(400).json({ "message": "Not allowed" })
    }
    next()
})

router.post('/', (req, res) => {
    let username = req.body.username;
    let password = bcrypt.hashSync(req.body.password, 8);
    let phrase = req.body.phrase;
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result = await preRegister(client, username, phrase)
            if (result) {
                let feedback = await client.db("job_recruitment").collection("administrators").insertOne({
                    "username": username,
                    "password": password,
                    "phrase": randomizer.generate({
                        length: 10,
                        numbers: true
                    }),
                    "referer": result.username,
                    "token": ""
                })
                let token = jwt.sign({ id: feedback.insertedId }, config.secret, {
                    expiresIn: 86400 // 24 hours
                })
                client.db("job_recruitment").collection("administrators").updateOne({ "_id": ObjectId(feedback.insertedId) }, {
                    $set: {
                        "token": token
                    }
                })
                let path = './logging/logs/auth'
                authLog.writeLog(feedback.insertedId, path)
                return res.status(200).json({ "info": "Registered", "token": token })
            }
        }
    })
})

async function preRegister(client, username, phrase) {
    let userCheck = await client.db("job_recruitment").collection("administrators").find({ "username": username }).toArray()
    if (userCheck.length == 0) {
        let phraseCheck = await client.db("job_recruitment").collection("administrators").find({ "phrase": phrase }).toArray()
        if (phraseCheck.length == 0) {
            return false
        } else {
            return phraseCheck[0]
        }
    } else {
        return false
    }
}

module.exports = router;
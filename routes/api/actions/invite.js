const express = require('express')
const router = express.Router();
const nodemailer = require('nodemailer')
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const errorLog = require('../../../logging/modules/errorLog')

// Invite a friend

router.post('/', (req, res) => {
    // body: email
    if (!validateEmail(req.body.email)){
        return res.status(400).json({message: "Invalid Email"})
    }
    mongo.connect(dataPath, (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        }
        let username = client.db("job_recruitment").collection("profiles").find({"_id": ObjectId(req.user)}).toArray()
        username = username[0].auth.username
        inviteMail(req.body.email, username, req)
        return res.status(200).json({message: "Invite sent"})
    })
})

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email.toLowerCase());
}

function inviteMail(email, username, req) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mailserver@gmail.com',
            pass: 'password'
        }
    });
    let mainOptions = {
        from: 'Job_Recruitment',
        to: email,
        subject: `${username} has invited you to join job_recruitment`,
        text: "Job_recruitment is a simulating environment to learn code",
        html: `<a href="127.0.0.1/register">127.0.0.1/register</a>`
    }
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

module.exports = router;
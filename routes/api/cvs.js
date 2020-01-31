const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const config = require('../../env/config')
const multer = require('multer')
const fs = require('fs');

const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'

const storage = multer.diskStorage({
    destination: async function (req, file, callback) {
        let id = req.body.profile_ID
        let token = req.headers['x-access-token'];
        let error = null
        let auth = await verifyToken(token)
        if (!auth.result || id != auth.id) {
            error = "Can't verify token"
        } else {
            if (!fs.existsSync(`./uploads/${id}`)) {
                fs.mkdirSync(`./uploads/${id}`)
            }
        }
        callback(error, `./uploads/${id}`);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const proofUpload = multer({ storage: storage }).array('proof', 5);

router.get('/', async (req, res) => {
    let token = req.headers['x-access-token'];
    let auth = await verifyToken(token)
    if (!auth.result) {
        return res.status(400).json({ message: "Can't verify token" })
    }
    else {
        mongo.connect(dataPath, async (err, client) => {
            if (err) {
                return res.status(400).json({ message: err })
            } else {
                let result
                if (req.body.CV_ID) {
                    result = await getCVS(client, req.body.CV_ID, auth.id)
                } else {
                    if (req.body.profile_ID == auth.id) {
                        result = await getAllCVS(client, req.body.profile_ID)
                    }
                    else {
                        return res.status(400).json({ message: "Not Authorized" })
                    }
                }
                return res.status(result.code).json(result.message ? result.message : result.info)
            }
        })
    }
})

router.post('/', async (req, res) => {
    proofUpload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err });
        }
        else {
            let proofPath = []
            req.files.map(file => {
                proofPath.push(file.path)
            })
            mongo.connect(dataPath, async (err, client) => {
                if (err) {
                    return res.status(400).json({ message: err })
                } else {
                    let result = await postCVS(client, req.body.profile_ID, req.body.job_ID, JSON.parse(req.body.detail), proofPath)
                    return res.status(result.code).json(result.message ? result.message : result.info)
                }
            })
        }
    })

})


//Helper Functions
async function getAllCVS(client, profile_id) { // get all cvs of profile_id
    if (!ObjectId.isValid(profile_id)) {
        return { code: 400, message: "Invalid CV ID" }
    }
    let info = await client.db('job_recruitment').collection('cvs').find({ "profile_ID": ObjectId(profile_id) }).toArray()
    return { code: 200, info: info }
}

async function getCVS(client, cvid, id) { // get single cv
    if (!ObjectId.isValid(cvid)) {
        return { code: 400, message: "Invalid CV ID" }
    }
    let info = await client.db('job_recruitment').collection('cvs').find({ "_id": ObjectId(cvid), "profile_ID": ObjectId(id) }).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Not Authorized" }
    } else {
        return { code: 200, info: info[0] }
    }

}

async function postCVS(client, profile_id, job_id, detail, proofPath) {
    let experience = detail.experience // array
    let education = detail.education // array
    let description = detail.description // text
    let info = await client.db('job_recruitment').collection("cvs").insertOne({
        "profile_ID": ObjectId(profile_id),
        "job_ID": ObjectId(job_id),
        "experience": experience,
        "education": education,
        "proof": proofPath,
        "description": description
    })
    info = info.ops[0]
    client.db('job_recruitment').collection('profiles').findOneAndUpdate({ "_id": ObjectId(profile_id) }, {
        $push: {
            "cvs": info._id
        }
    })
    client.db('job_recruitment').collection('jobs').findOneAndUpdate({ "_id": ObjectId(job_id) }, {
        $push: {
            "cvs": info._id
        }
    })
    return { code: 200, message: info }
}

async function verifyToken(token) {
    return jwt.verify(token, config.secret, async (err, decoded) => {
        let result = await mongo.connect(dataPath).then(async client => {
            var db = await client.db('job_recruitment').collection('profiles');
            let info = await db.find({ "_id": ObjectId(decoded.id) }).toArray()
            if (info.length == 0) {
                return false
            } else {
                if (token == info[0].auth.token) {
                    return true
                } else {
                    return false
                }
            }
        })
        return { result: result, id: result ? decoded.id : null }
    })
}

module.exports = router;
const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const multer = require('multer')
const fs = require('fs');
const errorLog = require('../../../logging/modules/errorLog')

const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'

const storage = multer.diskStorage({
    destination: async function (req, file, callback) {
        let id = req.user
        let error = null
        if (!req.user) {
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
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result
            if (req.body.CV_ID) {
                if (req.role == 2) {
                    let permission = await client.db('job_recruitment').collection('jobs').findOne({
                        $and: [
                            { "recruiter_ID": ObjectId(req.user) },
                            { "cvs": req.body.CV_ID }
                        ]
                    }).toArray()
                    if (permission.length == 0) {
                        return res.status(400).json({ message: "Not Authorized or CV ID not found" })
                    } else {
                        result = await getCVS(client, req.body.CV_ID, req.user)
                    }
                } else {
                    result = await getCVS(client, req.body.CV_ID, req.user)
                }
            } else {
                if (req.body.profile_ID == req.user) {
                    result = await getAllCVS(client, req.body.profile_ID)
                }
                else {
                    return res.status(400).json({ message: "Not Authorized" })
                }
            }
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.post('/', async (req, res) => {
    proofUpload(req, res, function (err) {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        }
        else {
            let proofPath = []
            req.files.map(file => {
                proofPath.push(`./uploads/${req.user}/${file.originalname}`)
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

// PUT METHOD is too hard to handle

router.delete('/', async (req, res) => {
    // body: CV_ID
    mongo.connect(dataPath, async (err, client) => {
        let result = await deleteCVS(client, req.body.CV_ID, req.user)
        return res.status(result.code).json(result.message ? result.message : result.info)
    })
})


//Helper Functions
async function getAllCVS(client, profile_ID) { // get all cvs of profile_id
    let info = await client.db('job_recruitment').collection('cvs').find({ "profile_ID": ObjectId(profile_ID) }).toArray()
    return { code: 200, info: info }
}

async function getCVS(client, CV_ID) { // get single cv
    let info = await client.db('job_recruitment').collection('cvs').find({ "_id": ObjectId(CV_ID) }).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Not Authorized" }
    } else {
        return { code: 200, info: info[0] }
    }
}

async function postCVS(client, profile_ID, job_ID, detail, proofPath) {
    let experience = detail.experience // array
    let education = detail.education // array
    let description = detail.description // text
    let info = await client.db('job_recruitment').collection("cvs").insertOne({
        "profile_ID": ObjectId(profile_ID),
        "job_ID": ObjectId(job_ID),
        "experience": experience,
        "education": education,
        "proof": proofPath,
        "description": description
    })
    info = info.ops[0]
    client.db('job_recruitment').collection('profiles').findOneAndUpdate({ "_id": ObjectId(profile_ID) }, {
        $push: {
            "cvs": info._id
        }
    })
    if (job_ID) {
        client.db('job_recruitment').collection('jobs').findOneAndUpdate({ "_id": ObjectId(job_ID) }, {
            $push: {
                "cvs": info._id
            }
        })
    }
    return { code: 200, message: info }
}

async function deleteCVS(client, CV_ID, profile_ID) {
    let result = await client.db('job_recruitment').collection('cvs').deleteOne({ '_id': ObjectId(CV_ID) });
    if (result.deletedCount == 0) {
        return { code: 400, message: "Nothing to delete" }
    } else {
        client.db('job_recruitment').collection('profiles').findOneAndUpdate({ '_id': ObjectId(profile_ID) }, {
            $pull: {
                cvs: ObjectId(CV_ID)
            }
        })
        client.db('job_recruitment').collection('jobs').findOneAndUpdate({ cvs: ObjectId(CV_ID) }, {
            $pull: {
                cvs: ObjectId(CV_ID)
            }
        })
        return { code: 200, message: `Deleted ${result.deletedCount} cv(s)` }
    }
}

module.exports = router;
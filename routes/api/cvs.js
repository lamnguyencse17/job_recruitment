const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const multer = require('multer')
const fs = require('fs');

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
    if (!req.user) {
        return res.status(400).json({ message: "Can't verify token" })
    }
    else {
        mongo.connect(dataPath, async (err, client) => {
            if (err) {
                return res.status(400).json({ message: err })
            } else {
                let result
                if (req.body.CV_ID) {
                    result = await getCVS(client, req.body.CV_ID, req.user)
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

router.delete('/', async (req, res) => {
    // body: profile_ID, CV_ID
    if (!(req.user || req.user == req.body.profile_ID)) {
        return res.status(400).json({ message: "Not Authorized" })
    } else {
        mongo.connect(dataPath, async (err, client) => {
            let result = await deleteCVS(client, req.body.CV_ID, req.body.profile_ID)
            return res.status(result.code).json(result.message ? result.message : result.info)
        })
    }
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

async function deleteCVS(client, cv_id, profile_id) {
    let result = await client.db('job_recruitment').collection('cvs').deleteOne({
        '_id': ObjectId(cv_id),
        'profile_ID': ObjectId(profile_id)
    });
    console.log(result)
    if (result.deletedCount == 0) {
        return { code: 400, message: "Nothing to delete or Not authorized" }
    } else {
        client.db('job_recruitment').collection('profiles').findOneAndUpdate({ '_id': ObjectId(profile_id) }, {
            $pull: {
                cvs: ObjectId(cv_id)
            }
        })
        client.db('job_recruitment').collection('jobs').findOneAndUpdate({ cvs: ObjectId(cv_id) }, {
            $pull: {
                cvs: ObjectId(cv_id)
            }
        })
        return { code: 200, message: `Deleted ${result.deletedCount} cv(s)` }
    }
}

module.exports = router;
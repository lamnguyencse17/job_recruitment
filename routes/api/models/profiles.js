const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const errorLog = require('../../../logging/modules/errorLog')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'


router.get("/:profile_ID", async (req, res) => { // access own or other profile
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result
            if (req.user == req.params.profile_ID) {
                result = await getProfilesOwner(client, req.params.profile_ID)
            } else {
                result = await getProfilesProtected(client, req.params.profile_ID)
            }
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.post("/", async (req, res) => {
    // body: profile_ID, detail: {name, dob, email}
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result = await postProfiles(client, req.user, req.body)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.put("/", (req, res) => {
    // body: {name, dob, email, date}
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result = await putProfiles(client, req.user, req.body)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.delete("/", (req, res) => {
    // TODOS: Split to function
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let validate = await client.db('job_recruitment').collection('profiles').find({
                "_id": ObjectId(req.user)
            }).toArray()
            if (validate.length == 0) {
                return res.status(401).json({ message: "profile_ID does not exist" })
            } else {
                let result = await deleteProfiles(client, req.user, req.role)
                return res.status(result.code).json(result.message ? result.message : result.info)
            }
        }
    })
})

// Helper Function
async function getProfilesOwner(client, profile_ID) {
    let db = await client.db('job_recruitment').collection('profiles');
    let info = await db.find({ "_id": ObjectId(profile_ID) }).toArray()
    delete info[0].auth
    return { code: 200, info: info[0] }
}

async function getProfilesProtected(client, profile_ID) {
    let db = await client.db('job_recruitment').collection('profiles');
    let info = await db.find({ "_id": ObjectId(profile_ID) }).toArray()
    delete info[0].auth
    delete info[0].cvs
    delete info[0].dob
    return { code: 200, info: info[0] }
}

async function postProfiles(client, profile_ID, detail) {
    var db = await client.db('job_recruitment').collection('profiles');
    let info = await db.find({ "_id": ObjectId(profile_ID) }).toArray() // It will return only once
    if (info.length == 0) {
        return { code: 400, message: "profile_ID not found" }
    } else {
        db.updateOne({ _id: ObjectId(profile_ID) }, {
            $set: {
                "name": detail.name,
                "email": detail.email,
                "dob": detail.dob,
            }
        })
    }
    info = await db.find({ "_id": ObjectId(profile_ID) }).toArray()
    if (info[0].role == 1) {
        db.updateOne({ _id: ObjectId(profile_ID) }, {
            $set: {
                "cvs": []
            }
        })
    }
    delete info[0].auth
    return { code: 200, info: info[0] }
}

async function putProfiles(client, profile_ID, detail) {
    let db = await client.db('job_recruitment').collection('profiles');
    let info = await db.find({ "_id": ObjectId(profile_ID) }).toArray() // It will return only once
    if (info.length == 0) {
        return { code: 400, message: "profile_ID not found" }
    } else {
        db.updateOne({ _id: ObjectId(profile_ID) }, {
            $set: {
                "name": detail.name ? detail.name : info[0].name,
                "email": detail.email ? detail.email : info[0].email,
                "dob": detail.date ? detail.date : info[0].dob
            }
        })
    }
    info = await db.find({ "_id": ObjectId(profile_ID) }).toArray()
    delete info[0].auth
    delete info[0].cvs
    return { code: 200, info: info[0] }
}

async function deleteProfiles(client, profile_ID, role) {
    client.db('job_recruitment').collection('profiles').deleteOne({ _id: ObjectId(profile_ID) })
    if (role == 1) {
        let matches = await client.db('job_recruitment').collection('cvs').find({ "profile_ID": ObjectId(profile_ID) }).toArray()
        matches.map(match => {
            client.db('job_recruitment').collection('jobs').findOneAndUpdate({ cvs: ObjectId(match._id) }, {
                $pull: {
                    cvs: { "profile_ID": ObjectId(profile_ID) }
                }
            })
        })
    } else {
        client.db('job_recruitment').collection('companies').deleteMany({
            $pull: {
                recruiters: { "profile_ID": ObjectId(profile_ID) }
            }
        })
    }
    client.db('job_recruitment').collection('cvs').deleteMany({ "profile_ID": ObjectId(profile_ID) })
    return { code: 200, message: "Deleted" }
}

module.exports = router;
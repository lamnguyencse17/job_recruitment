const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const config = require('../../env/config')

router.get('/', (req, res) => {
    mongo.connect('mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority', async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result = await getCompanies(client, req.body.id)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.post("/", async (req, res) => {
    mongo.connect('mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority', async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result = await postCompanies(client, req.body)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})
router.put("/", async (req, res) => {
    mongo.connect('mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority', async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result = await putCompanies(client, req.body.id, req.body.detail)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.delete("/", async (req, res) => {
    let company_id = req.body.company_id;
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: "No token provided." });
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) { return status(500).send({ message: 'Failed to authenticate token.' }) } else {
            mongo.connect('mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority', async (err, client) => {
                if (err) {
                    console.log(err);
                } else {
                    var db = await client.db('job_recruitment').collection('profiles');
                    let info = await db.find({ "_id": ObjectId(decoded.id) }).toArray()
                    if (info.length == 0) {
                        return res.status(400).json({ message: "Token verification failed" })
                    }
                    if (decoded.role == 1) {
                        return res.status(400).json({ message: "No permission to delete" })
                    }
                    else {
                        if (token == info[0].auth.token) {
                            mongo.connect('mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority', async (err, client) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    let db = await client.db('job_recruitment').collection('companies');
                                    info = await db.find({ "_id": ObjectId(company_id) }).toArray()
                                    if (info.length == 0) {
                                        return res.status(400).json({ message: "Company ID does not exits" })
                                    } else {
                                        // if ((info[0].recruiters).includes(decoded.id)) { //something when wrong here
                                            // eslint-disable-next-line no-unused-vars
                                            let removeCompany = await db.deleteOne({ _id: ObjectId(company_id) })
                                            // eslint-disable-next-line no-unused-vars
                                            let removeJobs = await client.db('job_recruitment').collection('jobs').deleteMany({ companyID: ObjectId(company_id) })
                                            return res.status(200).json({ message: "Deleted" })
                                        // }
                                        // else {
                                        //     return res.status(400).json({ message: "No permission to delete" })
                                        // }
                                    }
                                }
                            })
                        }
                        else {
                            return res.status(400).json({ message: "Expired token" })
                        }
                    }
                }
            })
        }
    })
})


// Helper Functions
async function getCompanies(client, id) {
    if (!ObjectId.isValid(id)) {
        return { code: 400, message: "Invalid company ID" }
    }
    let info = await client.db('job_recruitment').collection("companies").aggregate([{
        $match: {
            _id: ObjectId(id)
        }
    },
    {
        $lookup: {
            from: "jobs",
            localField: "jobs",
            foreignField: "_id",
            as: "jobs"
        }
    }]).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Companies does not exist" }
    } else {
        delete info[0].recruiters;
        info[0].jobs.map(job => {
            delete job.companyID
        })
        return { code: 200, info: info[0] }
    }
}

async function postCompanies(client, detail) {
    let info = await client.db('job_recruitment').collection("companies").insertOne({
        "name": detail.name,
        "location": detail.location,
        "image": detail.image,
        "description": detail.description,
        "size": detail.size,
        "phone": detail.phone,
        "email": detail.email,
        "jobs": [],
        "recruiters": []
    })
    info = info.ops[0]
    return { code: 200, message: info }
}

async function putCompanies(client, id, detail) {
    if (!ObjectId.isValid(id)) {
        return { code: 400, message: "Invalid Companies ID" }
    }
    else {
        let info = await client.db('job_recruitment').collection("companies").find({ "_id": ObjectId(id) }).limit(1).toArray()
        if (info.length == 0) {
            return { code: 400, message: "Job ID does not exist" }
        } else {
            // eslint-disable-next-line no-unused-vars
            let result = await client.db('job_recruitment').collection('companies').updateOne({ "_id": ObjectId(id) }, {
                $set: {
                    "name": detail.name ? detail.name : info[0].name,
                    "location": detail.location ? detail.location : info[0].location,
                    "image": detail.image ? detail.image : info[0].image,
                    "size": detail.size ? detail.size : info[0].size,
                    "description": detail.description ? detail.description : info[0].description,
                    "phone": detail.phone ? detail.phone : info[0].phone,
                    "email": detail.email ? detail.email : info[0].email,
                }
            })
            info[0].name = detail.name ? detail.name : info[0].name
            info[0].location = detail.location ? detail.location : info[0].location
            info[0].image = detail.image ? detail.image : info[0].image
            info[0].size = detail.size ? detail.size : info[0].size
            info[0].description = detail.description ? detail.description : info[0].description
            info[0].phone = detail.phone ? detail.phone : info[0].phone
            info[0].email = detail.email ? detail.email : info[0].email
            return { code: 200, message: info[0] }
        }
    }
}

module.exports = router;
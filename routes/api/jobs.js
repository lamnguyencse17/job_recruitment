const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const config = require('../../env/config')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'


router.get("/", async (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result
            if (req.body.id != -1) {
                result = await getJobs(client, req.body.id)
            }
            else {
                result = await getAllJobs(client, req.body.page)
            }
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.post("/", async (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result = await postJobs(client, req.body.id, req.body.detail)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.put("/", async (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result = await putJobs(client, req.body.id, req.body.detail)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.delete("/", async (req, res) => {
    let job_id = req.body.job_id;
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ message: "No token provided." });
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) { return status(500).send({ message: 'Failed to authenticate token.' }) } else {
            mongo.connect(dataPath, async (err, client) => {
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
                            mongo.connect(dataPath, async (err, client) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    let db = await client.db('job_recruitment').collection('jobs');
                                    info = await db.find({ "_id": ObjectId(job_id) }).toArray()
                                    // eslint-disable-next-line no-unused-vars
                                    let remove = await db.deleteOne({ _id: ObjectId(job_id) })
                                    client.db('job_recruitment').collection('companies').findOneAndUpdate({ "_id": info[0].companyID }, {
                                        $pull: {
                                            jobs: ObjectId(job_id)
                                        }
                                    })
                                    return res.status(200).json({ message: "Deleted" })
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

//Helper functions
async function getAllJobs(client, page) { // page is to make sure that we're sending the right N-th stuff (page1: first 10, page2: second 10)
    let info = await client.db('job_recruitment').collection("jobs").find({
        $query: {},
        $orderby: { $natural: -1 }
    }).limit(page * 10).toArray()
    return { code: 200, info: info }
}

async function getJobs(client, id) {
    if (!ObjectId.isValid(id)) {
        return { code: 400, message: "Invalid Job ID" }
    }
    let info = await client.db('job_recruitment').collection("jobs").aggregate([{
        $match: {
            _id: ObjectId(id)
        }
    },
    {
        $lookup: {
            from: "companies",
            localField: "_id",
            foreignField: "jobs",
            as: "company"
        }
    }]).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Job does not exist" }
    } else {
        delete info[0].companyID;
        delete info[0].company[0].jobs
        return { code: 200, info: info[0] }
    }
}

async function postJobs(client, id, detail) {
    if (!ObjectId.isValid(id)) {
        return { code: 400, message: "Invalid Job ID" }
    }
    let info = await client.db('job_recruitment').collection("companies").find({ "_id": ObjectId(id) }).limit(1).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Company ID does not exist" }
    } else {
        info = await client.db('job_recruitment').collection("jobs").insertOne({
            "name": detail.name,
            "category": detail.category,
            "location": detail.location,
            "salary": detail.salary,
            "description": detail.description,
            "employees": detail.employees,
            "date": detail.date,
            "companyID": ObjectId(id)
        })
        info = info.ops[0]
        client.db('job_recruitment').collection('companies').findOneAndUpdate({ "_id": ObjectId(id) }, {
            $push: {
                "jobs": info._id
            }
        })
        return { code: 200, message: info }
    }
}

async function putJobs(client, id, detail) {
    if (!ObjectId.isValid(id)) {
        return { code: 400, message: "Invalid Job ID" }
    }
    else {
        let info = await client.db('job_recruitment').collection("jobs").find({ "_id": ObjectId(id) }).limit(1).toArray()
        if (info.length == 0) {
            return { code: 400, message: "Job ID does not exist" }
        } else {
            // eslint-disable-next-line no-unused-vars
            let result = await client.db('job_recruitment').collection('jobs').updateOne({ "_id": ObjectId(id) }, {
                $set: {
                    "name": detail.name ? detail.name : info[0].name,
                    "category": detail.category ? detail.category : info[0].category,
                    "location": detail.location ? detail.location : info[0].location,
                    "salary": detail.salary ? detail.salary : info[0].salary,
                    "description": detail.description ? detail.description : info[0].description,
                    "employees": detail.employees ? detail.employees : info[0].employees,
                    "date": detail.date ? detail.date : info[0].date,
                }
            })
            info[0].name = detail.name ? detail.name : info[0].name
            info[0].category = detail.category ? detail.category : info[0].category
            info[0].location = detail.location ? detail.location : info[0].location
            info[0].salary = detail.salary ? detail.salary : info[0].salary
            info[0].description = detail.description ? detail.description : info[0].description
            info[0].employees = detail.employees ? detail.employees : info[0].employees
            info[0].date = detail.date ? detail.date : info[0].date
            return { code: 200, message: info[0] }
        }
    }
}
module.exports = router;
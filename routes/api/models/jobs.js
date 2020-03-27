const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const redis = require("redis");
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const redis_client = redis.createClient(17054, "redis-17054.c53.west-us.azure.cloud.redislabs.com");
const cacheLog = require('../../../logging/modules/cacheLog.js')
const errorLog = require('../../../logging/modules/errorLog')

redis_client.auth('zodiac3011', (err) => {
    if (err) {
        errorLog.writeLog(__dirname, null, "auth", null, err)
        throw (err)
    }
})

router.get("/:job_ID", async (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result
            if (req.cached) {
                return res.status(200).json(JSON.parse(req.cached))
            }
            else {
                result = ObjectId.isValid(req.params.job_ID) ?
                    await getJobs(client, req.params.job_ID) :
                    await getAllJobs(client, req.params.job_ID)
                if (!result.message) {
                    redis_client.setex(`jobs_${req.params.job_ID}`, 3600, JSON.stringify(result.info), (err) => {
                        cacheLog.writeLog(req.path, req.params.job_ID, err)
                        if (err) {
                            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
                        }
                    })
                }
                return res.status(result.code).json(result.message ? result.message : result.info)
            }
        }
    })
})

router.post("/", async (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result = await postJobs(client, req.body.company_ID, req.user, req.body.detail)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.put("/", async (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result = await putJobs(client, req.body.job_ID, req.body.detail)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.delete("/", async (req, res) => {
    // body: job_ID
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let validate = await client.db("job_recruitment").collection("jobs").findOne({ "_id": ObjectId(req.body.job_ID) }).toArray()
            if (validate[0].recruiter_ID == req.user) {
                // eslint-disable-next-line no-unused-vars
                let result = await deleteJobs(client, req.body.job_ID)
            } else {
                return res.status(401).json({ message: "Not Authorized" })
            }
        }
    })
})

//Helper functions
async function getAllJobs(client, page) { // page is to make sure that we're sending the right N-th stuff (page1: first 10, page2: second 10)
    let info = await client.db('job_recruitment').collection("jobs").find({
        $query: {},
        $orderby: { $natural: -1 }
    }).limit(page * 10).toArray()
    info.map(field => {
        delete field.cvs
    })
    return { code: 200, info: info }
}

async function getJobs(client, job_ID) {
    let info = await client.db('job_recruitment').collection("jobs").aggregate([{
        $match: {
            _id: ObjectId(job_ID)
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
        delete info[0].company_ID;
        delete info[0].cvs;
        delete info[0].company[0].jobs
        delete info[0].company[0].recuiters
        return { code: 200, info: info[0] }
    }
}

async function postJobs(client, company_ID, job_ID, detail) {
    let info = await client.db('job_recruitment').collection("companies").find({ "_id": ObjectId(company_ID) }).limit(1).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Company ID does not exist" }
    } else {
        info = await client.db('job_recruitment').collection("jobs").insertOne({
            "company_ID": ObjectId(company_ID),
            "recruiter_ID": ObjectId(job_ID),
            "name": detail.name,
            "category": detail.category,
            "location": detail.location,
            "salary": detail.salary,
            "description": detail.description,
            "employees": detail.employees,
            "date": detail.date,
            "cvs": []
        })
        info = info.ops[0]
        client.db('job_recruitment').collection('companies').findOneAndUpdate({ "_id": ObjectId(company_ID) }, {
            $push: {
                "jobs": info._id
            }
        })
        return { code: 200, message: info }
    }
}

async function putJobs(client, job_ID, detail) {
    let info = await client.db('job_recruitment').collection("jobs").find({ "_id": ObjectId(job_ID) }).limit(1).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Job ID does not exist" }
    } else {
        // eslint-disable-next-line no-unused-vars
        let result = await client.db('job_recruitment').collection('jobs').updateOne({ "_id": ObjectId(job_ID) }, {
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

async function deleteJobs(client, job_ID) {
    // eslint-disable-next-line no-unused-vars
    let result = await client.db("job_recruitment").collection("jobs").deleteOne({ "_id": ObjectId(job_ID) })
    client.db('job_recruitment').collection('companies').findOneAndUpdate({ "jobs": ObjectId(job_ID) }, {
        $pull: {
            jobs: ObjectId(ObjectId(job_ID))
        }
    })
    return { code: 200, message: "Deleted" }
}

module.exports = router;
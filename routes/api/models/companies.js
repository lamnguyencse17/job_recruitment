const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const redis = require('redis')
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


router.get('/:company_ID', (req, res) => {
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
                result = ObjectId.isValid(req.params.company_ID) ?
                    await getCompanies(client, req.params.company_ID) :
                    await getAllCompanies(client, req.params.company_ID)
                if (!result.message) {
                    redis_client.setex(`companies_${req.params.company_ID}`, 3600, JSON.stringify(result.info), (err) => {
                        cacheLog.writeLog(req.path, req.params, err)
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
            let result = await postCompanies(client, req.body)
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
            let result = await putCompanies(client, req.body.company_ID, req.body.detail)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.delete("/", async (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            errorLog.writeLog(req.baseUrl, req.path, req.method, req.body, err)
            return res.status(400).json({ message: "Database system is not available" })
        } else {
            let result = await deleteCompanies(client, req.user, req.body.company_ID)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})


// Helper Functions
async function getAllCompanies(client, page) { // page is to make sure that we're sending the right N-th stuff (page1: first 10, page2: second 10)
    let info = await client.db('job_recruitment').collection("companies").find({
        $query: {},
        $orderby: { $natural: -1 }
    }).limit(page * 10).toArray()

    info.map(field => {
        delete field.recruiters
        delete field.cvs
    })
    return { code: 200, info: info }
}

async function getCompanies(client, company_ID) {
    let info = await client.db('job_recruitment').collection("companies").aggregate([{
        $match: {
            _id: ObjectId(company_ID)
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
            delete job.company_ID
            delete job.cvs
        })
        delete info[0].recruiters
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

async function putCompanies(client, company_ID, detail) {
    let info = await client.db('job_recruitment').collection("companies").find({ "_id": ObjectId(company_ID) }).limit(1).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Job ID does not exist" }
    } else {
        // eslint-disable-next-line no-unused-vars
        let result = await client.db('job_recruitment').collection('companies').updateOne({ "_id": ObjectId(company_ID) }, {
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

async function deleteCompanies(client, profile_ID, company_ID) {
    let info = await client.db('job_recruitment').collection('companies').find({
        "_id": ObjectId(company_ID)
    }).toArray()
    if (info.length == 0) {
        return { code: 400, message: "Company ID does not exits" }
    } else {
        let validate = info[0].recruiters.map(recruiter => {
            if (recruiter == profile_ID) {
                return true
            }
        })
        if (validate) {
            // eslint-disable-next-line no-unused-vars
            client.db('job_recruitment').collection('companies').deleteOne({
                "_id": ObjectId(company_ID)
            })
            // eslint-disable-next-line no-unused-vars
            client.db('job_recruitment').collection('jobs').deleteMany({
                "company_ID": ObjectId(company_ID)
            })
            return { code: 200, info: "Deleted" }
        } else {
            return { code: 400, message: "No permission to delete" }
        }
    }
}


module.exports = router;
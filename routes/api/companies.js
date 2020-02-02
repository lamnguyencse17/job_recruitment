const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const redis = require('redis')
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'
const redis_client = redis.createClient(17054, "redis-17054.c53.west-us.azure.cloud.redislabs.com");

redis_client.auth('zodiac3011', (err) => {
    if (err) {
        throw(err)
    }
})


router.use((req, res, next) => {
    if (req.method == "GET") {
        next()
    } else {
        if (req.role == 1) {
            return res.status(400).json({ message: "Not Authorized" })
        }
    }
    next()
})


router.get('/', (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result
            if (req.cached) {
                return res.status(200).json(JSON.parse(req.cached))
            }
            else {
                if (ObjectId.isValid(req.body.company_ID)) {
                    result = await getCompanies(client, req.body.company_ID)
                    if (!result.message) {
                        redis_client.setex(req.body.company_ID, 3600, JSON.stringify(result.info))
                    }
                }
                else {
                    result = await getAllCompanies(client, req.body.page)
                    redis_client.setex(req.body.page, 3600, JSON.stringify(result.info))
                }
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
            let result = await postCompanies(client, req.body)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})
router.put("/", async (req, res) => {
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            return res.status(400).json({ message: err })
        } else {
            let result = await putCompanies(client, req.body.company_ID, req.body.detail)
            return res.status(result.code).json(result.message ? result.message : result.info)
        }
    })
})

router.delete("/", async (req, res) => {
    let company_ID = req.body.company_ID;
    if (!req.user) {
        return res.status(401).send({ message: "No token provided." });
    }
    else {
        mongo.connect(dataPath, async (err, client) => {
            if (err) {
                console.log(err);
            } else {
                var db = await client.db('job_recruitment').collection('profiles');
                let info = await db.find({ "_id": ObjectId(req.user) }).toArray()
                if (info.length == 0) {
                    return res.status(400).json({ message: "Token verification failed" })
                }
                if (req.role == 1) {
                    return res.status(400).json({ message: "No permission to delete" })
                }
                else {
                    if (req.user == info[0]._id) {
                        mongo.connect(dataPath, async (err, client) => {
                            if (err) {
                                console.log(err);
                            } else {
                                let db = await client.db('job_recruitment').collection('companies');
                                info = await db.find({ "_id": ObjectId(company_ID) }).toArray()
                                if (info.length == 0) {
                                    return res.status(400).json({ message: "Company ID does not exits" })
                                } else {
                                    if (info[0].recruiters.map(recruiter => {
                                        recruiter == req.user
                                    })) {
                                        // eslint-disable-next-line no-unused-vars
                                        let removeCompany = await db.deleteOne({ _id: ObjectId(company_ID) })
                                        // eslint-disable-next-line no-unused-vars
                                        let removeJobs = await client.db('job_recruitment').collection('jobs').deleteMany({ company_ID: ObjectId(company_ID) })
                                        return res.status(200).json({ message: "Deleted" })
                                    } else {
                                        return res.status(400).json({ message: "No permission to delete" })
                                    }
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


module.exports = router;
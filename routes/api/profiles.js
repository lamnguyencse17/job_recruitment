const express = require('express')
const router = express.Router();
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const dataPath = 'mongodb+srv://zodiac3011:zodiac3011@jobrecruitment-5m9ay.azure.mongodb.net/test?retryWrites=true&w=majority'


router.get("/", (req, res) => { // access own or other profile
    // TODOS: permission to view
    let id = req.body.id
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            console.log(err);
        } else {
            var db = await client.db('job_recruitment').collection('profiles');
            let info = await db.find({ "_id": ObjectId(id) }).toArray() // It will return only once
            delete info[0].auth
            res.status(200).json(info[0])
        }
    })
})

router.post("/", (req, res) => {
    let id = req.body.id
    let name = req.body.name
    let dob = req.body.dob
    let email = req.body.email
    let date = new Date(Date.UTC(parseInt(dob.year), parseInt(dob.month), parseInt(dob.date), 0, 0, 0)) //not working somehow?
    mongo.connect(dataPath, async (err, client) => {
        if (err) {
            console.log(err);
        } else {
            var db = await client.db('job_recruitment').collection('profiles');
            let info = await db.find({ "_id": ObjectId(id) }).toArray() // It will return only once
            if (info.length == 0) {
                return res.status(400).json({ message: "ID not found" })
            } else {
                db.updateOne({ _id: ObjectId(id) }, {
                    $set: {
                        "name": name,
                        "email": email,
                        "dob": date,
                    }
                })
            }
            info = await db.find({ "_id": ObjectId(id) }).toArray()
            if (info[0].role == 1) {
                db.updateOne({ _id: ObjectId(id) }, {
                    $set: {
                        "cvs": []
                    }
                })
            }
            delete info[0].auth
            return res.status(200).json(info[0])
        }
    })
})
router.put("/", (req, res) => {
    let id = req.body.id
    let name = req.body.name
    let dob = req.body.dob
    let email = req.body.email
    if (dob) {
        var date = new Date(Date.UTC(parseInt(dob.year), parseInt(dob.month), parseInt(dob.date), 0, 0, 0)) //not working somehow?
    } mongo.connect(dataPath, async (err, client) => {
        if (err) {
            console.log(err);
        } else {
            var db = await client.db('job_recruitment').collection('profiles');
            let info = await db.find({ "_id": ObjectId(id) }).toArray() // It will return only once
            if (info.length == 0) {
                return res.status(400).json({ message: "ID not found" })
            } else {
                db.updateOne({ _id: ObjectId(id) }, {
                    $set: {
                        "name": name ? name : info[0].name,
                        "email": email ? email : info[0].email,
                        "dob": date ? date : info[0].dob
                    }
                })
            }
            info = await db.find({ "_id": ObjectId(id) }).toArray()
            delete info[0].auth
            return res.status(200).json(info[0])
        }
    })
})

router.delete("/", (req, res) => {
    // TODOS: Split to function
    if (!req.user){
        return res.status(401).send({ message: "No token provided." });
    } else {
        mongo.connect(dataPath, async (err, client) => {
            if (err) {
                console.log(err);
            } else {
                var db = await client.db('job_recruitment').collection('profiles');
                let info = await db.find({ "_id": ObjectId(req.body.id) }).toArray()
                if (info.length == 0) {
                    return res.status(400).json({ message: "Token verification failed" })
                }
                else {
                    if (req.user == info[0]._id) {
                        if (req.user == req.body.id) {
                            mongo.connect(dataPath, async (err, client) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var db = await client.db('job_recruitment').collection('profiles');
                                    // eslint-disable-next-line no-unused-vars
                                    let remove = await db.deleteOne({ _id: ObjectId(req.body.id) })
                                    return res.status(200).json({ message: "Deleted" })
                                }
                            })
                        } else {
                            return res.status(401).json({ message: "Mismatch between token, login, and database" })
                        }

                    }
                    else {
                        return res.status(400).json({ message: "Expired token" })
                    }
                }
            }
        })
    }
})

module.exports = router;
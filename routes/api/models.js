const express = require('express')
const ObjectId = require('mongodb').ObjectId
const router = express.Router();

router.use('/companies/', function (req, res, next) {
    let param = req.path.replace("/", "")
    if (!paramValidate(req, param)){
        return res.status(400).json({ message: `${param} ID was invalid` })
    }
    if (req.method == "GET") {
        next()
    } else {
        if (req.role == 1) {
            return res.status(400).json({ message: "Not Authorized" })
        }
        next()
    }
}, require('./models/companies'))

router.use('/cvs', function (req, res, next) {
    let param = req.path.replace("/", "")
    if (!paramValidate(req, param)){
        return res.status(400).json({ message: `${param} ID was invalid` })
    }
    if (!req.token) {
        return res.status(401).json({ message: "Token Failed" })
    }
    if ((req.role == 2 && req.method != "GET") || !req.user) {
        return res.status(400).json({ message: "Not Authorized" })
    } else {
        next()
    }
}, require('./models/cvs'))

router.use('/jobs', function(req, res, next){
    let param = req.path.replace("/", "")
    if (!paramValidate(req, param)){
        return res.status(400).json({ message: `${param} ID was invalid` })
    }
    next()
}, require('./models/jobs'))

router.use('/profiles', function(req, res, next){
    let param = req.path.replace("/", "")
    if (!paramValidate(req, param) && req.method == "GET"){
        return res.status(400).json({ message: `${param} ID was invalid` })
    }
    next()
}, require('./models/profiles'))

function paramValidate(req, param){
    if (req.method != "GET" && ObjectId.isValid(param)) {
        return false
    } else if (!(/^\d+$/.test(param) || ObjectId.isValid(param))) {
        return false
    }
    return true
}

module.exports = router;
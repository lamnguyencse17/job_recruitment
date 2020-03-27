const express = require('express')
const router = express.Router();

router.use('/apply', function(req, res, next){
    if (["GET", "PUT"].includes(req.method)) {
        return res.status(400).json({ message: "Not allowed" })
    } else {
        if (!req.user || req.role == 2) {
            return res.status(400).json({ message: "Not allowed" })
        } else {
            next()
        }
    }
    next()
}, require('./actions/apply'))

router.use('/uploads', function(req, res, next){
    if (["PUT", "POST"].includes(req.method)) {
        return res.status(401).json({ message: "Not allowed" })
    } else {
        if (req.user != req.params.profile_ID && req.role != 2) {
            return res.status(401).json({ message: "Not allowed" })
        }
    }
    next()
}, require('./actions/uploads'))

router.use('/invite', function(req, res, next){
    if (req.method != "POST" || req.role != 2) {
        return res.status(401).json({ message: "Not allowed" })
    }
    next()
}, require('./actions/invite'))

router.use('/subscribe', function(req, res, next){
    if (req.method != "POST" || req.role != 2) {
        return res.status(401).json({ message: "Not allowed" })
    }
    next()
}, require('./actions/subscribe'))

router.use('/search', function(req, res, next){
    if (req.method != "GET") {
        return res.status(401).json({ message: "Not allowed" })
    }
    next()
}, require('./actions/search'))

router.use('/suggest', function(req, res, next){
    if (req.method != "POST") {
        return res.status(401).json({ message: "Not allowed" })
    }
    next()
}, require('./actions/suggest'))

module.exports = router;
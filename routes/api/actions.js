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

module.exports = router;
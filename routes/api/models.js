const express = require('express')
const router = express.Router();

router.use('/companies', function(req, res, next){
    if (req.method == "GET") {
        next()
    } else {
        if (req.role == 1) {
            return res.status(400).json({ message: "Not Authorized" })
        }
        next()
    }
}, require('./models/companies'))

router.use('/cvs', function(req, res, next){
    if ((req.role == 2 && req.method != "GET") || !req.user) {
        return res.status(400).json({ message: "Not Authorized" })
    } else {
        next()
    }
}, require('./models/cvs'))

router.use('/jobs', require('./models/cvs'))

router.use('/profiles', require('./models/cvs'))

module.exports = router;
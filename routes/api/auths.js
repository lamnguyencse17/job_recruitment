const express = require('express')
const router = express.Router();

router.use('/login', function(req, res, next){
    if (req.method != "POST"){
        return res.status(400).json({message: "Request not allowed"})
    }
    next()
}, require('./auths/login'))

router.use('/register', function(req, res, next){
    if (req.method != "POST"){
        return res.status(400).json({message: "Request not allowed"})
    }
    next()
}, require('./auths/register'))

router.use('/logout', function(req, res, next){
    if (req.method != "POST"){
        return res.status(400).json({message: "Request not allowed"})
    }
    next()
}, require('./auths/logout'))

router.use('/verify', function(req, res, next){
    if (req.method != "GET"){
        return res.status(400).json({message: "Request not allowed"})
    }
    next()
}, require('./auths/verify'))

module.exports = router;
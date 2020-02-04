const express = require('express')
const router = express.Router();

router.use((req, res, next) => {
    if (req.method != "GET"){
        return res.status(401).json({message: "Not allowed"})
    } else {
        next()
    }
})

router.get('/', (req, res) => {
    // body: file path

})


module.exports = router;
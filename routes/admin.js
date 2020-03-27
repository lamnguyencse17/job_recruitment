const express = require('express')
const router = express.Router();

router.use('/auths', require('./admin/auths'))

module.exports = router;
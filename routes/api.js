const express = require('express')
const router = express.Router();

router.use('/actions', require('./api/actions'))
router.use('/auths', require('./api/auths'))
router.all('*', require('./api/models'))
module.exports = router;
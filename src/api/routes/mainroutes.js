const express = require('express')
const router = express.Router()
const controller = require('../controller/appcontroller')



router.post('/', controller.updateUtilityData)


module.exports = router
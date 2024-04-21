const express = require('express')
const router = express.Router()
const controller = require('../controller/appcontroller')



router.post('/', controller.updateUtilityData)
router.post('/createuser',controller.createUser)
router.post('/updateUser/:id', controller.updateUser)
router.get('/getusers', controller.getUsers)


module.exports = router
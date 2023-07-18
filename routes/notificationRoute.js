const express = require('express')
const router = express.Router()
const authController = require('./../controllers/authController')
const notificationController = require('./../controllers/notificationController')

router.use(authController.protect)

router.route('/').get(notificationController.pushNotification)


module.exports = router
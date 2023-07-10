const express = require('express')
const router = express.Router()
const authController = require('./../controllers/authController')

router.route('/signup').post(authController.signUp)
router.post('/login',authController.logIn)
router.post('/forgetPassword',authController.forgetPassword)
router.patch('/resetPassword/:token',authController.resetPassword)


module.exports = router
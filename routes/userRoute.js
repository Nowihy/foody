const express = require('express')
const router = express.Router()
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')

router.route('/signup').post(authController.signUp)
router.post('/login',authController.logIn)
router.post('/forgetPassword',authController.forgetPassword)
router.patch('/resetPassword/:token',authController.resetPassword)

router.use(authController.protect)

router.patch('/updateMyPassword',authController.updatePassword)
router.use(authController.protect)

router.patch('/updateMyPassword',authController.updatePassword)
router.patch('/updateMe',userController.updateMe)
router.delete('/deleteMe',userController.deleteMe)
router.get('/me',userController.getMe,userController.getOneUser)

module.exports = router
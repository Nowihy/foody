const express = require('express')
const router = express.Router({mergeParams:true})
const paymentController = require('./../controllers/paymentController')

router.get('/',paymentController.paymob)


module.exports = router
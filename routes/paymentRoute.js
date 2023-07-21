const express = require('express')
const router = express.Router({mergeParams:true})
const paymentController = require('./../controllers/paymentController')

router.post('/',paymentController.paymob)


module.exports = router
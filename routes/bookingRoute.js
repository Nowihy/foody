const express = require('express')
const router = express.Router()
const bookingController = require('./../controllers/bookingController')
const authController = require('./../controllers/authController')


router.use(authController.protect)

router.get('/checkout-session/:orderId',
bookingController.createSessionCheckout
)

router.route('/')
.get(bookingController.getAllBooking)
.post(bookingController.createBooking)

router.route('/:id')
.get(bookingController.getOneBooking)
.patch(bookingController.updateBooking)
.delete(bookingController.deleteBooking)

module.exports = router ;
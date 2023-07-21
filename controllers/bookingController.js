const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const catchAsync = require('./../utils/catchAsync')
const Booking = require('./../models/bookingModel')
const Order = require('./../models/orderModel')
const Factory = require('./../controllers/factoryHandler')


exports.createSessionCheckout = catchAsync(async(req,res,next)=>{
    const order = await Order.findById(req.params.orderId)
    const user = req.user 
    const price = order.totalPrice
    const session = await stripe.checkout.sessions.create({
        success_url: `${req.protocol}://${req.get('host')}/?order=${req.params.orderId}&user=${req.user.id}$price=${order.totalPrice}`,
        cancel_url: `${req.protocol}://${req.get('host')}/`,
        line_items: [{
            quantity: 1,
            price_data:{
                currency:'egp',
                unit_amount:order.totalPrice*100,
                product_data: {
                    name: `order1`,
                },
            }
        },
    ],
        mode: 'payment',
        client_reference_id: req.params.orderId,
        // customer: req.user.name,
        customer_email: req.user.email,
    });
    await Booking.create({order,user,price})
    res.status(200).json({
        statue:'success',
        session
    })
})


exports.createBooking = Factory.createOne(Booking)
exports.getOneBooking = Factory.getOne(Booking)
exports.getAllBooking = Factory.getAll(Booking)
exports.updateBooking = Factory.updateOne(Booking)
exports.deleteBooking = Factory.deleteOne(Booking)
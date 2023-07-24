const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const catchAsync = require('./../utils/catchAsync')
const Booking = require('./../models/bookingModel')
const Order = require('./../models/orderModel')
const Factory = require('./../controllers/factoryHandler')
const User = require('./../models/userModel')


exports.createSessionCheckout = catchAsync(async(req,res,next)=>{
    const order = await Order.findById(req.params.orderId)
    // const user = req.user 
    // const price = order.totalPrice
    const session = await stripe.checkout.sessions.create({
        success_url: `${req.protocol}://${req.get('host')}/`,
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
    // await Booking.create({order,user,price})
    res.status(200).json({
        statue:'success',
        session
    })
})

// exports.createBookingCheckout = catchAsync(async(req,res,next)=>{
//     //This is unsecure Url
//     const {order,user,price} = req.query
//     if(!order && !user && !price) return next()
//     await Booking.create({order,user,price})
//     // await Book.save()
//     //Get Home page from success Url
//     res.redirect(req.originalUrl.split('?')[0])
//     next()
// })

const createBookingCheckout = async session => {
    const order = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.display_items[0].amount / 100;
    await Booking.create({ order, user, price });
};

exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;
    try {
    event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
    );
    } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);
    res.status(200).json({ received: true });
};


exports.createBooking = Factory.createOne(Booking)
exports.getOneBooking = Factory.getOne(Booking)
exports.getAllBooking = Factory.getAll(Booking)
exports.updateBooking = Factory.updateOne(Booking)
exports.deleteBooking = Factory.deleteOne(Booking)
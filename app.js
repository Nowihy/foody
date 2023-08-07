const express = require('express') ;
const app = express()
const morgan = require('morgan')
const restaurantRoute = require('./routes/restaurantRoute')
const itemRoute = require('./routes/itemRoute')
const userRoute = require('./routes/userRoute')
const ratingRoute = require('./routes/ratingRoute')
const orderRoute = require('./routes/orderRoute')
const notificationRoute = require('./routes/notificationRoute')
const payRoute = require('./routes/paymentRoute')
const bookingRoute = require('./routes/bookingRoute')
const bookingController = require('./controllers/bookingController')
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const XSS = require('xss-clean')
const globalErrorHandler = require('./controllers/errorController')

app.use(helmet())  //put Helmet in the first of middlewares to protect whole middlewares

// Development logging
if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

const limiter = rateLimit({
    max:100,
    windowMs : 60*60*1000,
    message : 'too many requests from this IP,please try again later'
})
app.use('/api',limiter)

//it should be before express.json 
app.post('/webhook-checkout',
express.raw({type:'application/json'}),
bookingController.webhookCheckout)

app.use(express.json({limit:'10kb'}))

app.use(mongoSanitize())

//Data santization against XSS(agains HTML code)
app.use(XSS())

app.use(compression())

app.get('/',(req,res)=>{
    res.status(200).json({message:'hello everyoneُ❤️ ',app:'Foody'})
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString() ;
    next() ;
})


app.use('/api/v1/restaurants',restaurantRoute)
app.use('/api/v1/items',itemRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/ratings',ratingRoute)
app.use('/api/v1/orders',orderRoute)
app.use('/api/v1/notifications',notificationRoute)
app.use('/api/v1/pay',payRoute)
app.use('/api/v1/bookings',bookingRoute)

app.all('*',(req,res,next)=>{
    next(new AppError(`Can not find ${req.originalUrl} on this server !`, 404 ))
})

app.use(globalErrorHandler)

module.exports = app
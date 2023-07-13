const express = require('express') ;
const app = express()
const morgan = require('morgan')
const restaurantRoute = require('./routes/restaurantRoute')
const itemRoute = require('./routes/itemRoute')
const userRoute = require('./routes/userRoute')
const ratingRoute = require('./routes/ratingRoute')

const AppError = require('./utils/appError')

app.use(express.json())

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

app.all('*',(req,res,next)=>{
    next(new AppError(`Can not find ${req.originalUrl} on this server !`, 404 ))
})

module.exports = app
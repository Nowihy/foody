const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    order:{
        type:mongoose.Schema.ObjectId,
        ref:'Order',
        required:[true,'Order must belongs to a Booking']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Booking must belong to a user']
    },
    price:{
        type:Number,
        required:[true, 'Booking must have a price']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
})

bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'order',
        select:'items'
    })
    next()
})

const Booking = mongoose.model('Booking',bookingSchema)

module.exports = Booking ;
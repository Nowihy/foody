const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    review:{
        type:String,
    },
    rating:{
        type:Number,
        max:[5.0,'Max rating should be 5'],
        min:[1.0,'Min rating should be 1']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref:'restaurant',
        required:[true,'Rating must belongs to a Restaurant']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Rating must belong to a user']
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

const Rating = mongoose.model('Rating',reviewSchema)


module.exports = Rating
const mongoose = require('mongoose')
const Restaurant = require('./restaurantModel');


const itemSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Item must have name'],
        unique:[true,'Item name must be unique']
    },
    component:{
        type:[String],
        required:[true,'Item must have component']
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    price:{
        type:Number,
        required:[true,'A tour must have a price']
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                return val < this.validator
            },
            message:'Discount price ({Value}) should be below regular price'
        }
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        required:[true,'An Item must belong to restaurant'],
        ref:'restaurant'
    },

},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

itemSchema.index({price:1})

itemSchema.pre(/^find/,function(next){
    this.populate({
        path:'restaurant',
        select:'name'
    })
    next()
})

const Item = mongoose.model('item',itemSchema)

module.exports = Item
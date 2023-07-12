const mongoose = require('mongoose')
const slugify = require('slugify')
const item = require('./itemModel')

const restaurantSchema = mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required:true,
    },
    slug:String,
    image:{
        type:String,
        default:'default.jpg'
    },
    typeOfFood:{
        type:[String],
        required:[true,'A Restaurant must have type of Food'],
        enum:['pizza','burger','chicken','pasta','dessert','crepe',
        'sandwich','sushi','drinks','koshry','iftar']
    },
    ratingsAverage:{
        type:Number,
        required:true,
        default:3.0,
        min:[1.0,'A Resturant ratingsAverage must be above 1.0'],
        max:[5.0,'A Resturant ratingsAverage must be below 5.0'],
        set:val=>Math.round(val*10)/10
    },
    ratingsQuantity:{
        type:Number,
        required:true,
        default:0
    },
    secretResturant:{
        type:Boolean,
        default:false
    },
    summary:{
        type:String,
        required:true,
        trim:true
    },
    startLocation:{
        type:{
            type: String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    Locations:[
        {
            type:{
                type:String,
                default:'point',
                enum:['point']
            },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    // items:[{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'Item'
    // }]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


//to show items in restaurant schema 
restaurantSchema.virtual('items',{
    ref:'item',
    foreignField:'restaurant',
    localField:'_id'
})

restaurantSchema.pre('save',function(next){
    this.slug =slugify(this.name,{lower:true})
    next()
})

restaurantSchema.pre(/^find/,function(next){
    this.find({secretResturant:{$ne:true}})
    this.start = Date.now()
    next()
})

//middle ware is triggered many times
// restaurantSchema.pre(/^find/,function(next){
//     console.log('Middleware triggered');
//     this.populate({
//         path:'items',
//         select:'-__v'
//     })
//     next()
// })

// restaurantSchema.set('toJSON', { virtuals: true });

//كل مطعم يبقي ليه ادمن بالتالي الادمن ده كل ميضيف ايتيم تتضاف تلقائي للمطعم ده

const Restaurant = mongoose.model('restaurant',restaurantSchema)

module.exports=Restaurant
const mongoose = require('mongoose')
const Restaurant = require('./restaurantModel')

const ratingSchema = mongoose.Schema({
    review:{
        type:String,
    },
    rating:{
        type:Number,
        required:true ,
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
        required:[true,'rating must belong to restaurant']
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

ratingSchema.index({restaurant:1,user:1},{unique:true})

// ratingSchema.pre(/^find/,function(next){
//     this.populate({
//         path:'restaurant',
//         select:'name'
//     }).populate({
//         path:'user',
//         select:'name photo'
//     })
//     next()
// })

ratingSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
    })
    next()
})

ratingSchema.statics.calcAverageRatings= async function(resataurantId){
    const stats = await this.aggregate([
        {
            $match:{restaurant:resataurantId}
        },
        {
            $group:{
                _id:'$restaurant',
                numRatings:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])
    if(stats.length>0){
        await Restaurant.findByIdAndUpdate(resataurantId,{
        ratingsQuantity:stats[0].numRatings,
        ratingsAverage:stats[0].avgRating
    })
    }else{
        await Restaurant.findByIdAndUpdate(resataurantId,{
        ratingsQuantity:0,
        ratingsAverage:4.5
    })
    }
}

ratingSchema.post('save',function(){
    this.constructor.calcAverageRatings(this.restaurant)
})

// ratingSchema.pre(/^findOneAnd/, async function (next) {
//     this.r = await this.findOne();
//     next();
// });

// ratingSchema.post(/^findOneAnd/, async function () {
//     // await this.findOne()--> doesn't work here, the query has already been executed
//     await this.r.constructor.calcAverageRatings(this.r.restaurant);
// });

const Rating = mongoose.model('Rating',ratingSchema)


module.exports = Rating
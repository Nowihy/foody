const Rating = require('./../models/ratingModel')
const Factory = require('./factoryHandler')

exports.setRestaurantandUserIDs=(req,res,next)=>{
    //allow nested route 
    if(!req.body.user) req.body.user = req.user.id
    if(!req.body.restaurant) req.body.restaurant = req.params.restaurantId
    next()
}

exports.getAllRatings = Factory.getAll(Rating)
exports.updateRating = Factory.updateOne(Rating)
exports.createRating = Factory.createOne(Rating)
exports.deleteRating = Factory.deleteOne(Rating)
exports.getOneRating = Factory.getOne(Rating)
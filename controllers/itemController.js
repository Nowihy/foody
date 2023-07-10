const Item = require('../models/itemModel')
const AppError = require('../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const Factory = require('./factoryHandler')

exports.setRestaurantAndUserIDs=(req,res,next)=>{
    //allow nested route 
    // if(!req.body.user) req.body.user = req.user.id
    if(!req.body.restaurant) req.body.restaurant = req.params.resataurantId
    console.log(req.params.restaurantId)
    console.log(req.body.restaurant)
    next()
}

exports.createItem = Factory.createOne(Item)
exports.deleteItem = Factory.deleteOne(Item)
exports.updateItem = Factory.updateOne(Item)
exports.getAllItems = Factory.getAll(Item)
exports.getOneItem = Factory.getOne(Item)


// exports.createItem=catchAsync( async (req,res,next)=>{ 
//     if(!req.body.user) req.body.user = req.user.id
//     if(!req.body.restaurant) req.body.restaurant = req.params.resataurantId
//     const item = await Item.create(req.body)
//     res.status(201).json({
//         statue:'success',
//         data:{
//             data:item
//         }
//     })
// })
const Restaurant = require('../models/restaurantModel')
const AppError = require('../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const Factory = require('./factoryHandler')
const jwt = require('jsonwebtoken')


// exports.getOneRestaurant =catchAsync(async(req,res,next)=>{
//     const restaurant = await Restaurant.findById(req.params.id)
//     if(!restaurant){
//         return next(new AppError('There is no restaurant with this ID',404))
//     }
//     res.status(200).json({
//         statue:'success',
//         data: restaurant
//     })
// })

exports.createRestaurant = Factory.createOne(Restaurant)
exports.deleteRestaurant = Factory.deleteOne(Restaurant)
exports.updateRestaurant = Factory.updateOne(Restaurant)
exports.getAllRestaurants = Factory.getAll(Restaurant)
exports.getOneRestaurant = Factory.getOne(Restaurant,{path:'items'})

// function generateToken(payload) {
// const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
//     return token;
// }


// exports.authRestaurant = (req,res,next)=>{
//     const { restaurantId } = req.params.id;
//     // Generate JWT with restaurant ID as claim
//     const token = generateToken({ restaurantId });
//     res.json({ token });
// }

// exports.protectRestaurant = catchAsync(async(req,res,next)=>{
//     //1) get user token
//     let token ;
//     if(
//         req.headers.authorization && 
//         req.headers.authorization.startsWith('Bearer')
//     ){
//         token = req.headers.authorization.split(' ')[1]
//     }
//     if(!token){
//         return next(new AppError('You do not have access to do this',401))
//     }
//     //2) verification token
//     const decoded =await promisify(jwt.verify)(token,process.env.JWT_SECRET)
//     // req.restaurantId = decoded.restaurantId;
//     //3) check if user still exist
//     const freshRestaurant = await Restaurant.findById(decoded.id)
//     if(!freshRestaurant){
//         return next(new AppError('The user belong to this token does no longer exist',401))
//     }
//     req.user = freshRestaurant ;
//     next()
// })
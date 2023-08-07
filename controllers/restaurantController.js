const Restaurant = require('../models/restaurantModel')
const AppError = require('../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const Factory = require('./factoryHandler')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const sharp = require('sharp')

const multerStorage = multer.memoryStorage()

const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new AppError('It is not an image, please upload an image',400),false)
    }
}

const upload = multer({
    storage:multerStorage,
    fileFilter: multerFilter
})

exports.uploadRestaurantPhoto = upload.single('image')

exports.resizeRestaurantPhoto = catchAsync(async(req,res,next)=>{
    if(!req.file) return next()
    req.file.filename = `restaurant-${req.params.id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/restaurants/${req.file.filename}`)
    next()
})


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

exports.getRestaurantWithin = catchAsync(async(req,res,next)=>{
    const {distance, latlng , unit} = req.params
    const [lat,lng] = latlng.split(',')
    const radius = unit ==='mi' ? distance/3963.2 : distance/6378.1 
    if(!lat||!lng) {
        next(new AppError(
            'Please provide latitutr and longitude on the format of lat,lng..'
        ))
    }
    const restaurants = await Restaurant.find({
        startLocation:{ $geoWithin: { $centerSphere: [[lng,lat],radius] }}
    })
    res.status(200).json({
        statue : 'success',
        results: restaurants.length,
        data:{data:restaurants}
    })
})

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng) {
    next(
        new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400
        )
    );
    }
    const distances = await Restaurant.aggregate([
    {
        $geoNear: {
        near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1],
        },
        spherical: true,
          distanceField: 'distance', // contains calculated distance
          distanceMultiplier: 0.001, // m--> k.m, m--> mi
        },
    },
    {
        $project: {
        distance: 1,
          name: 1, // only get these fields
        },
    },
    ]);
    res.status(200).json({
    status: 'success',
    data: {
        data: distances,
    },
    });
});


exports.createRestaurant = Factory.createOne(Restaurant)
exports.deleteRestaurant = Factory.deleteOne(Restaurant)
exports.updateRestaurant = Factory.updateOne(Restaurant)
exports.getAllRestaurants = Factory.getAll(Restaurant)
const popOptions = [
    { path: 'items', select: 'name component photo price -restaurant' },
    { path: 'ratings', select: 'rating user -restaurant' }
];
exports.getOneRestaurant = Factory.getOne(Restaurant,popOptions)
